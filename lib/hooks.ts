"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

function subscribeMedia(query: string) {
  return (cb: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", cb);
    return () => mql.removeEventListener("change", cb);
  };
}

/** Hydration-safe media query: the server snapshot is always `serverValue`. */
export function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    subscribeMedia(query),
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export const usePrefersReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");

export const useFinePointer = () => useMediaQuery("(hover: hover) and (pointer: fine)");

type NetInfo = EventTarget & { saveData?: boolean; effectiveType?: string };
const getConnection = () => (navigator as Navigator & { connection?: NetInfo }).connection;

/** True on data-saver or very slow connections — used to skip autoplay video. */
export function useConstrainedNetwork() {
  return useSyncExternalStore(
    (cb) => {
      const conn = getConnection();
      conn?.addEventListener?.("change", cb);
      return () => conn?.removeEventListener?.("change", cb);
    },
    () => {
      const conn = getConnection();
      if (!conn) return false;
      return Boolean(conn.saveData) || ["slow-2g", "2g"].includes(conn.effectiveType ?? "");
    },
    () => false,
  );
}

/** Tracks whether an element is within (or near) the viewport. */
export function useInView<T extends Element>(ref: React.RefObject<T | null>, rootMargin = "200px") {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return inView;
}
