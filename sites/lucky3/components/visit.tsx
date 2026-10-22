import { MapPin, Phone, Mail, CalendarClock } from "lucide-react"
import { business, fullAddress, mapsEmbed, mapsUrl } from "@/lib/business"
import { TalkButton } from "./talk-button"

export function Visit() {
  return (
    <section id="visit" className="relative bg-primary text-primary-foreground py-24 md:py-32">
      <div className="container mx-auto px-5 md:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
        <div className="reveal flex flex-col">
          <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-sky">Visit the shop</p>
          <h2 className="mt-3 font-display font-extrabold tracking-tight text-4xl md:text-6xl leading-[0.95]">
            Come say hi in <span className="lucky-text">Highlandtown.</span>
          </h2>
          <ul className="mt-10 space-y-6 text-base">
            <li className="flex gap-4">
              <MapPin className="w-5 h-5 mt-0.5 text-marigold shrink-0" aria-hidden />
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-marigold transition-colors">
                {fullAddress}
                <span className="block text-sm text-primary-foreground/60">Street parking is usually available within 2 blocks.</span>
              </a>
            </li>
            <li className="flex gap-4">
              <CalendarClock className="w-5 h-5 mt-0.5 text-marigold shrink-0" aria-hidden />
              <span>
                {business.hours}
                <span className="block text-sm text-primary-foreground/60">Same-day requests when we can. Severe matting needs a dedicated slot.</span>
              </span>
            </li>
            <li className="flex gap-4">
              <Phone className="w-5 h-5 mt-0.5 text-marigold shrink-0" aria-hidden />
              <a href={business.phoneHref} className="hover:text-marigold transition-colors">
                {business.phoneDisplay}
              </a>
            </li>
            <li className="flex gap-4">
              <Mail className="w-5 h-5 mt-0.5 text-marigold shrink-0" aria-hidden />
              <a href={`mailto:${business.email}`} className="hover:text-marigold transition-colors">
                {business.email}
              </a>
            </li>
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <TalkButton className="inline-flex items-center gap-2 rounded-full bg-marigold text-primary px-6 py-3.5 text-sm font-semibold hover:bg-tangerine transition-colors" />
            <a
              href={business.phoneHref}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-sm font-semibold hover:border-marigold transition-colors"
            >
              <Phone className="w-4 h-4" aria-hidden /> Call to book
            </a>
          </div>
        </div>
        <div className="reveal relative min-h-[360px] rounded-3xl overflow-hidden ring-1 ring-white/10">
          <iframe
            title={`Map to ${business.fullName}`}
            src={mapsEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 w-full h-full border-0"
          />
        </div>
      </div>
    </section>
  )
}
