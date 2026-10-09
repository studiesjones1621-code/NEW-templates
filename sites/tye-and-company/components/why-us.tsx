"use client"

import { useEffect, useRef, useState } from "react"
import { Crown, HeartHandshake, Ear, Droplets, GraduationCap, Sparkles } from "lucide-react"
import { HighlightedText } from "./highlighted-text"

const reasons = [
  {
    title: "Two decades of trust",
    description: "Over 20 years building a safe space for Baltimore women.",
    icon: Crown,
  },
  {
    title: "Hair loss know-how",
    description: "Specialist care for thinning, shedding and scalp concerns, not just styling.",
    icon: Sparkles,
  },
  {
    title: "She listens first",
    description: "Clients say Ms. Tye listens closely, which makes her easy to trust.",
    icon: Ear,
  },
  {
    title: "A private, safe space",
    description: "Come as you are. Feel understood, valued and cared for.",
    icon: HeartHandshake,
  },
  {
    title: "You learn as you go",
    description: "She explains how to care for your hair, and even teaches cutting classes.",
    icon: GraduationCap,
  },
  {
    title: "Care you take home",
    description: "Tye’s own growth oils and Liquid Gold shine keep results going.",
    icon: Droplets,
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
          <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-5">Why Tye &amp; Company</p>
          <h2 className="text-5xl leading-[1.05] tracking-tight mb-6 text-balance lg:text-7xl">
            Where you feel <HighlightedText>beautiful</HighlightedText> again.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
            Every woman deserves to feel confident in her own skin. That starts the moment you walk in.
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
