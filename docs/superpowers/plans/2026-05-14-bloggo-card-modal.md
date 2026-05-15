# Bloggo Card Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clicking the BLOGGO work card opens a dark-green-styled modal overlay with project vision, contribution details, and CTAs — dismissible by clicking outside, pressing Escape, or clicking ✕.

**Architecture:** All changes are made inside a single legacy HTML file served via Next.js iframe. A persistent modal DOM node is toggled open/closed via a CSS class. No frameworks, no new dependencies — vanilla CSS animations + vanilla JS event handling.

**Tech Stack:** Vanilla HTML/CSS/JS inside `.superpowers/brainstorm/851-1774956399/hero-h-space.html`

---

## File Map

| File | Change |
|---|---|
| `.superpowers/brainstorm/851-1774956399/hero-h-space.html` | Add CSS block (modal styles), add modal HTML node, modify BLOGGO card markup, add JS (open/close/scroll-lock), extend existing Escape keydown listener |

---

### Task 1: Add cursor:pointer to the BLOGGO card

**Files:**
- Modify: `.superpowers/brainstorm/851-1774956399/hero-h-space.html` (CSS section, ~line 993)

**Context:** The four `.work-card` elements share base styles. Only BLOGGO gets a modal, so only it should have `cursor: pointer`. Add a targeted rule using an `id` added to the card.

- [ ] **Step 1: Add `id="work-card-bloggo"` to the BLOGGO card element**

Find (around line 2843):
```html
<div class="work-card np-reveal" style="transition-delay:0.18s">
  <div class="wc-tag">Product / Social Platform</div>
  <div class="wc-title">BLOGGO</div>
```

Replace with:
```html
<div class="work-card np-reveal" id="work-card-bloggo" style="transition-delay:0.18s">
  <div class="wc-tag">Product / Social Platform</div>
  <div class="wc-title">BLOGGO</div>
```

- [ ] **Step 2: Add cursor rule to CSS**

After line 993 (after the `.work-card:hover .wc-tag, .work-card:hover .wc-arrow` block), insert:
```css
  /* Bloggo card — clickable */
  #work-card-bloggo { cursor: pointer; }
```

- [ ] **Step 3: Verify in browser**

Run `npm run dev` and open the site. Hover over the BLOGGO card — cursor should turn to pointer. Hover other cards — cursor should remain default.

- [ ] **Step 4: Commit**
```bash
git add .superpowers/brainstorm/851-1774956399/hero-h-space.html
git commit -m "feat: add cursor pointer to Bloggo work card"
```

---

### Task 2: Add modal CSS

**Files:**
- Modify: `.superpowers/brainstorm/851-1774956399/hero-h-space.html` (CSS section, after Task 1 addition)

Add all modal styles in one block immediately after the `#work-card-bloggo { cursor: pointer; }` rule from Task 1.

- [ ] **Step 1: Insert the modal CSS block**

