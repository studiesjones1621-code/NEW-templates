"use client"

import { useEffect, useRef } from "react"
import { ArrowDown, Phone, Star } from "lucide-react"
import { business } from "@/lib/business"
import { TalkButton } from "./talk-button"
import { BooksyButton } from "./booksy-button"

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))
// Maps overall progress p into 0..1 across [start, end]
const span = (p: number, start: number, end: number) => clamp((p - start) / (end - start))

/**
 * Cinematic hero, "Bring out your charm": Olga sits in a golden-hour studio. On scroll the headline tilts away and
 * the camera settles on her, then a wave of rich skincare cream surges up, a gold filler syringe (their signature
 * injectables) rises through floating serum droplets and gold shimmer, and the cream clears into Services.
 * Scroll is never hijacked.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const subjectRef = useRef<HTMLDivElement>(null)
  const shadeRef = useRef<HTMLDivElement>(null)
  const gradeRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const bankRef = useRef<HTMLImageElement>(null)
  const wispsRef = useRef<HTMLDivElement>(null)
  const emblemRef = useRef<HTMLImageElement>(null)
  const wispsFrontRef = useRef<HTMLDivElement>(null)
  const sceneOneRef = useRef<HTMLDivElement>(null)
  const sceneTwoRef = useRef<HTMLDivElement>(null)
  const cueRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let frame = 0

    const update = () => {
      frame = 0
      const rect = section.getBoundingClientRect()
      // Measure against the pinned stage (100svh, fixed), not innerHeight, which jumps when mobile
      // browser bars show/hide and would make the whole hero jolt.
      const stageH = stageRef.current?.offsetHeight || window.innerHeight
      const stageW = stageRef.current?.offsetWidth || window.innerWidth
      const travel = section.offsetHeight - stageH
      const p = reduce ? 0 : clamp(-rect.top / Math.max(travel, 1))
      const wide = stageW >= 1024

      // Timeline: headline out → settle on Olga → cream wave rises → syringe ascends → white-out → cream clears into the page.
      // Services overlaps the last 60svh (from p≈0.75), so the white-out must be done by then.
      const out = span(p, 0, 0.22)
      const inn = span(p, 0.2, 0.4)
      const climb = span(p, 0.5, 0.66)
      const white = span(p, 0.62, 0.74)
      const clear = span(p, 0.74, 1)

      if (bgRef.current) bgRef.current.style.transform = `scale(${(1.12 - inn * 0.08) * (1 + climb * 0.12)})`
      if (subjectRef.current) {
        // Mobile: Olga sits softly behind the headline, then comes forward for the reveal
        const baseOpacity = wide ? 1 : 0.45 + inn * 0.55
        subjectRef.current.style.opacity = String(baseOpacity * (1 - span(p, 0.48, 0.6)))
        subjectRef.current.style.transform = `translate3d(${wide ? inn * -4 : 0}%, ${climb * 8}%, 0) scale(${1 + inn * 0.05})`
      }
      if (shadeRef.current) shadeRef.current.style.opacity = String(0.35 - inn * 0.25)
      if (gradeRef.current) gradeRef.current.style.opacity = String(1 - inn * 0.5)
      if (sceneOneRef.current) {
        sceneOneRef.current.style.transform = `translateY(${out * -90}px) rotateX(${out * 28}deg) scale(${1 - out * 0.12})`
        sceneOneRef.current.style.opacity = String(1 - out)
        sceneOneRef.current.style.pointerEvents = out > 0.6 ? "none" : "auto"
      }
      if (sceneTwoRef.current) {
        sceneTwoRef.current.style.transform = `translateY(${(1 - inn) * 60}px)`
        const two = inn * (1 - span(p, 0.46, 0.54))
        sceneTwoRef.current.style.opacity = String(two)
        sceneTwoRef.current.style.pointerEvents = two > 0.4 ? "auto" : "none"
      }
      if (cueRef.current) cueRef.current.style.opacity = String(1 - span(p, 0, 0.15))
      if (bankRef.current) {
        bankRef.current.style.opacity = String(Math.min(1, climb * 1.5) * (1 - clear))
        bankRef.current.style.transform = `translateY(${70 - climb * 75 - clear * 30}%) scale(${1 + climb * 0.15 + clear * 0.5})`
      }
      if (wispsRef.current) {
        wispsRef.current.style.opacity = String(span(p, 0.54, 0.68) * (1 - clear))
        wispsRef.current.style.transform = `translateY(${(1 - climb) * 25}%) scale(${1.1 + climb * 0.3 + clear * 0.7})`
      }
      if (fillRef.current) fillRef.current.style.opacity = String(white)
      // Gold shimmer drifting past in front of the syringe (faster parallax than the back layer)
      if (wispsFrontRef.current) {
        wispsFrontRef.current.style.opacity = String(0.3 * span(p, 0.6, 0.7) * (1 - span(p, 0.78, 0.92)))
        wispsFrontRef.current.style.transform = `translate3d(0, ${(0.5 - span(p, 0.58, 0.92)) * 30}%, 0) scale(${1.2 + clear * 0.6})`
      }
      // The signature moment: the syringe rises out of the cream to the centre, then lifts away as it clears
      if (emblemRef.current) {
        const rise = span(p, 0.56, 0.86)
        const w = emblemRef.current.offsetWidth
        const h = emblemRef.current.offsetHeight
        const x = (stageW - w) / 2
        const ease = 1 - Math.pow(1 - Math.min(1, rise / 0.6), 3) // decelerate into the centre
        const lift = span(rise, 0.7, 1)
        const y = stageH * 0.95 - ease * (stageH * 0.95 - (stageH - h) / 2) - lift * stageH * 0.25
        emblemRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${Math.sin(rise * Math.PI * 2) * 3}deg) scale(${0.75 + ease * 0.3 + lift * 0.15})`
        emblemRef.current.style.opacity = String(rise > 0 && rise < 1 ? Math.min(1, rise * 8, (1 - rise) * 6) : 0)
      }
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
    <section id="hero" ref={sectionRef} className="relative h-[340svh] mb-[-60svh] motion-reduce:h-[100svh] motion-reduce:mb-0 bg-[#17241e]">
      <div ref={stageRef} data-hero="stage" className="sticky top-0 h-[100svh] overflow-hidden" style={{ perspective: "1200px" }}>
        {/* The set: a golden-hour ivory studio, with a slow camera drift */}
        <div ref={bgRef} data-hero="bg" className="absolute inset-0 will-change-transform" style={{ transform: "scale(1.12)" }}>
          <img
            src="/biz/hero-set.jpg"
            alt=""
            aria-hidden
            className="hero-drift w-full h-full object-cover object-[50%_45%]"
            fetchPriority="high"
          />
        </div>

        <div
          ref={gradeRef}
          data-hero="grade"
          className="absolute inset-0 bg-gradient-to-b from-[#17241e]/65 via-[#17241e]/5 to-[#17241e]/80"
          aria-hidden
        />
        <div ref={shadeRef} data-hero="shade" className="absolute inset-0 bg-[#17241e] opacity-35" aria-hidden />

        {/* Olga, seated (real photo, cut out) */}
        <div
          ref={subjectRef}
          data-hero="subject"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-[9vw] h-[70svh] lg:h-[84svh] will-change-transform origin-bottom"
        >
          <img
            src="/biz/olga-cutout.webp"
            alt={`${business.owner}, ${business.credentials}, founder of ${business.name}, in her white coat`}
            className="h-full w-auto max-w-none"
            fetchPriority="high"
          />
        </div>

        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(16,26,21,0.7)_100%)]"
          aria-hidden
        />
        <div className="hero-leak absolute -inset-1/4 pointer-events-none" aria-hidden />
        <div className="hero-grain absolute inset-0 pointer-events-none" aria-hidden />

        {/* Signature moment: page-colored fill (matches Services), serum droplets, cream wave, the syringe, then gold shimmer in front */}
        <div
          ref={fillRef}
          data-hero="fill"
          className="absolute inset-0 opacity-0"
          style={{ background: "var(--sky)" }}
          aria-hidden
        />
        <div
          ref={wispsRef}
          data-hero="wisps"
          className="absolute -inset-[15%] opacity-0 pointer-events-none will-change-transform"
          aria-hidden
        >
          <img src="/biz/droplets.webp" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <img
            src="/biz/droplets.webp"
            alt=""
            className="absolute inset-0 w-full h-full object-cover -scale-x-100 translate-y-[18%] opacity-70"
          />
        </div>
        <img
          ref={bankRef}
          data-hero="bank"
          src="/biz/cream-bank.webp"
          alt=""
          aria-hidden
          className="absolute -left-[15%] -bottom-[10%] w-[130%] h-[120%] max-w-none object-cover object-bottom opacity-0 pointer-events-none will-change-transform"
          style={{ transform: "translateY(70%)" }}
        />
        <img
          ref={emblemRef}
          data-hero="emblem"
          src="/biz/syringe.webp"
          alt=""
          aria-hidden
          className="absolute left-0 top-0 w-[78vw] sm:w-[52vw] lg:w-[34vw] max-w-[620px] opacity-0 pointer-events-none will-change-transform"
        />
        <div
          ref={wispsFrontRef}
          data-hero="wisps-front"
          className="absolute -inset-[20%] opacity-0 pointer-events-none will-change-transform"
          aria-hidden
        >
          <img src="/biz/shimmer.webp" alt="" className="absolute inset-0 w-full h-full object-cover -scale-y-100" />
        </div>

        <div className="hero-bar absolute inset-x-0 top-0 h-[7vh] bg-[#17241e]" aria-hidden />
        <div className="hero-bar-bottom absolute inset-x-0 bottom-0 h-[7vh] bg-[#17241e]" aria-hidden />

        {/* Scene 1: the headline */}
        <div
          ref={sceneOneRef}
          data-hero="one"
          className="absolute inset-0 flex items-center justify-center lg:justify-start px-5 lg:pl-[7vw] will-change-transform"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="max-w-3xl text-center lg:text-left pt-10">
            <p className="hero-in [--d:200ms] inline-flex items-center gap-3 text-[11px] md:text-xs tracking-[0.35em] uppercase text-gold-light mb-7">
              <span className="hero-rule h-px w-10 bg-gold/70" aria-hidden />
              Botox · Fillers · Sculptra · Weight Loss
              <span className="hero-rule h-px w-10 bg-gold/70 lg:hidden" aria-hidden />
            </p>

            <h1 className="text-[3.6rem] leading-[0.92] sm:text-7xl lg:text-[7rem] font-serif font-medium text-balance text-white tracking-tight mb-7">
              <span className="block overflow-hidden pb-2">
                <span className="hero-rise block [--d:450ms]">Bring out</span>
              </span>
              <span className="block overflow-hidden pb-3">
                <span className="hero-rise block [--d:700ms] italic font-normal">
                  <span className="hero-gold-text pr-3">your charm.</span>
                </span>
              </span>
            </h1>

            <p className="hero-in [--d:1100ms] text-white/80 text-base md:text-xl max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
              Injectables, collagen biostimulators, medical-grade skin and GLP-1 weight loss with {business.owner},{" "}
              {business.credentials}, in Rosedale. Natural results, never overdone.
            </p>

            <div className="hero-in [--d:1300ms] flex flex-col sm:flex-row sm:flex-wrap gap-3 justify-center lg:justify-start items-stretch sm:items-center max-w-sm sm:max-w-none mx-auto lg:mx-0">
              <TalkButton className="inline-flex items-center justify-center gap-2.5 bg-gold text-primary font-medium px-8 py-4 text-sm tracking-wide hover:bg-gold-light transition-colors duration-300">
                Talk to our assistant
              </TalkButton>
              <a
                href={business.phoneHref}
                className="inline-flex items-center justify-center gap-2.5 border border-white/30 text-white px-8 py-4 text-sm tracking-wide hover:border-gold hover:text-gold transition-colors duration-300 bg-[#17241e]/30"
              >
                <Phone className="w-4 h-4" strokeWidth={1.75} aria-hidden />
                Call {business.phoneDisplay}
              </a>
              <BooksyButton className="inline-flex items-center justify-center gap-2.5 border border-gold/60 text-gold-light px-8 py-4 text-sm tracking-wide hover:bg-gold hover:text-primary transition-colors duration-300 bg-[#17241e]/30" />
            </div>
          </div>
        </div>

        {/* Scene 2: the first-visit pitch, revealed as you scroll */}
        <div
          ref={sceneTwoRef}
          data-hero="two"
          className="absolute inset-0 flex items-end justify-center px-5 pb-[5vh] lg:items-center lg:justify-start lg:pb-0 lg:pl-[7vw] opacity-0 pointer-events-none"
        >
          <div
            className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-[#17241e] via-[#17241e]/80 to-transparent lg:inset-y-0 lg:left-0 lg:right-auto lg:h-full lg:w-[55%] lg:bg-gradient-to-r"
            aria-hidden
          />
          <div className="relative max-w-3xl lg:max-w-md mx-auto lg:mx-0 text-center lg:text-left">
            <p className="text-[11px] md:text-xs tracking-[0.35em] uppercase text-gold-light mb-4">Free injectables consultation</p>
            <p className="font-serif text-4xl sm:text-5xl lg:text-[3.6rem] font-medium tracking-tight text-white text-balance leading-[1.02] mb-4">
              Natural results start with <span className="italic font-normal hero-gold-text">a plan.</span>
            </p>
            <p className="text-white/75 text-sm md:text-lg max-w-lg mx-auto lg:mx-0 mb-7">
              Our assistant knows every treatment and price, and can book your free consult with Olga. Just ask.
            </p>
            <TalkButton className="hero-pulse inline-flex items-center justify-center gap-3 rounded-full bg-gold text-primary font-medium pl-3 pr-7 py-3 text-sm tracking-wide hover:bg-gold-light transition-colors">
              Start talking
            </TalkButton>
            <p className="mt-5 text-sm text-white/65 flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2">
              <span>Prefer another way?</span>
              <BooksyButton className="inline-flex items-center gap-1.5 text-gold-light underline decoration-gold/60 underline-offset-4 hover:text-gold" />
              <a
                href={business.phoneHref}
                className="inline-flex items-center gap-1.5 text-white/85 underline decoration-white/30 underline-offset-4 hover:text-white"
              >
                <Phone className="w-3.5 h-3.5" aria-hidden />
                Call
              </a>
            </p>
            <p className="mt-6 hidden sm:flex items-center justify-center lg:justify-start gap-2 text-sm text-white/70">
              <span className="flex text-gold" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </span>
              {business.rating} from {business.reviewCount} {business.reviewSource} reviews
            </p>
          </div>
        </div>

        <a
          ref={cueRef}
          data-hero="cue"
          href="#services"
          aria-label="Skip to services"
          className="absolute bottom-[9vh] left-1/2 -translate-x-1/2 z-30 text-white/60 hover:text-gold text-[10px] tracking-[0.3em] uppercase"
        >
          {/* Entrance animation lives on the inner span so it can't override the scroll fade on the link */}
          <span className="hero-in [--d:1700ms] flex flex-col items-center gap-2">
            Scroll
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </span>
        </a>
      </div>
    </section>
  )
}
