"use client";

import { AnimatePresence, motion, type MotionValue, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
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
  onOpen,
}: {
  item: ExperienceItem;
  index: number;
  progress: MotionValue<number>;
  onOpen?: (item: ExperienceItem, index: number, bounds: DOMRect) => void;
}) {
  const fromLeft = index % 2 === 0;
  const start = index * CHAPTER_SPAN;
  const end = start + CHAPTER_SPAN;
  const cardRef = useRef<HTMLElement | null>(null);

  const chapterProgress = useTransform(progress, (value) => clamp01((value - start) / (end - start)));
  const opacity = useTransform(chapterProgress, [0, 0.28, 0.75, 1], [0.1, 1, 1, 0.45]);
  const x = useTransform(chapterProgress, [0, 0.35, 1], [fromLeft ? -42 : 42, 0, 0]);
  const scale = useTransform(chapterProgress, [0, 0.25, 1], [0.965, 1, 0.985]);
  const blur = useTransform(chapterProgress, [0, 0.24, 1], [10, 0, 1.5]);

  return (
    <motion.article
      ref={cardRef}
      className={[
        "group absolute top-1/2 w-[min(46vw,32rem)] max-w-[32rem] -translate-y-1/2 rounded-2xl",
        "border border-emerald-200/20 bg-black/35 p-5 backdrop-blur-md md:p-6",
        "shadow-[0_0_0_1px_rgba(120,255,170,0.06),0_18px_48px_rgba(5,25,12,0.55),0_0_65px_rgba(30,255,130,0.14)]",
        "pointer-events-auto transition-[transform,box-shadow,border-color,background-color] duration-200 hover:border-emerald-200/45 hover:bg-black/55 hover:shadow-[0_0_0_1px_rgba(120,255,170,0.28),0_24px_60px_rgba(5,25,12,0.7),0_0_80px_rgba(30,255,130,0.24)]",
        onOpen ? "cursor-pointer" : "cursor-default",
        fromLeft ? "right-[calc(50%+2.4rem)] origin-right text-right" : "left-[calc(50%+2.4rem)] origin-left text-left",
      ].join(" ")}
      style={{ opacity, x, scale, filter: useTransform(blur, (v) => `blur(${v}px)`) }}
      aria-label={`${item.role} at ${item.company}, ${item.dates}`}
      onClick={() => {
        if (!onOpen || !cardRef.current) return;
        onOpen(item, index, cardRef.current.getBoundingClientRect());
      }}
    >
      <div
        className={[
          "flex min-h-[3rem] items-center rounded-xl border border-emerald-200/25 px-3 transition-colors duration-200",
          "bg-[linear-gradient(90deg,rgba(30,255,140,0.08)_0%,rgba(30,255,140,0.01)_100%)] group-hover:border-emerald-200/45 group-hover:bg-[linear-gradient(90deg,rgba(30,255,140,0.2)_0%,rgba(30,255,140,0.06)_100%)]",
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

function ExpandedJourneyCard({
  item,
  fromLeft,
  bounds,
  viewport,
  onClose,
}: {
  item: ExperienceItem;
  fromLeft: boolean;
  bounds: DOMRect;
  viewport: { width: number; height: number };
  onClose: () => void;
}) {
  const finalWidth = Math.min(viewport.width * 0.92, 768);
  const startCenterX = bounds.left + bounds.width / 2;
  const startCenterY = bounds.top + bounds.height / 2;
  const finalCenterX = viewport.width / 2;
  const finalCenterY = viewport.height / 2;
  const startScale = Math.max(0.45, Math.min(1, bounds.width / finalWidth));

  return (
    <div
      className="fixed inset-0 z-40 hidden md:block"
      role="dialog"
      aria-modal="true"
      aria-label={`${item.role} at ${item.company}`}
      onClick={onClose}
    >
      <motion.div
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />
      <motion.article
        className={[
          "absolute left-1/2 top-1/2 w-[min(92vw,48rem)] -translate-x-1/2 -translate-y-1/2 rounded-3xl",
          "border border-emerald-200/35 bg-black/80 p-7 text-left backdrop-blur-xl md:p-8",
          "shadow-[0_0_0_1px_rgba(120,255,170,0.2),0_36px_90px_rgba(2,12,7,0.8),0_0_110px_rgba(30,255,130,0.25)]",
        ].join(" ")}
        initial={{
          opacity: 0.15,
          x: startCenterX - finalCenterX,
          y: startCenterY - finalCenterY,
          scale: startScale,
        }}
        animate={{ opacity: 1, x: 0, y: 0, scale: [1, 1.04, 1] }}
        exit={{ opacity: 0, scale: 0.9, y: -8 }}
        transition={{ duration: 0.34, ease: [0.2, 0.9, 0.2, 1] }}
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-xs uppercase tracking-[0.24em] text-emerald-200/85">Experience Focus</p>
        <h3 className="mt-2 text-2xl font-semibold text-emerald-50 md:text-3xl">{item.role}</h3>
        <p className="mt-1 text-sm text-emerald-100/80 md:text-base">
          {item.company} <span className="mx-2 text-emerald-300/60">•</span> {item.dates}
        </p>

        <div className="mt-5 rounded-2xl border border-emerald-200/20 bg-emerald-200/5 p-4 md:p-5">
          <JourneyGraphic visual={item.visual} fromLeft={fromLeft} />
          <JourneySignature visual={item.visual} fromLeft={fromLeft} />
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 inline-flex items-center rounded-full border border-emerald-200/35 px-4 py-2 text-sm text-emerald-100 transition-colors hover:bg-emerald-200/12"
        >
          Close
        </button>
      </motion.article>
    </div>
  );
}

export default function ExperienceJourney() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [activeCard, setActiveCard] = useState<{ item: ExperienceItem; index: number; bounds: DOMRect } | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const updateDesktopState = () => {
      setIsDesktop(query.matches);
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    updateDesktopState();
    query.addEventListener("change", updateDesktopState);
    window.addEventListener("resize", updateDesktopState);
    return () => {
      query.removeEventListener("change", updateDesktopState);
      window.removeEventListener("resize", updateDesktopState);
    };
  }, []);

  useEffect(() => {
    if (!activeCard) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveCard(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeCard]);

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
            <JourneyCard
              key={`${item.company}-${item.role}`}
              item={item}
              index={index}
              progress={scrollYProgress}
              onOpen={
                isDesktop
                  ? (clickedItem, clickedIndex, bounds) => {
                      setActiveCard({ item: clickedItem, index: clickedIndex, bounds });
                    }
                  : undefined
              }
            />
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

        <AnimatePresence>
          {activeCard && (
            <ExpandedJourneyCard
              item={activeCard.item}
              fromLeft={activeCard.index % 2 === 0}
              bounds={activeCard.bounds}
              viewport={viewport}
              onClose={() => setActiveCard(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
