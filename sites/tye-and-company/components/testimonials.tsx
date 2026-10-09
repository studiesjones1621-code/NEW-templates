"use client"

import { useEffect, useRef, useState } from "react"
import { Star } from "lucide-react"
import { HighlightedText } from "./highlighted-text"
import { business } from "@/lib/business"

// Only verbatim, attributable quotes go here. Review text found online for this studio is limited, so the
// recurring points clients make are listed separately as themes, not as quotes.
const quotes = [
  {
    quote: "I went to Ms. Tye today to get my hair done. I came out her shop looking like a different woman.",
    name: "Cynthia",
    source: "Client review",
  },
  {
    quote:
      "Every woman deserves to feel confident and beautiful in her own skin, starting with her crowning glory.",
    name: "Ms. Tye Bailey",
    source: "From her letter to clients",
  },
]

const themes = [
  "She listens, and makes you feel heard",
  "Explains how to care for your hair",
  "Keeps up with the latest trends",
  "Welcoming, clean and calm",
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
              Women who walk out <HighlightedText>new</HighlightedText>
            </h2>

            <div className="inline-flex items-center gap-4 mb-10">
              <span className="font-serif text-6xl font-medium tracking-tight">{business.rating}</span>
              <span>
                <span className="flex text-gold-deep mb-1" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </span>
                <span className="text-sm text-muted-foreground">
                  {business.reviewCount} {business.reviewSource} reviews
                </span>
              </span>
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
                <blockquote className="font-serif text-3xl md:text-4xl leading-snug mb-5">{item.quote}</blockquote>
                <figcaption className="text-sm text-muted-foreground">
                  <span className="text-foreground font-medium">{item.name}</span> · {item.source}
                </figcaption>
              </figure>
            ))}
            <img
              src="/biz/color-duo.jpg"
              alt="Short color and pixie styles by Tye &amp; Company"
              loading="lazy"
              className="w-full max-w-md aspect-[4/5] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
