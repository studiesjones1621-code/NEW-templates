"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight, MapPin, Phone } from "lucide-react"
import { HighlightedText } from "./highlighted-text"
import { TalkButton } from "./talk-button"
import { BooksyButton } from "./booksy-button"
import { business, fullAddress, hours, mapEmbed, mapsLink, policies } from "@/lib/business"

function useStudioToday() {
  const [today, setToday] = useState<{ day: string; minutes: number } | null>(null)
  useEffect(() => {
    // Studio time, regardless of the visitor's timezone
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
  const today = useStudioToday()
  const todayHours = today ? hours.find((h) => h.day === today.day) : undefined
  const isOpen =
    today && todayHours
      ? Boolean(todayHours.open) && today.minutes >= toMinutes(todayHours.open) && today.minutes < toMinutes(todayHours.close)
      : null

  return (
    <section id="visit" className="py-24 md:py-32 bg-primary text-primary-foreground">
      <div className="container mx-auto px-5 md:px-12">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-start">
          <div>
            <p className="text-gold-light/80 text-sm tracking-[0.3em] uppercase mb-6">Hours & Location</p>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.1] tracking-tight mb-8 text-balance">
              Your chair is <HighlightedText>waiting</HighlightedText>.
            </h2>

            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 text-lg text-primary-foreground/85 hover:text-gold transition-colors mb-10 group"
            >
              <MapPin className="w-5 h-5 mt-1 text-gold shrink-0" strokeWidth={1.75} aria-hidden />
              <span>
                {business.address.street}, {business.address.neighborhood}
                <br />
                {business.address.city}, {business.address.state} {business.address.zip}
                <ArrowUpRight className="inline w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </a>

            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-sm tracking-[0.2em] uppercase text-primary-foreground/60">Hours</h3>
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
                {hours.map((h) => {
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
              <p className="text-sm text-primary-foreground/55 mt-4">{policies.deposit}</p>
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
              <BooksyButton className="inline-flex items-center justify-center gap-2.5 border border-gold/50 text-gold-light px-7 py-4 text-sm tracking-wide hover:bg-gold hover:text-primary transition-colors duration-300" />
            </div>
          </div>

          <div>
            <div className="relative">
              <div className="relative z-10 aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5] w-full overflow-hidden border border-white/10 bg-[#1b1812]">
                <iframe
                  title={`Map to ${business.name}, ${fullAddress}`}
                  src={mapEmbed}
                  className="absolute inset-0 w-full h-full grayscale-[85%] contrast-[1.05]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <div className="absolute -bottom-4 -left-4 w-full h-full border border-gold/40 pointer-events-none hidden md:block" aria-hidden />
            </div>
            <p className="mt-8 text-sm text-primary-foreground/60">
              By appointment · {business.email}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
