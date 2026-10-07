import Link from "next/link"
import { business, fullAddress } from "@/lib/business"

export function Footer() {
  return (
    <footer className="py-16 md:py-20 bg-primary text-primary-foreground border-t border-white/10">
      <div className="container mx-auto px-5 md:px-12">
        <div className="grid md:grid-cols-4 gap-12 mb-14">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <img src="/brand/logo.png" alt={business.name} width={600} height={308} className="h-14 w-auto" />
            </Link>
            <p className="text-primary-foreground/65 leading-relaxed max-w-sm">
              Premium cuts in a private Baltimore studio. Every client flies first class.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-medium mb-4 text-gold-light">Studio</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/65">
              {[
                { label: "Services", href: "#services" },
                { label: "Why Reem", href: "#why" },
                { label: "Reviews", href: "#reviews" },
                { label: "Full menu", href: "#menu" },
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
                <a href={business.smsHref} className="hover:text-primary-foreground transition-colors">
                  Text us
                </a>
              </li>
              <li>
                <a
                  href={business.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-foreground transition-colors"
                >
                  Instagram {business.instagramHandle}
                </a>
              </li>
              <li>
                <a
                  href={business.booksy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-foreground transition-colors"
                >
                  Booksy profile
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
