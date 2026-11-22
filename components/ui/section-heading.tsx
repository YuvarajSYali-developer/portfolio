"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { fadeUp, lineReveal, stagger, viewportOnce } from "@/lib/animations";
import { cn } from "@/lib/utils";

/** Editorial section header: indexed eyebrow + masked line-reveal heading. */
export function SectionHeading({
  index,
  eyebrow,
  title,
  intro,
  className,
  align = "left",
}: {
  index: string;
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  className?: string;
  align?: "left" | "center";
}) {
  const words = title.split(" ");
  return (
    <motion.header
      className={cn("mb-14 md:mb-20", align === "center" && "text-center", className)}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={stagger(0.06)}
    >
      <motion.div variants={fadeUp} className="mb-10 flex items-baseline justify-between gap-6 border-t border-line pt-4 md:mb-14">
        <span className="font-mono text-[0.7rem] tracking-[0.12em] text-fg-2">({index})</span>
        <span className="eyebrow">{eyebrow}</span>
      </motion.div>
      <h2 className="font-display text-[clamp(2.5rem,7vw,6rem)] font-medium leading-[0.95] tracking-[-0.04em] text-fg">
        {words.map((w, i) => (
          <span key={i} className="mr-[0.22em] inline-block overflow-hidden pb-[0.08em] align-bottom last:mr-0">
            <motion.span variants={lineReveal} className={cn("inline-block", i === words.length - 1 && "accent pr-[0.06em]")}>
              {w}
            </motion.span>
          </span>
        ))}
      </h2>
      {intro ? (
        <motion.div variants={fadeUp} className={cn("mt-6 max-w-2xl text-base leading-relaxed text-fg-2 md:text-lg", align === "center" && "mx-auto")}>
          {intro}
        </motion.div>
      ) : null}
    </motion.header>
  );
}

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
