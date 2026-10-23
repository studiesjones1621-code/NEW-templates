import type React from "react"
import { Phone } from "lucide-react"
import { business, stats } from "@/lib/business"
import { ScrubScene } from "./scrub-scene"
import { TalkButton } from "./talk-button"
import { GavelHit } from "./gavel-hit"

/** Overlay timing on the scene's scroll progress: fades in over [inA, inB], out over [outA, outB]. */
const cue = (inA: number, inB: number, outA = 2, outB = 3) =>
  ({ ["--in-a" as string]: inA, ["--in-b" as string]: inB, ["--out-a" as string]: outA, ["--out-b" as string]: outB }) as React.CSSProperties

const eyebrow = "text-[11px] md:text-xs font-semibold uppercase tracking-[0.24em]"
const display = "font-display font-semibold tracking-tight leading-[0.95]"

/** One continuous move: a zoom into the real Mitchell Courthouse photo (Calvert St entrance), then through the doors into the courtroom. */
export function HeroScene() {
  return (
    <ScrubScene
      name="enter"
      frames={179}
      height="460svh"
      from={0.03}
      to={0.86}
      label="Moving from Baltimore's Mitchell Courthouse and Battle Monument, up the steps and into a wood-paneled courtroom"
      overlayClassName="scrim-left"
    >
      <div className="cue absolute inset-0 flex items-end md:items-center pb-24 md:pb-0" style={cue(-1, -0.5, 0.18, 0.28)}>
        <div className="container mx-auto px-5 md:px-10">
          <p className={`${eyebrow} text-ember`}>Criminal defense · {business.city}</p>
          <h1 className={`mt-4 ${display} text-[12vw] md:text-[clamp(3.4rem,min(7vw,12svh),7.5rem)] max-w-[12ch]`}>
            When it&apos;s your freedom, <span className="ember-text italic">bring a trial lawyer.</span>
          </h1>
          <p className="mt-5 max-w-md text-base md:text-lg text-white/80 leading-relaxed">
            Trial-tested defense in Baltimore courts for criminal charges, DUI, jailable traffic and probation violations. Scroll to step inside.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <TalkButton className="inline-flex items-center gap-2 rounded-full bg-ember text-ink px-6 py-3.5 text-sm font-bold hover:bg-ember-soft transition-colors">
              Talk to us now · 24/7
            </TalkButton>
            <a
              href={business.phoneHref}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3.5 text-sm font-semibold hover:border-ember transition-colors"
            >
              <Phone className="w-4 h-4" aria-hidden /> {business.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      <div className="cue absolute inset-x-0 bottom-0 pb-10 md:pb-14" style={cue(0.82, 0.92)}>
        <div className="container mx-auto px-5 md:px-10">
          <p className={`${eyebrow} text-ember`}>Inside the courtroom</p>
          <h2 className={`mt-3 ${display} text-5xl md:text-7xl max-w-[14ch]`}>
            This is where cases <span className="ember-text italic">are won.</span>
          </h2>
        </div>
      </div>
    </ScrubScene>
  )
}

/** The gavel comes down as you scroll; the firm's record lands with it. */
export function GavelScene() {
  return (
    <ScrubScene name="gavel" height="280svh" from={0.05} to={0.7} label="A judge's gavel striking the sound block in slow motion" overlayClassName="scrim-both">
      <GavelHit />
      <div className="cue absolute inset-x-0 top-24 md:top-28" style={cue(-1, -0.5, 0.25, 0.35)}>
        <div className="container mx-auto px-5 md:px-10">
          <p className={`${eyebrow} text-ember text-shade`}>Ready for trial</p>
          <h2 className={`mt-3 ${display} text-5xl md:text-7xl max-w-[12ch] text-shade`}>
            Prepared for <span className="text-ember italic">the verdict.</span>
          </h2>
        </div>
      </div>
      <div className="cue absolute inset-x-0 bottom-0 pb-10 md:pb-16" style={cue(0.62, 0.74)}>
        <div className="container mx-auto px-5 md:px-10">
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {stats.map((s, i) => (
              <div key={s.label} className="cue rounded-2xl border border-ember/30 bg-ink/75 px-4 py-4 md:px-5 md:py-5" style={cue(0.66 + i * 0.04, 0.74 + i * 0.04)}>
                <dt className="sr-only">{s.label}</dt>
                <dd className={`${display} text-4xl md:text-5xl ember-text`}>{s.value}</dd>
                <dd className="mt-1 text-xs md:text-sm text-white/75">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </ScrubScene>
  )
}

/** Late-night case prep: the work clients don't see. */
export function PrepScene() {
  return (
    <ScrubScene name="prep" frames={98} height="260svh" from={0.02} to={0.9} label="A lamp-lit attorney's desk with case files at night" overlayClassName="scrim-left">
      <div className="cue absolute inset-0 flex items-center" style={cue(0.2, 0.34)}>
        <div className="container mx-auto px-5 md:px-10 max-w-3xl md:ml-0">
          <p className={`${eyebrow} text-ember`}>Before court</p>
          <h2 className={`mt-3 ${display} text-5xl md:text-7xl max-w-[12ch]`}>
            The case is won <span className="ember-text italic">before trial.</span>
          </h2>
          <p className="mt-4 max-w-md text-base md:text-lg text-white/80 leading-relaxed">
            Police reports, body-cam, lab results, witness statements. We read every page, find the weak points and decide whether to
            negotiate or fight.
          </p>
        </div>
      </div>
    </ScrubScene>
  )
}

/** Sunrise over the Inner Harbor: back to your life. */
export function DawnScene() {
  return (
    <ScrubScene name="dawn" frames={77} height="260svh" from={0.02} to={0.9} label="Sunrise over Baltimore's Inner Harbor" overlayClassName="scrim-both">
      <div className="cue absolute inset-x-0 bottom-0 pb-14 md:pb-20" style={cue(0.35, 0.5)}>
        <div className="container mx-auto px-5 md:px-10">
          <p className={`${eyebrow} text-ember text-shade`}>Where we practice</p>
          <h2 className={`mt-3 ${display} text-5xl md:text-7xl max-w-[16ch] text-shade`}>
            Serving Baltimore City <span className="text-ember italic">&amp; Baltimore County.</span>
          </h2>
          <p className="mt-4 max-w-xl text-base md:text-lg text-white/85 leading-relaxed text-shade">
            District and Circuit Courts across Baltimore City and Baltimore County, from bail review to jury trial.
          </p>
          <TalkButton className="mt-7 inline-flex items-center gap-2 rounded-full bg-ember text-ink px-6 py-3.5 text-sm font-bold hover:bg-ember-soft transition-colors">
            Start a free consultation
          </TalkButton>
        </div>
      </div>
    </ScrubScene>
  )
}
