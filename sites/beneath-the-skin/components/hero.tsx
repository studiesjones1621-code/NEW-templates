"use client"

import { useEffect, useRef } from "react"
import { ArrowDown, Phone } from "lucide-react"
import { business } from "@/lib/business"
import { onLenisScroll } from "@/lib/scroll"
import { TalkButton } from "./talk-button"
import { BooksyButton } from "./booksy-button"

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))
// Maps overall progress p into 0..1 across [start, end]
const span = (p: number, start: number, end: number) => clamp((p - start) / (end - start))
// Fully transparent layers are also hidden, so the browser stops compositing them (a big win on phones)
const fade = (el: HTMLElement, o: number) => {
  el.style.opacity = String(o)
  el.style.visibility = o > 0.001 ? "visible" : "hidden"
}

/**
 * Cinematic hero, "Beneath the Skin": Katrina sits in her real Ellicott City studio. On scroll the headline tilts away
 * and the camera settles on her, then we sink beneath the skin's surface: soft collagen fibers rise up through the
 * frame with glowing cells drifting past, and the fibers clear into Services. Scroll is never hijacked.
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
  const wispsFrontRef = useRef<HTMLDivElement>(null)
  const sceneOneRef = useRef<HTMLDivElement>(null)
  const sceneTwoRef = useRef<HTMLDivElement>(null)
  const cueRef = useRef<HTMLAnchorElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let frame = 0
    let lastP = -1

    const update = (force = false) => {
      frame = 0
      const rect = section.getBoundingClientRect()
      // Measure against the pinned stage (100svh, fixed), not innerHeight, which jumps when mobile
      // browser bars show/hide and would make the whole hero jolt.
      const stageH = stageRef.current?.offsetHeight || window.innerHeight
      const stageW = stageRef.current?.offsetWidth || window.innerWidth
      const travel = section.offsetHeight - stageH
      const p = reduce ? 0 : clamp(-rect.top / Math.max(travel, 1))
      const wide = stageW >= 1024
      // Nothing moved (e.g. scrolling further down the page): skip all style writes
      if (p === lastP && !force) return
      lastP = p
      // While the hero's own buttons are on screen, the assistant pop-up waits (it would cover them on phones)
      document.documentElement.classList.toggle("hero-active", p < 0.56)

      // Timeline: headline out → settle on Katrina → collagen fibers rise → glow → the fibers clear into the page.
      // Services overlaps the last 60svh (from p≈0.75), so the white-out must be done by then.
      const out = span(p, 0, 0.22)
      const inn = span(p, 0.2, 0.4)
      const climb = span(p, 0.5, 0.66)
      const white = span(p, 0.62, 0.74)
      const clear = span(p, 0.74, 1)

      if (bgRef.current) bgRef.current.style.transform = `scale(${(1.12 - inn * 0.08) * (1 + climb * 0.12)})`
      if (subjectRef.current) {
        // Mobile: Katrina sits softly behind the headline, then comes forward for the reveal
        const baseOpacity = wide ? 1 : 0.45 + inn * 0.55
        fade(subjectRef.current, baseOpacity * (1 - span(p, 0.48, 0.6)))
        subjectRef.current.style.transform = `translate3d(${wide ? inn * -4 : 0}%, ${climb * 8}%, 0) scale(${1 + inn * 0.05})`
      }
      if (shadeRef.current) fade(shadeRef.current, 0.35 - inn * 0.25)
      if (gradeRef.current) fade(gradeRef.current, 1 - inn * 0.5)
      if (sceneOneRef.current) {
        sceneOneRef.current.style.transform = `translateY(${out * -90}px) rotateX(${out * 28}deg) scale(${1 - out * 0.12})`
        fade(sceneOneRef.current, 1 - out)
        sceneOneRef.current.style.pointerEvents = out > 0.6 ? "none" : "auto"
      }
      if (sceneTwoRef.current) {
        sceneTwoRef.current.style.transform = `translateY(${(1 - inn) * 60}px)`
        const two = inn * (1 - span(p, 0.46, 0.54))
        fade(sceneTwoRef.current, two)
        sceneTwoRef.current.style.pointerEvents = two > 0.4 ? "auto" : "none"
      }
      if (cueRef.current) fade(cueRef.current, 1 - span(p, 0, 0.15))
      if (bankRef.current) {
        fade(bankRef.current, Math.min(1, climb * 1.5) * (1 - clear))
        bankRef.current.style.transform = `translateY(${70 - climb * 75 - clear * 30}%) scale(${1 + climb * 0.15 + clear * 0.5})`
      }
      if (wispsRef.current) {
        fade(wispsRef.current, span(p, 0.54, 0.68) * (1 - clear))
        wispsRef.current.style.transform = `translateY(${(1 - climb) * 25}%) scale(${1.1 + climb * 0.3 + clear * 0.7})`
      }
      if (fillRef.current) fade(fillRef.current, white)
      // Title card while we're "beneath the skin": fades in among the fibers, drifts up and out before Services
      if (titleRef.current) {
        const t = span(p, 0.56, 0.64) * (1 - span(p, 0.72, 0.8))
        fade(titleRef.current, t)
        titleRef.current.style.transform = `translateY(${(1 - span(p, 0.56, 0.8)) * 40 - 20}px) scale(${0.96 + span(p, 0.56, 0.8) * 0.08})`
      }
      // Cells drifting past in front (faster parallax than the back layer)
      if (wispsFrontRef.current) {
        fade(wispsFrontRef.current, 0.3 * span(p, 0.6, 0.7) * (1 - span(p, 0.78, 0.92)))
        wispsFrontRef.current.style.transform = `translate3d(0, ${(0.5 - span(p, 0.58, 0.92)) * 30}%, 0) scale(${1.2 + clear * 0.6})`
      }
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(() => update())
    }
    const onResize = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => update(true))
    }
    update(true)
    // Same-frame updates while Lenis drives the scroll; native scroll events cover everything else
    const offLenis = onLenisScroll(() => {
      cancelAnimationFrame(frame)
      update()
    })
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize)
    return () => {
      offLenis()
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section id="hero" ref={sectionRef} className="relative h-[340svh] mb-[-60svh] motion-reduce:h-[100svh] motion-reduce:mb-0 bg-[#2a211c]">
      <div ref={stageRef} data-hero="stage" className="sticky top-0 h-[100svh] overflow-hidden" style={{ perspective: "1200px" }}>
        {/* The set: their real studio lounge (pre-softened), with a slow camera drift */}
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
          className="absolute inset-0 bg-gradient-to-b from-[#2a211c]/65 via-[#2a211c]/5 to-[#2a211c]/80"
          aria-hidden
        />
        <div ref={shadeRef} data-hero="shade" className="absolute inset-0 bg-[#2a211c] opacity-35" aria-hidden />

        {/* Katrina, seated in her studio chair (real photo, cut out) */}
        <div
          ref={subjectRef}
          data-hero="subject"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:right-[9vw] h-[70svh] lg:h-[84svh] will-change-transform origin-bottom"
        >
          <img
            src="/biz/katrina-cutout.webp"
            alt={`${business.owner}, ${business.credentials}, founder of ${business.name}`}
            className="h-full w-auto max-w-none"
            fetchPriority="high"
          />
        </div>

        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(30,22,18,0.7)_100%)]"
          aria-hidden
        />
        <div className="hero-leak absolute -inset-1/4 pointer-events-none" aria-hidden />
        <div className="hero-grain absolute inset-0 pointer-events-none" aria-hidden />

        {/* Signature moment: page-colored fill (matches Services), cells, rising collagen fibers, then cells in front */}
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
          <picture><source media="(max-width: 1023px)" srcSet="/biz/cells-m.webp" /><img src="/biz/cells.webp" alt="" className="absolute inset-0 w-full h-full object-cover" /></picture>
          <picture><source media="(max-width: 1023px)" srcSet="/biz/cells-m.webp" /><img
            src="/biz/cells.webp"
            alt=""
            className="hidden lg:block absolute inset-0 w-full h-full object-cover -scale-x-100 translate-y-[18%] opacity-70"
          /></picture>
        </div>
        <picture><source media="(max-width: 1023px)" srcSet="/biz/skin-layers-m.webp" /><img
          ref={bankRef}
          data-hero="bank"
          src="/biz/skin-layers.webp"
          alt=""
          aria-hidden
          className="absolute -left-[15%] -bottom-[10%] w-[130%] h-[120%] max-w-none object-cover object-bottom opacity-0 pointer-events-none will-change-transform"
          style={{ transform: "translateY(70%)" }}
        /></picture>
        <div
          ref={wispsFrontRef}
          data-hero="wisps-front"
          className="absolute -inset-[20%] opacity-0 pointer-events-none will-change-transform"
          aria-hidden
        >
          <picture><source media="(max-width: 1023px)" srcSet="/biz/cells-m.webp" /><img src="/biz/cells.webp" alt="" className="absolute inset-0 w-full h-full object-cover -scale-y-100" /></picture>
        </div>

        <div
          ref={titleRef}
          data-hero="title"
          aria-hidden
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 opacity-0 pointer-events-none will-change-transform"
        >
          <p className="text-[11px] md:text-xs tracking-[0.4em] uppercase text-gold-deep mb-4">Beneath the surface</p>
          <p className="font-serif text-5xl md:text-7xl lg:text-8xl text-primary leading-[0.95] tracking-tight [text-shadow:0_2px_30px_rgba(255,246,236,0.9)]">
            Where real healing <span className="italic text-gold-deep">begins.</span>
          </p>
        </div>

        <div className="hero-bar absolute inset-x-0 top-0 h-[7vh] bg-[#2a211c]" aria-hidden />
        <div className="hero-bar-bottom absolute inset-x-0 bottom-0 h-[7vh] bg-[#2a211c]" aria-hidden />

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
              Acne · Facials · Corrective Skin · Wellness
              <span className="hero-rule h-px w-10 bg-gold/70 lg:hidden" aria-hidden />
            </p>

            <h1 className="text-[3.6rem] leading-[0.92] sm:text-7xl lg:text-[7rem] font-serif font-medium text-balance text-white tracking-tight mb-7">
              <span className="block overflow-hidden pb-2">
                <span className="hero-rise block [--d:450ms]">Shine beyond</span>
              </span>
              <span className="block overflow-hidden pb-3">
                <span className="hero-rise block [--d:700ms] italic font-normal">
                  <span className="hero-gold-text pr-3">skin deep.</span>
                </span>
              </span>
            </h1>

            <p className="hero-in [--d:1100ms] text-white/80 text-base md:text-xl max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
              Root-cause acne healing, corrective facials and advanced skin treatments with {business.owner},{" "}
              {business.credentials}, in Ellicott City. Because skincare is not just surface work.
            </p>

            <div className="hero-in [--d:1300ms] flex flex-col sm:flex-row sm:flex-wrap gap-3 justify-center lg:justify-start items-stretch sm:items-center max-w-sm sm:max-w-none mx-auto lg:mx-0">
              <TalkButton className="inline-flex items-center justify-center gap-2.5 bg-gold text-primary font-medium px-8 py-4 text-sm tracking-wide hover:bg-gold-light transition-colors duration-300">
                Talk to our assistant
              </TalkButton>
              <a
                href={business.phoneHref}
                className="inline-flex items-center justify-center gap-2.5 border border-white/30 text-white px-8 py-4 text-sm tracking-wide hover:border-gold hover:text-gold transition-colors duration-300 bg-[#2a211c]/30"
              >
                <Phone className="w-4 h-4" strokeWidth={1.75} aria-hidden />
                Call {business.phoneDisplay}
              </a>
              <BooksyButton className="inline-flex items-center justify-center gap-2.5 border border-gold/60 text-gold-light px-8 py-4 text-sm tracking-wide hover:bg-gold hover:text-primary transition-colors duration-300 bg-[#2a211c]/30" />
            </div>
          </div>
        </div>

        {/* Scene 2: the first-visit pitch, revealed as you scroll */}
        <div
          ref={sceneTwoRef}
          data-hero="two"
          className="absolute inset-0 flex items-end justify-center px-5 pb-24 lg:items-center lg:justify-start lg:pb-0 lg:pl-[7vw] opacity-0 pointer-events-none"
        >
          <div
            className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-[#2a211c] via-[#2a211c]/80 to-transparent lg:inset-y-0 lg:left-0 lg:right-auto lg:h-full lg:w-[55%] lg:bg-gradient-to-r"
            aria-hidden
          />
          <div className="relative max-w-3xl lg:max-w-md mx-auto lg:mx-0 text-center lg:text-left">
            <p className="text-[11px] md:text-xs tracking-[0.35em] uppercase text-gold-light mb-4">New here? Intro Custom Facial · $99</p>
            <p className="font-serif text-4xl sm:text-5xl lg:text-[3.6rem] font-medium tracking-tight text-white text-balance leading-[1.02] mb-4">
              Skincare is <span className="italic font-normal hero-gold-text">soul work.</span>
            </p>
            <p className="text-white/75 text-sm md:text-lg max-w-lg mx-auto lg:mx-0 mb-7">
              Our assistant knows every treatment and price, and can book your first visit with Katrina. Just ask.
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
