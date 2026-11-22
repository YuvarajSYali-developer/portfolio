"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Brain, CircuitBoard, Code2, FlaskConical, Sparkles, Truck } from "lucide-react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import { about, personal, research } from "@/lib/portfolio-data";
import { SECTION_IDS } from "@/lib/constants";
import { EASE_OUT, fadeUp, stagger, viewportOnce } from "@/lib/animations";

const ICONS = {
  engineering: CircuitBoard,
  intelligence: Brain,
  research: FlaskConical,
  development: Code2,
  current: Truck,
  interests: Sparkles,
} as const;

function Portrait() {
  return (
    <motion.figure
      className="relative mx-auto w-full max-w-[360px] lg:mx-0 lg:ml-auto"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.9, ease: EASE_OUT }}
    >
      <div className="group relative aspect-[4/5] overflow-hidden rounded-[24px] border border-line-strong bg-ink-2">
        <Image
          src={personal.photo}
          alt="Portrait of Yuvaraj S Yali"
          fill
          sizes="(min-width: 1024px) 360px, 80vw"
          className="object-cover object-top saturate-[0.9] transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/90 to-transparent" />
        <figcaption className="absolute inset-x-0 bottom-0 p-5">
          <span className="block font-display text-base font-medium text-fg">{personal.name}</span>
          <span className="block font-mono text-[0.6rem] uppercase tracking-[0.18em] text-fg-2">AI/ML Engineer · Researcher</span>
        </figcaption>
      </div>
    </motion.figure>
  );
}

export default function About() {
  const [lead, ...rest] = about.intro;
  const quickFacts = [
    { label: "Studying", value: "B.Tech ECE · MIT Manipal · 2027" },
    { label: "Now", value: "Business Intern · Porter HCV" },
    { label: "Research", value: `Paper accepted · ${research.paper.venueShort}` },
  ];

  return (
    <section id={SECTION_IDS.about} className="relative scroll-mt-24 py-24 md:py-32">
      <div className="container-page">
        <SectionHeading index="01" eyebrow="About" title={about.heading} />

        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <motion.div
            className="lg:col-span-7"
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={stagger(0.08)}
          >
            <motion.p
              variants={fadeUp}
              className="font-display text-[clamp(1.4rem,2.4vw,2rem)] font-normal leading-[1.3] tracking-[-0.015em] text-fg"
            >
              {lead}
            </motion.p>
            {rest.map((p) => (
              <motion.p key={p} variants={fadeUp} className="mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-fg-2">
                {p}
              </motion.p>
            ))}

            <motion.dl variants={fadeUp} className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
              {quickFacts.map((f) => (
                <div key={f.label} className="bg-ink-2/80 p-4">
                  <dt className="eyebrow text-[0.6rem]">{f.label}</dt>
                  <dd className="mt-1.5 text-[0.9rem] leading-snug text-fg">{f.value}</dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          <div className="lg:col-span-5">
            <Portrait />
          </div>
        </div>

        {/* At a glance — one consistent card style, no decorative noise */}
        <motion.div
          className="mt-20 md:mt-24"
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={stagger(0.06)}
        >
          <motion.p variants={fadeUp} className="eyebrow mb-6">
            At a glance
          </motion.p>
          <BentoGrid className="grid-cols-2 gap-2.5 md:auto-rows-auto md:grid-cols-3">
            {about.bento.map((b) => {
              const Icon = ICONS[b.key];
              return (
                <motion.div key={b.key} variants={fadeUp} className="h-full">
                  <BentoGridItem
                    className="h-full min-h-0 p-4 md:min-h-[11rem] md:p-5"
                    label={b.label}
                    icon={
                      b.key === "current" ? (
                        <span className="relative mr-0.5 flex size-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-60 motion-reduce:hidden" />
                          <span className="relative inline-flex size-2 rounded-full bg-cyan" />
                        </span>
                      ) : (
                        <Icon className="size-3.5 text-electric" aria-hidden />
                      )
                    }
                    title={b.title}
                    description={b.lines.join(" · ")}
                  />
                </motion.div>
              );
            })}
          </BentoGrid>
        </motion.div>
      </div>
    </section>
  );
}
