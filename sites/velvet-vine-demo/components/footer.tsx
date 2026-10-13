import Link from "next/link"
import { business } from "@/lib/business"
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
                { label: "Why us", href: "#why" },
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
                <TalkButton icon={false} className="hover:text-primary-foreground transition-colors">
                  Talk to our assistant
                </TalkButton>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm text-primary-foreground/50">
          <p>
            © {new Date().getFullYear()} {business.name}.{" "}
            <span className="inline-flex items-center rounded-full border border-gold/40 px-2.5 py-0.5 ml-1 text-[10px] tracking-[0.2em] uppercase text-gold-light/90">
              Concept demo
            </span>
          </p>
          <p className="md:max-w-md">
            A fictional business created to showcase an AI talking website. Names, address, phone number, reviews and
            photos are samples, not a real salon.
          </p>
        </div>
      </div>
    </footer>
  )
}
