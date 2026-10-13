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
              A concept demo of an AI talking website. {business.name} is a fictional sample business; names,
              address and phone number are made up.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-medium mb-4 text-gold-light">Clinic</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/65">
              {[
                { label: "Services", href: "#services" },
                { label: "Weight loss", href: "#weight-loss" },
                { label: "Our approach", href: "#results" },
                { label: "Reviews", href: "#reviews" },
                { label: "Price list", href: "#menu" },
                { label: "Shop", href: "#shop" },
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
                <span className="inline-flex items-center rounded-full border border-white/20 px-2.5 py-1 text-[10px] tracking-[0.2em] uppercase text-primary-foreground/60">
                  Concept demo
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm text-primary-foreground/50">
          <p>
            © {new Date().getFullYear()} {business.name} · Concept demo, fictional business.
          </p>
          <p>{locations.map((l) => addressOf(l)).join("  ·  ")}</p>
        </div>
      </div>
    </footer>
  )
}
