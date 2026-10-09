"use client"

import { useEffect, useRef, useState } from "react"
import { Star } from "lucide-react"
import { HighlightedText } from "./highlighted-text"
import { locations } from "@/lib/business"

// The verbatim client review published on charmmedicalaesthetics.com. Google review text wasn't available to
// quote, so the topics reviewers mention most are shown as themes, not quotes.
const quotes = [
  {
    quote:
      "Olga is amazing. She takes time explaining every step of the process making sure you understand and are comfortable the whole appointment. Very professional personnel, beautiful clean office, and convenient location. I cannot recommend Olga enough. If you are thinking about visiting her, DO IT!!",
    name: "Abby L.",
    source: "Client review",
  },
]

const themes = ["Natural-looking Botox", "Gentle, skilled injections", "Clear communication", "Easy parking"]

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

            <div className="flex flex-wrap gap-x-10 gap-y-6 mb-10">
              {locations.map((l) => (
                <div key={l.id} className="inline-flex items-center gap-4">
                  <span className="font-serif text-6xl font-medium tracking-tight">{l.rating.toFixed(1)}</span>
                  <span>
                    <span className="flex text-gold-deep mb-1" aria-hidden>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {l.reviewCount} Google reviews
                    </span>
                  </span>
                </div>
              ))}
            </div>

            <div>
              <p className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-4">What clients mention most</p>
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
              src="/biz/olga-standing.jpg"
              alt="Olga Lannon in the Charm Medical Aesthetics studio hallway"
              loading="lazy"
              className="w-full max-w-md aspect-[4/5] object-cover object-top"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
