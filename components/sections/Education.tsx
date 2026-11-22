"use client";

import { motion } from "motion/react";
import { SectionHeading } from "@/components/ui/section-heading";
import { education } from "@/lib/portfolio-data";
import { SECTION_IDS } from "@/lib/constants";
import { fadeUp, stagger, viewportOnce } from "@/lib/animations";

export default function Education() {
  const rows = [
    { label: "Degree", value: education.degree },
    { label: "Duration", value: education.duration },
    { label: "CGPA", value: education.cgpa },
    { label: "Location", value: education.location },
  ];
  return (
    <section id={SECTION_IDS.education} className="relative scroll-mt-24 py-28 md:py-40">
      <div className="container-page">
        <SectionHeading index="07" eyebrow="Education" title="Academic Foundation." />
        <motion.div
          className="grid gap-12 lg:grid-cols-12"
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={stagger(0.08)}
        >
          <motion.div variants={fadeUp} className="lg:col-span-5">
            <p className="eyebrow mb-5">Institution</p>
            <h3 className="font-display text-[clamp(2rem,4.2vw,3.6rem)] font-medium leading-[1.02] tracking-[-0.035em] text-fg">
              {education.institution}
            </h3>
            <p className="mt-8 whitespace-nowrap font-display text-[clamp(3rem,7vw,6.2rem)] font-medium leading-none tracking-[-0.06em] text-white/[0.06]" aria-hidden>
              {education.duration.replace(/\s/g, "")}
            </p>
          </motion.div>
          <motion.dl variants={fadeUp} className="lg:col-span-7">
            {rows.map((r) => (
              <div key={r.label} className="grid grid-cols-[7rem_1fr] items-baseline gap-6 border-t border-line py-5 last:border-b md:grid-cols-[10rem_1fr]">
                <dt className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">{r.label}</dt>
                <dd className={r.label === "CGPA" ? "font-display text-3xl font-medium tracking-tight text-fg" : "text-lg text-fg"}>{r.value}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>
      </div>
    </section>
  );
}
