"use client"

import type React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { drawFrame, sizeCanvas, useFrames } from "./scrub-scene"

/*
  "Turn up the heat": drag the thermostat and the room warms. The room footage (frost melting, light turning
  gold) is the frame sequence; the set temperature picks the frame. If the visitor doesn't touch it,
  the dial turns itself up once when the section comes into view.
*/

const MIN = 60
const MAX = 74
const FRAMES = 100
const START_ANGLE = -135 // degrees, dial sweep from -135 to +135
const SWEEP = 270

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

export function Thermostat() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dialRef = useRef<SVGSVGElement>(null)
  const imgs = useFrames("room", FRAMES, sectionRef)
  const [temp, setTemp] = useState(61)
  const tempRef = useRef(61)
  const touched = useRef(false)

  const set = useCallback((t: number) => {
    const v = clamp(t, MIN, MAX)
    tempRef.current = v
    setTemp(v)
  }, [])

  // Draw loop: the shown frame eases toward the set temperature
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf = 0
    let shown = tempRef.current
    let last = -1
    const resize = () => {
      sizeCanvas(canvas)
      last = -1
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const tick = () => {
      shown += (tempRef.current - shown) * 0.08
      const fi = Math.round(((shown - MIN) / (MAX - MIN)) * (FRAMES - 1))
      last = drawFrame(canvas, imgs.current, clamp(fi, 0, FRAMES - 1), last)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [imgs])

  // Turn itself up once when seen, unless the visitor already has
  useEffect(() => {
    const el = sectionRef.current
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let timer = 0
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || touched.current) return
        io.disconnect()
        let t = tempRef.current
        timer = window.setInterval(() => {
          if (touched.current || t >= 70) return window.clearInterval(timer)
          t += 0.5
          set(t)
        }, 140)
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      window.clearInterval(timer)
    }
  }, [set])

  const fromPointer = (e: React.PointerEvent) => {
    const r = dialRef.current?.getBoundingClientRect()
    if (!r) return
    const a = (Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))) * 180) / Math.PI
    const t = MIN + ((clamp(a, START_ANGLE, START_ANGLE + SWEEP) - START_ANGLE) / SWEEP) * (MAX - MIN)
    touched.current = true
    set(Math.round(t))
  }

  const angle = START_ANGLE + ((temp - MIN) / (MAX - MIN)) * SWEEP
  const warm = (temp - MIN) / (MAX - MIN)
  const r = 80
  const arc = (deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180
    return [100 + r * Math.cos(rad), 100 + r * Math.sin(rad)]
  }
  const [sx, sy] = arc(START_ANGLE)
  const [ex, ey] = arc(angle)
  const large = angle - START_ANGLE > 180 ? 1 : 0
  const [kx, ky] = arc(angle)

  return (
    <section ref={sectionRef} id="heat" className="relative bg-ink py-20 md:py-28 overflow-hidden">
      <div className="container mx-auto px-5 md:px-10 grid lg:grid-cols-[1.4fr_0.6fr] gap-10 items-center">
        <div className="relative rounded-2xl overflow-hidden aspect-video ring-1 ring-white/10 shadow-2xl shadow-black/50">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" role="img" aria-label="A living room that warms from frosty blue to golden as the temperature rises" />
          <span className="absolute top-4 left-4 rounded-lg bg-ink/80 px-3 py-1.5 text-sm font-bold tabular-nums" style={{ color: `color-mix(in oklab, var(--frost), var(--ember) ${Math.round(warm * 100)}%)` }}>
            {temp}°F
          </span>
        </div>

        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <p className="text-[11px] md:text-xs font-semibold uppercase tracking-[0.22em] text-ember-soft">Try it</p>
          <h2 className="mt-3 font-display font-extrabold tracking-tight text-5xl md:text-6xl leading-[0.92]">
            Turn up <span className="ember-text">the heat.</span>
          </h2>
          <p className="mt-4 max-w-sm text-white/70 leading-relaxed">Drag the dial. Same house, no frost on the inside of the glass.</p>

          <svg
            ref={dialRef}
            viewBox="0 0 200 200"
            className="mt-8 w-56 h-56 touch-none select-none cursor-grab active:cursor-grabbing"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId)
              fromPointer(e)
            }}
            onPointerMove={(e) => e.buttons && fromPointer(e)}
            aria-hidden
          >
            <defs>
              <linearGradient id="dialGrad" x1="0" x2="1">
                <stop offset="0" stopColor="var(--frost)" />
                <stop offset="1" stopColor="var(--ember)" />
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="96" fill="var(--card)" stroke="rgb(255 255 255 / 0.08)" />
            <path d={`M ${sx} ${sy} A ${r} ${r} 0 1 1 ${arc(START_ANGLE + SWEEP)[0]} ${arc(START_ANGLE + SWEEP)[1]}`} fill="none" stroke="rgb(255 255 255 / 0.1)" strokeWidth="10" strokeLinecap="round" />
            {temp > MIN && <path d={`M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`} fill="none" stroke="url(#dialGrad)" strokeWidth="10" strokeLinecap="round" />}
            <circle cx={kx} cy={ky} r="11" fill="var(--foreground)" stroke="var(--ink)" strokeWidth="4" />
            <text x="100" y="108" textAnchor="middle" fontSize="44" fontWeight="800" fill="var(--foreground)" style={{ fontVariantNumeric: "tabular-nums" }}>
              {temp}°
            </text>
            <text x="100" y="132" textAnchor="middle" fontSize="11" letterSpacing="2" fill="var(--muted-foreground)">
              {temp >= 68 ? "COZY" : temp >= 64 ? "WARMING" : "CHILLY"}
            </text>
          </svg>
          <label htmlFor="temp" className="sr-only">
            Set temperature
          </label>
          <input
            id="temp"
            type="range"
            min={MIN}
            max={MAX}
            step={1}
            value={temp}
            onChange={(e) => {
              touched.current = true
              set(Number(e.target.value))
            }}
            className="dial-range mt-6 w-56"
          />
        </div>
      </div>
    </section>
  )
}
