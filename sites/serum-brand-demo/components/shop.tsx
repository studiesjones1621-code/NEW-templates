"use client"

import { useState } from "react"
import { Check, Minus, Plus, Repeat, Truck } from "lucide-react"
import { cn } from "@/lib/utils"
import { product, type SizeId } from "@/lib/business"
import { money, unitPrice, useCart } from "./cart"
import { TalkButton } from "./talk-button"

const eyebrow = "text-[11px] md:text-xs font-semibold uppercase tracking-[0.24em]"
const display = "font-display font-semibold tracking-tight leading-[0.95]"

/** Compact size picker + add, used over the hero footage. */
export function AddToBag({ className }: { className?: string }) {
  const { add } = useCart()
  const [size, setSize] = useState<SizeId>("30")
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <div role="radiogroup" aria-label="Size" className="inline-flex rounded-full bg-card/85 p-1 ring-1 ring-ink/10 backdrop-blur-sm">
        {product.sizes.map((s) => (
          <button
            key={s.id}
            type="button"
            role="radio"
            aria-checked={size === s.id}
            onClick={() => setSize(s.id)}
            className={cn("rounded-full px-4 py-2 text-sm font-semibold transition-colors cursor-pointer", size === s.id ? "bg-ink text-primary-foreground" : "hover:text-ember")}
          >
            {s.label} · ${s.price}
          </button>
        ))}
      </div>
      <button type="button" onClick={() => add(size, false)} className="rounded-full bg-ember text-white px-6 py-3 text-sm font-bold hover:bg-ink transition-colors cursor-pointer">
        Add to bag
      </button>
    </div>
  )
}

export function Shop() {
  const { add } = useCart()
  const [size, setSize] = useState<SizeId>("30")
  const [subscribe, setSubscribe] = useState(true)
  const [qty, setQty] = useState(1)
  const base = unitPrice(size, false)
  const price = unitPrice(size, subscribe)
  return (
    <section id="shop" className="relative bg-background py-20 md:py-28">
      <div className="container mx-auto px-5 md:px-10 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="reveal relative">
          <div className="absolute -inset-6 rounded-[2.5rem] bg-frost/70 blur-2xl" aria-hidden />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.photo} alt={`${product.name}, an amber glass dropper bottle`} className="relative w-full max-w-md mx-auto aspect-[4/5] object-cover rounded-[2rem] shadow-2xl shadow-ember/20" />
        </div>
        <div className="reveal">
          <p className={`${eyebrow} text-ember`}>Shop</p>
          <h2 className={`mt-3 ${display} text-5xl md:text-6xl`}>{product.name}</h2>
          <p className="mt-3 text-lg text-muted-foreground">{product.short}</p>
          <ul className="mt-6 grid sm:grid-cols-2 gap-2">
            {product.highlights.map((h) => (
              <li key={h} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-ember shrink-0" aria-hidden /> {h}
              </li>
            ))}
          </ul>

          <fieldset className="mt-8">
            <legend className="text-sm font-semibold">Size</legend>
            <div className="mt-2 grid grid-cols-2 gap-3">
              {product.sizes.map((s) => (
                <label key={s.id} className={cn("rounded-2xl border p-4 cursor-pointer transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ember", size === s.id ? "border-ember bg-card shadow-sm" : "border-border hover:border-ember/50")}>
                  <input type="radio" name="size" value={s.id} checked={size === s.id} onChange={() => setSize(s.id)} className="sr-only" />
                  <span className="block font-semibold">{s.label}</span>
                  <span className="block text-sm text-muted-foreground">{s.id === "15" ? "About 6 weeks" : "About 3 months"}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-5">
            <legend className="sr-only">Purchase type</legend>
            <div className="grid gap-3">
              {[
                { v: true, t: `Subscribe & save ${product.subscribeOff * 100}%`, d: "Delivered every 6 weeks. Skip or cancel anytime." },
                { v: false, t: "One-time purchase", d: "No commitment." },
              ].map((o) => (
                <label key={o.t} className={cn("flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ember", subscribe === o.v ? "border-ember bg-card shadow-sm" : "border-border hover:border-ember/50")}>
                  <input type="radio" name="purchase" checked={subscribe === o.v} onChange={() => setSubscribe(o.v)} className="mt-1 accent-[var(--ember)]" />
                  <span className="flex-1">
                    <span className="flex items-center gap-2 font-semibold">
                      {o.v && <Repeat className="w-4 h-4 text-ember" aria-hidden />} {o.t}
                    </span>
                    <span className="block text-sm text-muted-foreground">{o.d}</span>
                  </span>
                  <span className="font-semibold tabular-nums">
                    {o.v && <s className="mr-1.5 text-sm text-muted-foreground font-normal">{money(base)}</s>}
                    {money(unitPrice(size, o.v))}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center rounded-full border border-border bg-card">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3.5 cursor-pointer" aria-label="Decrease quantity">
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-semibold tabular-nums" aria-live="polite" aria-label={`Quantity ${qty}`}>
                {qty}
              </span>
              <button type="button" onClick={() => setQty((q) => Math.min(9, q + 1))} className="p-3.5 cursor-pointer" aria-label="Increase quantity">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                add(size, subscribe, qty)
                setQty(1)
              }}
              className="flex-1 min-w-[12rem] rounded-full bg-ink text-primary-foreground px-6 py-3.5 font-bold hover:bg-ember transition-colors cursor-pointer"
            >
              Add to bag · {money(price * qty)}
            </button>
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Truck className="w-4 h-4" aria-hidden /> Free shipping over ${product.freeShipping}. 30-day happy-skin returns.
          </p>
          <TalkButton className="mt-2 text-sm font-semibold underline decoration-ember underline-offset-4 cursor-pointer">
            Not sure it&apos;s right for your skin? Ask Amber.
          </TalkButton>
        </div>
      </div>
    </section>
  )
}
