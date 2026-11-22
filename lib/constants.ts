/**
 * Site-wide constants. Replace SITE_URL with the production domain once deployed
 * (or set NEXT_PUBLIC_SITE_URL in the hosting environment).
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio-indol-psi-55.vercel.app").replace(/\/$/, "");

export const SECTION_IDS = {
  home: "home",
  about: "about",
  experience: "experience",
  projects: "projects",
  research: "research",
  metrics: "metrics",
  skills: "skills",
  education: "education",
  certifications: "certifications",
  contact: "contact",
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

export const NAV_ITEMS: { name: string; id: SectionId }[] = [
  { name: "Home", id: "home" },
  { name: "About", id: "about" },
  { name: "Experience", id: "experience" },
  { name: "Projects", id: "projects" },
  { name: "Research", id: "research" },
  { name: "Skills", id: "skills" },
  { name: "Education", id: "education" },
  { name: "Contact", id: "contact" },
];

/** Sections that are not in the nav map onto the nearest nav item for active-state tracking. */
export const SECTION_TO_NAV: Partial<Record<SectionId, SectionId>> = {
  metrics: "research",
  certifications: "education",
};

export const HERO_MEDIA = {
  video: "/videos/hero-reel.mp4",
  videoMobile: "/videos/hero-reel-mobile.mp4",
  poster: "/videos/hero-poster.webp",
  background: "/images/hero-bg.webp",
};

export const RESUME_PATH = "/resume/Yuvaraj_S_Yali_Resume.pdf";
export const RESUME_ONEPAGE_PATH = "/resume/Yuvaraj_S_Yali_Resume_OnePage.pdf";
