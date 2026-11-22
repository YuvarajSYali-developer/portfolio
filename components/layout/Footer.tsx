"use client";

import { ArrowUp, ArrowUpRight } from "lucide-react";
import { MotionFooter } from "@/components/ui/motion-footer";
import { SocialIcon } from "@/components/ui/brand-icons";
import { footer, personal, socials } from "@/lib/portfolio-data";
import { NAV_ITEMS } from "@/lib/constants";
import { scrollToSection } from "./Navbar";

export default function Footer() {
  return (
    <MotionFooter wordmark={personal.displayName}>
      <div className="container-page flex h-full flex-col justify-between pb-6 pt-14 md:pt-20">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-display text-[clamp(1.6rem,3vw,2.4rem)] font-medium leading-tight tracking-[-0.03em] text-fg">
              {footer.tagline}
            </p>
            <a href={`mailto:${personal.email}`} className="link-underline mt-5 inline-block font-mono text-sm text-fg-2 hover:text-fg">
              {personal.email}
            </a>
          </div>
          <nav aria-label="Footer" className="md:col-span-3 md:col-start-7">
            <p className="eyebrow mb-4 text-[0.62rem]">Sections</p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
              {NAV_ITEMS.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(n.id);
                    }}
                    className="link-underline text-sm text-fg-2 hover:text-fg"
                  >
                    {n.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-3">
            <p className="eyebrow mb-4 text-[0.62rem]">Elsewhere</p>
            <ul className="space-y-2">
              {socials.map((s) => (
                <li key={s.key}>
                  <a
                    href={s.href}
                    {...(s.key === "email" ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                    className="group inline-flex items-center gap-2 text-sm text-fg-2 hover:text-fg"
                  >
                    <SocialIcon name={s.key} className="size-3.5" />
                    <span className="link-underline">{s.label}</span>
                    {s.key !== "email" && <ArrowUpRight className="size-3 opacity-50" aria-hidden />}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
          <p className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-muted">{footer.copyright}</p>
          <button
            type="button"
            onClick={() => scrollToSection("home")}
            className="group inline-flex items-center gap-2 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-fg-2 hover:text-fg"
          >
            Back to top
            <span className="grid size-7 place-items-center rounded-full border border-line transition-transform group-hover:-translate-y-0.5">
              <ArrowUp className="size-3.5" aria-hidden />
            </span>
          </button>
        </div>
      </div>
    </MotionFooter>
  );
}
