"use client"

import { useEffect, useRef } from "react"
import { ArrowDown, Phone, Star } from "lucide-react"
import { business } from "@/lib/business"
import { TalkButton } from "./talk-button"
import { BooksyButton } from "./booksy-button"
import { onLenisScroll, supportsScrollTimelines } from "@/lib/scroll"

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))
// Maps overall progress p into 0..1 across [start, end]
const span = (p: number, start: number, end: number) => clamp((p - start) / (end - start))
// Fully transparent layers are also hidden, so the browser stops compositing them (a big win on phones)
const fade = (el: HTMLElement, o: number) => {
  el.style.opacity = String(o)
  el.style.visibility = o > 0.001 ? "visible" : "hidden"
}

type Layer = "bg" | "shade" | "grade" | "one" | "two" | "cue" | "bank" | "wisps" | "fill" | "front" | "jet"
type Frame = Partial<Record<Layer, { transform?: string; opacity?: number }>>
type Dims = { stageW: number; stageH: number; jetW: number; wide: boolean }

/**
 * The whole hero timeline as a pure function of scroll progress p (0..1). The JS path applies it every frame; on
 * phones the scroll-timeline path samples it once into keyframes that the compositor plays against native scrolling.
 */
function frameAt(p: number, d: Dims): Frame {
  // Timeline: headline out → pilot seat reveal → climb into clouds → white-out → clouds clear into the page.
  // Services overlaps the last 60svh (from p≈0.75), so the white-out must be done by then.
  const out = span(p, 0, 0.22)
  const inn = span(p, 0.2, 0.4)
  const climb = span(p, 0.5, 0.66)
  const white = span(p, 0.62, 0.74)
  const clear = span(p, 0.74, 1)
  const fly = span(p, 0.58, 0.83)
  return {
    // The reveal: camera pulls back and the grade lifts so the pilot seat and captain's hat take the frame.
    // Wide screens slide the seat right so the caption can sit beside it; all screens drop it so the hat clears the nav.
    bg: { transform: `translate(${d.wide ? inn * 17 : 0}%, ${inn * 15}%) scale(${(1.14 - inn * 0.2) * (1 + climb * 0.15)})` },
    shade: { opacity: 0.4 - inn * 0.36 },
    grade: { opacity: 1 - inn * 0.7 },
    one: { opacity: 1 - out, transform: `translateY(${out * -90}px) rotateX(${out * 28}deg) scale(${1 - out * 0.12})` },
    two: { opacity: inn * (1 - span(p, 0.46, 0.54)), transform: `translateY(${(1 - inn) * 60}px)` },
    cue: { opacity: 1 - span(p, 0, 0.15) },
    bank: {
      opacity: Math.min(1, climb * 1.5) * (1 - clear),
      transform: `translateY(${70 - climb * 75 - clear * 30}%) scale(${1 + climb * 0.15 + clear * 0.5})`,
    },
    wisps: {
      opacity: span(p, 0.54, 0.68) * (1 - clear),
      transform: `translateY(${(1 - climb) * 25}%) scale(${1.1 + climb * 0.3 + clear * 0.7})`,
    },
    fill: { opacity: white },
    // Thin wisps that drift past in front of the jet (faster parallax than the back layer)
    front: {
      opacity: 0.4 * span(p, 0.6, 0.7) * (1 - span(p, 0.76, 0.9)),
      transform: `translate3d(${(0.5 - span(p, 0.58, 0.9)) * 30}%, 0, 0) scale(${1.2 + clear * 0.6})`,
    },
    // The jet crosses left to right through the clouds, climbing slightly and growing as it nears
    jet: {
      opacity: fly > 0 && fly < 1 ? Math.min(1, fly * 10, (1 - fly) * 10) : 0,
      transform: `translate3d(${-d.jetW + fly * (d.stageW + d.jetW * 1.1)}px, ${(0.5 - fly) * d.stageH * 0.16}px, 0) rotate(${-2 - fly * 3}deg) scale(${0.85 + fly * 0.3})`,
    },
  }
}

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
    const els: Record<Layer, HTMLElement | null> = {
      bg: bgRef.current,
      shade: shadeRef.current,
      grade: gradeRef.current,
      one: sceneOneRef.current,
      two: sceneTwoRef.current,
      cue: cueRef.current,
      bank: bankRef.current,
      wisps: wispsRef.current,
      fill: fillRef.current,
      front: wispsFrontRef.current,
      jet: jetRef.current,
    }
    const measure = () => {
      // Measure against the pinned stage (100svh), not innerHeight, which jumps when mobile browser bars show/hide
      const stageH = stageRef.current?.offsetHeight || window.innerHeight
      const stageW = stageRef.current?.offsetWidth || window.innerWidth
      const p = reduce ? 0 : clamp(-section.getBoundingClientRect().top / Math.max(section.offsetHeight - stageH, 1))
      return { p, d: { stageW, stageH, jetW: jetRef.current?.offsetWidth || 0, wide: stageW >= 1024 } }
    }

    // Bookkeeping that can't run on the compositor: which scene's buttons can be tapped, and whether the assistant
    // pop-up should wait (it would cover the hero's buttons on phones)
    let lastP = -1
    const interact = (p: number) => {
      document.documentElement.classList.toggle("hero-active", p < 0.56)
      if (els.one) els.one.style.pointerEvents = span(p, 0, 0.22) > 0.6 ? "none" : "auto"
      if (els.two) els.two.style.pointerEvents = span(p, 0.2, 0.4) * (1 - span(p, 0.46, 0.54)) > 0.4 ? "auto" : "none"
    }

    let frame = 0
    let cleanupMode = () => {}

    if (supportsScrollTimelines()) {
      // Sample the timeline into keyframes once; the browser then plays them against the scroll position
      const build = () => {
        cleanupMode()
        const { d } = measure()
        const ViewTimelineCtor = (window as unknown as { ViewTimeline: new (o: object) => AnimationTimeline }).ViewTimeline
        const timeline = new ViewTimelineCtor({ subject: section, axis: "block" })
        const N = 80
        const frames = Array.from({ length: N + 1 }, (_, i) => frameAt(i / N, d))
        const anims: Animation[] = []
        for (const key of Object.keys(els) as Layer[]) {
          const el = els[key]
          if (!el) continue
          el.style.removeProperty("transform")
          el.style.removeProperty("opacity")
          el.style.removeProperty("visibility")
          const kf = frames.map((f, i) => ({ offset: i / N, ...f[key] }))
          anims.push(
            el.animate(kf as Keyframe[], {
              timeline,
              rangeStart: "contain 0%",
              rangeEnd: "contain 100%",
              fill: "both",
              easing: "linear",
            } as KeyframeAnimationOptions),
          )
        }
        cleanupMode = () => anims.forEach((a) => a.cancel())
      }
      build()
      let size = `${window.innerWidth}`
      const onResize = () => {
        // Rebuild only when the width changes (the jet path depends on it); mobile bar show/hide changes height only
        if (`${window.innerWidth}` === size) return
        size = `${window.innerWidth}`
        build()
      }
      const onScroll = () => {
        if (frame) return
        frame = requestAnimationFrame(() => {
          frame = 0
          const { p } = measure()
          if (p !== lastP) interact((lastP = p))
        })
      }
      interact(measure().p)
      window.addEventListener("scroll", onScroll, { passive: true })
      window.addEventListener("resize", onResize)
      return () => {
        cleanupMode()
        window.removeEventListener("scroll", onScroll)
        window.removeEventListener("resize", onResize)
        cancelAnimationFrame(frame)
      }
    }

    // JS path (desktop with Lenis, and older phones): apply the timeline every frame
    const update = (force = false) => {
      frame = 0
      const { p, d } = measure()
      // Nothing moved (e.g. scrolling further down the page): skip all style writes
      if (p === lastP && !force) return
      lastP = p
      interact(p)
      const f = frameAt(p, d)
      for (const key of Object.keys(els) as Layer[]) {
        const el = els[key]
        const st = f[key]
        if (!el || !st) continue
        if (st.transform !== undefined) el.style.transform = st.transform
        if (st.opacity !== undefined) fade(el, st.opacity)
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
          <picture><source media="(max-width: 1023px)" srcSet="/biz/cloud-wisps-m.webp" /><img src="/biz/cloud-wisps.webp" alt="" className="absolute inset-0 w-full h-full object-cover" /></picture>
          <picture><source media="(max-width: 1023px)" srcSet="/biz/cloud-wisps-m.webp" /><img
            src="/biz/cloud-wisps.webp"
            alt=""
            className="hidden lg:block absolute inset-0 w-full h-full object-cover -scale-x-100 translate-y-[18%] opacity-80"
          /></picture>
        </div>
        <picture><source media="(max-width: 1023px)" srcSet="/biz/cloud-bank-m.webp" /><img
          ref={bankRef}
          data-hero="bank"
          src="/biz/cloud-bank.webp"
          alt=""
          aria-hidden
          className="absolute -left-[15%] -bottom-[10%] w-[130%] h-[120%] max-w-none object-cover object-bottom opacity-0 pointer-events-none will-change-transform"
          style={{ transform: "translateY(70%)" }}
        /></picture>
        <img
          ref={jetRef}
          data-hero="jet"
          src="/biz/jet.webp"
          alt=""
          aria-hidden
          className="absolute left-0 top-[30%] w-[72vw] sm:w-[48vw] lg:w-[40vw] max-w-[760px] opacity-0 pointer-events-none will-change-transform"
        />
        <div
          ref={wispsFrontRef}
          data-hero="wisps-front"
          className="absolute -inset-[20%] opacity-0 pointer-events-none will-change-transform"
          aria-hidden
        >
          <picture><source media="(max-width: 1023px)" srcSet="/biz/cloud-wisps-m.webp" /><img src="/biz/cloud-wisps.webp" alt="" className="absolute inset-0 w-full h-full object-cover -scale-y-100" /></picture>
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
                className="inline-flex items-center justify-center gap-2.5 border border-white/30 text-white px-8 py-4 text-sm tracking-wide hover:border-gold hover:text-gold transition-colors duration-300 bg-black/25"
              >
                <Phone className="w-4 h-4" strokeWidth={1.75} aria-hidden />
                Call {business.phoneDisplay}
              </a>
              <BooksyButton className="inline-flex items-center justify-center gap-2.5 border border-gold/60 text-gold-light px-8 py-4 text-sm tracking-wide hover:bg-gold hover:text-primary transition-colors duration-300 bg-black/25" />
            </div>
          </div>
        </div>

        {/* Scene 2: the assistant pitch, revealed as you scroll */}
        <div
          ref={sceneTwoRef} data-hero="two"
          className="absolute inset-0 flex items-end justify-center px-5 pb-24 lg:items-center lg:justify-start lg:pb-0 lg:pl-[7vw] opacity-0 pointer-events-none"
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
