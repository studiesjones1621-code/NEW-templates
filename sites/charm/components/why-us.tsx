"use client"

import { useEffect, useRef, useState } from "react"
import { HandHeart, Leaf, ShieldCheck, Sparkles, Stethoscope, Wallet } from "lucide-react"
import { HighlightedText } from "./highlighted-text"

const reasons = [
  {
    title: "Medical professionals only",
    description: "Every treatment is performed by a licensed nurse practitioner or registered nurse.",
    icon: Stethoscope,
  },
  {
    title: "Natural, never overcorrected",
    description: "Plans built around your facial anatomy to enhance your features, not change them.",
    icon: Leaf,
  },
  {
    title: "Free injectable consults",
    description: "Sit down, ask everything, and leave with a plan for your goals and your budget.",
    icon: Sparkles,
  },
  {
    title: "Comfort comes first",
    description: "Topical and local anesthetics and distraction devices, so injectables feel easy.",
    icon: HandHeart,
  },
  {
    title: "Plans that fit your budget",
    description: "Memberships, curated packages and CareCredit® financing to spread the cost.",
    icon: Wallet,
  },
  {
    title: "Safe, certified care",
    description: "A LegitScript-certified practice using accredited pharmacies and FDA-cleared devices.",
    icon: ShieldCheck,
  },
]

const team = [
  { name: "Olga Lannon, CRNP", role: "Nurse Practitioner & Owner", body: "11+ years in healthcare; AAFE trained and certified." },
  { name: "Carli Kralick, RN", role: "Registered Nurse Injector", body: "8 years of nursing and 2 in aesthetic medicine." },
  { name: "Vanessa Gordon, COS", role: "Cosmetologist & Skin Specialist", body: "25+ years: facials, extractions, waxing and makeup." },
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
          <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-5">Why Charm</p>
          <h2 className="text-5xl leading-[1.05] tracking-tight mb-6 text-balance lg:text-7xl">
            Your safety first. Your <HighlightedText>results</HighlightedText>, our passion.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
            Integrity, honesty and a commitment to excellence guide everything we do, in a welcoming space where you feel confident and cared for.
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

        <div className="mt-20 pt-12 border-t border-border">
          <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-8">Meet the team</p>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((m) => (
              <div key={m.name}>
                <h3 className="font-serif text-2xl mb-1">{m.name}</h3>
                <p className="text-sm text-gold-deep mb-2">{m.role}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
