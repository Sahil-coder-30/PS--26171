/**
 * PRATYAKSHA Side Panel Controller
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

// DOM Elements
const statusPill = document.getElementById('statusPill');
const statusText = statusPill.querySelector('.status-text');
const tabDomain = document.getElementById('tabDomain');
const tabTitle = document.getElementById('tabTitle');
const elementsCount = document.getElementById('elementsCount');
const rescanBtn = document.getElementById('rescanBtn');

const metricBlocked = document.getElementById('metricBlocked');
const metricTokens = document.getElementById('metricTokens');
const toggleVaultDetails = document.getElementById('toggleVaultDetails');
const vaultDrawer = document.getElementById('vaultDrawer');
const vaultEmpty = document.getElementById('vaultEmpty');
const vaultTable = document.getElementById('vaultTable');
const vaultTableBody = document.getElementById('vaultTableBody');

const autonomousToggle = document.getElementById('autonomousToggle');
const engineIndicator = document.getElementById('engineIndicator');
const engineName = document.getElementById('engineName');

const promptInput = document.getElementById('promptInput');
const runBtn = document.getElementById('runBtn');
const stopBtn = document.getElementById('stopBtn');

// Autonomous Stream HUD Elements
const agentStreamSection = document.getElementById('agentStreamSection');
const streamStepBadge = document.getElementById('streamStepBadge');
const nodePerceive = document.getElementById('nodePerceive');
const nodeReason = document.getElementById('nodeReason');
const nodeAct = document.getElementById('nodeAct');
const nodeObserve = document.getElementById('nodeObserve');
const thoughtBubble = document.getElementById('thoughtBubble');
const thoughtText = document.getElementById('thoughtText');
const actionBubble = document.getElementById('actionBubble');
const actionText = document.getElementById('actionText');
const obsBubble = document.getElementById('obsBubble');
const obsText = document.getElementById('obsText');
const completionBanner = document.getElementById('completionBanner');
const completionDesc = document.getElementById('completionDesc');

const terminalLogs = document.getElementById('terminalLogs');
const clearLogsBtn = document.getElementById('clearLogsBtn');

// Settings Elements
const settingsBtn = document.getElementById('settingsBtn');
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

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  await refreshActiveTab();
  setupEventListeners();
  log('PRATYAKSHA cockpit initialized.', 'info');
});

// Setup event handlers
function setupEventListeners() {
  rescanBtn.addEventListener('click', scanCurrentPage);
  
  toggleVaultDetails.addEventListener('click', () => {
    toggleVaultDetails.classList.toggle('open');
    vaultDrawer.classList.toggle('show');
  });

  if (autonomousToggle) {
    autonomousToggle.addEventListener('change', (e) => {
      chrome.storage.local.set({ autonomousMode: e.target.checked });
      log(`Autonomous Mode ${e.target.checked ? 'ENABLED' : 'DISABLED'}.`, 'info');
    });
  }

  if (stopBtn) {
    stopBtn.addEventListener('click', () => {
      if (activeAgent) {
        activeAgent.cancel();
        log('🛑 Stop requested by user.', 'warn');
      }
    });
  }

  runBtn.addEventListener('click', handleRunPrompt);

  promptInput.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRunPrompt();
    }
  });

  // Suggestion Chips
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      promptInput.value = chip.getAttribute('data-prompt');
      promptInput.focus();
    });
  });

  clearLogsBtn.addEventListener('click', () => {
    terminalLogs.innerHTML = '';
  });

  // Settings Modal
  settingsBtn.addEventListener('click', () => settingsModal.style.display = 'flex');
  closeSettingsBtn.addEventListener('click', () => settingsModal.style.display = 'none');
  engineSelect.addEventListener('change', () => {
    const val = engineSelect.value;
    if (mistralGroup) mistralGroup.style.display = val === 'mistral' ? 'flex' : 'none';
    if (geminiKeyGroup) geminiKeyGroup.style.display = val === 'gemini' ? 'flex' : 'none';
    if (geminiModelGroup) geminiModelGroup.style.display = val === 'gemini' ? 'flex' : 'none';
  });
  saveSettingsBtn.addEventListener('click', saveSettings);

  // Tab change listener from background
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'TAB_CHANGED') {
      refreshActiveTab();
    }
  });
}

// Logging utility to on-screen terminal
function log(msg, type = 'info') {
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
  engineSelect.value = provider;

  if (mistralGroup) mistralGroup.style.display = provider === 'mistral' ? 'flex' : 'none';
  if (geminiKeyGroup) geminiKeyGroup.style.display = provider === 'gemini' ? 'flex' : 'none';
  if (geminiModelGroup) geminiModelGroup.style.display = provider === 'gemini' ? 'flex' : 'none';

  if (provider === 'mistral') {
    engineName.textContent = 'Mistral Agent (Autonomous)';
  } else if (provider === 'gemini') {
    engineName.textContent = 'Gemini VLM Cloud';
  } else {
    engineName.textContent = 'Smart Offline Planner';
  }

  if (mistralApiKey) mistralApiKey.value = data.mistralApiKey || config.mistralApiKey || '';
  if (mistralModel) mistralModel.value = data.mistralModel || config.mistralModel || 'codestral-latest';

  let activeGeminiModel = data.geminiModel || config.geminiModel || 'gemini-3.8-flash';
  if (activeGeminiModel === 'gemini-2.0-flash' || activeGeminiModel === 'gemini-2.0-flash-lite') {
    activeGeminiModel = 'gemini-3.8-flash';
  }
  if (geminiApiKey) geminiApiKey.value = data.geminiApiKey || config.geminiApiKey || '';
  if (geminiModel) geminiModel.value = activeGeminiModel;
  if (data.privacyMode) privacyLevel.value = data.privacyMode;

  // Persist if loaded from env initially
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
  const provider = engineSelect.value;
  await chrome.storage.local.set({
    provider,
    engineMode: provider,
    mistralApiKey: mistralApiKey ? mistralApiKey.value.trim() : '',
    mistralModel: mistralModel ? mistralModel.value : 'codestral-latest',
    geminiApiKey: geminiApiKey ? geminiApiKey.value.trim() : '',
    geminiModel: geminiModel ? geminiModel.value : 'gemini-3.8-flash',
    privacyMode: privacyLevel.value
  });

  if (provider === 'mistral') {
    engineName.textContent = 'Mistral Agent (Autonomous)';
  } else if (provider === 'gemini') {
    engineName.textContent = 'Gemini VLM Cloud';
  } else {
    engineName.textContent = 'Smart Offline Planner';
  }

  settingsModal.style.display = 'none';
  log(`Settings updated. Active provider: ${provider.toUpperCase()}`, 'info');
}

// Refresh active tab and verify content script injection
async function refreshActiveTab() {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tabs || tabs.length === 0) return;

    activeTab = tabs[0];
    const url = activeTab.url || '';
    tabTitle.textContent = activeTab.title || 'Untitled Page';

    if (url.startsWith('chrome://') || url.startsWith('chrome-extension://') || url.startsWith('about:')) {
      tabDomain.textContent = 'Restricted URL';
      elementsCount.textContent = 'Chrome Security Policy Blocked';
      statusPill.className = 'status-indicator busy';
      statusText.textContent = 'RESTRICTED';
      log('Cannot execute on internal Chrome pages (chrome://). Please navigate to an HTTP/HTTPS site.', 'warn');
      return;
    }

    try {
      const parsedUrl = new URL(url);
      tabDomain.textContent = parsedUrl.hostname;
    } catch {
      tabDomain.textContent = 'Active Page';
    }

    statusPill.className = 'status-indicator online';
    statusText.textContent = 'READY';

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

// Query DOM interactive elements
async function scanCurrentPage() {
  if (!activeTab || !activeTab.id) return;

  try {
    const response = await chrome.tabs.sendMessage(activeTab.id, { type: 'GET_PAGE_CONTEXT' });
    if (response && response.elements) {
      pageContext = response;
      elementsCount.textContent = `${response.elements.length} interactive elements`;
      log(`DOM Indexed: Found ${response.elements.length} actionable elements on ${new URL(response.url).hostname}`, 'info');
    }
  } catch (err) {
    console.warn('[PRATYAKSHA] Could not read page context:', err);
    elementsCount.textContent = 'Click to re-scan';
  }
}

// Main execution handler
async function handleRunPrompt() {
  const rawPrompt = promptInput.value.trim();
  if (!rawPrompt) {
    log('Please enter an action prompt.', 'warn');
    promptInput.focus();
    return;
  }

  if (isExecuting) {
    log('Agent is currently executing a task. Please wait or click Stop Agent.', 'warn');
    return;
  }

  const isAutonomous = autonomousToggle ? autonomousToggle.checked : true;
  setBusyState(true);
  log(`User Request: "${rawPrompt}"`, 'info');

  try {
    if (isAutonomous) {
      // ══════════════════════════════════════════════════════════
      // AUTONOMOUS LANGGRAPH STATEGRAPH EXECUTION LOOP
      // ══════════════════════════════════════════════════════════
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
        throw new Error(`${provider === 'mistral' ? 'Mistral' : 'Gemini'} API Key is missing. Click the ⚙ Settings icon or set it in .env.`);
      }

      if (agentStreamSection) agentStreamSection.style.display = 'block';
      if (thoughtBubble) thoughtBubble.style.display = 'none';
      if (actionBubble) actionBubble.style.display = 'none';
      if (obsBubble) obsBubble.style.display = 'none';
      if (completionBanner) completionBanner.style.display = 'none';
      if (streamStepBadge) streamStepBadge.textContent = 'Step 1/15';

      activeAgent = new LangGraphAgent({
        provider,
        apiKey,
        model,
        vault: globalVault,
        maxSteps: 15,
        onEvent: handleAgentEvent
      });

      const result = await activeAgent.run(rawPrompt, activeTab);
      if (result.success) {
        log(`🎉 Autonomous Task Completed in ${result.steps} step(s)!`, 'success');
      } else {
        log(`Task ended: ${result.summary}`, 'warn');
      }
    } else {
      // Fallback deterministic / approval mode
      const { sanitizedText, detected } = globalVault.anonymize(rawPrompt);
      updateVaultUI();

      if (detected.length > 0) {
        log(`🔒 [PRIVACY FIREWALL] Sanitized ${detected.length} PII items:`, 'privacy');
        detected.forEach(d => log(`   ├─ ${d.type}: ${d.maskedSample} ➔ ${d.token}`, 'privacy'));
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

      const isGeminiActive = options.useGemini && options.apiKey;
      log(`Generating action plan with ${isGeminiActive ? `Google Gemini (${options.model})` : 'Smart Offline Planner'}...`, 'info');

      const result = await AgentPlanner.generatePlan(rawPrompt, sanitizedText, pageContext || { elements: [] }, options);
      currentPlan = result.plan;
      currentStepIndex = 0;

      if (planSection) {
        renderPlan();
        planSection.style.display = 'block';
      }
      log(`Plan ready: ${currentPlan.length} step(s) generated. Click Approve to run.`, 'info');
    }
  } catch (err) {
    log(`[ERROR] ${err.message}`, 'error');
  } finally {
    setBusyState(false);
    activeAgent = null;
  }
}

// Handler for LangGraph StateGraph streaming events
function handleAgentEvent(event) {
  switch (event.type) {
    case 'TASK_START':
      log(`🚀 [LANGGRAPH START] Objective: "${event.task}"`, 'info');
      updateVaultUI();
      break;

    case 'PII_MASKED':
      log(`🔒 [ISRO VAULT] Masked ${event.detected.length} PII item(s) on-device before reasoning:`, 'privacy');
      event.detected.forEach(d => {
        log(`   ├─ ${d.type}: ${d.maskedSample} ➔ ${d.token}`, 'privacy');
      });
      updateVaultUI();
      break;

    case 'STATE_CHANGE':
      if (streamStepBadge) streamStepBadge.textContent = `Step ${event.step}/15`;
      [nodePerceive, nodeReason, nodeAct, nodeObserve].forEach(el => el && el.classList.remove('active'));
      if (event.state === 'PERCEIVING' && nodePerceive) nodePerceive.classList.add('active');
      if (event.state === 'REASONING' && nodeReason) nodeReason.classList.add('active');
      if (event.state === 'ACTING' && nodeAct) nodeAct.classList.add('active');
      log(event.label, 'info');
      break;

    case 'THOUGHT':
      if (thoughtBubble && thoughtText) {
        thoughtBubble.style.display = 'block';
        thoughtText.textContent = event.thought;
      }
      log(`🧠 Thought: ${event.thought}`, 'info');
      break;

    case 'TOOL_CALL':
      if (actionBubble && actionText) {
        actionBubble.style.display = 'block';
        const formattedArgs = JSON.stringify(event.args, null, 1).replace(/\n\s*/g, ' ');
        actionText.textContent = `${event.toolName}(${formattedArgs})`;
      }
      log(`⚡ Executing ${event.toolName}...`, 'info');
      break;

    case 'OBSERVATION':
      [nodePerceive, nodeReason, nodeAct, nodeObserve].forEach(el => el && el.classList.remove('active'));
      if (nodeObserve) nodeObserve.classList.add('active');
      if (obsBubble && obsText) {
        obsBubble.style.display = 'block';
        obsText.textContent = event.observation;
      }
      log(`📋 Observation: ${event.observation}`, 'success');
      break;

    case 'TASK_COMPLETE':
      if (completionBanner && completionDesc) {
        completionBanner.style.display = 'flex';
        completionDesc.textContent = event.summary;
      }
      log(`🏆 Completed: ${event.summary}`, 'success');
      break;

    case 'BUDGET_REACHED':
      log(`🛑 ${event.summary}`, 'warn');
      break;

    case 'CANCELLED':
      log(`🛑 ${event.message}`, 'warn');
      break;
  }
}

