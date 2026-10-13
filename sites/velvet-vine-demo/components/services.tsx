"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowUpRight, Mic } from "lucide-react"
import { openAssistant } from "./talk-button"

const services = [
  {
    id: 1,
    title: "Hair Loss Consultation",
    tag: "Start here",
    blurb: "A full scalp and history review with Simone, and a plan for what to do next.",
    price: "$250",
    time: "25 min",
    image: "/biz/consult.jpg",
    alt: "Curly hair gathered into a bun, seen from behind",
    position: "50% 35%",
  },
  {
    id: 2,
    title: "Pixie Cuts & Short Hair",
    tag: "Signature",
    blurb: "Shampoo, deep conditioning and a precise cut, styled to suit you.",
    price: "From $100",
    time: "1–2 hr",
    image: "/biz/pixie-cut.jpg",
    alt: "A stylist trimming a short cut with scissors",
    position: "62% 50%",
  },
  {
    id: 3,
    title: "Color & Platinum",
    tag: "Be bold",
    blurb: "Demi color, permanent highlights or a full platinum pixie.",
    price: "From $25",
    time: "1–3 hr",
    image: "/biz/color.jpg",
    alt: "Short coral-pink color, seen from behind",
  },
  {
    id: 4,
    title: "Wrap & Curls",
    tag: "Maintenance",
    blurb: "Wrapping and curling techniques for a polished, lasting style.",
    price: "$100",
    time: "45 min",
    image: "/biz/curls.jpg",
    alt: "Close-up of glossy brown curls",
  },
  {
    id: 5,
    title: "Protein & Scalp Care",
    tag: "Restore",
    blurb: "A 2-step protein treatment, plus botanical growth oils for home care.",
    price: "$97",
    time: "60 min",
    image: "/biz/scalp-oil.jpg",
    alt: "A dropper releasing golden scalp oil",
  },
  {
    id: 6,
    title: "One-on-One Cutting Class",
    tag: "Education",
    blurb: "A private precision-cutting class with Simone, for beginners and pros.",
    price: "$325",
    time: "2 hr",
    image: "/biz/cutting-class.jpg",
    alt: "Cutting shears laid out on a towel beside a glass bottle",
  },
]

export function Services() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])
  const curtainRefs = useRef<(HTMLDivElement | null)[]>([])

  // Scroll-linked unveil: each photo's dark panel slides up as its card rises through the bottom of the
  // screen (and back down if you scroll back), so the effect is always seen, whatever the load position.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
    let frame = 0
    const update = () => {
      frame = 0
      const vh = document.documentElement.clientHeight
      imageRefs.current.forEach((box, i) => {
        const curtain = curtainRefs.current[i]
        if (!box || !curtain) return
        const r = box.getBoundingClientRect()
        const progress = reduce ? 1 : Math.min(1, Math.max(0, (vh * 0.95 - r.top) / (r.height * 0.7)))
        curtain.style.transform = `scaleY(${1 - ease(progress)})`
      })
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section id="services" className="relative z-10 py-24 md:py-32 services-sky">
      <div className="container mx-auto px-5 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 md:mb-16">
          <div>
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-5">Services</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight">
              Signature <span className="font-serif italic font-normal text-gold-deep">services.</span>
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
                <span className="absolute top-4 left-4 bg-primary/90 text-gold-light text-[11px] tracking-[0.2em] uppercase px-3 py-1.5">
                  {service.tag}
                </span>
                <div
                  ref={(el) => {
                    curtainRefs.current[index] = el
                  }}
                  data-curtain
                  className="absolute inset-0 bg-primary origin-top will-change-transform"
                  style={{ transform: "scaleY(1)", transition: "transform 0.25s ease-out" }}
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
                  Ask our assistant
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
