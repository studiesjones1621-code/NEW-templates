"use client"

import { useEffect, useState } from "react"
import { Flame, Phone, Snowflake, Wrench, Wind, Fan, Gauge, Clock, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { business, services } from "@/lib/business"
import { TalkButton } from "./talk-button"

const eyebrow = "text-[11px] md:text-xs font-semibold uppercase tracking-[0.22em]"

const nav = [
  { label: "Heat", href: "#heat" },
  { label: "Systems", href: "#systems" },
  { label: "Repair or replace", href: "#repair" },
  { label: "Services", href: "#services" },
]

export function Wordmark() {
  return (
    <span className="flex items-center gap-2">
      <span className="relative flex w-7 h-7 items-center justify-center rounded-lg bg-ember text-ink">
        <Wind className="w-4 h-4" strokeWidth={2.5} aria-hidden />
      </span>
      <span className="font-display font-extrabold text-lg tracking-tight">Prime Air</span>
    </span>
  )
}

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40)
    f()
    window.addEventListener("scroll", f, { passive: true })
    return () => window.removeEventListener("scroll", f)
  }, [])
  return (
    <header
      className={cn(
        "fixed z-50 left-0 right-0 transition-all duration-500",
        scrolled ? "top-3 mx-3 md:mx-4 rounded-2xl bg-ink/90 ring-1 ring-white/10 py-2.5" : "top-0 py-4",
      )}
    >
      <nav className="container mx-auto px-5 md:px-8 flex items-center justify-between gap-4">
        <a href="#top" aria-label={`${business.fullName}, back to top`}>
          <Wordmark />
        </a>
        <ul className="hidden lg:flex items-center gap-7 text-sm font-medium text-white/80">
          {nav.map((n) => (
            <li key={n.href}>
              <a href={n.href} className="hover:text-ember transition-colors">
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <a href={business.phoneHref} className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold hover:border-ember transition-colors">
            <Phone className="w-4 h-4" aria-hidden /> {business.phoneDisplay}
          </a>
          <TalkButton className="inline-flex items-center gap-2 rounded-full bg-ember text-ink px-4 py-2 text-sm font-bold hover:bg-ember-soft transition-colors">
            Talk to us
          </TalkButton>
        </div>
      </nav>
    </header>
  )
}

const icons = [Flame, Snowflake, Gauge, Fan, Wind, Wrench]

export function Services() {
  return (
    <section id="services" className="relative bg-ink py-20 md:py-28">
      <div className="container mx-auto px-5 md:px-10">
        <div className="reveal max-w-2xl">
          <p className={`${eyebrow} text-ember-soft`}>What we do</p>
          <h2 className="mt-3 font-display font-extrabold tracking-tight text-5xl md:text-6xl leading-[0.92]">
            Hot, cold or <span className="frost-text">just wrong.</span>
          </h2>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = icons[i]
            return (
              <article key={s.title} className="reveal rounded-2xl bg-card ring-1 ring-white/5 p-6 flex flex-col gap-3">
                <span className="flex w-11 h-11 items-center justify-center rounded-xl bg-ember/15 text-ember">
                  <Icon className="w-5 h-5" aria-hidden />
                </span>
                <h3 className="font-display font-bold text-xl">{s.title}</h3>
                <p className="text-sm text-white/65 leading-relaxed flex-1">{s.body}</p>
                <TalkButton icon={false} className="self-start text-sm font-semibold text-ember-soft hover:text-ember transition-colors">
                  Ask about this →
                </TalkButton>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function Contact() {
  return (
    <section id="contact" className="relative bg-background py-20 md:py-28 overflow-hidden">
      <div className="absolute -right-40 -top-40 w-[520px] h-[520px] rounded-full bg-ember/20 blur-3xl" aria-hidden />
      <div className="relative container mx-auto px-5 md:px-10 grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
        <div className="reveal">
          <p className={`${eyebrow} text-frost`}>Day or night</p>
          <h2 className="mt-3 font-display font-extrabold tracking-tight text-5xl md:text-7xl leading-[0.92]">
            No heat at 2 AM? <span className="ember-text">Someone answers.</span>
          </h2>
          <p className="mt-5 max-w-lg text-lg text-white/75 leading-relaxed">
            Our assistant picks up every call and every website visitor, any hour. It walks you through safety checks, explains your options and
            gets a tech on the schedule.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <TalkButton className="inline-flex items-center gap-2 rounded-full bg-ember text-ink px-6 py-3.5 text-sm font-bold hover:bg-ember-soft transition-colors">
              Talk to our assistant
            </TalkButton>
            <a href={business.phoneHref} className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3.5 text-sm font-semibold hover:border-ember transition-colors">
              <Phone className="w-4 h-4" aria-hidden /> {business.phoneDisplay}
            </a>
          </div>
        </div>
        <ul className="reveal grid gap-4">
          <li className="flex gap-4 rounded-2xl bg-card p-5 ring-1 ring-white/5">
            <Clock className="w-5 h-5 text-ember shrink-0 mt-0.5" aria-hidden />
            <span className="text-sm text-white/80">{business.hours}</span>
          </li>
          <li className="flex gap-4 rounded-2xl bg-card p-5 ring-1 ring-white/5">
            <MapPin className="w-5 h-5 text-ember shrink-0 mt-0.5" aria-hidden />
            <span className="text-sm text-white/80">Serving {business.area}</span>
          </li>
          <li className="flex gap-4 rounded-2xl bg-card p-5 ring-1 ring-white/5">
            <Flame className="w-5 h-5 text-ember shrink-0 mt-0.5" aria-hidden />
            <span className="text-sm text-white/80">Smell gas? Leave the house first, then call your gas company or 911 from outside.</span>
          </li>
        </ul>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="bg-ink border-t border-white/10 py-10">
      <div className="container mx-auto px-5 md:px-10 flex flex-col md:flex-row gap-6 md:items-center justify-between text-sm text-white/55">
        <Wordmark />
        <p className="max-w-xl">
          © {new Date().getFullYear()} {business.fullName} · A concept demo. The business, address and phone number are fictional. Scenes generated
          with Google Gemini.
        </p>
      </div>
    </footer>
  )
}
