"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, FileText, Globe, PlayCircle, Plus } from "lucide-react";
import { SectionHeading, Reveal } from "@/components/ui/section-heading";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { PortfolioProjectsShowcase } from "@/components/ui/portfolio-projects-showcase";
import { GitHubIcon } from "@/components/ui/brand-icons";
import { AVitalVisual, PROJECT_VISUALS } from "@/components/visuals/project-visuals";
import { projects, type Project } from "@/lib/portfolio-data";
import { SECTION_IDS } from "@/lib/constants";
import { useFinePointer, useInView, usePrefersReducedMotion } from "@/lib/hooks";
import { EASE_OUT } from "@/lib/animations";
import { cn } from "@/lib/utils";

const NeuralCore3D = dynamic(() => import("@/components/visuals/neural-core-3d"), { ssr: false });

/* ───────────── Media (screenshot if supplied, else abstract visual) ───────────── */

function ProjectMedia({ project, className }: { project: Project; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, "400px");
  // Build the (DOM-heavy) illustration only once it has come near the viewport.
  const [seen, setSeen] = useState(false);
  if (near && !seen) setSeen(true);
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const Visual = PROJECT_VISUALS[project.visual];
  const use3D = project.visual === "avital" && fine && !reduced && !project.image;

  return (
    <div ref={ref} className={cn("relative aspect-[16/10] overflow-hidden bg-ink-2", className)}>
      <div className="absolute inset-0 transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/spot:scale-[1.03]">
        {project.image ? (
          <Image src={project.image} alt={`${project.title} — ${project.subtitle}`} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
        ) : use3D && seen ? (
          <>
            <AVitalVisual withCore={false} />
            {near && (
              <div className="absolute left-0 top-[6%] h-[94%] w-[62%]">
                <NeuralCore3D active={near} />
              </div>
            )}
          </>
        ) : seen ? (
          <Visual />
        ) : null}
      </div>
    </div>
  );
}

/* ───────────── Pieces ───────────── */

function LinkButtons({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap gap-2">
      {project.links.map((l) => {
        const Icon = l.kind === "github" ? GitHubIcon : l.kind === "demo" ? Globe : l.kind === "video" ? PlayCircle : FileText;
        const primary = l.kind !== "doc";
        return (
          <a
            key={l.href + l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "group/link inline-flex h-10 items-center gap-2 rounded-full px-4 text-[0.82rem] font-medium transition-all duration-300",
              primary ? "bg-fg text-ink hover:bg-white" : "border border-line-strong text-fg hover:border-fg-2",
            )}
          >
            <Icon className="size-3.5" />
            {l.kind === "demo" ? "Live demo" : l.label}
            <ArrowUpRight className="size-3.5 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" aria-hidden />
          </a>
        );
      })}
    </div>
  );
}

