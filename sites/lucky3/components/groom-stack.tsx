"use client"

import { useEffect, useRef } from "react"
import { steps } from "@/lib/business"

/*
  "How we groom" as a 3D stack: each step is a card of real grooming footage that flies in from
  deep in the scene and lands on the pile, pushing the earlier steps back and fanning them out.
  Only the card on top plays its video.
*/

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const ease = (t: number) => 1 - Math.pow(1 - t, 3)

export function GroomStack() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  const copyRef = useRef<(HTMLDivElement | null)[]>([])
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const n = steps.length
    let raf = 0
    let active = -1

    const tick = () => {
      const r = section.getBoundingClientRect()
      const vh = window.innerHeight
      const p = clamp(-r.top / Math.max(1, r.height - vh))
      const visible = r.bottom > 0 && r.top < vh
      if (visible) {
        // 0..n: card i arrives over [i-0.85, i] (the first one is already there)
        const pos = reduced ? n - 1 : p * (n - 0.15)
        cardsRef.current.forEach((card, i) => {
          if (!card) return
          const t = pos - i
          let tf: string
          let op = 1
          if (t < 0 && i > 0) {
            const a = ease(clamp(1 + t / 0.85))
            const z = -1100 * (1 - a)
            const y = 70 * (1 - a)
            const rx = 38 * (1 - a)
            const rz = (i % 2 ? 9 : -9) * (1 - a)
            tf = `translate3d(0, ${y.toFixed(1)}%, ${z.toFixed(0)}px) rotateX(${rx.toFixed(1)}deg) rotateZ(${rz.toFixed(1)}deg)`
            op = clamp(a * 1.6)
          } else {
            const k = clamp(t, 0, 4)
            const side = i % 2 ? 1 : -1
            tf = `translate3d(${(side * k * 14).toFixed(1)}px, ${(-k * 7).toFixed(1)}%, ${(-k * 110).toFixed(0)}px) rotateZ(${(side * Math.min(k, 2.5) * 3.2).toFixed(2)}deg) rotateY(${(-side * k * 4).toFixed(2)}deg)`
            op = clamp(1 - Math.max(0, k - 2.2) * 0.6)
          }
          card.style.transform = tf
          card.style.opacity = op.toFixed(3)
          card.style.zIndex = String(10 + i)
        })
        const now = clamp(Math.round(pos - 0.35), 0, n - 1)
        if (now !== active) {
          active = now
          cardsRef.current.forEach((card, i) => {
            const v = card?.querySelector("video")
            if (!v) return
            if (i === now && !reduced) void v.play().catch(() => {})
            else v.pause()
          })
          copyRef.current.forEach((c, i) => {
            if (!c) return
            c.dataset.active = String(i === now)
          })
        }
        if (barRef.current) barRef.current.style.transform = `scaleY(${p.toFixed(3)})`
      } else if (active !== -1) {
        cardsRef.current.forEach((card) => card?.querySelector("video")?.pause())
        active = -1
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section ref={sectionRef} id="groom" data-pin-stage className="relative bg-primary text-primary-foreground" style={{ height: `${steps.length * 75 + 40}svh` }}>
      <div className="sticky top-0 h-svh overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_75%_55%,oklch(0.45_0.08_225/0.55),transparent_70%)]" aria-hidden />
        <div className="relative h-full container mx-auto px-5 md:px-8 grid md:grid-cols-[0.9fr_1.1fr] md:items-center gap-4 pt-24 pb-6 md:py-0">
          {/* Copy */}
          <div className="relative">
            <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-sky">How we groom</p>
            <h2 className="mt-3 font-display font-extrabold tracking-tight text-4xl md:text-6xl leading-[0.95]">
              The old-school way, <span className="lucky-text">step by step.</span>
            </h2>
            <div className="relative mt-6 md:mt-10 min-h-[150px] md:min-h-[190px]">
              {steps.map((s, i) => (
                <div
                  key={s.n}
                  ref={(el) => {
                    copyRef.current[i] = el
                  }}
                  data-active={i === 0}
                  className="absolute inset-0 transition-all duration-500 data-[active=false]:opacity-0 data-[active=false]:translate-y-4 data-[active=true]:opacity-100"
                >
                  <p className="font-display font-extrabold text-5xl md:text-7xl text-marigold/90">{s.n}</p>
                  <h3 className="mt-1 font-display font-bold text-2xl md:text-3xl">{s.title}</h3>
                  <p className="mt-2 max-w-md text-sm md:text-base text-primary-foreground/70 leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
            <div className="hidden md:block absolute -left-6 top-0 bottom-0 w-[3px] rounded bg-white/10" aria-hidden>
              <div ref={barRef} className="h-full w-full origin-top scale-y-0 rounded bg-marigold" />
            </div>
          </div>

          {/* 3D stack */}
          <div className="relative h-[46svh] md:h-[70svh]" style={{ perspective: "1400px" }}>
            <div className="absolute inset-0 flex items-center justify-center [transform-style:preserve-3d]">
              {steps.map((s, i) => (
                <div
                  key={s.n}
                  ref={(el) => {
                    cardsRef.current[i] = el
                  }}
                  className="absolute w-[min(86vw,560px)] aspect-[4/3] rounded-3xl overflow-hidden bg-black shadow-[0_40px_80px_-30px_rgb(0_0_0/0.7)] ring-1 ring-white/15 will-change-transform"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  <video
                    className="absolute inset-0 w-full h-full object-cover"
                    src={s.video}
                    poster={s.poster}
                    muted
                    loop
                    playsInline
                    preload={i < 2 ? "auto" : "metadata"}
                    aria-label={s.title}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 bg-gradient-to-t from-black/70 to-transparent">
                    <p className="font-display font-bold text-white text-lg md:text-xl">
                      <span className="text-marigold mr-2">{s.n}</span>
                      {s.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
