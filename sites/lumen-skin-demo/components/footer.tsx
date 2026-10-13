import Link from "next/link"
import { addressOf, business, locations } from "@/lib/business"
import { Wordmark } from "./wordmark"
import { TalkButton } from "./talk-button"

export function Footer() {
  return (
    <footer className="py-16 md:py-20 bg-primary text-primary-foreground border-t border-white/10">
      <div className="container mx-auto px-5 md:px-12">
        <div className="grid md:grid-cols-4 gap-12 mb-14">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <Wordmark />
            </Link>
            <p className="text-primary-foreground/65 leading-relaxed max-w-sm">
              “{business.tagline}”
            </p>
            <p className="mt-4 text-sm text-primary-foreground/45 max-w-sm">
              {business.owner}, {business.credentials} · By appointment only.
            </p>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold/40 px-3 py-1 text-[11px] tracking-[0.2em] uppercase text-gold-light/90">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden />
              Concept demo
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-medium mb-4 text-gold-light">Studio</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/65">
              {[
                { label: "Services", href: "#services" },
                { label: "Clarity Reset acne", href: "#clear-path" },
                { label: "Meet Maya", href: "#about" },
                { label: "Sample reviews", href: "#reviews" },
                { label: "Price list", href: "#menu" },
                { label: "Membership", href: "#more" },
                { label: "Hours & location", href: "#visit" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-primary-foreground transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-medium mb-4 text-gold-light">Connect</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/65">
              <li>
                <TalkButton icon={false} className="hover:text-primary-foreground transition-colors text-left">
                  Talk to our assistant
                </TalkButton>
              </li>
              <li>
                <a href={business.phoneHref} className="hover:text-primary-foreground transition-colors">
                  Call {business.phoneDisplay}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm text-primary-foreground/50">
          <p>
            © {new Date().getFullYear()} {business.name} · A concept demo. The business, people, address, phone number
            and reviews are fictional.
          </p>
          <p>{locations.map((l) => addressOf(l)).join("  ·  ")}</p>
        </div>
      </div>
    </footer>
  )
}
