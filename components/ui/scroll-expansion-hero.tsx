"use client";

/**
 * ScrollExpandMedia — based on the 21st.dev "scroll-expansion-hero" by @arunachalam (MIT).
 *
 * Same visual contract as the original: a small centred media frame that expands to
 * fill the viewport as you scroll, split title halves that travel in opposite
 * directions, a background image that dissolves, and content that fades in once
 * the media is fully expanded.
 *
 * What changed vs. the original implementation:
 * - No global wheel/touch interception and no `preventDefault` on window scroll.
 *   The effect is driven by native scrolling over a tall, section-scoped sticky
 *   container, so touch, keyboard, scrollbar, trackpad momentum and backward
 *   scrolling all work and the visitor can never be trapped at the top.
 * - Sizes are CSS-driven (`--e` = expansion 0..1), so there is no measurement,
 *   no layout thrash and no SSR/hydration mismatch.
 * - Strict-Mode safe: effects are idempotent and fully cleaned up.
 * - Video: muted/autoplay/loop/playsInline, play() rejection handled, paused when
 *   off-screen, poster fallback on error, data-saver, or reduced motion.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";
import { useConstrainedNetwork, usePrefersReducedMotion } from "@/lib/hooks";

export interface ScrollExpandMediaProps {
  id?: string;
  mediaType?: "video" | "image";
  mediaSrc: string;
  /** Lighter video for small screens. */
  mobileMediaSrc?: string;
  posterSrc?: string;
  bgImageSrc: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  /** Total scroll distance of the intro, in viewport heights. */
  scrollLength?: number;
  /** Accessible description of the media. */
  mediaAlt?: string;
  onExpandedChange?: (expanded: boolean) => void;
  /** Revealed over the expanded media. */
  children?: ReactNode;
  /** Optional element rendered in the bottom corner (e.g. skip link). */
  cornerSlot?: ReactNode;
}

const EXPAND_END = 0.62; // fraction of the section's scroll where media is fully expanded
const REVEAL_START = 0.64;
const REVEAL_END = 0.82;

