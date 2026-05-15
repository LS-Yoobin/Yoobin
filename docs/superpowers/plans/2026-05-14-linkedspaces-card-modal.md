# LinkedSpaces Card Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a clickable modal to the LinkedSpaces work card in the MY WORK section, mirroring the existing Bloggo modal pattern.

**Architecture:** Single HTML file edit — update the existing LinkedSpaces card node, append a new modal node after the Bloggo modal, and add a JS IIFE after the Bloggo modal IIFE. All modal styling is handled by the existing `bm-*` CSS classes; no new CSS is needed. The existing Escape keydown handler is edited in-place to wire up the new modal.

**Tech Stack:** Vanilla HTML, CSS, JavaScript (no framework, no build step)

**Spec:** `docs/superpowers/specs/2026-05-14-linkedspaces-card-modal-design.md`

---

## File Map

| Action | File | Lines |
|---|---|---|
| Modify | `.superpowers/brainstorm/851-1774956399/hero-h-space.html` | 3018–3023 (card), ~3078 (modal insert), 5358–5362 (Escape handler) |

---

## Task 1: Update the LinkedSpaces work card

**Files:**
- Modify: `.superpowers/brainstorm/851-1774956399/hero-h-space.html:3018-3023`

- [ ] **Step 1: Replace the card node**

Find this block (lines 3018–3023):
```html
      <div class="work-card np-reveal" style="transition-delay:0.24s">
        <div class="wc-tag">UI / UX Design</div>
        <div class="wc-title">LinkedSpaces</div>
        <div class="wc-desc">End-to-end product design for a professional networking start-up connecting people through shared spaces.</div>
        <div class="wc-arrow">View Project &#8594;</div>
      </div>
```

Replace with:
```html
      <div class="work-card np-reveal" id="work-card-linkedspaces" style="transition-delay:0.24s">
        <div class="wc-tag">Product / Travel App</div>
        <div class="wc-title">LINKEDSPACES</div>
        <div class="wc-desc">A social travel platform built to help people map, save, and share the places that matter to them.</div>
        <div class="wc-arrow">View Project &#8594;</div>
      </div>
```

- [ ] **Step 2: Verify in browser**

Open the file in a browser. In the MY WORK grid:
- Card tag reads "Product / Travel App" ✓
- Card title reads "LINKEDSPACES" (bold, uppercase) ✓
- Card description is the new text ✓
- Card shows `cursor: pointer` on hover (inherited from base `.work-card` rule) ✓

- [ ] **Step 3: Commit**

```bash
git add .superpowers/brainstorm/851-1774956399/hero-h-space.html
git commit -m "feat: update LinkedSpaces work card (tag, title, desc, id)"
```

---

## Task 2: Add the LinkedSpaces modal HTML

**Files:**
- Modify: `.superpowers/brainstorm/851-1774956399/hero-h-space.html:~3078`

- [ ] **Step 1: Insert modal node after the Bloggo modal**

Find the closing tag of the Bloggo modal (line ~3078):
```html
  </div>

  <section id="section-experience">
```

Insert the new modal node between them:
```html
  </div>

  <!-- LinkedSpaces detail modal -->
  <div class="bloggo-modal-backdrop" id="linkedspaces-modal" role="dialog" aria-modal="true" aria-label="LinkedSpaces project details">
    <div class="bloggo-modal-panel">
      <button class="bm-close" id="linkedspaces-modal-close" aria-label="Close">&#10005;&nbsp;close</button>

      <div class="bm-cols">
        <!-- Left column -->
        <div class="bm-left">
          <div class="bm-tag">Product &nbsp;/&nbsp; Travel App</div>
          <div class="bm-title">LINKEDSPACES</div>
          <p class="bm-desc">Travelers lose track of the places that matter. Disorganized photos, scattered memories, no easy way to look back &mdash; LinkedSpaces was built to fix that.</p>
          <a class="bm-btn bm-btn-primary" href="https://www.linkedspaces.com/" target="_blank" rel="noopener noreferrer">Visit Website</a>
        </div>

        <!-- Right column -->
        <div class="bm-right">
          <span class="bm-label">Solution</span>
          <p class="bm-body">LinkedSpaces recognizes where and when your photos were taken, so saving your favorite spots is effortless. A virtual map of your travels &mdash; built automatically as you go.</p>

          <span class="bm-label">What I Built</span>
          <p class="bm-body">
            Co-founded the company<br>
            UI/UX design &mdash; iOS &amp; web<br>
            Product management &amp; roadmap<br>
            Brand identity &amp; visual system
          </p>
        </div>
      </div>

      <hr class="bm-divider">
      <div class="bm-pills">
        <span class="bm-pill">Co-Founder</span>
        <span class="bm-pill">UI/UX Design</span>
        <span class="bm-pill">Product Management</span>
        <span class="bm-pill">Brand Design</span>
        <span class="bm-pill">Mobile Design</span>
      </div>
    </div>
  </div>

  <section id="section-experience">
```

