"use client";

import { motion, type MotionValue, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { EXPERIENCE_ITEMS, type ExperienceItem } from "@/components/experienceJourneyData";

const CHAPTER_SPAN = 1 / EXPERIENCE_ITEMS.length;

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function JourneyGraphic({ visual, fromLeft }: { visual: ExperienceItem["visual"]; fromLeft: boolean }) {
  return (
    <div className={["mt-4 flex items-center gap-3", fromLeft ? "justify-end" : "justify-start"].join(" ")}>
      <div className="relative h-14 w-14 rounded-xl border border-emerald-200/30 bg-emerald-200/8 shadow-[0_0_22px_rgba(52,255,138,0.18)]">
        <svg viewBox="0 0 64 64" className="h-full w-full p-2 text-emerald-100/95">
          {visual === "frontend" && (
            <>
              <rect x="10" y="12" width="44" height="28" rx="5" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" />
              <path d="M18 48h28M24 40v8M40 40v8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="48" cy="20" r="3" fill="currentColor" />
            </>
          )}
          {visual === "product" && (
            <>
              <rect x="10" y="12" width="24" height="40" rx="4" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="2" />
              <path d="M40 14l10 10-16 16-10 2 2-10 14-14z" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
              <circle cx="20" cy="22" r="2" fill="currentColor" />
              <circle cx="20" cy="30" r="2" fill="currentColor" />
            </>
          )}
          {visual === "ui" && (
            <>
              <rect x="10" y="14" width="44" height="36" rx="5" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="2" />
              <rect x="14" y="18" width="14" height="28" rx="3" fill="currentColor" fillOpacity="0.28" />
              <rect x="32" y="20" width="18" height="8" rx="2" fill="currentColor" fillOpacity="0.35" />
              <rect x="32" y="32" width="10" height="6" rx="2" fill="currentColor" fillOpacity="0.35" />
              <rect x="44" y="32" width="6" height="6" rx="2" fill="currentColor" fillOpacity="0.35" />
            </>
          )}
          {visual === "intern" && (
            <>
              <path d="M12 40l20-24 20 24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="20" cy="40" r="4" fill="currentColor" fillOpacity="0.4" />
              <circle cx="32" cy="32" r="4" fill="currentColor" fillOpacity="0.4" />
              <circle cx="44" cy="40" r="4" fill="currentColor" fillOpacity="0.4" />
            </>
          )}
        </svg>
      </div>
      <div className="relative h-10 w-24 overflow-hidden rounded-full border border-emerald-200/25 bg-black/40">
        <div className="absolute -left-2 top-1 h-8 w-8 rounded-full bg-emerald-300/30 blur-[2px]" />
        <div className="absolute left-6 top-2 h-6 w-6 rounded-full bg-emerald-200/25 blur-[2px]" />
        <div className="absolute right-2 top-3 h-4 w-4 rounded-full bg-emerald-100/25 blur-[1px]" />
      </div>
    </div>
  );
}

function JourneySignature({ visual, fromLeft }: { visual: ExperienceItem["visual"]; fromLeft: boolean }) {
  return (
    <div className={["mt-4 flex items-center gap-2", fromLeft ? "justify-end" : "justify-start"].join(" ")}>
      {[0, 1, 2, 3].map((index) => (
        <div
          key={`${visual}-${index}`}
          className={[
            "rounded-full border border-emerald-100/20 bg-emerald-200/20",
            index === 0 ? "h-2.5 w-10" : "h-2.5 w-2.5",
            visual === "frontend" && index === 1 ? "bg-emerald-300/55" : "",
            visual === "product" && index === 2 ? "bg-emerald-300/55" : "",
            visual === "ui" && index === 3 ? "bg-emerald-300/55" : "",
            visual === "intern" && index === 0 ? "w-7 bg-emerald-300/55" : "",
          ].join(" ")}
        />
      ))}
    </div>
  );
}

function JourneyCard({
  item,
  index,
  progress,
}: {
  item: ExperienceItem;
  index: number;
  progress: MotionValue<number>;
}) {
  const fromLeft = index % 2 === 0;
  const start = index * CHAPTER_SPAN;
  const end = start + CHAPTER_SPAN;

  const chapterProgress = useTransform(progress, (value) => clamp01((value - start) / (end - start)));
  const opacity = useTransform(chapterProgress, [0, 0.28, 0.75, 1], [0.1, 1, 1, 0.45]);
  const x = useTransform(chapterProgress, [0, 0.35, 1], [fromLeft ? -42 : 42, 0, 0]);
  const scale = useTransform(chapterProgress, [0, 0.25, 1], [0.965, 1, 0.985]);
  const blur = useTransform(chapterProgress, [0, 0.24, 1], [10, 0, 1.5]);

  return (
    <motion.article
      className={[
        "pointer-events-none absolute top-1/2 w-[min(46vw,32rem)] max-w-[32rem] -translate-y-1/2 rounded-2xl",
        "border border-emerald-200/20 bg-black/35 p-5 backdrop-blur-md md:p-6",
        "shadow-[0_0_0_1px_rgba(120,255,170,0.06),0_18px_48px_rgba(5,25,12,0.55),0_0_65px_rgba(30,255,130,0.14)]",
        fromLeft ? "right-[calc(50%+2.4rem)] origin-right text-right" : "left-[calc(50%+2.4rem)] origin-left text-left",
      ].join(" ")}
      style={{ opacity, x, scale, filter: useTransform(blur, (v) => `blur(${v}px)`) }}
      aria-label={`${item.role} at ${item.company}, ${item.dates}`}
    >
      <div
        className={[
          "flex min-h-[3rem] items-center rounded-xl border border-emerald-200/25 px-3",
          "bg-[linear-gradient(90deg,rgba(30,255,140,0.08)_0%,rgba(30,255,140,0.01)_100%)]",
          fromLeft ? "justify-end" : "justify-start",
        ].join(" ")}
      >
        <div className="grid grid-cols-5 gap-1.5">
          {Array.from({ length: 10 }).map((_, patternIndex) => (
            <div
              key={`${item.visual}-${patternIndex}`}
              className={[
                "h-2.5 w-2.5 rounded-sm border border-emerald-100/20",
                patternIndex % 2 === 0 ? "bg-emerald-200/25" : "bg-emerald-100/10",
                item.visual === "frontend" && [1, 4, 7].includes(patternIndex) ? "bg-emerald-300/55" : "",
                item.visual === "product" && [0, 3, 8].includes(patternIndex) ? "bg-emerald-300/55" : "",
                item.visual === "ui" && [2, 5, 9].includes(patternIndex) ? "bg-emerald-300/55" : "",
                item.visual === "intern" && [0, 5].includes(patternIndex) ? "rounded-full bg-emerald-300/55" : "",
              ].join(" ")}
            />
          ))}
        </div>
      </div>
      <JourneyGraphic visual={item.visual} fromLeft={fromLeft} />
      <JourneySignature visual={item.visual} fromLeft={fromLeft} />
    </motion.article>
  );
}

export default function ExperienceJourney() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const laneDriftY = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const starsParallaxY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const glowShift = useTransform(scrollYProgress, [0, 1], [-8, 8]);

  const stride = useTransform(scrollYProgress, (v) => Math.sin(v * Math.PI * 20));
  const bodyBobY = useTransform(stride, (v) => v * 4);
  const leftLeg = useTransform(stride, (v) => v * 16);
  const rightLeg = useTransform(stride, (v) => -v * 16);
  const armSwing = useTransform(stride, (v) => -v * 12);

  const cardTrackY = useTransform(scrollYProgress, [0, 1], [56, -56]);
  const sectionHeight = `${(EXPERIENCE_ITEMS.length + 1) * 100}vh`;

  return (
    <section ref={sectionRef} className="relative bg-black" style={{ height: sectionHeight }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-70"
          style={{
            y: starsParallaxY,
            backgroundImage:
              "radial-gradient(circle at 12% 22%,rgba(112,255,160,0.12),transparent 28%),radial-gradient(circle at 76% 38%,rgba(35,164,104,0.14),transparent 30%),radial-gradient(circle at 42% 82%,rgba(68,255,153,0.1),transparent 35%)",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,7,4,0.7)_0%,rgba(0,0,0,0.92)_78%,rgba(0,0,0,1)_100%)]" />

        <div className="absolute inset-0">
          <motion.div
            className="absolute left-1/2 top-[-15%] h-[150%] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-emerald-300/75 to-transparent"
            style={{ y: laneDriftY }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 h-[34rem] w-[0.8rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300/15 blur-[1px]"
            style={{ y: glowShift }}
          />
        </div>

        <motion.div className="absolute inset-0" style={{ y: cardTrackY }}>
          {EXPERIENCE_ITEMS.map((item, index) => (
            <JourneyCard key={`${item.company}-${item.role}`} item={item} index={index} progress={scrollYProgress} />
          ))}
        </motion.div>

        <motion.div
          className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
          style={{ y: bodyBobY }}
        >
          <div className="relative h-28 w-16">
            <div className="absolute left-1/2 top-0 h-5 w-5 -translate-x-1/2 rounded-full border border-emerald-100/50 bg-emerald-300/85 shadow-[0_0_18px_rgba(130,255,180,0.6)]" />
            <div className="absolute left-1/2 top-5 h-10 w-8 -translate-x-1/2 rounded-[10px] border border-emerald-100/35 bg-gradient-to-b from-emerald-200/85 to-emerald-500/80 shadow-[0_0_18px_rgba(50,255,130,0.36)]" />
            <motion.div
              className="absolute left-[15px] top-[28px] h-8 w-[5px] origin-top rounded-full bg-emerald-200/80"
              style={{ rotate: armSwing }}
            />
            <motion.div
              className="absolute right-[15px] top-[28px] h-8 w-[5px] origin-top rounded-full bg-emerald-200/80"
              style={{ rotate: useTransform(armSwing, (v) => -v) }}
            />
            <motion.div
              className="absolute left-[21px] top-[58px] h-10 w-[6px] origin-top rounded-full bg-emerald-100/85"
              style={{ rotate: leftLeg }}
            />
            <motion.div
              className="absolute right-[21px] top-[58px] h-10 w-[6px] origin-top rounded-full bg-emerald-100/85"
              style={{ rotate: rightLeg }}
            />
          </div>
          <div className="mx-auto mt-2 h-[2px] w-14 bg-emerald-300/70 shadow-[0_0_15px_rgba(70,255,140,0.7)]" />
        </motion.div>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_33%,rgba(0,0,0,0.72)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black via-black/75 to-transparent md:h-36 md:from-black/90 md:via-black/55" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black to-transparent" />
      </div>
    </section>
  );
}
