"use client";

import { motion } from "motion/react";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { SectionHeading } from "@/components/ui/section-heading";
import { metrics } from "@/lib/portfolio-data";
import { SECTION_IDS } from "@/lib/constants";
import { fadeUp, stagger, viewportOnce } from "@/lib/animations";

export default function Metrics() {
  return (
    <section id={SECTION_IDS.metrics} className="relative scroll-mt-24 py-24 md:py-32">
      <div className="container-page">
        <SectionHeading
          index="05"
          eyebrow="By the numbers"
          title="Measured, in context."
          intro="Figures from individual projects, each shown with the project it belongs to — not combined career totals or independent production benchmarks."
        />
        <motion.ul
          className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={stagger(0.07)}
        >
          {metrics.map((m) => (
            <motion.li key={m.label + m.context} variants={fadeUp} className="group relative bg-ink-2/90 p-7 md:p-9">
              <a href={`#${m.projectId}`} className="absolute inset-0 z-10" aria-label={`${m.label} — ${m.context}. Jump to project`} />
              <p className="font-display text-[clamp(2.6rem,5vw,4rem)] font-medium leading-none tracking-[-0.04em] text-fg">
                <AnimatedCounter value={m.value} decimals={m.decimals} prefix={m.prefix} suffix={m.suffix} />
              </p>
              <p className="mt-4 text-[0.95rem] text-fg-2">{m.label}</p>
              <p className="mt-6 inline-flex items-center gap-2 font-mono text-[0.64rem] uppercase tracking-[0.18em] text-muted transition-colors group-hover:text-cyan">
                <span className="h-px w-5 bg-current" /> {m.context}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
