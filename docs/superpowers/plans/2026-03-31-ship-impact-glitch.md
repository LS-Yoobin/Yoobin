# Ship Impact Glitch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static iframe landing page with a scroll-driven hero where an attacker spaceship flies in, the hero text glitches out with signal corruption effects, and both fade away as the user enters the cockpit scene.

**Architecture:** Three tasks modify two components and one page in sequence — first rewire `page.tsx` from iframe to component stack, then transform `HeroSection.tsx` to add the ship + glitch layer driven entirely by `useScroll`/`useTransform` (no timers, no randomness), then strip the planet from `CockpitScrollTransition.tsx`. All animated properties use only `transform` and `opacity` for GPU compositing. The feature/hero-scroll-interaction worktree at `.worktrees/hero-scroll-interaction` has related prior work but is NOT the base for this branch — start fresh from `main`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 6, Motion for React v12 (`useScroll`, `useTransform`, `motion.div`, `motion.svg`), Tailwind CSS v4, Lenis v1.3.21 smooth scroll

**Spec:** `docs/superpowers/specs/2026-03-31-ship-impact-glitch-design.md`

---

## File Map

| File | Change |
|------|--------|
| `app/page.tsx` | Replace iframe + readFileSync with bare `<main>` + 3 components |
| `components/HeroSection.tsx` | Remove `isAutoNavigation` prop; add `useScroll` crosshair lock; add attacker ship; add glitch layer |
| `components/CockpitScrollTransition.tsx` | Remove `onNavigationModeChange` prop + callbacks; remove planet motion values + planet DOM block |

No new files are created.

---

## Task 1: Rewire page.tsx — replace iframe with component stack

**Files:**
- Modify: `app/page.tsx`

This task removes the server-side `readFileSync` iframe approach and replaces it with the real React component stack. The legacy HTML file stays on disk untouched. `page.tsx` becomes a simple server component with no `overflow-hidden` constraint (the page must scroll).

- [ ] **Step 1: Replace `app/page.tsx` with the component stack**

Replace the entire file with:

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

Note: `HeroSection` and `CockpitScrollTransition` still have their old props on `main` — this will cause TypeScript errors until Tasks 2 and 3 fix those signatures. That is expected at this step.

- [ ] **Step 2: Verify the import paths resolve**

Run: `npx tsc --noEmit`

Expected: TypeScript errors for missing props (`isAutoNavigation`, `onNavigationModeChange`) on the two components. No "Cannot find module" errors. If you see "Cannot find module", the `@/` alias is broken — check `tsconfig.json` has `"paths": { "@/*": ["./*"] }`.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: rewire page.tsx to component stack, remove iframe"
```

---

## Task 2: Transform HeroSection.tsx — remove prop, add ship + glitch layer

**Files:**
- Modify: `components/HeroSection.tsx`

This task completely rewrites `HeroSection.tsx`. The existing file uses an `isAutoNavigation: boolean` prop to control crosshair behavior. The new version:
- Removes that prop entirely
- Locks the crosshair at scrollYProgress > 0.10 instead
- Adds the attacker ship `<motion.svg>` with engine glow + impact glow
- Adds the 4-strip glitch overlay + 5 pixel noise blocks + scan-line overlay

The existing heading text content (`Yoobin Seo`, subtitle, badge, stars, crosshair) is preserved — only the scroll-reactive logic and new elements are added.

### Subtask 2a: Remove prop + add scroll-based crosshair lock

- [ ] **Step 1: Update imports and remove prop**

Change the import line and function signature at the top of `components/HeroSection.tsx`:

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";

export function HeroSection() {
  const [target, setTarget] = useState({ x: 50, y: 50 });
  const crosshairX = useSpring(50, { stiffness: 130, damping: 22, mass: 0.65 });
  const crosshairY = useSpring(50, { stiffness: 130, damping: 22, mass: 0.65 });
  const crosshairXPercent = useTransform(crosshairX, (value) => `${value}%`);
  const crosshairYPercent = useTransform(crosshairY, (value) => `${value}%`);

  const { scrollYProgress } = useScroll();
```

