"use client";

/**
 * Interactive Icon Cloud — based on the 21st.dev / Magic UI component by Dillion Verma.
 * Re-implemented without runtime CDN fetches or a canvas dependency: logos come
 * from the locally bundled `simple-icons` package and are laid out on a
 * Fibonacci sphere that auto-rotates and can be dragged. The loop only runs
 * while visible and stops entirely for reduced-motion users.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import {
  siArduino, siCplusplus, siDocker, siExpress, siFastapi, siFlask, siGit, siHuggingface, siJavascript,
  siNextdotjs, siNodedotjs, siNumpy, siPandas, siPyg, siPython, siPytorch, siRailway, siReact, siRender,
  siScikitlearn, siShadcnui, siSqlalchemy, siSqlite, siTailwindcss, siTensorflow,
  type SimpleIcon,
} from "simple-icons";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const ICONS: Record<string, SimpleIcon> = {
  arduino: siArduino, cplusplus: siCplusplus, docker: siDocker, express: siExpress, fastapi: siFastapi,
  flask: siFlask, git: siGit, huggingface: siHuggingface, javascript: siJavascript, nextdotjs: siNextdotjs,
  nodedotjs: siNodedotjs, numpy: siNumpy, pandas: siPandas, pyg: siPyg, python: siPython, pytorch: siPytorch,
  railway: siRailway, react: siReact, render: siRender, scikitlearn: siScikitlearn, shadcnui: siShadcnui,
  sqlalchemy: siSqlalchemy, sqlite: siSqlite, tailwindcss: siTailwindcss, tensorflow: siTensorflow,
};

/** Keep brand colour but guarantee contrast on the dark background. */
function displayColor(hex: string) {
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  if (lum < 0.2) return "#E6EAF5";
  return `#${hex}`;
}

function fibonacciSphere(n: number) {
  const pts: [number, number, number][] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = phi * i;
    pts.push([Math.cos(t) * r, y, Math.sin(t) * r]);
  }
  return pts;
}

export function InteractiveIconCloud({ slugs, className }: { slugs: readonly string[]; className?: string }) {
  const icons = useMemo(() => slugs.map((s) => ICONS[s]).filter(Boolean), [slugs]);
  const points = useMemo(() => fibonacciSphere(icons.length), [icons.length]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reduced = usePrefersReducedMotion();
  const [hovered, setHovered] = useState<number | null>(null);
  const hoveredRef = useRef<number | null>(null);
  useEffect(() => {
    hoveredRef.current = hovered;
  }, [hovered]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    let size = wrap.clientWidth;
    let raf = 0;
    let visible = false;
    let ax = -0.35; // rotation around X
    let ay = 0.4; // rotation around Y
    let vx = 0;
    let vy = reduced ? 0 : 0.0032;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const render = () => {
      const R = size * 0.38;
      const cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
      points.forEach(([x, y, z], i) => {
        const x1 = x * cy + z * sy;
        const z1 = -x * sy + z * cy;
        const y2 = y * cx - z1 * sx;
        const z2 = y * sx + z1 * cx;
        const depth = (z2 + 1) / 2; // 0 back → 1 front
        const scale = 0.55 + depth * 0.65;
        const el = itemRefs.current[i];
        if (!el) return;
        const isHover = hoveredRef.current === i;
        el.style.transform = `translate3d(${x1 * R}px, ${y2 * R}px, 0) translate(-50%, -50%) scale(${isHover ? scale * 1.25 : scale})`;
        el.style.opacity = String(isHover ? 1 : 0.18 + depth * 0.72);
        el.style.zIndex = String(Math.round(depth * 100));
        el.style.filter = depth < 0.35 ? "blur(0.6px)" : "none";
      });
    };

    const tick = () => {
      if (!dragging) {
        ay += vy;
        ax += vx;
        // ease drag momentum back to a gentle idle spin
        vx *= 0.95;
        vy += ((reduced ? 0 : 0.0032) - vy) * 0.02;
      }
      render();
      if (visible && !reduced) raf = requestAnimationFrame(tick);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (!reduced) raf = requestAnimationFrame(tick);
    };

    const ro = new ResizeObserver(() => {
      size = wrap.clientWidth;
      render();
    });
    ro.observe(wrap);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else cancelAnimationFrame(raf);
    });
    io.observe(wrap);

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      wrap.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      ay += dx * 0.006;
      ax -= dy * 0.006;
      vy = dx * 0.0012;
      vx = -dy * 0.0012;
      if (reduced) render();
    };
    const onUp = (e: PointerEvent) => {
      dragging = false;
      if (wrap.hasPointerCapture(e.pointerId)) wrap.releasePointerCapture(e.pointerId);
    };
    wrap.addEventListener("pointerdown", onDown);
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerup", onUp);
    wrap.addEventListener("pointercancel", onUp);

    render();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      wrap.removeEventListener("pointerdown", onDown);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerup", onUp);
      wrap.removeEventListener("pointercancel", onUp);
    };
  }, [points, reduced]);

  const label = `Rotating cloud of technology logos: ${icons.map((i) => i.title).join(", ")}`;

  return (
    <div
      ref={wrapRef}
      role="img"
      aria-label={label}
      className={cn("relative aspect-square w-full touch-pan-y select-none cursor-grab active:cursor-grabbing", className)}
    >
      <div className="absolute left-1/2 top-1/2">
        {icons.map((icon, i) => {
          const color = displayColor(icon.hex);
          return (
            <div
              key={icon.slug}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="absolute left-0 top-0 will-change-transform"
              style={{ transform: "translate(-50%, -50%) scale(0.8)", opacity: 0.6 }}
              onPointerEnter={() => setHovered(i)}
              onPointerLeave={() => setHovered((h) => (h === i ? null : h))}
              aria-hidden
            >
              <div className="grid size-12 place-items-center rounded-2xl border border-line bg-ink-2/80 backdrop-blur-sm sm:size-14">
                <svg viewBox="0 0 24 24" className="size-6 sm:size-7" fill={color} aria-hidden>
                  <path d={icon.path} />
                </svg>
              </div>
              <span
                className={cn(
                  "pointer-events-none absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-surface px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-wider text-fg transition-opacity",
                  hovered === i ? "opacity-100" : "opacity-0",
                )}
              >
                {icon.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
