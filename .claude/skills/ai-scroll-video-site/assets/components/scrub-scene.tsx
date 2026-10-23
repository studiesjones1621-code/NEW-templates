"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

/*
  A pinned, scroll-scrubbed scene. The footage is a numbered WebP sequence (generated with Gemini Omni,
  exported at 100 frames) drawn to a canvas; scrolling picks the frame, eased so it glides.
  The stage exposes the eased progress as the CSS variable --p (0 → 1), so overlays can fade and move
  with plain CSS calc() and no React re-renders.
*/

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))

export function frameUrl(name: string, i: number) {
  return `/seq/${name}/${String(i + 1).padStart(3, "0")}.webp`
}

/** Loads a frame sequence when it gets near the viewport, first frame first. */
export function useFrames(name: string, count: number, target: React.RefObject<HTMLElement | null>) {
  const imgs = useRef<HTMLImageElement[]>([])
  useEffect(() => {
    const el = target.current
    if (!el) return
    let started = false
    const start = () => {
      if (started) return
      started = true
      const order = [0, ...Array.from({ length: count - 1 }, (_, i) => i + 1)]
      let k = 0
      const batch = () => {
        for (let n = 0; n < 12 && k < order.length; n++, k++) {
          const i = order[k]
          const img = new Image()
          img.decoding = "async"
          img.src = frameUrl(name, i)
          imgs.current[i] = img
        }
        if (k < order.length) setTimeout(batch, 60)
      }
      batch()
    }
    const io = new IntersectionObserver((e) => e.some((x) => x.isIntersecting) && start(), { rootMargin: "150% 0px" })
    io.observe(el)
    return () => io.disconnect()
  }, [name, count, target])
  return imgs
}

const ready = (img?: HTMLImageElement) => !!img && img.complete && img.naturalWidth > 0

/** Draws frame i (cover fit) into the canvas, falling back to the nearest loaded frame. Returns the index drawn. */
export function drawFrame(canvas: HTMLCanvasElement, imgs: HTMLImageElement[], i: number, last: number) {
  let k = i
  while (k > 0 && !ready(imgs[k])) k--
  if (k === last || !ready(imgs[k])) return last
  const ctx = canvas.getContext("2d")
  if (!ctx) return last
  const img = imgs[k]
  const cw = canvas.width
  const ch = canvas.height
  const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
  const w = img.naturalWidth * s
  const h = img.naturalHeight * s
  ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h)
  return k
}

export function sizeCanvas(canvas: HTMLCanvasElement) {
  const r = canvas.getBoundingClientRect()
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
  canvas.width = Math.max(1, Math.round(r.width * dpr))
  canvas.height = Math.max(1, Math.round(r.height * dpr))
}

export function ScrubScene({
  name,
  frames = 100,
  height = "360svh",
  from = 0,
  to = 0.92,
  className,
  overlayClassName,
  label,
  children,
}: {
  name: string
  frames?: number
  height?: string
  /** share of the pinned scroll where the footage starts / ends */
  from?: number
  to?: number
  className?: string
  overlayClassName?: string
  label: string
  children?: React.ReactNode
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgs = useFrames(name, frames, sectionRef)

  useEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    const canvas = canvasRef.current
    if (!section || !stage || !canvas) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let raf = 0
    let p = 0
    let last = -1
    let lastP = -1
    let t0 = performance.now()
    const resize = () => {
      sizeCanvas(canvas)
      last = -1
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const tick = (now: number) => {
      const r = section.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom > -vh * 0.2 && r.top < vh * 1.2) {
        const target = clamp(-r.top / Math.max(1, r.height - vh))
        const dt = Math.min(64, now - t0)
        p = reduced ? target : p + (target - p) * (1 - Math.pow(1 - 0.16, dt / 16.7))
        if (Math.abs(target - p) < 0.0005) p = target
        const fi = Math.round(clamp((p - from) / (to - from)) * (frames - 1))
        last = drawFrame(canvas, imgs.current, reduced ? frames - 1 : fi, last)
        if (Math.abs(p - lastP) > 0.0005) {
          lastP = p
          stage.style.setProperty("--p", p.toFixed(4))
        }
      }
      t0 = now
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [frames, from, to, imgs])

  return (
    <section ref={sectionRef} data-pin-stage className={cn("relative motion-reduce:!h-svh", className)} style={{ height }} aria-label={label}>
      <div ref={stageRef} className="sticky top-0 h-svh overflow-hidden bg-ink" style={{ ["--p" as string]: 0 }}>
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" role="img" aria-label={label} />
        <div className={cn("absolute inset-0", overlayClassName)}>{children}</div>
      </div>
    </section>
  )
}
