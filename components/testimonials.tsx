"use client"

import { useEffect, useRef, useState } from "react"
import { Star } from "lucide-react"
import { HighlightedText } from "./highlighted-text"
import { business } from "@/lib/business"

// Verbatim excerpts from verified Booksy reviews.
const reviews = [
  {
    quote: "One of the best fades I have had in a long time. I walked out looking and feeling like a million bucks.",
    name: "Daniel",
    service: "Fade",
  },
  {
    quote: "The attention to detail was impressive. Every line and fade was clean and precise.",
    name: "Stephanie",
    service: "Economy Plus",
  },
  {
    quote: "Always on time for appointments. I never have to wait, and I get compliments every time.",
    name: "Tye",
    service: "Regular client",
  },
  {
    quote: "Very professional, and greeted my child with all respect.",
    name: "Aneetra",
    service: "Kids Cut",
  },
  {
    quote: "Best barber in town. Perfection every time.",
    name: "Dayvon",
    service: "Regular client",
  },
]

export function Testimonials() {
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
      { threshold: 0.3 },
    )

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section id="reviews" className="py-24 md:py-32 bg-secondary/60">
      <div className="container mx-auto px-5 md:px-12">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-24">
          {/* Left column - Title and image */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-5">Testimonials</p>
            <h2 className="text-5xl md:text-6xl font-medium leading-[1.1] tracking-tight mb-8 text-balance lg:text-7xl">
              Clients
              <br />
              <HighlightedText>keep flying back</HighlightedText>
            </h2>

            <a
              href={business.booksy}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 mb-10 group"
            >
              <span className="text-5xl font-medium tracking-tight">{business.rating}</span>
              <span>
                <span className="flex text-gold-deep mb-1" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </span>
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {business.reviewCount} reviews on Booksy
                </span>
              </span>
            </a>

            <div className="relative hidden lg:block max-w-md">
              <img
                src="/biz/reem-portrait.jpg"
                alt="Reem, owner and barber at First Class Cutz, holding his clippers"
                loading="lazy"
                className="relative z-10 w-full aspect-[4/5] object-cover"
              />
              <div className="absolute -bottom-4 -right-4 w-full h-full border border-gold/60" aria-hidden />
            </div>
          </div>

          {/* Right column - Reviews */}
          <div className="space-y-10 lg:pt-40">
            {reviews.map((item, index) => (
              <div
                key={item.name}
                ref={(el) => {
                  itemRefs.current[index] = el
                }}
                data-index={index}
                className={`transition-all duration-700 ${
                  visibleItems.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <figure className="flex gap-6">
                  <span className="text-gold-deep/70 text-sm font-medium pt-1.5">0{index + 1}</span>
                  <div>
                    <blockquote className="font-serif text-2xl md:text-3xl leading-snug mb-4">
                      &ldquo;{item.quote}&rdquo;
                    </blockquote>
                    <figcaption className="text-sm text-muted-foreground">
                      <span className="text-foreground font-medium">{item.name}</span> · {item.service}
                    </figcaption>
                  </div>
                </figure>
              </div>
            ))}

            <img
              src="/biz/reem-portrait.jpg"
              alt="Reem, owner and barber at First Class Cutz"
              loading="lazy"
              className="lg:hidden w-full aspect-[4/5] object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
