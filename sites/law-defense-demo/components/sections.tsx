"use client"

import { useEffect, useState } from "react"
import { Clock, MapPin, Phone, Scale } from "lucide-react"
import { cn } from "@/lib/utils"
import { attorneys, business } from "@/lib/business"
import { TalkButton } from "./talk-button"

const eyebrow = "text-[11px] md:text-xs font-semibold uppercase tracking-[0.24em]"
const display = "font-display font-semibold tracking-tight leading-[0.95]"

const nav = [
  { label: "Practice areas", href: "#practice" },
  { label: "Your rights", href: "#rights" },
  { label: "Attorneys", href: "#attorneys" },
  { label: "Contact", href: "#contact" },
]

export function Wordmark() {
  return (
    <span className="flex items-center gap-2.5">
      <Scale className="w-5 h-5 text-ember" aria-hidden />
      <span className="font-display font-semibold text-xl tracking-tight">
        Calder <span className="text-ember">&amp;</span> Reyes
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

export function Attorneys() {
  return (
    <section id="attorneys" className="relative bg-background py-20 md:py-28">
      <div className="container mx-auto px-5 md:px-10">
        <div className="reveal max-w-2xl">
          <p className={`${eyebrow} text-ember`}>Our attorneys</p>
          <h2 className={`mt-3 ${display} text-5xl md:text-6xl`}>
            Who stands <span className="ember-text italic">next to you.</span>
          </h2>
        </div>
        <div className="mt-12 grid gap-8">
          {attorneys.map((a, i) => (
            <article key={a.name} className={`reveal grid md:grid-cols-[300px_1fr] gap-6 md:gap-10 items-start rounded-3xl bg-card ring-1 ring-white/5 p-5 md:p-8 ${i % 2 ? "md:grid-cols-[1fr_300px]" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.photo} alt={`Portrait of ${a.name}`} loading="lazy" className={`w-full max-w-[300px] aspect-[4/5] object-cover rounded-2xl ${i % 2 ? "md:order-2" : ""}`} />
              <div>
                <p className={`${eyebrow} text-ember`}>{a.role}</p>
                <h3 className={`mt-2 ${display} text-4xl`}>{a.name}</h3>
                {a.bio.map((p) => (
                  <p key={p.slice(0, 20)} className="mt-4 text-white/80 leading-relaxed max-w-2xl">
                    {p}
                  </p>
                ))}
                <dl className="mt-6 grid sm:grid-cols-3 gap-4 text-sm">
                  {(
                    [
                      ["Admissions", a.admissions],
                      ["Education", a.education],
                      ["Memberships", a.memberships],
                    ] as const
                  )
                    .filter(([, v]) => v.length)
                    .map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-[11px] uppercase tracking-[0.16em] text-white/50">{k}</dt>
                        {v.map((x) => (
                          <dd key={x} className="mt-1 text-white/85 leading-snug">
                            {x}
                          </dd>
                        ))}
                      </div>
                    ))}
                </dl>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-5 text-xs text-white/45">Sample attorney profiles for this template. Portraits are AI-generated; names are fictional.</p>
      </div>
    </section>
  )
}

export function Contact() {
  return (
    <section id="contact" className="relative bg-ink py-20 md:py-28 overflow-hidden">
      <div className="absolute -right-40 -top-40 w-[520px] h-[520px] rounded-full bg-ember/15 blur-3xl" aria-hidden />
      <div className="relative container mx-auto px-5 md:px-10 grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
        <div className="reveal">
          <p className={`${eyebrow} text-ember`}>Arrested? Charged? Hurt?</p>
          <h2 className={`mt-3 ${display} text-5xl md:text-7xl`}>
            Call before you <span className="ember-text italic">say anything.</span>
          </h2>
          <p className="mt-5 max-w-lg text-lg text-white/80 leading-relaxed">
            Our intake assistant answers any hour, takes down what happened, and gets an attorney to call you back. What you share is kept
            confidential.
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
            <span className="text-sm text-white/85">{business.hours}</span>
          </li>
          <li className="flex gap-4 rounded-2xl bg-card p-5 ring-1 ring-white/5">
            <MapPin className="w-5 h-5 text-ember shrink-0 mt-0.5" aria-hidden />
            <span className="text-sm text-white/85">
              {business.address}, steps from the Mitchell Courthouse. Serving {business.area}.
            </span>
          </li>
        </ul>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="bg-ink border-t border-white/10 py-10">
      <div className="container mx-auto px-5 md:px-10 grid md:grid-cols-[auto_1fr] gap-6 md:gap-12 text-sm text-white/55">
        <Wordmark />
        <div className="space-y-2 max-w-3xl">
          <p>
            © {new Date().getFullYear()} {business.fullName} · A concept template. The firm, attorneys, portraits and phone number are
            fictional. This site is general information, not legal advice, and using it doesn&apos;t create an attorney-client relationship.
          </p>
          <p>
            Courthouse photo: Clarence M. Mitchell Jr. Courthouse and Battle Monument, HABS (Library of Congress), public domain. Courtroom
            photo: Carol M. Highsmith Archive, Library of Congress, public domain. Scenes generated with Google Gemini.
          </p>
        </div>
      </div>
    </footer>
  )
}