function Results({ project }: { project: Project }) {
  return (
    <dl className="grid grid-cols-2 gap-6 border-t border-line pt-5">
      {project.results.map((r) => (
        <div key={r.label}>
          <dt className="sr-only">{r.label}</dt>
          <dd>
            <span className="block font-display text-[clamp(1.7rem,2.8vw,2.4rem)] font-medium leading-none tracking-[-0.03em] text-fg">
              {r.value}
            </span>
            <span className="mt-2 block text-[0.78rem] leading-snug text-fg-2">{r.label}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

function HowItWorks({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const id = `${project.id}-how`;
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={id}
        className="group/how inline-flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-fg-2 transition-colors hover:text-fg"
      >
        <span className={cn("grid size-6 place-items-center rounded-full border border-line transition-transform duration-500", open && "rotate-45")}>
          <Plus className="size-3" aria-hidden />
        </span>
        How it works
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <div className="space-y-5 pt-5 text-[0.9rem] leading-relaxed text-fg-2">
              <p>
                <span className="text-fg">The problem — </span>
                {project.problem}
              </p>
              <ul className="space-y-2">
                {[...project.approach, ...project.details].map((a) => (
                  <li key={a} className="flex gap-3">
                    <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0" style={{ background: project.accent }} />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Body({ project, large = false }: { project: Project; large?: boolean }) {
  return (
    <div className="flex h-full flex-col gap-6">
      <div>
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <span className="font-mono text-[0.68rem] text-fg-2">({project.number})</span>
          <span className="eyebrow text-[0.6rem]">{project.category}</span>
        </div>
        <h3
          className={cn(
            "font-display font-medium leading-[0.95] tracking-[-0.035em] text-fg",
            large ? "text-[clamp(2.3rem,4.6vw,4rem)]" : "text-[clamp(1.9rem,3vw,2.7rem)]",
          )}
        >
          {project.title}
        </h3>
        <p className="mt-2 font-serif text-[1.2rem] italic text-[#cdd3ff]">{project.subtitle}</p>
      </div>
      <p className="max-w-xl text-[0.98rem] leading-relaxed text-fg-2">{project.description}</p>
      <ul className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[0.64rem] uppercase tracking-[0.14em] text-muted" aria-label="Technologies">
        {project.tags.slice(0, 5).map((t, i) => (
          <li key={t} className="flex items-center gap-3">
            {i > 0 && <span aria-hidden>·</span>}
            {t}
          </li>
        ))}
      </ul>
      <div className="mt-auto space-y-6">
        <Results project={project} />
        <LinkButtons project={project} />
        <HowItWorks project={project} />
      </div>
    </div>
  );
}

function ProjectCase({ project, variant }: { project: Project; variant: "wide" | "left" | "right" | "half" }) {
  return (
    <SpotlightCard as="article" glow={project.accent} className="rounded-[1.75rem]">
      <div id={project.id} className="scroll-mt-28" />
      {variant === "wide" ? (
        <div className="grid lg:grid-cols-12">
          <ProjectMedia project={project} className="lg:col-span-7 lg:aspect-auto lg:min-h-full" />
          <div className="p-6 md:p-10 lg:col-span-5">
            <Body project={project} large />
          </div>
        </div>
      ) : variant === "half" ? (
        <div className="flex h-full flex-col">
          <ProjectMedia project={project} />
          <div className="flex-1 p-6 md:p-8">
            <Body project={project} />
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12">
          <ProjectMedia project={project} className={cn("lg:col-span-7", variant === "right" && "lg:order-2")} />
          <div className={cn("p-6 md:p-10 lg:col-span-5", variant === "right" && "lg:order-1")}>
            <Body project={project} />
          </div>
        </div>
      )}
    </SpotlightCard>
  );
}

export default function Projects() {
  const [first, second, third, ...rest] = projects;

  const goTo = (id: string) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <section id={SECTION_IDS.projects} className="relative scroll-mt-24 py-24 md:py-36">
      <div className="container-page">
        <SectionHeading
          index="03"
          eyebrow="Featured Projects"
          title="Selected Work."
          intro="Five systems across ML engineering, applied research, full-stack development and embedded IoT."
        />

        <Reveal>
          <PortfolioProjectsShowcase
            onSelect={goTo}
            items={projects.map((p) => {
              const V = PROJECT_VISUALS[p.visual];
              return {
                id: p.id,
                number: p.number,
                title: p.title,
                subtitle: p.subtitle,
                category: p.category,
                accent: p.accent,
                preview: p.image ? <Image src={p.image} alt="" fill sizes="320px" className="object-cover" /> : <V />,
              };
            })}
          />
        </Reveal>

        <div className="mt-20 space-y-8 md:mt-28 md:space-y-10">
          <Reveal>
            <ProjectCase project={first} variant="wide" />
          </Reveal>
          <Reveal>
            <ProjectCase project={second} variant="right" />
          </Reveal>
          <Reveal>
            <ProjectCase project={third} variant="left" />
          </Reveal>
          <div className="grid gap-8 md:gap-10 lg:grid-cols-2">
            {rest.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08} className="h-full">
                <ProjectCase project={p} variant="half" />
              </Reveal>
            ))}
          </div>
        </div>
        <p className="mt-6 text-right font-mono text-[0.6rem] uppercase tracking-[0.16em] text-muted">
          Project visuals are illustrative — see the live demos for the real interfaces.
        </p>
      </div>
    </section>
  );
}
