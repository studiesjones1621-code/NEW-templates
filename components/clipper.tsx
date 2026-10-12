"use client"

import { useEffect, useRef } from "react"
import { TalkButton } from "./talk-button"

// Scroll-driven 3D exploded view of Reem's clipper. The scene lives in /public/clipper.js (+ clipper-scene.js and
// clipper-worker.js: plain three.js from a CDN, drawn in a Web Worker where supported so it never slows scrolling).
const steps = [
  { n: "01", title: "Zero-gapped blades", body: "Set close to the skin for crisp line-ups and razor-sharp shape-ups. Shape-up, head & beard: $35." },
  { n: "02", title: "Taper lever", body: "Opens the blade a fraction at a time, so a fade blends from skin to length with no line. Economy Plus: $40." },
  { n: "03", title: "The motor", body: "Power to move through thick hair, twists and full beards without pulling. Business Class Experience: $50." },
  { n: "04", title: "The hands behind it", body: "Reem trained at Baltimore Beauty & Barber School, and clients rate him 4.8 from 25 Booksy reviews." },
]

export function Clipper() {
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
      import(/* webpackIgnore: true */ "/clipper.js" as string).then((m) => m.lazy?.(el)).catch(() => {})
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
      id="clipper"
      data-clipper
      data-module="/clipper.js"
      className="anatomy-bg relative h-[320svh] text-[#f5efe3] motion-reduce:h-[160svh]"
    >
      <div data-anatomy-stage className="sticky top-0 h-[100svh] overflow-hidden">
        <canvas className="absolute inset-0 w-full h-full" aria-label="3D exploded view of a cordless hair clipper" />
        <div className="anatomy-grid absolute inset-0 pointer-events-none" aria-hidden />
        <div data-anatomy-labels className="absolute inset-0 pointer-events-none" aria-hidden />

        <div className="absolute inset-x-0 bottom-0 lg:inset-y-0 lg:right-auto lg:w-[46%] flex flex-col justify-end lg:justify-center px-5 pb-28 lg:pb-0 lg:pl-[7vw] bg-gradient-to-t from-[#0d0c0a] via-[#0d0c0a]/90 to-transparent lg:bg-none">
          <p className="anatomy-mono text-[10px] md:text-[11px] tracking-[0.35em] uppercase text-[#d8b25a] mb-4">
            Inside the first class cut
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-[clamp(2.4rem,7.5vh,3.75rem)] leading-[1.02] tracking-tight mb-6 lg:mb-[4vh] text-balance">
            Precision, down to <span className="italic text-[#d8b25a]">the blade.</span>
          </h2>
          <ol className="hidden sm:grid gap-5 lg:gap-[2.2vh] max-w-md">
            {steps.map((s, i) => (
              <li key={s.n} data-step={i + 1} className="anatomy-step">
                <p className="anatomy-mono text-[11px] tracking-[0.25em] text-[#d8b25a]">{s.n}</p>
                <p className="font-medium text-lg">{s.title}</p>
                <p className="anatomy-body text-sm text-[#f5efe3]/60 leading-relaxed">{s.body}</p>
              </li>
            ))}
          </ol>
          <ol className="sm:hidden anatomy-mobile-steps relative h-24">
            {steps.map((s, i) => (
              <li key={s.n} data-step={i + 1} className="anatomy-step absolute inset-0">
                <p className="anatomy-mono text-[11px] tracking-[0.25em] text-[#d8b25a]">{s.n} · {s.title}</p>
                <p className="text-sm text-[#f5efe3]/70 leading-relaxed mt-1">{s.body}</p>
              </li>
            ))}
          </ol>
          <div data-step="5" className="anatomy-cta mt-6 lg:mt-[3.5vh]">
            <TalkButton className="inline-flex items-center justify-center gap-2.5 bg-[#d8b25a] text-[#141210] font-medium px-7 py-4 text-sm tracking-wide hover:bg-[#e6c77e] transition-colors">
              Book your seat
            </TalkButton>
          </div>
        </div>

        <p className="anatomy-mono absolute top-24 right-5 lg:right-8 text-[10px] tracking-[0.3em] uppercase text-[#f5efe3]/40 text-right">
          Modeled on Reem’s own clipper
          <br />
          Not to scale
        </p>
      </div>
    </section>
  )
}
