import React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, mono, sans } from "./theme";
import { Backdrop, Mark, Phone, Tag, Words, fadeInOut } from "./parts";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* 1. Hook — the phone rings while you're busy */
export const Hook: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ringing = (f > 4 && f < 52) || (f > 70 && f < 118);
  const shake = ringing ? Math.sin(f * 2.4) * 9 : 0;
  const enter = spring({ frame: f, fps, config: { damping: 16 } });
  return (
    <AbsoluteFill style={{ opacity: fadeInOut(f, dur, 1, 10) }}>
      <Backdrop glow="rgba(200,240,74,0.08)" />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 230 }}>
        <Words text="Your phone is ringing…" start={6} size={100} />
        <div style={{ height: 22 }} />
        <Words text="but you're with a client." start={62} size={84} color={C.dim} accent={["client"]} />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 170 }}>
        <div style={{ transform: `translateY(${(1 - enter) * 300}px) rotate(${shake * 0.4}deg) translateX(${shake}px)` }}>
          <Phone width={470}>
            <AbsoluteFill style={{ background: "linear-gradient(180deg,#1d2a1f,#0c0f12)", alignItems: "center", paddingTop: 170 }}>
              <div style={{ fontFamily: sans, color: C.dim, fontSize: 30 }}>Incoming call</div>
              <div style={{ fontFamily: sans, color: C.ink, fontSize: 52, fontWeight: 600, marginTop: 10 }}>New customer</div>
              <div style={{ fontFamily: mono, color: C.dim, fontSize: 26, marginTop: 10 }}>(555) 010-0123</div>
              <div style={{ position: "absolute", bottom: 120, display: "flex", gap: 150 }}>
                {[C.red, "#35c759"].map((c, i) => (
                  <div key={i} style={{ width: 110, height: 110, borderRadius: 99, background: c, boxShadow: ringing && i === 1 ? `0 0 0 ${8 + Math.abs(Math.sin(f * 0.3)) * 22}px rgba(53,199,89,0.25)` : "none" }} />
                ))}
              </div>
            </AbsoluteFill>
          </Phone>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* 2. Problem — missed calls pile up */
export const Problem: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const notes = [0, 10, 20, 30, 40];
  return (
    <AbsoluteFill style={{ opacity: fadeInOut(f, dur, 6, 10) }}>
      <Backdrop glow="rgba(255,77,94,0.10)" />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 260 }}>
        <Words text="Every missed call…" start={2} size={104} />
        <div style={{ height: 22 }} />
        <Words text="is a missed customer." start={42} size={104} accent={["customer"]} />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 260, gap: 22 }}>
        {notes.map((d, i) => {
          const s = spring({ frame: f - 8 - d, fps, config: { damping: 15, stiffness: 140 } });
          return (
            <div key={i} style={{ width: 820, padding: "26px 34px", borderRadius: 34, background: "rgba(22,27,33,0.92)", border: `1px solid ${C.line}`, display: "flex", alignItems: "center", gap: 26, opacity: s, transform: `translateY(${(1 - s) * 60}px) scale(${0.92 + s * 0.08})` }}>
              <div style={{ width: 70, height: 70, borderRadius: 20, background: C.red, display: "grid", placeItems: "center", color: "#fff", fontFamily: sans, fontWeight: 800, fontSize: 38 }}>✕</div>
              <div style={{ fontFamily: sans }}>
                <div style={{ color: C.ink, fontSize: 36, fontWeight: 600 }}>Missed call</div>
                <div style={{ color: C.dim, fontSize: 28 }}>{["Booking request", "New client", "Asking about prices", "Wants Friday", "Callback?"][i]} · {i * 3 + 2} min ago</div>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* 3. Reveal — Meet OnDuty */
export const Reveal: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const on = interpolate(f, [0, 22], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const word = spring({ frame: f - 10, fps, config: { damping: 14 } });
  const pulse = (f % 30) / 30;
  return (
    <AbsoluteFill style={{ opacity: fadeInOut(f, dur, 4, 8) }}>
      <Backdrop glow="rgba(200,240,74,0.22)" />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 40 }}>
        <Tag style={{ opacity: word }}>Meet</Tag>
        <Mark size={300} on={on} pulse={f > 22 ? pulse : 0} />
        <div style={{ fontFamily: sans, fontWeight: 800, fontSize: 170, letterSpacing: `${0.3 - word * 0.24}em`, color: C.ink, opacity: word, transform: `scale(${0.9 + word * 0.1})` }}>OnDuty</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* 4. Montage — real websites scrolling on phones */
const SITES = [
  { src: "footage/reem.mp4", label: "Barbershop" },
  { src: "footage/onduty.mp4", label: "Streetwear brand" },
  { src: "footage/lumen.mp4", label: "Skin studio" },
  { src: "footage/aurelle.mp4", label: "Med spa" },
  { src: "footage/meridian.mp4", label: "Wellness clinic" },
  { src: "footage/velvet.mp4", label: "Hair studio" },
];
export const Montage: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const per = Math.floor((dur - 10) / SITES.length);
  const i = Math.min(SITES.length - 1, Math.floor(Math.max(0, f - 10) / per));
  const title = spring({ frame: f, fps, config: { damping: 18 } });
  return (
    <AbsoluteFill style={{ opacity: fadeInOut(f, dur, 6, 10) }}>
      <Backdrop />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 150 }}>
        <div style={{ opacity: title, transform: `translateY(${(1 - title) * 30}px)` }}>
          <Words text="Cinematic websites" size={92} accent={["Cinematic"]} />
          <div style={{ fontFamily: sans, fontSize: 46, color: C.dim, textAlign: "center", marginTop: 14 }}>built for your business</div>
        </div>
      </AbsoluteFill>
      {SITES.map((s, k) => {
        const local = f - 10 - k * per;
        if (local < -12 || local > per + 12) return null;
        const inS = spring({ frame: local + 12, fps, config: { damping: 20, stiffness: 120 } });
        const out = interpolate(local, [per - 4, per + 12], [0, 1], clamp);
        const x = (1 - inS) * 900 - out * 900;
        const rot = (1 - inS) * 8 - out * 8;
        return (
          <AbsoluteFill key={k} style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 150 }}>
            <div style={{ transform: `translateX(${x}px) rotate(${rot}deg)` }}>
              <Phone width={560}>
                <Sequence from={10 + k * per - 12} layout="none">
                  <OffthreadVideo src={staticFile(s.src)} startFrom={14} playbackRate={1.45} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </Sequence>
              </Phone>
            </div>
          </AbsoluteFill>
        );
      })}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 70 }}>
        <div style={{ fontFamily: mono, fontSize: 30, letterSpacing: "0.2em", textTransform: "uppercase", color: C.bg, background: C.lime, padding: "12px 26px", borderRadius: 999 }}>{SITES[i].label}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* 5. Call — the AI receptionist books a real appointment */
