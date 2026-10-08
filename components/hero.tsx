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
 * Cinematic hero: the section is taller than the screen and its stage stays pinned while you scroll.
 * Scene 1 (headline) tilts and lifts away, the camera pushes in on the studio, then scene 2 (the
 * assistant pitch) fades up. Scroll is never hijacked; everything is driven by scroll position.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const shadeRef = useRef<HTMLDivElement>(null)
  const gradeRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const bankRef = useRef<HTMLImageElement>(null)
  const wispsRef = useRef<HTMLDivElement>(null)
  const jetRef = useRef<HTMLImageElement>(null)
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

      // Timeline: headline out → pilot seat reveal → climb into clouds → white-out → clouds clear into the page
      // Services overlaps the last 60svh (from p≈0.75), so the white-out must be done by then.
      const out = span(p, 0, 0.22)
      const inn = span(p, 0.2, 0.4)
      const climb = span(p, 0.5, 0.66)
      const white = span(p, 0.62, 0.74)
      const clear = span(p, 0.74, 1)

      // The reveal: camera pulls back and the grade lifts so the pilot seat and captain's hat take the frame
      // Wide screens: slide the seat right so the caption can sit beside it. All screens: drop it so the hat clears the nav.
      const wide = stageW >= 1024
      if (bgRef.current)
        bgRef.current.style.transform = `translate(${wide ? inn * 17 : 0}%, ${inn * 15}%) scale(${(1.14 - inn * 0.2) * (1 + climb * 0.15)})`
      if (shadeRef.current) shadeRef.current.style.opacity = String(0.4 - inn * 0.36)
      if (gradeRef.current) gradeRef.current.style.opacity = String(1 - inn * 0.7)
      if (sceneOneRef.current) {
        sceneOneRef.current.style.transform = `translateY(${out * -90}px) rotateX(${out * 28}deg) scale(${1 - out * 0.12})`
        sceneOneRef.current.style.opacity = String(1 - out)
        sceneOneRef.current.style.filter = `blur(${out * 8}px)`
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
      // Thin wisps that drift past in front of the jet (faster parallax than the back layer)
      if (wispsFrontRef.current) {
        wispsFrontRef.current.style.opacity = String(0.4 * span(p, 0.6, 0.7) * (1 - span(p, 0.76, 0.9)))
        wispsFrontRef.current.style.transform = `translate3d(${(0.5 - span(p, 0.58, 0.9)) * 30}%, 0, 0) scale(${1.2 + clear * 0.6})`
      }
      // The jet crosses left to right through the clouds, climbing slightly and growing as it nears
      if (jetRef.current) {
        const fly = span(p, 0.58, 0.83)
        const w = jetRef.current.offsetWidth
        const x = -w + fly * (stageW + w * 1.1)
        const y = (0.5 - fly) * stageH * 0.16
        jetRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${-2 - fly * 3}deg) scale(${0.85 + fly * 0.3})`
        jetRef.current.style.opacity = String(fly > 0 && fly < 1 ? Math.min(1, fly * 10, (1 - fly) * 10) : 0)
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
    <section id="hero" ref={sectionRef} className="relative h-[340svh] mb-[-60svh] motion-reduce:h-[100svh] motion-reduce:mb-0 bg-black">
      <div ref={stageRef} data-hero="stage" className="sticky top-0 h-[100svh] overflow-hidden" style={{ perspective: "1200px" }}>
        {/* Camera: slow drift (CSS) inside a scroll-driven push-in (JS) */}
        <div ref={bgRef} data-hero="bg" className="absolute inset-0 will-change-transform" style={{ transform: "scale(1.14)" }}>
          <img
            src="/biz/pilot-chair.jpg"
            alt="The studio barber chair styled as a pilot seat, with a First Class Cutz cape and a captain's hat"
            className="hero-drift w-full h-full object-cover object-[50%_38%]"
            fetchPriority="high"
          />
        </div>

        {/* Grade: base darkening and shade (both lift during the reveal), vignette, gold light leak, grain, letterbox */}
        <div
          ref={gradeRef}
          data-hero="grade"
          className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/35 to-black/90"
          aria-hidden
        />
        <div ref={shadeRef} data-hero="shade" className="absolute inset-0 bg-black opacity-40" aria-hidden />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.75)_100%)]"
          aria-hidden
        />
        <div className="hero-leak absolute -inset-1/4 pointer-events-none" aria-hidden />
        <div className="hero-grain absolute inset-0 pointer-events-none" aria-hidden />

        {/* Flight out: page-colored fill (matches Services), the jet, then two cloud layers in front of it */}
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
          <img src="/biz/cloud-wisps.webp" alt="" className="absolute inset-0 w-full h-full object-cover" />
          <img
            src="/biz/cloud-wisps.webp"
            alt=""
            className="absolute inset-0 w-full h-full object-cover -scale-x-100 translate-y-[18%] opacity-80"
          />
        </div>
        <img
          ref={bankRef}
          data-hero="bank"
          src="/biz/cloud-bank.webp"
          alt=""
          aria-hidden
          className="absolute -left-[15%] -bottom-[10%] w-[130%] h-[120%] max-w-none object-cover object-bottom opacity-0 pointer-events-none will-change-transform"
          style={{ transform: "translateY(70%)" }}
        />
        <img
          ref={jetRef}
          data-hero="jet"
          src="/biz/jet.webp"
          alt=""
          aria-hidden
          className="absolute left-0 top-[30%] w-[72vw] sm:w-[48vw] lg:w-[40vw] max-w-[760px] opacity-0 pointer-events-none will-change-transform drop-shadow-[0_18px_30px_rgba(60,45,20,0.25)]"
        />
        <div
          ref={wispsFrontRef}
          data-hero="wisps-front"
          className="absolute -inset-[20%] opacity-0 pointer-events-none will-change-transform"
          aria-hidden
        >
          <img src="/biz/cloud-wisps.webp" alt="" className="absolute inset-0 w-full h-full object-cover -scale-y-100" />
        </div>

        <div className="hero-bar absolute inset-x-0 top-0 h-[7vh] bg-black" aria-hidden />
        <div className="hero-bar-bottom absolute inset-x-0 bottom-0 h-[7vh] bg-black" aria-hidden />

        {/* Scene 1: the headline */}
        <div
          ref={sceneOneRef} data-hero="one"
          className="absolute inset-0 flex items-center justify-center px-5 will-change-transform"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="max-w-5xl mx-auto text-center pt-10">
            <p className="hero-in [--d:200ms] inline-flex items-center gap-3 text-[11px] md:text-xs tracking-[0.35em] uppercase text-gold-light mb-8">
              <span className="hero-rule h-px w-10 bg-gold/70" aria-hidden />
              Baltimore Barber Studio
              <span className="hero-rule h-px w-10 bg-gold/70" aria-hidden />
            </p>

            <h1 className="text-[3.5rem] leading-[0.95] sm:text-7xl lg:text-[7.5rem] font-medium text-balance text-white tracking-tight mb-8">
              <span className="block overflow-hidden pb-2">
                <span className="hero-rise block [--d:450ms]">Every cut,</span>
              </span>
              <span className="block overflow-hidden pb-3">
                <span className="hero-rise block [--d:700ms] font-serif italic font-normal">
                  <span className="hero-gold-text pr-2">flown first class.</span>
                </span>
              </span>
            </h1>

            <p className="hero-in [--d:1100ms] text-white/75 text-base md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
              Precision fades, beard work and locs by Reem.
            </p>

            <div className="hero-in [--d:1300ms] flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center max-w-sm sm:max-w-none mx-auto">
              <TalkButton className="inline-flex items-center justify-center gap-2.5 bg-gold text-primary font-semibold px-8 py-4 text-sm tracking-wide hover:bg-gold-light transition-colors duration-300">
                Talk to our assistant
              </TalkButton>
              <a
                href={business.phoneHref}
                className="inline-flex items-center justify-center gap-2.5 border border-white/30 text-white px-8 py-4 text-sm tracking-wide hover:border-gold hover:text-gold transition-colors duration-300 backdrop-blur-sm"
              >
                <Phone className="w-4 h-4" strokeWidth={1.75} aria-hidden />
                Call {business.phoneDisplay}
              </a>
              <BooksyButton className="inline-flex items-center justify-center gap-2.5 border border-gold/60 text-gold-light px-8 py-4 text-sm tracking-wide hover:bg-gold hover:text-primary transition-colors duration-300 backdrop-blur-sm" />
            </div>
          </div>
        </div>

        {/* Scene 2: the assistant pitch, revealed as you scroll */}
        <div
          ref={sceneTwoRef} data-hero="two"
          className="absolute inset-0 flex items-end justify-center px-5 pb-[5vh] lg:items-center lg:justify-start lg:pb-0 lg:pl-[7vw] opacity-0 pointer-events-none"
        >
          {/* Keeps the caption legible while leaving the seat itself clear */}
          <div
            className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black via-black/80 to-transparent lg:inset-y-0 lg:left-0 lg:right-auto lg:h-full lg:w-[55%] lg:bg-gradient-to-r"
            aria-hidden
          />
          <div className="relative max-w-3xl lg:max-w-md mx-auto lg:mx-0 text-center lg:text-left">
            <p className="text-[11px] md:text-xs tracking-[0.35em] uppercase text-gold-light mb-4">
              Now boarding
            </p>
            <p className="text-3xl sm:text-5xl lg:text-[3.5rem] font-medium tracking-tight text-white text-balance leading-[1.05] mb-4">
              Book your seat in <span className="font-serif italic font-normal hero-gold-text">one conversation.</span>
            </p>
            <p className="text-white/70 text-sm md:text-lg max-w-lg mx-auto lg:mx-0 mb-7">
              Our voice assistant knows every service and Reem&apos;s real openings. Just ask.
            </p>
            <TalkButton className="hero-pulse inline-flex items-center justify-center gap-3 rounded-full bg-gold text-primary font-semibold pl-3 pr-7 py-3 text-sm tracking-wide hover:bg-gold-light transition-colors">
              Start talking
            </TalkButton>
            <p className="mt-5 text-sm text-white/65 flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2">
              <span>Prefer another way?</span>
              <BooksyButton className="inline-flex items-center gap-1.5 text-gold-light underline decoration-gold/60 underline-offset-4 hover:text-gold" />
              <a href={business.phoneHref} className="inline-flex items-center gap-1.5 text-white/85 underline decoration-white/30 underline-offset-4 hover:text-white">
                <Phone className="w-3.5 h-3.5" aria-hidden />
                Call
              </a>
            </p>
            <a
              href={business.booksy}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 hidden sm:flex items-center justify-center lg:justify-start gap-2 text-sm text-white/70 hover:text-white transition-colors"
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
          ref={cueRef} data-hero="cue"
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
