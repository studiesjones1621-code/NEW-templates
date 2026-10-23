"use client"

import { useEffect, useState } from "react"
import { Clock, Phone, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import { business, faqs } from "@/lib/business"
import { TalkButton } from "./talk-button"
import { CartButton } from "./cart"

const eyebrow = "text-[11px] md:text-xs font-semibold uppercase tracking-[0.24em]"
const display = "font-display font-semibold tracking-tight leading-[0.95]"

const nav = [
  { label: "Shop", href: "#shop" },
  { label: "Ingredients", href: "#ingredients" },
  { label: "Routine", href: "#routine" },
  { label: "FAQ", href: "#faq" },
]

export function Wordmark() {
  return (
    <span className="flex items-center gap-2">
      <Sun className="w-5 h-5 text-ember" aria-hidden />
      <span className="font-display font-semibold text-2xl tracking-tight whitespace-nowrap">
        Saffra<span className="text-ember">.</span>
      </span>
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
        scrolled ? "top-3 mx-3 md:mx-4 rounded-2xl bg-card/90 backdrop-blur-md ring-1 ring-ink/10 shadow-lg shadow-ink/5 py-2" : "top-0 py-4",
      )}
    >
      <nav className="container mx-auto px-5 md:px-8 flex items-center justify-between gap-4">
        <a href="#top" aria-label={`${business.fullName}, back to top`}>
          <Wordmark />
        </a>
        <ul className="hidden lg:flex items-center gap-7 text-sm font-semibold text-foreground/80">
          {nav.map((n) => (
            <li key={n.href}>
              <a href={n.href} className="hover:text-ember transition-colors">
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <TalkButton className="hidden sm:inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold whitespace-nowrap hover:border-ember transition-colors">
            Ask Amber
          </TalkButton>
          <a href="#shop" className="inline-flex items-center rounded-full bg-ink text-primary-foreground px-4 py-2 text-sm font-bold whitespace-nowrap hover:bg-ember transition-colors">
            Shop
          </a>
          <CartButton />
        </div>
      </nav>
    </header>
  )
}

export function Faq() {
  return (
    <section id="faq" className="relative bg-secondary/60 py-20 md:py-28">
      <div className="container mx-auto px-5 md:px-10 grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16 items-start">
        <div className="reveal">
          <p className={`${eyebrow} text-ember`}>Questions</p>
          <h2 className={`mt-3 ${display} text-5xl md:text-6xl`}>
            Good to <span className="ember-text italic">know.</span>
          </h2>
        </div>
        <div className="grid gap-3">
          {faqs.map((f) => (
            <details key={f.q} className="reveal group rounded-2xl bg-card ring-1 ring-border open:ring-ember/40 transition-colors">
              <summary className="flex items-center justify-between gap-4 p-5 md:p-6 cursor-pointer list-none font-semibold text-lg [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="text-ember text-2xl leading-none transition-transform group-open:rotate-45" aria-hidden>
                  +
                </span>
              </summary>
              <p className="px-5 md:px-6 pb-6 -mt-1 text-foreground/75 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

export function AskAmber() {
  return (
    <section id="advisor" className="relative bg-ink text-primary-foreground py-20 md:py-28 overflow-hidden">
      <div className="absolute -right-40 -top-40 w-[520px] h-[520px] rounded-full bg-ember/30 blur-3xl" aria-hidden />
      <div className="relative container mx-auto px-5 md:px-10 grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
        <div className="reveal">
          <p className={`${eyebrow} text-ember-soft`}>Skincare advisor</p>
          <h2 className={`mt-3 ${display} text-5xl md:text-7xl`}>
            Talk it through <span className="ember-text italic">with Amber.</span>
          </h2>
          <p className="mt-5 max-w-lg text-lg text-primary-foreground/80 leading-relaxed">
            Tell her about your skin and what you already use. She&apos;ll suggest where Golden Hour fits, how to layer it, and which size makes
            sense. Voice, any hour.
          </p>
          <TalkButton className="mt-8 inline-flex items-center gap-2 rounded-full bg-ember text-white px-6 py-3.5 text-sm font-bold hover:bg-ember-soft transition-colors">
            Start talking
          </TalkButton>
        </div>
        <ul className="reveal grid gap-4">
          <li className="flex gap-4 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
            <Clock className="w-5 h-5 text-ember-soft shrink-0 mt-0.5" aria-hidden />
            <span className="text-sm text-primary-foreground/85">{business.hours}</span>
          </li>
          <li className="flex gap-4 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
            <Phone className="w-5 h-5 text-ember-soft shrink-0 mt-0.5" aria-hidden />
            <a href={business.phoneHref} className="text-sm text-primary-foreground/85 hover:text-ember-soft">
              Prefer a person? {business.phoneDisplay}
            </a>
          </li>
        </ul>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="bg-ink text-primary-foreground border-t border-white/10 py-10">
      <div className="container mx-auto px-5 md:px-10 grid md:grid-cols-[auto_1fr] gap-6 md:gap-12 text-sm text-primary-foreground/55">
        <Wordmark />
        <div className="space-y-2 max-w-3xl">
          <p>
            © {new Date().getFullYear()} {business.fullName} · A concept template. The brand, product, prices and phone number are fictional,
            and the store doesn&apos;t take orders. Cosmetic information only, not medical advice. Results vary.
          </p>
          <p>Product photos and scenes were generated with Google Gemini. The before-and-after is a simulated illustration.</p>
        </div>
      </div>
    </footer>
  )
}
