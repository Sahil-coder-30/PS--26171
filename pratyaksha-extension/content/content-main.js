/**
 * PRATYAKSHA Content Script Message Router
 * ISRO Problem Statement 26171
 */

(function() {
  if (window.__PRATYAKSHA_INITIALIZED__) return;
  window.__PRATYAKSHA_INITIALIZED__ = true;

  console.log('[PRATYAKSHA] Content script active on:', window.location.href);

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { type, payload } = message;

    if (type === 'PING') {
      sendResponse({ status: 'PONG', ready: true, url: window.location.href });
      return true;
    }

    if (type === 'GET_PAGE_CONTEXT') {
      try {
        const elements = window.PratyakshaDOM ? window.PratyakshaDOM.scanInteractiveElements() : [];
        sendResponse({
          url: window.location.href,
          title: document.title,
          elements
        });
      } catch (err) {
        sendResponse({ error: err.message });
      }
      return true;
    }

    if (type === 'EXECUTE_ACTION') {
      handleActionExecution(payload)
        .then(result => sendResponse({ success: true, result }))
        .catch(err => {
          console.error('[PRATYAKSHA] Action execution error:', err);
          sendResponse({ success: false, error: err.message });
        });
      return true; // Asynchronous response
    }
  });

  async function handleActionExecution(actionItem) {
    if (!window.PratyakshaDOM) {
      throw new Error('PRATYAKSHA DOM engine is not initialized');
    }

    const { action, selector, value, deltaY, durationMs } = actionItem;

    switch (action) {
      case 'CLICK':
        return await window.PratyakshaDOM.click(selector);

      case 'TYPE':
        return await window.PratyakshaDOM.type(selector, value);

      case 'PRESS_ENTER':
        return await window.PratyakshaDOM.pressEnter(selector);

      case 'HIGHLIGHT':
        return window.PratyakshaDOM.highlight(selector, `🎯 TARGET: ${actionItem.description || selector}`);

      case 'SCROLL_INTO_VIEW':
        return await window.PratyakshaDOM.scrollIntoView(selector);

      case 'SCROLL':
        return await window.PratyakshaDOM.scroll(deltaY || 500);

      case 'WAIT':
        await new Promise(r => setTimeout(r, durationMs || 500));
        return true;

      case 'CLEAR_HIGHLIGHT':
        window.PratyakshaDOM.clearHighlight();
        return true;

      case 'EXTRACT':
        return window.PratyakshaDOM.extractPageSummary();

      default:
        throw new Error(`Unsupported action type: ${action}`);
    }
  }
})();
