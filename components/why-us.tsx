"use client"

import { useEffect, useRef, useState } from "react"
import { Scissors, Clock, Crown, GraduationCap, Baby, CreditCard } from "lucide-react"
import { HighlightedText } from "./highlighted-text"

const reasons = [
  {
    title: "Detail-obsessed fades",
    description: "Clean blends and razor-sharp line-ups. Clients leave with compliments.",
    icon: Scissors,
  },
  {
    title: "Your time, respected",
    description: "Book a slot, sit down on time. No crowded waiting room.",
    icon: Clock,
  },
  {
    title: "A private studio",
    description: "One chair, one client, real conversation. Pure focus on you.",
    icon: Crown,
  },
  {
    title: "Licensed and trained",
    description: "A Baltimore Beauty & Barber School graduate. Skills you can trust.",
    icon: GraduationCap,
  },
  {
    title: "Kid-friendly chair",
    description: "Patient with first cuts and nervous flyers. Parents love it.",
    icon: Baby,
  },
  {
    title: "Easy visit",
    description: "Free parking, cards accepted, wheelchair accessible. Loyalty perks too.",
    icon: CreditCard,
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
          <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-5">Why Choose Us</p>
          <h2 className="text-5xl font-medium leading-[1.1] tracking-tight mb-6 text-balance lg:text-7xl">
            <HighlightedText>Precision</HighlightedText> you
            <br />
            can feel.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
            Reem treats every chair like first class. That&apos;s why clients don&apos;t switch barbers.
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
