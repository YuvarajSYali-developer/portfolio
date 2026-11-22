"use client";

/**
 * Text Reveal — based on the 21st.dev / Magic UI component by Dillion Verma.
 * Words brighten one by one as the passage scrolls through the viewport.
 * Adapted to run in-flow (no extra 200vh sticky track) so long passages stay
 * readable, and to support multiple paragraphs and reduced motion.
 */

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/hooks";

interface TextRevealProps {
  paragraphs: readonly string[];
  className?: string;
  paragraphClassName?: string;
  /** Words to tint with the accent gradient once revealed. */
  highlight?: readonly string[];
}

export function TextReveal({ paragraphs, className, paragraphClassName, highlight = [] }: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.82", "end 0.42"] });

  const words = paragraphs.map((p) => p.split(" "));
  const total = words.reduce((n, w) => n + w.length, 0);
  // global word offset for the start of each paragraph
  const offsets = words.map((_, pi) => words.slice(0, pi).reduce((n, w) => n + w.length, 0));

  return (
    <div ref={ref} className={cn("space-y-6", className)}>
      {words.map((paraWords, pi) => (
        <p key={pi} className={cn("flex flex-wrap", paragraphClassName)}>
          {paraWords.map((word, wi) => {
            const start = (offsets[pi] + wi) / total;
            const end = start + 1 / total;
            const accent = highlight.some((h) => word.replace(/[.,]/g, "").startsWith(h));
            return (
              <Word key={`${pi}-${wi}`} progress={scrollYProgress} range={[start, end]} reduced={reduced} accent={accent}>
                {word}
              </Word>
            );
          })}
        </p>
      ))}
    </div>
  );
}

function Word({
  children,
  progress,
  range,
  reduced,
  accent,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  reduced: boolean;
  accent: boolean;
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <span className="relative mr-[0.27em] mt-[0.12em]">
      <motion.span
        style={reduced ? undefined : { opacity }}
        className={cn(accent ? "accent" : "text-fg")}
      >
        {children}
      </motion.span>
    </span>
  );
}
