/**
 * Abstract, representative project visuals (pure SVG + CSS animation).
 * They intentionally show no real traffic, patients, games or citizens — only
 * illustrative structure. Replace any of them with a real screenshot by setting
 * `image` on the project in lib/portfolio-data.ts.
 */

import { useId } from "react";
import { seeded } from "@/lib/utils";
import type { ProjectVisual } from "@/lib/portfolio-data";

const C = {
  ink: "#080A10",
  ink2: "#10141D",
  surface: "#151B27",
  line: "rgba(255,255,255,0.08)",
  line2: "rgba(255,255,255,0.14)",
  blue: "#628AFF",
  cyan: "#32D6E5",
  violet: "#8B7AFF",
  fg: "#F5F7FC",
  fg2: "#A0A8B8",
  muted: "#747E91",
  warn: "#FFB86B",
  alert: "#FF6B8B",
};

const mono = { fontFamily: "var(--font-mono)", letterSpacing: "0.08em" } as const;

function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 640 400" className="h-full w-full" role="img" aria-label={label} preserveAspectRatio="xMidYMid meet">
      <defs>
        <pattern id={`g${uid}`} width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0H0V32" fill="none" stroke="rgba(255,255,255,0.035)" />
        </pattern>
        <radialGradient id={`r${uid}`} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#628AFF" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#080A10" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="640" height="400" fill={C.ink2} />
      <rect width="640" height="400" fill={`url(#g${uid})`} />
      <rect width="640" height="400" fill={`url(#r${uid})`} />
      {children}
    </svg>
  );
}

function Panel({ x, y, w, h, title }: { x: number; y: number; w: number; h: number; title?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="10" fill="rgba(8,10,16,0.72)" stroke={C.line2} />
      {title ? (
        <text x={x + 12} y={y + 20} fill={C.muted} fontSize="9" style={mono}>
          {title}
        </text>
      ) : null}
    </g>
  );
}

/* ───────────── 01 NetGuard Pro — SOC view ───────────── */

const netNodes = (() => {
  const r = seeded(11);
  return Array.from({ length: 15 }, (_, i) => ({ x: 40 + r() * 330, y: 70 + r() * 290, id: i }));
})();
const netEdges = (() => {
  const e: [number, number][] = [];
  netNodes.forEach((a, i) => {
    const near = netNodes
      .map((b, j) => ({ j, d: Math.hypot(a.x - b.x, a.y - b.y) }))
      .filter((n) => n.j !== i)
      .sort((p, q) => p.d - q.d)
      .slice(0, 2);
    near.forEach((n) => {
      if (!e.some(([p, q]) => (p === i && q === n.j) || (p === n.j && q === i))) e.push([i, n.j]);
    });
  });
  return e;
})();