```css
  /* ============================================================
     BLOGGO MODAL
  ============================================================ */
  .bloggo-modal-backdrop {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.8);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    z-index: 9000;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
  }
  .bloggo-modal-backdrop.open {
    display: flex;
    animation: bm-fade-in 0.22s ease-out;
  }
  .bloggo-modal-backdrop.closing {
    animation: bm-fade-out 0.18s ease-in forwards;
  }
  @keyframes bm-fade-in  { from { opacity: 0; } to { opacity: 1; } }
  @keyframes bm-fade-out { from { opacity: 1; } to { opacity: 0; } }

  .bloggo-modal-panel {
    background: #030d06;
    border: 1px solid rgba(34,197,94,0.25);
    border-radius: 16px;
    padding: 2.2rem;
    width: 100%;
    max-width: 700px;
    position: relative;
    overflow: hidden;
    animation: bm-scale-in 0.22s ease-out;
    font-family: 'Courier New', monospace;
    color: #fff;
    max-height: 90vh;
    overflow-y: auto;
  }
  .bloggo-modal-backdrop.closing .bloggo-modal-panel {
    animation: bm-scale-out 0.18s ease-in forwards;
  }
  @keyframes bm-scale-in  { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  @keyframes bm-scale-out { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.95); } }

  .bloggo-modal-panel::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(34,197,94,0.7), transparent);
  }

  .bm-close {
    position: absolute;
    top: 1.1rem; right: 1.2rem;
    font-size: 0.6rem;
    letter-spacing: 0.2em;
    color: rgba(34,197,94,0.5);
    text-transform: uppercase;
    cursor: pointer;
    transition: color 0.2s;
    background: none;
    border: none;
    font-family: 'Courier New', monospace;
  }
  .bm-close:hover { color: #22c55e; }

  .bm-cols {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
  }
  .bm-left  { padding-right: 1.8rem; }
  .bm-right {
    border-left: 1px solid rgba(34,197,94,0.15);
    padding-left: 1.8rem;
  }

  .bm-tag {
    font-size: 0.6rem;
    letter-spacing: 0.35em;
    color: #22c55e;
    font-weight: 900;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }
  .bm-title {
    font-family: 'Arial Black', Arial, sans-serif;
    font-size: 1.8rem;
    font-weight: 900;
    text-transform: uppercase;
    color: #fff;
    margin-bottom: 0.7rem;
    line-height: 1;
  }
  .bm-desc {
    font-size: 0.78rem;
    line-height: 1.75;
    color: rgba(255,255,255,0.7);
    margin-bottom: 1.4rem;
  }
  .bm-label {
    font-size: 0.55rem;
    letter-spacing: 0.3em;
    color: rgba(34,197,94,0.6);
    text-transform: uppercase;
    margin-bottom: 0.5rem;
    margin-top: 1.1rem;
    display: block;
  }
  .bm-label:first-child { margin-top: 0; }
  .bm-body {
    font-size: 0.78rem;
    line-height: 1.75;
    color: rgba(255,255,255,0.7);
  }

  .bm-btn {
    display: block;
    padding: 0.55rem 1.2rem;
    font-size: 0.62rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    border-radius: 6px;
    margin-bottom: 0.5rem;
    text-align: center;
    font-family: 'Courier New', monospace;
    cursor: pointer;
    font-weight: 900;
    text-decoration: none;
    transition: opacity 0.2s;
  }
  .bm-btn:hover { opacity: 0.85; }
  .bm-btn-primary  { background: #22c55e; color: #000; border: none; }
  .bm-btn-secondary {
    background: transparent;
    border: 1px solid rgba(34,197,94,0.35);
    color: #22c55e;
  }

  .bm-divider {
    border: none;
    border-top: 1px solid rgba(34,197,94,0.12);
    margin: 1.4rem 0 1rem;
  }
  .bm-pills { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .bm-pill {
    padding: 0.22rem 0.7rem;
    border: 1px solid rgba(34,197,94,0.3);
    border-radius: 20px;
    font-size: 0.6rem;
    letter-spacing: 0.15em;
    color: #22c55e;
  }

  @media (max-width: 560px) {
    .bm-cols { grid-template-columns: 1fr; }
    .bm-left  { padding-right: 0; margin-bottom: 1.4rem; }
    .bm-right {
      border-left: none;
      border-top: 1px solid rgba(34,197,94,0.15);
      padding-left: 0;
      padding-top: 1.4rem;
    }
  }
```

- [ ] **Step 2: Verify CSS is valid**

Run `npm run dev` — no console errors in the browser. The page renders exactly as before (modal is hidden at this stage).

- [ ] **Step 3: Commit**
```bash
git add .superpowers/brainstorm/851-1774956399/hero-h-space.html
git commit -m "feat: add Bloggo modal CSS styles"
```

---

### Task 3: Add modal HTML

**Files:**
- Modify: `.superpowers/brainstorm/851-1774956399/hero-h-space.html` (~line 2868, after `</section>` closing `#section-work`)

- [ ] **Step 1: Insert modal HTML node after the work section closing tag**

Find (around line 2867–2868):
```html
    </div>
  </section>

  <section id="section-experience">
```

Insert the modal between them:
```html
    </div>
  </section>

  <!-- Bloggo detail modal -->
  <div class="bloggo-modal-backdrop" id="bloggo-modal" role="dialog" aria-modal="true" aria-label="Bloggo project details">
    <div class="bloggo-modal-panel">
      <button class="bm-close" id="bloggo-modal-close" aria-label="Close">&#10005;&nbsp;close</button>

      <div class="bm-cols">
        <!-- Left column -->
        <div class="bm-left">
          <div class="bm-tag">Product &nbsp;/&nbsp; Social Platform</div>
          <div class="bm-title">BLOGGO</div>
          <p class="bm-desc">A local-first travel blogging platform that converts photo metadata into structured blog narratives &mdash; eliminating blank page anxiety for travelers.</p>
          <a class="bm-btn bm-btn-primary"    href="https://testflight.apple.com/join/RMzfPzCf" target="_blank" rel="noopener noreferrer">Try Beta Today</a>
          <a class="bm-btn bm-btn-secondary"  href="https://bloggo.linkedspaces.com/"           target="_blank" rel="noopener noreferrer">Visit Website</a>
        </div>

        <!-- Right column -->
        <div class="bm-right">
          <span class="bm-label">Vision</span>
          <p class="bm-body">Turn trip photos into blogs. Fast. Bloggo reads your camera roll&rsquo;s metadata and builds a structured narrative draft &mdash; so the story writes itself.</p>

          <span class="bm-label">What I Built</span>
          <p class="bm-body">
            Product architecture &amp; technical direction<br>
            Mobile UI/UX design (iOS)<br>
            Backend systems &amp; data pipeline<br>
            Beta launch via TestFlight
          </p>
        </div>
      </div>

      <hr class="bm-divider">
      <div class="bm-pills">
        <span class="bm-pill">Product Design</span>
        <span class="bm-pill">iOS Dev</span>
        <span class="bm-pill">UX Research</span>
        <span class="bm-pill">Backend</span>
        <span class="bm-pill">Co-Founder</span>
      </div>
    </div>
  </div>

  <section id="section-experience">
```

