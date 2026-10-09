"use client"

import { useEffect, useRef, useState } from "react"
import { HighlightedText } from "./highlighted-text"

// Before-and-after photos published by Charm Medical Aesthetics on its own site.
const results = [
  { image: "/biz/ba-jaw.jpg", label: "Jawline & chin balancing", alt: "Before and after profile showing a more defined jawline and chin" },
  { image: "/biz/ba-front.jpg", label: "Mid-face volume restoration", alt: "Before and after front view showing restored cheek volume" },
  { image: "/biz/ba-profile.jpg", label: "Collagen & contour", alt: "Before and after profile showing smoother contours" },
  { image: "/biz/ba-undereye.jpg", label: "Under-eye correction", alt: "Before and after under-eye hollows softened" },
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
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-5">Real Results</p>
            <h2 className="text-5xl lg:text-6xl leading-[1.05] tracking-tight text-balance">
              Refreshed, <HighlightedText>never</HighlightedText> overdone.
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm">
            Every plan is built around your facial anatomy, for enhancement that still looks like you.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <figcaption className="mt-3 text-sm font-medium">{r.label}</figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-8 text-xs text-muted-foreground">Real Charm patients. Individual results vary.</p>
      </div>
    </section>
  )
}
