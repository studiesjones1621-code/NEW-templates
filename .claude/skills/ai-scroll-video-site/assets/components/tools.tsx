"use client"

import { useState } from "react"
import { systems } from "@/lib/business"
import { TalkButton } from "./talk-button"

const eyebrow = "text-[11px] md:text-xs font-semibold uppercase tracking-[0.22em]"

/** "When did you last change this?" The filter gets dirtier as the months go up. */
export function FilterCheck() {
  const [months, setMonths] = useState(1)
  const dirt = Math.min(1, months / 9)
  const status =
    months <= 2
      ? { label: "Fresh", tone: "text-frost border-frost/40", note: "Good. Most 1-inch filters last 1 to 3 months." }
      : months <= 3
        ? { label: "Change soon", tone: "text-ember-soft border-ember-soft/40", note: "Time to swap it, sooner if you have pets or allergies." }
        : { label: "Overdue", tone: "text-ember border-ember/50", note: "A clogged filter chokes airflow, raises bills and strains the blower." }

  return (
    <section id="filter" className="relative bg-background py-20 md:py-28">
      <div className="container mx-auto px-5 md:px-10 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="reveal">
          <p className={`${eyebrow} text-frost`}>Quick check</p>
          <h2 className="mt-3 font-display font-extrabold tracking-tight text-5xl md:text-6xl leading-[0.92]">
            When did you last <span className="ember-text">change this?</span>
          </h2>
          <p className="mt-4 max-w-md text-white/70 leading-relaxed">
            The cheapest fix in heating and cooling. Slide to how long it&apos;s been.
          </p>
          <div className="mt-8 max-w-md">
            <label htmlFor="months" className="flex items-baseline justify-between text-sm">
              <span className="text-white/70">Months since last change</span>
              <span className="font-display font-extrabold text-3xl tabular-nums">{months}</span>
            </label>
            <input id="months" type="range" min={0} max={12} value={months} onChange={(e) => setMonths(Number(e.target.value))} className="dial-range mt-3" />
            <div className={`mt-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-bold ${status.tone}`} aria-live="polite">
              {status.label}
            </div>
            <p className="mt-3 text-sm text-white/70">{status.note}</p>
          </div>
        </div>
        <div className="reveal relative aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/biz/filter-clean.jpg" alt="A clean pleated air filter" className="absolute inset-0 w-full h-full object-cover" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/biz/filter-dirty.jpg"
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
            style={{ opacity: dirt }}
          />
        </div>
      </div>
    </section>
  )
}

/** "Which one fits your house?" */
export function Systems() {
  const [id, setId] = useState<(typeof systems)[number]["id"]>("heatpump")
  const s = systems.find((x) => x.id === id) ?? systems[0]
  return (
    <section id="systems" className="relative bg-ink py-20 md:py-28">
      <div className="container mx-auto px-5 md:px-10">
        <div className="reveal max-w-2xl">
          <p className={`${eyebrow} text-ember-soft`}>New systems</p>
          <h2 className="mt-3 font-display font-extrabold tracking-tight text-5xl md:text-6xl leading-[0.92]">
            Which one fits <span className="frost-text">your house?</span>
          </h2>
        </div>
        <div role="tablist" aria-label="System types" className="reveal mt-8 inline-flex flex-wrap gap-2 rounded-full bg-card p-1.5">
          {systems.map((x) => (
            <button
              key={x.id}
              role="tab"
              id={`tab-${x.id}`}
              aria-selected={x.id === id}
              aria-controls="system-panel"
              onClick={() => setId(x.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors cursor-pointer ${x.id === id ? "bg-ember text-ink" : "text-white/75 hover:text-white"}`}
            >
              {x.name}
            </button>
          ))}
        </div>
        <div id="system-panel" role="tabpanel" aria-labelledby={`tab-${s.id}`} className="mt-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-card ring-1 ring-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img key={s.id} src={s.image} alt={s.alt} className="absolute inset-0 w-full h-full object-cover animate-in fade-in zoom-in-95 duration-500" />
          </div>
          <div key={s.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h3 className="font-display font-extrabold text-4xl">{s.name}</h3>
            <p className="mt-3 text-lg text-white/75 leading-relaxed">{s.pitch}</p>
            <dl className="mt-6 grid grid-cols-3 gap-3">
              {[
                ["Typical life", s.life],
                ["Strength", s.efficiency],
                ["Best for", s.bestFor],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-card p-4 min-w-0">
                  <dt className="text-[11px] uppercase tracking-[0.14em] text-white/55">{k}</dt>
                  <dd className="mt-1 text-sm font-semibold leading-snug">{v}</dd>
                </div>
              ))}
            </dl>
            <TalkButton className="mt-7 inline-flex items-center gap-2 rounded-full bg-ember text-ink px-6 py-3.5 text-sm font-bold hover:bg-ember-soft transition-colors">
              Book a free estimate
            </TalkButton>
          </div>
        </div>
      </div>
    </section>
  )
}

/** "Repair it, or replace it?" The industry's $5,000 rule: age × repair cost. */
export function RepairOrReplace() {
  const [age, setAge] = useState(12)
  const [cost, setCost] = useState(600)
  const score = age * cost
  const replace = score > 5000
  const pct = Math.min(100, (score / 10000) * 100)
  return (
    <section id="repair" className="relative bg-background py-20 md:py-28">
      <div className="container mx-auto px-5 md:px-10 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="reveal">
          <p className={`${eyebrow} text-frost`}>The $5,000 rule</p>
          <h2 className="mt-3 font-display font-extrabold tracking-tight text-5xl md:text-6xl leading-[0.92]">
            Repair it, <span className="ember-text">or replace it?</span>
          </h2>
          <p className="mt-4 max-w-md text-white/70 leading-relaxed">
            Multiply the system&apos;s age by the repair quote. Over $5,000, replacing usually makes more sense. It&apos;s a rule of thumb, and
            we&apos;ll give you the real numbers either way.
          </p>
        </div>
        <div className="reveal rounded-2xl bg-card ring-1 ring-white/10 p-6 md:p-8">
          <label htmlFor="age" className="flex items-baseline justify-between text-sm">
            <span className="text-white/70">System age</span>
            <span className="font-display font-extrabold text-2xl tabular-nums">{age} yrs</span>
          </label>
          <input id="age" type="range" min={1} max={25} value={age} onChange={(e) => setAge(Number(e.target.value))} className="dial-range mt-3" />
          <label htmlFor="cost" className="mt-7 flex items-baseline justify-between text-sm">
            <span className="text-white/70">Repair quote</span>
            <span className="font-display font-extrabold text-2xl tabular-nums">${cost.toLocaleString()}</span>
          </label>
          <input id="cost" type="range" min={100} max={3000} step={50} value={cost} onChange={(e) => setCost(Number(e.target.value))} className="dial-range mt-3" />

          <div className="mt-8 rounded-xl bg-ink p-5" aria-live="polite">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-white/60 tabular-nums">
                {age} × ${cost.toLocaleString()} = ${score.toLocaleString()}
              </span>
              <span className={`font-display font-extrabold text-2xl ${replace ? "text-ember" : "text-frost"}`}>{replace ? "Time to replace" : "Repair it"}</span>
            </div>
            <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-300 ${replace ? "bg-ember" : "bg-frost"}`} style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-1.5 flex justify-between text-[11px] text-white/45 tabular-nums">
              <span>$0</span>
              <span>$5,000</span>
              <span>$10,000+</span>
            </div>
          </div>
          <TalkButton className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-semibold hover:border-ember transition-colors">
            Get a second opinion
          </TalkButton>
        </div>
      </div>
    </section>
  )
}