export const LINES = [
  { who: "caller", at: 20, text: "Hi! Do you have anything open on Friday?", len: 78 },
  { who: "ai", at: 110, text: "I do! I have 2:00 or 4:30. Which works best for you?", len: 147 },
  { who: "caller", at: 270, text: "4:30's perfect.", len: 40 },
  { who: "ai", at: 322, text: "You're all set for Friday at 4:30. A confirmation is on its way!", len: 132 },
] as const;
export const CALL_BOOKED = 455;

export const Call: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const speaking = LINES.find((l) => f >= l.at && f < l.at + l.len);
  const booked = spring({ frame: f - CALL_BOOKED, fps, config: { damping: 13 } });
  const head = spring({ frame: f, fps, config: { damping: 18 } });
  return (
    <AbsoluteFill style={{ opacity: fadeInOut(f, dur, 6, 10) }}>
      <Backdrop />
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 100, opacity: head }}>
        <Tag>AI receptionist · live</Tag>
        <div style={{ height: 18 }} />
        <Words text="It talks. It books." size={96} accent={["books."]} start={2} />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 60 }}>
        <Phone width={700}>
          <AbsoluteFill style={{ background: "linear-gradient(180deg,#141a20,#0b0e11)", padding: "130px 34px 40px", fontFamily: sans }}>
            {/* agent orb */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, marginBottom: 30 }}>
              <div style={{ position: "relative", width: 200, height: 200, display: "grid", placeItems: "center" }}>
                {[0, 1, 2].map((r) => (
                  <div key={r} style={{ position: "absolute", inset: -r * 18, borderRadius: 999, border: `2px solid rgba(200,240,74,${speaking?.who === "ai" ? 0.45 - r * 0.13 : 0.12})`, transform: `scale(${speaking?.who === "ai" ? 1 + Math.sin(f * 0.35 + r) * 0.05 : 1})` }} />
                ))}
                <div style={{ width: 200, height: 200, borderRadius: 999, background: "radial-gradient(circle at 35% 30%, #e8ff9a, #8fbf12 70%)", display: "grid", placeItems: "center" }}>
                  <Mark size={120} color={C.bg} />
                </div>
              </div>
              <div style={{ color: C.ink, fontSize: 40, fontWeight: 600 }}>OnDuty Assistant</div>
              {/* waveform */}
              <div style={{ display: "flex", gap: 8, height: 70, alignItems: "center" }}>
                {Array.from({ length: 22 }).map((_, b) => {
                  const live = speaking ? 0.25 + Math.abs(Math.sin(f * 0.5 + b * 1.7) * Math.cos(f * 0.21 + b)) * 0.75 : 0.08;
                  return <div key={b} style={{ width: 10, height: 70 * live, borderRadius: 4, background: speaking?.who === "caller" ? C.ink : C.lime }} />;
                })}
              </div>
            </div>
            {/* transcript */}
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              {LINES.map((l, k) => {
                const s = spring({ frame: f - l.at, fps, config: { damping: 16 } });
                if (f < l.at) return null;
                const ai = l.who === "ai";
                return (
                  <div key={k} style={{ alignSelf: ai ? "flex-start" : "flex-end", maxWidth: "84%", padding: "18px 24px", borderRadius: 28, background: ai ? "rgba(200,240,74,0.14)" : "#2a313a", border: ai ? "1px solid rgba(200,240,74,0.4)" : "none", color: C.ink, fontSize: 38, lineHeight: 1.28, opacity: s, transform: `translateY(${(1 - s) * 30}px)` }}>
                    {l.text}
                  </div>
                );
              })}
            </div>
            {/* booking card */}
            {f >= CALL_BOOKED && (
              <div style={{ position: "absolute", left: 34, right: 34, bottom: 46, padding: "24px 28px", borderRadius: 30, background: C.lime, color: C.bg, display: "flex", alignItems: "center", gap: 22, transform: `translateY(${(1 - booked) * 160}px) scale(${0.9 + booked * 0.1})`, opacity: booked }}>
                <div style={{ width: 66, height: 66, borderRadius: 99, background: C.bg, color: C.lime, display: "grid", placeItems: "center", fontSize: 38, fontWeight: 800 }}>✓</div>
                <div>
                  <div style={{ fontSize: 40, fontWeight: 800 }}>Appointment booked</div>
                  <div style={{ fontSize: 30, fontWeight: 600 }}>Friday · 4:30 PM · confirmation sent</div>
                </div>
              </div>
            )}
          </AbsoluteFill>
        </Phone>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* 6. Features */
