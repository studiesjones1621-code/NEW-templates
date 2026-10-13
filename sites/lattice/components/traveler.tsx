"use client"

import { useEffect, useRef } from "react"
import { clamp, createSway, decayPointer, trackPointer } from "@/lib/sway"

/**
 * The hero jacket travels down the page from one screen to the next. Each section marks where it should sit with
 * an empty `[data-slot]` box (optionally `data-rot` in degrees and `data-opacity`); between two slots the jacket
 * glides from one box to the other as you scroll, lingering at each. The body follows on a spring, the sleeves
 * follow the body a beat later (so they trail and swing), and the whole jacket turns toward the pointer.
 */
const SRC = "/img/jacket-hero.webp"
const BASE = 1000 // layout width of the jacket element; slots scale it

type Slot = { el: HTMLElement; rot: number; op: number }
const smooth = (t: number) => t * t * (3 - 2 * t)

export function Traveler() {
  const root = useRef<HTMLDivElement>(null)
  const body = useRef<HTMLDivElement>(null)
  const left = useRef<HTMLDivElement>(null)
  const right = useRef<HTMLDivElement>(null)
  const sway = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = root.current, B = body.current, L = left.current, R = right.current, S = sway.current
    if (!el || !B || !L || !R || !S) return
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches
    const coarse = matchMedia("(pointer: coarse)").matches
    const slots: Slot[] = [...document.querySelectorAll<HTMLElement>("[data-slot]")].map((s) => ({
      el: s,
      rot: Number(s.dataset.rot || 0),
      op: s.dataset.opacity === undefined ? 1 : Number(s.dataset.opacity),
    }))
    if (!slots.length) return

    // Where each slot sits in the document, and the scroll position at which it is centred on screen
    let anchors: number[] = []
    const measure = () => {
      anchors = slots.map((s) => {
        const r = s.el.getBoundingClientRect()
        return r.top + scrollY + r.height / 2 - innerHeight / 2
      })
    }
    measure()
    addEventListener("resize", measure)
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)

    const target = () => {
      const y = scrollY
      let i = 0
      while (i < anchors.length - 1 && y > anchors[i + 1]) i++
      const a = slots[i], b = slots[Math.min(i + 1, slots.length - 1)]
      const t = a === b ? 0 : smooth(clamp((y - anchors[i]) / Math.max(1, anchors[i + 1] - anchors[i])))
      const ra = a.el.getBoundingClientRect(), rb = b.el.getBoundingClientRect()
      const size = (r: DOMRect) => Math.min(r.width, r.height)
      const mix = (p: number, q: number) => p + (q - p) * t
      return {
        x: mix(ra.left + ra.width / 2, rb.left + rb.width / 2),
        y: mix(ra.top + ra.height / 2, rb.top + rb.height / 2),
        s: mix(size(ra), size(rb)) / BASE,
        r: mix(a.rot, b.rot),
        o: mix(a.op, b.op),
      }
    }

    const cur = { ...target() }
    const sleeve = { x: cur.x, y: cur.y }
    const ptr = { x: 0, y: 0 }, turn = { x: 0, y: 0 }

    // Mouse sway (see lib/sway): the jacket leans with the mouse, the sleeves swing a beat behind
    trackPointer()
    const motion = createSway()
    const onMove = (e: PointerEvent) => {
      ptr.x = (e.clientX / innerWidth) * 2 - 1
      ptr.y = (e.clientY / innerHeight) * 2 - 1
    }
    if (!coarse && !reduce) addEventListener("pointermove", onMove, { passive: true })

    let last = 0, raf = 0
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const dt = last ? Math.min(0.033, (now - last) / 1000) : 0.016
      last = now
      const g = target()
      const kb = reduce ? 1 : 1 - Math.exp(-dt * 9)
      const ks = reduce ? 1 : 1 - Math.exp(-dt * 4.5)
      cur.x += (g.x - cur.x) * kb
      cur.y += (g.y - cur.y) * kb
      cur.s += (g.s - cur.s) * kb
      cur.r += (g.r - cur.r) * kb
      cur.o += (g.o - cur.o) * kb
      sleeve.x += (cur.x - sleeve.x) * ks
      sleeve.y += (cur.y - sleeve.y) * ks
      turn.x += (ptr.x - turn.x) * (1 - Math.exp(-dt * 3))
      turn.y += (ptr.y - turn.y) * (1 - Math.exp(-dt * 3))

      decayPointer(now, dt)
      motion.step(dt)

      el.style.opacity = cur.o.toFixed(3)
      el.style.visibility = cur.o < 0.01 ? "hidden" : "visible"
      if (cur.o < 0.01) return
      // How far the sleeves are lagging behind the scroll travel, in the jacket's own units
      const lagX = (sleeve.x - cur.x) / cur.s, lagY = (sleeve.y - cur.y) / cur.s
      const swing = clamp(lagX * 0.02 + lagY * 0.015, -14, 14)
      const lift = clamp(lagY * 0.25, -60, 60)
      el.style.transform =
        `translate3d(${(cur.x - BASE / 2).toFixed(2)}px, ${(cur.y - BASE / 2).toFixed(2)}px, 0) ` +
        `scale(${cur.s.toFixed(4)}) rotate(${cur.r.toFixed(2)}deg) ` +
        `rotateY(${(turn.x * 8).toFixed(2)}deg) rotateX(${(-turn.y * 5).toFixed(2)}deg)`
      // Moving right swings the hem right (counter-clockwise about the collar); the fabric shears a little with it
      S.style.transform = motion.body()
      // Each sleeve hangs from its shoulder: it trails the scroll travel and swings on top of the body's lean
      L.style.transform = `translate3d(${(lagX * 0.12).toFixed(2)}px, ${lift.toFixed(2)}px, 0) rotate(${(-swing + motion.armL() - Math.max(0, -lagY) * 0.01).toFixed(2)}deg)`
      R.style.transform = `translate3d(${(lagX * 0.12).toFixed(2)}px, ${lift.toFixed(2)}px, 0) rotate(${(-swing + motion.armR() + Math.max(0, -lagY) * 0.01).toFixed(2)}deg)`
      B.style.transform = `translate3d(0, ${(lift * 0.15).toFixed(2)}px, 0)`
    }
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener("resize", measure)
      removeEventListener("pointermove", onMove)
      ro.disconnect()
    }
  }, [])

  return (
    <div ref={root} className="traveler" aria-hidden style={{ width: BASE, height: BASE }}>
      <div ref={sway} className="traveler-sway">
        <div ref={left} className="traveler-part traveler-left">
          <img src={SRC} alt="" draggable={false} />
        </div>
        <div ref={right} className="traveler-part traveler-right">
          <img src={SRC} alt="" draggable={false} />
        </div>
        <div ref={body} className="traveler-part traveler-body">
          <img src={SRC} alt="" draggable={false} />
        </div>
      </div>
    </div>
  )
}
