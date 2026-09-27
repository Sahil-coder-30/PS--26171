/**
 * PRATYAKSHA DOM Action Dispatcher & Perception Engine
 * ISRO Problem Statement 26171
 */

window.PratyakshaDOM = (function() {
  let highlightBox = null;
  let actionBadge = null;

  function ensureHighlightElements() {
    if (!highlightBox || !document.body.contains(highlightBox)) {
      highlightBox = document.createElement('div');
      highlightBox.id = 'pratyaksha-highlighter-box';
      highlightBox.className = 'pulse';

      actionBadge = document.createElement('div');
      actionBadge.id = 'pratyaksha-action-badge';
      highlightBox.appendChild(actionBadge);

      document.body.appendChild(highlightBox);
    }
  }

  function getUniqueSelector(el) {
    if (!el || el.nodeType !== Node.ELEMENT_NODE) return '';

    if (el.id && document.querySelectorAll(`#${CSS.escape(el.id)}`).length === 1) {
      return `#${CSS.escape(el.id)}`;
    }

    const tag = el.tagName.toLowerCase();

    if (el.name && document.querySelectorAll(`${tag}[name="${CSS.escape(el.name)}"]`).length === 1) {
      return `${tag}[name="${CSS.escape(el.name)}"]`;
    }

    if (el.getAttribute('aria-label')) {
      const aria = el.getAttribute('aria-label');
      if (document.querySelectorAll(`${tag}[aria-label="${CSS.escape(aria)}"]`).length === 1) {
        return `${tag}[aria-label="${CSS.escape(aria)}"]`;
      }
    }

    if (el.getAttribute('placeholder')) {
      const ph = el.getAttribute('placeholder');
      if (document.querySelectorAll(`${tag}[placeholder="${CSS.escape(ph)}"]`).length === 1) {
        return `${tag}[placeholder="${CSS.escape(ph)}"]`;
      }
    }

    // Path fallback
    const path = [];
    let current = el;
    while (current && current.nodeType === Node.ELEMENT_NODE && current !== document.body) {
      let selector = current.tagName.toLowerCase();
      if (current.id) {
        selector += `#${CSS.escape(current.id)}`;
        path.unshift(selector);
        break;
      } else {
        let sibling = current;
        let nth = 1;
        while ((sibling = sibling.previousElementSibling)) {
          if (sibling.tagName.toLowerCase() === selector) nth++;
        }
        if (nth > 1) selector += `:nth-of-type(${nth})`;
      }
      path.unshift(selector);
      current = current.parentElement;
    }
    return path.join(' > ');
  }

  function findElement(selector) {
    if (!selector) return null;
    try {
      const el = document.querySelector(selector);
      if (el) return el;
    } catch (e) {
      // invalid selector, fallback
    }

    // Try finding by text or aria if selector was a phrase
    const cleanPhrase = selector.replace(/[#\.\>]/g, ' ').trim().toLowerCase();
    const candidates = Array.from(document.querySelectorAll('button, a, input, [role="button"]'));
    return candidates.find(c => 
      (c.innerText && c.innerText.toLowerCase().includes(cleanPhrase)) ||
      (c.getAttribute('aria-label') && c.getAttribute('aria-label').toLowerCase().includes(cleanPhrase))
    ) || null;
  }

  return {
    /**
     * Scans DOM for visible interactive elements
     */
    scanInteractiveElements() {
      const selectors = [
        'a[href]', 'button', 'input:not([type="hidden"])',
        'select', 'textarea', '[role="button"]', '[tabindex="0"]'
      ];
      const elements = Array.from(document.querySelectorAll(selectors.join(',')));
      const results = [];

      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        if (
          rect.width === 0 || rect.height === 0 ||
          style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0'
        ) {
          continue;
        }

        const tag = el.tagName.toLowerCase();
        const text = (el.innerText || el.value || '').trim().slice(0, 80);
        const ariaLabel = el.getAttribute('aria-label') || '';
        const placeholder = el.getAttribute('placeholder') || '';
        const name = el.getAttribute('name') || '';
        const id = el.id || '';
        const type = el.getAttribute('type') || '';
        const selector = getUniqueSelector(el);

        results.push({
          tag,
          type,
          id,
          name,
          text,
          ariaLabel,
          placeholder,
          selector,
          rect: {
            x: Math.round(rect.x),
            y: Math.round(rect.y),
            width: Math.round(rect.width),
            height: Math.round(rect.height)
          }
        });

        if (results.length >= 60) break; // Keep payload light
      }

      return results;
    },

    /**
     * Highlights an element with an ISRO neon pulse border and action pill
     */
    highlight(selector, label = 'TARGET') {
      const el = findElement(selector);
      if (!el) return false;

      ensureHighlightElements();
      const rect = el.getBoundingClientRect();
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;

      highlightBox.style.width = `${rect.width + 6}px`;
      highlightBox.style.height = `${rect.height + 6}px`;
      highlightBox.style.top = `${rect.top + scrollY - 3}px`;
      highlightBox.style.left = `${rect.left + scrollX - 3}px`;
      highlightBox.style.display = 'block';

      actionBadge.textContent = label;
      return true;
    },

    clearHighlight() {
      if (highlightBox) {
        highlightBox.style.display = 'none';
      }
    },

    /**
     * Scroll an element into the center of viewport
     */
    async scrollIntoView(selector) {
      const el = findElement(selector);
      if (!el) return false;

      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await new Promise(r => setTimeout(r, 250));
      return true;
    },

    /**
     * Dispatches click events
     */
    async click(selector) {
      const el = findElement(selector);
      if (!el) throw new Error(`Element not found: ${selector}`);

      this.scrollIntoView(selector);
      this.highlight(selector, '⚡ PRATYAKSHA: CLICK');
      await new Promise(r => setTimeout(r, 200));

      const eventOpts = { bubbles: true, cancelable: true, view: window };
      el.dispatchEvent(new PointerEvent('pointerdown', eventOpts));
      el.dispatchEvent(new MouseEvent('mousedown', eventOpts));
      el.focus();
      el.dispatchEvent(new PointerEvent('pointerup', eventOpts));
      el.dispatchEvent(new MouseEvent('mouseup', eventOpts));
      el.dispatchEvent(new MouseEvent('click', eventOpts));

      await new Promise(r => setTimeout(r, 300));
      return true;
    },

    /**
     * Dispatches typing with framework compatibility (React, Vue, Angular)
     */
    async type(selector, value) {
      const el = findElement(selector);
      if (!el) throw new Error(`Input field not found: ${selector}`);

      this.scrollIntoView(selector);
      this.highlight(selector, '🔒 PRATYAKSHA: REHYDRATING & TYPING');
      await new Promise(r => setTimeout(r, 200));

      el.focus();

      // Native prototype setter override to trigger React/Angular/Vue internal state
      const isTextArea = el instanceof HTMLTextAreaElement;
      const prototype = isTextArea ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
      const nativeSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;

      if (nativeSetter) {
        nativeSetter.call(el, value);
      } else {
        el.value = value;
      }

      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));

      await new Promise(r => setTimeout(r, 250));
      return true;
    },

    /**
     * Dispatches Enter keydown and form submission
     */
    async pressEnter(selector) {
      const el = findElement(selector);
      if (!el) throw new Error(`Element not found: ${selector}`);

      const eventOpts = {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true,
        cancelable: true
      };

      el.dispatchEvent(new KeyboardEvent('keydown', eventOpts));
      el.dispatchEvent(new KeyboardEvent('keypress', eventOpts));
      el.dispatchEvent(new KeyboardEvent('keyup', eventOpts));

      // If inside a form, submit
      if (el.form) {
        if (typeof el.form.requestSubmit === 'function') {
          el.form.requestSubmit();
        } else {
          el.form.submit();
        }
      }

      await new Promise(r => setTimeout(r, 300));
      return true;
    },

    /**
     * Viewport scroll
     */
    async scroll(deltaY) {
      window.scrollBy({ top: deltaY, behavior: 'smooth' });
      await new Promise(r => setTimeout(r, 300));
      return true;
    },

    /**
     * Extracts text content & headings for summary queries
     */
    extractPageSummary() {
      const title = document.title || '';
      const h1s = Array.from(document.querySelectorAll('h1')).map(h => h.innerText.trim()).filter(Boolean);
      const h2s = Array.from(document.querySelectorAll('h2')).slice(0, 5).map(h => h.innerText.trim()).filter(Boolean);
      const metaDesc = document.querySelector('meta[name="description"]')?.content || '';

      return {
        title,
        metaDesc,
        mainHeadings: h1s,
        subHeadings: h2s,
        url: window.location.href
      };
    }
  };
})();
