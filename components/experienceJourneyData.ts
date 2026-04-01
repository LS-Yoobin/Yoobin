export type ExperienceItem = {
  role: string;
  company: string;
  dates: string;
  visual: "frontend" | "product" | "ui" | "intern";
};

export const EXPERIENCE_ITEMS: ExperienceItem[] = [
  {
    role: "Frontend Engineer",
    company: "Aurora Labs",
    dates: "2024 - Present",
    visual: "frontend",
  },
  {
    role: "Product Designer + Developer",
    company: "Nebula Studio",
    dates: "2022 - 2024",
    visual: "product",
  },
  {
    role: "UI Engineer",
    company: "Greenframe Collective",
    dates: "2020 - 2022",
    visual: "ui",
  },
  {
    role: "Interactive Intern",
    company: "Pixel Harbor",
    dates: "2019 - 2020",
    visual: "intern",
  },
];
