"use client"

import { useEffect } from "react"
import Lenis from "lenis"
import "lenis/dist/lenis.css"
import { setLenis, supportsScrollTimelines } from "@/lib/scroll"

// iOS before 16 handles JS-driven touch scrolling poorly, so those devices keep native touch scrolling
const oldIOS = () => {
  const m = navigator.userAgent.match(/OS (\d+)_\d+(?:_\d+)? like Mac OS X/)
  return !!m && Number(m[1]) < 16
}

/**
 * Momentum smooth-scrolling for wheel and trackpad. Touch screens:
 * - Phones with scroll-driven animations (iOS 26+, Chrome 115+) keep their own native scrolling, with its natural
 *   speed and momentum; the hero is played by the compositor in step with it.
 * - Older phones use `syncTouch` (scroll on the JS thread, like GSAP ScrollSmoother's smoothTouch), so the JS-driven
 *   hero moves in lockstep with the page, with gentle inertia so it never flings too far.
 * Reduced motion opts out.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      syncTouch: !oldIOS() && !supportsScrollTimelines(),
      syncTouchLerp: 0.085,
      touchInertiaExponent: 1.3, // gentler fling than the default 1.7, closer to native momentum
      autoRaf: true,
      anchors: true,
      // Let the voice widget's own panels scroll natively
      prevent: (node) => node.id === "retell-widget-root" || node.hasAttribute?.("data-lenis-prevent"),
    })
    setLenis(lenis)
    return () => {
      setLenis(null)
      lenis.destroy()
    }
  }, [])
  return null
}
