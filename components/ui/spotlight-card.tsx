"use client";

/**
 * Spotlight Card — based on the 21st.dev "spotlight-card" (GlowCard) by Hossain Jahed.
 * A pointer-tracked radial spotlight on the surface plus a glowing border that
 * follows the cursor. CSS-variable driven: no React re-renders on pointer move.
 */

import { useRef, type ReactNode, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  /** Glow colour (any CSS colour). */
  glow?: string;
  as?: "div" | "article" | "li";
  style?: CSSProperties;
}

export function SpotlightCard({ children, className, glow = "#628AFF", as: Tag = "div", style }: SpotlightCardProps) {
  const ref = useRef<HTMLElement>(null);

  const onPointerMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--sx", `${e.clientX - r.left}px`);
    el.style.setProperty("--sy", `${e.clientY - r.top}px`);
    el.style.setProperty("--so", "1");
  };
  const onPointerLeave = () => ref.current?.style.setProperty("--so", "0");

  return (
    <Tag
      ref={ref as never}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn("group/spot relative isolate overflow-hidden rounded-3xl border border-line bg-ink-2/80", className)}
      style={{ ["--glow" as string]: glow, ...style } as CSSProperties}
    >
      {/* surface spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-500"
        style={{
          opacity: "var(--so, 0)",
          background:
            "radial-gradient(520px circle at var(--sx, 50%) var(--sy, 50%), color-mix(in oklab, var(--glow) 13%, transparent), transparent 62%)",
        }}
      />
      {/* border glow (masked to the 1px ring) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] transition-opacity duration-500"
        style={{
          opacity: "var(--so, 0)",
          padding: 1,
          background:
            "radial-gradient(360px circle at var(--sx, 50%) var(--sy, 50%), color-mix(in oklab, var(--glow) 85%, white 10%), transparent 70%)",
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      {children}
    </Tag>
  );
}