export const Features: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const items = [
    { t: "Answers questions", d: 2 },
    { t: "Books appointments", d: 36 },
    { t: "Never takes a day off", d: 70 },
  ];
  return (
    <AbsoluteFill style={{ opacity: fadeInOut(f, dur, 6, 10) }}>
      <Backdrop glow="rgba(200,240,74,0.14)" />
      <AbsoluteFill style={{ justifyContent: "center", padding: "0 110px", gap: 54 }}>
        <Tag>24 / 7 · on your website</Tag>
        {items.map((it, k) => {
          const s = spring({ frame: f - it.d, fps, config: { damping: 15 } });
          return (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 34, opacity: s, transform: `translateX(${(1 - s) * -80}px)` }}>
              <div style={{ width: 96, height: 96, borderRadius: 28, background: C.lime, color: C.bg, display: "grid", placeItems: "center", fontFamily: sans, fontSize: 56, fontWeight: 800, flex: "none" }}>✓</div>
              <div style={{ fontFamily: sans, fontWeight: 800, fontSize: 84, lineHeight: 1.02, color: C.ink, letterSpacing: "-0.02em" }}>{it.t}</div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* 7. CTA */
export const Cta: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame: f, fps, config: { damping: 14 } });
  const b = spring({ frame: f - 34, fps, config: { damping: 16 } });
  const c = spring({ frame: f - 130, fps, config: { damping: 16 } });
  const d = spring({ frame: f - 190, fps, config: { damping: 14 } });
  return (
    <AbsoluteFill style={{ opacity: fadeInOut(f, dur, 6, 24) }}>
      <Backdrop glow="rgba(200,240,74,0.22)" />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 34, padding: "0 90px" }}>
        <div style={{ transform: `scale(${0.7 + a * 0.3})`, opacity: a }}>
          <Mark size={240} pulse={(f % 36) / 36} />
        </div>
        <div style={{ fontFamily: sans, fontWeight: 800, fontSize: 160, color: C.ink, letterSpacing: "0.02em", opacity: a }}>OnDuty</div>
        <div style={{ fontFamily: sans, fontSize: 58, fontWeight: 600, color: C.dim, textAlign: "center", opacity: b, transform: `translateY(${(1 - b) * 24}px)` }}>
          Your business, <span style={{ color: C.lime }}>always on duty.</span>
        </div>
        <div style={{ height: 30 }} />
        <Tag style={{ opacity: c, color: C.ink }}>Live in two weeks or less</Tag>
        <div style={{ fontFamily: sans, fontWeight: 800, fontSize: 64, color: C.bg, background: C.lime, padding: "26px 56px", borderRadius: 999, opacity: d, transform: `scale(${0.85 + d * 0.15})`, boxShadow: "0 20px 60px rgba(200,240,74,0.35)" }}>
          ondutyagent.com
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
