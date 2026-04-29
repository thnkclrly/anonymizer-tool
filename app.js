/**
 * Text Anonymizer — Core Engine & UI Controller
 *
 * Three-layer anonymization pipeline:
 *   1. Corporate dictionary (exact term matching)
 *   2. Regex patterns (structured PII)
 *   3. NLP named entity recognition via Compromise.js
 *
 * All processing happens client-side. Zero data leaves the browser.
 */

// ─── Anonymization Engine ───────────────────────────────────────────────────

class AnonymizationEngine {
  constructor() {
    // Maps original text → placeholder tag for consistent replacement
    this.entityMap = new Map();
    // Tracks counters per category: { PERSON: 1, EMAIL: 2, ... }
    this.categoryCounts = {};
    // Stores all detections for the entity map panel
    this.detections = [];
    // Aggressive mode state
    this.aggressiveMode = true;
  }

  /**
   * Reset state for a new anonymization run.
   */
  reset() {
    this.entityMap.clear();
    this.categoryCounts = {};
    this.detections = [];
  }

  /**
   * Get or create a placeholder tag for a detected entity.
   */
  getPlaceholder(originalText, category) {
    const key = originalText.toLowerCase().trim();

    if (this.entityMap.has(key)) {
      return this.entityMap.get(key).placeholder;
    }

    if (!this.categoryCounts[category]) {
      this.categoryCounts[category] = 0;
    }
    this.categoryCounts[category]++;

    const placeholder = `<${category}_${this.categoryCounts[category]}>`;

    this.entityMap.set(key, {
      placeholder,
      original: originalText,
      category,
    });

    this.detections.push({
      original: originalText,
      placeholder,
      category,
    });

    return placeholder;
  }

  /**
   * Main anonymization pipeline. Returns { anonymizedText, htmlOutput, detections, stats }.
   */
  anonymize(inputText) {
    this.reset();

    if (!inputText || !inputText.trim()) {
      return {
        anonymizedText: "",
        segments: [],
        detections: [],
        stats: {},
      };
    }

    // We process text by tracking character-level replacements,
    // then reconstruct the output preserving order.
    let replacements = []; // { start, end, original, placeholder, category }

    // ── Layer 1: Corporate dictionary ──
    this._detectCorporateTerms(inputText, replacements);

    // ── Layer 2: Regex patterns ──
    this._detectRegexPatterns(inputText, replacements);

    // ── Layer 2b: Aggressive mode extras ──
    if (this.aggressiveMode) {
      this._detectAggressivePatterns(inputText, replacements);
    }

    // ── Layer 2c: Dictionary-based person names ──
    this._detectDictionaryNames(inputText, replacements);

    // ── Layer 3: NLP entities ──
    this._detectNLPEntities(inputText, replacements);

    // ── Deduplicate overlapping replacements ──
    replacements = this._resolveOverlaps(replacements);

    // ── Build output ──
    const segments = this._buildSegments(inputText, replacements);
    const anonymizedText = segments.map((s) => s.text).join("");

    // ── Stats ──
    const stats = {};
    for (const det of this.detections) {
      const cat = det.category;
      if (!stats[cat]) stats[cat] = 0;
      stats[cat]++;
    }

    return {
      anonymizedText,
      segments,
      detections: [...this.detections],
      stats,
    };
  }

