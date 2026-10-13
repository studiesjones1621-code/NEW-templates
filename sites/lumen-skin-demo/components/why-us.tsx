"use client"

import { useEffect, useRef, useState } from "react"
import { FlaskConical, HandHeart, Leaf, Ribbon, Sparkles, Wallet } from "lucide-react"
import { HighlightedText } from "./highlighted-text"

// Fictional studio (concept demo)
const reasons = [
  {
    title: "Root-cause healing",
    description: "A holistic look at habits, triggers and skin history uncovers what's really behind stubborn skin.",
    icon: FlaskConical,
  },
  {
    title: "Gentle, supportive care",
    description: "Calm, careful treatments for sensitive skin and clients navigating health conditions.",
    icon: Ribbon,
  },
  {
    title: "Plans made for you",
    description: "Every treatment is customized on the day, from the products to the technique, to what your skin needs.",
    icon: Sparkles,
  },
  {
    title: "Calm, private studio",
    description: "A soothing private suite, by appointment only, so your time is never rushed.",
    icon: HandHeart,
  },
  {
    title: "Skin health, not quick fixes",
    description: "Treatments, home care and lifestyle guidance that keep working long after you leave.",
    icon: Leaf,
  },
  {
    title: "Easy to stay consistent",
    description: "The $99.99 Lumen Monthly membership, gift certificates and financing options.",
    icon: Wallet,
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
          <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-5">Why Lumen</p>
          <h2 className="text-5xl leading-[1.05] tracking-tight mb-6 text-balance lg:text-7xl">
            Glow from <HighlightedText>within</HighlightedText>.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
            Calm, thoughtful corrective skincare that looks below the surface for the reason your skin is struggling.
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

        <figure className="mt-20 pt-12 border-t border-border max-w-3xl">
          <blockquote className="font-serif text-3xl md:text-4xl leading-snug text-balance">
            &ldquo;Great skin isn&rsquo;t a quick fix. It&rsquo;s <span className="italic text-gold-deep">care that goes deeper.</span>&rdquo;
          </blockquote>
          <figcaption className="mt-4 text-sm tracking-[0.2em] uppercase text-muted-foreground">
            The Lumen philosophy
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
