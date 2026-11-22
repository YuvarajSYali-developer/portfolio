"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check, Copy, Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { SocialIcon } from "@/components/ui/brand-icons";
import { contact, personal, socials } from "@/lib/portfolio-data";
import { RESUME_ONEPAGE_PATH, SECTION_IDS } from "@/lib/constants";
import { fadeUp, lineReveal, stagger, viewportOnce } from "@/lib/animations";

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(personal.email);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = personal.email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="glass inline-flex max-w-full items-center gap-1 rounded-full p-1.5 pl-5">
      <a href={`mailto:${personal.email}`} className="link-underline truncate font-mono text-[clamp(0.85rem,1.6vw,1.05rem)] text-fg">
        {personal.email}
      </a>
      <button
        type="button"
        onClick={copy}
        className="relative ml-2 grid size-9 shrink-0 place-items-center rounded-full bg-white/[0.06] text-fg-2 transition-colors hover:bg-white/10 hover:text-fg"
        aria-label={copied ? "Email copied" : "Copy email address"}
      >
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span key="ok" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}>
              <Check className="size-4 text-cyan" aria-hidden />
            </motion.span>
          ) : (
            <motion.span key="copy" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }}>
              <Copy className="size-4" aria-hidden />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </div>
  );
}

export default function Contact() {
  const words = contact.heading.split(" ");
  const profileLinks = socials.filter((s) => s.key !== "email");
  return (
    <section id={SECTION_IDS.contact} className="relative scroll-mt-24 overflow-hidden py-32 md:py-48">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(98,138,255,0.14),transparent_60%)]" />
      <motion.div
        className="container-page relative text-center"
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={stagger(0.07)}
      >
        <motion.div variants={fadeUp} className="mb-14 flex items-baseline justify-between gap-6 border-t border-line pt-4 text-left">
          <span className="font-mono text-[0.7rem] tracking-[0.12em] text-fg-2">(09)</span>
          <span className="eyebrow">Contact</span>
        </motion.div>

        <h2 className="mx-auto max-w-5xl font-display text-[clamp(2.8rem,8.5vw,7.5rem)] font-medium leading-[0.92] tracking-[-0.05em] text-fg">
          {words.map((w, i) => (
            <span key={i} className="mr-[0.2em] inline-block overflow-hidden pb-[0.08em] align-bottom last:mr-0">
              <motion.span variants={lineReveal} className={i >= words.length - 1 ? "inline-block accent pr-[0.06em]" : "inline-block"}>
                {w}
              </motion.span>
            </span>
          ))}
        </h2>

        <motion.p variants={fadeUp} className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-fg-2">
          {contact.copy}
        </motion.p>

        <motion.div variants={fadeUp} className="mt-10 flex justify-center">
          <CopyEmail />
        </motion.div>

        <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Magnetic>
            <Button asChild size="lg">
              <a href={`mailto:${personal.email}?subject=${encodeURIComponent("Hello Yuvaraj")}`}>
                <Mail aria-hidden /> Send an email
              </a>
            </Button>
          </Magnetic>
          <Magnetic>
            <Button asChild size="lg" variant="glass">
              <a href={personal.resumePath} download>
                <Download aria-hidden /> Download résumé
              </a>
            </Button>
          </Magnetic>
        </motion.div>

        <motion.p variants={fadeUp} className="mt-4 text-[0.8rem] text-muted">
          Prefer a single page?{" "}
          <a href={RESUME_ONEPAGE_PATH} download className="link-underline text-fg-2 hover:text-fg">
            Download the one-page résumé
          </a>
        </motion.p>

        <motion.ul variants={fadeUp} className="mt-12 flex flex-wrap items-center justify-center gap-3" aria-label="Profiles">
          {profileLinks.map((s) => (
            <li key={s.key}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 rounded-full border border-line px-4 py-2.5 text-sm text-fg-2 transition-colors duration-300 hover:border-line-strong hover:text-fg"
              >
                <SocialIcon name={s.key} className="size-4" />
                {s.label}
                <ArrowUpRight className="size-3.5 opacity-50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </a>
            </li>
          ))}
        </motion.ul>

        <motion.p variants={fadeUp} className="mt-12 inline-flex items-center gap-2.5 font-mono text-[0.66rem] uppercase tracking-[0.2em] text-muted">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex size-2 rounded-full bg-cyan" />
          </span>
          Currently: {personal.currentStatus}
        </motion.p>
      </motion.div>
    </section>
  );
}