export function NetGuardVisual() {
  const flagged = 6;
  const layers = ["XGBoost", "Random Forest", "Isolation Forest", "IQR", "Z-Score", "EWMA"];
  return (
    <Frame label="Illustrative security operations dashboard with network topology, detector layers and SHAP attributions">
      <text x="24" y="34" fill={C.fg} fontSize="12" style={mono}>NETGUARD // SOC</text>
      <circle cx="160" cy="30" r="3.5" fill={C.cyan} className="animate-pulse-dot" style={{ transformOrigin: "160px 30px" }} />
      <text x="170" y="34" fill={C.cyan} fontSize="9" style={mono}>MONITORING</text>
      <text x="616" y="34" fill={C.muted} fontSize="9" textAnchor="end" style={mono}>ILLUSTRATIVE · NOT LIVE DATA</text>

      {/* topology */}
      {netEdges.map(([a, b], i) => (
        <line
          key={i}
          x1={netNodes[a].x}
          y1={netNodes[a].y}
          x2={netNodes[b].x}
          y2={netNodes[b].y}
          stroke={a === flagged || b === flagged ? C.alert : C.blue}
          strokeOpacity={a === flagged || b === flagged ? 0.7 : 0.4}
          strokeWidth="1"
          strokeDasharray="4 8"
          className="animate-dash"
          style={{ animationDuration: `${1.2 + (i % 5) * 0.35}s` }}
        />
      ))}
      {netNodes.map((n) =>
        n.id === flagged ? (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r="16" fill="none" stroke={C.alert} strokeOpacity="0.5" className="animate-pulse-dot" style={{ transformOrigin: `${n.x}px ${n.y}px` }} />
            <circle cx={n.x} cy={n.y} r="6" fill={C.alert} />
            <text x={n.x + 14} y={n.y - 12} fill={C.alert} fontSize="8.5" style={mono}>ANOMALY</text>
          </g>
        ) : (
          <circle key={n.id} cx={n.x} cy={n.y} r={n.id % 4 === 0 ? 5 : 3.5} fill={n.id % 3 === 0 ? C.cyan : C.blue} />
        ),
      )}

      {/* detector layers */}
      <Panel x={398} y={56} w={218} h={150} title="ENSEMBLE · 6 DETECTOR LAYERS" />
      {layers.map((l, i) => (
        <g key={l}>
          <circle cx={414} cy={92 + i * 18} r="3" fill={i < 2 ? C.blue : C.violet} />
          <text x={424} y={95 + i * 18} fill={C.fg2} fontSize="9.5" style={mono}>{l}</text>
          <text x={604} y={95 + i * 18} fill={i < 2 ? C.blue : C.violet} fontSize="8" textAnchor="end" style={mono}>
            {i < 2 ? "SUPERVISED" : "UNSUPERVISED"}
          </text>
        </g>
      ))}

      {/* SHAP */}
      <Panel x={398} y={218} w={218} h={146} title="SHAP ATTRIBUTION · PER ALERT" />
      {[0.86, -0.52, 0.41, 0.27, -0.18].map((v, i) => (
        <g key={i}>
          <text x={414} y={256 + i * 21} fill={C.muted} fontSize="9" style={mono}>{`f${i + 1}`}</text>
          <line x1={507} y1={244} x2={507} y2={350} stroke={C.line2} />
          <rect
            x={v > 0 ? 507 : 507 + v * 80}
            y={248 + i * 21}
            width={Math.abs(v) * 80}
            height="10"
            rx="2"
            fill={v > 0 ? C.alert : C.cyan}
            fillOpacity="0.8"
          />
        </g>
      ))}
      <rect x="24" y="364" width="112" height="22" rx="11" fill="rgba(50,214,229,0.1)" stroke="rgba(50,214,229,0.35)" />
      <text x="80" y="379" fill={C.cyan} fontSize="9" textAnchor="middle" style={mono}>F1 95.21%</text>
      <rect x="144" y="364" width="118" height="22" rx="11" fill="rgba(98,138,255,0.1)" stroke="rgba(98,138,255,0.35)" />
      <text x="203" y="379" fill={C.blue} fontSize="9" textAnchor="middle" style={mono}>ROC-AUC 0.9668</text>
    </Frame>
  );
}

/* ───────────── 02 A-VITAL PRO — diagnostic core ───────────── */

export function AVitalVisual({ withCore = true }: { withCore?: boolean }) {
  const glowId = `core${useId().replace(/:/g, "")}`;
  const r = seeded(4);
  const orbit = Array.from({ length: 36 }, (_, i) => {
    const a = (i / 36) * Math.PI * 2;
    const rad = 70 + (i % 3) * 22 + r() * 6;
    return { x: 200 + Math.cos(a) * rad, y: 210 + Math.sin(a) * rad * 0.9 };
  });
  const probs = [0.71, 0.19, 0.06];
  return (
    <Frame label="Representative veterinary diagnostic interface with a neural core and top-3 probability distribution">
      <text x="24" y="34" fill={C.fg} fontSize="12" style={mono}>A-VITAL // DIAGNOSTIC CORE</text>
      <text x="616" y="34" fill={C.muted} fontSize="9" textAnchor="end" style={mono}>REPRESENTATIVE VISUAL</text>
      {withCore && (
        <g>
          <defs>
            <radialGradient id={glowId}>
              <stop offset="0%" stopColor="#8B7AFF" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#8B7AFF" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="200" cy="210" r="150" fill={`url(#${glowId})`} />
          {[124, 96, 68].map((rr, i) => (
            <ellipse key={rr} cx="200" cy="210" rx={rr} ry={rr * 0.9} fill="none" stroke={i === 1 ? C.violet : C.blue} strokeOpacity={0.25 + i * 0.1} strokeDasharray="2 6" className="animate-dash" style={{ animationDuration: `${3 + i}s` }} />
          ))}
          {orbit.map((p, i) => (
            <line key={`l${i}`} x1="200" y1="210" x2={p.x} y2={p.y} stroke={C.violet} strokeOpacity="0.12" />
          ))}
          {orbit.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={i % 5 === 0 ? 3.5 : 2} fill={i % 4 === 0 ? C.cyan : C.violet} />
          ))}
          <circle cx="200" cy="210" r="26" fill={C.violet} fillOpacity="0.25" className="animate-pulse-dot" style={{ transformOrigin: "200px 210px" }} />
          <circle cx="200" cy="210" r="12" fill={C.fg} fillOpacity="0.9" />
        </g>
      )}
      <Panel x={392} y={64} w={224} h={196} title="TOP-3 PROBABILISTIC INFERENCE" />
      {probs.map((p, i) => (
        <g key={i}>
          <text x={408} y={104 + i * 50} fill={C.fg2} fontSize="10" style={mono}>{`CANDIDATE ${i + 1}`}</text>
          <text x={600} y={104 + i * 50} fill={i === 0 ? C.violet : C.fg2} fontSize="10" textAnchor="end" style={mono}>
            {p.toFixed(2)}
          </text>
          <rect x={408} y={112 + i * 50} width={192} height="8" rx="4" fill="rgba(255,255,255,0.06)" />
          <rect x={408} y={112 + i * 50} width={192 * p} height="8" rx="4" fill={i === 0 ? C.violet : C.blue} fillOpacity={1 - i * 0.25} />
        </g>
      ))}
      <Panel x={392} y={272} w={108} h={92} />
      <text x={406} y={302} fill={C.fg} fontSize="20" style={{ fontFamily: "var(--font-display)" }}>8,000+</text>
      <text x={406} y={322} fill={C.muted} fontSize="8.5" style={mono}>CLINICAL RECORDS</text>
      <Panel x={508} y={272} w={108} h={92} />
      <text x={522} y={302} fill={C.fg} fontSize="20" style={{ fontFamily: "var(--font-display)" }}>20</text>
      <text x={522} y={322} fill={C.muted} fontSize="8.5" style={mono}>DISEASES</text>
      <text x="24" y="382" fill={C.muted} fontSize="8.5" style={mono}>CANDIDATE VALUES ARE ILLUSTRATIVE</text>
    </Frame>
  );
}

