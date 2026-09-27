/**
 * PRATYAKSHA LangGraph StateGraph Autonomous Browser Engine
 * ISRO Problem Statement 26171
 *
 * Perception → Reason → Execute → Observe loop.
 * Powered by Mistral AI (codestral-latest) with Gemini fallback.
 * Includes: multi-tool execution, retry-on-error, tab sync, conversation memory.
 */

import {
  BROWSER_TOOL_DECLARATIONS,
  MISTRAL_TOOL_DECLARATIONS,
  executeBrowserTool
} from './browser-tools.js';

// ─────────────────────────────────────────────────────────
// DOM table formatter — what the model reads each step
// ─────────────────────────────────────────────────────────
function buildDOMTable(elements = [], max = 70) {
  if (!elements.length) return 'No interactive elements detected.';

  const header = '[ID]  TAG            TYPE/ROLE     LABEL / PLACEHOLDER / TEXT                     VALUE?';
  const sep    = '─'.repeat(header.length);

  const rows = elements.slice(0, max).map(el => {
    const id    = String(el.id || '').padStart(4, ' ');
    const tag   = `<${el.tag || '?'}>`.padEnd(14, ' ');
    const type  = (el.type || '').padEnd(13, ' ');
    const label = (el.label || el.text || '').replace(/\s+/g, ' ').slice(0, 46).padEnd(46, ' ');
    const val   = el.value ? `"${el.value.slice(0, 20)}"` : '';
    return `[${id}]  ${tag} ${type} ${label} ${val}`;
  });

  return [header, sep, ...rows].join('\n');
}

// ─────────────────────────────────────────────────────────
// System prompt factory
// ─────────────────────────────────────────────────────────
function buildSystemPrompt(pageContext, stepCount, maxSteps) {
  const table = buildDOMTable(pageContext.elements);

  return `You are PRATYAKSHA (प्रत्यक्ष) — a world-class autonomous browser agent built for ISRO (PS-26171).
You operate a real browser tab. You perceive the current page and call tools to complete the user's goal.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CURRENT PAGE  (Step ${stepCount}/${maxSteps})
URL  : ${pageContext.url || 'unknown'}
Title: ${pageContext.title || 'unknown'}

INTERACTIVE ELEMENTS (sorted by relevance, inputs first):
${table}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STRATEGY RULES — read carefully before every action:

🔴 RULE 1 – PRECONDITIONS BEFORE TYPING
  If the user wants to send an email / message / chat, and the elements table does NOT show
  a recipient field or compose area, you MUST click the trigger button first:
  "Compose", "New Email", "New Message", "Write", "+", etc.
  Only then, in the NEXT step, type into the revealed fields.

🔴 RULE 2 – TARGET BY ID, ALWAYS
  Every click_element and type_into_element call MUST include "target_id": <number>.
  The [ID] column in the table is the exact number to use.
  This is the only guaranteed-accurate targeting method.

🔴 RULE 3 – NEVER SURRENDER EARLY
  Do NOT call finish_task(success:false) unless you have exhausted:
  (a) clicking trigger buttons, (b) scrolling, (c) waiting for modals to load.
  Minimum 3 steps before any negative finish.

🔴 RULE 4 – ONE CLICK PER STEP (for navigation/modal triggers)
  After clicking a button that opens a new page or modal, return ONLY that one click.
  Do NOT batch type_into_element calls in the same step — the fields don't exist yet.

🟡 RULE 5 – MULTI-FIELD FILL IN ONE STEP (only after modal is confirmed open)
  Once a form / compose modal is already visible (fields are in the table), you MAY
  return multiple type_into_element calls in a single step to fill all fields efficiently.

🟡 RULE 6 – READ PAGE WITH get_page_text
  Use get_page_text to verify outcomes: confirm navigation, read search results,
  extract data the user asked for. Call it after navigation or before finish_task.

🟢 RULE 7 – FINISH CORRECTLY
  Call finish_task(success:true) with a specific summary once the objective is fully met.
  Include key details: URL visited, text found, form submitted, etc.`;
}

