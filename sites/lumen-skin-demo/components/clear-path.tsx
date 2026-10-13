"use client"

import { useEffect, useRef, useState } from "react"
import { Check } from "lucide-react"
import { HighlightedText } from "./highlighted-text"
import { TalkButton } from "./talk-button"
import { business, clearPath } from "@/lib/business"

// Maya is a fictional esthetician (concept demo); these are illustrative credentials
const credentials = [
  "Licensed esthetician with 12+ years in skin health",
  "Advanced training in acne and corrective skincare",
  "Gentle, supportive care for sensitive and medically complex skin",
]

/** The Clarity Reset Acne Program: root-cause acne care, the studio's signature, plus Maya's (fictional) credentials. */
export function ClearPath() {
  const [visible, setVisible] = useState<number[]>([])
  const refs = useRef<(HTMLLIElement | null)[]>([])

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
    <section id="clear-path" className="py-24 md:py-32 bg-primary text-primary-foreground overflow-hidden">
      <div className="container mx-auto px-5 md:px-12">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-14 lg:gap-20 items-start">
          <div id="about" className="relative max-w-md mx-auto lg:mx-0 w-full scroll-mt-28">
            <img
              src="/biz/maya-portrait.jpg"
              alt={`${business.owner}, the fictional lead esthetician of ${business.name}, seated in a wooden lounge chair`}
              loading="lazy"
              className="relative z-10 w-full aspect-[4/5] object-cover object-[50%_20%]"
            />
            <div className="absolute top-4 left-4 w-full aspect-[4/5] border border-gold/50" aria-hidden />
            <p className="relative z-10 mt-10 font-serif italic text-3xl leading-snug text-primary-foreground/90">
              Meet {business.owner}, your esthetician
            </p>
            <p className="relative z-10 mt-3 text-sm leading-relaxed text-primary-foreground/65">
              Lead esthetician at {business.name}. Maya helps clients feel at home in their skin again and see lasting
              change, pairing a holistic look at habits and triggers with personalized treatment plans that work from
              the inside out.
            </p>
            <ul className="relative z-10 mt-6 space-y-2 text-sm text-primary-foreground/75">
              {credentials.map((c) => (
                <li key={c} className="flex gap-2.5">
                  <Check className="w-4 h-4 mt-0.5 text-gold shrink-0" aria-hidden />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-gold-light/80 text-sm tracking-[0.3em] uppercase mb-5">The Clarity Reset Acne Program</p>
            <h2 className="font-serif text-5xl md:text-6xl leading-[1.02] tracking-tight mb-6 text-balance">
              Clear skin that <HighlightedText>lasts</HighlightedText>, because we treat the cause.
            </h2>
            <p className="text-primary-foreground/70 text-lg leading-relaxed max-w-xl mb-12">
              Acne is rarely just a surface problem. Clarity Reset looks for the triggers that are often overlooked,
              then treats your skin and your habits together.
            </p>

            <ol className="grid sm:grid-cols-3 gap-x-8 gap-y-9 mb-12">
              {clearPath.steps.map((s, i) => (
                <li
                  key={s.title}
                  ref={(el) => {
                    refs.current[i] = el
                  }}
                  data-index={i}
                  className={`transition-all duration-700 ${visible.includes(i) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  <span className="font-serif text-gold text-4xl">0{i + 1}</span>
                  <h3 className="text-lg font-medium mt-2 mb-2">{s.title}</h3>
                  <p className="text-primary-foreground/65 text-sm leading-relaxed">{s.text}</p>
                </li>
              ))}
            </ol>

            <div className="border border-gold/40 bg-white/[0.04] p-6 md:p-8 mb-10">
              <div className="grid sm:grid-cols-3 gap-6">
                {[clearPath.first, clearPath.series].map((x) => (
                  <div key={x.name}>
                    <p className="text-xs tracking-[0.2em] uppercase text-gold-light/80 mb-2">{x.name}</p>
                    <p className="font-serif text-4xl leading-none">{x.price}</p>
                    <p className="text-xs text-primary-foreground/55 mt-2">{x.duration}</p>
                  </div>
                ))}
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-gold-light/80 mb-2">Full program</p>
                  <p className="font-serif text-4xl leading-none text-gold-light">{clearPath.total}</p>
                  <p className="text-xs text-primary-foreground/55 mt-2">{clearPath.cadence}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <TalkButton className="inline-flex items-center justify-center gap-2.5 bg-gold text-primary font-medium px-7 py-4 text-sm tracking-wide hover:bg-gold-light transition-colors">
                Start my Clarity Reset
              </TalkButton>
            </div>
            <p className="mt-5 text-sm text-primary-foreground/50">
              Not sure where to start? A $40 Skin Health Assessment maps out exactly what your skin needs.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
