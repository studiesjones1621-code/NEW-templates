"use client"

import { useEffect, useRef } from "react"
import { technology } from "@/lib/brand"

// Scroll-driven 3D exploded stack of the jacket's layers. The scene lives in /public/layers.js (plain three.js from
// a CDN, no bundling), loaded in the first quiet moment so it's ready before you get here.
export function Technology() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let loaded = false
    let lastScroll = performance.now()
    let timer = 0
    const load = () => {
      if (loaded) return
      loaded = true
      cleanup()
      import(/* webpackIgnore: true */ "/layers.js" as string).then((m) => m.lazy?.(el)).catch(() => {})
    }
    const onScroll = () => (lastScroll = performance.now())
    const check = () => {
      if (performance.now() - lastScroll > 400) load()
      else timer = window.setTimeout(check, 250)
    }
    const io = new IntersectionObserver(([e]) => e.isIntersecting && load(), { rootMargin: "200% 0px" })
    const cleanup = () => {
      io.disconnect()
      clearTimeout(timer)
      window.removeEventListener("scroll", onScroll)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    io.observe(el)
    timer = window.setTimeout(check, 1500)
    return cleanup
  }, [])

  return (
    <section ref={ref} id="technology" data-layers className="relative h-[380svh] motion-reduce:h-[200svh]">
      <div data-layers-stage className="sticky top-0 h-[100svh] overflow-hidden">
        {/* The travelling jacket shrinks into the stack here and disappears */}
        <div data-slot data-opacity="0" className="tech-slot" />
        <canvas className="absolute inset-0 w-full h-full" aria-label="3D exploded view of the jacket's four layers" />
        <svg data-layers-lines className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden />

        <div className="absolute left-5 md:left-10 top-24 md:top-28 z-20 max-w-[22rem]">
          <h2 className="font-display text-[2.1rem] leading-[1.02] md:text-6xl uppercase">
            {technology.title.map((l) => (
              <span key={l} className="block" data-decode>{l}</span>
            ))}
          </h2>
        </div>
        <p className="tech-body mono-small absolute left-5 md:left-10 bottom-10 z-20 hidden lg:block">
          {technology.body.map((l) => <span key={l} className="block">{l}</span>)}
        </p>

        <ol className="tech-cards z-20">
          {technology.layers.map((l) => (
            <li key={l.n} data-layer-card className="tech-card">
              <span className="tech-card-n">{l.n}</span>
              <div>
                <p className="font-display uppercase tracking-[0.1em] text-[12px] md:text-[13px]">{l.title}</p>
                <p className="mono-small mt-1.5">{l.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
