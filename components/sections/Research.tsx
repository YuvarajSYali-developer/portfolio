"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, FileText } from "lucide-react";
import { SectionHeading, Reveal } from "@/components/ui/section-heading";
import { TextReveal } from "@/components/ui/text-reveal";
import { EEGWaveform } from "@/components/visuals/research-visuals";
import { research } from "@/lib/portfolio-data";
import { SECTION_IDS } from "@/lib/constants";
import { cn, pad2 } from "@/lib/utils";

/* Interactive methodology diagram: scroll draws the connector and advances the
   active stage; click / focus any stage to inspect it. */
function MethodologyDiagram() {
  const ref = useRef<HTMLOListElement>(null);
  const steps = research.pipeline;
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const line = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (pinned !== null) return;
    const i = Math.min(steps.length - 1, Math.max(0, Math.floor(v * steps.length)));
    setActive((a) => (a === i ? a : i));
  });

  const current = pinned ?? active;

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <ol ref={ref} className="relative lg:col-span-5" aria-label="Research methodology">
        <div aria-hidden className="absolute bottom-6 left-[19px] top-6 w-px bg-line" />
        <motion.div aria-hidden className="absolute left-[19px] top-6 w-px bg-gradient-to-b from-cyan via-electric to-violet" style={{ height: line }} />
        {steps.map((s, i) => {
          const isActive = i === current;
          const done = i < current;
          return (
            <li key={s.step} className="relative">
              <button
                type="button"
                onClick={() => setPinned((p) => (p === i ? null : i))}
                onFocus={() => setActive(i)}
                aria-pressed={pinned === i}
                className="group flex w-full items-center gap-4 py-2.5 text-left"
              >
                <span
                  className={cn(
                    "relative z-10 grid size-10 shrink-0 place-items-center rounded-full border font-mono text-[0.68rem] transition-all duration-500",
                    isActive
                      ? "border-cyan bg-cyan/10 text-cyan shadow-[0_0_24px_rgba(50,214,229,0.35)]"
                      : done
                        ? "border-electric/50 bg-ink-2 text-electric"
                        : "border-line-strong bg-ink-2 text-muted",
                  )}
                >
                  {pad2(i + 1)}
                </span>
                <span
                  className={cn(
                    "font-mono text-[0.78rem] uppercase tracking-[0.14em] transition-colors duration-500",
                    isActive ? "text-fg" : "text-fg-2 group-hover:text-fg",
                  )}
                >
                  {s.step}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="flex flex-col gap-4 lg:col-span-7">
        <div className="relative overflow-hidden rounded-2xl border border-line bg-ink-2 p-6 md:p-8" aria-live="polite">
          <div className="mb-4 flex items-center justify-between">
            <span className="eyebrow text-[0.62rem]">
              Stage {pad2(current + 1)} / {pad2(steps.length)}
            </span>
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted">
              {pinned !== null ? "Pinned · click again to release" : "Scroll or select a stage"}
            </span>
          </div>
          <motion.div key={current} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <h4 className="font-display text-2xl font-medium tracking-tight text-fg md:text-3xl">{steps[current].step}</h4>
            <p className="mt-3 max-w-xl leading-relaxed text-fg-2">{steps[current].detail}</p>
          </motion.div>
          <div className="mt-6 flex gap-1" aria-hidden>
            {steps.map((_, i) => (
              <span key={i} className={cn("h-1 flex-1 rounded-full transition-colors duration-500", i <= current ? "bg-electric" : "bg-white/[0.06]")} />
            ))}
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-line bg-ink-2 p-4">
          <div className="mb-2 flex items-center justify-between px-2">
            <span className="eyebrow text-[0.62rem]">Resting-state EEG · stylised</span>
            <span className="flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-cyan">
              <span className="size-1.5 animate-pulse-dot rounded-full bg-cyan" /> signal
            </span>
          </div>
          <EEGWaveform className="h-auto w-full" />
        </div>
      </div>
    </div>
  );
}

export default function Research() {
  const { paper, facts, bestModel } = research;
  return (
    <section id={SECTION_IDS.research} className="relative scroll-mt-24 py-28 md:py-40">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-dots opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="container-page relative">
        <SectionHeading index="04" eyebrow="Research & Publications" title={research.heading} />

        {/* Featured paper */}
        <Reveal>
          <article className="relative overflow-hidden rounded-3xl border border-line bg-ink-2/70 p-6 md:p-12">
            <div aria-hidden className="absolute -right-24 -top-24 size-80 rounded-full bg-violet/10 blur-3xl" />
            <div className="relative flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1.5 font-mono text-[0.64rem] uppercase tracking-[0.16em] text-cyan">
                <span className="size-1.5 animate-pulse-dot rounded-full bg-cyan" />
                {paper.status}
              </span>
              <span className="eyebrow text-[0.62rem]">Featured paper · Conference publication</span>
            </div>
            <h3 className="relative mt-8 max-w-5xl font-display text-[clamp(1.7rem,3.6vw,3.1rem)] font-medium leading-[1.08] tracking-[-0.03em] text-fg">
              {paper.title}
            </h3>
            <p className="relative mt-4 text-[0.95rem] text-fg-2">
              <span className="text-fg">{paper.venue}</span>
              <span className="text-muted"> · {paper.venueDetail}</span>
            </p>
            <div className="relative mt-8 max-w-3xl">
              <TextReveal paragraphs={[paper.overview]} paragraphClassName="text-[clamp(1.05rem,1.6vw,1.3rem)] leading-relaxed" />
            </div>
            <a
              href={paper.manuscript}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline relative mt-8 inline-flex items-center gap-2 text-sm font-medium text-fg"
            >
              <FileText className="size-4 text-fg-2" aria-hidden /> Read the paper <ArrowUpRight className="size-3.5 text-fg-2" aria-hidden />
            </a>

            {/* Research bento */}
            <div className="relative mt-12 grid gap-3 md:grid-cols-4">
              <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:col-span-3 md:grid-cols-3">
                {facts.map((f) => (
                  <div key={f.label} className="bg-ink p-5">
                    <dt className="eyebrow text-[0.6rem]">{f.label}</dt>
                    <dd className="mt-2 font-display text-lg font-medium text-fg md:text-xl">{f.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex flex-col justify-between rounded-2xl border border-electric/30 bg-gradient-to-b from-electric/10 to-transparent p-5">
                <div>
                  <p className="eyebrow text-[0.6rem]">Best model</p>
                  <p className="mt-2 font-display text-xl font-medium text-fg">{bestModel.name}</p>
                </div>
                <dl className="mt-6 grid grid-cols-2 gap-3">
                  {bestModel.metrics.map((m) => (
                    <div key={m.label}>
                      <dt className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">{m.label}</dt>
                      <dd className="font-display text-3xl font-medium tracking-tight text-electric">{m.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </article>
        </Reveal>

        {/* Methodology */}
        <div className="mt-24 md:mt-32">
          <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-3">Methodology</p>
              <h3 className="font-display text-[clamp(1.8rem,3.4vw,2.8rem)] font-medium tracking-[-0.03em] text-fg">From raw EEG to a cognitive score.</h3>
            </div>
          </Reveal>
          <MethodologyDiagram />
        </div>
      </div>
    </section>
  );
}
