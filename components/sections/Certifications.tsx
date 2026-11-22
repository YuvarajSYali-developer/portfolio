"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { certifications } from "@/lib/portfolio-data";
import { SECTION_IDS } from "@/lib/constants";
import { fadeUp, stagger, viewportOnce } from "@/lib/animations";
import { pad2 } from "@/lib/utils";

export default function Certifications() {
  return (
    <section id={SECTION_IDS.certifications} aria-labelledby="cert-title" className="relative scroll-mt-24 pb-24 md:pb-36">
      <div className="container-page">
        <div className="mb-8 flex items-baseline justify-between gap-6 border-t border-line pt-4">
          <span className="font-mono text-[0.7rem] tracking-[0.12em] text-fg-2">(08)</span>
          <h2 id="cert-title" className="eyebrow !font-mono !tracking-[0.22em]">Certifications</h2>
        </div>
        <motion.ul initial="hidden" whileInView="show" viewport={viewportOnce} variants={stagger(0.06)}>
          {certifications.map((c, i) => {
            const row = (
              <>
                <span className="font-mono text-[0.66rem] text-muted">{pad2(i + 1)}</span>
                <span className="font-display text-[clamp(1.15rem,2vw,1.6rem)] font-medium leading-snug tracking-[-0.02em] text-fg transition-transform duration-500 group-hover:translate-x-1.5">
                  {c.title}
                </span>
                <span className="hidden text-[0.85rem] text-fg-2 md:block">{c.detail ?? ""}</span>
                <span className="flex items-center justify-end gap-3 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-fg-2">
                  {c.issuer}
                  {c.href ? (
                    <ArrowUpRight className="size-4 text-muted transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" aria-hidden />
                  ) : null}
                </span>
              </>
            );
            const cls =
              "group grid grid-cols-[2rem_1fr_auto] items-center gap-4 border-b border-line py-5 md:grid-cols-[3rem_1.4fr_1fr_8rem]";
            return (
              <motion.li key={c.title} variants={fadeUp}>
                {c.href ? (
                  <a href={c.href} target="_blank" rel="noopener noreferrer" className={cls} aria-label={`${c.title}, ${c.issuer} — view certificate`}>
                    {row}
                  </a>
                ) : (
                  <div className={cls}>{row}</div>
                )}
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
