# Hero Scroll Interaction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two-state scroll-reactive behavior to the hero — mouse-tracked crosshair and visible text while idle, smooth text fade-out and centered crosshair lock once the user begins scrolling.

**Architecture:** `HeroSection` self-manages scroll detection via Motion's `useScroll()` (window-level). A single `isScrolling` boolean drives both the text fade (`motion.div` `animate` prop) and the crosshair (removes mouse listener, springs back to center). No parent coordination. `CockpitScrollTransition` loses its now-redundant `onNavigationModeChange` prop. `page.tsx` is rewired from an iframe to the real component stack.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Motion for React v12, Lenis v1.3.21

---

> **Note on testing:** This project has no test infrastructure. Each task includes a TypeScript compilation check and a manual browser verification step instead of automated tests.

> **Note on Lenis + Motion `useScroll()` compatibility:** `SmoothScroll.tsx` wraps the app in Lenis (referenced in `layout.tsx`). Lenis v1.3.x drives scroll by calling `window.scrollTo()` each RAF frame, which means `window.scrollY` is updated correctly and Motion's `useScroll()` reads accurate values. The `scroll` events that Motion listens to are fired normally. `SmoothScroll.tsx` is kept as-is throughout this plan. Note: `SmoothScroll.tsx` uses `{ smooth: true }` which is not a valid Lenis v1.x option (correct key is `smoothWheel: true`) — this is a pre-existing bug, out of scope here, but it means smooth-wheel may not be active.

---

### Task 1: Delete unused `LenisProvider.tsx`

**Files:**
- Delete: `components/LenisProvider.tsx`

Note: `LenisProvider.tsx` is an unused duplicate. `SmoothScroll.tsx` is the separate, active Lenis provider referenced in `layout.tsx` — it is NOT touched in this task.

- [ ] **Step 1: Confirm `LenisProvider` is not imported anywhere**

```bash
grep -r "LenisProvider" --include="*.tsx" --include="*.ts" .
```
Expected: zero matches outside `components/LenisProvider.tsx` itself. If any matches are found, remove those imports before proceeding.

- [ ] **Step 2: Delete the file**

```bash
rm components/LenisProvider.tsx
```

