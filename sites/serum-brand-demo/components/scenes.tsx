import type React from "react"
import { product, stats } from "@/lib/business"
import { ScrubScene } from "./scrub-scene"
import { TalkButton } from "./talk-button"
import { AddToBag } from "./shop"

/** Overlay timing on the scene's scroll progress: fades in over [inA, inB], out over [outA, outB]. */
const cue = (inA: number, inB: number, outA = 2, outB = 3) =>
  ({ ["--in-a" as string]: inA, ["--in-b" as string]: inB, ["--out-a" as string]: outA, ["--out-b" as string]: outB }) as React.CSSProperties

const eyebrow = "text-[11px] md:text-xs font-semibold uppercase tracking-[0.24em]"
const display = "font-display font-semibold tracking-tight leading-[0.95]"

/** Blood orange and sea buckthorn berries rain down and settle around the amber bottle. */
export function HeroScene() {
  return (
    <ScrubScene
      name="bottle"
      height="380svh"
      from={0.03}
      to={0.85}
      label="An amber dropper bottle on orange as a blood orange half and sea buckthorn berries fall and settle around it"
      overlayClassName="scrim-left"
    >
      <div className="cue absolute inset-0 flex items-end md:items-center pb-24 md:pb-0" style={cue(-1, -0.5, 0.2, 0.3)}>
        <div className="container mx-auto px-5 md:px-10">
          <p className={`${eyebrow} text-ember`}>New · {product.name}</p>
          <h1 className={`mt-4 ${display} text-[15vw] md:text-[clamp(3.8rem,min(8vw,14svh),8.5rem)] max-w-[10ch]`}>
            Golden hour, <span className="ember-text italic">in a bottle.</span>
          </h1>
          <p className="mt-5 max-w-sm text-base md:text-lg text-foreground/80 leading-relaxed">
            A vitamin C serum made with sea buckthorn and saffron for brighter, more even-looking skin. Scroll to see what&apos;s inside.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#shop" className="inline-flex items-center gap-2 rounded-full bg-ink text-primary-foreground px-6 py-3.5 text-sm font-bold hover:bg-ember transition-colors">
              Shop the serum · from ${product.sizes[0].price}
            </a>
            <TalkButton className="inline-flex items-center gap-2 rounded-full border border-ink/25 bg-card/60 px-5 py-3.5 text-sm font-semibold hover:border-ember transition-colors">
              Ask our skincare advisor
            </TalkButton>
          </div>
        </div>
      </div>

      <div className="cue absolute inset-x-0 bottom-0 pb-10 md:pb-14" style={cue(0.8, 0.9)}>
        <div className="container mx-auto px-5 md:px-10">
          <p className={`${eyebrow} text-ember`}>The whole fruit, the whole glow</p>
          <h2 className={`mt-3 ${display} text-5xl md:text-7xl max-w-[13ch]`}>
            Blood orange <span className="ember-text italic">&amp; sea buckthorn.</span>
          </h2>
          <AddToBag className="mt-6" />
        </div>
      </div>
    </ScrubScene>
  )
}

/** One drop falls into the serum and ripples out; the formula's numbers land with it. */
export function DropScene() {
  return (
    <ScrubScene name="drop" height="300svh" from={0.04} to={0.8} label="A golden drop of serum falling from a glass dropper into a pool and rippling outward" overlayClassName="scrim-both">
      <div className="cue absolute inset-x-0 top-24 md:top-28" style={cue(-1, -0.5, 0.3, 0.4)}>
        <div className="container mx-auto px-5 md:px-10">
          <p className={`${eyebrow} text-ember text-shade`}>The formula</p>
          <h2 className={`mt-3 ${display} text-5xl md:text-7xl max-w-[12ch] text-shade`}>
            Three drops. <span className="ember-text italic">That&apos;s the ritual.</span>
          </h2>
        </div>
      </div>
      <div className="cue absolute inset-x-0 bottom-0 pb-10 md:pb-16" style={cue(0.55, 0.66)}>
        <div className="container mx-auto px-5 md:px-10">
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {stats.map((s, i) => (
              <div key={s.label} className="cue rounded-2xl bg-card/85 ring-1 ring-ember/25 px-4 py-4 md:px-5 md:py-5 backdrop-blur-sm" style={cue(0.58 + i * 0.04, 0.66 + i * 0.04)}>
                <dt className="sr-only">{s.label}</dt>
                <dd className={`${display} text-4xl md:text-5xl ember-text`}>{s.value}</dd>
                <dd className="mt-1 text-xs md:text-sm text-foreground/75">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </ScrubScene>
  )
}

/** A fingertip smooths two drops into the cheek until they disappear. */
export function SkinScene() {
  return (
    <ScrubScene name="skin" height="280svh" from={0.03} to={0.88} label="A fingertip smoothing two golden drops of serum into the skin of a cheek" overlayClassName="scrim-left">
      <div className="cue absolute inset-0 flex items-center" style={cue(0.12, 0.26)}>
        <div className="container mx-auto px-5 md:px-10">
          <p className={`${eyebrow} text-ember text-shade`}>Texture</p>
          <h2 className={`mt-3 ${display} text-5xl md:text-7xl max-w-[11ch] text-shade`}>
            Sinks in clear. <span className="ember-text italic">Nothing sticky.</span>
          </h2>
          <p className="mt-4 max-w-sm text-base md:text-lg text-foreground/80 leading-relaxed text-shade">
            The orange is sea buckthorn oil. Smooth it in and it&apos;s gone, leaving soft skin that&apos;s ready for moisturizer or makeup.
          </p>
        </div>
      </div>
    </ScrubScene>
  )
}

/** Simulated illustration: uneven spots fade to an even tone as you scroll. */
export function GlowScene() {
  return (
    <ScrubScene name="glow" height="280svh" from={0.05} to={0.9} label="A close-up of a cheek where dark spots gradually fade to a more even tone (simulated illustration)" overlayClassName="scrim-bottom">
      <div className="cue absolute inset-x-0 bottom-0 pb-14 md:pb-20" style={cue(0.4, 0.55)}>
        <div className="container mx-auto px-5 md:px-10">
          <p className={`${eyebrow} text-ember text-shade`}>With daily use</p>
          <h2 className={`mt-3 ${display} text-5xl md:text-7xl max-w-[14ch] text-shade`}>
            Brighter, <span className="ember-text italic">more even-looking</span> skin.
          </h2>
          <p className="mt-4 max-w-xl text-base md:text-lg text-foreground/80 leading-relaxed text-shade">
            Vitamin C works over weeks, not overnight. Use it every day, wear sunscreen, and let it build.
          </p>
          <p className="mt-3 text-xs text-foreground/60 text-shade">Simulated illustration, not a clinical result. Individual results vary.</p>
        </div>
      </div>
    </ScrubScene>
  )
}
