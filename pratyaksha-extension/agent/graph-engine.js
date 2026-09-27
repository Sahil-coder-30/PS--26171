/**
 * PRATYAKSHA LangGraph StateGraph Autonomous Browser Engine
 * ISRO Problem Statement 26171
 * 
 * Provides an autonomous multi-turn Perception -> Reasoning -> Action -> Observation loop
 * powered by Mistral AI (codestral-latest / mistral-large-latest) & Google Gemini function calling.
 * Supports single & parallel multi-tool executions with on-device privacy rehydration.
 */

import {
  BROWSER_TOOL_DECLARATIONS,
  MISTRAL_TOOL_DECLARATIONS,
  executeBrowserTool
} from './browser-tools.js';

function formatDOMElementsTable(elements, maxCount = 75) {
  if (!elements || elements.length === 0) {
    return 'No interactive elements detected on active page.';
  }

  const slice = elements.slice(0, maxCount);
  const rows = slice.map(el => {
    const idStr = String(el.id || '').padStart(2, ' ');
    const tag = el.tag || 'el';
    const type = el.type || '';
    const label = (el.label || el.text || '').replace(/\s+/g, ' ').slice(0, 55);
    const text = (el.text || '').replace(/\s+/g, ' ').slice(0, 45);
    const textPart = (text && text !== label) ? ` | text: "${text}"` : '';
    const valPart = el.value ? ` | val: "${el.value.slice(0, 25)}"` : '';
    return `[${idStr}] <${tag}> | ${type} | "${label}"${textPart}${valPart}`;
  });

  return `[ID] <TAG> | TYPE/ROLE | "LABEL/PLACEHOLDER" | OPTIONAL_DETAILS\n` + rows.join('\n');
}

export class LangGraphAgent {
  /**
   * @param {Object} options 
   * @param {string} [options.provider='mistral'] - 'mistral' | 'gemini'
   * @param {string} options.apiKey
   * @param {string} [options.model='codestral-latest']
   * @param {Object} options.vault (PIIVault instance)
   * @param {number} [options.maxSteps=15]
   * @param {Function} [options.onEvent]
   */
  constructor(options = {}) {
    this.provider = options.provider || 'mistral';
    this.apiKey = (options.apiKey || '').trim();
    this.model = options.model || (this.provider === 'mistral' ? 'codestral-latest' : 'gemini-3.8-flash');
    this.vault = options.vault;
    this.maxSteps = options.maxSteps || 15;
    this.onEvent = options.onEvent || (() => {});
    this.isCancelled = false;

    // Graph State
    this.state = {
      task: '',
      sanitizedTask: '',
      messages: [],
      activeTab: null,
      domElements: [],
      stepCount: 0,
      status: 'IDLE',
      finalSummary: null
    };
  }

  /**
   * Cancel currently running graph loop
   */
  cancel() {
    this.isCancelled = true;
    this.state.status = 'CANCELLED';
    this.emitEvent('CANCELLED', { message: 'Agent cancelled by user.' });
  }

  /**
   * Emit lifecycle event to UI
   */
  emitEvent(type, payload = {}) {
    this.onEvent({
      type,
      step: this.state.stepCount,
      timestamp: new Date().toLocaleTimeString(),
      ...payload
    });
  }

