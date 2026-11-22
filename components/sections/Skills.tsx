"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { SectionHeading, Reveal } from "@/components/ui/section-heading";
import { iconCloudSlugs, skillGroups } from "@/lib/portfolio-data";
import { SECTION_IDS } from "@/lib/constants";
import { fadeUp, stagger, viewportOnce } from "@/lib/animations";
import { pad2 } from "@/lib/utils";

// The cloud is decorative and below the fold: split it out of the main bundle.
const InteractiveIconCloud = dynamic(
  () => import("@/components/ui/interactive-icon-cloud").then((m) => m.InteractiveIconCloud),
  { ssr: false, loading: () => <div className="aspect-square w-full" /> },
);

export default function Skills() {
  return (
    <section id={SECTION_IDS.skills} className="relative scroll-mt-24 py-28 md:py-40">
      <div className="container-page">
        <SectionHeading index="06" eyebrow="Technical Skills" title="The Toolkit." intro="Languages, frameworks and tools used across the projects and research above." />

        <div className="grid items-center gap-14 lg:grid-cols-12">
          <Reveal className="relative mx-auto w-full max-w-[520px] lg:col-span-5">
            <div aria-hidden className="absolute inset-[12%] rounded-full bg-electric/10 blur-3xl" />
            <div aria-hidden className="absolute inset-[6%] rounded-full border border-line" />
            <div aria-hidden className="absolute inset-[22%] rounded-full border border-dashed border-line" />
            <InteractiveIconCloud slugs={iconCloudSlugs} />
            <p className="mt-2 text-center font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted">Drag to rotate</p>
          </Reveal>

          <motion.dl
            className="lg:col-span-7"
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={stagger(0.06)}
          >
            {skillGroups.map((g, i) => (
              <motion.div key={g.group} variants={fadeUp} className="grid gap-3 border-t border-line py-6 last:border-b sm:grid-cols-[13rem_1fr] sm:gap-6">
                <dt className="flex items-baseline gap-3">
                  <span className="font-mono text-[0.66rem] text-cyan">{pad2(i + 1)}</span>
                  <span className="font-mono text-[0.74rem] uppercase tracking-[0.18em] text-fg">{g.group}</span>
                </dt>
                <dd>
                  <ul className="flex flex-wrap gap-x-2 gap-y-2">
                    {g.items.map((s) => (
                      <li key={s} className="rounded-full border border-line bg-ink-2/60 px-3 py-1 text-[0.86rem] text-fg-2 transition-colors hover:border-line-strong hover:text-fg">
                        {s}
                      </li>
                    ))}
                  </ul>
                </dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </div>
    </section>
  );
}
