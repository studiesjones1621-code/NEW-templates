import type React from "react"
import { Phone } from "lucide-react"
import { business, parts } from "@/lib/business"
import { ScrubScene } from "./scrub-scene"
import { TalkButton } from "./talk-button"

/** Overlay timing on the scene's scroll progress: fades in over [inA, inB], out over [outA, outB]. */
const cue = (inA: number, inB: number, outA = 2, outB = 3) =>
  ({ ["--in-a" as string]: inA, ["--in-b" as string]: inB, ["--out-a" as string]: outA, ["--out-b" as string]: outB }) as React.CSSProperties

const eyebrow = "text-[11px] md:text-xs font-semibold uppercase tracking-[0.22em]"

export function HeroScene() {
  return (
    <ScrubScene name="xray" height="380svh" from={0.04} to={0.7} label="An outdoor air conditioner turning into a glowing x-ray of its parts" overlayClassName="scrim-left">
      {/* Opening copy: visible at rest */}
      <div className="cue absolute inset-0 flex items-end md:items-center pb-24 md:pb-0" style={cue(-1, -0.5, 0.2, 0.3)}>
        <div className="container mx-auto px-5 md:px-10">
          <p className={`${eyebrow} text-ember-soft`}>Heating &amp; cooling · {business.city}</p>
          <h1 className="mt-4 font-display font-extrabold tracking-tight leading-[0.92] text-[13vw] md:text-[clamp(3.4rem,min(7vw,12svh),7.5rem)] max-w-[11ch]">
            Comfort, checked to the <span className="ember-text">coil.</span>
          </h1>
          <p className="mt-5 max-w-md text-base md:text-lg text-white/75 leading-relaxed">
            Repairs, tune-ups and new systems from techs who show you exactly what they found. Scroll to look inside.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <TalkButton className="inline-flex items-center gap-2 rounded-full bg-ember text-ink px-6 py-3.5 text-sm font-bold hover:bg-ember-soft transition-colors">
              Talk to us · 24/7
            </TalkButton>
            <a
              href={business.phoneHref}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3.5 text-sm font-semibold hover:border-ember transition-colors"
            >
              <Phone className="w-4 h-4" aria-hidden /> {business.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      {/* X-ray: every part, checked */}
      <div className="cue absolute inset-0 flex items-end md:items-center pb-10 md:pb-0" style={cue(0.62, 0.72)}>
        <div className="container mx-auto px-5 md:px-10 grid md:grid-cols-[1fr_auto] gap-6 items-end md:items-center w-full">
          <div>
            <p className={`${eyebrow} text-frost`}>The tune-up</p>
            <h2 className="mt-3 font-display font-extrabold tracking-tight text-5xl md:text-7xl leading-[0.92]">
              Every part, <span className="frost-text">checked.</span>
            </h2>
          </div>
          <ul className="grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-3 md:w-80">
            {parts.map((p, i) => (
              <li
                key={p.id}
                className="cue rounded-xl border border-frost/30 bg-ink/70 px-3 py-2.5 md:px-4 md:py-3"
                style={cue(0.7 + i * 0.04, 0.76 + i * 0.04)}
              >
                <p className="text-sm font-bold text-frost">{p.label}</p>
                <p className="text-xs text-white/65 leading-snug">{p.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ScrubScene>
  )
}

export function FlameScene() {
  return (
    <ScrubScene name="flame" height="260svh" from={0.02} to={0.85} label="Furnace burners lighting with blue flames" overlayClassName="scrim-bottom">
      <div className="cue absolute inset-x-0 bottom-0 pb-14 md:pb-20" style={cue(0.35, 0.5)}>
        <div className="container mx-auto px-5 md:px-10 max-w-3xl">
          <p className={`${eyebrow} text-ember-soft`}>Inside your furnace</p>
          <h2 className="mt-3 font-display font-extrabold tracking-tight text-5xl md:text-7xl leading-[0.92]">
            Blue flame. <span className="frost-text">Good sign.</span>
          </h2>
          <p className="mt-4 max-w-xl text-base md:text-lg text-white/75 leading-relaxed">
            A steady blue flame means clean burning. Yellow or flickering flames can mean poor combustion and carbon monoxide risk, so we
            check burners, the heat exchanger and venting on every visit.
          </p>
        </div>
      </div>
    </ScrubScene>
  )
}

export function AirflowScene() {
  return (
    <ScrubScene name="fly" height="400svh" from={0.02} to={0.86} label="Flying from outside the house, through the living room and down into the air ducts">
      <div className="cue absolute inset-x-0 top-24 md:top-28" style={cue(-1, -0.5, 0.12, 0.2)}>
        <div className="container mx-auto px-5 md:px-10">
          <p className={`${eyebrow} text-frost`}>Follow your heat</p>
          <h2 className="mt-3 font-display font-extrabold tracking-tight text-5xl md:text-7xl leading-[0.92] max-w-[12ch]">
            Ride the <span className="ember-text">airflow.</span>
          </h2>
        </div>
      </div>
      <div className="cue absolute inset-0 flex items-center bg-ink/30" style={cue(0.8, 0.9)}>
        <div className="container mx-auto px-5 md:px-10 max-w-3xl">
          <p className={`${eyebrow} text-ember-soft`}>Down in the ducts</p>
          <h2 className="mt-3 font-display font-extrabold tracking-tight text-5xl md:text-7xl leading-[0.92]">
            Up to 30% <span className="ember-text">never makes it.</span>
          </h2>
          <p className="mt-4 max-w-xl text-base md:text-lg text-white/80 leading-relaxed">
            In a typical house, about 20 to 30 percent of the air moving through the ducts is lost to leaks, holes and loose joints
            (ENERGY STAR). We find the leaks and seal them.
          </p>
          <TalkButton className="mt-6 inline-flex items-center gap-2 rounded-full bg-ember text-ink px-6 py-3.5 text-sm font-bold hover:bg-ember-soft transition-colors">
            Ask about duct sealing
          </TalkButton>
        </div>
      </div>
    </ScrubScene>
  )
}
