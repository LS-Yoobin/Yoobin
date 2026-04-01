# Ship Impact Glitch — Design Spec
**Date:** 2026-03-31
**Status:** Draft

## Overview

As the user scrolls down from the hero, an attacker spaceship zooms in from below (perspective scale), crashes into the hero text, causes a signal-glitch corruption effect, and both the ship and text fade out. The planet element is removed from `CockpitScrollTransition` entirely. The effect is fully scroll-scrubable — no timers, no one-shot animations.

---

## Goals

- Create a cinematic, scroll-driven sequence where a spaceship "destroys" the hero text
- Use the same fighter SVG geometry already present in the legacy hero (`hero-h-space.html`)
- Keep the neon-green HUD aesthetic; no new color palette introduced
- Remove the planet from the cockpit scroll scene (doesn't fit the HUD aesthetic)

---

## Scroll Timeline

All phases are driven by `useScroll()` (window-level) and `useTransform` on `scrollYProgress`. Fully reversible — scrubbing back restores the previous state.

| Phase | scrollYProgress | Behavior |
|---|---|---|
| Idle | 0 – 0.15 | Hero text visible, mouse crosshair active, background ships fly past |
| Approach | 0.15 – 0.50 | Attacker ship enters frame from bottom-center, scales up (perspective zoom). Text begins subtle glitch: pixel noise artifacts appear, scan-line overlay intensifies |
| Impact | 0.50 – 0.80 | Ship reaches text layer. Full glitch: heading slices offset horizontally, crosshair rings fragment and fade. Ship hull emits impact glow |
| Fade-out | 0.80 – 1.00 | Text fully corrupted and fades to opacity 0. Ship fades through the screen. HUD goes dark. Cockpit transition begins |

---

## Components Changed

### `components/HeroSection.tsx` — modified

**Ship element:**
- A `<motion.svg>` with `viewBox="0 0 80 36"` rendered at `width={192} height={84}` (3× scale). Each path is a separate SVG element with `fill` near-black (`#050505`) and neon-green `stroke` (`rgba(34,197,94,0.85)`) at `strokeWidth={0.6}`, except wing pair 2 which uses `rgba(34,197,94,0.45)` stroke at `strokeWidth={0.4}`:
  - Body `<path>`: `M6 18 L18 10 L60 14 L74 18 L60 22 L18 26 Z`
  - Cockpit `<ellipse>`: `cx={58} cy={18} rx={4} ry={2.5}`, `fill="rgba(34,197,94,0.15)"`, `stroke="rgba(34,197,94,0.6)"` `strokeWidth={0.5}`
  - Wing pair 1 upper `<path>`: `M30 14 L26 4 L38 12 Z`, `fill="#060606"`, `stroke="rgba(34,197,94,0.6)"` `strokeWidth={0.5}`
  - Wing pair 1 lower `<path>`: `M30 22 L26 32 L38 24 Z`, same fill/stroke as upper
  - Wing pair 2 upper `<path>`: `M20 16 L14 8 L24 13 Z`, `fill="#040404"`, `stroke="rgba(34,197,94,0.45)"` `strokeWidth={0.4}`
  - Wing pair 2 lower `<path>`: `M20 20 L14 28 L24 23 Z`, same fill/stroke as wing pair 2 upper
  - Engine port circles (2): `<circle cx={9} cy={15} r={1.2}` and `<circle cx={9} cy={21} r={1.2}`, both `fill="rgba(34,197,94,0.5)"` `stroke="rgba(34,197,94,0.8)"` `strokeWidth={0.3}`
  - Hull detail lines (2): `<line x1={20} y1={14} x2={55} y2={14}` and `<line x1={20} y1={22} x2={55} y2={22}`, both `stroke="rgba(34,197,94,0.2)"` `strokeWidth={0.3}` `strokeDasharray="3 4"`
  - SVG `filter`: `drop-shadow(0 0 6px rgba(34,197,94,0.5))`
- Positioned absolute, centered horizontally (`left: 50%, translateX(-50%)`), starting below the section bottom
- Scroll transforms:
  - `scale`: `[0.15, 1]` over scrollYProgress `[0.15, 0.75]`
  - `y`: `["120%", "20%"]` over scrollYProgress `[0.15, 0.70]`; clamps at `"20%"` for scrollYProgress > 0.70
  - `opacity`: `[0, 1, 1, 0]` at scrollYProgress `[0.12, 0.20, 0.78, 0.95]`
- Engine glow: 3 absolutely positioned `<div>` elements behind the ship (parent div, `position: absolute; bottom: 100%; left: 50%`):
  - Center trail: `width: 2px; height: 60px`, `background: linear-gradient(to bottom, transparent, rgba(34,197,94,0.7))`, `filter: blur(1px)`, centered (`translateX(-50%)`)
  - Left wing trail: `width: 1px; height: 40px`, same gradient at 0.4 opacity, `translateX(calc(-50% - 18px))`
  - Right wing trail: `width: 1px; height: 40px`, same gradient at 0.4 opacity, `translateX(calc(-50% + 18px))`
  - Engine glow dot: `width: 6px; height: 6px; background: #00ff8c; border-radius: 50%`, `box-shadow: 0 0 12px #00ff8c, 0 0 24px rgba(0,255,140,0.4)`, centered, `translateY(4px)` — all 4 elements share parent `<motion.div>` whose `opacity` follows ship opacity
- Impact glow: absolute `<div>` centered horizontally at the ship's position (`left: 50%; translateX(-50%)`), `width: 180px; height: 60px`, placed at the same vertical center as the ship, `background: radial-gradient(ellipse at 50% 100%, rgba(34,197,94,0.12), transparent 70%)`. Opacity driven by `useTransform` with **linear** interpolation (Motion default): `[0, 0, 0.6, 0]` at scrollYProgress `[0.45, 0.55, 0.65, 0.80]` — flat 0 from 0.45→0.55, linear ramp up to peak 0.6 at 0.65, linear ramp down to 0 at 0.80

**Glitch layer (new):**
- Absolutely positioned overlay div covering the full text area (inset: 0), pointer-events none, z-index above text
- 4 cloned text strips. The heading text (`HeroSection`'s name + subtitle) is duplicated 4 times in JSX as absolutely-positioned `<motion.div>` copies, each covering `inset: 0` over the original text div, with `clip-path` applied via inline style to isolate a horizontal band. The original text div is hidden (`opacity: 0`) once the glitch overlay is active (scrollYProgress > 0.45). Each strip uses `useTransform` on scrollYProgress for `translateX` (linear interpolation, default Motion behavior):
  - `inset(T R B L)` clips `T` from top and `B` from bottom; visible band = row between T% and (100%-B%) of the element height
  - Strip 1 (visible rows 0–25%): `clip-path: inset(0 0 75% 0)`, `translateX` `["0px", "-14px"]` over `[0.45, 0.80]`, static CSS `opacity: 0.9`
  - Strip 2 (visible rows 25–50%): `clip-path: inset(25% 0 50% 0)`, `translateX` `["0px", "18px"]` over `[0.45, 0.80]`, static CSS `opacity: 0.65`
  - Strip 3 (visible rows 50–75%): `clip-path: inset(50% 0 25% 0)`, `translateX` `["0px", "-8px"]` over `[0.45, 0.80]`, static CSS `opacity: 0.45`
  - Strip 4 (visible rows 75–100%): `clip-path: inset(75% 0 0 0)`, `translateX` `["0px", "22px"]` over `[0.45, 0.80]`, static CSS `opacity: 0.25`
  - All 4 strips inherit parent `<motion.div>` fade (opacity fades to 0 at scrollYProgress 0.85–1.0)
- Pixel noise: exactly 5 `<div>` blocks, each `position: absolute`, `background: #00ff8c` or `#4fffb0` (alternating), all with `pointer-events: none`. Positions are fixed (not random). Each block's opacity is a `useTransform` from scrollYProgress `[0.48, 0.55, 0.75, 0.82]` → `[0, opacity_peak, opacity_peak, 0]`:
  - Block 1: `top: 8px; left: 28%; width: 14px; height: 3px`, background `#00ff8c`, peak opacity 0.70
  - Block 2: `top: 18px; right: 22%; width: 8px; height: 2px`, background `#4fffb0`, peak opacity 0.55
  - Block 3: `top: 30px; left: 40%; width: 6px; height: 4px`, background `#00ff8c`, peak opacity 0.50
  - Block 4: `top: 12px; left: 55%; width: 10px; height: 2px`, background `#00ff8c`, peak opacity 0.45
  - Block 5: `top: 24px; right: 30%; width: 7px; height: 3px`, background `#4fffb0`, peak opacity 0.60
- Scan-line overlay: `position: absolute; inset: 0`, `background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,140,0.03) 3px, rgba(0,255,140,0.03) 4px)` (horizontal lines, 4px repeat period). Opacity driven by `useTransform`: `[0, 0.18]` over scrollYProgress `[0.40, 0.70]`
- All glitch elements share the parent `<motion.div>` fade (opacity `[1, 0]` over scrollYProgress `[0.85, 1.0]`)

**Background ships:**
- The 4 existing CSS keyframe ships from `hero-h-space.html` are NOT ported into this component — they are background atmosphere only and would require significant CSS animation work. They remain in the legacy file, which is not rendered in the new stack.
- The attacker ship is the only ship in `HeroSection`.

**Note on `isScrolling` threshold:**
- The existing `isScrolling` boolean (threshold 60px) is replaced by scroll-phase logic. The mouse-follow useEffect is disabled once `scrollYProgress > 0.10` instead of at 60px, so the crosshair locks before the ship appears.

### `components/CockpitScrollTransition.tsx` — modified

**Planet removal:**
- In `CockpitScrollTransition.tsx`, remove lines 42–45 (the 4 `useTransform` calls: `planetOpacity`, `planetX`, `planetY`, `planetScale`). These variables are only referenced by the planet `<motion.div>` — no other elements use them.
- Remove the planet `<motion.div>` block at lines 94–109: the outer `<motion.div className="absolute left-[58%] top-[56%] h-[46rem] w-[46rem]...">` and all 3 child `<div>` elements inside it (the `-inset-5 rounded-full border` blur div, the atmospheric glow radial-gradient div, and the existing inset background gradient div). This element is a direct child of the outer cockpit `<motion.div className="absolute inset-0">`.
- All other cockpit elements (grid, rings, vignette, tilt/yaw/scale transforms on the cockpit container) are preserved exactly as-is.
- Also remove the `CockpitScrollTransitionProps` type and `onNavigationModeChange` prop (already done in the `feature/hero-scroll-interaction` branch — verify these are gone before modifying).

---

## Coordinate System

- Ship position is in percentage units for x (centered at 50%), absolute px for y offset
- Glitch strip offsets are in px (small values, visually bounded)
- All scroll breakpoints are in `scrollYProgress` (0–1), not raw px

---

## Constraints

- Motion for React only — no new libraries
- No JavaScript randomness or `Math.random()` — all values are deterministic `useTransform` outputs
- No CSS keyframe animations on the attacker ship
- Must be performant: all animated properties use `transform` and `opacity` only (GPU-composited)
- No changes to `SystemLogSection`
- Legacy HTML file untouched

---

## Out of Scope

- Porting the 4 background ships from `hero-h-space.html` into the React component
- Sound effects
- Any changes to `SystemLogSection`
- Mobile-specific adjustments (can be addressed later)
