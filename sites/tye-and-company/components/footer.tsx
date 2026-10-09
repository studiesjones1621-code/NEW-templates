import Link from "next/link"
import { business, fullAddress } from "@/lib/business"
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
              {business.tagline}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-medium mb-4 text-gold-light">Studio</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/65">
              {[
                { label: "Services", href: "#services" },
                { label: "Hair loss studio", href: "#hair-loss" },
                { label: "Why Tye", href: "#why" },
                { label: "Reviews", href: "#reviews" },
                { label: "Full menu", href: "#menu" },
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
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-foreground transition-colors"
                >
                  tyeandcompany.com
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
          <p>{fullAddress}</p>
        </div>
      </div>
    </footer>
  )
}
