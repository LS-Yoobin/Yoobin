# LinkedSpaces Card Modal — Design Spec

**Date:** 2026-05-14  
**Status:** Approved  
**Scope:** MY WORK section in `.superpowers/brainstorm/851-1774956399/hero-h-space.html`

---

## Overview

When a user clicks the LINKEDSPACES work card in the MY WORK section, a modal overlay opens with a detailed view of the project — its problem statement, the solution, the builder's contribution, and a CTA to visit the website.

---

## Card Updates (work grid)

The existing LinkedSpaces card needs two updates to reflect the travel app framing:

| Field | Old Value | New Value |
|---|---|---|
| Tag (`.wc-tag`) | `UI / UX Design` | `Product / Travel App` |
| Title (`.wc-title`) | `LinkedSpaces` | `LINKEDSPACES` |
| Description (`.wc-desc`) | "End-to-end product design for a professional networking start-up connecting people through shared spaces." | "A social travel platform built to help people map, save, and share the places that matter to them." |
| Arrow (`.wc-arrow`) | `View Project →` | unchanged — leave as-is |

The card also needs:
- `id="work-card-linkedspaces"` added for JS targeting
- `cursor: pointer` already applies from the base `.work-card` rule

---

## Trigger

- **Interaction:** Click anywhere on the `.work-card` element with `id="work-card-linkedspaces"`
- Other work cards are unchanged

---

## Modal Behavior

| Property | Value |
|---|---|
| Open trigger | Click on LINKEDSPACES card |
| Close trigger | Click outside modal, click ✕ button, press Escape |
| Animation in | `opacity: 0→1` + `scale: 0.95→1`, 220ms ease-out |
| Animation out | Reverse animation plays, then modal hidden via class toggle (persistent DOM node — not injected/removed) |
| Scroll lock | `document.body.style.overflow = 'hidden'` on open; restored on close |

---

## Visual Design

Matches the existing dark green terminal aesthetic and the Bloggo modal exactly.

- **Backdrop:** `rgba(0,0,0,0.8)` with `backdrop-filter: blur(4px)`
- **Panel:** `background: #030d06`, `border: 1px solid rgba(34,197,94,0.25)`, `border-radius: 16px`
- **Top edge:** 1px linear gradient line `transparent → rgba(34,197,94,0.7) → transparent`
- **Max width:** 700px, centered, `padding: 2.2rem`
- **Font:** `'Courier New', monospace`

The LinkedSpaces modal reuses all existing `bm-*` CSS classes. No new visual styles are needed — only new IDs and HTML.

---

## Modal Content Layout (Two-Column)

### Left Column
- Tag: `Product / Travel App` (green, uppercase, small caps)
- Title: `LINKEDSPACES` (`font-family: 'Arial Black'` — same as Bloggo)
- Description (problem as hook): "Travelers lose track of the places that matter. Disorganized photos, scattered memories, no easy way to look back — LinkedSpaces was built to fix that."
- CTA (primary, filled green): **Visit Website** → `https://www.linkedspaces.com/`

Single CTA only — no TestFlight / beta link.

### Divider
- `border-left: 1px solid rgba(34,197,94,0.15)` between columns (existing `bm-*` styles handle this)

### Right Column
- Label: `SOLUTION`
- Copy: "LinkedSpaces recognizes where and when your photos were taken, so saving your favorite spots is effortless. A virtual map of your travels — built automatically as you go."
- Label: `WHAT I BUILT`
- Copy (line-separated):
  - Co-founded the company
  - UI/UX design — iOS & web
  - Product management & roadmap
  - Brand identity & visual system

### Bottom Row (full-width)
- Horizontal divider (`rgba(34,197,94,0.12)`)
- Skill pills: `Co-Founder` · `UI/UX Design` · `Product Management` · `Brand Design` · `Mobile Design`

---

## Responsive Behavior

Inherits the same breakpoint as the Bloggo modal — no new media query needed.

| Breakpoint | Layout |
|---|---|
| ≥ 560px | Two-column grid |
| < 560px | Single column — left stacked above right, border-top instead of border-left |

---

## Implementation Notes

- All changes confined to `hero-h-space.html`
- **CSS:** No new styles needed — LinkedSpaces modal reuses all existing `bm-*` and `bloggo-modal-*` class rules. Add new ID-based selectors only if needed.
- **HTML:** Add `id="work-card-linkedspaces"` to the existing LinkedSpaces card div. Update card tag/title/desc. Add a new modal node (parallel to `#bloggo-modal`) after the Bloggo modal closing tag.
- **JS:** Add a new IIFE parallel to the Bloggo modal IIFE — same open/close/Escape pattern, referencing `#linkedspaces-modal`, `#work-card-linkedspaces`, `#linkedspaces-modal-close`. Register `window.closeLinkedSpacesModal` on the IIFE. Do **not** add a second `keydown` listener. Instead, edit the single existing `document.addEventListener('keydown', ...)` block in-place (currently at ~line 5358) to add `if (window.closeLinkedSpacesModal) window.closeLinkedSpacesModal();` as a second line inside the `if (e.key === 'Escape')` body, alongside the existing `closeBloggoModal` call.
- No new dependencies required.
