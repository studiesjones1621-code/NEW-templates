"use client"

import { useEffect, useRef } from "react"
import { createSway, decayPointer, pointer, trackPointer } from "@/lib/sway"
import { BEND_MARGIN, createBender, loadImage } from "@/lib/bend"

// A product cut-out that sways with the mouse (lib/sway). The card under the cursor sways fully, the others
// gently. All instances share one animation loop that runs only while something is on screen and moving.
type Inst = { visible: boolean; hovered: boolean; tick: (dt: number) => boolean }
const all = new Set<Inst>()
let raf = 0, last = 0
const loop = (now: number) => {
  const dt = last ? Math.min(0.033, (now - last) / 1000) : 0.016
  last = now
  decayPointer(now, dt)
  let busy = false
  for (const i of all) if (i.visible && i.tick(dt)) busy = true
  if (busy || Math.abs(pointer.vx) + Math.abs(pointer.vy) > 1) raf = requestAnimationFrame(loop)
  else raf = last = 0
}
const wake = () => {
  if (!raf) raf = requestAnimationFrame(loop)
}

export function SwayJacket({ src, alt, className = "", hinges = true }: { src: string; alt: string; className?: string; hinges?: boolean }) {
  const sway = useRef<HTMLDivElement>(null)
  const left = useRef<HTMLDivElement>(null)
  const right = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const S = sway.current, L = left.current, R = right.current
    if (!S || !L || !R) return
    if (matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches) return
    trackPointer()
    const motion = createSway(1)
    const card = S.closest("[data-sway-card]") ?? S
    const box = S.parentElement!
    // Draw on a bending WebGL sheet (lib/bend) when available; the DOM layers stay as the fallback
    let bender: ReturnType<typeof createBender> = null
    const C = canvas.current
    const fit = () => bender?.resize(box.clientWidth * (1 + 2 * BEND_MARGIN) * 1.06)
    if (C)
      loadImage(src)
        .then((img) => {
          bender = createBender(C, img, hinges)
          if (!bender) return
          box.classList.add("bend-on")
          fit()
          bender.draw(motion.state(0))
        })
        .catch(() => {})
    const ro = new ResizeObserver(() => {
      fit()
      bender?.draw(motion.state(performance.now() / 1000))
    })
    ro.observe(box)
    const inst: Inst = {
      visible: false,
      hovered: false,
      tick(dt) {
        motion.step(dt, inst.hovered ? 1.5 : 0.35)
        if (bender && !bender.lost) {
          bender.draw(motion.state(performance.now() / 1000))
          return !motion.resting
        }
        if (bender?.lost) box.classList.remove("bend-on")
        S.style.transform = motion.body()
        L.style.transform = `rotate(${motion.armL().toFixed(2)}deg)`
        R.style.transform = `rotate(${motion.armR().toFixed(2)}deg)`
        return !motion.resting
      },
    }
    all.add(inst)
    const io = new IntersectionObserver(([e]) => (inst.visible = e.isIntersecting))
    io.observe(S)
    const enter = () => (inst.hovered = true)
    const leave = () => (inst.hovered = false)
    card.addEventListener("pointerenter", enter)
    card.addEventListener("pointerleave", leave)
    addEventListener("pointermove", wake, { passive: true })
    return () => {
      all.delete(inst)
      io.disconnect()
      ro.disconnect()
      card.removeEventListener("pointerenter", enter)
      card.removeEventListener("pointerleave", leave)
      removeEventListener("pointermove", wake)
    }
  }, [src, hinges])

  return (
    <div className={`sway${hinges ? "" : " no-hinges"} ${className}`}>
      <canvas ref={canvas} className="bend-canvas" aria-hidden />
      <div ref={sway} className="sway-inner">
        <div ref={left} className="sway-part sway-left" aria-hidden>
          <img src={src} alt="" loading="lazy" draggable={false} />
        </div>
        <div ref={right} className="sway-part sway-right" aria-hidden>
          <img src={src} alt="" loading="lazy" draggable={false} />
        </div>
        <div className="sway-part sway-body">
          <img src={src} alt={alt} loading="lazy" draggable={false} />
        </div>
      </div>
    </div>
  )
}