  /**
   * Layer 1: Match corporate dictionary terms.
   */
  _detectCorporateTerms(text, replacements) {
    for (const entry of CORPORATE_TERMS) {
      // Escape special regex chars in the term
      const escaped = entry.term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\b${escaped}\\b`, "gi");
      let match;
      while ((match = regex.exec(text)) !== null) {
        const placeholder = this.getPlaceholder(match[0], entry.category);
        replacements.push({
          start: match.index,
          end: match.index + match[0].length,
          original: match[0],
          placeholder,
          category: entry.category,
          priority: 1, // highest
        });
      }
    }
  }

  /**
   * Layer 2: Match regex patterns for structured PII.
   */
  _detectRegexPatterns(text, replacements) {
    for (const pattern of REGEX_PATTERNS) {
      // Clone regex to reset lastIndex
      const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
      let match;
      while ((match = regex.exec(text)) !== null) {
        const matchText = match[0].trim();

        // Skip empty matches
        if (!matchText) continue;

        // Run optional validator
        if (pattern.validate && !pattern.validate(matchText)) continue;

        // Check context requirement
        if (pattern.contextRequired) {
          const contextWindow = text.substring(
            Math.max(0, match.index - 100),
            Math.min(text.length, match.index + match[0].length + 100)
          );
          const hasContext = pattern.contextPatterns.some((cp) =>
            cp.test(contextWindow)
          );
          if (!hasContext) continue;
        }

        const placeholder = this.getPlaceholder(matchText, pattern.category);
        replacements.push({
          start: match.index,
          end: match.index + match[0].length,
          original: match[0],
          placeholder,
          category: pattern.category,
          priority: 2,
        });
      }
    }
  }

  /**
   * Layer 2b: Aggressive mode — monetary amounts, capitalized phrases.
   */
  _detectAggressivePatterns(text, replacements) {
    // Monetary amounts
    if (AGGRESSIVE_MODE.catchMonetaryAmounts) {
      const regex = new RegExp(
        AGGRESSIVE_MODE.monetaryRegex.source,
        AGGRESSIVE_MODE.monetaryRegex.flags
      );
      let match;
      while ((match = regex.exec(text)) !== null) {
        const placeholder = this.getPlaceholder(match[0], "FINANCIAL");
        replacements.push({
          start: match.index,
          end: match.index + match[0].length,
          original: match[0],
          placeholder,
          category: "FINANCIAL",
          priority: 2,
        });
      }
    }
  }

  /**
   * Layer 2c: Dictionary-based multilingual person name detection.
   *
   * Checks each capitalized word against a curated international name set.
   * Unambiguous names are always flagged. Ambiguous names (which double as
   * common English words) are only flagged when adjacent to another
   * capitalized word (surname heuristic).
   */
  _detectDictionaryNames(text, replacements) {
    if (typeof PERSON_NAMES === "undefined") {
      console.warn("Name dictionary not loaded — skipping dictionary detection");
      return;
    }

    // Match capitalized words, including Unicode letters (ø, ł, ś, etc.)
    const wordRegex = /\b([A-ZÀ-ÖØ-Þ][a-zA-ZÀ-ÖØ-öø-ÿĀ-žŁłŚśŹźŻż'\-]{1,})\b/g;
    let match;

    while ((match = wordRegex.exec(text)) !== null) {
      const word = match[1];

      // Normalize to Title Case for lookup
      const normalized = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

      // Skip if this position is already covered by a higher-priority replacement
      const start = match.index;
      const end = match.index + word.length;
      const alreadyCovered = replacements.some(
        (r) => r.priority < 2.5 && r.start <= start && r.end >= end
      );
      if (alreadyCovered) continue;

      if (PERSON_NAMES.has(normalized)) {
        // Unambiguous name — always flag
        const placeholder = this.getPlaceholder(word, "PERSON");
        replacements.push({
          start,
          end,
          original: word,
          placeholder,
          category: "PERSON",
          priority: 2.5,
        });
      } else if (typeof AMBIGUOUS_NAMES !== "undefined" && AMBIGUOUS_NAMES.has(normalized)) {
        // Ambiguous name — only flag if adjacent to another capitalized word
        const beforeContext = text.substring(Math.max(0, start - 30), start);
        const afterContext = text.substring(end, Math.min(text.length, end + 30));

        // Check if preceded by a capitalized word (e.g. surname before)
        const precededByName = /[A-ZÀ-ÖØ-Þ][a-zA-ZÀ-ÖØ-öø-ÿĀ-žŁłŚśŹźŻż'\-]+\s+$/.test(beforeContext);
        // Check if followed by a capitalized word (e.g. surname after)
        const followedByName = /^\s+[A-ZÀ-ÖØ-Þ][a-zA-ZÀ-ÖØ-öø-ÿĀ-žŁłŚśŹźŻż'\-]+/.test(afterContext);

        if (precededByName || followedByName) {
          const placeholder = this.getPlaceholder(word, "PERSON");
          replacements.push({
            start,
            end,
            original: word,
            placeholder,
            category: "PERSON",
            priority: 2.5,
          });
        }
      }
    }
  }

  /**
   * Layer 3: NLP-based named entity recognition using Compromise.js.
   */
  _detectNLPEntities(text, replacements) {
    if (typeof nlp === "undefined") {
      console.warn("Compromise.js not loaded — skipping NLP detection");
      return;
    }

    const doc = nlp(text);

    // People
    const people = doc.people().out("array");
    for (const name of people) {
      this._findAndReplace(text, name, "PERSON", replacements);
    }

    // Organizations
    const orgs = doc.organizations().out("array");
    for (const org of orgs) {
      this._findAndReplace(text, org, "ORGANIZATION", replacements);
    }

    // Places
    const places = doc.places().out("array");
    for (const place of places) {
      this._findAndReplace(text, place, "LOCATION", replacements);
    }
  }

  /**
   * Helper: find all occurrences of a string in text and add to replacements.
   */
  _findAndReplace(text, searchStr, category, replacements) {
    if (!searchStr || searchStr.length < 2) return;

    const escaped = searchStr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Use word boundary only if the string starts/ends with a word character
    const startBound = /^\w/.test(searchStr) ? "\\b" : "";
    const endBound = /\w$/.test(searchStr) ? "\\b" : "";
    const regex = new RegExp(`${startBound}${escaped}${endBound}`, "gi");

    let match;
    while ((match = regex.exec(text)) !== null) {
      const placeholder = this.getPlaceholder(match[0], category);
      replacements.push({
        start: match.index,
        end: match.index + match[0].length,
        original: match[0],
        placeholder,
        category,
        priority: 3, // lowest
      });
    }
  }

  /**
   * Resolve overlapping replacements: higher priority wins, ties go to longer match.
   */
  _resolveOverlaps(replacements) {
    // Sort by start position, then by priority (lower = higher priority), then by length (longer first)
    replacements.sort((a, b) => {
      if (a.start !== b.start) return a.start - b.start;
      if (a.priority !== b.priority) return a.priority - b.priority;
      return (b.end - b.start) - (a.end - a.start);
    });

    const resolved = [];
    let lastEnd = -1;

    for (const rep of replacements) {
      if (rep.start >= lastEnd) {
        resolved.push(rep);
        lastEnd = rep.end;
      }
      // Skip overlapping replacements with lower priority
    }

    return resolved;
  }

  /**
   * Build output segments: alternating plain text and replaced entities.
   */
  _buildSegments(text, replacements) {
    const segments = [];
    let cursor = 0;

    for (const rep of replacements) {
      // Add plain text before this replacement
      if (rep.start > cursor) {
        segments.push({
          type: "plain",
          text: text.substring(cursor, rep.start),
        });
      }

      // Add the replacement
      segments.push({
        type: "entity",
        text: rep.placeholder,
        original: rep.original,
        category: rep.category,
      });

      cursor = rep.end;
    }

    // Add remaining plain text
    if (cursor < text.length) {
      segments.push({
        type: "plain",
        text: text.substring(cursor),
      });
    }

    return segments;
  }
}


// ─── UI Controller ──────────────────────────────────────────────────────────

class UIController {
  constructor() {
    this.engine = new AnonymizationEngine();
    this.debounceTimer = null;
    this.lastResult = null;

    // Cache DOM elements
    this.inputArea = document.getElementById("input-text");
    this.outputArea = document.getElementById("output-display");
    this.outputPlaceholder = document.getElementById("output-placeholder");
    this.statsBar = document.getElementById("stats-bar");
    this.entityMapBody = document.getElementById("entity-map-body");
    this.entityMapSection = document.getElementById("entity-map-section");
    this.entityMapToggle = document.getElementById("entity-map-toggle");
    this.entityMapCount = document.getElementById("entity-map-count");
    this.copyBtn = document.getElementById("copy-btn");
    this.clearBtn = document.getElementById("clear-btn");
    this.anonymizeBtn = document.getElementById("anonymize-btn");
    this.aggressiveToggle = document.getElementById("aggressive-toggle");
    this.charCount = document.getElementById("char-count");
    this.toastContainer = document.getElementById("toast-container");

    this._bindEvents();
    this._updateCharCount();
  }

  _bindEvents() {
    // Anonymize button
    this.anonymizeBtn.addEventListener("click", () => this._runAnonymization());

    // Real-time (debounced)
    this.inputArea.addEventListener("input", () => {
      this._updateCharCount();
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        if (this.inputArea.value.trim()) {
          this._runAnonymization();
        } else {
          this._clearOutput();
        }
      }, 400);
    });

    // Copy button
    this.copyBtn.addEventListener("click", () => this._copyToClipboard());

    // Clear button
    this.clearBtn.addEventListener("click", () => {
      this.inputArea.value = "";
      this._clearOutput();
      this._updateCharCount();
      this.inputArea.focus();
    });

    // Aggressive mode toggle
    this.aggressiveToggle.addEventListener("change", (e) => {
      this.engine.aggressiveMode = e.target.checked;
      if (this.inputArea.value.trim()) {
        this._runAnonymization();
      }
    });

    // Entity map toggle
    this.entityMapToggle.addEventListener("click", () => {
      const body = this.entityMapBody;
      const isExpanded = body.classList.contains("expanded");
      body.classList.toggle("expanded");
      this.entityMapToggle.querySelector(".toggle-icon").textContent = isExpanded ? "▶" : "▼";
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      // Cmd/Ctrl + Enter to anonymize
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        this._runAnonymization();
      }
      // Cmd/Ctrl + Shift + C to copy
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "C") {
        e.preventDefault();
        this._copyToClipboard();
      }
    });
  }

  _updateCharCount() {
    const len = this.inputArea.value.length;
    this.charCount.textContent = `${len.toLocaleString()} character${len !== 1 ? "s" : ""}`;
  }

  _runAnonymization() {
    const text = this.inputArea.value;
    if (!text.trim()) {
      this._clearOutput();
      return;
    }

    // Visual feedback
    this.anonymizeBtn.classList.add("processing");
    this.anonymizeBtn.querySelector(".btn-text").textContent = "Processing...";

    // Use requestAnimationFrame so the UI updates before heavy processing
    requestAnimationFrame(() => {
      const result = this.engine.anonymize(text);
      this.lastResult = result;

      this._renderOutput(result);
      this._renderStats(result.stats);
      this._renderEntityMap(result.detections);

      // Reset button
      this.anonymizeBtn.classList.remove("processing");
      this.anonymizeBtn.querySelector(".btn-text").textContent = "Anonymize";

      // Enable copy
      this.copyBtn.disabled = false;
    });
  }

  _renderOutput(result) {
    this.outputPlaceholder.style.display = "none";
    this.outputArea.style.display = "block";
    this.outputArea.innerHTML = "";

    if (result.segments.length === 0) {
      this.outputPlaceholder.style.display = "flex";
      this.outputArea.style.display = "none";
      return;
    }

    for (const segment of result.segments) {
      if (segment.type === "plain") {
        const span = document.createElement("span");
        span.textContent = segment.text;
        this.outputArea.appendChild(span);
      } else {
        const badge = document.createElement("span");
        badge.className = "entity-badge";
        const config = CATEGORY_CONFIG[segment.category] || CATEGORY_CONFIG.UNKNOWN_ENTITY;
        badge.style.setProperty("--entity-color", config.color);
        badge.style.setProperty("--entity-bg", config.bgColor);
        badge.textContent = segment.text;
        badge.title = `Original: "${segment.original}"`;

        // Tooltip on hover
        badge.addEventListener("mouseenter", (e) => this._showTooltip(e, segment));
        badge.addEventListener("mouseleave", () => this._hideTooltip());

        this.outputArea.appendChild(badge);
      }
    }
  }

  _renderStats(stats) {
    this.statsBar.innerHTML = "";

    const categories = Object.keys(stats);
    if (categories.length === 0) {
      this.statsBar.innerHTML = '<span class="stat-empty">No sensitive data detected</span>';
      return;
    }

    let total = 0;
    for (const cat of categories) {
      total += stats[cat];
      const config = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG.UNKNOWN_ENTITY;

      const pill = document.createElement("div");
      pill.className = "stat-pill";
      pill.style.setProperty("--pill-color", config.color);
      pill.style.setProperty("--pill-bg", config.bgColor);
      pill.innerHTML = `
        <span class="stat-icon">${config.icon}</span>
        <span class="stat-count">${stats[cat]}</span>
        <span class="stat-label">${config.label}</span>
      `;
      this.statsBar.appendChild(pill);
    }

    // Total count at the start
    const totalPill = document.createElement("div");
    totalPill.className = "stat-pill stat-total";
    totalPill.innerHTML = `
      <span class="stat-count">${total}</span>
      <span class="stat-label">Total Redacted</span>
    `;
    this.statsBar.prepend(totalPill);
  }

  _renderEntityMap(detections) {
    this.entityMapCount.textContent = detections.length;

    if (detections.length === 0) {
      this.entityMapBody.innerHTML = '<div class="entity-map-empty">No entities detected</div>';
      return;
    }

    this.entityMapBody.innerHTML = "";

    // Group by category
    const groups = {};
    for (const det of detections) {
      if (!groups[det.category]) groups[det.category] = [];
      groups[det.category].push(det);
    }

    for (const [category, items] of Object.entries(groups)) {
      const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.UNKNOWN_ENTITY;

      const group = document.createElement("div");
      group.className = "entity-group";

      const header = document.createElement("div");
      header.className = "entity-group-header";
      header.style.color = config.color;
      header.innerHTML = `${config.icon} ${config.label}`;
      group.appendChild(header);

      for (const item of items) {
        const row = document.createElement("div");
        row.className = "entity-row";
        row.innerHTML = `
          <span class="entity-placeholder" style="color: ${config.color}">${item.placeholder}</span>
          <span class="entity-arrow">←</span>
          <span class="entity-original">"${this._escapeHTML(item.original)}"</span>
        `;
        group.appendChild(row);
      }

      this.entityMapBody.appendChild(group);
    }
  }

  _clearOutput() {
    this.outputArea.style.display = "none";
    this.outputPlaceholder.style.display = "flex";
    this.outputArea.innerHTML = "";
    this.statsBar.innerHTML = "";
    this.entityMapBody.innerHTML = '<div class="entity-map-empty">No entities detected</div>';
    this.entityMapCount.textContent = "0";
    this.copyBtn.disabled = true;
    this.lastResult = null;
  }

  async _copyToClipboard() {
    if (!this.lastResult) return;

    try {
      await navigator.clipboard.writeText(this.lastResult.anonymizedText);
      this._showToast("Anonymized text copied to clipboard!", "success");
      this.copyBtn.classList.add("copied");
      setTimeout(() => this.copyBtn.classList.remove("copied"), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = this.lastResult.anonymizedText;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      this._showToast("Anonymized text copied to clipboard!", "success");
    }
  }

  _showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${type === "success" ? "✓" : "ℹ"}</span>
      <span class="toast-message">${message}</span>
    `;
    this.toastContainer.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => toast.classList.add("visible"));

    // Remove after delay
    setTimeout(() => {
      toast.classList.remove("visible");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  _showTooltip(event, segment) {
    // Remove existing tooltip
    this._hideTooltip();

    const tooltip = document.createElement("div");
    tooltip.className = "entity-tooltip";
    tooltip.id = "active-tooltip";

    const config = CATEGORY_CONFIG[segment.category] || CATEGORY_CONFIG.UNKNOWN_ENTITY;
    tooltip.innerHTML = `
      <div class="tooltip-header" style="color: ${config.color}">${config.icon} ${config.label}</div>
      <div class="tooltip-original">Original: <strong>"${this._escapeHTML(segment.original)}"</strong></div>
      <div class="tooltip-replacement">Replaced with: <strong>${segment.text}</strong></div>
    `;

    document.body.appendChild(tooltip);

    // Position near the badge
    const rect = event.target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    let top = rect.top - tooltipRect.height - 8;
    let left = rect.left + rect.width / 2 - tooltipRect.width / 2;

    // Keep within viewport
    if (top < 8) top = rect.bottom + 8;
    if (left < 8) left = 8;
    if (left + tooltipRect.width > window.innerWidth - 8) {
      left = window.innerWidth - tooltipRect.width - 8;
    }

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
    tooltip.classList.add("visible");
  }

  _hideTooltip() {
    const existing = document.getElementById("active-tooltip");
    if (existing) existing.remove();
  }

  _escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }
}


// ─── Initialize ─────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  window.app = new UIController();
});
