"use client"

import { useEffect, useRef } from "react"
import { TalkButton } from "./talk-button"

// Scroll-driven 3D exploded view of a filler syringe. The scene itself lives in /public/anatomy.js (plain
// three.js from a CDN, no bundling) so the same file runs on the live site and in the static preview.
const steps = [
  { n: "01", title: "Controlled press", body: "Slow, steady delivery. Every unit placed by a licensed nurse practitioner or RN." },
  { n: "02", title: "Hyaluronic acid gel", body: "A molecule your skin already makes. Most fillers blend in lidocaine for comfort." },
  { n: "03", title: "Sterile glass barrel", body: "Medical-grade, sterile and single-use. Precise markings, measured doses." },
  { n: "04", title: "Ultra-fine needle", body: "Tiny entry points, with topical numbing and distraction devices if you need them." },
]

export function Anatomy() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Fetch three.js only when the section is getting close, so it never slows the first scroll
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        import(/* webpackIgnore: true */ "/anatomy.js" as string).then((m) => m.lazy?.(el)).catch(() => {})
      },
      { rootMargin: "250% 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
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
        <canvas className="absolute inset-0 w-full h-full" aria-label="3D exploded view of a dermal filler syringe" />
        <div className="anatomy-grid absolute inset-0 pointer-events-none" aria-hidden />
        <div data-anatomy-labels className="absolute inset-0 pointer-events-none" aria-hidden />

        <div className="absolute inset-x-0 bottom-0 lg:inset-y-0 lg:right-auto lg:w-[46%] flex flex-col justify-end lg:justify-center px-5 pb-28 lg:pb-0 lg:pl-[7vw] bg-gradient-to-t from-[#111a16] via-[#111a16]/90 to-transparent lg:bg-none">
          <p className="anatomy-mono text-[10px] md:text-[11px] tracking-[0.35em] uppercase text-[#d6b77a] mb-4">
            Anatomy of a natural result
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-[clamp(2.4rem,7.5vh,3.75rem)] leading-[1.02] tracking-tight mb-6 lg:mb-[4vh] text-balance">
            Precision, down to <span className="italic text-[#d6b77a]">every detail.</span>
          </h2>
          <ol className="hidden sm:grid gap-5 lg:gap-[2.2vh] max-w-md">
            {steps.map((s, i) => (
              <li key={s.n} data-step={i + 1} className="anatomy-step">
                <p className="anatomy-mono text-[11px] tracking-[0.25em] text-[#d6b77a]">{s.n}</p>
                <p className="font-medium text-lg">{s.title}</p>
                <p className="anatomy-body text-sm text-[#f3ece0]/60 leading-relaxed">{s.body}</p>
              </li>
            ))}
          </ol>
          <ol className="sm:hidden anatomy-mobile-steps relative h-24">
            {steps.map((s, i) => (
              <li key={s.n} data-step={i + 1} className="anatomy-step absolute inset-0">
                <p className="anatomy-mono text-[11px] tracking-[0.25em] text-[#d6b77a]">{s.n} · {s.title}</p>
                <p className="text-sm text-[#f3ece0]/70 leading-relaxed mt-1">{s.body}</p>
              </li>
            ))}
          </ol>
          <div data-step="5" className="anatomy-cta mt-6 lg:mt-[3.5vh]">
            <TalkButton className="inline-flex items-center justify-center gap-2.5 bg-[#d6b77a] text-[#17241e] font-medium px-7 py-4 text-sm tracking-wide hover:bg-[#e7cf9f] transition-colors">
              Book a free consultation
            </TalkButton>
          </div>
        </div>

        <p className="anatomy-mono absolute top-24 right-5 lg:right-8 text-[10px] tracking-[0.3em] uppercase text-[#f3ece0]/40 text-right">
          Charm Medical Aesthetics
          <br />
          Rosedale · MD
        </p>
      </div>
    </section>
  )
}
