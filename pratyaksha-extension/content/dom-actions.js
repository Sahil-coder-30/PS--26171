/**
 * PRATYAKSHA DOM Action Dispatcher & Perception Engine
 * ISRO Problem Statement 26171
 * 
 * High-precision browser perception, element tagging, semantic matching,
 * and resilient cross-framework interaction (React, Vue, Angular, Gmail/RichText).
 */

window.PratyakshaDOM = (function() {
  let highlightBox = null;
  let actionBadge = null;
  const elementIdMap = new Map();

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

  /**
   * Derives a unified, human-readable label for an element
   */
  function extractElementLabel(el) {
    // 1. Aria-label / title / tooltip
    const aria = el.getAttribute('aria-label') || el.getAttribute('title') || el.getAttribute('data-tooltip') || '';
    if (aria.trim()) return aria.trim();

    // 2. Associated <label>
    if (el.id) {
      const labelEl = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
      if (labelEl && labelEl.innerText.trim()) return labelEl.innerText.trim();
    }
    const parentLabel = el.closest('label');
    if (parentLabel && parentLabel.innerText.trim()) {
      return parentLabel.innerText.replace(el.innerText || '', '').trim();
    }

    // 3. Placeholder / name
    const placeholder = el.getAttribute('placeholder') || '';
    if (placeholder.trim()) return placeholder.trim();

    const name = el.getAttribute('name') || '';
    if (name.trim()) return name.trim();

    // 4. Visible text
    const text = (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ');
    if (text) return text.slice(0, 70);

    // 5. Preceding sibling text (common in custom form controls like "To: [input]")
    const prev = el.previousElementSibling;
    if (prev && (prev.tagName === 'LABEL' || prev.tagName === 'SPAN') && prev.innerText.trim()) {
      return prev.innerText.trim();
    }

    return '';
  }

  /**
   * Fuzzy matches semantic intent across candidate elements
   */
  function findSemanticElement(hint) {
    if (!hint || typeof hint !== 'string') return null;
    const lower = hint.toLowerCase().trim();

    // Synonyms dictionary for critical web actions
    const intentMap = {
      compose: ['compose', 'new email', 'new message', 'write email', 'create message', 'new', 'draft'],
      recipient: ['to', 'recipient', 'recipients', 'email to', 'send to', 'to recipients'],
      subject: ['subject', 'subjectbox', 'subject line', 'topic'],
      body: ['message body', 'compose body', 'email body', 'message', 'write your email', 'content'],
      send: ['send', 'send (ctrl-enter)', 'submit', 'send message'],
      search: ['search', 'search query', 'search mail', 'find', 'query', 'google search']
    };

    let targetKeywords = [lower];
    for (const [key, synonyms] of Object.entries(intentMap)) {
      if (synonyms.some(s => lower.includes(s) || s.includes(lower))) {
        targetKeywords = [...new Set([...targetKeywords, ...synonyms])];
        break;
      }
    }

    const allCandidates = Array.from(document.querySelectorAll(
      'input, textarea, [contenteditable="true"], [role="textbox"], [role="combobox"], button, [role="button"], a[href]'
    )).filter(el => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
    });

    let bestMatch = null;
    let highestScore = 0;

    for (const el of allCandidates) {
      const label = extractElementLabel(el).toLowerCase();
      const tag = el.tagName.toLowerCase();
      const role = (el.getAttribute('role') || '').toLowerCase();
      const aria = (el.getAttribute('aria-label') || '').toLowerCase();
      const ph = (el.getAttribute('placeholder') || '').toLowerCase();
      const name = (el.getAttribute('name') || '').toLowerCase();
      const id = (el.id || '').toLowerCase();

      let score = 0;

      for (const kw of targetKeywords) {
        if (label === kw) score += 50;
        else if (label.includes(kw)) score += 30;

        if (aria === kw) score += 40;
        else if (aria.includes(kw)) score += 25;

        if (ph === kw) score += 35;
        else if (ph.includes(kw)) score += 20;

        if (name === kw || id === kw) score += 30;
        else if (name.includes(kw) || id.includes(kw)) score += 15;
      }

      // Contextual boosts
      if (lower.includes('recipient') || lower.includes('to')) {
        if (tag === 'input' || role === 'combobox' || role === 'textbox') score += 20;
      } else if (lower.includes('compose') || lower.includes('send')) {
        if (tag === 'button' || role === 'button') score += 20;
      } else if (lower.includes('body') || lower.includes('message')) {
        if (el.getAttribute('contenteditable') === 'true' || tag === 'textarea' || role === 'textbox') score += 25;
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = el;
      }
    }

    return highestScore >= 15 ? bestMatch : null;
  }

  /**
   * Resolves target element by:
   * 1. Numeric ID (e.g. 5 or "5" or data-pratyaksha-id)
   * 2. CSS selector (e.g. "#to", "input[name='to']")
   * 3. Target object { target_id, selector, semantic_hint }
   * 4. Semantic text hint fallback
   */
  function findElement(target) {
    if (!target && target !== 0) return null;

    // Handle object payload
    if (typeof target === 'object' && target !== null) {
      if (target.target_id !== undefined && target.target_id !== null) {
        const byId = findElement(target.target_id);
        if (byId) return byId;
      }
      if (target.selector) {
        const bySel = findElement(target.selector);
        if (bySel) return bySel;
      }
      if (target.semantic_hint) {
        return findSemanticElement(target.semantic_hint);
      }
      return null;
    }

    // 1. Check numeric ID from elementIdMap or DOM attribute
    const numId = Number(target);
    if (!isNaN(numId) && String(target).trim() !== '') {
      if (elementIdMap.has(numId)) {
        const cached = elementIdMap.get(numId);
        if (document.body.contains(cached)) return cached;
      }
      const tagged = document.querySelector(`[data-pratyaksha-id="${numId}"]`);
      if (tagged) return tagged;
    }

    const strTarget = String(target).trim();

    // 2. Exact data-pratyaksha-id attribute lookup
    if (/^\[data-pratyaksha-id=/.test(strTarget)) {
      try {
        const el = document.querySelector(strTarget);
        if (el) return el;
      } catch (e) {}
    }

    // 3. Try standard CSS selector
    try {
      const el = document.querySelector(strTarget);
      if (el) return el;
    } catch (e) {
      // Invalid selector string; proceed to semantic matcher
    }

    // 4. Try semantic hint matcher
    const semanticEl = findSemanticElement(strTarget);
    if (semanticEl) return semanticEl;

    // 5. Clean text match over interactive elements
    const clean = strTarget.replace(/[#\.\>\[\]]/g, ' ').trim().toLowerCase();
    const candidates = Array.from(document.querySelectorAll('button, a, input, textarea, [role="button"], [role="textbox"]'));
    return candidates.find(c => {
      const txt = (c.innerText || c.value || '').toLowerCase();
      const aria = (c.getAttribute('aria-label') || '').toLowerCase();
      return (txt && txt.includes(clean)) || (aria && aria.includes(clean));
    }) || null;
  }

  return {
    /**
     * Scans DOM for visible interactive elements, scores them intelligently,
     * tags them with sequential IDs (data-pratyaksha-id), and indexes them.
     */
    scanInteractiveElements() {
      elementIdMap.clear();

      const selectorList = [
        'input:not([type="hidden"])',
        'textarea',
        'select',
        '[contenteditable="true"]',
        '[contenteditable=""]',
        '[role="combobox"]',
        '[role="searchbox"]',
        '[role="textbox"]',
        'button',
        '[role="button"]',
        'a[href]',
        '[role="tab"]',
        '[role="menuitem"]',
        '[role="checkbox"]',
        '[role="switch"]',
        'summary',
        '[tabindex="0"]'
      ];

      const rawElements = Array.from(document.querySelectorAll(selectorList.join(',')));
      const candidates = [];
      const viewHeight = window.innerHeight || 800;
      const viewWidth = window.innerWidth || 1280;

      for (const el of rawElements) {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);

        // Visibility filter
        if (
          rect.width === 0 || rect.height === 0 ||
          style.display === 'none' || style.visibility === 'hidden' ||
          style.opacity === '0' || rect.bottom < -200 || rect.top > viewHeight + 2500
        ) {
          continue;
        }

        const tag = el.tagName.toLowerCase();
        const role = el.getAttribute('role') || '';
        const type = el.getAttribute('type') || role || (el.getAttribute('contenteditable') ? 'contenteditable' : tag);
        const label = extractElementLabel(el);
        const text = (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60);
        const inViewport = rect.top >= -50 && rect.bottom <= viewHeight + 50 && rect.left >= -50 && rect.right <= viewWidth + 50;

        // Calculate priority score
        let priority = 0;

        // High priority for form inputs and editable zones
        if (tag === 'input' || tag === 'textarea' || role === 'textbox' || role === 'combobox' || el.getAttribute('contenteditable') === 'true') {
          priority += 50;
        } else if (tag === 'button' || role === 'button') {
          priority += 35;
        } else if (tag === 'a') {
          priority += 15;
        }

        // Action keyword bonuses
        const combinedDesc = `${label} ${text} ${el.id} ${el.getAttribute('name') || ''}`.toLowerCase();
        if (/compose|new email|new message|send|submit|search|login|signin|sign in|next|create/i.test(combinedDesc)) {
          priority += 40;
        }

        // Viewport bonus
        if (inViewport) priority += 25;

        // Footer / boilerplate penalty
        if (/privacy|terms|copyright|cookie|footer|policies/i.test(combinedDesc)) {
          priority -= 35;
        }

        candidates.push({
          el,
          tag,
          type,
          label: label || text || el.id || el.getAttribute('name') || '',
          text,
          inViewport,
          priority,
          rect
        });
      }

      // Sort by priority descending
      candidates.sort((a, b) => b.priority - a.priority);

      // Take top 80 elements to ensure complete coverage without blowing token budget
      const topCandidates = candidates.slice(0, 80);
      const results = [];

      topCandidates.forEach((item, index) => {
        const id = index + 1;
        const el = item.el;
        el.setAttribute('data-pratyaksha-id', String(id));
        elementIdMap.set(id, el);

        results.push({
          id,
          tag: item.tag,
          type: item.type,
          label: item.label,
          text: item.text,
          selector: `[data-pratyaksha-id="${id}"]`,
          nativeSelector: getUniqueSelector(el),
          inViewport: item.inViewport,
          value: el.value || (el.getAttribute('contenteditable') ? el.innerText.slice(0, 30) : '')
        });
      });

      return results;
    },

    /**
     * Highlights element with visual pulse & action badge
     */
    highlight(target, label = 'TARGET') {
      const el = findElement(target);
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
     * Scroll element into center of viewport
     */
    async scrollIntoView(target) {
      const el = findElement(target);
      if (!el) return false;

      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await new Promise(r => setTimeout(r, 200));
      return true;
    },

    /**
     * Dispatches click events with complete synthetic event chain
     */
    async click(target) {
      const el = findElement(target);
      if (!el) {
        throw new Error(`Target not found for click: ${typeof target === 'object' ? JSON.stringify(target) : target}`);
      }

      await this.scrollIntoView(el);
      const tagId = el.getAttribute('data-pratyaksha-id') || '';
      this.highlight(el, `⚡ PRATYAKSHA: CLICK [${tagId ? `#${tagId}` : 'TARGET'}]`);
      await new Promise(r => setTimeout(r, 180));

      const eventOpts = { bubbles: true, cancelable: true, view: window };
      el.dispatchEvent(new PointerEvent('pointerdown', eventOpts));
      el.dispatchEvent(new MouseEvent('mousedown', eventOpts));
      el.focus();
      el.dispatchEvent(new PointerEvent('pointerup', eventOpts));
      el.dispatchEvent(new MouseEvent('mouseup', eventOpts));
      el.dispatchEvent(new MouseEvent('click', eventOpts));

      // If it's a native submit button inside a form, ensure form submission
      if (el.tagName === 'BUTTON' && el.type === 'submit' && el.form) {
        if (typeof el.form.requestSubmit === 'function') {
          try { el.form.requestSubmit(el); } catch (e) {}
        }
      }

      // Allow 400ms for dynamic DOM rendering / modal opening (e.g. Gmail Compose)
      await new Promise(r => setTimeout(r, 400));
      return true;
    },

    /**
     * Dispatches typing with framework compatibility:
     * Handles <input>, <textarea>, and rich-text <div contenteditable="true">
     */
    async type(target, value) {
      const el = findElement(target);
      if (!el) {
        throw new Error(`Target input not found for typing: ${typeof target === 'object' ? JSON.stringify(target) : target}`);
      }

      await this.scrollIntoView(el);
      const tagId = el.getAttribute('data-pratyaksha-id') || '';
      this.highlight(el, `🔒 PRATYAKSHA: REHYDRATING & TYPING [${tagId ? `#${tagId}` : 'INPUT'}]`);
      await new Promise(r => setTimeout(r, 180));

      el.focus();

      const isContentEditable = el.getAttribute('contenteditable') === 'true' ||
                                el.getAttribute('contenteditable') === '' ||
                                el.isContentEditable;

      if (isContentEditable) {
        // Rich text editor (Gmail compose body, Slack, Notion)
        try {
          const selection = window.getSelection();
          const range = document.createRange();
          range.selectNodeContents(el);
          selection.removeAllRanges();
          selection.addRange(range);
          document.execCommand('delete');
          document.execCommand('insertText', false, value);
        } catch (e) {
          el.innerText = value;
        }

        el.dispatchEvent(new InputEvent('input', { data: value, inputType: 'insertText', bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        // Native <input> or <textarea>
        const isTextArea = el instanceof HTMLTextAreaElement;
        const proto = isTextArea ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
        const nativeSetter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;

        if (nativeSetter) {
          nativeSetter.call(el, value);
        } else {
          el.value = value;
        }

        el.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true, data: value }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }

      await new Promise(r => setTimeout(r, 200));
      return true;
    },

    /**
     * Dispatches Enter keydown, keypress, keyup, and form submission
     */
    async pressEnter(target) {
      const el = findElement(target);
      if (!el) throw new Error(`Target not found for Enter: ${target}`);

      const eventOpts = {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13,
        bubbles: true,
        cancelable: true,
        view: window
      };

      el.dispatchEvent(new KeyboardEvent('keydown', eventOpts));
      el.dispatchEvent(new KeyboardEvent('keypress', eventOpts));
      el.dispatchEvent(new KeyboardEvent('keyup', eventOpts));

      if (el.form) {
        if (typeof el.form.requestSubmit === 'function') {
          try { el.form.requestSubmit(); } catch (e) {}
        } else {
          try { el.form.submit(); } catch (e) {}
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
     * Extracts page headings and summary
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
