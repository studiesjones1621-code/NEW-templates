"use client"

import { useEffect } from "react"
import { getLenis, onLenisScroll } from "@/lib/scroll"

/**
 * Two small desktop touches, both transform-only and off for touch screens and reduced motion:
 * - Magnetic buttons: anything marked `data-magnetic` leans toward a nearby cursor (its label a little further),
 *   then springs back when the cursor leaves.
 * - Scroll-speed skew: anything marked `data-skew` shears slightly with how fast the page is scrolling and settles
 *   when it stops, so fast scrolls feel physical.
 */
export function MotionExtras() {
  useEffect(() => {
    if (matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches) return

    // ---------- Magnetic ----------
    type Mag = { el: HTMLElement; label: HTMLElement | null; x: number; y: number; vx: number; vy: number; gx: number; gy: number }
    const mags: Mag[] = [...document.querySelectorAll<HTMLElement>("[data-magnetic]")].map((el) => ({
      el,
      label: el.querySelector<HTMLElement>("[data-magnetic-label]"),
      x: 0, y: 0, vx: 0, vy: 0, gx: 0, gy: 0,
    }))
    let raf = 0, last = 0
    const tick = (now: number) => {
      const dt = last ? Math.min(0.033, (now - last) / 1000) : 0.016
      last = now
      let busy = false
      for (const m of mags) {
        // Springy follow: stiff enough to track the hand, soft enough to wobble back on release
        m.vx += (220 * (m.gx - m.x) - 18 * m.vx) * dt
        m.vy += (220 * (m.gy - m.y) - 18 * m.vy) * dt
        m.x += m.vx * dt
        m.y += m.vy * dt
        if (Math.abs(m.x - m.gx) + Math.abs(m.y - m.gy) + Math.abs(m.vx) + Math.abs(m.vy) > 0.05) busy = true
        m.el.style.transform = `translate3d(${m.x.toFixed(2)}px, ${m.y.toFixed(2)}px, 0)`
        if (m.label) m.label.style.transform = `translate3d(${(m.x * 0.4).toFixed(2)}px, ${(m.y * 0.4).toFixed(2)}px, 0)`
      }
      raf = busy ? requestAnimationFrame(tick) : (last = 0)
    }
    const onMove = (e: PointerEvent) => {
      for (const m of mags) {
        const r = m.el.getBoundingClientRect()
        // Measure from the button's resting place, not where it has been pulled to
        const cx = r.left + r.width / 2 - m.x, cy = r.top + r.height / 2 - m.y
        const dx = e.clientX - cx, dy = e.clientY - cy
        const reach = Math.max(r.width, r.height) * 0.5 + 60
        const d = Math.hypot(dx, dy)
        const pull = d < reach ? (1 - d / reach) ** 0.6 : 0
        m.gx = dx * 0.32 * pull
        m.gy = dy * 0.42 * pull
      }
      if (!raf) raf = requestAnimationFrame(tick)
    }
    addEventListener("pointermove", onMove, { passive: true })

    // ---------- Scroll-speed skew ----------
    const skews = [...document.querySelectorAll<HTMLElement>("[data-skew]")]
    let skew = 0, skewV = 0, sraf = 0, slast = 0
    const skewTick = (now: number) => {
      const dt = slast ? Math.min(0.033, (now - slast) / 1000) : 0.016
      slast = now
      const v = getLenis()?.velocity ?? 0
      const goal = Math.max(-2.5, Math.min(2.5, v * 0.08))
      skewV += (160 * (goal - skew) - 20 * skewV) * dt
      skew += skewV * dt
      for (const el of skews) el.style.transform = `skewY(${skew.toFixed(3)}deg)`
      if (Math.abs(skew) + Math.abs(skewV) + Math.abs(goal) > 0.01) sraf = requestAnimationFrame(skewTick)
      else {
        sraf = slast = 0
        for (const el of skews) el.style.transform = ""
      }
    }
    const offLenis = onLenisScroll(() => {
      if (!sraf) sraf = requestAnimationFrame(skewTick)
    })

    return () => {
      removeEventListener("pointermove", onMove)
      offLenis()
      cancelAnimationFrame(raf)
      cancelAnimationFrame(sraf)
    }
  }, [])
  return null
}
