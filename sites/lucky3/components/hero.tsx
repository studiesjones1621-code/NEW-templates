"use client"

import { useEffect, useRef, useState } from "react"
import { Phone, Volume2, VolumeX } from "lucide-react"
import { business } from "@/lib/business"
import { TalkButton } from "./talk-button"

/*
  The signature moment: a real dog (Mixkit stock footage, free license, cut out frame by frame)
  lies on the hero floor. Scrolling scrubs him up onto his feet; once he's standing he barks, and
  after that every quick move of the mouse (or a tap on him) makes him bark again. Layers of soap
  bubbles, the giant "LUCKY 3" lettering and the dog sit at different depths and drift with the
  pointer. He stays on his feet while the page scrolls on into a rim of bath foam.
*/

const RISE_FRAMES = 51
const BARK_FRAMES = 63
const BARK_FROM = 16 // frame where the bark clip starts (mouth closed)
const BARK_TO = 36 // mouth open around 24–28
const BARK_FPS = 14
const SOUND_KEY = "lucky3_sound"

const rise = (i: number) => `/dog/rise-${String(i).padStart(3, "0")}.webp`
const bark = (i: number) => `/dog/bark-${String(i).padStart(3, "0")}.webp`

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const ramp = (p: number, a: number, b: number) => clamp((p - a) / (b - a))

