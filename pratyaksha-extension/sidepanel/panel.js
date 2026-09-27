/**
 * PRATYAKSHA Side Panel Controller — Modern Chat Interface
 * ISRO Problem Statement 26171
 */

import { globalVault } from '../vault/pii-vault.js';
import { AgentPlanner } from '../agent/planner.js';
import { getEffectiveConfig } from '../env.js';
import { LangGraphAgent } from '../agent/graph-engine.js';

let activeTab = null;
let pageContext = null;
let currentPlan = [];
let currentStepIndex = 0;
let isExecuting = false;
let activeAgent = null;

// DOM Elements — Header
const engineIndicator = document.getElementById('engineIndicator');
const engineName = document.getElementById('engineName');
const tabDomain = document.getElementById('tabDomain');
const tabTitle = document.getElementById('tabTitle');
const elementsCount = document.getElementById('elementsCount');
const rescanBtn = document.getElementById('rescanBtn');
const vaultBtn = document.getElementById('vaultBtn');
const metricBlocked = document.getElementById('metricBlocked');
const toggleTraceBtn = document.getElementById('toggleTraceBtn');
const newChatBtn = document.getElementById('newChatBtn');
const settingsBtn = document.getElementById('settingsBtn');

// DOM Elements — Chat Area
const chatContainer = document.getElementById('chatContainer');
const chatMessages = document.getElementById('chatMessages');
const welcomeScreen = document.getElementById('welcomeScreen');

// DOM Elements — Bottom Input Dock
const autonomousToggle = document.getElementById('autonomousToggle');
const statusPill = document.getElementById('statusPill');
const statusText = statusPill ? statusPill.querySelector('.status-text') : null;
const promptInput = document.getElementById('promptInput');
const runBtn = document.getElementById('runBtn');
const stopBtn = document.getElementById('stopBtn');

// DOM Elements — Drawers & Modals
const vaultDrawer = document.getElementById('vaultDrawer');
const vaultDrawerBackdrop = document.getElementById('vaultDrawerBackdrop');
const closeVaultDrawerBtn = document.getElementById('closeVaultDrawerBtn');
const metricBlockedDrawer = document.getElementById('metricBlockedDrawer');
const metricTokens = document.getElementById('metricTokens');
const metricEngine = document.getElementById('metricEngine');
const vaultEmpty = document.getElementById('vaultEmpty');
const vaultTable = document.getElementById('vaultTable');
const vaultTableBody = document.getElementById('vaultTableBody');

const traceDrawer = document.getElementById('traceDrawer');
const clearLogsBtn = document.getElementById('clearLogsBtn');
const closeTraceBtn = document.getElementById('closeTraceBtn');
const terminalLogs = document.getElementById('terminalLogs');

const settingsModal = document.getElementById('settingsModal');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const engineSelect = document.getElementById('engineSelect');
const mistralGroup = document.getElementById('mistralGroup');
const mistralApiKey = document.getElementById('mistralApiKey');
const mistralModel = document.getElementById('mistralModel');
const geminiKeyGroup = document.getElementById('geminiKeyGroup');
const geminiModelGroup = document.getElementById('geminiModelGroup');
const geminiApiKey = document.getElementById('geminiApiKey');
const geminiModel = document.getElementById('geminiModel');
const privacyLevel = document.getElementById('privacyLevel');

// Active Message State
let currentAgentMessageEl = null;
let currentExecCardEl = null;
let currentExecFeedEl = null;
let currentStatusLabelEl = null;
let currentStepBadgeEl = null;
let currentPulseDotEl = null;
let currentAnswerBubbleEl = null;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  await refreshActiveTab();
  setupEventListeners();
  updateVaultUI();
  log('PRATYAKSHA cockpit initialized.', 'info');
});

