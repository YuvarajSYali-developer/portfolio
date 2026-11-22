"use client";

/**
 * Cinematic interlude between sections: a full-bleed strip of the hero film,
 * cued to a different scene, that dissolves in and out of the page so moving
 * from one section to the next feels like a cut in a film.
 */

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { HERO_MEDIA } from "@/lib/constants";
import { usePrefersReducedMotion } from "@/lib/hooks";

interface InterludeProps {
  /** Second in the hero film to start from (scene cue). */
  startAt: number;
  poster: string;
  caption: string;
  lines: [string, string];
}

export default function Interlude({ startAt, poster, caption, lines }: InterludeProps) {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = usePrefersReducedMotion();
  const [failed, setFailed] = useState(false);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.18, 1]);
  const textY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const textOpacity = useTransform(scrollYProgress, [0.2, 0.45, 0.6, 0.85], [0, 1, 1, 0]);

  useEffect(() => {
    const el = ref.current;
    const v = videoRef.current;
    if (!el || !v || reduced) return;
    v.muted = true;
    const chosen = window.matchMedia("(max-width: 768px)").matches ? HERO_MEDIA.videoMobile : HERO_MEDIA.video;
    let cued = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!v.getAttribute("src")) v.src = chosen; // attach lazily, once
          if (!cued) {
            const cue = () => {
              v.currentTime = startAt;
              cued = true;
            };
            if (v.readyState >= 1) cue();
            else v.addEventListener("loadedmetadata", cue, { once: true });
          }
          v.play().catch(() => undefined);
        } else {
          v.pause();
        }
      },
      { rootMargin: "100px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      v.pause();
    };
  }, [reduced, startAt]);

  return (
    <section ref={ref} aria-label={`${lines[0]} ${lines[1]}`} className="relative h-[78svh] min-h-[460px] overflow-hidden">
      <motion.div className="absolute inset-0" style={reduced ? undefined : { scale }}>
        {reduced || failed ? (
          <Image src={poster} alt="" fill sizes="100vw" className="object-cover" />
        ) : (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            poster={poster}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
            onError={() => setFailed(true)}
          />
        )}
      </motion.div>
      {/* dissolve into the page above and below */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-ink via-ink/10 to-ink" />
      <div aria-hidden className="absolute inset-0 bg-ink/25" />

      <motion.div
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
        style={reduced ? undefined : { y: textY, opacity: textOpacity }}
      >
        <p className="eyebrow mb-6 text-fg-2">{caption}</p>
        <p className="font-display text-[clamp(2.2rem,6.4vw,5.6rem)] font-medium leading-[0.98] tracking-[-0.04em] text-fg">
          {lines[0]}
          <br />
          <span className="accent">{lines[1]}</span>
        </p>
      </motion.div>
    </section>
  );
}
