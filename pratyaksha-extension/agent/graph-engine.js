/**
 * PRATYAKSHA LangGraph StateGraph Autonomous Browser Engine
 * ISRO Problem Statement 26171
 *
 * Perception → Reason → Execute → Observe loop.
 * Powered by Mistral AI (codestral-latest / mistral-large) with Gemini fallback.
 * Includes: anti-hallucination verification gate, canonical service routing,
 * multi-tool execution, retry-on-error, tab sync, conversation memory.
 */

import {
  BROWSER_TOOL_DECLARATIONS,
  MISTRAL_TOOL_DECLARATIONS,
  executeBrowserTool
} from './browser-tools.js';

// ─────────────────────────────────────────────────────────
// Canonical Web Services Directory
// ─────────────────────────────────────────────────────────
export const CANONICAL_SERVICES = [
  { pattern: /\bgmail\b/i, url: 'https://mail.google.com', name: 'Gmail', hostMatch: /mail\.google\.com/i },
  { pattern: /\byoutube\b/i, url: 'https://www.youtube.com', name: 'YouTube', hostMatch: /youtube\.com/i },
  { pattern: /\bgithub\b/i, url: 'https://github.com', name: 'GitHub', hostMatch: /github\.com/i },
  { pattern: /\b(cricbuzz|cricket score)\b/i, url: 'https://www.cricbuzz.com', name: 'Cricbuzz', hostMatch: /cricbuzz\.com/i },
  { pattern: /\bwikipedia\b/i, url: 'https://www.wikipedia.org', name: 'Wikipedia', hostMatch: /wikipedia\.org/i },
  { pattern: /\b(twitter|x\.com)\b/i, url: 'https://x.com', name: 'Twitter/X', hostMatch: /x\.com|twitter\.com/i },
  { pattern: /\breddit\b/i, url: 'https://www.reddit.com', name: 'Reddit', hostMatch: /reddit\.com/i },
  { pattern: /\b(google search|google\.com)\b/i, url: 'https://www.google.com', name: 'Google', hostMatch: /google\.com/i }
];

export function detectTargetService(task = '') {
  for (const s of CANONICAL_SERVICES) {
    if (s.pattern.test(task)) return s;
  }
  const urlMatch = task.match(/https?:\/\/[^\s]+/i);
  if (urlMatch) {
    try {
      const u = new URL(urlMatch[0]);
      return { pattern: null, url: u.href, name: u.hostname, hostMatch: new RegExp(u.hostname.replace(/\./g, '\\.'), 'i') };
    } catch (_) {}
  }
  return null;
}

// ─────────────────────────────────────────────────────────
// DOM table formatter — what the model reads each step
// ─────────────────────────────────────────────────────────
function buildDOMTable(elements = [], max = 75) {
  if (!elements.length) return 'No interactive elements detected.';

  const header = '[ID]  TAG            TYPE/ROLE     LABEL / PLACEHOLDER / TEXT                     VALUE?';
  const sep    = '─'.repeat(header.length);

  // Prioritize actionable inputs, textboxes, and buttons
  const sorted = [...elements].sort((a, b) => {
    const isInputA = /input|textarea|textbox|combobox/i.test(`${a.tag} ${a.type} ${a.role}`);
    const isInputB = /input|textarea|textbox|combobox/i.test(`${b.tag} ${b.type} ${b.role}`);
    if (isInputA && !isInputB) return -1;
    if (!isInputA && isInputB) return 1;
    return 0;
  });

  const rows = sorted.slice(0, max).map(el => {
    const id    = String(el.id || '').padStart(4, ' ');
    const tag   = `<${el.tag || '?'}>`.padEnd(14, ' ');
    const type  = (el.type || el.role || '').padEnd(13, ' ');
    const label = (el.label || el.text || '').replace(/\s+/g, ' ').slice(0, 46).padEnd(46, ' ');
    const val   = el.value ? `"${el.value.slice(0, 20)}"` : '';
    return `[${id}]  ${tag} ${type} ${label} ${val}`;
  });

  return [header, sep, ...rows].join('\n');
}