// Setup event handlers
function setupEventListeners() {
  if (rescanBtn) rescanBtn.addEventListener('click', scanCurrentPage);

  // Vault Drawer toggles
  if (vaultBtn) vaultBtn.addEventListener('click', toggleVaultDrawer);
  if (closeVaultDrawerBtn) closeVaultDrawerBtn.addEventListener('click', toggleVaultDrawer);
  if (vaultDrawerBackdrop) vaultDrawerBackdrop.addEventListener('click', toggleVaultDrawer);

  // Trace Drawer toggles
  if (toggleTraceBtn) {
    toggleTraceBtn.addEventListener('click', () => {
      const isVisible = traceDrawer.style.display !== 'none';
      traceDrawer.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) terminalLogs.scrollTop = terminalLogs.scrollHeight;
    });
  }
  if (closeTraceBtn) closeTraceBtn.addEventListener('click', () => traceDrawer.style.display = 'none');
  if (clearLogsBtn) clearLogsBtn.addEventListener('click', () => terminalLogs.innerHTML = '');

  // New Chat / Clear
  if (newChatBtn) {
    newChatBtn.addEventListener('click', () => {
      if (isExecuting) return;
      chatMessages.innerHTML = '';
      if (welcomeScreen) {
        welcomeScreen.style.display = 'flex';
        chatMessages.appendChild(welcomeScreen);
      }
      log('Chat cleared. Session reset.', 'info');
    });
  }

  // Autonomous mode toggle
  if (autonomousToggle) {
    autonomousToggle.addEventListener('change', (e) => {
      chrome.storage.local.set({ autonomousMode: e.target.checked });
      log(`Autonomous Mode ${e.target.checked ? 'ENABLED' : 'DISABLED'}.`, 'info');
    });
  }

  // Emergency Stop Button
  if (stopBtn) {
    stopBtn.addEventListener('click', () => {
      if (activeAgent) {
        activeAgent.cancel();
        log('🛑 Stop requested by user.', 'warn');
        if (currentStatusLabelEl) currentStatusLabelEl.textContent = 'Stopping agent...';
      }
    });
  }

  // Run Button
  if (runBtn) runBtn.addEventListener('click', handleRunPrompt);

  // Textarea dynamic sizing & Enter to submit
  if (promptInput) {
    promptInput.addEventListener('input', () => {
      promptInput.style.height = 'auto';
      promptInput.style.height = Math.min(promptInput.scrollHeight, 100) + 'px';
    });

    promptInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleRunPrompt();
      }
    });
  }

  // Suggestion Chips
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt');
      if (prompt && promptInput) {
        promptInput.value = prompt;
        promptInput.style.height = 'auto';
        promptInput.style.height = Math.min(promptInput.scrollHeight, 100) + 'px';
        promptInput.focus();
      }
    });
  });

  // Settings Modal
  if (settingsBtn) settingsBtn.addEventListener('click', () => settingsModal.style.display = 'flex');
  if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', () => settingsModal.style.display = 'none');
  if (engineSelect) {
    engineSelect.addEventListener('change', () => {
      const val = engineSelect.value;
      if (mistralGroup) mistralGroup.style.display = val === 'mistral' ? 'flex' : 'none';
      if (geminiKeyGroup) geminiKeyGroup.style.display = val === 'gemini' ? 'flex' : 'none';
      if (geminiModelGroup) geminiModelGroup.style.display = val === 'gemini' ? 'flex' : 'none';
    });
  }
  if (saveSettingsBtn) saveSettingsBtn.addEventListener('click', saveSettings);

  // Tab change listener from background
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'TAB_CHANGED') {
      refreshActiveTab();
    }
  });
}

function toggleVaultDrawer() {
  const isShown = vaultDrawer.style.display !== 'none';
  vaultDrawer.style.display = isShown ? 'none' : 'flex';
  vaultDrawerBackdrop.style.display = isShown ? 'none' : 'block';
  if (!isShown) updateVaultUI();
}