// Render the action plan cards
function renderPlan() {
  stepsList.innerHTML = '';

  currentPlan.forEach((stepItem, idx) => {
    const card = document.createElement('div');
    card.className = `step-card ${idx === 0 ? 'active' : ''}`;
    card.id = `step-card-${idx}`;

    const actionClass = (stepItem.action || '').toLowerCase().replace('_', '-');

    card.innerHTML = `
      <div class="step-top">
        <span class="step-num-pill">STEP ${stepItem.step || idx + 1}</span>
        <span class="step-action-tag ${actionClass}">${stepItem.action}</span>
      </div>
      <div class="step-desc">${stepItem.description || stepItem.selector}</div>
      ${stepItem.value ? `<div class="step-token-val">Value: ${escapeHtml(stepItem.value)}</div>` : ''}
      <div class="step-controls" id="step-ctrls-${idx}">
        <button class="btn-approve" data-step="${idx}">Approve & Run</button>
        <button class="btn-skip" data-step="${idx}">Skip</button>
      </div>
    `;

    stepsList.appendChild(card);
  });

  // Attach per-step approval listeners
  document.querySelectorAll('.btn-approve').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const idx = parseInt(e.target.getAttribute('data-step'), 10);
      await executeSingleStep(idx);
    });
  });

  document.querySelectorAll('.btn-skip').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = parseInt(e.target.getAttribute('data-step'), 10);
      skipStep(idx);
    });
  });
}

