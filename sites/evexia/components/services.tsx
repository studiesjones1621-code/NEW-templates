"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowUpRight, Mic } from "lucide-react"
import { openAssistant } from "./talk-button"
import { BooksyButton } from "./booksy-button"

const services = [
  {
    id: 1,
    title: "Medical Weight Loss",
    tag: "Most popular",
    blurb: "GLP-1 or dual-action GLP-1/GIP injections, prescription options and weekly accountability.",
    price: "Personal plan",
    time: "In person or telehealth",
    image: "/biz/weight-scale.jpg",
    alt: "Woman in workout clothes holding a bathroom scale",
    position: "50% 35%",
  },
  {
    id: 2,
    title: "BHRT for Women",
    tag: "Hormones",
    blurb: "Perimenopause, menopause, PCOS and PMDD, treated with lab-guided bioidentical hormones.",
    price: "$199 start",
    time: "Labs included",
    image: "/biz/bhrt-women.jpg",
    alt: "Smiling woman with silver curls blending a green smoothie",
  },
  {
    id: 3,
    title: "Testosterone for Men",
    tag: "TRT",
    blurb: "A full hormone panel, then a protocol built to feel optimal, not just “normal.”",
    price: "Cash-pay",
    time: "Injection, cream or capsule",
    image: "/biz/trt-men.jpg",
    alt: "Man training with dumbbells in a gym",
  },
  {
    id: 4,
    title: "Primary Care",
    tag: "Insurance accepted",
    blurb: "Wellness exams, chronic disease care, sick visits and sports physicals.",
    price: "Major plans",
    time: "Telemedicine too",
    image: "/biz/primary-care.jpg",
    alt: "Clinician reviewing results with a patient on a laptop",
  },
  {
    id: 5,
    title: "NAD+ & IV Therapy",
    tag: "Recharge",
    blurb: "NAD+ injections and tailored IV hydration for energy, focus and recovery.",
    price: "Ask us",
    time: "Quick visit",
    image: "/biz/nad.jpg",
    alt: "Woman with glowing skin beside a vial of NAD+",
    position: "30% 40%",
  },
  {
    id: 6,
    title: "Lipodissolve & Hair",
    tag: "Now available",
    blurb: "Non-surgical help for stubborn fat pockets, and a science-backed hair restoration program.",
    price: "Ask us",
    time: "No downtime",
    image: "/biz/lipodissolve.jpg",
    alt: "Lipodissolve treatment marked on the abdomen",
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
              Care built <span className="font-serif italic font-normal text-gold-deep">around you.</span>
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
