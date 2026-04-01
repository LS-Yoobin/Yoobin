"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

const LOG_LINES = [
  "Initializing portfolio...",
  "[2022] Joined LinkedSpaces as Product Manager + UI/UX Designer",
  "[2024] Led product design and internship collaboration with KHU",
  "[2026] Building Bloggo from the ground up",
  "[2026] Bloggo accepted into TestFlight beta",
];

function useTypewriter(active: boolean, text: string, speed = 24) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!active) return;
    let index = 0;
    setValue("");

    const timer = window.setInterval(() => {
      index += 1;
      setValue(text.slice(0, index));
      if (index >= text.length) {
        window.clearInterval(timer);
      }
    }, speed);

    return () => window.clearInterval(timer);
  }, [active, speed, text]);

  return value;
}

type SystemLogLineProps = {
  index: number;
  active: boolean;
  text: string;
};

function SystemLogLine({ index, active, text }: SystemLogLineProps) {
  const typed = useTypewriter(active, text, index === 0 ? 34 : 18);
  const isHeadline = index === 0;

  return (
    <p
      className={
        isHeadline
          ? "text-2xl font-semibold tracking-wide text-emerald-200 md:text-3xl"
          : "text-sm text-emerald-200/90 md:text-base"
      }
    >
      {typed}
      {active && typed.length < text.length ? (
        <span className="ml-0.5 inline-block h-[1em] w-2 animate-pulse bg-emerald-200/80 align-middle" />
      ) : null}
    </p>
  );
}

export function SystemLogSection() {
  const [inView, setInView] = useState(false);
  const [activeLine, setActiveLine] = useState(-1);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;

    const timers: number[] = [];
    LOG_LINES.forEach((_, index) => {
      const delay = index === 0 ? 300 : 1200 + index * 900;
      timers.push(window.setTimeout(() => setActiveLine(index), delay));
    });

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [inView]);

  const showStatus = activeLine >= LOG_LINES.length - 1;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-[linear-gradient(to_bottom,#000_0%,#010603_45%,#010201_100%)] px-6 py-24 md:px-14"
    >
      <div className="mx-auto w-full max-w-5xl font-mono">
        <p className="text-xs uppercase tracking-[0.38em] text-emerald-300/80">SYSTEM LOG</p>

        <div className="mt-8 space-y-5 border-l border-emerald-300/35 pl-5">
          {LOG_LINES.map((line, index) => (
            <SystemLogLine key={line} index={index} active={activeLine >= index} text={line} />
          ))}
        </div>

        <motion.p
          className="mt-10 text-base font-semibold uppercase tracking-[0.2em] text-emerald-300 md:text-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={showStatus ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          STATUS: BUILDING PRODUCTS THAT PEOPLE USE
        </motion.p>
      </div>
    </section>
  );
}
