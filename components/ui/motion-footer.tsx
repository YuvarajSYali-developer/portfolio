"use client";

/**
 * Motion Footer — based on the 21st.dev component by Hossain Jahed.
 * A curtain reveal: the page lifts away to uncover a footer pinned beneath it
 * (clip-path + sticky, no fixed positioning or scroll listeners), with the
 * oversized wordmark rising into place as it is revealed.
 */

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks";

interface MotionFooterProps {
  wordmark: string;
  children: ReactNode;
}

export function MotionFooter({ wordmark, children }: MotionFooterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["45%", "0%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [0, 0.4, 1]);
  const contentY = useTransform(scrollYProgress, [0, 1], [-60, 0]);

  return (
    <div
      ref={ref}
      className="relative [--fh:min(640px,92svh)]"
      style={{ height: "var(--fh)", clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="relative -top-[100svh]" style={{ height: "calc(100svh + var(--fh))" }}>
        <div className="sticky" style={{ top: "calc(100svh - var(--fh))", height: "var(--fh)" }}>
          <footer className="relative flex h-full flex-col overflow-hidden border-t border-line bg-ink-2">
            <div aria-hidden className="absolute inset-0 bg-grid opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
            <div aria-hidden className="absolute -bottom-40 left-1/2 h-80 w-[70%] -translate-x-1/2 rounded-full bg-electric/20 blur-[120px]" />
            <motion.div className="relative z-10 flex-1" style={reduced ? undefined : { y: contentY }}>
              {children}
            </motion.div>
            <div className="relative z-0 overflow-hidden px-3 pb-2" aria-hidden>
              <motion.p
                className="select-none whitespace-nowrap text-center font-display font-semibold leading-[0.8] tracking-[-0.05em] text-fg/90"
                style={{ fontSize: "clamp(3rem, 13.4vw, 14rem)", ...(reduced ? {} : { y, opacity }) }}
              >
                {wordmark}
              </motion.p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