- [ ] **Step 2: Verify modal HTML is inert**

In the browser the page looks exactly as before — modal is not visible.

- [ ] **Step 3: Commit**
```bash
git add .superpowers/brainstorm/851-1774956399/hero-h-space.html
git commit -m "feat: add Bloggo modal HTML node"
```

---

### Task 4: Add modal open/close JavaScript

**Files:**
- Modify: `.superpowers/brainstorm/851-1774956399/hero-h-space.html` (JS section, before `</script>` at ~line 5123)

**Context:** The file already has an `keydown` listener for `closeOiPopup()` at ~line 5113. Add the Bloggo modal Escape handling inside the same listener (not a second `keydown` event) to avoid stacking listeners.

- [ ] **Step 1: Add open/close JS before `</script>`**

Find the existing Escape keydown block (~line 5113):
```js
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeOiPopup();
  });
```

Replace with:
```js
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeOiPopup();
      closeBloggoModal(); // calls window.closeBloggoModal set by the IIFE above
    }
  });
```

Then, just before that block, insert the full Bloggo modal JS:
```js
  // ── Bloggo modal ──────────────────────────────────────────
  (function () {
    const backdrop = document.getElementById('bloggo-modal');
    const card     = document.getElementById('work-card-bloggo');
    const closeBtn = document.getElementById('bloggo-modal-close');
    if (!backdrop || !card || !closeBtn) return;

    function openBloggoModal() {
      backdrop.classList.remove('closing');
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeBloggoModal() {
      if (!backdrop.classList.contains('open')) return;
      backdrop.classList.add('closing');
      backdrop.addEventListener('animationend', function handler() {
        backdrop.classList.remove('open', 'closing');
        document.body.style.overflow = '';
        backdrop.removeEventListener('animationend', handler);
      });
    }

    window.closeBloggoModal = closeBloggoModal;

    card.addEventListener('click', openBloggoModal);
    closeBtn.addEventListener('click', closeBloggoModal);
    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) closeBloggoModal();
    });
  })();
  // ── End Bloggo modal ──────────────────────────────────────
```

- [ ] **Step 2: Verify open behaviour**

In the browser:
- Click the BLOGGO card → modal opens with fade+scale animation
- All content visible (two columns, pills, CTAs)
- Other cards do nothing when clicked

- [ ] **Step 3: Verify close behaviour**

- Click ✕ close button → modal closes with reverse animation
- Click the dark backdrop outside the panel → modal closes
- Press Escape → modal closes (and OI popup also closes if open — no regression)

- [ ] **Step 4: Verify mobile layout**

Resize browser below 560px:
- Modal switches to single column
- Left content (title, desc, CTAs) appears above right content (vision, what I built)
- Border-top replaces border-left divider

- [ ] **Step 5: Commit**
```bash
git add .superpowers/brainstorm/851-1774956399/hero-h-space.html
git commit -m "feat: add Bloggo modal open/close JS"
```

---

### Task 5: Final smoke test

- [ ] **Step 1: Full page walkthrough**

Open the site. Scroll through all sections:
- Hero section renders correctly
- MY WORK section: four cards visible, only BLOGGO has pointer cursor
- Click BLOGGO → modal opens, content is correct, animations are smooth
- Dismiss modal three ways (✕, backdrop click, Escape) — all work
- Resume / Experience / Contact sections unaffected

- [ ] **Step 2: Check no console errors**

Browser DevTools console should be clean — no JS errors on open or close.

- [ ] **Step 3: Final commit**
```bash
git add .superpowers/brainstorm/851-1774956399/hero-h-space.html
git commit -m "feat: Bloggo card click-to-expand modal complete"
```
