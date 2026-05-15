# Expertise Card Modals — Design Spec

**Date:** 2026-05-14  
**Status:** Approved  
**Scope:** MY WORK section in `.superpowers/brainstorm/851-1774956399/hero-h-space.html`

---

## Overview

Add expertise modals to the Graphic Design and Digital Media work cards, and update both cards' arrow text from "View Project →" to "View More →". Unlike the Bloggo and LinkedSpaces project modals, these showcase personal expertise and creative background rather than a product. The modal layout mirrors the existing `bm-*` pattern with adapted right-column labels (`MY STORY` / `TOOLKIT` instead of `VISION` / `WHAT I BUILT`).

---

## Card Updates

### Graphic Design card (lines ~3024–3029)

| Field | Old | New |
|---|---|---|
| `id` | none | `id="work-card-graphic-design"` |
| `.wc-arrow` | `View Project &#8594;` | `View More &#8594;` |

Tag, title, and desc unchanged.

### Digital Media card (lines ~3030–3035)

| Field | Old | New |
|---|---|---|
| `id` | none | `id="work-card-digital-media"` |
| `.wc-arrow` | `View Project &#8594;` | `View More &#8594;` |

Tag, title, and desc unchanged.

---

## Trigger

- Click on `#work-card-graphic-design` → opens `#graphic-design-modal`
- Click on `#work-card-digital-media` → opens `#digital-media-modal`
- Other cards unchanged

---

## Modal Behavior

Same as existing Bloggo / LinkedSpaces modals:

| Property | Value |
|---|---|
| Open trigger | Click on respective card |
| Close trigger | Click outside modal, click ✕ button, press Escape |
| Animation | `opacity 0→1` + `scale 0.95→1`, 220ms ease-out; reverse on close |
| Scroll lock | `document.body.style.overflow = 'hidden'` on open; restored on close |

---

## Visual Design

Matches the existing dark green terminal aesthetic. Reuses all existing `bm-*` CSS classes. No new CSS needed.

---

## Graphic Design Modal

### IDs
- Backdrop: `graphic-design-modal`
- Close button: `graphic-design-modal-close`
- Card: `work-card-graphic-design`

### Left Column
- Tag: `Brand + Visual`
- Title: `GRAPHIC DESIGN`
- Description: "I've always been on the creative side. I love crafting graphics that support ideas — from social media visuals to in-app assets — making every touchpoint feel intentional."
- CTA: **none** — no external link

### Right Column
- Label: `MY STORY`
- Copy: "Creativity has been a constant throughout my life. Whether designing for apps, brands, or social media campaigns, I approach every visual with the same instinct: make it clear, make it feel right."
- Label: `TOOLKIT`
- Copy (line-separated): Figma · Photoshop · Canva

### Bottom Pills
`Figma` · `Photoshop` · `Canva` · `Visual Design` · `Social Media`

---

## Digital Media Modal

### IDs
- Backdrop: `digital-media-modal`
- Close button: `digital-media-modal-close`
- Card: `work-card-digital-media`

### Left Column
- Tag: `Content Creation`
- Title: `DIGITAL MEDIA`
- Description: "From live streaming on YouTube to building in public — I've spent years creating content that documents real journeys and connects with real people."
- CTA (primary, filled green): **Follow on Instagram** → `https://www.instagram.com/yoobinseo`

### Right Column
- Label: `MY STORY`
- Copy: "I started my content journey live streaming on YouTube, documenting my progression through hobbies and personal projects. Now I create with a purpose — building in public and sharing the process of making something real."
- Label: `TOOLKIT`
- Copy (line-separated): Storytelling · Content Strategy · Video Editing · Graphic Design

### Bottom Pills
`Storytelling` · `Content Strategy` · `Video Editing` · `YouTube` · `Building in Public`

---

## Responsive Behavior

Inherits the existing Bloggo/LinkedSpaces breakpoint — no new media query needed.

| Breakpoint | Layout |
|---|---|
| ≥ 560px | Two-column grid |
| < 560px | Single column, left stacked above right |

---

## Implementation Notes

- All changes confined to `hero-h-space.html`
- **CSS:** No new styles needed — both modals reuse all existing `bm-*` and `bloggo-modal-*` class rules
- **HTML (cards):** Add `id` and update `.wc-arrow` text on both cards
- **HTML (modals):** Insert two new modal nodes after the LinkedSpaces modal closing tag and before `<section id="section-experience">`
- **JS:** Add two new IIFEs (one per modal) after the LinkedSpaces modal IIFE, same open/close/animationend pattern. Register `window.closeGraphicDesignModal` and `window.closeDigitalMediaModal`. Edit the single existing Escape keydown handler in-place — add both new close calls inside the `if (e.key === 'Escape')` body alongside the existing ones. Do NOT add new `keydown` listeners.