// Logging utility to terminal drawer
function log(msg, type = 'info') {
  if (!terminalLogs) return;
  const line = document.createElement('div');
  line.className = `log-line ${type}`;
  const time = new Date().toLocaleTimeString();
  line.textContent = `[${time}] ${msg}`;
  terminalLogs.appendChild(line);
  terminalLogs.scrollTop = terminalLogs.scrollHeight;
}

// Load user settings
async function loadSettings() {
  const config = await getEffectiveConfig();
  const data = await chrome.storage.local.get([
    'engineMode', 'provider', 'mistralApiKey', 'mistralModel',
    'geminiApiKey', 'geminiModel', 'privacyMode', 'autonomousMode'
  ]);

  if (autonomousToggle && data.autonomousMode !== undefined) {
    autonomousToggle.checked = data.autonomousMode;
  }

  const provider = data.provider || config.provider || 'mistral';
  if (engineSelect) engineSelect.value = provider;

  if (mistralGroup) mistralGroup.style.display = provider === 'mistral' ? 'flex' : 'none';
  if (geminiKeyGroup) geminiKeyGroup.style.display = provider === 'gemini' ? 'flex' : 'none';
  if (geminiModelGroup) geminiModelGroup.style.display = provider === 'gemini' ? 'flex' : 'none';

  if (engineName) {
    if (provider === 'mistral') {
      engineName.textContent = 'Mistral Agent';
    } else if (provider === 'gemini') {
      engineName.textContent = 'Gemini VLM';
    } else {
      engineName.textContent = 'Offline Planner';
    }
  }

  if (mistralApiKey) mistralApiKey.value = data.mistralApiKey || config.mistralApiKey || '';
  if (mistralModel) mistralModel.value = data.mistralModel || config.mistralModel || 'codestral-latest';

  let activeGeminiModel = data.geminiModel || config.geminiModel || 'gemini-3.8-flash';
  if (activeGeminiModel === 'gemini-2.0-flash' || activeGeminiModel === 'gemini-2.0-flash-lite') {
    activeGeminiModel = 'gemini-3.8-flash';
  }
  if (geminiApiKey) geminiApiKey.value = data.geminiApiKey || config.geminiApiKey || '';
  if (geminiModel) geminiModel.value = activeGeminiModel;
  if (data.privacyMode && privacyLevel) privacyLevel.value = data.privacyMode;

  if (!data.mistralApiKey && config.mistralApiKey) {
    await chrome.storage.local.set({
      mistralApiKey: config.mistralApiKey,
      mistralModel: config.mistralModel || 'codestral-latest',
      provider: 'mistral'
    });
    log('🔑 Auto-detected Mistral Agent API key from environment config.', 'info');
  }
}

// Save user settings
async function saveSettings() {
  const provider = engineSelect ? engineSelect.value : 'mistral';
  await chrome.storage.local.set({
    provider,
    engineMode: provider,
    mistralApiKey: mistralApiKey ? mistralApiKey.value.trim() : '',
    mistralModel: mistralModel ? mistralModel.value : 'codestral-latest',
    geminiApiKey: geminiApiKey ? geminiApiKey.value.trim() : '',
    geminiModel: geminiModel ? geminiModel.value : 'gemini-3.8-flash',
    privacyMode: privacyLevel ? privacyLevel.value : 'strict'
  });

  if (engineName) {
    if (provider === 'mistral') {
      engineName.textContent = 'Mistral Agent';
    } else if (provider === 'gemini') {
      engineName.textContent = 'Gemini VLM';
    } else {
      engineName.textContent = 'Offline Planner';
    }
  }

  if (settingsModal) settingsModal.style.display = 'none';
  log(`Settings updated. Active provider: ${provider.toUpperCase()}`, 'info');
}