const BUBBLES = [
  // x%, y%, size px, depth, float dur
  [8, 18, 60, 0.3, 9],
  [18, 70, 34, 0.6, 7],
  [30, 30, 22, 0.2, 11],
  [44, 12, 46, 0.5, 8],
  [52, 78, 90, 0.9, 10],
  [63, 22, 28, 0.4, 6],
  [72, 60, 54, 0.7, 9],
  [84, 14, 72, 0.35, 12],
  [91, 48, 30, 0.8, 7],
  [96, 82, 110, 1.2, 11],
  [4, 90, 120, 1.3, 13],
  [38, 52, 18, 0.25, 8],
] as const

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const layersRef = useRef<HTMLDivElement>(null)
  const textARef = useRef<HTMLDivElement>(null)
  const textBRef = useRef<HTMLDivElement>(null)
    const floorRef = useRef<HTMLDivElement>(null)
  const [woof, setWoof] = useState(0)
  const [sound, setSound] = useState(true)
  const [unlocked, setUnlocked] = useState(false)
  const [hint, setHint] = useState(false)
  const soundRef = useRef(true)
  const unlockedRef = useRef(false)
  const barkRef = useRef<() => void>(() => {})

  // Sound preference (remembered) and the browser's "first interaction" audio unlock
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SOUND_KEY)
      if (saved === "off") {
        soundRef.current = false
        setSound(false)
      }
    } catch {}
    const unlock = () => {
      unlockedRef.current = true
      setUnlocked(true)
      window.removeEventListener("pointerdown", unlock)
      window.removeEventListener("keydown", unlock)
    }
    window.addEventListener("pointerdown", unlock)
    window.addEventListener("keydown", unlock)
    return () => {
      window.removeEventListener("pointerdown", unlock)
      window.removeEventListener("keydown", unlock)
    }
  }, [])

  const toggleSound = () => {
    const next = !soundRef.current
    soundRef.current = next
    setSound(next)
    try {
      localStorage.setItem(SOUND_KEY, next ? "on" : "off")
    } catch {}
    if (next) setTimeout(() => barkRef.current(), 80)
  }

  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    if (!section || !canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches

    // Frames: the rise first (it's what you see on load), the bark clip right after
    const riseImgs: HTMLImageElement[] = []
    const barkImgs: HTMLImageElement[] = []
    const load = (src: string) => {
      const img = new Image()
      img.decoding = "async"
      img.src = src
      img.decode?.().catch(() => {})
      return img
    }
    if (reduced) {
      barkImgs[0] = load(bark(0))
    } else {
      for (let i = 0; i < RISE_FRAMES; i++) riseImgs[i] = load(rise(i))
      const loadBark = () => {
        for (let i = 0; i < BARK_FRAMES; i++) barkImgs[i] = load(bark(i))
      }
      if ("requestIdleCallback" in window) requestIdleCallback(loadBark, { timeout: 1500 })
      else setTimeout(loadBark, 600)
    }

    const sounds = [new Audio("/dog/bark.mp3"), new Audio("/dog/bark2.mp3")]
    sounds.forEach((a) => {
      a.preload = "auto"
      a.volume = 0.7
    })

    // Canvas sized to its box (DPR capped at 2)
    let cw = 0
    let ch = 0
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      cw = Math.round(r.width * dpr)
      ch = Math.round(r.height * dpr)
      canvas.width = cw
      canvas.height = ch
      lastKey = ""
    }

    let progress = 0
    let smoothP = 0
    let lastT = performance.now()
    let barkStart = -1
    let lastBark = 0
    let barkedOnScroll = false
    let soundIndex = 0
    let pointerX = 0
    let pointerY = 0
    let smoothX = 0
    let smoothY = 0
    let travel = 0
    let lastMove = { x: 0, y: 0, t: 0 }
    let lastKey = ""
    let raf = 0

    const ready = (img?: HTMLImageElement) => !!img && img.complete && img.naturalWidth > 0

    const startBark = () => {
      const now = performance.now()
      if (now - lastBark < 1500) return
      if (smoothP < 0.4 && !reduced) return // still getting up
      lastBark = now
      barkStart = now
      setWoof((w) => w + 1)
      if (soundRef.current && unlockedRef.current) {
        const a = sounds[soundIndex++ % sounds.length]
        // The mouth opens ~0.45s into the clip; line the woof up with it
        setTimeout(() => {
          try {
            a.currentTime = 0
            void a.play().catch(() => {})
          } catch {}
        }, reduced ? 0 : 420)
      } else if (!unlockedRef.current) {
        setHint(true)
      }
    }
    barkRef.current = startBark

    const draw = (a: HTMLImageElement | undefined, b?: HTMLImageElement, mix = 0) => {
      const key = `${a?.src}|${b?.src}|${mix.toFixed(2)}|${cw}`
      if (key === lastKey) return
      lastKey = key
      ctx.clearRect(0, 0, cw, ch)
      // contain, bottom-aligned so his feet stay on the floor
      const paint = (img: HTMLImageElement, alpha: number) => {
        if (!ready(img) || alpha <= 0) return
        const s = Math.min(cw / img.naturalWidth, ch / img.naturalHeight)
        const w = img.naturalWidth * s
        const h = img.naturalHeight * s
        ctx.globalAlpha = alpha
        ctx.drawImage(img, (cw - w) / 2, ch - h, w, h)
      }
      if (a) paint(a, 1 - mix)
      if (b) paint(b, mix)
      ctx.globalAlpha = 1
    }

    const frame = (now: number) => {
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight
      const span = Math.max(1, rect.height - vh)
      progress = clamp(-rect.top / span)
      const visible = rect.bottom > 0 && rect.top < vh
      // Ease toward the scroll position (frame-rate independent) so the dog never jumps between frames
      const dt = Math.min(64, now - lastT)
      lastT = now
      smoothP = reduced ? progress : smoothP + (progress - smoothP) * (1 - Math.pow(1 - 0.16, dt / 16.7))

      if (visible) {
        // Dog: lying → standing as you scroll, then the standing/bark clip
        if (reduced) {
          draw(barkImgs[0])
        } else if (barkStart >= 0 && now - barkStart < ((BARK_TO - BARK_FROM) / BARK_FPS) * 1000) {
          const i = BARK_FROM + Math.floor(((now - barkStart) / 1000) * BARK_FPS)
          const img = ready(barkImgs[i]) ? barkImgs[i] : barkImgs[0]
          draw(img)
        } else {
          // Fractional frame: crossfade the two nearest frames for a smooth get-up
          const f = ramp(smoothP, 0.02, 0.42) * (RISE_FRAMES - 1)
          const i0 = Math.floor(f)
          const i1 = Math.min(RISE_FRAMES - 1, i0 + 1)
          const blend = ramp(smoothP, 0.38, 0.46)
          const a0 = ready(riseImgs[i0]) ? riseImgs[i0] : riseImgs.find(ready)
          if (blend > 0 && ready(barkImgs[0])) draw(a0, barkImgs[0], blend)
          else {
            // Nearest frame (blending two poses of a moving dog reads as a double image)
            const near = f - i0 < 0.5 ? i0 : i1
            draw(ready(riseImgs[near]) ? riseImgs[near] : a0)
          }
        }

        // He barks once on his own when he's up
        if (!barkedOnScroll && smoothP > 0.5) {
          barkedOnScroll = true
          startBark()
        }
        if (progress < 0.2) barkedOnScroll = false

        // Depth: pointer parallax (desktop) + scroll drift
        smoothX += (pointerX - smoothX) * 0.06
        smoothY += (pointerY - smoothY) * 0.06
        const layers = layersRef.current?.querySelectorAll<HTMLElement>("[data-depth]") ?? []
        layers.forEach((el) => {
          const d = Number(el.dataset.depth)
          const sy = -smoothP * 160 * d
          el.style.transform = `translate3d(${(-smoothX * 26 * d).toFixed(1)}px, ${(-smoothY * 18 * d + sy).toFixed(1)}px, 0)`
        })
        const dogScale = 0.94 + ramp(smoothP, 0, 0.45) * 0.06
        if (canvas.parentElement) {
          canvas.parentElement.style.transform = `translate3d(${(-smoothX * 14).toFixed(1)}px, ${(-smoothY * 8).toFixed(1)}px, 0) rotateY(${(smoothX * 6).toFixed(2)}deg) scale(${dogScale.toFixed(3)})`
        }

        // Copy: the welcome, then the assistant pitch
        const a = 1 - ramp(smoothP, 0.44, 0.54)
        const b = ramp(smoothP, 0.56, 0.66)
        if (textARef.current) {
          textARef.current.style.opacity = String(a)
          textARef.current.style.transform = `translate3d(0, ${(-(1 - a) * 40).toFixed(1)}px, 0)`
          textARef.current.style.pointerEvents = a > 0.5 ? "auto" : "none"
        }
        if (textBRef.current) {
          textBRef.current.style.opacity = String(b)
          textBRef.current.style.transform = `translate3d(0, ${((1 - b) * 40).toFixed(1)}px, 0)`
          textBRef.current.style.pointerEvents = b > 0.5 ? "auto" : "none"
        }

        if (floorRef.current) floorRef.current.style.opacity = String(0.55 + ramp(smoothP, 0.02, 0.42) * 0.45)
      }
      raf = requestAnimationFrame(frame)
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      pointerX = (e.clientX / window.innerWidth) * 2 - 1
      pointerY = (e.clientY / window.innerHeight) * 2 - 1
      const t = performance.now()
      const dist = Math.hypot(e.clientX - lastMove.x, e.clientY - lastMove.y)
      // Only brisk movement counts, and it decays, so slow reading doesn't set him off
      travel = t - lastMove.t > 160 ? dist : travel + dist
      lastMove = { x: e.clientX, y: e.clientY, t }
      if (travel > 420 && progress < 0.85 && section.getBoundingClientRect().top < window.innerHeight * 0.5) {
        travel = 0
        startBark()
      }
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    if (finePointer && !reduced) window.addEventListener("pointermove", onMove, { passive: true })
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener("pointermove", onMove)
      sounds.forEach((a) => a.pause())
    }
  }, [])

  useEffect(() => {
    if (!hint) return
    const t = setTimeout(() => setHint(false), 4200)
    return () => clearTimeout(t)
  }, [hint, woof])

  return (
    <section ref={sectionRef} id="top" data-pin-stage className="relative h-[250svh] motion-reduce:h-svh" aria-label="Welcome">
      <div className="sticky top-0 h-svh overflow-hidden bg-[radial-gradient(120%_90%_at_70%_100%,oklch(0.93_0.06_215)_0%,var(--background)_55%)] grain">
        <div ref={layersRef} className="absolute inset-0" style={{ perspective: "1200px" }}>
          {/* Deepest layer: the logo's lettering, huge and quiet */}
          <div data-depth="0.25" className="absolute inset-x-0 top-[9svh] md:top-[6svh] flex justify-center will-change-transform select-none" aria-hidden>
            <span className="font-display font-extrabold leading-none tracking-tighter text-[34vw] md:text-[26vw] text-transparent [-webkit-text-stroke:2px_oklch(0.86_0.06_215)] opacity-80">
              LUCKY<span className="lucky-text [-webkit-text-stroke:0]">3</span>
            </span>
          </div>

          {/* Back bubbles */}
          <div data-depth="0.45" className="absolute inset-0 will-change-transform" aria-hidden>
            {BUBBLES.filter((b) => b[3] < 0.6).map(([x, y, s, , dur], i) => (
              <span
                key={i}
                className="bubble bubble-float"
                style={{ left: `${x}%`, top: `${y}%`, width: s, height: s, ["--dur" as string]: `${dur}s`, ["--delay" as string]: `${-i * 0.7}s` }}
              />
            ))}
          </div>

          {/* The dog, standing on a soft floor shadow */}
          <div className="absolute inset-x-0 bottom-[7svh] md:bottom-[5svh] flex justify-center md:justify-end md:pr-[4vw]">
            <div className="relative w-[min(100vw,560px,calc(44svh*1.32))] md:w-[min(60vw,880px,calc((100svh-170px)*1.32))] aspect-[720/544] [transform-style:preserve-3d] will-change-transform origin-bottom">
              <div
                ref={floorRef}
                className="absolute left-[14%] right-[10%] bottom-[1%] h-[9%] rounded-[50%] bg-[radial-gradient(closest-side,oklch(0.3_0.03_235/0.35),transparent)] blur-[2px]"
                aria-hidden
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full cursor-pointer"
                role="img"
                aria-label="A real dog getting up and barking"
                onClick={() => barkRef.current()}
              />
              {woof > 0 && (
                <div key={woof} className="woof-pop absolute left-[78%] top-[2%] md:top-[4%] pointer-events-none" aria-hidden>
                  <div className="relative rounded-2xl bg-primary text-primary-foreground font-display font-extrabold text-xl md:text-3xl px-4 py-2 shadow-xl shadow-black/20">
                    Woof!
                    <span className="absolute -bottom-2 left-6 w-4 h-4 rotate-45 bg-primary" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Front bubbles, closer and softer */}
          <div data-depth="1.1" className="absolute inset-0 will-change-transform pointer-events-none" aria-hidden>
            {BUBBLES.filter((b) => b[3] >= 0.6).map(([x, y, s, , dur], i) => (
              <span
                key={i}
                className="bubble bubble-float"
                style={{ left: `${x}%`, top: `${y}%`, width: s, height: s, ["--dur" as string]: `${dur}s`, ["--delay" as string]: `${-i * 1.1}s`, ["--dy" as string]: "-40px" }}
              />
            ))}
          </div>
        </div>

        {/* Copy */}
        <div className="relative z-10 h-full container mx-auto px-5 md:px-8 pt-28 md:pt-16 md:flex md:items-center pointer-events-none">
          <div ref={textARef} className="max-w-xl will-change-transform pointer-events-auto">
            <p className="fade-up text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-sky-deep" style={{ ["--d" as string]: "100ms" }}>
              Dog &amp; cat grooming · Baltimore
            </p>
            <h1 className="mt-4 font-display font-extrabold tracking-tight text-[11.5vw] leading-[0.9] md:text-[clamp(3rem,min(6.4vw,10.5svh),6rem)]">
              <span className="block overflow-hidden pb-1">
                <span className="rise-in block" style={{ ["--d" as string]: "150ms" }}>
                  <span className="lucky-text">Lucky</span> dogs
                </span>
              </span>
              <span className="block overflow-hidden pb-2">
                <span className="rise-in block" style={{ ["--d" as string]: "280ms" }}>
                  get groomed
                </span>
              </span>
              <span className="block overflow-hidden pb-2">
                <span className="rise-in block" style={{ ["--d" as string]: "410ms" }}>
                  by hand.
                </span>
              </span>
            </h1>
            <p className="fade-up mt-4 md:mt-6 max-w-md text-[15px] md:text-lg leading-relaxed text-muted-foreground" style={{ ["--d" as string]: "650ms" }}>
              Old-school grooming by a New York–trained stylist and author. We take the matted, nervous pets other groomers turn away.
            </p>
            <div className="fade-up mt-7 flex flex-wrap items-center gap-3" style={{ ["--d" as string]: "800ms" }}>
              <TalkButton className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3.5 text-sm font-semibold shadow-lg shadow-primary/25 hover:bg-tangerine hover:text-primary transition-colors" />
              <a
                href={business.phoneHref}
                className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/90 px-5 py-3.5 text-sm font-semibold hover:border-tangerine transition-colors"
              >
                <Phone className="w-4 h-4" aria-hidden /> {business.phoneDisplay}
              </a>
            </div>
            <p className="fade-up hidden md:block mt-6 text-sm text-muted-foreground" style={{ ["--d" as string]: "950ms" }}>
              By appointment · No vaccine records needed
            </p>
          </div>

          <div
            ref={textBRef}
            className="absolute inset-x-5 top-28 md:inset-x-auto md:top-auto md:left-8 lg:left-[max(2rem,calc((100vw-1400px)/2+2rem))] max-w-lg opacity-0 will-change-transform"
          >
            <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-sky-deep">He&apos;s trying to tell you something</p>
            <h2 className="mt-4 font-display font-extrabold tracking-tight text-5xl md:text-7xl leading-[0.92]">
              Woof means
              <br />
              <span className="lucky-text">book me in.</span>
            </h2>
            <p className="mt-5 max-w-md text-base md:text-lg leading-relaxed text-muted-foreground">
              Our assistant answers any time: prices, matted coats, the rules for cats, and it takes your appointment request for David.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <TalkButton className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3.5 text-sm font-semibold hover:bg-tangerine hover:text-primary transition-colors">
                Ask our assistant
              </TalkButton>
            </div>
          </div>
        </div>

        {/* Sound control + hint */}
        <div className="absolute z-20 left-5 md:left-8 bottom-5 md:bottom-7 flex items-center gap-3">
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={sound}
            className="inline-flex items-center gap-2 rounded-full bg-background/90 border border-primary/15 px-4 py-2 text-xs font-semibold hover:border-tangerine transition-colors cursor-pointer"
          >
            {sound ? <Volume2 className="w-4 h-4" aria-hidden /> : <VolumeX className="w-4 h-4" aria-hidden />}
            {sound ? "Bark: on" : "Bark: muted"}
          </button>
          {hint && sound && !unlocked && (
            <span className="fade-up hidden sm:inline-flex rounded-full bg-primary text-primary-foreground px-3 py-2 text-xs font-semibold">
              Click or tap to hear him
            </span>
          )}
        </div>
        <p className="hidden md:block absolute z-20 right-8 bottom-7 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Scroll · move your mouse
        </p>

      </div>
    </section>
  )
}
