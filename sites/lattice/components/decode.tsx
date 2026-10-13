"use client"

import { useEffect } from "react"

// Labels "decode" out of static: every element marked data-decode scrambles and resolves left to right the first
// time it scrolls into view. Elements marked data-decode="hover" (and anything inside an element with
// data-decode-trigger) decode again on hover. Text is monospaced, so nothing reflows while it runs.
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*<>/=+"
const FILL = " " // figure space: same width as a glyph, so lines keep their length while unsolved
const running =new WeakMap<Element, number>()

function decode(el: HTMLElement) {
  const text = el.dataset.text ?? (el.dataset.text = el.textContent ?? "")
  cancelAnimationFrame(running.get(el) ?? 0)
  const start = performance.now()
  const dur = Math.min(1100, 260 + text.length * 22)
  const tick = (now: number) => {
    const t = (now - start) / dur
    const solved = Math.floor(t * text.length * 1.1)
    let out = ""
    for (let i = 0; i < text.length; i++) {
      const c = text[i]
      out += i < solved || c === " " || c === "." || c === "," ? c : i < solved + 8 ? GLYPHS[(Math.random() * GLYPHS.length) | 0] : FILL
    }
    el.textContent = out
    if (t < 1) running.set(el, requestAnimationFrame(tick))
    else el.textContent = text
  }
  running.set(el, requestAnimationFrame(tick))
}

export function Decode() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const els = [...document.querySelectorAll<HTMLElement>("[data-decode]")]
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          io.unobserve(e.target)
          decode(e.target as HTMLElement)
        }),
      { rootMargin: "0px 0px -8% 0px" },
    )
    els.forEach((el) => {
      el.dataset.text = el.textContent ?? ""
      io.observe(el)
    })
    const onOver = (e: Event) => {
      const t = (e.target as Element).closest?.("[data-decode='hover'], [data-decode-trigger]")
      if (!t || t.contains((e as MouseEvent).relatedTarget as Node)) return
      const targets = t.matches("[data-decode]") ? [t] : [...t.querySelectorAll("[data-decode]")]
      targets.forEach((el) => decode(el as HTMLElement))
    }
    document.addEventListener("mouseover", onOver)
    return () => {
      io.disconnect()
      document.removeEventListener("mouseover", onOver)
    }
  }, [])
  return null
}
