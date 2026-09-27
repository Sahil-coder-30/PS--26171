/**
 * PRATYAKSHA Service Worker (Manifest V3)
 * ISRO Problem Statement 26171
 */

// Configure Side Panel to open when the toolbar action is clicked
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error('[PRATYAKSHA SW] Error enabling sidePanel:', error));

chrome.runtime.onInstalled.addListener((details) => {
  console.log('[PRATYAKSHA] Extension installed/updated:', details.reason);

  chrome.storage.local.get(['privacyMode', 'engineMode', 'approvalMode'], (res) => {
    chrome.storage.local.set({
      privacyMode: res.privacyMode || 'strict',
      engineMode: res.engineMode || 'deterministic',
      approvalMode: res.approvalMode !== undefined ? res.approvalMode : true
    });
  });
});

// Relay tab changes to active side panel if needed
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    chrome.runtime.sendMessage({
      type: 'TAB_CHANGED',
      tab: { id: tab.id, url: tab.url, title: tab.title }
    }).catch(() => {
      // Side panel may be closed, ignore
    });
  } catch (err) {
    // Tab might be closing
  }
});

// Global message hub
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ENSURE_CONTENT_SCRIPT') {
    const tabId = message.tabId;
    ensureContentScriptInjected(tabId)
      .then(ready => sendResponse({ ready }))
      .catch(err => sendResponse({ ready: false, error: err.message }));
    return true;
  }
});

async function ensureContentScriptInjected(tabId) {
  try {
    // 1. Try to ping the tab first
    const pong = await chrome.tabs.sendMessage(tabId, { type: 'PING' });
    if (pong && pong.ready) return true;
  } catch (e) {
    // Tab not injected yet, inject programmatically
  }

  try {
    await chrome.scripting.insertCSS({
      target: { tabId },
      files: ['content/highlighter.css']
    });

    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['content/dom-actions.js', 'content/content-main.js']
    });

    return true;
  } catch (err) {
    console.error('[PRATYAKSHA SW] Failed to inject content script:', err);
    throw err;
  }
}
