import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, mono, sans } from "./theme";

/** OnDuty radio-wave mark: a dot between two pairs of arcs. `on` 0..1 draws the arcs outward. */
export const Mark: React.FC<{ size: number; color?: string; on?: number; pulse?: number }> = ({ size, color = C.lime, on = 1, pulse = 0 }) => {
  const arc = (r: number, i: number) => {
    const k = Math.max(0, Math.min(1, on * 2 - i * 0.6))
    const len = Math.PI * r * (80 / 180)
    return (
      <>
        <path d={describe(50, 50, r, 140, 220)} stroke={color} strokeWidth={8} fill="none" strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - k)} />
        <path d={describe(50, 50, r, -40, 40)} stroke={color} strokeWidth={8} fill="none" strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - k)} />
      </>
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
      {pulse > 0 && <circle cx={50} cy={50} r={10 + pulse * 40} fill="none" stroke={color} strokeWidth={2} opacity={1 - pulse} />}
      <circle cx={50} cy={50} r={8 * Math.min(1, on * 3)} fill={color} />
      {arc(22, 0)}
      {arc(38, 1)}
    </svg>
  );
};
function describe(cx: number, cy: number, r: number, a0: number, a1: number) {
  const p = (a: number) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}`;
}

/** Faint lime grid like the OnDuty site, drifting slowly */
export const Backdrop: React.FC<{ glow?: string }> = ({ glow = "rgba(200,240,74,0.10)" }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(to right, rgba(200,240,74,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(200,240,74,0.06) 1px, transparent 1px)`,
          backgroundSize: "90px 90px",
          backgroundPosition: `0 ${(f * 0.6) % 90}px`,
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 45%, #000 30%, transparent 100%)",
        }}
      />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, ${glow}, transparent 60%)` }} />
    </AbsoluteFill>
  );
};

/** Big headline whose words rise in one after another */
export const Words: React.FC<{ text: string; start?: number; size?: number; color?: string; accent?: string[]; stagger?: number; weight?: number }> = ({
  text, start = 0, size = 96, color = C.ink, accent = [], stagger = 4, weight = 800,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ fontFamily: sans, fontWeight: weight, fontSize: size, lineHeight: 1.04, letterSpacing: "-0.02em", color, textAlign: "center", textWrap: "balance" }}>
      {text.split(" ").map((w, i) => {
        const s = spring({ frame: f - start - i * stagger, fps, config: { damping: 18, stiffness: 160 } });
        const clean = w.replace(/[.,…!?]/g, "");
        return (
          <span key={i} style={{ display: "inline-block", whiteSpace: "pre", opacity: s, transform: `translateY(${(1 - s) * 40}px)`, color: accent.includes(clean) ? C.lime : undefined }}>
            {w}{" "}
          </span>
        );
      })}
    </div>
  );
};

/** Small mono label */
export const Tag: React.FC<{ children: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({ children, color = C.lime, style }) => (
  <div style={{ fontFamily: mono, fontSize: 30, letterSpacing: "0.22em", textTransform: "uppercase", color, ...style }}>{children}</div>
);

/** iPhone-style frame */
export const Phone: React.FC<{ width: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ width, children, style }) => {
  const h = width * (844 / 390);
  const r = width * 0.13;
  return (
    <div style={{ width, height: h, borderRadius: r, padding: width * 0.035, background: "linear-gradient(145deg,#2a3038,#0b0d10)", boxShadow: "0 50px 120px rgba(0,0,0,0.65), 0 0 0 2px rgba(255,255,255,0.08) inset", ...style }}>
      <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: r * 0.8, overflow: "hidden", background: "#000" }}>
        {children}
        <div style={{ position: "absolute", top: width * 0.025, left: "50%", width: width * 0.3, height: width * 0.075, borderRadius: 999, background: "#000", transform: "translateX(-50%)" }} />
      </div>
    </div>
  );
};

export const fadeInOut = (f: number, dur: number, inF = 8, outF = 8) =>
  interpolate(f, [0, inF, dur - outF, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
