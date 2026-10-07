"use client"

import { useEffect, useRef } from "react"
import { ArrowDown, Phone, Star } from "lucide-react"
import { business } from "@/lib/business"
import { TalkButton } from "./talk-button"

export function Hero() {
  const contentRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)

  // Template's tilt-away effect, driven by scroll position instead of hijacking the wheel.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let frame = 0
    const update = () => {
      frame = 0
      const progress = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.9)))
      if (contentRef.current) {
        contentRef.current.style.transform = `translateY(${progress * 160}px) rotateX(${progress * 35}deg) scale(${1 - progress * 0.2})`
        contentRef.current.style.opacity = String(1 - progress * 0.9)
      }
      if (bgRef.current) {
        bgRef.current.style.transform = `scale(${1.08 + progress * 0.08}) translateY(${progress * 60}px)`
      }
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-primary"
      style={{ perspective: "1000px" }}
    >
      <div ref={bgRef} className="absolute inset-0 z-0 will-change-transform" style={{ transform: "scale(1.08)" }}>
        <img
          src="/biz/studio-chair-cape.jpg"
          alt="Barber chair draped in a First Class Cutz cape inside the studio"
          className="w-full h-full object-cover object-[50%_60%]"
          fetchPriority="high"
        />
      </div>
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/80 via-black/55 to-black/85" aria-hidden />
      <div
        className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.55)_75%)]"
        aria-hidden
      />

      <div
        ref={contentRef}
        className="container mx-auto px-5 md:px-12 relative z-20 pt-28 pb-24 will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <p className="inline-flex items-center gap-2 text-[11px] md:text-xs tracking-[0.3em] uppercase text-gold-light mb-7">
            <span className="h-px w-8 bg-gold/70" aria-hidden />
            Baltimore Barber Studio
            <span className="h-px w-8 bg-gold/70" aria-hidden />
          </p>

          <h1 className="text-[3.4rem] leading-[0.95] sm:text-7xl lg:text-8xl font-medium text-balance text-white tracking-tight mb-7">
            Every cut,
            <br />
            <span className="font-serif italic font-normal text-gold">flown first class.</span>
          </h1>

          <p className="text-white/75 text-base md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            Precision fades, beard work and locs by Reem. Book in under a minute.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center max-w-sm sm:max-w-none mx-auto">
            <TalkButton className="inline-flex items-center justify-center gap-2.5 bg-gold text-primary font-semibold px-8 py-4 text-sm tracking-wide hover:bg-gold-light transition-colors duration-300">
              Talk to our assistant
            </TalkButton>
            <a
              href={business.phoneHref}
              className="inline-flex items-center justify-center gap-2.5 border border-white/30 text-white px-8 py-4 text-sm tracking-wide hover:border-gold hover:text-gold transition-colors duration-300"
            >
              <Phone className="w-4 h-4" strokeWidth={1.75} aria-hidden />
              Call {business.phoneDisplay}
            </a>
          </div>

          <a
            href={business.booksy}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
          >
            <span className="flex text-gold" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </span>
            {business.rating} from {business.reviewCount} Booksy reviews
          </a>
        </div>
      </div>

      <a
        href="#services"
        aria-label="Scroll to services"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-30 text-white/60 hover:text-gold"
      >
        <ArrowDown className="w-5 h-5" />
      </a>
    </section>
  )
}
