"use client"

import { useEffect } from "react"
import Lenis from "lenis"
import "lenis/dist/lenis.css"
import { setLenis } from "@/lib/scroll"

// iOS before 16 handles JS-driven touch scrolling poorly, so those devices keep native touch scrolling
const oldIOS = () => {
  const m = navigator.userAgent.match(/OS (\d+)_\d+(?:_\d+)? like Mac OS X/)
  return !!m && Number(m[1]) < 16
}

/**
 * Momentum smooth-scrolling for wheel, trackpad and touch. On phones `syncTouch` runs the scroll on the JS
 * thread (the approach GSAP's ScrollSmoother uses with smoothTouch), so the scroll-driven hero and 3D section
 * move in lockstep with the page instead of trailing the native scroll. Reduced motion opts out.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      syncTouch: !oldIOS(),
      syncTouchLerp: 0.1, // a touch snappier than the default so it never feels like it lags the finger
      touchInertiaExponent: 1.7,
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