/* ───────────── 03 Chess-Guru — board heatmap ───────────── */

export function ChessVisual() {
  const r = seeded(21);
  const heat = Array.from({ length: 64 }, () => r());
  const pieces: Record<number, string> = { 4: "♚", 3: "♛", 0: "♜", 13: "♟", 12: "♟", 21: "♞", 26: "♝", 36: "♙", 43: "♘", 51: "♙", 52: "♙", 59: "♕", 60: "♔", 63: "♖" };
  const moves = [
    ["14.", "Nf3", "Qe7", 0.12],
    ["15.", "Bd3", "O-O", 0.08],
    ["16.", "Qc2", "h6?!", 0.46],
    ["17.", "Bh7+", "Kh8", 0.21],
    ["18.", "Ng5", "f6??", 0.83],
  ] as const;
  const s = 38;
  const evalPts = Array.from({ length: 24 }, (_, i) => {
    const v = Math.sin(i * 0.5) * 10 + (i > 17 ? (i - 17) * 7 : 0);
    return `${392 + i * 9.6},${342 - v}`;
  }).join(" ");
  return (
    <Frame label="Illustrative chessboard with an error-likelihood heatmap, move notation and evaluation graph">
      <g transform="translate(28 48)">
        {heat.map((h, i) => {
          const x = i % 8;
          const y = Math.floor(i / 8);
          const dark = (x + y) % 2 === 1;
          return (
            <g key={i}>
              <rect x={x * s} y={y * s} width={s} height={s} fill={dark ? "#1A2130" : "#252E40"} />
              {h > 0.62 && <rect x={x * s} y={y * s} width={s} height={s} fill={h > 0.86 ? C.alert : C.blue} fillOpacity={(h - 0.55) * 0.9} />}
              {pieces[i] && (
                <text x={x * s + s / 2} y={y * s + s * 0.72} textAnchor="middle" fontSize="24" fill={i > 32 ? C.fg : C.fg2} style={{ fontFamily: "serif" }}>
                  {pieces[i]}
                </text>
              )}
            </g>
          );
        })}
        <rect width={s * 8} height={s * 8} fill="none" stroke={C.line2} />
      </g>
      <Panel x={378} y={48} w={238} h={196} title="MOVE ANALYSIS · ERROR LIKELIHOOD" />
      {moves.map(([n, w, b, p], i) => (
        <g key={n}>
          <text x={394} y={88 + i * 31} fill={C.muted} fontSize="10" style={mono}>{n}</text>
          <text x={420} y={88 + i * 31} fill={C.fg} fontSize="10.5" style={mono}>{w}</text>
          <text x={470} y={88 + i * 31} fill={p > 0.4 ? (p > 0.7 ? C.alert : C.warn) : C.fg2} fontSize="10.5" style={mono}>{b}</text>
          <rect x={526} y={80 + i * 31} width={76} height="7" rx="3.5" fill="rgba(255,255,255,0.06)" />
          <rect x={526} y={80 + i * 31} width={76 * p} height="7" rx="3.5" fill={p > 0.7 ? C.alert : p > 0.4 ? C.warn : C.blue} />
        </g>
      ))}
      <Panel x={378} y={256} w={238} h={108} title="EVALUATION" />
      <line x1="392" y1="320" x2="604" y2="320" stroke={C.line2} strokeDasharray="2 4" />
      <polyline points={evalPts} fill="none" stroke={C.blue} strokeWidth="1.5" />
      <text x="28" y="378" fill={C.muted} fontSize="8.5" style={mono}>ILLUSTRATIVE POSITION</text>
    </Frame>
  );
}