  /**
   * Runs the autonomous LangGraph agent loop
   * @param {string} userTask 
   * @param {Object} activeTab 
   * @returns {Promise<{ success: boolean, summary: string, steps: number }>}
   */
  async run(userTask, activeTab) {
    this.isCancelled = false;
    this.state.task = userTask;
    this.state.activeTab = activeTab;
    this.state.stepCount = 0;
    this.state.messages = [];
    this.state.status = 'RUNNING';

    // ── NODE 1: PRIVACY SANITIZE ──
    const { sanitizedText, detected } = this.vault
      ? this.vault.anonymize(userTask)
      : { sanitizedText: userTask, detected: [] };

    this.state.sanitizedTask = sanitizedText;

    this.emitEvent('TASK_START', {
      task: userTask,
      sanitized: sanitizedText,
      detectedCount: detected.length,
      provider: this.provider,
      model: this.model
    });

    if (detected.length > 0) {
      this.emitEvent('PII_MASKED', { detected });
    }

    // Initialize conversation memory
    if (this.provider === 'mistral') {
      this.state.messages.push({
        role: 'user',
        content: `User Objective: ${sanitizedText}`
      });
    } else {
      this.state.messages.push({
        role: 'user',
        parts: [{ text: `Task Goal: ${sanitizedText}` }]
      });
    }

    // ── MAIN STATE GRAPH LOOP ──
    while (!this.isCancelled && this.state.stepCount < this.maxSteps) {
      this.state.stepCount++;

      // ── NODE 2: PERCEIVE DOM ──
      this.emitEvent('STATE_CHANGE', {
        state: 'PERCEIVING',
        label: `Step ${this.state.stepCount}: Scanning DOM elements...`
      });
      const pageContext = await this.perceiveDOM();
      this.state.domElements = pageContext.elements || [];

      // ── NODE 3: REASON WITH MODEL (MISTRAL OR GEMINI) ──
      this.emitEvent('STATE_CHANGE', {
        state: 'REASONING',
        label: `Step ${this.state.stepCount}: Reasoning with ${this.provider.toUpperCase()} (${this.model})...`
      });

      const decision = this.provider === 'mistral'
        ? await this.reasonWithMistral(pageContext)
        : await this.reasonWithGemini(pageContext);

      if (this.isCancelled) break;

      // Handle Model Thought
      if (decision.thought) {
        this.emitEvent('THOUGHT', { thought: decision.thought });
      }

      const actions = decision.actions || [];
      if (actions.length === 0) {
        actions.push({
          toolName: 'wait_seconds',
          args: { seconds: 2 },
          callId: `call_${Date.now()}`
        });
      }

      // Check for finish_task
      const finishAction = actions.find(a => a.toolName === 'finish_task');
      if (finishAction) {
        const summary = finishAction.args?.summary || 'Task completed successfully.';
        this.state.status = 'COMPLETED';
        this.state.finalSummary = summary;
        this.emitEvent('TASK_COMPLETE', {
          summary,
          success: finishAction.args?.success !== false,
          steps: this.state.stepCount
        });
        return {
          success: finishAction.args?.success !== false,
          summary,
          steps: this.state.stepCount
        };
      }

      // ── NODE 4: EXECUTE BROWSER TOOLS ──
      const executedObservations = [];

      for (const action of actions) {
        if (this.isCancelled) break;

        this.emitEvent('STATE_CHANGE', {
          state: 'ACTING',
          label: `Step ${this.state.stepCount}: Executing ${action.toolName}...`
        });
        this.emitEvent('TOOL_CALL', {
          toolName: action.toolName,
          args: action.args
        });

        let observation = '';
        try {
          const result = await executeBrowserTool(
            action.toolName,
            action.args,
            this.state.activeTab,
            this.vault
          );

          observation = result.observation || 'Action executed successfully.';
          if (result.isFinished) {
            this.state.status = 'COMPLETED';
            this.state.finalSummary = result.summary || 'Task finished.';
            this.emitEvent('TASK_COMPLETE', {
              summary: this.state.finalSummary,
              success: result.success !== false,
              steps: this.state.stepCount
            });
            return {
              success: result.success !== false,
              summary: this.state.finalSummary,
              steps: this.state.stepCount
            };
          }
        } catch (err) {
          observation = `Tool Error: ${err.message}`;
          this.emitEvent('TOOL_ERROR', { error: err.message });
        }

        action.observation = observation;
        executedObservations.push(observation);
        this.emitEvent('OBSERVATION', { observation });

        // Small inter-tool pause for UI animations/modal stability
        if (actions.length > 1) {
          await new Promise(r => setTimeout(r, 250));
        }
      }

      // Record turn into conversation history
      if (this.provider === 'mistral') {
        this.state.messages.push({
          role: 'assistant',
          content: decision.thought || null,
          tool_calls: actions.map(a => ({
            id: a.callId || `call_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            type: 'function',
            function: {
              name: a.toolName,
              arguments: JSON.stringify(a.args)
            }
          }))
        });

        for (const a of actions) {
          this.state.messages.push({
            role: 'tool',
            name: a.toolName,
            content: a.observation || 'Done',
            tool_call_id: a.callId
          });
        }
      } else {
        // Gemini format
        this.state.messages.push({
          role: 'model',
          parts: actions.map(a => ({
            functionCall: { name: a.toolName, args: a.args }
          }))
        });

        for (const a of actions) {
          this.state.messages.push({
            role: 'function',
            parts: [{ functionResponse: { name: a.toolName, response: { output: a.observation || 'Done' } } }]
          });
        }
      }

      // Small pause between loops for DOM stability
      await new Promise(r => setTimeout(r, 450));
    }

    if (this.isCancelled) {
      return { success: false, summary: 'Task was cancelled by user.', steps: this.state.stepCount };
    }

    // Step budget reached
    const budgetSummary = `Agent completed search budget (${this.maxSteps} steps limit reached).`;
    this.emitEvent('BUDGET_REACHED', { summary: budgetSummary });
    return { success: false, summary: budgetSummary, steps: this.state.stepCount };
  }

  /**
   * Perceive the active webpage DOM and extract interactive elements
   */
  async perceiveDOM() {
    if (!this.state.activeTab?.id) {
      return { url: '', title: '', elements: [] };
    }

    try {
      const currentTab = await chrome.tabs.get(this.state.activeTab.id);
      this.state.activeTab = currentTab;

      const response = await chrome.tabs.sendMessage(this.state.activeTab.id, {
        type: 'GET_PAGE_CONTEXT'
      });

      if (response && response.elements) {
        return response;
      }
    } catch (e) {
      try {
        await chrome.runtime.sendMessage({
          type: 'ENSURE_CONTENT_SCRIPT',
          tabId: this.state.activeTab.id
        });
        const retryResp = await chrome.tabs.sendMessage(this.state.activeTab.id, {
          type: 'GET_PAGE_CONTEXT'
        });
        if (retryResp?.elements) return retryResp;
      } catch {}
    }

    return {
      url: this.state.activeTab?.url || '',
      title: this.state.activeTab?.title || '',
      elements: []
    };
  }

  /**
   * Builds the comprehensive master system prompt for autonomous browser reasoning
   */
  buildSystemPrompt(pageContext) {
    const elementsTable = formatDOMElementsTable(pageContext.elements, 75);

    return `You are PRATYAKSHA (प्रत्यक्ष), a master autonomous browser automation agent for ISRO (PS-26171).
Your mission is to autonomously fulfill the user's objective on the active webpage by observing page state and executing browser tools.

ACTIVE WEBPAGE STATE:
- URL: ${pageContext.url || 'None'}
- Title: ${pageContext.title || 'None'}
- Actionable DOM Elements:
${elementsTable}

COGNITIVE STRATEGY & WORKFLOW RULES:
1. WORKFLOW SEQUENCING & PRECONDITIONS:
   - For email, chat, or messaging tasks: You cannot type into recipient or message fields until the compose window is open! If no recipient or "To" input is visible in the elements table, look for and CLICK the "Compose", "New Email", "New Message", or "+" button first.
   - For search tasks: If a search input is present, use "type_into_element" with "press_enter: true". If on a blank or home page, use "navigate_to" with the search query.
   - For multi-field forms: Fill fields in logical order (e.g., To/Recipient -> Subject -> Message Body -> Send).
2. ANTI-SURRENDER GUARANTEE:
   - NEVER call "finish_task" with "success: false" in early steps! If a field or button is not immediately seen:
     * Check if a parent action or modal button needs to be clicked first (e.g. "Compose", "New", "Search", "Sign in").
     * Use "scroll_page" (direction: "down") to reveal elements further down the page.
     * Use "wait_seconds" if the page or modal is dynamically rendering.
3. PRECISE ELEMENT TARGETING:
   - In "click_element" and "type_into_element", ALWAYS provide "target_id: <number>" matching the [ID] number from the table. This guarantees 100% targeting accuracy.
   - Include "semantic_hint" as a descriptive label (e.g. semantic_hint: "Compose button" or "To recipient").
4. ZERO PERMISSION PROMPTS:
   - Act completely autonomously without asking the user for confirmation.
5. COMPLETION:
   - Only call "finish_task" when the objective has been achieved or information collected. Provide a concise summary.`;
  }

  /**
   * Reason over current DOM & task using Mistral AI (codestral-latest / mistral-large-latest)
   */
  async reasonWithMistral(pageContext) {
    if (!this.apiKey) {
      throw new Error('Mistral API Key is missing. Please set it in Settings or .env.');
    }

    const endpoint = 'https://api.mistral.ai/v1/chat/completions';
    const systemPrompt = this.buildSystemPrompt(pageContext);

    const messages = [
      { role: 'system', content: systemPrompt },
      ...this.state.messages
    ];

    let currentModel = this.model || 'codestral-latest';

    const sendRequest = async (m) => {
      return await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: m,
          messages,
          tools: MISTRAL_TOOL_DECLARATIONS,
          tool_choice: 'auto',
          temperature: 0.15
        })
      });
    };

    let response = await sendRequest(currentModel);

    // If mistral-large-latest is restricted by subscription tier (403), gracefully use codestral-latest
    if (response.status === 403 && currentModel === 'mistral-large-latest') {
      this.emitEvent('STATE_CHANGE', {
        state: 'REASONING',
        label: `Switching to authorized Mistral Codestral flagship (codestral-latest)...`
      });
      currentModel = 'codestral-latest';
      response = await sendRequest(currentModel);
    }

    if (!response.ok) {
      let errText = `HTTP ${response.status}`;
      try {
        const errJson = await response.json();
        if (errJson?.message) errText = errJson.message;
      } catch {}
      throw new Error(`Mistral API Error: ${errText}`);
    }

    const data = await response.json();
    const choice = data.choices?.[0]?.message;
    const toolCalls = choice?.tool_calls || [];
    const thought = choice?.content || '';

    if (toolCalls.length > 0) {
      const actions = toolCalls.map(tc => {
        let args = {};
        try {
          args = typeof tc.function.arguments === 'string'
            ? JSON.parse(tc.function.arguments)
            : tc.function.arguments;
        } catch (e) {
          args = {};
        }

        if (args.target_id !== undefined && typeof args.target_id === 'string') {
          args.target_id = parseInt(args.target_id, 10);
        }

        return {
          toolName: tc.function.name,
          args,
          callId: tc.id || `call_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
        };
      });

      return {
        actions,
        thought
      };
    }

    if (thought) {
      const jsonMatch = thought.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[1].trim());
          const name = parsed.tool || parsed.name || parsed.action;
          const args = parsed.parameters || parsed.args || parsed.arguments || parsed;
          if (name) {
            if (args.target_id !== undefined && typeof args.target_id === 'string') {
              args.target_id = parseInt(args.target_id, 10);
            }
            return {
              actions: [{
                toolName: name,
                args: typeof args === 'object' ? args : {},
                callId: `call_${Date.now()}`
              }],
              thought: thought.replace(/```(?:json)?[\s\S]*?```/, '').trim()
            };
          }
        } catch (e) {}
      }

      if (/done|complete|found|success|finished/i.test(thought) && thought.length > 20) {
        return {
          actions: [{
            toolName: 'finish_task',
            args: { summary: thought, success: true },
            callId: `call_${Date.now()}`
          }],
          thought
        };
      }
    }

    return {
      actions: [{
        toolName: 'wait_seconds',
        args: { seconds: 2 },
        callId: `call_${Date.now()}`
      }],
      thought: thought || 'Waiting for page elements to settle...'
    };
  }

