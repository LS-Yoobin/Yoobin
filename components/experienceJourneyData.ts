export type ExperienceItem = {
  role: string;
  company: string;
  dates: string;
  achievements: string[];
};

export const EXPERIENCE_ITEMS: ExperienceItem[] = [
  {
    role: "Frontend Engineer",
    company: "Aurora Labs",
    dates: "2024 - Present",
    achievements: [
      "Built high-fidelity UI systems for immersive marketing pages.",
      "Reduced page interaction latency by 31% through animation budgeting.",
      "Partnered with design to ship reusable motion primitives.",
    ],
  },
  {
    role: "Product Designer + Developer",
    company: "Nebula Studio",
    dates: "2022 - 2024",
    achievements: [
      "Designed and implemented portfolio platforms for creative founders.",
      "Introduced a component kit that cut delivery time by 40%.",
      "Led storytelling-focused scroll experiences across 10+ launches.",
    ],
  },
  {
    role: "UI Engineer",
    company: "Greenframe Collective",
    dates: "2020 - 2022",
    achievements: [
      "Created an accessible design system with dark-first visual language.",
      "Implemented responsive animation patterns for desktop and mobile.",
      "Raised Core Web Vitals scores from low 70s to mid 90s.",
    ],
  },
  {
    role: "Interactive Intern",
    company: "Pixel Harbor",
    dates: "2019 - 2020",
    achievements: [
      "Prototyped scroll-driven storytelling concepts for campaign microsites.",
      "Built modular React sections consumed by a multi-brand team.",
      "Documented handoff patterns that reduced QA loops.",
    ],
  },
];
