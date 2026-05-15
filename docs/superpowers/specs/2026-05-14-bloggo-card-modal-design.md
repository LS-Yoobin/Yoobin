# Bloggo Card Modal — Design Spec

**Date:** 2026-05-14  
**Status:** Approved  
**Scope:** MY WORK section in `hero-h-space.html`

---

## Overview

When a user clicks the BLOGGO work card in the MY WORK section, a modal overlay opens with a detailed view of the project — its vision, the builder's contribution, and CTAs to try the beta or visit the website.

---

## Trigger

- **Interaction:** Click anywhere on the `.work-card` element whose `.wc-title` is "BLOGGO"
- Other work cards remain non-interactive (no modal for them at this stage)
- The existing hover style on `.work-card` already signals interactivity

---

## Modal Behavior

| Property | Value |
|---|---|
| Open trigger | Click on BLOGGO card |
| Close trigger | Click outside modal, click ✕ button, press Escape |
| Animation in | `opacity: 0→1` + `scale: 0.95→1`, 220ms ease-out |
| Animation out | Reverse, remove from DOM after transition |
| Scroll lock | Body scroll disabled while modal is open |

---

## Visual Design

Matches existing dark green terminal aesthetic throughout the site.

- **Backdrop:** `rgba(0,0,0,0.8)` with `backdrop-filter: blur(4px)`
- **Panel:** `background: #030d06`, `border: 1px solid rgba(34,197,94,0.25)`, `border-radius: 16px`
- **Top edge:** 1px linear gradient line `transparent → rgba(34,197,94,0.7) → transparent`
- **Max width:** 700px, centered, with `padding: 2.2rem`
- **Font:** `'Courier New', monospace` — consistent with site

---

## Modal Content Layout (Two-Column)

### Left Column
- Tag: `Product / Social Platform` (green, uppercase, small caps)
- Title: `BLOGGO` (Arial Black, large, white)
- Description: "A local-first travel blogging platform that converts photo metadata into structured blog narratives — eliminating blank page anxiety for travelers."
- CTA 1 (primary, filled green): **Try Beta Today** → `https://testflight.apple.com/join/RMzfPzCf`
- CTA 2 (outlined): **Visit Website** → `https://bloggo.linkedspaces.com/`

### Divider
- `border-left: 1px solid rgba(34,197,94,0.15)` between columns

### Right Column
- Label: `VISION`
- Copy: "Turn trip photos into blogs. Fast. Bloggo reads your camera roll's metadata and builds a structured narrative draft — so the story writes itself."
- Label: `WHAT I BUILT`
- Copy (line-separated):
  - Product architecture & technical direction
  - Mobile UI/UX design (iOS)
  - Backend systems & data pipeline
  - Beta launch via TestFlight

### Bottom Row (full-width, below both columns)
- Horizontal divider (`rgba(34,197,94,0.12)`)
- Skill pills: `Product Design` · `iOS Dev` · `UX Research` · `Backend` · `Co-Founder`

---

## Responsive Behavior

| Breakpoint | Layout |
|---|---|
| ≥ 560px | Two-column grid |
| < 560px | Single column — left stacked above right, border-top instead of border-left |

---

## Implementation Notes

- All changes confined to `hero-h-space.html` (the legacy HTML file at `.superpowers/brainstorm/851-1774956399/hero-h-space.html`)
- Add a CSS block for modal styles (backdrop, panel, columns, pills, buttons, animations)
- Add modal HTML after the `#section-work` closing tag
- Add ~30 lines of vanilla JS: open on card click, close on backdrop click / ✕ / Escape, scroll lock/unlock
- No new dependencies required
