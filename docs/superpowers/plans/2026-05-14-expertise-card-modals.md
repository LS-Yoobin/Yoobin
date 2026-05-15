# Expertise Card Modals Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add "View More" expertise modals to the Graphic Design and Digital Media work cards, updating card text and adding modal HTML + JS that mirrors the existing Bloggo/LinkedSpaces modal pattern.

**Architecture:** Single HTML file edit — update two existing card nodes, append two new modal nodes after the LinkedSpaces modal, and add two JS IIFEs after the LinkedSpaces IIFE. All modal styling reuses existing `bm-*` CSS classes. The single Escape keydown handler is edited in-place to wire both new modals.

**Tech Stack:** Vanilla HTML, CSS, JavaScript (no framework, no build step)

**Spec:** `docs/superpowers/specs/2026-05-14-expertise-card-modals-design.md`

---

## File Map

| Action | File | Lines |
|---|---|---|
| Modify | `.superpowers/brainstorm/851-1774956399/hero-h-space.html` | 3024–3035 (cards), ~3119 (modal insert), 5432–5440 (JS) |

---

## Task 1: Update both work cards

**Files:**
- Modify: `.superpowers/brainstorm/851-1774956399/hero-h-space.html:3024-3035`

- [ ] **Step 1: Update the Graphic Design card**

Find this exact block (lines 3024–3029):
```html
      <div class="work-card np-reveal" style="transition-delay:0.32s">
        <div class="wc-tag">Brand + Visual</div>
        <div class="wc-title">Graphic Design</div>
        <div class="wc-desc">Identity, print, and digital graphics developed across campaigns, editorial, and social media.</div>
        <div class="wc-arrow">View Project &#8594;</div>
      </div>
```

Replace with:
```html
      <div class="work-card np-reveal" id="work-card-graphic-design" style="transition-delay:0.32s">
        <div class="wc-tag">Brand + Visual</div>
        <div class="wc-title">GRAPHIC DESIGN</div>
        <div class="wc-desc">Identity, print, and digital graphics developed across campaigns, editorial, and social media.</div>
        <div class="wc-arrow">View More &#8594;</div>
      </div>
```

Changes: add `id="work-card-graphic-design"`, uppercase title, arrow text → `View More`.

- [ ] **Step 2: Update the Digital Media card**

Find this exact block (lines 3030–3035):
```html
      <div class="work-card np-reveal" style="transition-delay:0.40s">
        <div class="wc-tag">Content Creation</div>
        <div class="wc-title">Digital Media</div>
        <div class="wc-desc">Photo, video, and copywriting produced for brands and personal creative projects.</div>
        <div class="wc-arrow">View Project &#8594;</div>
      </div>
```

Replace with:
```html
      <div class="work-card np-reveal" id="work-card-digital-media" style="transition-delay:0.40s">
        <div class="wc-tag">Content Creation</div>
        <div class="wc-title">DIGITAL MEDIA</div>
        <div class="wc-desc">Photo, video, and copywriting produced for brands and personal creative projects.</div>
        <div class="wc-arrow">View More &#8594;</div>
      </div>
```

Changes: add `id="work-card-digital-media"`, uppercase title, arrow text → `View More`.

- [ ] **Step 3: Verify in browser**

Open the file in a browser. In the MY WORK grid:
- Graphic Design card title reads "GRAPHIC DESIGN" ✓
- Digital Media card title reads "DIGITAL MEDIA" ✓
- Both arrow labels read "View More →" ✓
- Card hover style and layout are unchanged ✓

- [ ] **Step 4: Commit**

```bash
git add .superpowers/brainstorm/851-1774956399/hero-h-space.html
git commit -m "feat: update Graphic Design and Digital Media work cards (id, title, arrow)"
```

---

## Task 2: Add Graphic Design modal HTML

**Files:**
- Modify: `.superpowers/brainstorm/851-1774956399/hero-h-space.html:~3119`

- [ ] **Step 1: Insert the Graphic Design modal node**

Find this exact text (line ~3119–3121):
```html
  </div>

  <section id="section-experience">
```

