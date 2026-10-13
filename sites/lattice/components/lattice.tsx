"use client"

import { useEffect, useRef } from "react"

// The page's lattice: a fine fixed grid (drawn in CSS) whose squares light up under the cursor and fade out
// behind it. Only lit squares are tracked and drawn, and the loop stops the moment the last one fades.
const CELL = 10
export function Lattice() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches
    let cols = 0, rows = 0, dpr = 1
    let heat = new Float32Array(0)
    const lit = new Set<number>()
    const resize = () => {
      dpr = Math.min(2, devicePixelRatio || 1)
      cols = Math.ceil(innerWidth / CELL) + 1
      rows = Math.ceil(innerHeight / CELL) + 1
      canvas.width = innerWidth * dpr
      canvas.height = innerHeight * dpr
      heat = new Float32Array(cols * rows)
      lit.clear()
    }
    resize()

    let raf = 0, last = 0
    const R = 7 // radius in cells
    const touch = (x: number, y: number, strength = 1) => {
      const cx = Math.floor(x / CELL), cy = Math.floor(y / CELL)
      for (let j = -R; j <= R; j++)
        for (let i = -R; i <= R; i++) {
          const gx = cx + i, gy = cy + j
          if (gx < 0 || gy < 0 || gx >= cols || gy >= rows) continue
          const d = Math.hypot(i, j) / R
          if (d > 1) continue
          // Ragged edge: the outer ring lights only some squares, like a pixel brush
          if (d > 0.55 && Math.random() > (1 - d) * 1.6) continue
          const v = (1 - d) ** 1.4 * strength
          const k = gy * cols + gx
          if (v > heat[k]) {
            heat[k] = v
            lit.add(k)
          }
        }
      if (!raf) raf = requestAnimationFrame(frame)
    }
    const frame = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016
      last = now
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, innerWidth, innerHeight)
      const fade = Math.exp(-dt * 2.6)
      for (const k of lit) {
        const v = (heat[k] *= fade)
        if (v < 0.02) {
          heat[k] = 0
          lit.delete(k)
          continue
        }
        const x = (k % cols) * CELL, y = Math.floor(k / cols) * CELL
        ctx.fillStyle = `rgba(178,170,255,${(v * 0.22).toFixed(3)})`
        ctx.fillRect(x + 1, y + 1, CELL - 1, CELL - 1)
        if (v > 0.75) {
          ctx.fillStyle = `rgba(235,235,255,${((v - 0.75) * 0.9).toFixed(3)})`
          ctx.fillRect(x + 3, y + 3, CELL - 5, CELL - 5)
        }
      }
      if (lit.size) raf = requestAnimationFrame(frame)
      else {
        raf = 0
        last = 0
      }
    }
    // Interpolate between pointer samples so a fast flick still paints a continuous trail
    let px = -1, py = -1
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return
      if (px >= 0) {
        const steps = Math.min(12, Math.ceil(Math.hypot(e.clientX - px, e.clientY - py) / (CELL * 2)))
        for (let s = 1; s <= steps; s++) touch(px + ((e.clientX - px) * s) / steps, py + ((e.clientY - py) * s) / steps)
      } else touch(e.clientX, e.clientY)
      px = e.clientX
      py = e.clientY
    }
    const onDown = (e: PointerEvent) => touch(e.clientX, e.clientY, e.pointerType === "touch" ? 0.9 : 1)
    const onLeave = () => (px = py = -1)
    if (!reduce) {
      addEventListener("pointermove", onMove, { passive: true })
      addEventListener("pointerdown", onDown, { passive: true })
      document.documentElement.addEventListener("pointerleave", onLeave)
    }
    addEventListener("resize", resize)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener("pointermove", onMove)
      removeEventListener("pointerdown", onDown)
      document.documentElement.removeEventListener("pointerleave", onLeave)
      removeEventListener("resize", resize)
    }
  }, [])

  return (
    <>
      <div className="lattice-grid" aria-hidden />
      <canvas ref={ref} className="lattice-glow" aria-hidden />
    </>
  )
}