// Refresh active tab and verify content script injection
async function refreshActiveTab() {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tabs || tabs.length === 0) return;

    activeTab = tabs[0];
    const url = activeTab.url || '';
    if (tabTitle) tabTitle.textContent = activeTab.title || 'Untitled Page';

    if (url.startsWith('chrome://') || url.startsWith('chrome-extension://') || url.startsWith('about:')) {
      if (tabDomain) tabDomain.textContent = 'Restricted';
      if (elementsCount) elementsCount.textContent = 'Blocked';
      if (statusPill) statusPill.className = 'status-indicator busy';
      if (statusText) statusText.textContent = 'RESTRICTED';
      log('Cannot execute on internal Chrome pages (chrome://). Please navigate to an HTTP/HTTPS site.', 'warn');
      return;
    }

    try {
      const parsedUrl = new URL(url);
      if (tabDomain) tabDomain.textContent = parsedUrl.hostname;
    } catch {
      if (tabDomain) tabDomain.textContent = 'Active Page';
    }

    if (statusPill) statusPill.className = 'status-indicator online';
    if (statusText) statusText.textContent = 'READY';

    // Ensure content script is ready
    await chrome.runtime.sendMessage({
      type: 'ENSURE_CONTENT_SCRIPT',
      tabId: activeTab.id
    });

    await scanCurrentPage();
  } catch (err) {
    console.error('[PRATYAKSHA] Tab refresh error:', err);
    log(`Tab connection warning: ${err.message}`, 'warn');
  }
}

async function scanCurrentPage() {
  if (!activeTab || !activeTab.id) return;

  const tryGetContext = () => new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('GET_PAGE_CONTEXT timeout')), 4000);
    chrome.tabs.sendMessage(activeTab.id, { type: 'GET_PAGE_CONTEXT' }, resp => {
      clearTimeout(timer);
      chrome.runtime.lastError ? reject(new Error(chrome.runtime.lastError.message)) : resolve(resp);
    });
  });

  let response;
  try {
    response = await tryGetContext();
  } catch (_) {
    try {
      await chrome.runtime.sendMessage({ type: 'ENSURE_CONTENT_SCRIPT', tabId: activeTab.id });
      await new Promise(r => setTimeout(r, 400));
      response = await tryGetContext();
    } catch (err2) {
      if (elementsCount) elementsCount.textContent = '↻';
      return;
    }
  }

  if (response && response.elements) {
    pageContext = response;
    if (elementsCount) elementsCount.textContent = `${response.elements.length}`;
    let hostname = 'page';
    try { hostname = new URL(response.url).hostname; } catch (_) {}
    log(`DOM Indexed: Found ${response.elements.length} actionable elements on ${hostname}`, 'info');
  }
}

