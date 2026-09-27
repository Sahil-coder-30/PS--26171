/**
 * PRATYAKSHA Browser Agent Tools Registry
 * ISRO Problem Statement 26171
 * 
 * Formal Gemini Function Declarations, Mistral/OpenAI Tool Declarations,
 * and Autonomous Browser Execution Dispatcher.
 */

export const BROWSER_TOOL_DECLARATIONS = [
  {
    name: 'navigate_to',
    description: 'Navigates to a specific website URL, or conducts a Google search in the active tab if given a query string.',
    parameters: {
      type: 'OBJECT',
      properties: {
        url_or_query: {
          type: 'STRING',
          description: 'A destination URL (e.g. "https://www.google.com") or search query string (e.g. "ISRO Chandrayaan 3 mission updates").'
        },
        rationale: {
          type: 'STRING',
          description: 'Brief explanation of why navigating here is required.'
        }
      },
      required: ['url_or_query']
    }
  },
  {
    name: 'click_element',
    description: 'Clicks an interactive element on the page (buttons, links, tabs, search buttons, compose buttons). Preferred: provide target_id.',
    parameters: {
      type: 'OBJECT',
      properties: {
        target_id: {
          type: 'NUMBER',
          description: 'The numeric element ID [ID] from the indexed DOM table (e.g. 1, 4, 12). Preferred for 100% accuracy.'
        },
        selector: {
          type: 'STRING',
          description: 'CSS selector of the target element (fallback if target_id is omitted).'
        },
        semantic_hint: {
          type: 'STRING',
          description: 'Semantic text description like "Compose", "Send", "Search", "Next".'
        },
        description: {
          type: 'STRING',
          description: 'Concise explanation of what is being clicked.'
        }
      }
    }
  },
  {
    name: 'type_into_element',
    description: 'Types text into an input box, search field, textarea, or contenteditable message area. Preferred: provide target_id.',
    parameters: {
      type: 'OBJECT',
      properties: {
        target_id: {
          type: 'NUMBER',
          description: 'The numeric element ID [ID] from the indexed DOM table. Preferred for 100% accuracy.'
        },
        selector: {
          type: 'STRING',
          description: 'CSS selector of the input element (fallback if target_id is omitted).'
        },
        semantic_hint: {
          type: 'STRING',
          description: 'Semantic label of the field (e.g. "To", "Recipient", "Subject", "Message Body", "Search").'
        },
        text: {
          type: 'STRING',
          description: 'The text value to enter into the field.'
        },
        press_enter: {
          type: 'BOOLEAN',
          description: 'Set to true to press Enter immediately after typing (essential for search bars or recipient chips).'
        }
      },
      required: ['text']
    }
  },
  {
    name: 'scroll_page',
    description: 'Scrolls the viewport up or down to inspect more content, reveal forms, or locate additional elements.',
    parameters: {
      type: 'OBJECT',
      properties: {
        direction: {
          type: 'STRING',
          enum: ['down', 'up'],
          description: 'Direction to scroll ("down" or "up").'
        },
        pixels: {
          type: 'NUMBER',
          description: 'Number of pixels to scroll (e.g. 500).'
        }
      },
      required: ['direction']
    }
  },
  {
    name: 'wait_seconds',
    description: 'Pauses execution to allow dynamic page content, animations, modal transitions, or search results to load.',
    parameters: {
      type: 'OBJECT',
      properties: {
        seconds: {
          type: 'NUMBER',
          description: 'Number of seconds to wait (1 to 5).'
        }
      },
      required: ['seconds']
    }
  },
  {
    name: 'finish_task',
    description: 'Concludes the task when the objective has been reached or relevant information has been collected. Only call this when genuinely finished or truly blocked after trying all alternatives.',
    parameters: {
      type: 'OBJECT',
      properties: {
        summary: {
          type: 'STRING',
          description: 'Clear, informative summary of what was completed or discovered on the page.'
        },
        success: {
          type: 'BOOLEAN',
          description: 'Whether the goal was achieved.'
        }
      },
      required: ['summary', 'success']
    }
  }
];

/**
 * Standard OpenAI/Mistral Tool Declarations format
 */
export const MISTRAL_TOOL_DECLARATIONS = BROWSER_TOOL_DECLARATIONS.map(tool => ({
  type: 'function',
  function: {
    name: tool.name,
    description: tool.description,
    parameters: {
      type: 'object',
      properties: Object.fromEntries(
        Object.entries(tool.parameters.properties).map(([k, v]) => [
          k,
          {
            type: v.type.toLowerCase(),
            description: v.description,
            ...(v.enum ? { enum: v.enum } : {})
          }
        ])
      ),
      required: tool.parameters.required || []
    }
  }
}));

/**
 * Executes a tool action against the active tab DOM / browser
 * @param {string} toolName 
 * @param {Object} args 
 * @param {Object} activeTab 
 * @param {Object} vault (PIIVault instance for JIT rehydration)
 * @returns {Promise<{ observation: string, isFinished?: boolean, success?: boolean, summary?: string }>}
 */