// Execute a single step in approval mode
async function executeSingleStep(idx) {
  if (idx >= currentPlan.length) return;
  const stepItem = currentPlan[idx];
  const card = document.getElementById(`step-card-${idx}`);
  const ctrls = document.getElementById(`step-ctrls-${idx}`);

  setBusyState(true);
  if (card) card.className = 'step-card active';
  if (ctrls) ctrls.style.display = 'none';

  log(`[DISPATCH] Step ${idx + 1}: ${stepItem.action} on "${stepItem.selector || 'viewport'}"...`, 'info');

  try {
    // JIT Local Rehydration for typed sensitive tokens
    const payload = { ...stepItem };
    if (payload.value && typeof payload.value === 'string') {
      const rehydrated = globalVault.rehydrate(payload.value);
      if (rehydrated !== payload.value) {
        log(`🔓 [VAULT REHYDRATE] Substituted pseudonym "${payload.value}" with actual value inside page DOM sandbox.`, 'privacy');
        payload.value = rehydrated;
      }
    }

    const response = await chrome.tabs.sendMessage(activeTab.id, {
      type: 'EXECUTE_ACTION',
      payload
    });

    if (response && response.success) {
      if (card) card.className = 'step-card completed';
      log(`[SUCCESS] Step ${idx + 1} (${stepItem.action}) executed successfully.`, 'success');

      currentStepIndex = idx + 1;
      if (currentStepIndex < currentPlan.length) {
        const nextCard = document.getElementById(`step-card-${currentStepIndex}`);
        if (nextCard) nextCard.className = 'step-card active';
      } else {
        log('🎉 All planned tasks completed!', 'success');
        await chrome.tabs.sendMessage(activeTab.id, {
          type: 'EXECUTE_ACTION',
          payload: { action: 'CLEAR_HIGHLIGHT' }
        });
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

// Skip a step
function skipStep(idx) {
  const card = document.getElementById(`step-card-${idx}`);
  const ctrls = document.getElementById(`step-ctrls-${idx}`);
  if (card) card.className = 'step-card';
  if (ctrls) ctrls.style.display = 'none';
  log(`Step ${idx + 1} skipped by user.`, 'warn');

  currentStepIndex = idx + 1;
  if (currentStepIndex < currentPlan.length) {
    const nextCard = document.getElementById(`step-card-${currentStepIndex}`);
    if (nextCard) nextCard.className = 'step-card active';
  }
}

// Execute all remaining steps sequentially
async function executeAllSteps() {
  setBusyState(true);
  for (let i = currentStepIndex; i < currentPlan.length; i++) {
    await executeSingleStep(i);
    await new Promise(r => setTimeout(r, 400)); // Smooth operational delay
  }
  setBusyState(false);
}

// Clear current plan
async function clearPlan() {
  currentPlan = [];
  currentStepIndex = 0;
  planSection.style.display = 'none';
  stepsList.innerHTML = '';
  if (activeTab && activeTab.id) {
    chrome.tabs.sendMessage(activeTab.id, {
      type: 'EXECUTE_ACTION',
      payload: { action: 'CLEAR_HIGHLIGHT' }
    }).catch(() => {});
  }
  log('Plan dismissed.', 'info');
}

// Update the Vault status cards and ledger
function updateVaultUI() {
  const stats = globalVault.getVaultStats();
  metricBlocked.textContent = stats.leakBlockCount;
  metricTokens.textContent = stats.activeTokensCount;

  if (stats.ledger.length > 0) {
    vaultEmpty.style.display = 'none';
    vaultTable.style.display = 'table';
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
  } else {
    vaultEmpty.style.display = 'block';
    vaultTable.style.display = 'none';
  }
}

function setBusyState(busy) {
  isExecuting = busy;
  runBtn.disabled = busy;
  if (stopBtn) stopBtn.style.display = busy ? 'inline-flex' : 'none';
  if (busy) {
    statusPill.className = 'status-indicator busy';
    statusText.textContent = 'ACTING';
    runBtn.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="spin">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
      <span>Executing...</span>
    `;
  } else {
    statusPill.className = 'status-indicator online';
    statusText.textContent = 'READY';
    runBtn.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
        <polygon points="5 3 19 12 5 21 5 3"/>
      </svg>
      <span>Run Agent</span>
    `;
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