- [ ] **Step 2: Commit**

```bash
git add .superpowers/brainstorm/851-1774956399/hero-h-space.html
git commit -m "feat: add LinkedSpaces modal HTML node"
```

---

## Task 3: Add the LinkedSpaces modal JS

**Files:**
- Modify: `.superpowers/brainstorm/851-1774956399/hero-h-space.html:~5356`

- [ ] **Step 1: Add the modal IIFE after the Bloggo modal IIFE**

Find this line (~5356):
```javascript
  // ── End Bloggo modal ──────────────────────────────────────
```

Insert immediately after it:
```javascript
  // ── LinkedSpaces modal ────────────────────────────────────
  (function () {
    const backdrop = document.getElementById('linkedspaces-modal');
    const card     = document.getElementById('work-card-linkedspaces');
    const closeBtn = document.getElementById('linkedspaces-modal-close');
    if (!backdrop || !card || !closeBtn) return;

    function openLinkedSpacesModal() {
      backdrop.classList.remove('closing');
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function closeLinkedSpacesModal() {
      if (!backdrop.classList.contains('open')) return;
      backdrop.classList.add('closing');
      backdrop.addEventListener('animationend', function handler() {
        backdrop.classList.remove('open', 'closing');
        document.body.style.overflow = '';
        backdrop.removeEventListener('animationend', handler);
        card.focus();
      });
    }

    window.closeLinkedSpacesModal = closeLinkedSpacesModal;

    card.addEventListener('click', openLinkedSpacesModal);
    closeBtn.addEventListener('click', closeLinkedSpacesModal);
    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) closeLinkedSpacesModal();
    });
  })();
  // ── End LinkedSpaces modal ────────────────────────────────
```

- [ ] **Step 2: Wire into the existing Escape handler**

Find this block (~line 5358 after the insert, now a few lines lower):
```javascript
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeOiPopup();
      if (window.closeBloggoModal) window.closeBloggoModal(); // set by Bloggo modal IIFE
    }
  });
```

Replace with (add one line inside the `if` block):
```javascript
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeOiPopup();
      if (window.closeBloggoModal) window.closeBloggoModal(); // set by Bloggo modal IIFE
      if (window.closeLinkedSpacesModal) window.closeLinkedSpacesModal(); // set by LinkedSpaces modal IIFE
    }
  });
```

- [ ] **Step 3: Commit**

```bash
git add .superpowers/brainstorm/851-1774956399/hero-h-space.html
git commit -m "feat: add LinkedSpaces modal open/close JS"
```

---

## Task 4: Full verification

- [ ] **Step 1: Open in browser and run through the checklist**

Open `.superpowers/brainstorm/851-1774956399/hero-h-space.html` directly in a browser.

**Modal open:**
- Click the LINKEDSPACES card → modal opens with fade + scale animation ✓
- Backdrop is dark with blur ✓
- Panel shows: tag "Product / Travel App", title "LINKEDSPACES", problem hook description, "Visit Website" button ✓
- Right column shows "Solution" copy and "What I Built" list ✓
- Bottom pills: Co-Founder · UI/UX Design · Product Management · Brand Design · Mobile Design ✓

**Modal close (three paths):**
- Click the ✕ close button → modal closes with reverse animation ✓
- Click the dark backdrop (outside the panel) → modal closes ✓
- Press Escape → modal closes ✓

**No regressions:**
- Click the BLOGGO card → Bloggo modal still opens and closes correctly ✓
- Press Escape while Bloggo modal is open → Bloggo modal closes ✓

**Responsive (narrow the browser window below 560px):**
- Modal switches to single-column layout ✓
- Left column stacks above right column ✓

**CTA link:**
- "Visit Website" button opens `https://www.linkedspaces.com/` in a new tab ✓