export async function executeBrowserTool(toolName, args = {}, activeTab, vault) {
  if (!activeTab || !activeTab.id) {
    throw new Error('No active browser tab connected.');
  }

  const tabId = activeTab.id;

  switch (toolName) {
    case 'navigate_to': {
      const rawTarget = (args.url_or_query || '').trim();
      let targetUrl = rawTarget;

      if (!/^https?:\/\//i.test(rawTarget)) {
        if (/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/i.test(rawTarget)) {
          targetUrl = `https://${rawTarget}`;
        } else {
          // Search query - navigate to Google
          targetUrl = `https://www.google.com/search?q=${encodeURIComponent(rawTarget)}`;
        }
      }

      await chrome.tabs.update(tabId, { url: targetUrl });
      await waitForTabComplete(tabId);
      await ensureTabScript(tabId);
      await new Promise(r => setTimeout(r, 600)); // Allow dynamic rendering

      return {
        observation: `Navigated successfully to: ${targetUrl}`
      };
    }

    case 'click_element': {
      const targetId = args.target_id;
      const selector = args.selector;
      const semanticHint = args.semantic_hint || args.description;

      const resp = await chrome.tabs.sendMessage(tabId, {
        type: 'EXECUTE_ACTION',
        payload: {
          action: 'CLICK',
          target_id: targetId,
          selector,
          semantic_hint: semanticHint
        }
      });

      if (!resp || !resp.success) {
        throw new Error(resp?.error || `Failed to click target (${targetId ? `ID #${targetId}` : selector || semanticHint})`);
      }

      await new Promise(r => setTimeout(r, 500));
      const targetDesc = targetId ? `[#${targetId}]` : (selector || semanticHint || 'element');
      return {
        observation: `Clicked target ${targetDesc} successfully.`
      };
    }

    case 'type_into_element': {
      let textToType = args.text || '';
      // JIT Vault rehydration: unmask any pseudonym tokens securely inside local tab
      if (vault && typeof vault.rehydrate === 'function') {
        const rehydrated = vault.rehydrate(textToType);
        if (rehydrated !== textToType) {
          textToType = rehydrated;
        }
      }

      const targetId = args.target_id;
      const selector = args.selector;
      const semanticHint = args.semantic_hint;

      const typeResp = await chrome.tabs.sendMessage(tabId, {
        type: 'EXECUTE_ACTION',
        payload: {
          action: 'TYPE',
          target_id: targetId,
          selector,
          semantic_hint: semanticHint,
          value: textToType
        }
      });

      if (!typeResp || !typeResp.success) {
        throw new Error(typeResp?.error || `Failed to type into target (${targetId ? `ID #${targetId}` : selector || semanticHint})`);
      }

      if (args.press_enter) {
        await new Promise(r => setTimeout(r, 150));
        await chrome.tabs.sendMessage(tabId, {
          type: 'EXECUTE_ACTION',
          payload: {
            action: 'PRESS_ENTER',
            target_id: targetId,
            selector,
            semantic_hint: semanticHint
          }
        });
        await new Promise(r => setTimeout(r, 600)); // Wait for submit / navigation
      }

      const targetDesc = targetId ? `[#${targetId}]` : (selector || semanticHint || 'field');
      return {
        observation: `Typed into ${targetDesc}${args.press_enter ? ' and pressed Enter' : ''}.`
      };
    }

    case 'scroll_page': {
      const direction = args.direction || 'down';
      const deltaY = (direction === 'up' ? -1 : 1) * (args.pixels || 500);

      await chrome.tabs.sendMessage(tabId, {
        type: 'EXECUTE_ACTION',
        payload: { action: 'SCROLL', deltaY }
      });

      return {
        observation: `Scrolled page ${direction} by ${Math.abs(deltaY)}px.`
      };
    }

    case 'wait_seconds': {
      const ms = Math.min(Math.max((args.seconds || 1) * 1000, 500), 5000);
      await new Promise(r => setTimeout(r, ms));
      return {
        observation: `Waited for ${ms / 1000} seconds.`
      };
    }

    case 'finish_task': {
      chrome.tabs.sendMessage(tabId, {
        type: 'EXECUTE_ACTION',
        payload: { action: 'CLEAR_HIGHLIGHT' }
      }).catch(() => {});

      return {
        observation: `Task completed: ${args.summary}`,
        isFinished: true,
        summary: args.summary,
        success: args.success !== false
      };
    }

    default:
      throw new Error(`Unsupported tool: ${toolName}`);
  }
}

/**
 * Waits until tab status is 'complete'
 */
function waitForTabComplete(tabId, timeoutMs = 12000) {
  return new Promise((resolve) => {
    let resolved = false;

    const timer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        chrome.tabs.onUpdated.removeListener(listener);
        resolve();
      }
    }, timeoutMs);

    function listener(updatedId, info) {
      if (updatedId === tabId && info.status === 'complete') {
        if (!resolved) {
          resolved = true;
          clearTimeout(timer);
          chrome.tabs.onUpdated.removeListener(listener);
          resolve();
        }
      }
    }

    chrome.tabs.onUpdated.addListener(listener);
  });
}

/**
 * Ensures content script is injected in case of navigation
 */
async function ensureTabScript(tabId) {
  try {
    await chrome.runtime.sendMessage({
      type: 'ENSURE_CONTENT_SCRIPT',
      tabId
    });
  } catch (e) {
    await new Promise(r => setTimeout(r, 200));
    try {
      await chrome.runtime.sendMessage({
        type: 'ENSURE_CONTENT_SCRIPT',
        tabId
      });
    } catch {}
  }
}
