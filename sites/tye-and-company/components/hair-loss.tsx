"use client"

import { useEffect, useRef, useState } from "react"
import { HighlightedText } from "./highlighted-text"
import { TalkButton } from "./talk-button"
import { BooksyButton } from "./booksy-button"
import { business, policies } from "@/lib/business"

// From Ms. Tye's own description of her initial hair loss consultation.
const steps = [
  {
    title: "Your story",
    body: "When the loss began, how it has progressed, and what you have tried so far.",
  },
  {
    title: "Your health",
    body: "Conditions, recent illness or surgery, medications and supplements from the last 12 months.",
  },
  {
    title: "Your daily life",
    body: "Diet, digestion, stress and family history. Even your nails can tell part of the story.",
  },
  {
    title: "Your plan",
    body: "Bring any recent blood work, even if it’s normal. Then you leave knowing what to do next.",
  },
]

export function HairLoss() {
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
    <section id="hair-loss" className="py-24 md:py-32 bg-primary text-primary-foreground overflow-hidden">
      <div className="container mx-auto px-5 md:px-12">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-14 lg:gap-20 items-center">
          <div className="relative max-w-md mx-auto lg:mx-0 w-full">
            <img
              src="/biz/tye-pink.jpg"
              alt="Ms. Tye Bailey smiling in a pink jacket"
              loading="lazy"
              className="relative z-10 w-full aspect-[4/5] object-cover object-top"
            />
            <div className="absolute -bottom-4 -right-4 w-full h-full border border-gold/50" aria-hidden />
            <p className="relative z-10 mt-8 font-serif italic text-2xl leading-snug text-primary-foreground/90">
              &ldquo;Your hair is more than just strands; it&rsquo;s a vital part of your identity.&rdquo;
            </p>
            <p className="relative z-10 mt-2 text-sm text-primary-foreground/60">Ms. Tye Bailey</p>
          </div>

          <div>
            <p className="text-gold-light/80 text-sm tracking-[0.3em] uppercase mb-5">Hair Loss Studio</p>
            <h2 className="text-5xl md:text-6xl leading-[1.05] tracking-tight mb-6 text-balance">
              Hair loss isn&apos;t the <HighlightedText>end</HighlightedText> of your story.
            </h2>
            <p className="text-primary-foreground/70 text-lg leading-relaxed max-w-xl mb-12">
              Thinning, shedding or scalp concerns start with an unhurried consultation with Ms. Tye. Here&apos;s what
              she&apos;ll ask about.
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

            <div className="flex flex-col sm:flex-row gap-3">
              <TalkButton className="inline-flex items-center justify-center gap-2.5 bg-gold text-primary font-medium px-7 py-4 text-sm tracking-wide hover:bg-gold-light transition-colors">
                Book a consultation
              </TalkButton>
              <BooksyButton className="inline-flex items-center justify-center gap-2.5 border border-primary-foreground/30 px-7 py-4 text-sm tracking-wide hover:border-gold hover:text-gold transition-colors" />
            </div>
            <p className="mt-5 text-sm text-primary-foreground/50">
              Consultation $250 · {policies.consult} Questions? Call {business.phoneDisplay}.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
