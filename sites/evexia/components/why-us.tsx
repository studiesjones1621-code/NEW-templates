"use client"

import { useEffect, useRef, useState } from "react"
import { Ear, FlaskConical, HeartHandshake, MapPin, Leaf, ShieldCheck } from "lucide-react"
import { HighlightedText } from "./highlighted-text"

const reasons = [
  {
    title: "She actually listens",
    description: "No 10-minute slots. Kerryann takes the time to understand your whole story first.",
    icon: Ear,
  },
  {
    title: "Labs, not guesswork",
    description: "Full hormone and metabolic panels, read against how you actually feel.",
    icon: FlaskConical,
  },
  {
    title: "Long-term, not quick fixes",
    description: "Habits, nutrition and medicine together, so results last after you reach your goal.",
    icon: Leaf,
  },
  {
    title: "Support every step",
    description: "Weekly weigh-ins, accountability calls, recipes and check-ins as your plan evolves.",
    icon: HeartHandshake,
  },
  {
    title: "Transparent, cash-pay care",
    description: "No prior authorizations or claim denials between you and treatment. FSA/HSA welcome.",
    icon: ShieldCheck,
  },
  {
    title: "Two offices, plus telehealth",
    description: "Parkville and Pikesville, with telemedicine across MD, DE, VA and CT.",
    icon: MapPin,
  },
]

export function WhyUs() {
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"))
          if (entry.isIntersecting) {
            setVisibleItems((prev) => [...new Set([...prev, index])])
          }
        })
      },
      { threshold: 0.2 },
    )

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section id="why" className="py-24 md:py-32">
      <div className="container mx-auto px-5 md:px-12">
        <div className="max-w-3xl mb-16 md:mb-20">
          <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-5">Why Evexia</p>
          <h2 className="text-5xl leading-[1.05] tracking-tight mb-6 text-balance lg:text-7xl">
            Care that starts with <HighlightedText>listening</HighlightedText>.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
            “Looking better has never been enough. Feeling revitalized, optimized and rejuvenated: now that’s priority.” — Kerryann
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-14">
          {reasons.map((area, index) => {
            const Icon = area.icon
            return (
              <div
                key={area.title}
                ref={(el) => {
                  itemRefs.current[index] = el
                }}
                data-index={index}
                className={`relative pl-8 border-l border-border transition-all duration-700 ${
                  visibleItems.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: `${(index % 3) * 150}ms` }}
              >
                <div className={visibleItems.includes(index) ? "animate-draw-stroke" : ""}>
                  <Icon className="w-10 h-10 mb-5 text-gold-deep" strokeWidth={1.25} aria-hidden />
                </div>
                <h3 className="text-xl font-medium mb-3">{area.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{area.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