// ─────────────────────────────────────────────────────────
// LangGraphAgent
// ─────────────────────────────────────────────────────────
export class LangGraphAgent {
  constructor(options = {}) {
    this.provider  = options.provider  || 'mistral';
    this.apiKey    = (options.apiKey   || '').trim();
    this.model     = options.model     || (this.provider === 'mistral' ? 'codestral-latest' : 'gemini-3.8-flash');
    this.vault     = options.vault     || null;
    this.maxSteps  = options.maxSteps  || 20;
    this.onEvent   = options.onEvent   || (() => {});
    this.isCancelled = false;

    this.state = {
      task: '', sanitizedTask: '', messages: [],
      activeTab: null, domElements: [],
      stepCount: 0, status: 'IDLE', finalSummary: null
    };
  }

  cancel() {
    this.isCancelled = true;
    this.state.status = 'CANCELLED';
    this._emit('CANCELLED', { message: 'Agent cancelled by user.' });
  }

  _emit(type, payload = {}) {
    this.onEvent({ type, step: this.state.stepCount, timestamp: new Date().toLocaleTimeString(), ...payload });
  }

  // ───────────────────────────────────────────────────────
  // Main run loop
  // ───────────────────────────────────────────────────────
  async run(userTask, activeTab) {
    this.isCancelled = false;
    this.state = {
      task: userTask, sanitizedTask: '', messages: [],
      activeTab, domElements: [],
      stepCount: 0, status: 'RUNNING', finalSummary: null
    };

    // 1. Privacy sanitize
    const { sanitizedText, detected } = this.vault?.anonymize
      ? this.vault.anonymize(userTask)
      : { sanitizedText: userTask, detected: [] };

    this.state.sanitizedTask = sanitizedText;
    this._emit('TASK_START', { task: userTask, sanitized: sanitizedText, detectedCount: detected.length, provider: this.provider, model: this.model });
    if (detected.length) this._emit('PII_MASKED', { detected });

    // Seed conversation
    this._addUserMessage(`User Objective: ${sanitizedText}`);

    // 2. Main loop
    while (!this.isCancelled && this.state.stepCount < this.maxSteps) {
      this.state.stepCount++;

      // Perceive
      this._emit('STATE_CHANGE', { state: 'PERCEIVING', label: `Step ${this.state.stepCount}: Scanning DOM…` });
      const pageCtx = await this._perceive();
      this.state.domElements = pageCtx.elements || [];

      // Reason
      this._emit('STATE_CHANGE', { state: 'REASONING', label: `Step ${this.state.stepCount}: Reasoning (${this.model})…` });
      let decision;
      try {
        decision = this.provider === 'mistral'
          ? await this._reasonMistral(pageCtx)
          : await this._reasonGemini(pageCtx);
      } catch (err) {
        this._emit('TOOL_ERROR', { error: `Reasoning failed: ${err.message}` });
        await this._sleep(2000);
        continue;
      }

      if (this.isCancelled) break;
      if (decision.thought) this._emit('THOUGHT', { thought: decision.thought });

      // Normalise to array
      let actions = decision.actions || [];
      if (!actions.length) {
        actions = [{ toolName: 'wait_seconds', args: { seconds: 2, reason: 'No action decided' }, callId: this._id() }];
      }

      // finish_task short-circuit
      const finish = actions.find(a => a.toolName === 'finish_task');
      if (finish) {
        const summary = finish.args?.summary || 'Done.';
        this.state.status = 'COMPLETED';
        this.state.finalSummary = summary;
        this._emit('TASK_COMPLETE', { summary, success: finish.args?.success !== false, steps: this.state.stepCount });
        return { success: finish.args?.success !== false, summary, steps: this.state.stepCount };
      }

      // Execute actions
      this._emit('STATE_CHANGE', { state: 'ACTING', label: `Step ${this.state.stepCount}: Executing ${actions.map(a => a.toolName).join(' + ')}…` });

      for (const action of actions) {
        if (this.isCancelled) break;

        this._emit('TOOL_CALL', { toolName: action.toolName, args: action.args });

        let observation = '';
        let toolError   = false;

        try {
          // Re-sync tab reference before every action (may have navigated)
          this.state.activeTab = await chrome.tabs.get(this.state.activeTab.id);
        } catch (_) { /* tab closed / replaced, carry on */ }

        try {
          const result = await executeBrowserTool(
            action.toolName, action.args,
            this.state.activeTab, this.vault
          );
          observation = result.observation || 'Done.';

          // switch_tab returns a newTabId — sync the agent's active tab reference
          if (result.newTabId) {
            try {
              this.state.activeTab = await chrome.tabs.get(result.newTabId);
            } catch (_) {}
          }

          if (result.isFinished) {
            this.state.status = 'COMPLETED';
            this.state.finalSummary = result.summary;
            this._emit('TASK_COMPLETE', { summary: result.summary, success: result.success !== false, steps: this.state.stepCount });
            return { success: result.success !== false, summary: result.summary, steps: this.state.stepCount };
          }
        } catch (err) {
          observation = `ERROR: ${err.message}`;
          toolError   = true;
          this._emit('TOOL_ERROR', { error: err.message });
        }

        action.observation = observation;
        this._emit('OBSERVATION', { observation });

        // After a click that may open a modal — always re-perceive before continuing
        if (!toolError && action.toolName === 'click_element' && actions.length > 1) {
          // Wait extra for modal/animation
          await this._sleep(700);
          // Pause remaining batch so next step re-scans DOM with fresh IDs
          this._recordTurn([action]);
          break; // restart loop with fresh perception
        }

        if (actions.length > 1) await this._sleep(200);
      }

      // Record full turn (unless we broke early above — already recorded)
      const unrecorded = actions.filter(a => a.observation !== undefined && !a._recorded);
      if (unrecorded.length) this._recordTurn(unrecorded);

      await this._sleep(350);
    }

    if (this.isCancelled) return { success: false, summary: 'Cancelled.', steps: this.state.stepCount };

    const budgetMsg = `Reached step limit (${this.maxSteps}).`;
    this._emit('BUDGET_REACHED', { summary: budgetMsg });
    return { success: false, summary: budgetMsg, steps: this.state.stepCount };
  }

