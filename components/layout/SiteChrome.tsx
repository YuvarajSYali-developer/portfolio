"use client";

/**
 * Global micro-interactions: section progress bar, custom cursor (fine pointers
 * only) and back-to-top. Each is independent and degrades to nothing.
 */

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { ArrowUp } from "lucide-react";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/hooks";
import { scrollToSection } from "./Navbar";

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[55] h-[2px] origin-left bg-gradient-to-r from-electric via-cyan to-violet"
      style={{ scaleX }}
    />
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    const nearEnd = y > document.documentElement.scrollHeight - window.innerHeight * 1.9;
    const next = y > window.innerHeight * 4 && !nearEnd;
    setShow((s) => (s === next ? s : next));
  });
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={() => scrollToSection("home")}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.35 }}
          className="glass fixed bottom-5 right-5 z-40 grid size-11 place-items-center rounded-full text-fg-2 transition-colors hover:text-fg"
          aria-label="Back to top"
        >
          <ArrowUp className="size-4" aria-hidden />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const enabled = fine && !reduced;

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");
    let x = -100, y = -100, rx = -100, ry = -100, raf = 0, active = false, visible = false;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        rx = x;
        ry = y;
        dot.current?.style.setProperty("opacity", "1");
        ring.current?.style.setProperty("opacity", "1");
      }
      const t = e.target as Element | null;
      active = !!t?.closest("a,button,[role='button'],input,textarea,summary,label,.cursor-grab");
    };
    const onLeave = () => {
      visible = false;
      dot.current?.style.setProperty("opacity", "0");
      ring.current?.style.setProperty("opacity", "0");
    };
    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${active ? 1.7 : 1})`;
        ring.current.style.borderColor = active ? "rgba(50,214,229,0.7)" : "rgba(245,247,252,0.35)";
      }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);
    return () => {
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div ref={ring} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[80] size-8 rounded-full border opacity-0 transition-[opacity,scale,border-color] duration-300" style={{ borderColor: "rgba(245,247,252,0.35)" }} />
      <div ref={dot} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[80] size-1.5 rounded-full bg-fg opacity-0 transition-opacity duration-300" />
    </>
  );
}

export default function SiteChrome() {
  return (
    <>
      <ScrollProgress />
      <CustomCursor />
      <BackToTop />
    </>
  );
}
