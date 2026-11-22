/**
 * Bento Grid — based on the 21st.dev / Aceternity UI component by Manu Arora.
 * Asymmetric grid; each tile has a header visual, label, title and description,
 * with the original's signature hover nudge on the text block.
 */

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function BentoGrid({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("mx-auto grid grid-cols-1 gap-3 sm:grid-cols-2 md:auto-rows-[15.5rem] md:grid-cols-3 md:gap-4", className)}>
      {children}
    </div>
  );
}

export function BentoGridItem({
  className,
  label,
  title,
  description,
  header,
  icon,
}: {
  className?: string;
  label?: string;
  title?: ReactNode;
  description?: ReactNode;
  header?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "group/bento relative flex min-h-[13rem] flex-col justify-between overflow-hidden rounded-2xl border border-line bg-ink-2/70 p-5 transition-[border-color,background-color] duration-500 hover:border-line-strong hover:bg-ink-2",
        className,
      )}
    >
      {/* soft top-edge highlight that appears on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-electric/60 to-transparent opacity-0 transition-opacity duration-500 group-hover/bento:opacity-100"
      />
      {header ? <div className="relative flex-1">{header}</div> : null}
      <div className="relative mt-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/bento:translate-x-1.5">
        <div className="mb-2 flex items-center gap-2">
          {icon}
          {label ? <span className="eyebrow text-[0.65rem]">{label}</span> : null}
        </div>
        {title ? <div className="font-display text-lg font-medium leading-snug text-fg md:text-xl">{title}</div> : null}
        {description ? <div className="mt-1.5 text-sm leading-relaxed text-fg-2">{description}</div> : null}
      </div>
    </div>
  );
}
