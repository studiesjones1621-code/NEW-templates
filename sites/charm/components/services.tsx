"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowUpRight, Mic } from "lucide-react"
import { openAssistant } from "./talk-button"
import { BooksyButton } from "./booksy-button"

const services = [
  {
    id: 1,
    title: "Botox & Xeomin",
    tag: "Most booked",
    blurb: "Soften forehead lines, 11s and crow’s feet, or slim the jaw and ease grinding. Lasts about 3–4 months.",
    price: "$12/unit",
    time: "30 min",
    image: "/biz/botox.jpg",
    alt: "Neurotoxin injection between the brows",
  },
  {
    id: 2,
    title: "Lips & Dermal Filler",
    tag: "Natural volume",
    blurb: "Hyaluronic acid filler for lips, cheeks and folds, with numbing and comfort care built in.",
    price: "Lips $700",
    time: "60 min",
    image: "/biz/lip-filler.jpg",
    alt: "Lip filler injection with a fine needle",
  },
  {
    id: 3,
    title: "Sculptra & Biostimulators",
    tag: "Invest in collagen",
    blurb: "Sculptra, Radiesse and EZ Gel rebuild your own collagen for results that keep improving.",
    price: "From $850",
    time: "75 min",
    image: "/biz/jawline-injection.jpg",
    alt: "Jawline injection for collagen stimulation",
  },
  {
    id: 4,
    title: "Medical Weight Loss",
    tag: "GLP-1",
    blurb: "Semaglutide or tirzepatide subscriptions with labs, check-ins and body composition tracking.",
    price: "From $325/mo",
    time: "Virtual start",
    image: "/biz/olga-laptop.jpg",
    alt: "Olga Lannon on a virtual consultation in the studio",
    position: "50% 30%",
  },
  {
    id: 5,
    title: "Facials & Peels",
    tag: "Glow",
    blurb: "Signature and Silktox facials, Perfect Derma peels and dermaplaning, tailored to your skin.",
    price: "From $140",
    time: "60 min",
    image: "/biz/facial.jpg",
    alt: "Relaxing professional facial massage",
  },
  {
    id: 6,
    title: "Microneedling & PRP",
    tag: "Renew",
    blurb: "Collagen induction for texture, scarring and tone. Add PRP or VAMP for a boost.",
    price: "$350",
    time: "60 min",
    image: "/biz/microneedling.jpg",
    alt: "Microneedling pen treatment on the forehead",
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
              Treatments, <span className="font-serif italic font-normal text-gold-deep">thoughtfully done.</span>
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
