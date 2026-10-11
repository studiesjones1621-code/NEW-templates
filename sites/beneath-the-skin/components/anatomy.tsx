"use client"

import { useEffect, useRef } from "react"
import { TalkButton } from "./talk-button"

// Scroll-driven 3D exploded cross-section of skin. The scene itself lives in /public/anatomy.js (plain three.js
// from a CDN, no bundling) so the same file runs on the live site and in the static preview.
const steps = [
  { n: "01", title: "Epidermis", body: "The surface you see. Peels, dermaplaning, enzyme renewal and Hydra Glow clear and resurface it." },
  { n: "02", title: "Dermis", body: "Collagen and circulation. Microneedling with growth factors, SWICH and RF rebuild firmness from here." },
  { n: "03", title: "Hypodermis", body: "The cushion that shapes your face. Lift & Sculpt RF heat tightens and contours the structure above it." },
  { n: "04", title: "The root cause", body: "Hormones, gut health, inflammation. Functional lab testing finds why acne keeps coming back." },
]

export function Anatomy() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Download and parse three.js early, but only while the page is still (never mid-swipe), so there's no
    // hitch when you reach the section. The section getting close forces it as a fallback.
    let loaded = false
    let lastScroll = performance.now()
    let timer = 0
    const load = () => {
      if (loaded) return
      loaded = true
      cleanup()
      import(/* webpackIgnore: true */ "/anatomy.js" as string).then((m) => m.lazy?.(el)).catch(() => {})
    }
    const onScroll = () => (lastScroll = performance.now())
    const check = () => {
      if (performance.now() - lastScroll > 400) load()
      else timer = window.setTimeout(check, 250)
    }
    const io = new IntersectionObserver(([e]) => e.isIntersecting && load(), { rootMargin: "200% 0px" })
    const cleanup = () => {
      io.disconnect()
      clearTimeout(timer)
      window.removeEventListener("scroll", onScroll)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    io.observe(el)
    // Give the hero its intro animation (about 1.8s) to itself
    timer = window.setTimeout(check, 1800)
    return cleanup
  }, [])

  return (
    <section
      ref={ref}
      id="anatomy"
      data-anatomy
      data-module="/anatomy.js"
      className="anatomy-bg relative h-[320svh] text-[#f3ece0] motion-reduce:h-[160svh]"
    >
      <div data-anatomy-stage className="sticky top-0 h-[100svh] overflow-hidden">
        <canvas className="absolute inset-0 w-full h-full" aria-label="3D exploded cross-section of human skin" />
        <div className="anatomy-grid absolute inset-0 pointer-events-none" aria-hidden />
        <div data-anatomy-labels className="absolute inset-0 pointer-events-none" aria-hidden />

        <div className="absolute inset-x-0 bottom-0 lg:inset-y-0 lg:right-auto lg:w-[46%] flex flex-col justify-end lg:justify-center px-5 pb-28 lg:pb-0 lg:pl-[7vw] bg-gradient-to-t from-[#1a1411] via-[#1a1411]/90 to-transparent lg:bg-none">
          <p className="anatomy-mono text-[10px] md:text-[11px] tracking-[0.35em] uppercase text-[#e0bc98] mb-4">
            Every layer, every treatment
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-[clamp(2.4rem,7.5vh,3.75rem)] leading-[1.02] tracking-tight mb-6 lg:mb-[4vh] text-balance">
            Healing starts <span className="italic text-[#e0bc98]">beneath the skin.</span>
          </h2>
          <ol className="hidden sm:grid gap-5 lg:gap-[2.2vh] max-w-md">
            {steps.map((s, i) => (
              <li key={s.n} data-step={i + 1} className="anatomy-step">
                <p className="anatomy-mono text-[11px] tracking-[0.25em] text-[#e0bc98]">{s.n}</p>
                <p className="font-medium text-lg">{s.title}</p>
                <p className="anatomy-body text-sm text-[#f3ece0]/60 leading-relaxed">{s.body}</p>
              </li>
            ))}
          </ol>
          <ol className="sm:hidden anatomy-mobile-steps relative h-24">
            {steps.map((s, i) => (
              <li key={s.n} data-step={i + 1} className="anatomy-step absolute inset-0">
                <p className="anatomy-mono text-[11px] tracking-[0.25em] text-[#e0bc98]">{s.n} · {s.title}</p>
                <p className="text-sm text-[#f3ece0]/70 leading-relaxed mt-1">{s.body}</p>
              </li>
            ))}
          </ol>
          <div data-step="5" className="anatomy-cta mt-6 lg:mt-[3.5vh]">
            <TalkButton className="inline-flex items-center justify-center gap-2.5 bg-[#e0bc98] text-[#2a211c] font-medium px-7 py-4 text-sm tracking-wide hover:bg-[#ecd2b8] transition-colors">
              Book a skin assessment
            </TalkButton>
          </div>
        </div>

        <p className="anatomy-mono absolute top-24 right-5 lg:right-8 text-[10px] tracking-[0.3em] uppercase text-[#f3ece0]/40 text-right">
          Cross-section of human skin
          <br />
          Not to scale
        </p>
      </div>
    </section>
  )
}
