"use client";

import { ArrowDown, ArrowUpRight, Download } from "lucide-react";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { scrollToSection } from "@/components/layout/Navbar";
import { HERO_MEDIA, SECTION_IDS } from "@/lib/constants";
import { personal } from "@/lib/portfolio-data";

export default function Hero() {
  return (
    <ScrollExpandMedia
      id={SECTION_IDS.home}
      mediaType="video"
      mediaSrc={HERO_MEDIA.video}
      mobileMediaSrc={HERO_MEDIA.videoMobile}
      posterSrc={HERO_MEDIA.poster}
      bgImageSrc={HERO_MEDIA.background}
      title={personal.displayName}
      date={personal.roles.join("  ·  ")}
      scrollToExpand="Scroll to explore ↓"
      mediaAlt=""
      cornerSlot={
        <button
          type="button"
          onClick={() => scrollToSection(SECTION_IDS.about)}
          className="eyebrow link-underline absolute bottom-5 right-5 z-30 hidden text-[0.62rem] text-fg-2 hover:text-fg md:block"
        >
          Skip intro
        </button>
      }
    >
      <div className="mx-auto w-full max-w-6xl text-center">
        <p className="eyebrow mb-6 text-fg-2">{personal.metaLine}</p>
        <p className="font-display text-[clamp(2.3rem,5.6vw,5.4rem)] font-medium leading-[0.95] tracking-[-0.045em] text-fg">
          <span className="block">{personal.headline[0]}</span>
          <span className="block accent">{personal.headline[1]}</span>
        </p>
        <p className="mx-auto mt-7 max-w-2xl text-[clamp(1rem,1.6vw,1.2rem)] leading-relaxed text-fg-2">{personal.subheadline}</p>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-fg-2" aria-label="Roles">
          {personal.roles.map((r, i) => (
            <li key={r} className="flex items-center gap-3">
              {i > 0 && <span aria-hidden className="text-muted">/</span>}
              {r}
            </li>
          ))}
        </ul>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Magnetic>
            <Button size="lg" onClick={() => scrollToSection(SECTION_IDS.projects)}>
              View selected work
              <ArrowDown aria-hidden />
            </Button>
          </Magnetic>
          <Magnetic>
            <Button asChild size="lg" variant="glass">
              <a href={personal.resumePath} download>
                <Download aria-hidden />
                Download résumé
              </a>
            </Button>
          </Magnetic>
          <Button asChild size="lg" variant="ghost" className="hidden sm:inline-flex">
            <a href={`mailto:${personal.email}`}>
              Get in touch <ArrowUpRight aria-hidden />
            </a>
          </Button>
        </div>
      </div>
    </ScrollExpandMedia>
  );
}
