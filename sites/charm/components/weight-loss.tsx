"use client"

import { useEffect, useRef, useState } from "react"
import { Check } from "lucide-react"
import { HighlightedText } from "./highlighted-text"
import { TalkButton } from "./talk-button"
import { BooksyButton } from "./booksy-button"
import { business, weightLoss } from "@/lib/business"

// From Charm's own description of how its medically managed program works.
const steps = [
  {
    title: "Virtual consultation",
    body: `A 30-minute video visit to review your history, medications and goals, and see if you're a candidate. ${weightLoss.consult}, credited to your first month.`,
  },
  {
    title: "In-person first visit",
    body: "Body composition analysis, a hands-on exam, lab review and one-on-one injection training.",
  },
  {
    title: "Your monthly plan",
    body: "Medication at any dose, monthly check-ins and repeat labs, all in one simple subscription.",
  },
  {
    title: "Support that fits your life",
    body: "Virtual follow-ups when you're busy, in person when you want it. Never just a number on a scale.",
  },
]

const credentials = [
  "Board-certified Family Nurse Practitioner (FNP-C)",
  "11+ years in healthcare, including critical care, trauma and oncology surgery",
  "Trained and certified through the American Academy of Facial Esthetics",
  "LegitScript-certified practice",
]

export function WeightLoss() {
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
    <section id="weight-loss" className="py-24 md:py-32 bg-primary text-primary-foreground overflow-hidden">
      <div className="container mx-auto px-5 md:px-12">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-14 lg:gap-20 items-start">
          <div className="relative max-w-md mx-auto lg:mx-0 w-full">
            <img
              src="/biz/olga-pink-chair.jpg"
              alt={`${business.owner}, ${business.credentials}, in her Charm coat`}
              loading="lazy"
              className="relative z-10 w-full aspect-[4/5] object-cover object-top"
            />
            <div className="absolute top-4 left-4 w-full aspect-[4/5] border border-gold/50" aria-hidden />
            <p className="relative z-10 mt-10 font-serif italic text-2xl leading-snug text-primary-foreground/90">
              Meet {business.owner}, {business.credentials}
            </p>
            <p className="relative z-10 mt-2 text-sm text-primary-foreground/60">
              An AAFE-certified nurse practitioner, wife, mother and small business owner.
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
            <p className="text-gold-light/80 text-sm tracking-[0.3em] uppercase mb-5">Medical Weight Loss</p>
            <h2 className="text-5xl md:text-6xl leading-[1.05] tracking-tight mb-6 text-balance">
              Real human care, <HighlightedText>one</HighlightedText> simple plan.
            </h2>
            <p className="text-primary-foreground/70 text-lg leading-relaxed max-w-xl mb-12">
              Medically managed GLP-1 weight loss led by a licensed nurse practitioner who sees you as more than a
              number on a scale.
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

            <div className="border border-gold/40 bg-white/[0.04] p-6 md:p-8 mb-10">
              <div className="grid sm:grid-cols-3 gap-6 mb-6">
                {weightLoss.plans.map((plan) => (
                  <div key={plan.name}>
                    <p className="text-xs tracking-[0.2em] uppercase text-gold-light/80 mb-2">{plan.name}</p>
                    <p className="font-serif text-4xl leading-none">
                      {plan.price}
                      <span className="text-base text-primary-foreground/60">{plan.per}</span>
                    </p>
                    <p className="text-xs text-primary-foreground/55 mt-2">{plan.note}</p>
                  </div>
                ))}
              </div>
              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm mb-4">
                {weightLoss.includes.map((x) => (
                  <li key={x} className="flex gap-2.5">
                    <Check className="w-4 h-4 mt-0.5 text-gold shrink-0" aria-hidden />
                    {x}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-primary-foreground/50">{weightLoss.pharmacy} Introductory pricing; results vary.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <TalkButton className="inline-flex items-center justify-center gap-2.5 bg-gold text-primary font-medium px-7 py-4 text-sm tracking-wide hover:bg-gold-light transition-colors">
                Book a virtual consult
              </TalkButton>
              <BooksyButton className="inline-flex items-center justify-center gap-2.5 border border-primary-foreground/30 px-7 py-4 text-sm tracking-wide hover:border-gold hover:text-gold transition-colors" />
            </div>
            <p className="mt-5 text-sm text-primary-foreground/50">
              Using insurance for your GLP-1? Ask about the $140 membership with prescriptions sent to your pharmacy.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