- [ ] **Step 3: Verify TypeScript still compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove unused LenisProvider duplicate"
```

---

### Task 2: Strip `onNavigationModeChange` from `CockpitScrollTransition`

**Files:**
- Modify: `components/CockpitScrollTransition.tsx`

This is a full-file replacement. The changes are: remove the `CockpitScrollTransitionProps` type, remove the prop from the function signature, remove the `useMotionValueEvent` block that called `onNavigationModeChange`, and remove the `useEffect` cleanup block that called `onNavigationModeChange(false)`. All visual animation code is unchanged.

- [ ] **Step 1: Replace the component with the prop-free version**

Replace the entire contents of `components/CockpitScrollTransition.tsx` with:

```tsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export function CockpitScrollTransition() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const cockpitTilt = useTransform(scrollYProgress, [0, 1], [0, -13]);
  const cockpitYaw = useTransform(scrollYProgress, [0, 0.55, 1], [0, 9, -5]);
  const cockpitScale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const cockpitOpacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 0.7, 0]);

  const hudParallaxX = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const hudParallaxY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const ringScale = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1.35, 1.9]);
  const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 7]);
  const ringOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.55, 0.26, 0]);
  const ringOuterScale = useTransform(scrollYProgress, [0, 1], [1, 1.65]);
  const coreOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 0.7, 0]);

  const gridOpacity = useTransform(scrollYProgress, [0, 0.4, 1], [0.42, 0.14, 0]);
  const vignetteOpacity = useTransform(scrollYProgress, [0, 1], [0.2, 0.82]);

  const planetOpacity = useTransform(scrollYProgress, [0, 0.15, 0.45, 0.8, 1], [0, 0.4, 1, 0.55, 0]);
  const planetX = useTransform(scrollYProgress, [0, 0.35, 1], [320, 0, -420]);
  const planetY = useTransform(scrollYProgress, [0, 0.55, 1], [140, 0, -80]);
  const planetScale = useTransform(scrollYProgress, [0, 0.4, 1], [0.75, 1.08, 1.26]);

  return (
    <section ref={sectionRef} className="relative h-[230vh] bg-black">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: cockpitOpacity,
            transform: useTransform(
              [cockpitTilt, cockpitYaw, cockpitScale],
              ([tilt, yaw, scale]) =>
                `perspective(1400px) rotateX(${tilt}deg) rotateY(${yaw}deg) scale(${scale})`,
            ),
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(36,95,70,0.22),transparent_54%),radial-gradient(circle_at_80%_30%,rgba(20,52,60,0.22),transparent_60%),linear-gradient(to_bottom,#020604_0%,#000_75%,#010201_100%)]" />

          <motion.div
            className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(0,255,140,0.05)_50%,transparent_100%)]"
            style={{ opacity: gridOpacity }}
          />
          <motion.div
            className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(79,255,170,0.08),rgba(79,255,170,0.08)_1px,transparent_1px,transparent_72px),repeating-linear-gradient(90deg,rgba(79,255,170,0.06),rgba(79,255,170,0.06)_1px,transparent_1px,transparent_128px)]"
            style={{ opacity: gridOpacity }}
          />

          <motion.div className="absolute inset-0" style={{ x: hudParallaxX, y: hudParallaxY }}>
            <motion.div
              className="absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-300/40"
              style={{
                scale: ringScale,
                rotate: ringRotate,
                opacity: ringOpacity,
              }}
            />
            <motion.div
              className="absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-300/20"
              style={{
                scale: ringOuterScale,
                opacity: ringOpacity,
              }}
            />
            <motion.div
              className="absolute left-1/2 top-1/2 h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300"
              style={{ opacity: coreOpacity }}
            />
          </motion.div>

          <motion.div
            className="absolute left-[58%] top-[56%] h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              opacity: planetOpacity,
              x: planetX,
              y: planetY,
              scale: planetScale,
              background:
                "radial-gradient(circle at 36% 28%,rgba(190,230,255,0.65),rgba(68,128,162,0.7) 26%,rgba(18,45,79,0.95) 56%,rgba(8,16,36,1) 78%)",
              boxShadow:
                "0 0 70px rgba(84,164,255,0.22), inset -100px -80px 140px rgba(4,10,22,0.9), inset 40px 20px 120px rgba(134,194,255,0.2)",
            }}
          >
            <div className="absolute -inset-5 rounded-full border border-sky-100/20 blur-md" />
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_70%_78%,rgba(88,165,255,0.32),transparent_45%)]" />
          </motion.div>

          <motion.div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,transparent_28%,rgba(0,0,0,0.76)_100%)]"
            style={{ opacity: vignetteOpacity }}
          />
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/CockpitScrollTransition.tsx
git commit -m "refactor: remove onNavigationModeChange prop from CockpitScrollTransition"
```

---

### Task 3: Rewrite `HeroSection` with scroll-reactive states

**Files:**
- Modify: `components/HeroSection.tsx`

This is a full-file replacement. Key changes:
- `HeroSectionProps` type and `isAutoNavigation` prop removed — component takes no props
- Added `useScroll` and `useMotionValueEvent` imports
- `isScrolling` boolean state driven by `scrollY > 60` (bidirectional)
- Mouse-tracking `useEffect` guards on `isScrolling` instead of `isAutoNavigation`
- All text elements wrapped in one `<motion.div>` with `animate` driven by `isScrolling`
- Badge text is static `"MANUAL SCAN MODE ACTIVE"` with blink animation preserved
- Crosshair wrapper opacity: `isScrolling ? 0.58 : 1`

Note on the badge blink: the badge's own `animate={{ opacity: [0.45, 1, 0.45] }}` runs inside the parent text-fade `motion.div`. When the parent fades to `opacity: 0`, the blink continues running but is invisible — this is intentional and matches the spec.

- [ ] **Step 1: Replace the entire file contents**

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

export function HeroSection() {
  const [isScrolling, setIsScrolling] = useState(false);
  const [target, setTarget] = useState({ x: 50, y: 50 });

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (value) => {
    setIsScrolling(value > 60);
  });

  const crosshairX = useSpring(50, { stiffness: 130, damping: 22, mass: 0.65 });
  const crosshairY = useSpring(50, { stiffness: 130, damping: 22, mass: 0.65 });
  const crosshairXPercent = useTransform(crosshairX, (value) => `${value}%`);
  const crosshairYPercent = useTransform(crosshairY, (value) => `${value}%`);

  useEffect(() => {
    if (isScrolling) {
      setTarget({ x: 50, y: 50 });
      return;
    }

    const onMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;
      setTarget({ x, y });
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [isScrolling]);

  useEffect(() => {
    crosshairX.set(target.x);
    crosshairY.set(target.y);
  }, [target, crosshairX, crosshairY]);

  const stars = useMemo(
    () =>
      Array.from({ length: 72 }, (_, index) => {
        const seed = (index * 37) % 100;
        return {
          key: index,
          left: `${seed}%`,
          top: `${(seed * 61) % 100}%`,
          opacity: 0.25 + ((seed % 7) / 14),
        };
      }),
    [],
  );

  return (
    <section className="relative h-screen overflow-hidden bg-[radial-gradient(circle_at_50%_0%,#132319_0%,#020503_48%,#000_100%)]">
      {/* Stars */}
      <div className="pointer-events-none absolute inset-0">
        {stars.map((star) => (
          <span
            key={star.key}
            className="absolute h-[2px] w-[2px] rounded-full bg-emerald-300"
            style={{ left: star.left, top: star.top, opacity: star.opacity }}
          />
        ))}
      </div>

      {/* Gradient overlays */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.2)_45%,rgba(0,0,0,0.82)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(0,255,140,0.06),rgba(0,255,140,0.06)_1px,transparent_1px,transparent_120px)] opacity-20" />

      {/* Crosshair HUD */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: isScrolling ? 0.58 : 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-300/60 to-transparent"
          style={{ top: crosshairYPercent }}
        />
        <motion.div
          className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-emerald-300/60 to-transparent"
          style={{ left: crosshairXPercent }}
        />
        <motion.div
          className="absolute h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-300/40"
          style={{ left: crosshairXPercent, top: crosshairYPercent }}
        />
        <motion.div
          className="absolute h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-200/20"
          style={{ left: crosshairXPercent, top: crosshairYPercent }}
        />
      </motion.div>

      {/* Hero text — fades out and drifts up on scroll */}
      <motion.div
        className="relative z-20 flex h-full flex-col items-center justify-center text-center"
        animate={isScrolling ? { opacity: 0, y: -24 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <p className="mb-4 text-xs uppercase tracking-[0.4em] text-emerald-300/70">
          Portfolio Interface // 2026
        </p>
        <h1 className="text-5xl font-black uppercase tracking-tight md:text-7xl">
          Yoobin <span className="text-emerald-400">Seo</span>
        </h1>
        <p className="mt-4 text-sm uppercase tracking-[0.24em] text-emerald-200/80 md:text-base">
          UI/UX Designer · Co-Founder · Product Builder
        </p>
        <motion.div
          className="mt-10 border border-emerald-300/40 px-4 py-2 text-xs uppercase tracking-[0.24em] text-emerald-300/80"
          animate={{ opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        >
          MANUAL SCAN MODE ACTIVE
        </motion.div>
        <p className="mt-6 text-sm uppercase tracking-[0.3em] text-emerald-400/60">
          Scroll to explore
        </p>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/HeroSection.tsx
git commit -m "feat: add scroll-reactive states to HeroSection"
```