/* ───────────── 04 CivilInc — civic dashboard ───────────── */

export function CivilIncVisual() {
  const r = seeded(9);
  const blocks = Array.from({ length: 42 }, (_, i) => ({
    x: 30 + (i % 7) * 48 + r() * 4,
    y: 60 + Math.floor(i / 7) * 48 + r() * 4,
    w: 36 + r() * 6,
    h: 36 + r() * 6,
    t: r(),
  }));
  const pins = [5, 11, 17, 23, 30, 38].map((i) => blocks[i]);
  return (
    <Frame label="Illustrative smart-city governance dashboard with ward map, grievance pins and department routing">
      <text x="24" y="34" fill={C.fg} fontSize="12" style={mono}>CIVILINC // CITY OVERVIEW</text>
      <text x="616" y="34" fill={C.muted} fontSize="9" textAnchor="end" style={mono}>ILLUSTRATIVE</text>
      {blocks.map((b, i) => (
        <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="4" fill={b.t > 0.7 ? C.blue : b.t > 0.45 ? C.cyan : "#1A2130"} fillOpacity={b.t > 0.45 ? 0.16 + (b.t - 0.45) * 0.4 : 1} stroke={C.line} />
      ))}
      <path d="M20 205 C120 190 200 240 360 214" stroke={C.cyan} strokeOpacity="0.5" strokeWidth="2" fill="none" strokeDasharray="6 6" className="animate-dash" />
      {pins.map((p, i) => (
        <g key={i}>
          <circle cx={p.x + p.w / 2} cy={p.y + p.h / 2} r="11" fill="none" stroke={i === 2 ? C.warn : C.cyan} strokeOpacity="0.5" className="animate-pulse-dot" style={{ transformOrigin: `${p.x + p.w / 2}px ${p.y + p.h / 2}px`, animationDelay: `${i * 0.3}s` }} />
          <circle cx={p.x + p.w / 2} cy={p.y + p.h / 2} r="4" fill={i === 2 ? C.warn : C.cyan} />
        </g>
      ))}
      <Panel x={392} y={56} w={224} h={128} title="GRIEVANCE PIPELINE" />
      {["Reported", "Routed to dept.", "In progress", "Resolved"].map((s, i) => (
        <g key={s}>
          <text x={408} y={92 + i * 23} fill={C.fg2} fontSize="9.5" style={mono}>{s.toUpperCase()}</text>
          <rect x={520} y={85 + i * 23} width={80} height="7" rx="3.5" fill="rgba(255,255,255,0.06)" />
          <rect x={520} y={85 + i * 23} width={80 * [0.9, 0.72, 0.45, 0.62][i]} height="7" rx="3.5" fill={[C.blue, C.violet, C.warn, C.cyan][i]} />
        </g>
      ))}
      <Panel x={392} y={196} w={224} h={168} title="DEPARTMENT COORDINATION" />
      {["Roads", "Water", "Power", "Sanitation"].map((d, i) => {
        const y = 236 + i * 32;
        return (
          <g key={d}>
            <rect x={408} y={y - 12} width={74} height={20} rx="10" fill="rgba(98,138,255,0.08)" stroke={C.line2} />
            <text x={445} y={y + 2} fill={C.fg2} fontSize="8.5" textAnchor="middle" style={mono}>{d.toUpperCase()}</text>
            <path d={`M482 ${y - 2} C 520 ${y - 2}, 530 286, 572 286`} stroke={C.blue} strokeOpacity="0.45" fill="none" strokeDasharray="3 5" className="animate-dash" />
          </g>
        );
      })}
      <circle cx="584" cy="286" r="14" fill="rgba(50,214,229,0.12)" stroke={C.cyan} />
      <text x="584" y="289" fill={C.cyan} fontSize="7.5" textAnchor="middle" style={mono}>HUB</text>
    </Frame>
  );
}

