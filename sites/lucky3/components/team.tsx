"use client"

import { useEffect, useRef } from "react"
import { Stethoscope, Car, Clock, ShieldCheck } from "lucide-react"
import { book, perks, team } from "@/lib/business"

const perkIcons = [ShieldCheck, Stethoscope, Clock, Car]

/** David & Beverly, and David's real book as a 3D object that turns as you scroll. */
export function Team() {
  const bookRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = bookRef.current
    const section = sectionRef.current
    if (!el || !section) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let raf = 0
    const tick = () => {
      const r = section.getBoundingClientRect()
      const vh = window.innerHeight
      if (r.bottom > 0 && r.top < vh) {
        const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)))
        const ry = -38 + p * 62
        const rx = 8 - p * 10
        el.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section ref={sectionRef} id="team" className="relative bg-secondary py-24 md:py-32 overflow-hidden">
      <div className="container mx-auto px-5 md:px-8 grid lg:grid-cols-[1fr_0.8fr] gap-14 lg:gap-20 items-center">
        <div>
          <div className="reveal">
            <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-sky-deep">Who grooms your pet</p>
            <h2 className="mt-3 font-display font-extrabold tracking-tight text-4xl md:text-6xl leading-[0.95]">
              A New York stylist <span className="lucky-text">who wrote the book.</span>
            </h2>
          </div>
          <div className="mt-10 grid sm:grid-cols-2 gap-5">
            {team.map((t) => (
              <article key={t.name} className="reveal rounded-3xl bg-card p-6 ring-1 ring-primary/5">
                <h3 className="font-display font-bold text-2xl">{t.name}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-sky-deep">{t.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
              </article>
            ))}
          </div>
          <ul className="mt-10 grid sm:grid-cols-2 gap-x-8 gap-y-6">
            {perks.map((p, i) => {
              const Icon = perkIcons[i]
              return (
                <li key={p.title} className="reveal flex gap-4">
                  <span className="shrink-0 flex items-center justify-center w-11 h-11 rounded-2xl bg-marigold/80 text-primary">
                    <Icon className="w-5 h-5" aria-hidden />
                  </span>
                  <div>
                    <p className="font-semibold">{p.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{p.body}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        {/* The book */}
        <div className="reveal flex flex-col items-center">
          <div className="relative w-[210px] md:w-[250px] aspect-[155/235]" style={{ perspective: "1100px" }}>
            <div ref={bookRef} className="absolute inset-0 [transform-style:preserve-3d] will-change-transform" style={{ transform: "rotateY(-30deg)" }}>
              {/* front cover */}
              <div className="absolute inset-0 [backface-visibility:hidden] rounded-r-md overflow-hidden shadow-2xl" style={{ transform: "translateZ(14px)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={book.image} alt={`Cover of ${book.title} by ${book.author}`} className="w-full h-full object-cover" />
                <span className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/25 to-transparent" aria-hidden />
              </div>
              {/* spine */}
              <div
                className="absolute top-0 bottom-0 left-0 w-[28px] bg-[oklch(0.55_0.2_25)] flex items-center justify-center"
                style={{ transform: "translateZ(-14px) rotateY(-90deg)", transformOrigin: "left center" }}
                aria-hidden
              >
                <span className="text-[9px] font-bold text-white tracking-[0.2em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap">DAVID WALTER · DOG GROOMING</span>
              </div>
              {/* pages */}
              <div
                className="absolute top-[2px] bottom-[2px] right-0 w-[26px] bg-[repeating-linear-gradient(90deg,#f4efe4_0_2px,#e2dccd_2px_3px)]"
                style={{ transform: "translateZ(-13px) rotateY(90deg)", transformOrigin: "right center" }}
                aria-hidden
              />
              {/* back */}
              <div className="absolute inset-0 rounded-l-md bg-[oklch(0.55_0.2_25)]" style={{ transform: "translateZ(-14px) rotateY(180deg)" }} aria-hidden />
            </div>
            <div className="absolute -bottom-8 inset-x-4 h-6 rounded-[50%] bg-primary/25 blur-md" aria-hidden />
          </div>
          <div className="mt-14 max-w-sm text-center">
            <h3 className="font-display font-bold text-xl leading-snug">{book.title}</h3>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{book.body}</p>
            <blockquote className="mt-4 text-sm italic text-primary/80">&ldquo;{book.quote}&rdquo;</blockquote>
            <p className="mt-4 text-sm font-semibold">Buy your copy at the shop.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