// Main execution handler
async function handleRunPrompt() {
  const rawPrompt = promptInput.value.trim();
  if (!rawPrompt) {
    promptInput.focus();
    return;
  }

  if (isExecuting) {
    log('Agent is currently executing a task. Click Stop to cancel.', 'warn');
    return;
  }

  // Clear input box
  promptInput.value = '';
  promptInput.style.height = 'auto';

  // Hide welcome card if present
  if (welcomeScreen && welcomeScreen.parentElement) {
    welcomeScreen.style.display = 'none';
  }

  // 1. Render User Message Bubble
  renderUserMessage(rawPrompt);

  // 2. Render Agent Response Container with Collapsible Execution Block
  createAgentMessageSlot();

  const isAutonomous = autonomousToggle ? autonomousToggle.checked : true;
  setBusyState(true);
  log(`User Request: "${rawPrompt}"`, 'info');

  try {
    if (isAutonomous) {
      const config = await getEffectiveConfig();
      const settings = await chrome.storage.local.get([
        'provider', 'mistralApiKey', 'mistralModel', 'geminiApiKey', 'geminiModel'
      ]);

      const provider = settings.provider || config.provider || 'mistral';
      const apiKey = provider === 'mistral'
        ? (settings.mistralApiKey || config.mistralApiKey || '').trim()
        : (settings.geminiApiKey || config.geminiApiKey || '').trim();

      const model = provider === 'mistral'
        ? (settings.mistralModel || config.mistralModel || 'codestral-latest')
        : (settings.geminiModel || config.geminiModel || 'gemini-3.8-flash');

      if (!apiKey) {
        throw new Error(`${provider === 'mistral' ? 'Mistral' : 'Gemini'} API Key is missing. Click ⚙ Settings to configure.`);
      }

      activeAgent = new LangGraphAgent({
        provider,
        apiKey,
        model,
        vault: globalVault,
        maxSteps: 20,
        onEvent: handleAgentEvent
      });

      const result = await activeAgent.run(rawPrompt, activeTab);
      if (result.success) {
        log(`🎉 Autonomous Task Completed in ${result.steps} step(s)!`, 'success');
        finishAgentMessage(result.summary || 'Task completed successfully.');
      } else {
        log(`Task ended: ${result.summary}`, 'warn');
        finishAgentMessage(result.summary || 'Task finished without completion.', false);
      }
    } else {
      // Step-by-Step Approval Mode
      const { sanitizedText, detected } = globalVault.anonymize(rawPrompt);
      updateVaultUI();

      if (detected.length > 0) {
        log(`🔒 [PRIVACY FIREWALL] Sanitized ${detected.length} PII items:`, 'privacy');
        appendPrivacyEvent(detected);
      }

      if (!pageContext) await scanCurrentPage();

      const settings = await chrome.storage.local.get(['engineMode', 'geminiApiKey', 'geminiModel']);
      const config = await getEffectiveConfig();
      const effectiveKey = (settings.geminiApiKey || config.apiKey || '').trim();
      const effectiveEngine = settings.engineMode || (effectiveKey ? 'gemini' : 'deterministic');
      let effectiveModel = settings.geminiModel || config.model || 'gemini-3.8-flash';
      if (effectiveModel === 'gemini-2.0-flash' || effectiveModel === 'gemini-2.0-flash-lite') {
        effectiveModel = 'gemini-3.8-flash';
      }

      const options = {
        useGemini: effectiveEngine === 'gemini',
        apiKey: effectiveKey,
        model: effectiveModel
      };

      if (currentStatusLabelEl) currentStatusLabelEl.textContent = 'Generating plan...';
      const result = await AgentPlanner.generatePlan(rawPrompt, sanitizedText, pageContext || { elements: [] }, options);
      currentPlan = result.plan;
      currentStepIndex = 0;

      if (currentStepBadgeEl) currentStepBadgeEl.textContent = `${currentPlan.length} steps`;
      if (currentStatusLabelEl) currentStatusLabelEl.textContent = 'Plan ready for approval';

      renderInlinePlan();
    }
  } catch (err) {
    log(`[ERROR] ${err.message}`, 'error');
    if (currentStatusLabelEl) currentStatusLabelEl.textContent = 'Error occurred';
    if (currentPulseDotEl) currentPulseDotEl.style.background = '#EF4444';
    finishAgentMessage(`❌ Error: ${err.message}`, false);
  } finally {
    setBusyState(false);
    setTimeout(() => { activeAgent = null; }, 300);
  }
}

// ── Chat Rendering Functions ─────────────────────────────────

function renderUserMessage(text) {
  const row = document.createElement('div');
  row.className = 'chat-row user';
  row.innerHTML = `<div class="user-bubble">${escapeHtml(text)}</div>`;
  chatMessages.appendChild(row);
  scrollToBottom();
}

