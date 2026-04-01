"use client";

import { motion, type MotionValue, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { EXPERIENCE_ITEMS, type ExperienceItem } from "@/components/experienceJourneyData";

const CHAPTER_SPAN = 1 / EXPERIENCE_ITEMS.length;

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
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
    >
      <p className="text-[0.68rem] uppercase tracking-[0.24em] text-emerald-200/60">Chapter {String(index + 1).padStart(2, "0")}</p>
      <h3 className="mt-2 text-lg font-semibold text-emerald-50 md:text-xl">{item.role}</h3>
      <p className="mt-1 text-sm text-emerald-200/80 md:text-base">{item.company}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-emerald-100/45">{item.dates}</p>
      <ul className={["mt-4 space-y-2 text-sm text-emerald-50/86", fromLeft ? "list-none" : "list-disc pl-5"].join(" ")}>
        {item.achievements.map((line) => (
          <li key={line}>{fromLeft ? `- ${line}` : line}</li>
        ))}
      </ul>
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
        <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/90 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black to-transparent" />
      </div>
    </section>
  );
}
