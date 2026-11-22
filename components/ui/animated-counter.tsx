"use client";

/**
 * Animated Counter — based on the 21st.dev component by Preet Suthar.
 * Server-renders the final value (crawlers / no-JS see real numbers), then
 * counts up once when scrolled into view. Respects reduced motion.
 */

import { useEffect, useRef } from "react";
import { animate, useInView } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({ value, decimals = 0, prefix = "", suffix = "", duration = 1.8, className }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduced = usePrefersReducedMotion();
  const started = useRef(false);

  const fmt = (n: number) =>
    `${prefix}${n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;

  // Reset to zero before the counter is seen (below the fold, so no visible flash).
  useEffect(() => {
    if (reduced || !ref.current || started.current) return;
    const rect = ref.current.getBoundingClientRect();
    if (rect.top > window.innerHeight) ref.current.textContent = fmt(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  useEffect(() => {
    if (!inView || reduced || started.current || !ref.current) return;
    started.current = true;
    const node = ref.current;
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        node.textContent = fmt(v);
      },
    });
    return () => {
      controls.stop();
      started.current = false; // Strict Mode re-runs effects; allow a clean restart
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced, value, duration]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {fmt(value)}
    </span>
  );
}