function createAgentMessageSlot() {
  const msgId = Date.now();
  const row = document.createElement('div');
  row.className = 'chat-row agent';
  row.id = `msg-${msgId}`;

  row.innerHTML = `
    <div class="agent-container">
      <div class="agent-exec-card open is-active" id="exec-${msgId}">
        <div class="agent-exec-summary">
          <div class="exec-summary-left">
            <span class="exec-pulse-dot" id="dot-${msgId}"></span>
            <span class="exec-step-badge" id="step-${msgId}">Step 1/20</span>
            <span class="exec-status-label" id="status-${msgId}">Initializing agent...</span>
          </div>
          <svg class="exec-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
        <div class="exec-details-body">
          <div class="graph-state-hud-mini" id="hud-${msgId}">
            <span class="state-node-mini active" data-state="PERCEIVING">👁️ Perceive</span>
            <span class="state-arrow-mini">→</span>
            <span class="state-node-mini" data-state="REASONING">🧠 Reason</span>
            <span class="state-arrow-mini">→</span>
            <span class="state-node-mini" data-state="ACTING">⚡ Act</span>
            <span class="state-arrow-mini">→</span>
            <span class="state-node-mini" data-state="OBSERVING">📋 Observe</span>
          </div>
          <div class="exec-stream-feed" id="feed-${msgId}"></div>
        </div>
      </div>
      <div class="agent-answer-bubble" id="answer-${msgId}" style="display:none;"></div>
    </div>
  `;

  chatMessages.appendChild(row);

  // Setup toggle listener on the accordion summary
  const summary = row.querySelector('.agent-exec-summary');
  const card = row.querySelector('.agent-exec-card');
  summary.addEventListener('click', () => {
    card.classList.toggle('open');
    const body = card.querySelector('.exec-details-body');
    body.style.display = card.classList.contains('open') ? 'flex' : 'none';
  });

  currentAgentMessageEl = row;
  currentExecCardEl = card;
  currentExecFeedEl = row.querySelector(`#feed-${msgId}`);
  currentStatusLabelEl = row.querySelector(`#status-${msgId}`);
  currentStepBadgeEl = row.querySelector(`#step-${msgId}`);
  currentPulseDotEl = row.querySelector(`#dot-${msgId}`);
  currentAnswerBubbleEl = row.querySelector(`#answer-${msgId}`);

  scrollToBottom();
}

function handleAgentEvent(event) {
  if (!currentExecFeedEl) return;

  switch (event.type) {
    case 'TASK_START':
      log(`🚀 [LANGGRAPH START] Objective: "${event.task}"`, 'info');
      updateVaultUI();
      break;

    case 'PII_MASKED':
      appendPrivacyEvent(event.detected);
      updateVaultUI();
      break;

    case 'STATE_CHANGE':
      if (currentStepBadgeEl) currentStepBadgeEl.textContent = `Step ${event.step}/20`;
      if (currentStatusLabelEl) currentStatusLabelEl.textContent = event.label || event.state;
      updateStateHud(event.state);
      log(event.label, 'info');
      break;

    case 'THOUGHT':
      if (event.thought) {
        const thoughtDiv = document.createElement('div');
        thoughtDiv.className = 'thought-box';
        thoughtDiv.textContent = `🧠 ${event.thought}`;
        currentExecFeedEl.appendChild(thoughtDiv);
        log(`🧠 Thought: ${event.thought.slice(0, 160)}`, 'info');
        scrollToBottom();
      }
      break;

    case 'TOOL_CALL':
      {
        const toolDiv = document.createElement('div');
        toolDiv.className = 'tool-call-box';
        const formattedArgs = JSON.stringify(event.args, null, 1).replace(/\n\s*/g, ' ');
        toolDiv.innerHTML = `
          <div class="tool-call-tag">⚡ TOOL CALL</div>
          <div>${event.toolName}(${escapeHtml(formattedArgs)})</div>
        `;
        currentExecFeedEl.appendChild(toolDiv);
        log(`⚡ [TOOL] ${event.toolName}(${JSON.stringify(event.args)})`, 'info');
        scrollToBottom();
      }
      break;

    case 'TOOL_ERROR':
      {
        const errDiv = document.createElement('div');
        errDiv.className = 'obs-box';
        errDiv.style.borderColor = 'rgba(239, 68, 68, 0.4)';
        errDiv.style.color = '#FCA5A5';
        errDiv.textContent = `❌ ${event.error}`;
        currentExecFeedEl.appendChild(errDiv);
        log(`❌ [TOOL ERROR] ${event.error}`, 'error');
        scrollToBottom();
      }
      break;

    case 'OBSERVATION':
      {
        updateStateHud('OBSERVING');
        const obsDiv = document.createElement('div');
        obsDiv.className = 'obs-box';
        obsDiv.textContent = `👁️ ${event.observation}`;
        currentExecFeedEl.appendChild(obsDiv);
        log(`📋 Observation: ${event.observation}`, 'success');
        scrollToBottom();
      }
      break;

    case 'TASK_COMPLETE':
      finishAgentMessage(event.summary, true);
      break;

    case 'BUDGET_REACHED':
      finishAgentMessage(event.summary, false);
      break;

    case 'CANCELLED':
      finishAgentMessage(event.message || 'Execution cancelled by user.', false);
      break;
  }
}

