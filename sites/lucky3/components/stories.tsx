"use client"

import { useRef, useState } from "react"
import { MoveHorizontal } from "lucide-react"
import { stories } from "@/lib/business"
import { TalkButton } from "./talk-button"

/** A real before/after from the shop (drag to compare), the matted-coat photo, and three real cases. */
export function Stories() {
  const [split, setSplit] = useState(52)
  const boxRef = useRef<HTMLDivElement>(null)

  const move = (clientX: number) => {
    const r = boxRef.current?.getBoundingClientRect()
    if (!r) return
    setSplit(Math.min(96, Math.max(4, ((clientX - r.left) / r.width) * 100)))
  }

  return (
    <section id="matted" className="relative bg-background grain py-24 md:py-32 overflow-hidden">
      <div className="container mx-auto px-5 md:px-8">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
          <div className="relative reveal">
            <div
              ref={boxRef}
              className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-primary/25 select-none touch-none cursor-ew-resize"
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId)
                move(e.clientX)
              }}
              onPointerMove={(e) => e.buttons && move(e.clientX)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/biz/groomed-after.jpg" alt="The same dog after grooming at Lucky 3" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/biz/matted-before.jpg" alt="A matted dog before grooming at Lucky 3" className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <span className="absolute top-4 left-4 rounded-full bg-primary text-primary-foreground px-3 py-1 text-xs font-bold">Before</span>
              <span className="absolute top-4 right-4 rounded-full bg-marigold text-primary px-3 py-1 text-xs font-bold">After</span>
              <div className="absolute inset-y-0 w-[3px] bg-white shadow" style={{ left: `calc(${split}% - 1.5px)` }}>
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 rounded-full bg-white text-primary shadow-lg">
                  <MoveHorizontal className="w-5 h-5" aria-hidden />
                </span>
              </div>
              <input
                type="range"
                min={4}
                max={96}
                value={Math.round(split)}
                onChange={(e) => setSplit(Number(e.target.value))}
                className="sr-only"
                aria-label="Compare before and after"
              />
            </div>
            {/* The real matted coat, pinned like a snapshot */}
            <figure className="hidden sm:block absolute -bottom-10 -right-4 lg:-right-10 w-40 md:w-48 rotate-[7deg] bg-white p-2 pb-8 shadow-xl shadow-primary/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/biz/matted-coat.jpg" alt="A severely matted coat that came into the shop" loading="lazy" className="w-full aspect-[3/4] object-cover" />
              <figcaption className="absolute bottom-2 inset-x-2 text-center text-[11px] font-semibold text-primary/70">Yes, we can help.</figcaption>
            </figure>
          </div>

          <div className="reveal">
            <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-sky-deep">Matted, nervous, difficult</p>
            <h2 className="mt-3 font-display font-extrabold tracking-tight text-4xl md:text-6xl leading-[0.95]">
              The pets other groomers <span className="lucky-text">won&apos;t take.</span>
            </h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              We work slowly through mats to avoid stress, skin irritation or injury, using holding techniques David devised himself.
              Severe cases need extra time, so call ahead.
            </p>
            <TalkButton className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3.5 text-sm font-semibold hover:bg-tangerine hover:text-primary transition-colors">
              Describe your pet&apos;s coat
            </TalkButton>
          </div>
        </div>

        <div className="mt-24 md:mt-28 grid gap-5 md:grid-cols-3">
          {stories.map((s, i) => (
            <article key={s.title} className="reveal relative rounded-3xl bg-card p-7 ring-1 ring-primary/5 shadow-[0_20px_50px_-30px_oklch(0.3_0.03_235/0.5)]">
              <span className="font-display font-extrabold text-6xl leading-none lucky-text">{i + 1}</span>
              <h3 className="mt-3 font-display font-bold text-xl">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </article>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground reveal">Real cases from the Lucky 3 grooming table.</p>
      </div>
    </section>
  )
}
