/**
 * Scientific visuals for the research section and experience timeline.
 * Pure SVG; motion comes from CSS animations that are disabled under
 * prefers-reduced-motion by the global stylesheet.
 */

import { seeded } from "@/lib/utils";
import type { ExperienceVisual } from "@/lib/portfolio-data";

const CHANNELS = ["Fp1", "Fp2", "F3", "F4", "C3", "C4", "P3", "P4", "O1", "O2"];

/** Periodic over 640px so two copies tile seamlessly while scrolling. */
function eegPath(seed: number, y0: number, amp: number) {
  const r = seeded(seed);
  const comps = Array.from({ length: 5 }, (_, i) => ({
    k: [3, 7, 13, 23, 41][i] + Math.floor(r() * 3),
    a: [1, 0.55, 0.35, 0.22, 0.12][i] * (0.7 + r() * 0.6),
    p: r() * Math.PI * 2,
  }));
  let d = "";
  for (let x = 0; x <= 1280; x += 4) {
    const v = comps.reduce((s, c) => s + c.a * Math.sin((x / 640) * Math.PI * 2 * c.k + c.p), 0);
    d += `${x === 0 ? "M" : "L"}${x},${(y0 + v * amp).toFixed(1)}`;
  }
  return d;
}

const PATHS = CHANNELS.map((_, i) => eegPath(100 + i, 30 + i * 34, 9));

export function EEGWaveform({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 370" className={className} role="img" aria-label="Stylised multichannel resting-state EEG waveforms">
      <defs>
        <linearGradient id="eegFade" x1="0" x2="1">
          <stop offset="0" stopColor="#10141D" stopOpacity="1" />
          <stop offset="0.12" stopColor="#10141D" stopOpacity="0" />
          <stop offset="0.88" stopColor="#10141D" stopOpacity="0" />
          <stop offset="1" stopColor="#10141D" stopOpacity="1" />
        </linearGradient>
        <clipPath id="eegClip">
          <rect x="44" y="0" width="596" height="370" />
        </clipPath>
      </defs>
      {CHANNELS.map((c, i) => (
        <g key={c}>
          <text x="8" y={34 + i * 34} fill="#747E91" fontSize="9.5" style={{ fontFamily: "var(--font-mono)" }}>
            {c}
          </text>
          <line x1="44" x2="640" y1={30 + i * 34} y2={30 + i * 34} stroke="rgba(255,255,255,0.04)" />
        </g>
      ))}
      <g clipPath="url(#eegClip)">
        <g className="animate-eeg">
          {PATHS.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke={i % 3 === 0 ? "#32D6E5" : i % 3 === 1 ? "#628AFF" : "#8B7AFF"}
              strokeOpacity={0.75}
              strokeWidth="1.1"
              transform="translate(44 0)"
            />
          ))}
        </g>
      </g>
      <rect x="44" width="596" height="370" fill="url(#eegFade)" />
    </svg>
  );
}

/* ───────────── Experience glyphs (visual direction per role) ───────────── */

export function ExperienceGlyph({ kind }: { kind: ExperienceVisual }) {
  const common = { viewBox: "0 0 200 120", className: "h-full w-full", "aria-hidden": true as const };
  if (kind === "logistics") {
    const hubs = [
      [30, 80], [70, 40], [110, 70], [150, 30], [175, 85], [90, 100],
    ];
    const routes = [[0, 1], [1, 2], [2, 3], [3, 4], [2, 4], [0, 5], [5, 2]];
    return (
      <svg {...common}>
        {routes.map(([a, b], i) => (
          <line key={i} x1={hubs[a][0]} y1={hubs[a][1]} x2={hubs[b][0]} y2={hubs[b][1]} stroke="#628AFF" strokeOpacity="0.5" strokeDasharray="3 5" className="animate-dash" style={{ animationDuration: `${1.4 + i * 0.2}s` }} />
        ))}
        {hubs.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === 2 ? 5 : 3} fill={i === 2 ? "#32D6E5" : "#628AFF"} />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={12 + i * 10} y={110 - (6 + i * 4)} width="6" height={6 + i * 4} rx="1" fill="#8B7AFF" fillOpacity="0.5" />
        ))}
      </svg>
    );
  }
  if (kind === "eeg") {
    return (
      <svg {...common}>
        {[0, 1, 2].map((i) => (
          <path key={i} d={eegPath(300 + i, 34 + i * 26, 8)} fill="none" stroke={["#32D6E5", "#628AFF", "#8B7AFF"][i]} strokeOpacity="0.8" strokeWidth="1" transform="scale(0.15625 1)" vectorEffect="non-scaling-stroke" />
        ))}
        <circle cx="168" cy="90" r="14" fill="none" stroke="#628AFF" strokeOpacity="0.5" />
        <circle cx="168" cy="90" r="4" fill="#32D6E5" />
      </svg>
    );
  }
  if (kind === "policy") {
    const r = seeded(77);
    return (
      <svg {...common}>
        {Array.from({ length: 12 }, (_, i) => {
          const h = 16 + r() * 70;
          return <rect key={i} x={14 + i * 15} y={108 - h} width="9" height={h} rx="2" fill={i === 7 ? "#32D6E5" : "#628AFF"} fillOpacity={i === 7 ? 0.9 : 0.35} />;
        })}
        <polyline points="18,70 48,58 78,64 108,40 138,46 168,26 190,30" fill="none" stroke="#8B7AFF" strokeWidth="1.5" />
      </svg>
    );
  }
  // smart city
  const r = seeded(55);
  return (
    <svg {...common}>
      {Array.from({ length: 18 }, (_, i) => {
        const x = 12 + (i % 6) * 30;
        const y = 12 + Math.floor(i / 6) * 34;
        const t = r();
        return <rect key={i} x={x} y={y} width="24" height="28" rx="3" fill={t > 0.6 ? "#32D6E5" : "#628AFF"} fillOpacity={0.12 + t * 0.3} stroke="rgba(255,255,255,0.08)" />;
      })}
      <circle cx="84" cy="58" r="4" fill="#32D6E5" className="animate-pulse-dot" style={{ transformOrigin: "84px 58px" }} />
      <circle cx="144" cy="24" r="4" fill="#8B7AFF" className="animate-pulse-dot" style={{ transformOrigin: "144px 24px", animationDelay: "0.6s" }} />
    </svg>
  );
}
