"use client"

import { useState } from "react"
import { Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import { ingredients, product, skinTypes, type SkinTypeId } from "@/lib/business"
import { TalkButton } from "./talk-button"

const eyebrow = "text-[11px] md:text-xs font-semibold uppercase tracking-[0.24em]"
const display = "font-display font-semibold tracking-tight leading-[0.95]"

/** Tap an ingredient to see what it does. */
export function Ingredients() {
  const [id, setId] = useState<(typeof ingredients)[number]["id"]>("vitc")
  const x = ingredients.find((i) => i.id === id) ?? ingredients[0]
  return (
    <section id="ingredients" className="relative bg-secondary/60 py-20 md:py-28 overflow-hidden">
      <div className="container mx-auto px-5 md:px-10 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="reveal">
          <p className={`${eyebrow} text-ember`}>What&apos;s inside</p>
          <h2 className={`mt-3 ${display} text-5xl md:text-6xl`}>
            Four ingredients, <span className="ember-text italic">one glow.</span>
          </h2>
          <div role="tablist" aria-label="Ingredients" className="mt-8 grid grid-cols-2 gap-2">
            {ingredients.map((i) => (
              <button
                key={i.id}
                role="tab"
                id={`ing-${i.id}`}
                aria-selected={i.id === id}
                aria-controls="ing-panel"
                onClick={() => setId(i.id)}
                className={cn(
                  "rounded-2xl border p-4 text-left transition-colors cursor-pointer",
                  i.id === id ? "bg-ink text-primary-foreground border-ink" : "bg-card border-border hover:border-ember/60",
                )}
              >
                <span className={cn("block text-[11px] uppercase tracking-[0.18em]", i.id === id ? "text-ember-soft" : "text-ember")}>{i.role}</span>
                <span className="mt-1 block font-semibold text-lg">{i.name}</span>
              </button>
            ))}
          </div>
          <div id="ing-panel" role="tabpanel" aria-labelledby={`ing-${x.id}`} key={x.id} className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h3 className={`${display} text-3xl md:text-4xl`}>{x.headline}</h3>
            <p className="mt-3 text-foreground/80 leading-relaxed max-w-lg">{x.body}</p>
            <p className="mt-4 rounded-2xl bg-card p-4 text-sm text-muted-foreground ring-1 ring-border max-w-lg">
              <span className="font-semibold text-foreground">Good to know: </span>
              {x.tip}
            </p>
          </div>
        </div>
        <div className="reveal relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/biz/ingredients.jpg" alt="Sea buckthorn berries, a halved blood orange and saffron threads arranged on a warm surface" loading="lazy" className="w-full aspect-[4/3] lg:aspect-[4/5] object-cover rounded-[2rem]" />
        </div>
      </div>
    </section>
  )
}

/** Pick skin type and time of day; get the routine with the serum in its place. */
export function Routine() {
  const [skin, setSkin] = useState<SkinTypeId>("combo")
  const [am, setAm] = useState(true)
  const t = skinTypes.find((s) => s.id === skin) ?? skinTypes[0]
  const steps = [
    { name: "Cleanse", note: am ? "A gentle rinse or mild cleanser." : "Take off sunscreen and makeup first." },
    { name: product.name, note: `${skin === "oily" ? "2" : "3"} drops on dry or slightly damp skin. Press in.`, ours: true },
    { name: "Moisturize", note: t.note },
    am
      ? { name: "Sunscreen, SPF 30+", note: "Every morning. It protects your skin and what vitamin C is doing for it." }
      : { name: "Night treatment (optional)", note: "Retinol or an exfoliating acid goes here, on nights you use one." },
  ]
  return (
    <section id="routine" className="relative bg-background py-20 md:py-28">
      <div className="container mx-auto px-5 md:px-10 grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-16 items-start">
        <div className="reveal lg:sticky lg:top-28">
          <p className={`${eyebrow} text-ember`}>Your routine</p>
          <h2 className={`mt-3 ${display} text-5xl md:text-6xl`}>
            Where it goes <span className="ember-text italic">in your routine.</span>
          </h2>
          <p className="mt-4 max-w-md text-foreground/75 leading-relaxed">Pick your skin type and the time of day.</p>

          <fieldset className="mt-6">
            <legend className="text-sm font-semibold">Skin type</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {skinTypes.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={skin === s.id}
                  onClick={() => setSkin(s.id)}
                  className={cn("rounded-full border px-4 py-2 text-sm font-semibold transition-colors cursor-pointer", skin === s.id ? "bg-ember text-white border-ember" : "border-border hover:border-ember/60")}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </fieldset>
          <div role="radiogroup" aria-label="Time of day" className="mt-5 inline-flex rounded-full bg-secondary p-1">
            {[
              { v: true, l: "Morning", I: Sun },
              { v: false, l: "Night", I: Moon },
            ].map(({ v, l, I }) => (
              <button
                key={l}
                type="button"
                role="radio"
                aria-checked={am === v}
                onClick={() => setAm(v)}
                className={cn("inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors cursor-pointer", am === v ? "bg-ink text-primary-foreground" : "hover:text-ember")}
              >
                <I className="w-4 h-4" aria-hidden /> {l}
              </button>
            ))}
          </div>
        </div>

        <ol className="grid gap-3" aria-live="polite">
          {steps.map((s, i) => (
            <li
              key={`${skin}-${am}-${s.name}`}
              className={cn(
                "flex gap-5 rounded-2xl p-5 md:p-6 ring-1 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both",
                "ours" in s && s.ours ? "bg-ink text-primary-foreground ring-ink" : "bg-card ring-border",
              )}
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <span className={`${display} text-4xl ember-text tabular-nums w-8`}>{i + 1}</span>
              <span>
                <span className="block font-semibold text-lg">{s.name}</span>
                <span className={cn("block mt-1 leading-relaxed", "ours" in s && s.ours ? "text-primary-foreground/75" : "text-muted-foreground")}>{s.note}</span>
              </span>
            </li>
          ))}
          {skin === "sensitive" && (
            <li className="rounded-2xl border border-dashed border-ember/50 p-5 text-sm leading-relaxed">
              <span className="font-semibold">Patch test first:</span> a little behind the ear or on the inner arm for two days. Stop if you notice
              redness or stinging that doesn&apos;t settle.
            </li>
          )}
          <li className="pt-2">
            <TalkButton className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-5 py-3 text-sm font-semibold hover:border-ember transition-colors">
              Build my routine with Amber
            </TalkButton>
          </li>
        </ol>
      </div>
    </section>
  )
}
