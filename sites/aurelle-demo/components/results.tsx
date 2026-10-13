"use client"

import { useEffect, useRef, useState } from "react"
import { HighlightedText } from "./highlighted-text"

// Concept demo: no patient photos. The section walks through the approach instead, illustrated with
// faceless, generated still lifes (never presented as real results).
const results = [
  {
    image: "/biz/approach-plan.jpg",
    label: "01 · Map & plan",
    body: "A free consult to study your proportions and agree a plan, before anything is injected.",
    alt: "A notebook with a pencil sketch of facial proportions, a gold pen and a hand mirror",
  },
  {
    image: "/biz/approach-treat.jpg",
    label: "02 · Gentle technique",
    body: "Numbing, cooling and small, measured doses. Comfort and precision come first.",
    alt: "A gloved hand lifting an ice roller from a bowl of crushed ice",
  },
  {
    image: "/biz/approach-aftercare.jpg",
    label: "03 · Aftercare & review",
    body: "Clear aftercare and a two-week check-in, so we can fine-tune if anything needs it.",
    alt: "An aftercare tray with a cooling eye mask, balm and a glass of water",
  },
]

export function Results() {
  const [visible, setVisible] = useState<number[]>([])
  const refs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setVisible((v) => [...new Set([...v, Number(e.target.getAttribute("data-index"))])])
        }),
      { threshold: 0.25 },
    )
    refs.current.forEach((r) => r && io.observe(r))
    return () => io.disconnect()
  }, [])

  return (
    <section id="results" className="py-24 md:py-32 bg-secondary/60">
      <div className="container mx-auto px-5 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-5">Our Approach</p>
            <h2 className="text-5xl lg:text-6xl leading-[1.05] tracking-tight text-balance">
              Refreshed, <HighlightedText>never</HighlightedText> overdone.
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm">
            Every plan is built around your facial anatomy, for enhancement that still looks like you.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 lg:gap-8">
          {results.map((r, i) => (
            <figure
              key={r.image}
              ref={(el) => {
                refs.current[i] = el
              }}
              data-index={i}
              className={`transition-all duration-700 ${visible.includes(i) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="overflow-hidden aspect-[4/5] bg-muted">
                <img src={r.image} alt={r.alt} loading="lazy" className="w-full h-full object-cover" />
              </div>
              <figcaption className="mt-4">
                <span className="block text-xs tracking-[0.25em] uppercase text-gold-deep mb-1.5">{r.label}</span>
                <span className="block text-sm text-muted-foreground leading-relaxed">{r.body}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-8 text-xs text-muted-foreground">Illustrative imagery for a concept demo. Individual results vary.</p>
      </div>
    </section>
  )
}
