"use client"

import { useEffect, useRef, useState } from "react"
import { Phone, Volume2, VolumeX } from "lucide-react"
import { business } from "@/lib/business"
import { TalkButton } from "./talk-button"

/*
  The signature moment: a real dog (Mixkit stock footage, free license, cut out frame by frame)
  lies on the hero floor. Scrolling scrubs him up onto his feet; standing, he barks where the footage
  does, and every quick move of the mouse (or a tap on him) makes him bark again. Layers of soap
  bubbles, the giant "LUCKY 3" lettering and the dog sit at different depths and drift with the
  pointer. It's one continuous take, so he gets up and stays on his feet for the whole scroll.
*/

// Frames of one continuous take (exported by the build script): 0–RISE_END he gets up, then he stands
const FRAMES = 253
const RISE_END = 50
const RISE_AT = 0.3 // share of the scroll spent getting up
const STAND_FRAME = 160
const BARK_AT = [166, 178, 198, 216, 242] // frames where his mouth opens in the footage
const SOUND_KEY = "lucky3_sound"

const frameSrc = (i: number) => `/dog/f-${String(i).padStart(3, "0")}.webp`

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const ramp = (p: number, a: number, b: number) => clamp((p - a) / (b - a))

const BUBBLES = [
  // x%, y%, size px, depth, float dur
  [8, 18, 60, 0.3, 9],
  [18, 70, 34, 0.6, 7],
  [30, 30, 22, 0.2, 11],
  [44, 12, 46, 0.5, 8],
  [30, 82, 90, 0.9, 10],
  [63, 22, 28, 0.4, 6],
  [40, 64, 54, 0.7, 9],
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

    // One continuous take: the getting-up frames load first, the rest stream in behind them
    const imgs: HTMLImageElement[] = []
    const load = (i: number) => {
      if (imgs[i]) return
      const img = new Image()
      img.decoding = "async"
      img.src = frameSrc(i)
      img.decode?.().catch(() => {})
      imgs[i] = img
    }
    if (reduced) load(STAND_FRAME)
    else {
      for (let i = 0; i <= RISE_END; i++) load(i)
      let next = RISE_END + 1
      const more = () => {
        for (let k = 0; k < 24 && next < FRAMES; k++) load(next++)
        if (next < FRAMES) setTimeout(more, 120)
      }
      setTimeout(more, 400)
    }

    const sounds = [new Audio("/dog/bark.mp3"), new Audio("/dog/bark2.mp3")]
    sounds.forEach((a) => {
      a.preload = "auto"
      a.volume = 0.7
    })

    // Canvas sized to its box (DPR capped at 1.5: plenty for a photo, half the pixels of 2x)
    let cw = 0
    let ch = 0
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      cw = Math.round(r.width * dpr)
      ch = Math.round(r.height * dpr)
      canvas.width = cw
      canvas.height = ch
      drawn = -1
    }

    let progress = 0
    let smoothP = 0
    let lastT = performance.now()
    let lastBark = 0
    let lastFrame = 0
    let soundIndex = 0
    let pointerX = 0
    let pointerY = 0
    let smoothX = 0
    let smoothY = 0
    let lastLayerKey = ""
    let travel = 0
    let lastMove = { x: 0, y: 0, t: 0 }
    let drawn = -1
    let raf = 0

    const ready = (img?: HTMLImageElement) => !!img && img.complete && img.naturalWidth > 0

    const playBark = () => {
      if (!soundRef.current) return
      if (!unlockedRef.current) {
        setHint(true)
        return
      }
      const a = sounds[soundIndex++ % sounds.length]
      try {
        a.currentTime = 0
        void a.play().catch(() => {})
      } catch {}
    }

    // A bark on demand: the woof, the speech bubble and a little recoil, without leaving the pose he's in
    const startBark = () => {
      const now = performance.now()
      if (now - lastBark < 1200) return
      if (smoothP < 0.26 && !reduced) return // still getting up
      lastBark = now
      setWoof((w) => w + 1)
      playBark()
      canvas.classList.remove("dog-bark")
      void canvas.offsetWidth
      canvas.classList.add("dog-bark")
    }
    barkRef.current = startBark

    const paint = (i: number) => {
      // Nearest loaded frame at or before i, so a slow connection never shows a gap
      let k = i
      while (k > 0 && !ready(imgs[k])) k--
      if (k === drawn || !ready(imgs[k])) return
      drawn = k
      const img = imgs[k]
      ctx.clearRect(0, 0, cw, ch)
      const s = Math.min(cw / img.naturalWidth, ch / img.naturalHeight)
      const w = img.naturalWidth * s
      const h = img.naturalHeight * s
      ctx.drawImage(img, (cw - w) / 2, ch - h, w, h)
    }

    const frame = (now: number) => {
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight
      progress = clamp(-rect.top / Math.max(1, rect.height - vh))
      const visible = rect.bottom > 0 && rect.top < vh
      // Ease toward the scroll position (frame-rate independent) so the footage glides between frames
      const dt = Math.min(64, now - lastT)
      lastT = now
      smoothP = reduced ? 1 : smoothP + (progress - smoothP) * (1 - Math.pow(1 - 0.18, dt / 16.7))
      if (Math.abs(progress - smoothP) < 0.0004) smoothP = progress

      if (visible) {
        // Getting up over the first stretch, then standing for the rest of the scroll
        const fi = reduced
          ? STAND_FRAME
          : Math.round(smoothP < RISE_AT ? ramp(smoothP, 0.01, RISE_AT) * RISE_END : RISE_END + ramp(smoothP, RISE_AT, 0.98) * (FRAMES - 1 - RISE_END))
        paint(fi)

        // The footage barks on its own at these frames: add the sound and the bubble when you scroll into them
        if (fi > lastFrame) {
          for (const b of BARK_AT) {
            if (lastFrame < b && fi >= b && fi - lastFrame < 12) {
              lastBark = now
              setWoof((w) => w + 1)
              playBark()
              break
            }
          }
        }
        lastFrame = fi

        // Depth: pointer parallax (desktop) + scroll drift; only touch the DOM when something moved
        smoothX += (pointerX - smoothX) * 0.08
        smoothY += (pointerY - smoothY) * 0.08
        const layerKey = `${smoothX.toFixed(3)}|${smoothY.toFixed(3)}|${smoothP.toFixed(4)}`
        if (layerKey !== lastLayerKey) {
          lastLayerKey = layerKey
          const layers = layersRef.current?.querySelectorAll<HTMLElement>("[data-depth]") ?? []
          layers.forEach((el) => {
            const d = Number(el.dataset.depth)
            el.style.transform = `translate3d(${(-smoothX * 26 * d).toFixed(1)}px, ${(-smoothY * 18 * d - smoothP * 120 * d).toFixed(1)}px, 0)`
          })
          const dogScale = 0.94 + ramp(smoothP, 0, RISE_AT) * 0.06
          if (canvas.parentElement) {
            canvas.parentElement.style.transform = `translate3d(${(-smoothX * 14).toFixed(1)}px, ${(-smoothY * 8).toFixed(1)}px, 0) rotateY(${(smoothX * 6).toFixed(2)}deg) scale(${dogScale.toFixed(3)})`
          }
          // Copy: the welcome, then the assistant pitch (stays up while he stands)
          const a = 1 - ramp(smoothP, 0.3, 0.4)
          const b = ramp(smoothP, 0.42, 0.52)
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
          if (floorRef.current) floorRef.current.style.opacity = String(0.55 + ramp(smoothP, 0.01, RISE_AT) * 0.45)
        }
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
      if (travel > 420 && section.getBoundingClientRect().bottom > window.innerHeight * 0.5) {
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
    <section ref={sectionRef} id="top" data-pin-stage className="relative h-[360svh] motion-reduce:h-svh" aria-label="Welcome">
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
            <div className="relative w-[min(100vw,560px,calc(46svh*1.267))] md:w-[min(60vw,880px,calc((100svh-150px)*1.267))] aspect-[684/540] [transform-style:preserve-3d] will-change-transform origin-bottom">
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