export default function ScrollExpandMedia({
  id,
  mediaType = "video",
  mediaSrc,
  mobileMediaSrc,
  posterSrc,
  bgImageSrc,
  title = "",
  date,
  scrollToExpand,
  textBlend = false,
  scrollLength = 175,
  mediaAlt = "",
  onExpandedChange,
  children,
  cornerSlot,
}: ScrollExpandMediaProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const constrained = useConstrainedNetwork();
  const [videoFailed, setVideoFailed] = useState(false);
  // The poster is the first thing painted (LCP); the video is attached after load.
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const isStatic = reducedMotion;
  const showVideo = mediaType === "video" && !videoFailed && !constrained;

  /* ── Scroll progression (section-scoped, native scroll) ── */
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 340, damping: 44, mass: 0.22, restDelta: 0.0005 });

  const e = useTransform(progress, [0, EXPAND_END], [0, 1], { clamp: true });
  const reveal = useTransform(progress, [REVEAL_START, REVEAL_END], [0, 1], { clamp: true });

  const leftX = useTransform(e, [0, 1], ["0vw", "-62vw"]);
  const rightX = useTransform(e, [0, 1], ["0vw", "62vw"]);
  const metaLeftX = useTransform(e, [0, 1], ["0vw", "-48vw"]);
  const metaRightX = useTransform(e, [0, 1], ["0vw", "48vw"]);
  const titleOpacity = useTransform(e, [0.55, 0.95], [1, 0]);
  const bgOpacity = useTransform(e, [0, 0.9], [1, 0]);
  const overlayOpacity = useTransform(e, [0, 1], [0.5, 0.18]);
  const hintOpacity = useTransform(progress, [0, 0.06], [1, 0]);
  const revealY = useTransform(reveal, [0, 1], [28, 0]);
  const shadeOpacity = useTransform(reveal, [0, 1], [0, 1]);

  useMotionValueEvent(progress, "change", (v) => {
    const next = v >= REVEAL_START;
    setExpanded((prev) => (prev === next ? prev : next));
  });

  useEffect(() => {
    onExpandedChange?.(isStatic ? true : expanded);
  }, [expanded, isStatic, onExpandedChange]);

  /* ── Attach the video source only after the page has loaded ── */
  useEffect(() => {
    if (!showVideo) return;
    const pick = () =>
      setVideoSrc(mobileMediaSrc && window.matchMedia("(max-width: 768px)").matches ? mobileMediaSrc : mediaSrc);
    let timer = 0;
    const schedule = () => {
      timer = window.setTimeout(pick, 150);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("load", schedule);
    };
  }, [showVideo, mediaSrc, mobileMediaSrc]);

  /* ── Video lifecycle: autoplay with graceful rejection, pause off-screen ── */
  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section || !showVideo || !videoSrc) return;
    video.muted = true; // React doesn't always reflect the muted attribute

    const tryPlay = () => {
      const p = video.play();
      if (p && typeof p.catch === "function") p.catch(() => undefined); // autoplay blocked → poster remains
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) tryPlay();
        else video.pause();
      },
      { threshold: 0 },
    );
    io.observe(section);
    return () => {
      io.disconnect();
      video.pause();
    };
  }, [showVideo, videoSrc]);

  const [firstWord, ...restWords] = title.split(" ");
  const restOfTitle = restWords.join(" ");

  const media = showVideo ? (
    <>
    {posterSrc ? (
      <Image src={posterSrc} alt="" fill preload sizes="95vw" className="object-cover" aria-hidden />
    ) : null}
    <video
      ref={videoRef}
      className={cn("absolute inset-px h-[calc(100%-2px)] w-[calc(100%-2px)] object-cover transition-opacity duration-700", playing ? "opacity-100" : "opacity-0")}
      src={videoSrc ?? undefined}
      onPlaying={() => setPlaying(true)}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      disablePictureInPicture
      aria-hidden={mediaAlt ? undefined : true}
      aria-label={mediaAlt || undefined}
      onError={() => setVideoFailed(true)}
    />
    </>
  ) : (
    <Image
      src={mediaType === "image" ? mediaSrc : (posterSrc ?? bgImageSrc)}
      alt={mediaAlt}
      fill
      preload
      sizes="95vw"
      className="object-cover"
    />
  );

  /* ── Reduced-motion: a static, full-bleed version of the same composition ── */
  if (isStatic) {
    return (
      <section id={id} ref={sectionRef} aria-label="Introduction" className="relative h-[100svh] min-h-[560px] overflow-hidden bg-ink">
        <div className="absolute inset-0">{media}</div>
        <div className="absolute inset-0 bg-ink/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <h1 className="font-display text-[clamp(2.6rem,9vw,7.5rem)] font-semibold leading-none tracking-[-0.04em] text-fg">
            {title}
          </h1>
          {children ? <div className="mt-10 w-full">{children}</div> : null}
        </div>
        {cornerSlot}
      </section>
    );
  }

  return (
    <section
      id={id}
      ref={sectionRef}
      aria-label="Introduction"
      className="relative bg-ink"
      style={{ height: `${scrollLength}vh` }}
    >
      <motion.div
        className="sticky top-0 h-[100svh] min-h-[560px] w-full overflow-hidden"
        style={{ ["--e" as string]: e }}
      >
        {/* Background plate that dissolves as the media grows */}
        <motion.div className="absolute inset-0" style={{ opacity: bgOpacity }} aria-hidden>
          <Image src={bgImageSrc} alt="" fill preload sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-ink/35" />
          <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        </motion.div>

        {/* Media frame */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="relative overflow-hidden border border-line-strong shadow-[0_0_80px_rgba(98,138,255,0.18)] will-change-[width,height]"
            style={{
              width: "calc(min(360px, 72vw) + (95vw - min(360px, 72vw)) * var(--e))",
              height: "calc(min(460px, 56svh) + (86svh - min(460px, 56svh)) * var(--e))",
              borderRadius: "calc(22px - 8px * var(--e))",
            }}
          >
            {media}
            <motion.div className="absolute inset-0 bg-ink" style={{ opacity: overlayOpacity }} aria-hidden />
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/45 to-ink/10"
              style={{ opacity: shadeOpacity }}
              aria-hidden
            />
          </div>
        </div>

        {/* Split title — halves travel in opposite directions */}
        <motion.div
          className={cn(
            "pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 px-4 text-center",
            textBlend && "mix-blend-difference",
          )}
          style={{ opacity: titleOpacity }}
        >
          <h1 className="font-display text-[clamp(2.75rem,11vw,9.5rem)] font-semibold leading-[0.88] tracking-[-0.045em] text-fg">
            <motion.span className="block" style={{ x: leftX }}>
              {firstWord}
            </motion.span>
            <motion.span className="block accent" style={{ x: rightX }}>
              {restOfTitle}
            </motion.span>
          </h1>
        </motion.div>

        {/* Meta lines under the frame, also travelling apart */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[max(6svh,2.5rem)] z-10 flex flex-col items-center gap-3 px-4 text-center">
          {date ? (
            <motion.p className="eyebrow text-fg-2" style={{ x: metaLeftX, opacity: titleOpacity }}>
              {date}
            </motion.p>
          ) : null}
          {scrollToExpand ? (
            <motion.p className="eyebrow text-cyan" style={{ x: metaRightX, opacity: hintOpacity }}>
              {scrollToExpand}
            </motion.p>
          ) : null}
        </div>

        {/* Content revealed once fully expanded */}
        {children ? (
          <motion.div
            className="absolute inset-0 z-20 flex items-center justify-center px-5"
            style={{ opacity: reveal, y: revealY, pointerEvents: expanded ? "auto" : "none" }}
            inert={!expanded}
          >
            {children}
          </motion.div>
        ) : null}

        {cornerSlot ? (
          <motion.div style={{ opacity: hintOpacity }} inert={expanded}>
            {cornerSlot}
          </motion.div>
        ) : null}
      </motion.div>
    </section>
  );
}
