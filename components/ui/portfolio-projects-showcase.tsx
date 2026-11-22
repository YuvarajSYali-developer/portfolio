"use client";

/**
 * Portfolio Projects Showcase — based on the 21st.dev component by @wrapcoders.
 * An editorial project index: numbered rows with a floating preview that
 * follows the cursor on hover (fine pointers only). Selecting a row hands
 * control back to the parent (e.g. scroll to / expand the full case study).
 */

import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFinePointer } from "@/lib/hooks";

export interface ShowcaseItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  accent: string;
  preview: ReactNode;
}

export function PortfolioProjectsShowcase({
  items,
  onSelect,
  className,
}: {
  items: ShowcaseItem[];
  onSelect: (id: string) => void;
  className?: string;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const fine = useFinePointer();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 26, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 220, damping: 26, mass: 0.5 });

  const onMove = (e: React.PointerEvent) => {
    const r = listRef.current?.getBoundingClientRect();
    if (!r) return;
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };

  return (
    <div className={cn("relative", className)}>
      <ul ref={listRef} onPointerMove={onMove} onPointerLeave={() => setHovered(null)} className="border-t border-line">
        {items.map((item, i) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onSelect(item.id)}
              onPointerEnter={() => setHovered(i)}
              onFocus={() => setHovered(null)}
              className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-4 border-b border-line py-6 text-left transition-colors duration-500 hover:bg-white/[0.015] md:grid-cols-[4rem_1.3fr_1fr_auto] md:py-8"
              aria-label={`${item.title} — ${item.subtitle}. View case study`}
            >
              <span className="font-mono text-xs text-muted transition-colors group-hover:text-fg-2">{item.number}</span>
              <span className="min-w-0">
                <span className="block font-display text-[clamp(1.6rem,4.2vw,3.25rem)] font-medium leading-none tracking-[-0.03em] text-fg transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">
                  {item.title}
                </span>
                <span className="mt-2 block text-sm text-fg-2 md:hidden">{item.subtitle}</span>
              </span>
              <span className="hidden md:block">
                <span className="block text-[0.95rem] text-fg-2">{item.subtitle}</span>
                <span className="eyebrow mt-1 block text-[0.62rem]">{item.category}</span>
              </span>
              <span
                className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full border border-line text-fg-2 transition-all duration-500 group-hover:border-transparent group-hover:text-ink"
                style={{ ["--a" as string]: item.accent }}
              >
                <span className="absolute inset-0 scale-0 rounded-full bg-[var(--a)] transition-transform duration-500 group-hover:scale-100" aria-hidden />
                <ArrowUpRight className="relative size-4" aria-hidden />
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* Floating preview */}
      {fine && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-20 hidden md:block"
          style={{ x: sx, y: sy }}
        >
          <AnimatePresence>
            {hovered !== null && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="relative -ml-[170px] -mt-[220px] h-[200px] w-[320px] overflow-hidden rounded-2xl border border-line-strong shadow-2xl shadow-black/60"
              >
                {items.map((item, i) => (
                  <div
                    key={item.id}
                    className="absolute inset-0 transition-opacity duration-300"
                    style={{ opacity: hovered === i ? 1 : 0 }}
                  >
                    {item.preview}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
