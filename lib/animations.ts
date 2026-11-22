import type { Variants, Transition } from "motion/react";

/** One motion language for the whole site: soft, expo-out reveals. */
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_IN_OUT: [number, number, number, number] = [0.76, 0, 0.24, 1];

export const DURATION = { fast: 0.35, base: 0.7, slow: 1.1 } as const;

export const springSoft: Transition = { type: "spring", stiffness: 260, damping: 30, mass: 0.6 };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE_OUT } },
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DURATION.base, ease: EASE_OUT } },
};

export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

/** Clip-path line reveal used for editorial headings. */
export const lineReveal: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.85, ease: EASE_OUT } },
};

export const viewportOnce = { once: true, margin: "0px 0px -12% 0px" } as const;