/* ───────────── 05 Smart Water Valve — system diagram ───────────── */

export function WaterVisual() {
  const nodes = [
    { x: 36, label: "FLOW / PRESSURE", sub: "Sensors" },
    { x: 156, label: "ARDUINO UNO", sub: "Controller" },
    { x: 276, label: "USB SERIAL", sub: "Protocol" },
    { x: 396, label: "FLASK API", sub: "Python backend" },
    { x: 516, label: "DASHBOARD", sub: "Monitoring" },
  ];
  return (
    <Frame label="Illustrative IoT system diagram: sensors, Arduino Uno, USB serial, Flask backend and monitoring dashboard">
      <text x="24" y="34" fill={C.fg} fontSize="12" style={mono}>VALVE CONTROL // SYSTEM</text>
      <text x="616" y="34" fill={C.muted} fontSize="9" textAnchor="end" style={mono}>ILLUSTRATIVE</text>
      {/* pipe */}
      <path d="M20 300 H250 M310 300 H620" stroke="#1E2738" strokeWidth="18" strokeLinecap="round" />
      <path d="M20 300 H250 M310 300 H620" stroke={C.cyan} strokeOpacity="0.55" strokeWidth="3" strokeDasharray="10 14" className="animate-dash" style={{ animationDuration: "0.9s" }} />
      {/* valve */}
      <g transform="translate(280 300)">
        <path d="M-30 -18 L30 18 L30 -18 L-30 18 Z" fill="rgba(98,138,255,0.18)" stroke={C.blue} strokeWidth="1.5" />
        <line x1="0" y1="0" x2="0" y2="-38" stroke={C.blue} strokeWidth="2" />
        <rect x="-16" y="-46" width="32" height="8" rx="3" fill={C.blue} />
        <text x="0" y="44" fill={C.cyan} fontSize="9" textAnchor="middle" style={mono}>VALVE · OPEN</text>
      </g>
      {/* data path */}
      {nodes.map((n, i) => (
        <g key={n.label}>
          <rect x={n.x} y={96} width={92} height={70} rx="10" fill="rgba(8,10,16,0.75)" stroke={i === 1 ? C.cyan : C.line2} />
          <text x={n.x + 46} y={126} fill={C.fg} fontSize="8.5" textAnchor="middle" style={mono}>{n.label}</text>
          <text x={n.x + 46} y={144} fill={C.muted} fontSize="8.5" textAnchor="middle">{n.sub}</text>
          {i < nodes.length - 1 && (
            <line x1={n.x + 92} y1={131} x2={n.x + 120} y2={131} stroke={C.blue} strokeWidth="1.5" strokeDasharray="3 4" className="animate-dash" />
          )}
        </g>
      ))}
      <path d="M82 166 V282" stroke={C.cyan} strokeOpacity="0.35" strokeDasharray="3 5" className="animate-dash" />
      <path d="M202 166 C202 230 280 220 280 254" stroke={C.blue} strokeOpacity="0.4" strokeDasharray="3 5" fill="none" className="animate-dash" />
      {/* alert engine */}
      <rect x="420" y="198" width="196" height="64" rx="10" fill="rgba(8,10,16,0.75)" stroke={C.line2} />
      <text x="434" y="218" fill={C.muted} fontSize="8.5" style={mono}>RULE-BASED ALERT ENGINE</text>
      {["USAGE", "PRESSURE", "MAINTENANCE"].map((a, i) => (
        <text key={a} x={[434, 476, 538][i]} y={244} fill={[C.warn, C.alert, C.cyan][i]} fontSize="8" style={mono}>
          {a}
        </text>
      ))}
      <rect x="24" y="356" width="118" height="22" rx="11" fill="rgba(50,214,229,0.1)" stroke="rgba(50,214,229,0.35)" />
      <text x="83" y="371" fill={C.cyan} fontSize="9" textAnchor="middle" style={mono}>99.9%+ UPTIME</text>
      <rect x="150" y="356" width="118" height="22" rx="11" fill="rgba(98,138,255,0.1)" stroke="rgba(98,138,255,0.35)" />
      <text x="209" y="371" fill={C.blue} fontSize="9" textAnchor="middle" style={mono}>&lt;100MS RESPONSE</text>
    </Frame>
  );
}

export const PROJECT_VISUALS: Record<ProjectVisual, () => React.ReactElement> = {
  netguard: NetGuardVisual,
  avital: () => <AVitalVisual />,
  chess: ChessVisual,
  civilinc: CivilIncVisual,
  water: WaterVisual,
};
