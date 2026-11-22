/**
 * Aurora Background — inspired by the 21st.dev / Aceternity "Aurora Background".
 * Re-built as a fixed, compositor-only layer: two large blurred gradient fields
 * drifting via transform. No WebGL, no per-frame JS, paused under reduced motion.
 */

import { cn } from "@/lib/utils";

export function AuroraBackground({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink", className)}>
      <div
        className="absolute -left-[20%] -top-[30%] h-[80vmax] w-[80vmax] animate-aurora-a rounded-full opacity-[0.22] blur-[110px] will-change-transform"
        style={{ background: "radial-gradient(circle at 40% 40%, #628AFF 0%, transparent 62%)" }}
      />
      <div
        className="absolute -bottom-[35%] -right-[25%] h-[85vmax] w-[85vmax] animate-aurora-b rounded-full opacity-[0.18] blur-[120px] will-change-transform"
        style={{ background: "radial-gradient(circle at 50% 50%, #8B7AFF 0%, transparent 60%)" }}
      />
      <div
        className="absolute left-[30%] top-[40%] h-[40vmax] w-[40vmax] animate-aurora-a rounded-full opacity-[0.07] blur-[100px]"
        style={{ background: "radial-gradient(circle, #32D6E5 0%, transparent 60%)", animationDelay: "-12s" }}
      />
    </div>
  );
}