  // ───────────────────────────────────────────────────────
  // Perceive DOM
  // ───────────────────────────────────────────────────────
  async _perceive() {
    const tabId = this.state.activeTab?.id;
    if (!tabId) return { url: '', title: '', elements: [] };

    // Re-sync tab object
    try { this.state.activeTab = await chrome.tabs.get(tabId); } catch (_) {}

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const resp = await new Promise((resolve, reject) => {
          const timer = setTimeout(() => reject(new Error('GET_PAGE_CONTEXT timeout')), 5000);
          chrome.tabs.sendMessage(tabId, { type: 'GET_PAGE_CONTEXT' }, r => {
            clearTimeout(timer);
            chrome.runtime.lastError ? reject(new Error(chrome.runtime.lastError.message)) : resolve(r);
          });
        });
        if (resp?.elements) return resp;
      } catch (_) {
        // Inject content script and retry
        try {
          await chrome.scripting.insertCSS({ target: { tabId }, files: ['content/highlighter.css'] });
          await chrome.scripting.executeScript({ target: { tabId }, files: ['content/dom-actions.js', 'content/content-main.js'] });
          await this._sleep(400);
        } catch (e2) { console.warn('[PRATYAKSHA] Injection failed:', e2.message); }
      }
    }

    return { url: this.state.activeTab?.url || '', title: this.state.activeTab?.title || '', elements: [] };
  }

  // ───────────────────────────────────────────────────────
  // Mistral reasoning
  // ───────────────────────────────────────────────────────
  async _reasonMistral(pageCtx) {
    if (!this.apiKey) throw new Error('Mistral API key missing.');

    const systemPrompt = buildSystemPrompt(pageCtx, this.state.stepCount, this.maxSteps);
    const messages = [{ role: 'system', content: systemPrompt }, ...this.state.messages];

    let model = this.model || 'codestral-latest';

    const call = async (m) => fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.apiKey}` },
      body: JSON.stringify({ model: m, messages, tools: MISTRAL_TOOL_DECLARATIONS, tool_choice: 'auto', temperature: 0.1 })
    });

    let resp = await call(model);

    // Tier fallback: mistral-large-latest → codestral-latest
    if (resp.status === 403 && model !== 'codestral-latest') {
      this._emit('STATE_CHANGE', { state: 'REASONING', label: 'Tier limit — switching to codestral-latest…' });
      model = 'codestral-latest';
      resp  = await call(model);
    }

    // Retry on 429 / 503
    if (resp.status === 429 || resp.status === 503) {
      await this._sleep(2000);
      resp = await call(model);
    }

    if (!resp.ok) {
      let msg = `HTTP ${resp.status}`;
      try { const j = await resp.json(); msg = j?.message || msg; } catch (_) {}
      throw new Error(`Mistral: ${msg}`);
    }

    const data   = await resp.json();
    const choice = data.choices?.[0]?.message;
    const calls  = choice?.tool_calls || [];
    const thought = choice?.content || '';

    if (calls.length) {
      return {
        actions: calls.map(tc => ({
          toolName: tc.function.name,
          args:     this._parseArgs(tc.function.arguments),
          callId:   tc.id || this._id()
        })),
        thought
      };
    }

    return this._fallbackAction(thought);
  }

  // ───────────────────────────────────────────────────────
  // Gemini reasoning
  // ───────────────────────────────────────────────────────
  async _reasonGemini(pageCtx) {
    if (!this.apiKey) throw new Error('Gemini API key missing.');

    let model = this.model || 'gemini-3.8-flash';
    if (/gemini-2\.0/.test(model)) model = 'gemini-3.8-flash';

    const systemPrompt = buildSystemPrompt(pageCtx, this.state.stepCount, this.maxSteps);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;

    let resp;
    for (let i = 0; i < 3; i++) {
      resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: this.state.messages,
          tools: [{ functionDeclarations: BROWSER_TOOL_DECLARATIONS }],
          generationConfig: { temperature: 0.1 }
        })
      });
      if (resp.ok || (resp.status !== 429 && resp.status !== 503)) break;
      await this._sleep((i + 1) * 1500);
    }

    if (!resp.ok) {
      let msg = `HTTP ${resp.status}`;
      try { const j = await resp.json(); msg = j?.error?.message || msg; } catch (_) {}
      throw new Error(`Gemini: ${msg}`);
    }

    const data    = await resp.json();
    const parts   = data.candidates?.[0]?.content?.parts || [];
    const fnParts = parts.filter(p => p.functionCall);
    const thought = parts.find(p => p.text)?.text || '';

    if (fnParts.length) {
      return {
        actions: fnParts.map(p => ({
          toolName: p.functionCall.name,
          args:     this._coerceIds(p.functionCall.args || {}),
          callId:   this._id()
        })),
        thought
      };
    }

    return this._fallbackAction(thought);
  }

  // ───────────────────────────────────────────────────────
  // Conversation memory helpers
  // ───────────────────────────────────────────────────────
  _addUserMessage(text) {
    if (this.provider === 'mistral') {
      this.state.messages.push({ role: 'user', content: text });
    } else {
      this.state.messages.push({ role: 'user', parts: [{ text }] });
    }
  }

  _recordTurn(actions) {
    actions.forEach(a => { a._recorded = true; });

    if (this.provider === 'mistral') {
      // Assistant message with all tool_calls
      this.state.messages.push({
        role: 'assistant',
        content: null,
        tool_calls: actions.map(a => ({
          id:       a.callId,
          type:     'function',
          function: { name: a.toolName, arguments: JSON.stringify(a.args) }
        }))
      });
      // One tool-result message per call (must match ID order)
      for (const a of actions) {
        this.state.messages.push({
          role:         'tool',
          tool_call_id: a.callId,
          name:         a.toolName,
          content:      a.observation || 'Done.'
        });
      }
    } else {
      // Gemini format
      this.state.messages.push({
        role:  'model',
        parts: actions.map(a => ({ functionCall: { name: a.toolName, args: a.args } }))
      });
      for (const a of actions) {
        this.state.messages.push({
          role:  'function',
          parts: [{ functionResponse: { name: a.toolName, response: { output: a.observation || 'Done.' } } }]
        });
      }
    }
  }

  // ───────────────────────────────────────────────────────
  // Utilities
  // ───────────────────────────────────────────────────────
  _parseArgs(raw) {
    try {
      const args = typeof raw === 'string' ? JSON.parse(raw) : (raw || {});
      return this._coerceIds(args);
    } catch (_) { return {}; }
  }

  _coerceIds(args) {
    if (args.target_id !== undefined && typeof args.target_id !== 'number') {
      args.target_id = parseInt(String(args.target_id), 10);
    }
    return args;
  }

  _fallbackAction(thought) {
    // If the model text says task is done
    if (thought && /\b(done|complete|finished|success|accomplished)\b/i.test(thought) && thought.length > 20) {
      return {
        actions: [{ toolName: 'finish_task', args: { summary: thought.slice(0, 300), success: true }, callId: this._id() }],
        thought
      };
    }
    return {
      actions: [{ toolName: 'wait_seconds', args: { seconds: 2, reason: 'No tool call in response' }, callId: this._id() }],
      thought: thought || 'Waiting…'
    };
  }

  _id() { return `call_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`; }
  _sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
}
