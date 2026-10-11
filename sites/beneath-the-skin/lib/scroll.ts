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
