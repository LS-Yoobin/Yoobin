"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";

type CockpitScrollTransitionProps = {
  onNavigationModeChange: (enabled: boolean) => void;
};

export function CockpitScrollTransition({ onNavigationModeChange }: CockpitScrollTransitionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    onNavigationModeChange(value > 0.02);
  });

  useEffect(() => {
    return () => onNavigationModeChange(false);
  }, [onNavigationModeChange]);

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
