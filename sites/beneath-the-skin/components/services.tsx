"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowUpRight, Mic } from "lucide-react"
import { openAssistant } from "./talk-button"
import { BooksyButton } from "./booksy-button"
import { onLenisScroll, supportsScrollTimelines } from "@/lib/scroll"

const services = [
  {
    id: 1,
    title: "Intro Custom Facial",
    tag: "First visit",
    blurb: "For first-time clients: a facial built around what your skin needs on the day, and a plan for what comes next.",
    price: "$99",
    time: "60 min",
    image: "/biz/svc-intro-facial.jpg",
    alt: "Esthetician cleansing a client's skin during a custom facial",
  },
  {
    id: 2,
    title: "Clear Path Acne",
    tag: "Signature",
    blurb: "Six biweekly treatments that go after the root cause, with functional lab testing when your skin needs it.",
    price: "From $175",
    time: "60 min",
    image: "/biz/svc-acne.jpg",
    alt: "Esthetician examining a client's acne under a magnifying lamp",
  },
  {
    id: 3,
    title: "Microneedling + Growth Factors",
    tag: "Renew",
    blurb: "Microneedling with RF, peptides and growth factors for texture, scarring, pores and firmness.",
    price: "$350",
    time: "90 min",
    image: "/biz/svc-microneedling.jpg",
    alt: "Microneedling pen treatment on the forehead",
  },
  {
    id: 4,
    title: "Lift & Sculpt RF",
    tag: "Firm",
    blurb: "Radiofrequency warms the deeper layers to tighten, lift and contour, with no downtime.",
    price: "$169",
    time: "60 min",
    image: "/biz/svc-rf.jpg",
    alt: "Radiofrequency device contouring the jawline",
  },
  {
    id: 5,
    title: "Hydra Glow Facial",
    tag: "Glow",
    blurb: "Deep cleanse, gentle extraction and serum infusion for instantly plump, dewy skin.",
    price: "$179",
    time: "60 min",
    image: "/biz/svc-hydra.jpg",
    alt: "Hydrating facial wand on dewy skin",
  },
  {
    id: 6,
    title: "Corrective Treatments",
    tag: "Custom",
    blurb: "Microderm, dermaplaning, enzyme renewal or a Clarity Glow peel, each with nano infusion.",
    price: "From $130",
    time: "30–60 min",
    image: "/biz/treatment-training.jpg",
    alt: "Katrina guiding a corrective facial treatment in the studio",
    position: "50% 35%",
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
    // Phones with scroll-driven animations: the compositor plays each unveil against the scroll, no per-frame JS
    if (supportsScrollTimelines() && !reduce) {
      const VT = (window as unknown as { ViewTimeline: new (o: object) => AnimationTimeline }).ViewTimeline
      const anims = imageRefs.current.flatMap((box, i) => {
        const curtain = curtainRefs.current[i]
        if (!box || !curtain) return []
        curtain.style.transition = "none"
        curtain.style.removeProperty("transform")
        return [
          curtain.animate([{ transform: "scaleY(1)" }, { transform: "scaleY(0)" }], {
            timeline: new VT({ subject: box, axis: "block" }),
            rangeStart: "entry 5%",
            rangeEnd: "entry 75%",
            easing: "cubic-bezier(0.65, 0, 0.35, 1)",
            fill: "both",
          } as KeyframeAnimationOptions),
        ]
      })
      return () => anims.forEach((a) => a.cancel())
    }
    update()
    const offLenis = onLenisScroll(() => {
      cancelAnimationFrame(frame)
      update()
    })
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      offLenis()
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
              Corrective care, <span className="font-serif italic font-normal text-gold-deep">from the inside out.</span>
            </h2>
          </div>
          <a
            href="#menu"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            See every price
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
                <span className="text-sm font-semibold whitespace-nowrap text-gold-deep pt-1">{service.price}</span>
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
                  or book online
                </BooksyButton>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
