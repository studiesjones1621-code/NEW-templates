"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowUpRight, Mic } from "lucide-react"
import { openAssistant } from "./talk-button"
import { BooksyButton } from "./booksy-button"

const services = [
  {
    id: 1,
    title: "Economy Plus",
    tag: "Fades & tapers",
    blurb: "Low, mid or high fade with a razor-sharp line-up.",
    price: "$40",
    time: "45 min",
    image: "/biz/cut-twists-taper.jpg",
    alt: "Client with a high taper, sharp line-up and twists on top",
  },
  {
    id: 2,
    title: "Business Class",
    tag: "Most booked",
    blurb: "Fade, beard, hot towel and a clean razor finish.",
    price: "$50",
    time: "60 min",
    image: "/biz/cut-taper-beard.jpg",
    alt: "Client with a fresh taper and shaped beard",
  },
  {
    id: 3,
    title: "First Class Luxury",
    tag: "The full treatment",
    blurb: "Cut, beard sculpt, hot towel, facial and massage.",
    price: "$105",
    time: "90 min",
    image: "/biz/studio-suite-tall.jpg",
    alt: "The private First Class studio suite with hexagon lighting",
  },
  {
    id: 4,
    title: "Loc Retwist",
    tag: "Locs",
    blurb: "Shampoo, retwist and a basic style, finished neat.",
    price: "$85",
    time: "90 min",
    image: "/biz/cut-retwist-taper.jpg",
    alt: "Fresh loc retwist with a low taper",
  },
  {
    id: 5,
    title: "Kids & Teens",
    tag: "Young flyers",
    blurb: "Patient, precise cuts. Enhancements included for kids.",
    price: "From $35",
    time: "30 min",
    image: "/biz/cut-kid-curly-taper.jpg",
    alt: "Young client with a curly top, clean taper and sharp line-up",
    position: "40% 50%",
  },
  {
    id: 6,
    title: "Shape-Ups & Beards",
    tag: "Quick refresh",
    blurb: "Edge-ups, beard trims and hot-towel beard care.",
    price: "From $20",
    time: "20–30 min",
    image: "/biz/cut-braids-beard.jpg",
    alt: "Client with braids, a crisp shape-up and a full shaped beard",
  },
]

export function Services() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const [revealedImages, setRevealedImages] = useState<Set<number>>(new Set())
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = imageRefs.current.indexOf(entry.target as HTMLDivElement)
            if (index !== -1) {
              setRevealedImages((prev) => new Set(prev).add(services[index].id))
            }
          }
        })
      },
      { threshold: 0.2 },
    )

    imageRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section id="services" className="relative z-10 py-24 md:py-32 services-sky">
      <div className="container mx-auto px-5 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 md:mb-16">
          <div>
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-5">Services</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight">
              Choose your <span className="font-serif italic font-normal text-gold-deep">class.</span>
            </h2>
          </div>
          <a
            href="#menu"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            See the full menu
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 md:gap-x-8">
          {services.map((service, index) => (
            <article
              key={service.id}
              className="group"
              onMouseEnter={() => setHoveredId(service.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div
                ref={(el) => {
                  imageRefs.current[index] = el
                }}
                className="relative overflow-hidden aspect-[4/5] mb-5 bg-primary"
              >
                <img
                  src={service.image}
                  alt={service.alt}
                  loading="lazy"
                  style={{ objectPosition: "position" in service ? service.position : undefined }}
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    hoveredId === service.id ? "scale-105" : "scale-100"
                  }`}
                />
                <span className="absolute top-4 left-4 bg-primary/85 backdrop-blur text-gold-light text-[11px] tracking-[0.2em] uppercase px-3 py-1.5">
                  {service.tag}
                </span>
                <div
                  className="absolute inset-0 bg-primary origin-top"
                  style={{
                    transform: revealedImages.has(service.id) ? "scaleY(0)" : "scaleY(1)",
                    transition: "transform 1.5s cubic-bezier(0.76, 0, 0.24, 1)",
                  }}
                />
              </div>

              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="text-xl font-medium">{service.title}</h3>
                <span className="text-lg font-semibold whitespace-nowrap">{service.price}</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {service.blurb} <span className="text-muted-foreground/70">· {service.time}</span>
              </p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <button
                  type="button"
                  onClick={openAssistant}
                  className="inline-flex items-center gap-2 text-sm font-medium text-foreground underline-offset-4 decoration-gold hover:underline cursor-pointer"
                >
                  <Mic className="w-3.5 h-3.5 text-gold-deep" strokeWidth={2} aria-hidden />
                  Book with our assistant
                </button>
                <BooksyButton
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground underline-offset-4 decoration-gold hover:underline [&>svg]:w-3.5 [&>svg]:h-3.5 [&>svg]:text-gold-deep"
                >
                  or Booksy
                </BooksyButton>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
