"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Phone } from "lucide-react"
import { cn } from "@/lib/utils"
import { business } from "@/lib/business"
import { TalkButton } from "./talk-button"

const navItems = [
  { label: "Grooming", href: "#services" },
  { label: "How we groom", href: "#groom" },
  { label: "Cats", href: "#cats" },
  { label: "Shop", href: "#shop" },
  { label: "Visit", href: "#visit" },
]

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-baseline gap-2 leading-none", className)}>
      <span className="font-display font-extrabold text-2xl tracking-tight lucky-text">LUCKY 3</span>
      <span className="hidden sm:inline font-display font-bold text-[11px] uppercase tracking-[0.16em] opacity-70">Dog &amp; Cat Grooming</span>
    </span>
  )
}

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed z-50 transition-all duration-500",
        scrolled || open
          ? "top-3 left-3 right-3 md:top-4 md:left-4 md:right-4 rounded-2xl bg-background/90 backdrop-blur-md shadow-lg shadow-primary/10 py-3"
          : "top-0 left-0 right-0 py-5",
      )}
    >
      <nav className="container mx-auto px-5 md:px-6 flex items-center justify-between gap-4">
        <Link href="#top" aria-label={`${business.fullName}, back to top`} onClick={() => setOpen(false)}>
          <Wordmark />
        </Link>

        <ul className="hidden lg:flex items-center gap-8 text-sm font-medium">
          {navItems.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="hover:text-tangerine transition-colors">
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-2">
          <a
            href={business.phoneHref}
            className="inline-flex items-center gap-2 rounded-full border border-primary/15 px-4 py-2.5 text-sm font-semibold hover:border-tangerine transition-colors"
          >
            <Phone className="w-4 h-4" aria-hidden /> {business.phoneDisplay}
          </a>
          <TalkButton className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:bg-tangerine hover:text-primary transition-colors">
            Talk to us
          </TalkButton>
        </div>

        <button
          className="md:hidden p-2 -mr-2"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="4" y1="8" x2="20" y2="8" />
                <line x1="4" y1="16" x2="20" y2="16" />
              </>
            )}
          </svg>
        </button>
      </nav>

      <div className={cn("md:hidden overflow-hidden transition-all duration-300", open ? "max-h-[600px] opacity-100 mt-5" : "max-h-0 opacity-0")}>
        <div className="container mx-auto px-5 pb-4">
          <ul className="flex flex-col gap-4 mb-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="font-display font-bold text-3xl" onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3">
            <TalkButton className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-3.5 text-sm font-semibold" />
            <a
              href={business.phoneHref}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/20 px-5 py-3.5 text-sm font-semibold"
            >
              <Phone className="w-4 h-4" aria-hidden /> Call {business.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
