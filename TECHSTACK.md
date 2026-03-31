# Portfolio Tech Stack

## Core

| Package | Version | Purpose |
|---------|---------|---------|
| Next.js | 16 | Framework with App Router |
| TypeScript | latest | Type safety |
| Tailwind CSS | 4 | Styling |

> Use the **App Router** (not Pages Router). Official docs updated March 25, 2026 confirm this is the recommended routing system.

---

## Motion / Interactions

| Package | Purpose |
|---------|---------|
| `motion/react` | Animations and interactions |
| `lenis` | Smooth scroll |

> **Important:** Use `motion/react` — this is the current package. `framer-motion` has been superseded with an official upgrade path pointing imports to `motion/react`.

---

## Immersive Visuals

| Package | Purpose |
|---------|---------|
| `@react-three/fiber` | React-native Three.js renderer |
| `three` | 3D engine |
| `@react-three/drei` | Helpers and abstractions for R3F |

> Use React Three Fiber intentionally — only where 3D adds value. R3F docs explicitly note to know when 3D is warranted.

---

## Optional: Advanced Scroll Choreography

| Package | When to use |
|---------|-------------|
| `gsap` | Only if needed for hero sections (1–2 max) |

> Add GSAP only if Lenis + Motion for React can't handle the scroll choreography you need.

---

## Content

| Approach | Use case |
|----------|----------|
| MDX | Rich content with components |
| Local JSON | Simpler project listings |

---

## Deployment

- **Vercel** — primary hosting platform

---

## Decision Rationale

- **Immersive visuals** — R3F + Three.js for 3D scenes
- **Modern performance** — Next.js App Router + Tailwind 4
- **Easy iteration** — works well with AI-assisted development (Claude, Cursor)
- **Scalable** — supports future case study pages via MDX
