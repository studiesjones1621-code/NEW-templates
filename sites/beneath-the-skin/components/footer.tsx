import Link from "next/link"
import { addressOf, business, locations } from "@/lib/business"
import { Wordmark } from "./wordmark"

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
              {business.owner}, {business.credentials} · Oncology-trained esthetician · By appointment only.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-medium mb-4 text-gold-light">Studio</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/65">
              {[
                { label: "Services", href: "#services" },
                { label: "Clear Path acne", href: "#clear-path" },
                { label: "Meet Katrina", href: "#about" },
                { label: "Reviews", href: "#reviews" },
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
                <a href={business.phoneHref} className="hover:text-primary-foreground transition-colors">
                  Call {business.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${business.email}`} className="hover:text-primary-foreground transition-colors">
                  {business.email}
                </a>
              </li>
              <li>
                <a
                  href={business.bookOnline}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-foreground transition-colors"
                >
                  Book online
                </a>
              </li>
              <li>
                <a
                  href={business.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-foreground transition-colors"
                >
                  Instagram @_beneath_the_skin
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm text-primary-foreground/50">
          <p>
            © {new Date().getFullYear()} {business.name}. All rights reserved.
          </p>
          <p>{locations.map((l) => addressOf(l)).join("  ·  ")}</p>
        </div>
      </div>
    </footer>
  )
}
