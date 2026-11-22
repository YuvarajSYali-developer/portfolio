"use client";

/**
 * Vertical timeline (21st.dev / Aceternity "Timeline" pattern), simplified to read
 * like a well-set CV: dates on the left, one clear block per role on the right,
 * and a scroll-linked beam on the rail.
 */

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { experience } from "@/lib/portfolio-data";
import { SECTION_IDS } from "@/lib/constants";
import { EASE_OUT, viewportOnce } from "@/lib/animations";

export default function Experience() {
  const trackRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start 75%", "end 65%"] });
  const beam = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id={SECTION_IDS.experience} className="relative scroll-mt-24 py-24 md:py-32">
      <div className="container-page">
        <SectionHeading
          index="02"
          eyebrow="Experience"
          title="A Professional Journey."
          intro="From operations analytics at Porter and ML research at IIT Dharwad to policy research and civic software for a smart city."
        />

        <ol ref={trackRef} className="relative lg:ml-[calc(25%-1px)]">
          {/* rail + beam */}
          <div aria-hidden className="absolute bottom-2 left-0 top-2 w-px bg-line" />
          <motion.div
            aria-hidden
            className="absolute left-0 top-2 w-px origin-top bg-gradient-to-b from-cyan via-electric to-violet"
            style={{ height: beam }}
          />

          {experience.map((item) => (
            <motion.li
              key={item.id}
              className="relative pb-14 pl-8 last:pb-0 md:pb-16 md:pl-10 lg:pl-12"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.7, ease: EASE_OUT }}
            >
              {/* node */}
              <span
                aria-hidden
                className={
                  "absolute left-0 top-[0.45rem] size-[11px] -translate-x-1/2 rounded-full border-2 " +
                  (item.current ? "border-cyan bg-cyan/30 shadow-[0_0_12px_rgba(50,214,229,0.6)]" : "border-electric/70 bg-ink")
                }
              />

              {/* dates — beside the rail on desktop, above the role on mobile */}
              <div className="mb-3 lg:absolute lg:right-[calc(100%+3rem)] lg:top-0 lg:mb-0 lg:w-[13rem] lg:text-right">
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-fg-2">{item.date}</p>
                {item.location ? <p className="mt-1 text-[0.8rem] text-muted">{item.location}</p> : null}
                {item.current ? (
                  <span className="mt-2 inline-flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-cyan">
                    <span className="size-1.5 animate-pulse-dot rounded-full bg-cyan" /> Current
                  </span>
                ) : null}
              </div>

              <article className="max-w-3xl">
                <p className="eyebrow text-fg-2">{item.organisation}</p>
                <h3 className="mt-2 font-display text-[clamp(1.45rem,2.4vw,2rem)] font-medium leading-tight tracking-[-0.025em] text-fg">
                  {item.role}
                </h3>
                {item.note ? <p className="mt-1 text-[0.85rem] text-muted">{item.note}</p> : null}

                <ul className="mt-5 space-y-2.5 text-[0.97rem] leading-relaxed text-fg-2">
                  {item.description.map((d) => (
                    <li key={d} className="flex gap-3">
                      <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-electric" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-5 font-mono text-[0.62rem] uppercase leading-relaxed tracking-[0.14em] text-muted">{item.tags.join("  ·  ")}</p>
                {item.links?.length ? (
                <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
                  {item.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline inline-flex items-center gap-1 text-[0.85rem] font-medium text-fg"
                    >
                      {l.label} <ArrowUpRight className="size-3.5 text-fg-2" aria-hidden />
                    </a>
                  ))}
                </div>
                ) : null}
              </article>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
