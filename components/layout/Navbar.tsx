"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import {
  Briefcase,
  Cpu,
  FlaskConical,
  FolderKanban,
  GraduationCap,
  Home,
  Mail,
  Menu,
  User,
  X,
  type LucideIcon,
} from "lucide-react";
import { TubelightNavbar } from "@/components/ui/tubelight-navbar";
import { NAV_ITEMS, SECTION_IDS, SECTION_TO_NAV, type SectionId } from "@/lib/constants";
import { personal } from "@/lib/portfolio-data";
import { EASE_OUT } from "@/lib/animations";
import { cn, pad2 } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  home: Home,
  about: User,
  experience: Briefcase,
  projects: FolderKanban,
  research: FlaskConical,
  skills: Cpu,
  education: GraduationCap,
  contact: Mail,
};

export function scrollToSection(id: string) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior: ScrollBehavior = reduce ? "auto" : "smooth";
  if (id === SECTION_IDS.home) {
    window.scrollTo({ top: 0, behavior });
  } else {
    document.getElementById(id)?.scrollIntoView({ behavior, block: "start" });
  }
  history.replaceState(null, "", id === SECTION_IDS.home ? window.location.pathname : `#${id}`);
}

export default function Navbar() {
  const [active, setActive] = useState<SectionId>("home");
  const [prominent, setProminent] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const threshold = useRef(400);

  /* Measure the intro once (and on resize) instead of on every scroll event. */
  useEffect(() => {
    const measure = () => {
      const hero = document.getElementById(SECTION_IDS.home);
      threshold.current = hero ? hero.offsetHeight - window.innerHeight * 1.15 : 400;
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  /* Unobtrusive during the video intro, prominent once the hero has expanded. */
  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > threshold.current;
    setProminent((p) => (p === next ? p : next));
  });

  /* Active section tracking — a thin band across the middle of the viewport. */
  useEffect(() => {
    const ids = Object.values(SECTION_IDS);
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id as SectionId;
          setActive(SECTION_TO_NAV[id] ?? id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const navigate = useCallback((id: string) => {
    setMenuOpen(false);
    scrollToSection(id);
  }, []);

  /* Mobile sheet: Escape to close, scroll lock, focus management. */
  useEffect(() => {
    if (!menuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const firstLink = sheetRef.current?.querySelector<HTMLElement>("a,button");
    firstLink?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
      if (e.key === "Tab" && sheetRef.current) {
        const focusables = Array.from(sheetRef.current.querySelectorAll<HTMLElement>("a,button"));
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    const button = menuButtonRef.current;
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      button?.focus();
    };
  }, [menuOpen]);

  const items = NAV_ITEMS.map((n) => ({ ...n, icon: ICONS[n.id] }));

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
        initial={false}
        animate={{ opacity: prominent ? 1 : 0.85, y: prominent ? 0 : -4 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
      >
        <nav aria-label="Primary" className="flex w-full max-w-[82rem] items-center justify-between gap-4">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              navigate("home");
            }}
            className={cn(
              "group flex h-11 items-center gap-2.5 rounded-full px-3 transition-colors duration-500",
              prominent ? "glass" : "bg-transparent",
            )}
          >
            <span aria-hidden className="grid size-7 place-items-center rounded-full border border-line-strong font-display text-[0.7rem] font-semibold tracking-tight text-fg">
              YSY
            </span>
            <span aria-hidden className="hidden whitespace-nowrap font-mono text-[0.68rem] uppercase tracking-[0.2em] text-fg-2 sm:inline lg:hidden xl:inline">
              {personal.name}
            </span>
            <span className="sr-only">{personal.name}, back to top</span>
          </a>

          {/* Desktop pill */}
          <div
            className={cn(
              "hidden rounded-full transition-[background-color,border-color,box-shadow] duration-500 lg:block",
              prominent ? "glass shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)]" : "border border-transparent",
            )}
          >
            <TubelightNavbar items={NAV_ITEMS} activeId={active} onNavigate={navigate} />
          </div>

          <div className="hidden w-[11.5rem] justify-end lg:flex">
            <a
              href={`mailto:${personal.email}`}
              className={cn(
                "link-underline font-mono text-[0.68rem] uppercase tracking-[0.2em] text-fg-2 transition-opacity duration-500 hover:text-fg",
                prominent ? "opacity-100" : "opacity-0",
              )}
              tabIndex={prominent ? 0 : -1}
            >
              Get in touch
            </a>
          </div>

          {/* Mobile trigger */}
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen(true)}
            className="glass flex h-11 items-center gap-2 rounded-full px-4 text-[0.8rem] text-fg lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-fg-2">
              {NAV_ITEMS.find((n) => n.id === active)?.name}
            </span>
            <Menu className="size-4" aria-hidden />
            <span className="sr-only">Open menu</span>
          </button>
        </nav>
      </motion.header>

      {/* Mobile sheet */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="fixed inset-0 z-[70] flex flex-col bg-ink/95 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
          >
            <div className="flex items-center justify-between px-5 pt-5">
              <span className="eyebrow">Navigate</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="glass grid size-11 place-items-center rounded-full text-fg"
              >
                <X className="size-5" aria-hidden />
                <span className="sr-only">Close menu</span>
              </button>
            </div>
            <ul className="mt-6 flex flex-1 flex-col justify-center gap-1 px-6 pb-10">
              {items.map((item, i) => {
                const isActive = item.id === active;
                return (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.04 * i }}
                  >
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(item.id);
                      }}
                      aria-current={isActive ? "location" : undefined}
                      className="group flex items-baseline gap-4 border-b border-line py-3"
                    >
                      <span className="font-mono text-xs text-muted">{pad2(i + 1)}</span>
                      <span
                        className={cn(
                          "font-display text-[clamp(1.75rem,8vw,2.5rem)] font-medium tracking-tight transition-colors",
                          isActive ? "text-fg" : "text-fg-2 group-hover:text-fg",
                        )}
                      >
                        {item.name}
                      </span>
                      {isActive && <span className="ml-auto size-1.5 self-center rounded-full bg-cyan shadow-[0_0_12px_#32d6e5]" />}
                    </a>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
