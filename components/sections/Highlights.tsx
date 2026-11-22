"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { highlights } from "@/lib/portfolio-data";
import { fadeUp, stagger, viewportOnce } from "@/lib/animations";

/** Quick-scan strip for recruiters: the four facts worth knowing in five seconds. */
export default function Highlights() {
  return (
    <section aria-label="Highlights" className="relative py-10 md:py-14">
      <div className="container-page">
        <motion.ul
          className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4"
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={stagger(0.07)}
        >
          {highlights.map((h) => (
            <motion.li key={h.label} variants={fadeUp} className="bg-ink-2/85">
              <a href={h.href} className="group flex h-full flex-col justify-between gap-4 p-4 transition-colors hover:bg-white/[0.02] md:gap-6 md:p-6">
                <span className="flex items-center justify-between">
                  <span className="eyebrow text-[0.6rem]">{h.label}</span>
                  <ArrowUpRight
                    className="size-3.5 text-muted transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg"
                    aria-hidden
                  />
                </span>
                <span>
                  <span className="block font-display text-[1.05rem] font-medium leading-tight md:text-[1.25rem] tracking-[-0.02em] text-fg">{h.title}</span>
                  <span className="mt-1 block text-[0.78rem] leading-snug text-fg-2 md:text-[0.85rem]">{h.detail}</span>
                </span>
              </a>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
