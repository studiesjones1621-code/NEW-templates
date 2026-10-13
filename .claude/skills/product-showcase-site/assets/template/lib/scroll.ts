import type Lenis from "lenis"

// The active Lenis instance, so scroll-driven components can update in the same frame Lenis moves the page
// (listening to native scroll events instead lags a frame behind, which reads as stutter on phones).
let instance: Lenis | null = null
const listeners = new Set<() => void>()

export function setLenis(lenis: Lenis | null) {
  instance = lenis
  listeners.forEach((fn) => fn())
}

/** Calls `fn` on every Lenis scroll frame. Returns an unsubscribe function. */
export function onLenisScroll(fn: () => void) {
  let off: (() => void) | undefined
  const attach = () => {
    off?.()
    off = instance?.on("scroll", fn)
  }
  attach()
  listeners.add(attach)
  return () => {
    off?.()
    listeners.delete(attach)
  }
}

/**
 * Scroll-driven animations (Chrome 115+, Safari 26+) run on the compositor, perfectly in step with the phone's own
 * native scrolling, with no per-frame JavaScript. Used on touch screens; desktop keeps the proven Lenis + JS path.
 */
export const supportsScrollTimelines = () =>
  typeof window !== "undefined" &&
  "ViewTimeline" in window &&
  window.matchMedia("(pointer: coarse)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches

/** The active Lenis instance, if smooth scrolling is on (e.g. to read its `velocity`). */
export const getLenis = () => instance