function appendPrivacyEvent(detected) {
  if (!currentExecFeedEl || !detected || detected.length === 0) return;
  const piiDiv = document.createElement('div');
  piiDiv.className = 'privacy-alert-box';
  piiDiv.innerHTML = `
    <strong>🛡️ Privacy Firewall Redacted ${detected.length} PII items on-device:</strong>
    <ul style="margin: 4px 0 0 16px; padding: 0;">
      ${detected.map(d => `<li>${d.type}: <code>${d.maskedSample}</code> ➔ <code>${d.token}</code></li>`).join('')}
    </ul>
  `;
  currentExecFeedEl.appendChild(piiDiv);
  scrollToBottom();
}

function updateStateHud(state) {
  if (!currentExecCardEl) return;
  const nodes = currentExecCardEl.querySelectorAll('.state-node-mini');
  nodes.forEach(n => {
    n.classList.toggle('active', n.getAttribute('data-state') === state);
  });
}

function finishAgentMessage(summaryText, isSuccess = true) {
  if (currentPulseDotEl) {
    currentPulseDotEl.className = 'exec-pulse-dot done';
    if (!isSuccess) currentPulseDotEl.style.background = '#EF4444';
  }
  if (currentExecCardEl) {
    currentExecCardEl.classList.remove('is-active');
  }
  if (currentStatusLabelEl) {
    currentStatusLabelEl.textContent = isSuccess ? 'Task Completed' : 'Task Ended';
  }

  if (currentAnswerBubbleEl && summaryText) {
    currentAnswerBubbleEl.style.display = 'block';
    currentAnswerBubbleEl.innerHTML = formatMarkdown(summaryText);
  }

  scrollToBottom();
}