  /**
   * Reason over current DOM & task using Gemini Function Calling
   */
  async reasonWithGemini(pageContext) {
    if (!this.apiKey) {
      throw new Error('Gemini API Key is missing. Please set it in Settings or .env.');
    }

    let model = this.model || 'gemini-3.8-flash';
    if (model === 'gemini-2.0-flash' || model === 'gemini-2.0-flash-lite') {
      model = 'gemini-3.8-flash';
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
    const systemPrompt = this.buildSystemPrompt(pageContext);

    const requestBody = {
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: this.state.messages,
      tools: [
        {
          functionDeclarations: BROWSER_TOOL_DECLARATIONS
        }
      ],
      generationConfig: {
        temperature: 0.15
      }
    };

    let response;
    let attempts = 0;
    while (attempts < 3) {
      attempts++;
      response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) break;

      if ((response.status === 503 || response.status === 429) && attempts < 3) {
        this.emitEvent('STATE_CHANGE', {
          state: 'REASONING',
          label: `API server busy (${response.status}). Retrying in ${attempts * 1.2}s...`
        });
        await new Promise(r => setTimeout(r, attempts * 1200));
        continue;
      }
      break;
    }

    if (!response.ok) {
      let errDetails = `HTTP ${response.status}`;
      try {
        const json = await response.json();
        if (json?.error?.message) errDetails = json.error.message;
      } catch {}
      throw new Error(`Gemini API Error: ${errDetails}`);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const parts = candidate?.content?.parts || [];

    const fnParts = parts.filter(p => p.functionCall);
    const textPart = parts.find(p => p.text);
    const thought = textPart?.text || '';

    if (fnParts.length > 0) {
      const actions = fnParts.map(p => {
        const args = p.functionCall.args || {};
        if (args.target_id !== undefined && typeof args.target_id === 'string') {
          args.target_id = parseInt(args.target_id, 10);
        }
        return {
          toolName: p.functionCall.name,
          args,
          callId: `call_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
        };
      });

      return {
        actions,
        thought
      };
    }

    if (thought) {
      if (/done|complete|found|success|finished/i.test(thought) && thought.length > 20) {
        return {
          actions: [{
            toolName: 'finish_task',
            args: { summary: thought, success: true },
            callId: `call_${Date.now()}`
          }],
          thought
        };
      }
    }

    return {
      actions: [{
        toolName: 'wait_seconds',
        args: { seconds: 2 },
        callId: `call_${Date.now()}`
      }],
      thought: thought || 'Waiting for page elements to settle...'
    };
  }
}
