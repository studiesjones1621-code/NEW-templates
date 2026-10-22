"use client"

import type React from "react"
import { Gift } from "lucide-react"
import { business, services } from "@/lib/business"
import { TalkButton } from "./talk-button"

/** Tilts a card toward the pointer (desktop only), with a glare that follows. */
function tilt(e: React.PointerEvent<HTMLElement>) {
  if (e.pointerType !== "mouse") return
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width - 0.5
  const y = (e.clientY - r.top) / r.height - 0.5
  el.style.transform = `perspective(900px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg) translateZ(0)`
  el.style.setProperty("--gx", `${((x + 0.5) * 100).toFixed(1)}%`)
  el.style.setProperty("--gy", `${((y + 0.5) * 100).toFixed(1)}%`)
}
function untilt(e: React.PointerEvent<HTMLElement>) {
  e.currentTarget.style.transform = ""
}

export function Services() {
  return (
    <section id="services" className="relative bg-foam pt-10 md:pt-16 pb-24 md:pb-32">
      {/* Bath-foam rim the hero scrolls into */}
      <div className="foam-edge absolute inset-x-0 -top-[78px] h-[80px] pointer-events-none" aria-hidden />
      {/* New-customer offer, straight from the shop's homepage */}
      <div className="overflow-hidden border-y border-primary/10 bg-marigold/90 text-primary">
        <div className="marquee flex w-max gap-10 py-3 font-display font-bold text-sm md:text-base whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} className="flex gap-10" aria-hidden={k === 1}>
              {Array.from({ length: 4 }).map((__, i) => (
                <span key={i} className="inline-flex items-center gap-3">
                  <Gift className="w-4 h-4" aria-hidden /> {business.offer.title} · {business.offer.detail} · {business.offer.ends}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-5 md:px-8 mt-20 md:mt-28">
        <div className="max-w-2xl reveal">
          <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-sky-deep">What we do</p>
          <h2 className="mt-3 font-display font-extrabold tracking-tight text-4xl md:text-6xl leading-[0.95]">
            Grooming that takes <span className="lucky-text">its time.</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-xl">
            No 15-minute clips. Every pet gets personal attention, safe handling and a finish worth the wait.
          </p>
        </div>

        <div className="mt-12 md:mt-16 grid gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <article
              key={s.id}
              onPointerMove={tilt}
              onPointerLeave={untilt}
              className="reveal group relative flex flex-col overflow-hidden rounded-3xl bg-card shadow-[0_20px_50px_-24px_oklch(0.3_0.03_235/0.45)] ring-1 ring-primary/5 will-change-transform"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.image}
                  alt={s.alt}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 rounded-full bg-background/90 px-3 py-1 text-[11px] font-bold">{s.price}</span>
                <span
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_var(--gx,50%)_var(--gy,50%),rgb(255_255_255/0.35),transparent_45%)]"
                  aria-hidden
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-deep">{s.tag}</p>
                <h3 className="mt-2 font-display font-bold text-2xl">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground flex-1">{s.body}</p>
                <TalkButton
                  icon={false}
                  className="mt-5 self-start text-sm font-semibold underline decoration-tangerine decoration-2 underline-offset-4 hover:text-tangerine transition-colors"
                >
                  Ask about {s.title.toLowerCase()} →
                </TalkButton>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
