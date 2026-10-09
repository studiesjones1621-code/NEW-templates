"use client"

import { useEffect, useRef, useState } from "react"
import { Check } from "lucide-react"
import { HighlightedText } from "./highlighted-text"
import { TalkButton } from "./talk-button"
import { BooksyButton } from "./booksy-button"
import { business, policies, pricing } from "@/lib/business"

// From Evexia's own description of a first hormone visit.
const steps = [
  {
    title: "You tell us what’s going on",
    body: "A real conversation, not a 10-minute slot: what you feel, how long, and what you’ve tried.",
  },
  {
    title: "We order the right labs",
    body: "A full hormone panel, thyroid and metabolic markers. Not just the two-line test.",
  },
  {
    title: "We read the full picture",
    body: "Kerryann reviews results against your symptoms, age, lifestyle and goals, in plain language.",
  },
  {
    title: "Your protocol, then ongoing care",
    body: "If therapy fits, it’s built for you, with follow-up labs and adjustments as you respond.",
  },
]

const credentials = [
  "Family Nurse Practitioner, FNP-BC",
  "Certified in BHRT (ABHRT)",
  "Harvard Medical School, advanced women’s health training",
  "20+ years of clinical experience",
]

export function Hormones() {
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
    <section id="hormones" className="py-24 md:py-32 bg-primary text-primary-foreground overflow-hidden">
      <div className="container mx-auto px-5 md:px-12">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-14 lg:gap-20 items-start">
          <div className="relative max-w-md mx-auto lg:mx-0 w-full">
            <img
              src="/biz/kerryann-portrait.jpg"
              alt={`${business.owner}, ${business.credentials}`}
              loading="lazy"
              className="relative z-10 w-full aspect-[4/5] object-cover object-top"
            />
            <div className="absolute top-4 left-4 w-full aspect-[4/5] border border-gold/50" aria-hidden />
            <p className="relative z-10 mt-10 font-serif italic text-2xl leading-snug text-primary-foreground/90">
              &ldquo;Hormone imbalance is not something you simply live with. It is something we address together.&rdquo;
            </p>
            <p className="relative z-10 mt-2 text-sm text-primary-foreground/60">
              {business.owner}, {business.credentials}
            </p>
            <ul className="relative z-10 mt-6 space-y-2 text-sm text-primary-foreground/70">
              {credentials.map((c) => (
                <li key={c} className="flex gap-2.5">
                  <Check className="w-4 h-4 mt-0.5 text-gold shrink-0" aria-hidden />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-gold-light/80 text-sm tracking-[0.3em] uppercase mb-5">Hormone Therapy</p>
            <h2 className="text-5xl md:text-6xl leading-[1.05] tracking-tight mb-6 text-balance">
              Normal isn&apos;t the same as <HighlightedText>optimal</HighlightedText>.
            </h2>
            <p className="text-primary-foreground/70 text-lg leading-relaxed max-w-xl mb-12">
              Hot flashes, brain fog, low drive, weight that won&apos;t move. For women and men, it starts with being
              heard and tested properly.
            </p>

            <ol className="grid sm:grid-cols-2 gap-x-10 gap-y-9 mb-12">
              {steps.map((s, i) => (
                <li
                  key={s.title}
                  ref={(el) => {
                    refs.current[i] = el
                  }}
                  data-index={i}
                  className={`transition-all duration-700 ${visible.includes(i) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  <span className="font-serif text-gold text-3xl">0{i + 1}</span>
                  <h3 className="text-xl font-medium mt-2 mb-2">{s.title}</h3>
                  <p className="text-primary-foreground/65 leading-relaxed">{s.body}</p>
                </li>
              ))}
            </ol>

            <div className="border border-gold/40 bg-white/[0.04] p-6 md:p-8 mb-10 grid sm:grid-cols-[auto_1fr] gap-6 sm:gap-10 items-center">
              <div>
                <p className="text-xs tracking-[0.25em] uppercase text-gold-light/80 mb-2">BHRT for women</p>
                <p className="font-serif text-6xl leading-none">{pricing.bhrtStart}</p>
                <p className="text-sm text-primary-foreground/60 mt-2">one-time start</p>
              </div>
              <div>
                <ul className="space-y-2 mb-4">
                  {pricing.bhrtIncludes.map((x) => (
                    <li key={x} className="flex gap-2.5">
                      <Check className="w-4 h-4 mt-1 text-gold shrink-0" aria-hidden />
                      {x} included
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-primary-foreground/55">
                  Typically {pricing.bhrtCompare} at other hormone clinics. {pricing.bhrtNote}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <TalkButton className="inline-flex items-center justify-center gap-2.5 bg-gold text-primary font-medium px-7 py-4 text-sm tracking-wide hover:bg-gold-light transition-colors">
                Book a hormone consultation
              </TalkButton>
              <BooksyButton className="inline-flex items-center justify-center gap-2.5 border border-primary-foreground/30 px-7 py-4 text-sm tracking-wide hover:border-gold hover:text-gold transition-colors" />
            </div>
            <p className="mt-5 text-sm text-primary-foreground/50">
              {policies.referral} Cash-pay, no insurance gatekeeping. Questions? Call {business.phoneDisplay}.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
