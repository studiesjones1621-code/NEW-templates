"use client"

import { useEffect } from "react"
import Lenis from "lenis"
import "lenis/dist/lenis.css"

/** Momentum smooth-scrolling for wheel and trackpad. Touch keeps native scrolling; reduced motion opts out. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, autoRaf: true, anchors: true })
    return () => lenis.destroy()
  }, [])
  return null
}
