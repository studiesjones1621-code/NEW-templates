"use client"

import { useEffect, useRef, useState } from "react"
import { HighlightedText } from "./highlighted-text"

// Sample quotes written for this concept demo. Meridian is fictional, so these are not real reviews.
const quotes = [
  {
    quote:
      "Dana walked me through the whole process at my first visit and actually listened. The plan she built fits my schedule, not the other way around.",
    name: "Maria",
    source: "Weight loss program",
  },
  {
    quote:
      "I'd been told my labs were normal for years. Here we went through everything together, and for the first time it felt like someone was on my side.",
    name: "Janelle",
    source: "Hormone therapy",
  },
  {
    quote:
      "Friendly front desk, no rushing, and clear answers. I leave every check-in feeling encouraged.",
    name: "Chris",
    source: "Primary care",
  },
]

const themes = [
  "Being listened to, not rushed",
  "Realistic plans for real life",
  "Accountability without judgment",
  "Welcoming, friendly staff",
]

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
              Patients who feel <HighlightedText>heard</HighlightedText>
            </h2>

            <p className="inline-flex items-center gap-2 rounded-full border border-gold-deep/40 px-3 py-1 text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-10">
              Sample reviews — concept demo
            </p>

            <div>
              <p className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-4">What we want every patient to feel</p>
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
              src="/biz/renewed.jpg"
              alt="A field of sunflowers under a clear blue sky"
              loading="lazy"
              className="w-full max-w-md aspect-[4/3] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
