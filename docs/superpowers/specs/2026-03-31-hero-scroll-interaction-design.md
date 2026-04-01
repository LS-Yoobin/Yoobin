# Hero Scroll Interaction — Design Spec
**Date:** 2026-03-31
**Status:** Draft

## Overview

Update the portfolio landing hero so it transitions smoothly between two states based on window scroll position. The hero self-manages its own scroll detection — no parent coordination required. Two existing props are removed as part of this change: `isAutoNavigation` on `HeroSection` and `onNavigationModeChange` on `CockpitScrollTransition`.

---

## Goals

- Make the hero feel alive and interactive while the user is idle at the top of the page
- Give a clear, premium transition signal when the user begins scrolling
- Set the stage for the cockpit/ship-turn scroll sequence that follows

---

## Two States

### STATE 1 — Idle (scrollY ≤ 60px)
- All hero text is fully visible: name, subtitle, "Scroll to Explore", and the status badge
- Crosshair (HUD lines + rings) follows the mouse in real time via spring physics; opacity at 1
- Background stars, gradient, and scan-line grid are visible and static

### STATE 2 — Scrolling (scrollY > 60px)
- All hero text fades out and translates slightly upward (`opacity: 0, y: -24`), including the status badge
- Mouse listener is removed; crosshair target resets to `{ x: 50, y: 50 }` (percentage-of-viewport units — center)
- Existing springs animate the crosshair back to center naturally — no extra animation code needed
- Crosshair fades to `opacity: 0.58` to signal locked state; locks in place once springs settle

The state is **bidirectional**: if the user scrolls back up to ≤ 60px, `isScrolling` returns to `false` and the hero returns to STATE 1.

---

## Implementation

### New imports required in `HeroSection`
Add `useScroll` and `useMotionValueEvent` from `motion/react`. Remove `useState` import for `isAutoNavigation` (no longer needed, but `useState` is still used for `target`).

### Scroll Detection
- Use `useScroll()` from Motion (no target = window-level scroll) inside `HeroSection`
- Lenis v1.3.21 (active in this project via `SmoothScroll.tsx`) syncs native scroll via `window.scrollTo()` each RAF frame — Motion's `useScroll()` reads native `scrollY` and receives correct values
- Use `useMotionValueEvent` on `scrollY` with bidirectional logic:
  - `scrollY > 60` → `setIsScrolling(true)`
  - `scrollY ≤ 60` → `setIsScrolling(false)`
- Threshold: **60px**

### Lenis provider consolidation
`LenisProvider.tsx` is an unused duplicate of `SmoothScroll.tsx`. Delete `LenisProvider.tsx`. `SmoothScroll.tsx` remains the canonical smooth scroll provider (used in `layout.tsx`).

### Text Fade
- Wrap all text elements in a single `<motion.div>`: name, subtitle, "Scroll to Explore", and the status badge
- Animate based on `isScrolling`:
  - Idle: `{ opacity: 1, y: 0 }`
  - Scrolling: `{ opacity: 0, y: -24 }`
- `transition: { duration: 0.5, ease: "easeOut" }`

### Status badge
With `isAutoNavigation` removed, the badge displays a single static string: `"MANUAL SCAN MODE ACTIVE"`. The blink animation is preserved. It fades with the rest of the text in STATE 2.

### Crosshair
- Coordinate system: percentage-of-viewport. `x = (clientX / innerWidth) * 100`. Center = `{ x: 50, y: 50 }`.
- Keep existing spring setup: `stiffness: 130, damping: 22, mass: 0.65`
- The crosshair wrapper `motion.div` uses `animate={{ opacity: isScrolling ? 0.58 : 1 }}` with `transition: { duration: 0.7, ease: "easeOut" }` — matching the existing behavior previously driven by `isAutoNavigation`
- When `isScrolling` is false: attach `mousemove` listener, update target `{ x, y }`
- When `isScrolling` is true: remove listener, set target to `{ x: 50, y: 50 }` — springs animate back to center naturally

### Removed props

**`isAutoNavigation` (HeroSection):**
Removed from the type definition and all usage within `HeroSection`. The component takes no props.

**`onNavigationModeChange` (CockpitScrollTransition):**
Removed from the prop type, the `useMotionValueEvent` callback (line 18), and the entire `useEffect` cleanup block (lines 21–24 in current file) which has no remaining purpose once the prop is gone.

---

## Page Rewire (`page.tsx`)

`page.tsx` remains a **server component** (no `"use client"` needed — Next.js App Router allows server components to render client children). Replace the iframe render with:

```tsx
import { HeroSection } from "@/components/HeroSection";
import { CockpitScrollTransition } from "@/components/CockpitScrollTransition";
import { SystemLogSection } from "@/components/SystemLogSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <CockpitScrollTransition />
      <SystemLogSection />
    </main>
  );
}
```

### Scroll layout
- `HeroSection`: `h-screen` (100vh), sits at top of page
- `CockpitScrollTransition`: `h-[230vh]`, immediately below
- At 60px of window scroll (hero threshold), the cockpit section has not entered the viewport — its `scrollYProgress` (measured from its own section start) is exactly 0. No simultaneous firing between the two scroll listeners.

### Legacy file
The file at `.superpowers/brainstorm/851-1774956399/hero-h-space.html` is **left untouched**.

---

## Constraints

- Motion for React only — no new libraries
- No scroll-linked `useTransform` for text (state-driven `animate` is cleaner and bidirectionally reversible)
- Keep all existing visual elements: stars, gradient, scan-line grid, HUD rings
- Dark background, neon green HUD aesthetic preserved
- Code must be forward-compatible with the cockpit scroll sequence (next step)

---

## Out of Scope

- The cockpit/ship-turn scroll sequence itself (next step)
- Any changes to `CockpitScrollTransition` visuals
- Any changes to `SystemLogSection`
- Modifying or deleting the legacy HTML file