Replace with:
```html
  </div>

  <!-- Graphic Design expertise modal -->
  <div class="bloggo-modal-backdrop" id="graphic-design-modal" role="dialog" aria-modal="true" aria-label="Graphic design expertise">
    <div class="bloggo-modal-panel">
      <button class="bm-close" id="graphic-design-modal-close" aria-label="Close">&#10005;&nbsp;close</button>

      <div class="bm-cols">
        <!-- Left column -->
        <div class="bm-left">
          <div class="bm-tag">Brand &nbsp;+&nbsp; Visual</div>
          <div class="bm-title">GRAPHIC DESIGN</div>
          <p class="bm-desc">I've always been on the creative side. I love crafting graphics that support ideas &mdash; from social media visuals to in-app assets &mdash; making every touchpoint feel intentional.</p>
        </div>

        <!-- Right column -->
        <div class="bm-right">
          <span class="bm-label">My Story</span>
          <p class="bm-body">Creativity has been a constant throughout my life. Whether designing for apps, brands, or social media campaigns, I approach every visual with the same instinct: make it clear, make it feel right.</p>

          <span class="bm-label">Toolkit</span>
          <p class="bm-body">
            Figma<br>
            Photoshop<br>
            Canva
          </p>
        </div>
      </div>

      <hr class="bm-divider">
      <div class="bm-pills">
        <span class="bm-pill">Figma</span>
        <span class="bm-pill">Photoshop</span>
        <span class="bm-pill">Canva</span>
        <span class="bm-pill">Visual Design</span>
        <span class="bm-pill">Social Media</span>
      </div>
    </div>
  </div>

  <section id="section-experience">
```

Note: The `</div>` at the top of the find block is the closing tag of the LinkedSpaces modal backdrop. There is only one `<section id="section-experience">` in the file.

- [ ] **Step 2: Commit**

```bash
git add .superpowers/brainstorm/851-1774956399/hero-h-space.html
git commit -m "feat: add Graphic Design expertise modal HTML"
```

---

## Task 3: Add Digital Media modal HTML

**Files:**
- Modify: `.superpowers/brainstorm/851-1774956399/hero-h-space.html` (after Graphic Design modal)

- [ ] **Step 1: Insert the Digital Media modal node**

Find this text (now after the Graphic Design modal you just inserted):
```html
  </div>

  <section id="section-experience">
```

Replace with:
```html
  </div>

  <!-- Digital Media expertise modal -->
  <div class="bloggo-modal-backdrop" id="digital-media-modal" role="dialog" aria-modal="true" aria-label="Digital media expertise">
    <div class="bloggo-modal-panel">
      <button class="bm-close" id="digital-media-modal-close" aria-label="Close">&#10005;&nbsp;close</button>

      <div class="bm-cols">
        <!-- Left column -->
        <div class="bm-left">
          <div class="bm-tag">Content Creation</div>
          <div class="bm-title">DIGITAL MEDIA</div>
          <p class="bm-desc">From live streaming on YouTube to building in public &mdash; I've spent years creating content that documents real journeys and connects with real people.</p>
          <a class="bm-btn bm-btn-primary" href="https://www.instagram.com/yoobinseo" target="_blank" rel="noopener noreferrer">Follow on Instagram</a>
        </div>

        <!-- Right column -->
        <div class="bm-right">
          <span class="bm-label">My Story</span>
          <p class="bm-body">I started my content journey live streaming on YouTube, documenting my progression through hobbies and personal projects. Now I create with a purpose &mdash; building in public and sharing the process of making something real.</p>

          <span class="bm-label">Toolkit</span>
          <p class="bm-body">
            Storytelling<br>
            Content Strategy<br>
            Video Editing<br>
            Graphic Design
          </p>
        </div>
      </div>

      <hr class="bm-divider">
      <div class="bm-pills">
        <span class="bm-pill">Storytelling</span>
        <span class="bm-pill">Content Strategy</span>
        <span class="bm-pill">Video Editing</span>
        <span class="bm-pill">YouTube</span>
        <span class="bm-pill">Building in Public</span>
      </div>
    </div>
  </div>

  <section id="section-experience">
```

- [ ] **Step 2: Commit**

```bash
git add .superpowers/brainstorm/851-1774956399/hero-h-space.html
git commit -m "feat: add Digital Media expertise modal HTML"
```

---

## Task 4: Add JS for both modals

**Files:**
- Modify: `.superpowers/brainstorm/851-1774956399/hero-h-space.html` (JS section, after LinkedSpaces IIFE)

- [ ] **Step 1: Insert both IIFEs after the LinkedSpaces IIFE**

Find this exact line (currently ~line 5432, after HTML inserts it will be higher):
```
  // ── End LinkedSpaces modal ────────────────────────────────
```