Remove the `HeroSectionProps` type entirely (it's no longer used).

- [ ] **Step 2: Update the mouse-follow useEffect to use scrollYProgress**

Replace the existing `useEffect` that reads `isAutoNavigation` with one that reads `scrollYProgress`:

```tsx
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      if (value > 0.10) {
        setTarget({ x: 50, y: 50 });
      }
    });

    const onMove = (event: MouseEvent) => {
      if (scrollYProgress.get() > 0.10) return;
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;
      setTarget({ x, y });
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      unsubscribe();
    };
  }, [scrollYProgress]);
```

Keep the existing `useEffect` that calls `crosshairX.set` / `crosshairY.set` — it is unchanged.

- [ ] **Step 3: Update crosshair opacity to use scrollYProgress instead of isAutoNavigation**

Find the `<motion.div>` that wraps the crosshair lines and rings (currently `animate={{ opacity: isAutoNavigation ? 0.58 : 1 }}`). Replace it:

```tsx
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: useTransform(scrollYProgress, [0, 0.10, 0.45], [1, 1, 0.3]),
        }}
      >
```

- [ ] **Step 4: Wrap hero text in a motion.div for the glitch layer (prep)**

The existing text block lives inside `<div className="relative z-20 flex h-full flex-col items-center justify-center text-center">`. Wrap the entire text content (label, h1, subtitle, badge, scroll hint) in a `<div style={{ position: "relative" }} id="hero-text-block">` — this will be the reference container for the glitch strips in the next subtask.

- [ ] **Step 5: Update badge to remove isAutoNavigation reference**

Find the badge `<motion.div>` that renders `{isAutoNavigation ? "AUTO NAVIGATION ENGAGED" : "MANUAL SCAN MODE ACTIVE"}`. Change it to always show `"MANUAL SCAN MODE ACTIVE"` (static string, no conditional).

- [ ] **Step 6: Run TypeScript check**

Run: `npx tsc --noEmit`

Expected: Errors for `onNavigationModeChange` prop on `CockpitScrollTransition` (not yet fixed) — that's fine. Zero errors related to `HeroSection`. If you see errors in HeroSection, fix them before continuing.

- [ ] **Step 7: Commit**

```bash
git add components/HeroSection.tsx
git commit -m "feat: remove isAutoNavigation prop, lock crosshair via scrollYProgress"
```

### Subtask 2b: Add attacker ship SVG

- [ ] **Step 1: Define scroll transforms for the ship at the top of the component body**

After the `scrollYProgress` declaration, add:

```tsx
  // Attacker ship transforms
  const shipScale = useTransform(scrollYProgress, [0.15, 0.75], [0.15, 1]);
  const shipY = useTransform(scrollYProgress, [0.15, 0.70], ["120%", "20%"]);
  const shipOpacity = useTransform(scrollYProgress, [0.12, 0.20, 0.78, 0.95], [0, 1, 1, 0]);
  const impactGlowOpacity = useTransform(scrollYProgress, [0.45, 0.55, 0.65, 0.80], [0, 0, 0.6, 0]);
```

- [ ] **Step 2: Add the ship JSX before the closing `</section>` tag**

Add this block as the last child of the `<section>` (after the text div, before `</section>`):

```tsx
      {/* Attacker ship */}
      <motion.div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2"
        style={{ scale: shipScale, y: shipY, opacity: shipOpacity, bottom: 0 }}
      >
        {/* Engine glow trails */}
        <div style={{ position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)" }}>
          <div style={{
            position: "absolute", bottom: 0, left: "50%",
            transform: "translateX(-50%)",
            width: 2, height: 60,
            background: "linear-gradient(to bottom, transparent, rgba(34,197,94,0.7))",
            filter: "blur(1px)",
          }} />
          <div style={{
            position: "absolute", bottom: 0, left: "50%",
            transform: "translateX(calc(-50% - 18px))",
            width: 1, height: 40,
            background: "linear-gradient(to bottom, transparent, rgba(34,197,94,0.4))",
            filter: "blur(1px)",
          }} />
          <div style={{
            position: "absolute", bottom: 0, left: "50%",
            transform: "translateX(calc(-50% + 18px))",
            width: 1, height: 40,
            background: "linear-gradient(to bottom, transparent, rgba(34,197,94,0.4))",
            filter: "blur(1px)",
          }} />
          {/* Engine glow dot */}
          <div style={{
            position: "absolute", bottom: 0, left: "50%",
            transform: "translateX(-50%) translateY(4px)",
            width: 6, height: 6,
            background: "#00ff8c",
            borderRadius: "50%",
            boxShadow: "0 0 12px #00ff8c, 0 0 24px rgba(0,255,140,0.4)",
          }} />
        </div>

        {/* Ship SVG */}
        <svg
          width={192}
          height={84}
          viewBox="0 0 80 36"
          fill="none"
          style={{ filter: "drop-shadow(0 0 6px rgba(34,197,94,0.5))" }}
        >
          <path d="M6 18 L18 10 L60 14 L74 18 L60 22 L18 26 Z" fill="#050505" stroke="rgba(34,197,94,0.85)" strokeWidth={0.6} />
          <ellipse cx={58} cy={18} rx={4} ry={2.5} fill="rgba(34,197,94,0.15)" stroke="rgba(34,197,94,0.6)" strokeWidth={0.5} />
          <path d="M30 14 L26 4 L38 12 Z" fill="#060606" stroke="rgba(34,197,94,0.6)" strokeWidth={0.5} />
          <path d="M30 22 L26 32 L38 24 Z" fill="#060606" stroke="rgba(34,197,94,0.6)" strokeWidth={0.5} />
          <path d="M20 16 L14 8 L24 13 Z" fill="#040404" stroke="rgba(34,197,94,0.45)" strokeWidth={0.4} />
          <path d="M20 20 L14 28 L24 23 Z" fill="#040404" stroke="rgba(34,197,94,0.45)" strokeWidth={0.4} />
          <circle cx={9} cy={15} r={1.2} fill="rgba(34,197,94,0.5)" stroke="rgba(34,197,94,0.8)" strokeWidth={0.3} />
          <circle cx={9} cy={21} r={1.2} fill="rgba(34,197,94,0.5)" stroke="rgba(34,197,94,0.8)" strokeWidth={0.3} />
          <line x1={20} y1={14} x2={55} y2={14} stroke="rgba(34,197,94,0.2)" strokeWidth={0.3} strokeDasharray="3 4" />
          <line x1={20} y1={22} x2={55} y2={22} stroke="rgba(34,197,94,0.2)" strokeWidth={0.3} strokeDasharray="3 4" />
        </svg>

        {/* Impact glow */}
        <motion.div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 180,
            height: 60,
            background: "radial-gradient(ellipse at 50% 100%, rgba(34,197,94,0.12), transparent 70%)",
            opacity: impactGlowOpacity,
            pointerEvents: "none",
          }}
        />
      </motion.div>
```

- [ ] **Step 3: TypeScript check**

Run: `npx tsc --noEmit`

Expected: Same CockpitScrollTransition error as before — no new errors in HeroSection. SVG attributes like `strokeWidth`, `strokeDasharray` are camelCase in JSX — verify no prop casing errors.

- [ ] **Step 4: Commit**

```bash
git add components/HeroSection.tsx
git commit -m "feat: add attacker ship SVG with scroll-driven scale/y/opacity"
```

### Subtask 2c: Add glitch layer

- [ ] **Step 1: Define glitch scroll transforms**

Add these after the ship transforms:

```tsx
  // Glitch transforms — strip offsets
  const strip1X = useTransform(scrollYProgress, [0.45, 0.80], ["0px", "-14px"]);
  const strip2X = useTransform(scrollYProgress, [0.45, 0.80], ["0px", "18px"]);
  const strip3X = useTransform(scrollYProgress, [0.45, 0.80], ["0px", "-8px"]);
  const strip4X = useTransform(scrollYProgress, [0.45, 0.80], ["0px", "22px"]);

  // Glitch transforms — pixel noise opacities
  const noise1Opacity = useTransform(scrollYProgress, [0.48, 0.55, 0.75, 0.82], [0, 0.70, 0.70, 0]);
  const noise2Opacity = useTransform(scrollYProgress, [0.48, 0.55, 0.75, 0.82], [0, 0.55, 0.55, 0]);
  const noise3Opacity = useTransform(scrollYProgress, [0.48, 0.55, 0.75, 0.82], [0, 0.50, 0.50, 0]);
  const noise4Opacity = useTransform(scrollYProgress, [0.48, 0.55, 0.75, 0.82], [0, 0.45, 0.45, 0]);
  const noise5Opacity = useTransform(scrollYProgress, [0.48, 0.55, 0.75, 0.82], [0, 0.60, 0.60, 0]);

  // Glitch transforms — scan line and parent fade
  const scanLineOpacity = useTransform(scrollYProgress, [0.40, 0.70], [0, 0.18]);
  const glitchFadeOpacity = useTransform(scrollYProgress, [0.85, 1.0], [1, 0]);

  // Hide original text once glitch strips take over
  const originalTextOpacity = useTransform(scrollYProgress, [0.44, 0.46], [1, 0]);
```

- [ ] **Step 2: Add the glitch overlay inside the `hero-text-block` div**

Inside the `<div id="hero-text-block">` wrapper added in Subtask 2a Step 4, add this sibling block after the existing heading/subtitle/badge content:

```tsx
        {/* Glitch overlay — 4 strips + pixel noise + scan line */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity: glitchFadeOpacity,
          }}
          aria-hidden="true"
        >
          {/* Strip 1 — top 25%, shift left */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              clipPath: "inset(0 0 75% 0)",
              translateX: strip1X,
              opacity: 0.9,
              fontFamily: "inherit",
              fontSize: "inherit",
              fontWeight: "inherit",
              color: "#00ff8c",
              textTransform: "uppercase",
              letterSpacing: "inherit",
            }}
          >
            <p style={{ marginBottom: "1rem", fontSize: "0.75rem", letterSpacing: "0.4em", opacity: 0.7 }}>Portfolio Interface // 2026</p>
            <h1 style={{ fontSize: "clamp(3rem,7vw,4.5rem)", fontWeight: 900, letterSpacing: "-0.01em" }}>
              Yoobin <span style={{ color: "#4fffb0" }}>Seo</span>
            </h1>
            <p style={{ marginTop: "1rem", fontSize: "0.875rem", letterSpacing: "0.24em", opacity: 0.8 }}>
              UI/UX Designer · Co-Founder · Product Builder
            </p>
          </motion.div>

          {/* Strip 2 — 25–50%, shift right */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              clipPath: "inset(25% 0 50% 0)",
              translateX: strip2X,
              opacity: 0.65,
              color: "#00ff8c",
              textTransform: "uppercase",
            }}
          >
            <p style={{ marginBottom: "1rem", fontSize: "0.75rem", letterSpacing: "0.4em", opacity: 0.7 }}>Portfolio Interface // 2026</p>
            <h1 style={{ fontSize: "clamp(3rem,7vw,4.5rem)", fontWeight: 900, letterSpacing: "-0.01em" }}>
              Yoobin <span style={{ color: "#4fffb0" }}>Seo</span>
            </h1>
            <p style={{ marginTop: "1rem", fontSize: "0.875rem", letterSpacing: "0.24em", opacity: 0.8 }}>
              UI/UX Designer · Co-Founder · Product Builder
            </p>
          </motion.div>

          {/* Strip 3 — 50–75%, shift left */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              clipPath: "inset(50% 0 25% 0)",
              translateX: strip3X,
              opacity: 0.45,
              color: "#4fffb0",
              textTransform: "uppercase",
            }}
          >
            <p style={{ marginBottom: "1rem", fontSize: "0.75rem", letterSpacing: "0.4em", opacity: 0.7 }}>Portfolio Interface // 2026</p>
            <h1 style={{ fontSize: "clamp(3rem,7vw,4.5rem)", fontWeight: 900, letterSpacing: "-0.01em" }}>
              Yoobin <span style={{ color: "#00ff8c" }}>Seo</span>
            </h1>
            <p style={{ marginTop: "1rem", fontSize: "0.875rem", letterSpacing: "0.24em", opacity: 0.8 }}>
              UI/UX Designer · Co-Founder · Product Builder
            </p>
          </motion.div>

          {/* Strip 4 — 75–100%, shift right */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              clipPath: "inset(75% 0 0 0)",
              translateX: strip4X,
              opacity: 0.25,
              color: "#00ff8c",
              textTransform: "uppercase",
            }}
          >
            <p style={{ marginBottom: "1rem", fontSize: "0.75rem", letterSpacing: "0.4em", opacity: 0.7 }}>Portfolio Interface // 2026</p>
            <h1 style={{ fontSize: "clamp(3rem,7vw,4.5rem)", fontWeight: 900, letterSpacing: "-0.01em" }}>
              Yoobin <span style={{ color: "#4fffb0" }}>Seo</span>
            </h1>
            <p style={{ marginTop: "1rem", fontSize: "0.875rem", letterSpacing: "0.24em", opacity: 0.8 }}>
              UI/UX Designer · Co-Founder · Product Builder
            </p>
          </motion.div>

          {/* Pixel noise blocks — 5 fixed-position divs */}
          <motion.div style={{ position: "absolute", top: 8, left: "28%", width: 14, height: 3, background: "#00ff8c", opacity: noise1Opacity }} />
          <motion.div style={{ position: "absolute", top: 18, right: "22%", width: 8, height: 2, background: "#4fffb0", opacity: noise2Opacity }} />
          <motion.div style={{ position: "absolute", top: 30, left: "40%", width: 6, height: 4, background: "#00ff8c", opacity: noise3Opacity }} />
          <motion.div style={{ position: "absolute", top: 12, left: "55%", width: 10, height: 2, background: "#00ff8c", opacity: noise4Opacity }} />
          <motion.div style={{ position: "absolute", top: 24, right: "30%", width: 7, height: 3, background: "#4fffb0", opacity: noise5Opacity }} />

          {/* Scan-line overlay */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,255,140,0.03) 3px, rgba(0,255,140,0.03) 4px)",
              opacity: scanLineOpacity,
              pointerEvents: "none",
            }}
          />
        </motion.div>
```

- [ ] **Step 3: Apply `originalTextOpacity` to the original text wrapper**

The `<div id="hero-text-block">` wrapper needs to fade out when glitch strips activate. Add a `style` prop to it:

```tsx
        <div
          id="hero-text-block"
          style={{ position: "relative" }}
        >
          {/* Original text — wraps label, h1, subtitle, badge, scroll hint */}
          <motion.div style={{ opacity: originalTextOpacity }}>
            {/* ... existing label, h1, subtitle, badge, scroll hint JSX unchanged ... */}
          </motion.div>
          {/* Glitch overlay (added in Step 2 above) */}
        </div>
```

Important: The original text must stay inside a `motion.div` with `opacity: originalTextOpacity` so it disappears when strips appear. The strips render on top via `position: absolute`.

- [ ] **Step 4: TypeScript check**

Run: `npx tsc --noEmit`

Expected: Zero new errors from HeroSection. Verify `motion/react` exports `useTransform` — it does in Motion for React v12.

- [ ] **Step 5: Commit**

```bash
git add components/HeroSection.tsx
git commit -m "feat: add signal glitch layer — strips, pixel noise, scan-line overlay"
```

---

## Task 3: Clean up CockpitScrollTransition.tsx

**Files:**
- Modify: `components/CockpitScrollTransition.tsx`

This task removes the planet element and the `onNavigationModeChange` callback prop that was wired to `page.tsx` (now gone). The current file is at lines 1–119.

### Subtask 3a: Remove onNavigationModeChange prop and callbacks

- [ ] **Step 1: Remove prop type, prop parameter, useMotionValueEvent, and useEffect**

In `components/CockpitScrollTransition.tsx`:

Delete lines 6–8 (the `CockpitScrollTransitionProps` type):
```tsx
// DELETE:
type CockpitScrollTransitionProps = {
  onNavigationModeChange: (enabled: boolean) => void;
};
```

Change line 10 function signature from:
```tsx
export function CockpitScrollTransition({ onNavigationModeChange }: CockpitScrollTransitionProps) {
```
to:
```tsx
export function CockpitScrollTransition() {
```

Delete lines 17–19 (the `useMotionValueEvent` call):
```tsx
// DELETE:
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    onNavigationModeChange(value > 0.02);
  });
```

Delete lines 21–23 (the `useEffect` cleanup):
```tsx
// DELETE:
  useEffect(() => {
    return () => onNavigationModeChange(false);
  }, [onNavigationModeChange]);
```

After these deletions, also remove `useEffect` and `useMotionValueEvent` from the import line (line 4) since they're no longer used:
```tsx
import { motion, useScroll, useTransform } from "motion/react";
```

- [ ] **Step 2: TypeScript check**

Run: `npx tsc --noEmit`

Expected: Zero TypeScript errors. The `page.tsx` no longer passes props to `CockpitScrollTransition`, so this should be clean.

- [ ] **Step 3: Commit**

```bash
git add components/CockpitScrollTransition.tsx
git commit -m "feat: remove onNavigationModeChange prop from CockpitScrollTransition"
```

### Subtask 3b: Remove planet element

- [ ] **Step 1: Remove planet useTransform declarations**

In `components/CockpitScrollTransition.tsx`, delete these 4 lines (currently around lines 42–45):
```tsx
// DELETE ALL FOUR:
  const planetOpacity = useTransform(scrollYProgress, [0, 0.15, 0.45, 0.8, 1], [0, 0.4, 1, 0.55, 0]);
  const planetX = useTransform(scrollYProgress, [0, 0.35, 1], [320, 0, -420]);
  const planetY = useTransform(scrollYProgress, [0, 0.55, 1], [140, 0, -80]);
  const planetScale = useTransform(scrollYProgress, [0, 0.4, 1], [0.75, 1.08, 1.26]);
```

- [ ] **Step 2: Remove planet motion.div block from JSX**

Delete the entire `<motion.div>` block for the planet (currently around lines 94–109). It starts with:
```tsx
          <motion.div
            className="absolute left-[58%] top-[56%] h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              opacity: planetOpacity,
              ...
```
and ends with its closing `</motion.div>` tag after the 3 child divs. Delete the entire block including all children.

- [ ] **Step 3: TypeScript check**

Run: `npx tsc --noEmit`

Expected: Zero TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add components/CockpitScrollTransition.tsx
git commit -m "feat: remove planet element from CockpitScrollTransition"
```

---

## Task 4: Visual verification

**Files:** None modified

This task verifies the full scroll sequence works end-to-end in the browser.

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`

Open `http://localhost:3000` in a browser.

- [ ] **Step 2: Verify idle state (scrollYProgress ~0)**

Expected:
- Hero text visible: "Yoobin Seo", subtitle, badge, "Scroll to explore"
- Mouse crosshair (two lines + two rings) follows cursor
- Badge pulses "MANUAL SCAN MODE ACTIVE"
- No ship visible

- [ ] **Step 3: Verify approach phase (scrollYProgress 0.15–0.50)**

Slowly scroll down. Expected:
- Attacker ship enters from below, scales up
- Engine glow trail visible behind the ship
- Crosshair locks to center (mouse no longer followed after scrollYProgress 0.10)
- Text still visible, scan-line overlay begins to appear faintly

- [ ] **Step 4: Verify impact phase (scrollYProgress 0.50–0.80)**

Continue scrolling. Expected:
- Ship reaches text layer
- Text disappears, 4 glitch strips appear with horizontal offsets
- 5 pixel noise blocks appear briefly
- Impact glow radiates from ship hull
- Scan-line overlay at peak opacity

- [ ] **Step 5: Verify fade-out phase (scrollYProgress 0.80–1.00)**

Continue scrolling. Expected:
- Glitch strips and ship fade to 0 opacity
- Cockpit scene begins (CockpitScrollTransition visible)
- No planet visible in the cockpit scene

- [ ] **Step 6: Verify scrubbing is reversible**

Scroll back up to scrollYProgress 0. Expected:
- Hero text fully visible again
- Mouse crosshair resumes tracking
- Ship not visible

- [ ] **Step 7: TypeScript final check**

Run: `npx tsc --noEmit`

Expected: Zero errors.

- [ ] **Step 8: Final commit if any fixes were applied**

If visual verification required any corrections, commit them:
```bash
git add -p
git commit -m "fix: adjust glitch timing / ship positioning after visual verification"
```
