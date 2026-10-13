import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile } from "remotion";
import { Call, CALL_BOOKED, Cta, Features, Hook, LINES, Montage, Problem, Reveal } from "./scenes";
import { sans } from "./theme";

// Scene timeline (frames at 30fps). Voice lines are placed on the same absolute timeline.
export const T = {
  hook: { from: 0, dur: 172 },
  problem: { from: 172, dur: 120 },
  reveal: { from: 292, dur: 68 },
  montage: { from: 360, dur: 290 },
  call: { from: 650, dur: 500 },
  features: { from: 1150, dur: 145 },
  cta: { from: 1295, dur: 305 },
};
export const TOTAL = T.cta.from + T.cta.dur;

const VO = [
  { src: "audio/vo1.wav", at: 8 },
  { src: "audio/vo2.wav", at: T.problem.from + 6 },
  { src: "audio/vo3.wav", at: T.reveal.from + 8 },
  { src: "audio/vo4.wav", at: T.montage.from + 8 },
  ...LINES.map((l, i) => ({ src: `audio/${["c1", "a1", "c2", "a2"][i]}.wav`, at: T.call.from + l.at })),
  { src: "audio/vo5.wav", at: T.features.from + 6 },
  { src: "audio/vo6.wav", at: T.cta.from + 5 },
];

export const OnDutyAd: React.FC = () => {
  const dialogue = [T.call.from + 10, T.call.from + CALL_BOOKED + 10];
  return (
    <AbsoluteFill style={{ background: "#0d1014", fontFamily: sans }}>
      <Sequence name="Hook" from={T.hook.from} durationInFrames={T.hook.dur}><Hook dur={T.hook.dur} /></Sequence>
      <Sequence name="Problem" from={T.problem.from} durationInFrames={T.problem.dur}><Problem dur={T.problem.dur} /></Sequence>
      <Sequence name="Reveal" from={T.reveal.from} durationInFrames={T.reveal.dur}><Reveal dur={T.reveal.dur} /></Sequence>
      <Sequence name="Montage" from={T.montage.from} durationInFrames={T.montage.dur}><Montage dur={T.montage.dur} /></Sequence>
      <Sequence name="Call" from={T.call.from} durationInFrames={T.call.dur}><Call dur={T.call.dur} /></Sequence>
      <Sequence name="Features" from={T.features.from} durationInFrames={T.features.dur}><Features dur={T.features.dur} /></Sequence>
      <Sequence name="CTA" from={T.cta.from} durationInFrames={T.cta.dur}><Cta dur={T.cta.dur} /></Sequence>

      {/* Music: "Never Play" by EchoBeats (Pixabay Content License). Ducked under the voices, a bit lower during the call. */}
      <Audio
        src={staticFile("audio/music.mp3")}
        volume={(f) =>
          interpolate(f, [0, 20, dialogue[0], dialogue[0] + 15, dialogue[1], dialogue[1] + 20, TOTAL - 50, TOTAL], [0, 0.2, 0.2, 0.09, 0.09, 0.22, 0.22, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
        }
      />
      <Sequence name="Ring" from={2} durationInFrames={150}><Audio src={staticFile("audio/ring.wav")} volume={0.32} /></Sequence>
      <Sequence name="Booked chime" from={T.call.from + CALL_BOOKED} durationInFrames={40}><Audio src={staticFile("audio/chime.wav")} volume={0.6} /></Sequence>
      {VO.map((v) => (
        <Sequence key={v.src} name={v.src.replace("audio/", "")} from={v.at} durationInFrames={330}>
          <Audio src={staticFile(v.src)} volume={1} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
