"use client"

import { useEffect, useRef, useState } from "react"
import { HighlightedText } from "./highlighted-text"

// Concept demo: these are clearly-labelled SAMPLE quotes written for a fictional business, not real reviews.
const quotes = [
  {
    quote:
      "Nadia explained every step and never rushed me. My lips look like mine, just a little fuller. Exactly what I asked for.",
    name: "Jess",
    source: "Sample review",
  },
  {
    quote: "I was nervous about Botox looking frozen. Three weeks later people just say I look rested.",
    name: "Priya",
    source: "Sample review",
  },
  {
    quote: "The assistant on the website answered all my questions at 11pm and the clinic called me back the next morning.",
    name: "Dana",
    source: "Sample review",
  },
]

const themes = ["Natural-looking results", "Gentle, unhurried injections", "Clear communication", "Easy follow-up"]

export function Testimonials() {
  const [visible, setVisible] = useState<number[]>([])
  const refs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setVisible((v) => [...new Set([...v, Number(e.target.getAttribute("data-index"))])])
        }),
      { threshold: 0.3 },
    )
    refs.current.forEach((r) => r && io.observe(r))
    return () => io.disconnect()
  }, [])

  return (
    <section id="reviews" className="py-24 md:py-32 bg-secondary/60">
      <div className="container mx-auto px-5 md:px-12">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-24">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-5">Testimonials</p>
            <h2 className="text-5xl md:text-6xl leading-[1.05] tracking-tight mb-8 text-balance lg:text-7xl">
              Clients who <HighlightedText>glow</HighlightedText>
            </h2>

            <p className="inline-flex items-center rounded-full border border-gold/50 px-3 py-1 text-xs tracking-[0.2em] uppercase text-muted-foreground mb-10">
              Sample reviews · concept demo
            </p>

            <div>
              <p className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-4">What clients would mention most</p>
              <ul className="flex flex-wrap gap-2">
                {themes.map((t) => (
                  <li key={t} className="px-4 py-2 text-sm border border-gold/40 bg-background/60">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-14 lg:pt-24">
            {quotes.map((item, index) => (
              <figure
                key={item.name}
                ref={(el) => {
                  refs.current[index] = el
                }}
                data-index={index}
                className={`transition-all duration-700 ${
                  visible.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                <span className="block font-serif text-gold text-7xl leading-none h-10" aria-hidden>
                  &ldquo;
                </span>
                <blockquote className="font-serif text-2xl md:text-3xl leading-snug mb-5">{item.quote}</blockquote>
                <figcaption className="text-sm text-muted-foreground">
                  <span className="text-foreground font-medium">{item.name}</span> · {item.source}
                </figcaption>
              </figure>
            ))}
            <img
              src="/biz/clinic-room.jpg"
              alt="A calm, sunlit treatment suite with a cream treatment chair"
              loading="lazy"
              className="w-full max-w-md aspect-[4/5] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
