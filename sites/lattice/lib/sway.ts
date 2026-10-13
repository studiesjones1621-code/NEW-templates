// Mouse sway for product cut-outs (a jacket split into body + two sleeves). Every jacket on the page shares one
// pointer-velocity tracker. Each jacket is a damped spring hung from its collar: it stays where it is but leans the
// way the mouse moves, as far as the mouse is fast, then settles with a small overshoot. Each sleeve is a looser
// spring chasing the body, so it swings a beat later, overshoots and settles like fabric.

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))

/** Pointer velocity in px/s, filtered, and dying away quickly once the mouse stops. */
export const pointer = { vx: 0, vy: 0, x: -1, y: -1, t: 0 }
let tracking = false
export function trackPointer() {
  if (tracking || typeof window === "undefined") return
  tracking = true
  if (matchMedia("(pointer: coarse)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return
  addEventListener(
    "pointermove",
    (e) => {
      const t = e.timeStamp
      if (pointer.t && t > pointer.t) {
        const dt = Math.max(8, t - pointer.t) / 1000
        // Lightly filtered so a single jittery sample can't kick a jacket
        pointer.vx += ((e.clientX - pointer.x) / dt - pointer.vx) * 0.5
        pointer.vy += ((e.clientY - pointer.y) / dt - pointer.vy) * 0.5
      }
      pointer.x = e.clientX
      pointer.y = e.clientY
      pointer.t = t
    },
    { passive: true },
  )
}
/** Call once per frame (before stepping jackets): a mouse at rest has no velocity. */
export function decayPointer(now: number, dt: number) {
  if (now - pointer.t > 40) {
    const d = Math.exp(-dt * 14)
    pointer.vx *= d
    pointer.vy *= d
  }
}

type Spring = { a: number; v: number }
const step = (s: Spring, goal: number, k: number, c: number, dt: number) => {
  // Fixed small substeps keep the springs stable on slow frames
  const n = Math.ceil(dt / (1 / 120))
  const h = dt / n
  for (let i = 0; i < n; i++) {
    s.v += (k * (goal - s.a) - c * s.v) * h
    s.a += s.v * h
  }
}

export function createSway(strength = 1) {
  const lean = { a: 0, v: 0 }, tip = { a: 0, v: 0 }, armL = { a: 0, v: 0 }, armR = { a: 0, v: 0 }
  return {
    /** Advance the springs; `gain` scales the mouse's push (e.g. stronger while hovered). */
    step(dt: number, gain = 1) {
      const g = gain * strength
      // About 1° of lean per 140 px/s, capped so a flick never tosses it
      step(lean, clamp((pointer.vx / 140) * g, -10, 10), 140, 13, dt)
      step(tip, clamp((pointer.vy / 200) * g, -6, 6), 120, 14, dt)
      step(armL, lean.a * 1.3, 60, 7.5, dt)
      step(armR, lean.a * 1.3, 52, 7, dt)
    },
    get resting() {
      return [lean, tip, armL, armR].every((s) => Math.abs(s.a) < 0.02 && Math.abs(s.v) < 0.05)
    },
    /** Transforms for the whole jacket (pivot at the collar) and each sleeve's extra swing (pivot at its shoulder). */
    lean: () => lean.a,
    body: () =>
      `rotate(${(-lean.a).toFixed(3)}deg) skewX(${(lean.a * 0.25).toFixed(3)}deg) ` +
      `rotateX(${(-tip.a).toFixed(3)}deg) translate3d(${(lean.a * 2.5).toFixed(2)}px, 0, 0)`,
    armL: () => -clamp(armL.a - lean.a, -9, 9),
    armR: () => -clamp(armR.a - lean.a, -9, 9),
  }
}
