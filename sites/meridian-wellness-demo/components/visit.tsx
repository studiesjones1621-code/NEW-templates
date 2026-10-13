"use client"

import { useEffect, useState } from "react"
import { MapPin, Phone, Video } from "lucide-react"
import { HighlightedText } from "./highlighted-text"
import { TalkButton } from "./talk-button"
import { business, locations, policies } from "@/lib/business"

function useClinicToday() {
  const [today, setToday] = useState<{ day: string; minutes: number } | null>(null)
  useEffect(() => {
    // Clinic time, regardless of the visitor's timezone
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date())
    const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ""
    setToday({ day: get("weekday"), minutes: Number(get("hour")) * 60 + Number(get("minute")) })
  }, [])
  return today
}

const toMinutes = (hhmm: string) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3))

export function Visit() {
  const today = useClinicToday()
  const [active, setActive] = useState(0)
  const loc = locations[active]
  const todayHours = today ? loc.hours.find((h) => h.day === today.day) : undefined
  const isOpen =
    today && todayHours
      ? Boolean(todayHours.open) && today.minutes >= toMinutes(todayHours.open) && today.minutes < toMinutes(todayHours.close)
      : null

  return (
    <section id="visit" className="py-24 md:py-32 bg-primary text-primary-foreground">
      <div className="container mx-auto px-5 md:px-12">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-start">
          <div>
            <p className="text-gold-light/80 text-sm tracking-[0.3em] uppercase mb-6">Locations & Hours</p>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight mb-8 text-balance">
              Two offices. <HighlightedText>One</HighlightedText> provider who knows you.
            </h2>

            <div role="tablist" aria-label="Choose an office" className="inline-flex border border-white/20 mb-8">
              {locations.map((l, i) => (
                <button
                  key={l.id}
                  role="tab"
                  type="button"
                  aria-selected={i === active}
                  onClick={() => setActive(i)}
                  className={`px-6 py-3 text-sm tracking-wide cursor-pointer transition-colors ${
                    i === active ? "bg-gold text-primary font-medium" : "text-primary-foreground/75 hover:text-white"
                  }`}
                >
                  {l.name}
                </button>
              ))}
            </div>

            <p className="flex items-start gap-3 text-lg text-primary-foreground/85 mb-10">
              <MapPin className="w-5 h-5 mt-1 text-gold shrink-0" strokeWidth={1.75} aria-hidden />
              <span>
                {loc.street}
                <br />
                {loc.city}
                <span className="block mt-1 text-xs tracking-[0.15em] uppercase text-primary-foreground/45">
                  Sample address · concept demo
                </span>
              </span>
            </p>

            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-sm tracking-[0.2em] uppercase text-primary-foreground/60">{loc.name} hours</h3>
                {isOpen !== null && (
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full ${
                      isOpen ? "bg-gold/20 text-gold-light" : "bg-white/10 text-primary-foreground/70"
                    }`}
                  >
                    {isOpen ? "Open now" : "Closed now"}
                  </span>
                )}
              </div>
              <dl className="max-w-sm">
                {loc.hours.map((h) => {
                  const isToday = today?.day === h.day
                  return (
                    <div
                      key={h.day}
                      className={`flex justify-between py-2.5 border-b border-white/10 ${
                        isToday ? "text-gold-light font-medium" : "text-primary-foreground/80"
                      }`}
                    >
                      <dt>
                        {h.day}
                        {isToday && <span className="sr-only"> (today)</span>}
                      </dt>
                      <dd>{h.label}</dd>
                    </div>
                  )
                })}
              </dl>
              <p className="text-sm text-primary-foreground/55 mt-4 flex gap-2">
                <Video className="w-4 h-4 mt-0.5 text-gold shrink-0" aria-hidden />
                {business.telemed} Call to confirm same-day times.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
              <a
                href={business.phoneHref}
                className="inline-flex items-center justify-center gap-2.5 bg-gold text-primary font-semibold px-7 py-4 text-sm tracking-wide hover:bg-gold-light transition-colors duration-300"
              >
                <Phone className="w-4 h-4" strokeWidth={1.75} aria-hidden />
                Call {business.phoneDisplay}
              </a>
              <TalkButton className="inline-flex items-center justify-center gap-2.5 border border-primary-foreground/30 px-7 py-4 text-sm tracking-wide hover:border-gold hover:text-gold transition-colors duration-300">
                Talk to our assistant
              </TalkButton>
            </div>
          </div>

          <div>
            <div className="relative">
              <div className="relative z-10 aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5] w-full overflow-hidden border border-white/10 bg-[#0b2233]">
                <SampleMap active={active} />
              </div>
              <div className="absolute -bottom-4 -left-4 w-full h-full border border-gold/40 pointer-events-none hidden md:block" aria-hidden />
            </div>
            <p className="mt-8 text-sm text-primary-foreground/60">
              {policies.referral} · Map is illustrative; Meridian is a fictional clinic.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Illustrative street map (no real location): a stylised grid with a pin on the selected office. */
function SampleMap({ active }: { active: number }) {
  const pins = [
    { x: 168, y: 214 },
    { x: 292, y: 318 },
  ]
  const pin = pins[active] ?? pins[0]
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full" role="img" aria-label="Illustrative map of the sample office location">
      <rect width="400" height="500" fill="#0b2233" />
      <path d="M-20 380 C 80 340, 160 420, 260 380 S 420 300, 440 330 L 440 520 L -20 520 Z" fill="#0f3347" />
      <path d="M-20 372 C 80 332, 160 412, 260 372 S 420 292, 440 322" stroke="#1d5068" strokeWidth="3" fill="none" />
      <g stroke="#ffffff" strokeOpacity="0.09" strokeWidth="1">
        {Array.from({ length: 11 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="500" />
        ))}
        {Array.from({ length: 13 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 40} x2="400" y2={i * 40} />
        ))}
      </g>
      <g stroke="#ffffff" strokeOpacity="0.22" strokeWidth="7" strokeLinecap="round">
        <line x1="0" y1="214" x2="400" y2="214" />
        <line x1="168" y1="0" x2="168" y2="500" />
        <line x1="40" y1="40" x2="360" y2="470" strokeWidth="5" />
      </g>
      <text x="16" y="206" fill="#ffffff" fillOpacity="0.4" fontSize="11" letterSpacing="2">MAIN STREET</text>
      <text x="300" y="400" fill="#ffffff" fillOpacity="0.4" fontSize="11" letterSpacing="2">RIVER</text>
      <g transform={`translate(${pin.x} ${pin.y})`}>
        <circle r="22" fill="var(--gold)" fillOpacity="0.18" />
        <path d="M0 -30 C 12 -30 18 -21 18 -13 C 18 0 0 14 0 14 C 0 14 -18 0 -18 -13 C -18 -21 -12 -30 0 -30 Z" fill="var(--gold)" />
        <circle cy="-14" r="6" fill="#0b2233" />
      </g>
    </svg>
  )
}