---

### Task 4: Rewire `page.tsx` to the component stack

**Files:**
- Modify: `app/page.tsx`

`page.tsx` stays a **server component** — no `"use client"` needed. Next.js App Router allows server components to render client component children.

**Important:** The current `page.tsx` has `<main className="h-screen w-screen overflow-hidden ...">`. The replacement uses a bare `<main>` — no `overflow-hidden`, no fixed height. This is intentional: `overflow-hidden` on the root container would prevent the page from scrolling at all, breaking every scroll-driven animation.

The legacy HTML file at `.superpowers/brainstorm/851-1774956399/hero-h-space.html` is **not touched**.

- [ ] **Step 1: Replace the entire file contents**

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

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Run the dev server and verify visually**

```bash
npm run dev
```

Open `http://localhost:3000` and check:

**STATE 1 — Idle:**
- [ ] Name, subtitle, "Scroll to explore", and badge are all visible
- [ ] Moving the mouse moves the crosshair lines and rings smoothly
- [ ] Stars, gradients, and scan-line grid are visible

**STATE 2 — Scrolling:**
- [ ] Scrolling past ~60px causes all text to fade out and drift upward
- [ ] Crosshair stops following the mouse and eases back to screen center
- [ ] Crosshair opacity dims slightly when locked
- [ ] Scrolling back to the top restores STATE 1 (text fades back in, mouse tracking resumes)

**Cockpit section:**
- [ ] Scrolling past the hero reveals the cockpit 3D scene
- [ ] Cockpit tilt, yaw, scale, planet, and ring animations all work as before

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: wire page.tsx to HeroSection + CockpitScrollTransition + SystemLogSection"
```

---

### Task 5: Final build verification

- [ ] **Step 1: Run a production build**

```bash
npm run build
```
Expected: build completes with no errors. Warnings about image optimization or similar are acceptable.

- [ ] **Step 2: Commit if any build-time fixes were needed**

If the build surfaced issues, fix them and commit:
```bash
git commit -m "fix: resolve build issues"
```

If the build passed cleanly, no commit needed.
