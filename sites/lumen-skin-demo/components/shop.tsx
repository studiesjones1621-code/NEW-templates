"use client"

import { Mic } from "lucide-react"
import { openAssistant } from "./talk-button"
import { membership, more } from "@/lib/business"

/** Membership, assessments, packages and gift certificates. All CTAs open the voice assistant. */
export function Shop() {
  return (
    <section id="more" className="py-24 md:py-32">
      <div className="container mx-auto px-5 md:px-12">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-20 items-start">
          <div>
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-5">Membership & more</p>
            <h2 className="font-serif text-5xl lg:text-6xl leading-[1.02] tracking-tight text-balance mb-8">
              Glow that <span className="italic text-gold-deep">keeps going.</span>
            </h2>
            <div className="border border-gold/50 bg-card p-7 md:p-9">
              <p className="text-xs tracking-[0.25em] uppercase text-gold-deep mb-3">{membership.name}</p>
              <p className="font-serif text-6xl leading-none mb-4">
                {membership.price}
                <span className="text-base text-muted-foreground">{membership.per}</span>
              </p>
              <p className="text-muted-foreground leading-relaxed">{membership.perks}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-px bg-border border border-border">
            {more.map((m) => (
              <button
                key={m.name}
                type="button"
                onClick={openAssistant}
                className="group bg-background p-7 md:p-8 flex flex-col text-left hover:bg-card transition-colors cursor-pointer"
              >
                <h3 className="text-xl font-medium mb-3">{m.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">{m.description}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium">
                  {m.cta}
                  <Mic className="w-4 h-4 text-gold-deep" aria-hidden />
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
