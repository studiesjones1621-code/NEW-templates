"use client"

import { useEffect, useRef, useState } from "react"
import { HighlightedText } from "./highlighted-text"
import { testimonials } from "@/lib/business"

// Sample quotes written for this concept demo (not real reviews)
const quotes = testimonials.map((t) => ({ quote: t.text, name: t.name, source: t.service }))

const themes = ["Clearer skin", "Soothing ambiance", "Maya listens", "Leave glowing"]

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
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-5">Sample reviews · concept demo</p>
            <h2 className="text-5xl md:text-6xl leading-[1.05] tracking-tight mb-8 text-balance lg:text-7xl">
              Clients who <HighlightedText>glow</HighlightedText>
            </h2>

            <p className="text-muted-foreground text-lg leading-relaxed max-w-md mb-10">
              Illustrative quotes written for this concept demo of a fictional studio, not real client reviews.
            </p>

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
                <blockquote className="font-serif text-2xl md:text-[1.7rem] leading-snug mb-5">{item.quote}</blockquote>
                <figcaption className="text-sm text-muted-foreground">
                  <span className="text-foreground font-medium">{item.name}</span> · {item.source}
                </figcaption>
              </figure>
            ))}
            <img
              src="/biz/studio-room.jpg"
              alt="A warm, softly lit treatment room with a massage table"
              loading="lazy"
              className="w-full max-w-md aspect-[4/5] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