// Inline approval mode cards
function renderInlinePlan() {
  if (!currentExecFeedEl) return;

  const container = document.createElement('div');
  container.className = 'approval-container';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '6px';
  container.style.marginTop = '6px';

  currentPlan.forEach((stepItem, idx) => {
    const card = document.createElement('div');
    card.className = 'approval-card-inline';
    card.id = `step-card-${idx}`;
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; font-size:10px;">
        <span style="font-weight:700; color:#FFA500;">STEP ${idx + 1}</span>
        <span style="color:#38BDF8; font-family:monospace;">${stepItem.action}</span>
      </div>
      <div style="font-size:11px; color:#D4D4D8;">${escapeHtml(stepItem.description || stepItem.selector)}</div>
      <div class="approval-card-actions" id="step-ctrls-${idx}">
        <button class="btn-approve" data-step="${idx}">Approve & Run</button>
        <button class="btn-skip" data-step="${idx}">Skip</button>
      </div>
    `;
    container.appendChild(card);
  });

  currentExecFeedEl.appendChild(container);

  container.querySelectorAll('.btn-approve').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const idx = parseInt(e.target.getAttribute('data-step'), 10);
      await executeInlineStep(idx);
    });
  });

  container.querySelectorAll('.btn-skip').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.getAttribute('data-step'), 10);
      skipInlineStep(idx);
    });
  });

  scrollToBottom();
}

async function executeInlineStep(idx) {
  if (idx >= currentPlan.length) return;
  const stepItem = currentPlan[idx];
  const ctrls = document.getElementById(`step-ctrls-${idx}`);
  if (ctrls) ctrls.style.display = 'none';

  setBusyState(true);
  try {
    const payload = { ...stepItem };
    if (payload.value && typeof payload.value === 'string') {
      const rehydrated = globalVault.rehydrate(payload.value);
      if (rehydrated !== payload.value) {
        log(`🔓 [VAULT REHYDRATE] Substituted pseudonym inside DOM sandbox.`, 'privacy');
        payload.value = rehydrated;
      }
    }

    const response = await chrome.tabs.sendMessage(activeTab.id, {
      type: 'EXECUTE_ACTION',
      payload
    });

    if (response && response.success) {
      log(`[SUCCESS] Step ${idx + 1} executed.`, 'success');
      currentStepIndex = idx + 1;
      if (currentStepIndex >= currentPlan.length) {
        finishAgentMessage('All planned steps executed successfully.', true);
      }
    } else {
      throw new Error(response ? response.error : 'Execution failed');
    }
  } catch (err) {
    log(`[ERROR] Step ${idx + 1} failed: ${err.message}`, 'error');
    if (ctrls) ctrls.style.display = 'flex';
  } finally {
    setBusyState(false);
  }
}

function skipInlineStep(idx) {
  const ctrls = document.getElementById(`step-ctrls-${idx}`);
  if (ctrls) ctrls.style.display = 'none';
  log(`Step ${idx + 1} skipped.`, 'warn');
  currentStepIndex = idx + 1;
  if (currentStepIndex >= currentPlan.length) {
    finishAgentMessage('Plan completed with skipped steps.', true);
  }
}

// Update the Vault status cards and ledger
function updateVaultUI() {
  const stats = globalVault.getVaultStats();
  if (metricBlocked) metricBlocked.textContent = stats.leakBlockCount;
  if (metricBlockedDrawer) metricBlockedDrawer.textContent = stats.leakBlockCount;
  if (metricTokens) metricTokens.textContent = stats.activeTokensCount;

  if (stats.ledger.length > 0) {
    if (vaultEmpty) vaultEmpty.style.display = 'none';
    if (vaultTable) vaultTable.style.display = 'table';
    if (vaultTableBody) {
      vaultTableBody.innerHTML = '';
      stats.ledger.forEach(entry => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${entry.type}</td>
          <td><code>${entry.token}</code></td>
          <td>${entry.maskedSample}</td>
        `;
        vaultTableBody.appendChild(tr);
      });
    }
  } else {
    if (vaultEmpty) vaultEmpty.style.display = 'block';
    if (vaultTable) vaultTable.style.display = 'none';
  }
}

function setBusyState(busy) {
  isExecuting = busy;
  if (runBtn) runBtn.disabled = busy;
  if (stopBtn) stopBtn.style.display = busy ? 'inline-flex' : 'none';
  if (statusPill && statusText) {
    if (busy) {
      statusPill.className = 'status-indicator busy';
      statusText.textContent = 'ACTING';
    } else {
      statusPill.className = 'status-indicator online';
      statusText.textContent = 'READY';
    }
  }
}

function scrollToBottom() {
  if (!chatContainer) return;
  requestAnimationFrame(() => {
    chatContainer.scrollTop = chatContainer.scrollHeight;
  });
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatMarkdown(text) {
  if (!text) return '';
  return escapeHtml(text)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
}