// ─────────────────────────────────────────────────────────
// System prompt factory
// ─────────────────────────────────────────────────────────
function buildSystemPrompt(pageContext, stepCount, maxSteps, targetService = null, taskObjective = '') {
  const table = buildDOMTable(pageContext.elements);
  const currentUrl = pageContext.url || '';
  const isWrongDomain = targetService && !targetService.hostMatch.test(currentUrl);

  let navDirective = '';
  if (isWrongDomain) {
    navDirective = `
🚨 CRITICAL DOMAIN MISMATCH WARNING:
The user objective requires "${targetService.name}" (${targetService.url}), but the browser is currently at "${currentUrl}".
You CANNOT complete the user goal on this page.
YOUR VERY FIRST ACTION RIGHT NOW MUST BE:
open_url({ "url": "${targetService.url}", "rationale": "Navigating to ${targetService.name}" })
DO NOT click random buttons or links on the current page! Navigate to ${targetService.url} immediately!
`;
  }

  return `You are PRATYAKSHA (प्रत्यक्ष) — a world-class autonomous browser agent built for ISRO (PS-26171).
You operate a real browser tab. You perceive the current page and call tools to complete the user's goal.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CURRENT OBJECTIVE: ${taskObjective || 'Complete user request'}
CURRENT PAGE  (Step ${stepCount}/${maxSteps})
URL  : ${currentUrl || 'unknown'}
Title: ${pageContext.title || 'unknown'}

INTERACTIVE ELEMENTS (sorted by relevance, inputs first):
${table}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${navDirective}
STRATEGY RULES — read carefully before every action:

🔴 RULE 0 – NAVIGATION FIRST
  If the user's task mentions a specific website, service, or URL (e.g. Gmail, YouTube, Google, Cricbuzz, GitHub)
  and the CURRENT PAGE does NOT match that destination:
  You MUST call open_url({ "url": "..." }) as your VERY FIRST action.
  Never interact with an unrelated page when a specific service was requested.

🔴 RULE 1 – EMAIL & MESSAGING WORKFLOW (e.g. Gmail)
  If the user wants to send an email or message:
  1. Verify you are on the service URL (e.g. https://mail.google.com). If not, open_url first.
  2. If the compose dialog is not open (no recipient field in the elements table),
     click the "Compose" / "New Email" / "+" button first.
  3. Once the compose dialog is open:
     - Use type_into_element to type the recipient into the recipient field (label/placeholder: "To", "Recipients").
     - Use type_into_element to type into the Subject field.
     - Use type_into_element to type into the Message Body field (contenteditable or textbox).
     - Use click_element to click the "Send" button.
  Only after the Send button is clicked may you call finish_task.

🔴 RULE 2 – TARGET BY ID, ALWAYS
  Every click_element and type_into_element call MUST include "target_id": <number>.
  The [ID] column in the table is the exact number to use.
  This is the only guaranteed-accurate targeting method.

🔴 RULE 3 – MANDATORY TOOL CALLS (NEVER REPLY WITH JUST TEXT)
  You MUST invoke at least one tool on EVERY single turn until the goal is verified.
  Never return conversational text without calling an actionable tool. If you need to wait, call wait_seconds or wait_for.

🔴 RULE 4 – ZERO HALLUCINATION (VERIFIED COMPLETION ONLY)
  Never call finish_task(success:true) or output text claiming you finished the task unless you have
  ACTUALLY executed the necessary steps on the real target website.
  For email sending: you MUST have navigated to Gmail, typed into the recipient and body fields,
  and clicked Send. Saying "I sent an email" without performing these actions will be mechanically rejected.

🔴 RULE 5 – ONE CLICK PER STEP (for navigation/modal triggers)
  After clicking a button that opens a new page or modal, return ONLY that one click.
  Do NOT batch type_into_element calls in the same step — the fields don't exist yet.

🔴 RULE 6 – MULTI-FIELD FILL WHEN MODAL IS OPEN
  Once compose/form fields are present in the table, you may batch multiple
  type_into_element calls in a single step to fill all fields cleanly.

🔴 RULE 7 – FINISH CORRECTLY
  Call finish_task(success:true) ONLY AFTER the actions (e.g. Send click) have actually succeeded.
  Include key details: URL visited, fields typed, and confirmation in the summary.`;
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
      activeTab: null, domElements: [], actionHistory: [],
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
      activeTab, domElements: [], actionHistory: [],
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

    // Pre-flight check: Target service detection
    const targetService = detectTargetService(userTask);

    // 2. Main loop
    while (!this.isCancelled && this.state.stepCount < this.maxSteps) {
      this.state.stepCount++;

      // Perceive
      this._emit('STATE_CHANGE', { state: 'PERCEIVING', label: `Step ${this.state.stepCount}: Scanning DOM…` });
      const pageCtx = await this._perceive();
      this.state.domElements = pageCtx.elements || [];

      // Step 1 fast path: If target service requested and tab is on wrong page, navigate immediately
      if (this.state.stepCount === 1 && targetService && !targetService.hostMatch.test(pageCtx.url || '')) {
        this._emit('STATE_CHANGE', { state: 'ACTING', label: `Step 1: Navigating to ${targetService.name} (${targetService.url})…` });
        const navAction = {
          toolName: 'open_url',
          args: { url: targetService.url, rationale: `Navigating to ${targetService.name} as requested by user.` },
          callId: this._id()
        };
        const navResult = await executeBrowserTool(navAction.toolName, navAction.args, this.state.activeTab, this.vault);
        navAction.observation = navResult.observation || 'Opened.';
        this._recordTurn([navAction]);
        this.state.actionHistory.push({ toolName: 'open_url', args: navAction.args, url: targetService.url, observation: navAction.observation });
        this._emit('TOOL_CALL', { toolName: 'open_url', args: navAction.args });
        this._emit('OBSERVATION', { observation: navAction.observation });
        await this._sleep(1000);
        continue; // Rescan DOM on the newly opened page
      }

      // Reason
      this._emit('STATE_CHANGE', { state: 'REASONING', label: `Step ${this.state.stepCount}: Reasoning (${this.model})…` });
      let decision;
      try {
        decision = this.provider === 'mistral'
          ? await this._reasonMistral(pageCtx, targetService)
          : await this._reasonGemini(pageCtx, targetService);
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
        actions = [{ toolName: 'wait_seconds', args: { seconds: 2, reason: 'Scanning DOM for interactive elements' }, callId: this._id() }];
      }

      // ── MECHANICAL VERIFICATION GATE BEFORE ACCEPTING finish_task ──
      const finish = actions.find(a => a.toolName === 'finish_task');
      if (finish) {
        const isEmailTask = /\b(mail|email|send)\b/i.test(this.state.task);
        if (isEmailTask) {
          const visitedEmailService = this.state.actionHistory.some(h => /mail\.google\.com/i.test(h.url || '')) ||
                                     /mail\.google\.com/i.test(pageCtx.url || '');
          const typedInputs = this.state.actionHistory.filter(h => h.toolName === 'type_into_element');
          const clickedActions = this.state.actionHistory.filter(h => h.toolName === 'click_element');

          const hasValidEmailWorkflow = visitedEmailService && (typedInputs.length >= 1 || clickedActions.length >= 2);

          if (!hasValidEmailWorkflow) {
            this._emit('TOOL_ERROR', { error: 'Verification failed: finish_task called before opening Gmail, typing the email, and clicking Send.' });
            this._addUserMessage('SYSTEM REJECTION: You cannot finish this task yet. You have NOT performed the required actions on mail.google.com (navigate to Gmail, type recipient/message, and click Send). You must actually perform these actions on the page before completing.');

            actions = actions.filter(a => a.toolName !== 'finish_task');
            if (!actions.length) {
              if (targetService && !targetService.hostMatch.test(pageCtx.url)) {
                actions = [{
                  toolName: 'open_url',
                  args: { url: targetService.url, rationale: `Navigating to ${targetService.name} to send email.` },
                  callId: this._id()
                }];
              } else {
                actions = [{
                  toolName: 'wait_seconds',
                  args: { seconds: 2, reason: 'Awaiting compose fields or send action' },
                  callId: this._id()
                }];
              }
            }
          }
        }
      }

      // Re-check finish_task after gate
      const verifiedFinish = actions.find(a => a.toolName === 'finish_task');
      if (verifiedFinish) {
        const summary = verifiedFinish.args?.summary || 'Task completed.';
        this.state.status = 'COMPLETED';
        this.state.finalSummary = summary;
        this._emit('TASK_COMPLETE', { summary, success: verifiedFinish.args?.success !== false, steps: this.state.stepCount });
        return { success: verifiedFinish.args?.success !== false, summary, steps: this.state.stepCount };
      }

      // Execute actions
      this._emit('STATE_CHANGE', { state: 'ACTING', label: `Step ${this.state.stepCount}: Executing ${actions.map(a => a.toolName).join(' + ')}…` });

      for (const action of actions) {
        if (this.isCancelled) break;

        this._emit('TOOL_CALL', { toolName: action.toolName, args: action.args });

        let observation = '';
        let toolError   = false;

        try {
          this.state.activeTab = await chrome.tabs.get(this.state.activeTab.id);
        } catch (_) {}

        try {
          const result = await executeBrowserTool(
            action.toolName, action.args,
            this.state.activeTab, this.vault
          );
          observation = result.observation || 'Done.';

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

        this.state.actionHistory.push({
          toolName: action.toolName,
          args: action.args,
          url: this.state.activeTab?.url || pageCtx.url,
          observation
        });

        // After a click that may open a modal — always re-perceive before continuing
        if (!toolError && action.toolName === 'click_element' && actions.length > 1) {
          await this._sleep(700);
          this._recordTurn([action]);
          break;
        }

        if (actions.length > 1) await this._sleep(200);
      }

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
        try {
          await chrome.scripting.insertCSS({ target: { tabId }, files: ['content/highlighter.css'] });
          await chrome.scripting.executeScript({ target: { tabId }, files: ['content/dom-actions.js', 'content/content-main.js'] });
          await this._sleep(400);
        } catch (_) {
          break;
        }
      }
    }

    return { url: this.state.activeTab?.url || '', title: this.state.activeTab?.title || '', elements: [] };
  }

  // ───────────────────────────────────────────────────────
  // Mistral reasoning
  // ───────────────────────────────────────────────────────
  async _reasonMistral(pageCtx, targetService) {
    if (!this.apiKey) throw new Error('Mistral API key missing.');

    const systemPrompt = buildSystemPrompt(pageCtx, this.state.stepCount, this.maxSteps, targetService, this.state.sanitizedTask);
    const messages = [{ role: 'system', content: systemPrompt }, ...this.state.messages];

    let model = this.model || 'codestral-latest';

    const call = async (m, msgs) => fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.apiKey}` },
      body: JSON.stringify({
        model: m,
        messages: msgs,
        tools: MISTRAL_TOOL_DECLARATIONS,
        tool_choice: 'auto',
        temperature: 0.1
      })
    });

    let resp = await call(model, messages);

    // Tier fallback: mistral-large-latest → codestral-latest
    if (resp.status === 403 && model !== 'codestral-latest') {
      this._emit('STATE_CHANGE', { state: 'REASONING', label: 'Tier limit — switching to codestral-latest…' });
      model = 'codestral-latest';
      resp = await call(model, messages);
    }

    // Retry on 429 / 503
    if (resp.status === 429 || resp.status === 503) {
      await this._sleep(2000);
      resp = await call(model, messages);
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

    // If model returned text with no tool call and we are on wrong domain, auto-navigate
    if (targetService && !targetService.hostMatch.test(pageCtx.url)) {
      return {
        actions: [{
          toolName: 'open_url',
          args: { url: targetService.url, rationale: `Navigating to ${targetService.name} to fulfill user request.` },
          callId: this._id()
        }],
        thought: thought || `Navigating to ${targetService.name} (${targetService.url})…`
      };
    }

    // Nudge model to return a tool call
    const nudgeMessages = [
      ...messages,
      { role: 'assistant', content: thought || 'Thinking about next action...' },
      { role: 'user', content: `[SYSTEM ALERT]: You replied with text only without calling a tool. You MUST call an available tool to interact with the browser. Target task: "${this.state.sanitizedTask}". Current page: ${pageCtx.url}. Return a tool call now.` }
    ];

    const retryResp = await call(model, nudgeMessages);
    if (retryResp.ok) {
      const retryData = await retryResp.json();
      const retryChoice = retryData.choices?.[0]?.message;
      const retryCalls = retryChoice?.tool_calls || [];
      if (retryCalls.length) {
        return {
          actions: retryCalls.map(tc => ({
            toolName: tc.function.name,
            args:     this._parseArgs(tc.function.arguments),
            callId:   tc.id || this._id()
          })),
          thought: retryChoice?.content || thought
        };
      }
    }

    return this._fallbackAction(thought);
  }

  // ───────────────────────────────────────────────────────
  // Gemini reasoning
  // ───────────────────────────────────────────────────────
  async _reasonGemini(pageCtx, targetService) {
    if (!this.apiKey) throw new Error('Gemini API key missing.');

    let model = this.model || 'gemini-3.8-flash';
    if (/gemini-2\.0/.test(model)) model = 'gemini-3.8-flash';

    const systemPrompt = buildSystemPrompt(pageCtx, this.state.stepCount, this.maxSteps, targetService, this.state.sanitizedTask);
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

    if (targetService && !targetService.hostMatch.test(pageCtx.url)) {
      return {
        actions: [{
          toolName: 'open_url',
          args: { url: targetService.url, rationale: `Navigating to ${targetService.name} to fulfill user request.` },
          callId: this._id()
        }],
        thought: thought || `Navigating to ${targetService.name} (${targetService.url})…`
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
      this.state.messages.push({
        role: 'assistant',
        content: null,
        tool_calls: actions.map(a => ({
          id:       a.callId,
          type:     'function',
          function: { name: a.toolName, arguments: JSON.stringify(a.args) }
        }))
      });
      for (const a of actions) {
        this.state.messages.push({
          role:         'tool',
          tool_call_id: a.callId,
          name:         a.toolName,
          content:      a.observation || 'Done.'
        });
      }
    } else {
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
    return {
      actions: [{ toolName: 'wait_seconds', args: { seconds: 2, reason: 'Scanning DOM for interactive elements' }, callId: this._id() }],
      thought: thought || 'Analyzing page…'
    };
  }

  _id() { return `call_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`; }
  _sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
}