Insert immediately after it:
```javascript

  // ── Graphic Design modal ──────────────────────────────────
  (function () {
    const backdrop = document.getElementById('graphic-design-modal');
    const card     = document.getElementById('work-card-graphic-design');
    const closeBtn = document.getElementById('graphic-design-modal-close');
    if (!backdrop || !card || !closeBtn) return;

    function openGraphicDesignModal() {
      backdrop.classList.remove('closing');
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function closeGraphicDesignModal() {
      if (!backdrop.classList.contains('open')) return;
      backdrop.classList.add('closing');
      backdrop.addEventListener('animationend', function handler() {
        backdrop.classList.remove('open', 'closing');
        document.body.style.overflow = '';
        backdrop.removeEventListener('animationend', handler);
        card.focus();
      });
    }

    window.closeGraphicDesignModal = closeGraphicDesignModal;

    card.addEventListener('click', openGraphicDesignModal);
    closeBtn.addEventListener('click', closeGraphicDesignModal);
    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) closeGraphicDesignModal();
    });
  })();
  // ── End Graphic Design modal ──────────────────────────────

  // ── Digital Media modal ───────────────────────────────────
  (function () {
    const backdrop = document.getElementById('digital-media-modal');
    const card     = document.getElementById('work-card-digital-media');
    const closeBtn = document.getElementById('digital-media-modal-close');
    if (!backdrop || !card || !closeBtn) return;

    function openDigitalMediaModal() {
      backdrop.classList.remove('closing');
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function closeDigitalMediaModal() {
      if (!backdrop.classList.contains('open')) return;
      backdrop.classList.add('closing');
      backdrop.addEventListener('animationend', function handler() {
        backdrop.classList.remove('open', 'closing');
        document.body.style.overflow = '';
        backdrop.removeEventListener('animationend', handler);
        card.focus();
      });
    }

    window.closeDigitalMediaModal = closeDigitalMediaModal;

    card.addEventListener('click', openDigitalMediaModal);
    closeBtn.addEventListener('click', closeDigitalMediaModal);
    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) closeDigitalMediaModal();
    });
  })();
  // ── End Digital Media modal ───────────────────────────────
```

- [ ] **Step 2: Update the Escape keydown handler in-place**

Find this exact block (a few lines after the IIFEs you just inserted):
```javascript
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeOiPopup();
      if (window.closeBloggoModal) window.closeBloggoModal(); // set by Bloggo modal IIFE
      if (window.closeLinkedSpacesModal) window.closeLinkedSpacesModal(); // set by LinkedSpaces modal IIFE
    }
  });
```

Replace with (two new lines added inside the `if` body — do NOT add a second event listener):
```javascript
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeOiPopup();
      if (window.closeBloggoModal) window.closeBloggoModal(); // set by Bloggo modal IIFE
      if (window.closeLinkedSpacesModal) window.closeLinkedSpacesModal(); // set by LinkedSpaces modal IIFE
      if (window.closeGraphicDesignModal) window.closeGraphicDesignModal(); // set by Graphic Design modal IIFE
      if (window.closeDigitalMediaModal)  window.closeDigitalMediaModal();  // set by Digital Media modal IIFE
    }
  });
```

- [ ] **Step 3: Commit**

```bash
git add .superpowers/brainstorm/851-1774956399/hero-h-space.html
git commit -m "feat: add Graphic Design and Digital Media modal JS"
```

---

## Task 5: Full verification

- [ ] **Step 1: Open in browser and run through the checklist**

Open `.superpowers/brainstorm/851-1774956399/hero-h-space.html` directly in a browser.

**Cards:**
- GRAPHIC DESIGN card title is uppercased ✓
- DIGITAL MEDIA card title is uppercased ✓
- Both arrow labels read "View More →" ✓

**Graphic Design modal:**
- Click GRAPHIC DESIGN card → modal opens with animation ✓
- Left column: tag "Brand + Visual", title "GRAPHIC DESIGN", description text, no CTA button ✓
- Right column: "My Story" copy, "Toolkit" with Figma / Photoshop / Canva ✓
- Pills: Figma · Photoshop · Canva · Visual Design · Social Media ✓

**Digital Media modal:**
- Click DIGITAL MEDIA card → modal opens ✓
- Left column: tag "Content Creation", title "DIGITAL MEDIA", description, "Follow on Instagram" button → `https://www.instagram.com/yoobinseo` ✓
- Right column: "My Story" copy, "Toolkit" with Storytelling / Content Strategy / Video Editing / Graphic Design ✓
- Pills: Storytelling · Content Strategy · Video Editing · YouTube · Building in Public ✓

**Close paths (test each modal):**
- ✕ button closes modal ✓
- Click backdrop (outside panel) closes modal ✓
- Escape closes modal ✓

**No regressions:**
- Bloggo modal still opens and closes correctly ✓
- LinkedSpaces modal still opens and closes correctly ✓
- Escape closes whichever modal is open ✓

**Responsive (narrow below 560px):**
- Both modals switch to single-column layout ✓
