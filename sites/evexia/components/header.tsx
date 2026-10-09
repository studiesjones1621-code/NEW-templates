"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Phone } from "lucide-react"
import { cn } from "@/lib/utils"
import { business } from "@/lib/business"
import { TalkButton } from "./talk-button"
import { BooksyButton } from "./booksy-button"
import { Wordmark } from "./wordmark"

const navItems = [
  { label: "Services", href: "#services" },
  { label: "Hormones", href: "#hormones" },
  { label: "Why Evexia", href: "#why" },
  { label: "Reviews", href: "#reviews" },
  { label: "All services", href: "#menu" },
  { label: "Locations", href: "#visit" },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <header
      className={cn(
        "fixed z-50 transition-all duration-500 my-0 py-0 rounded-none",
        scrolled || mobileMenuOpen
          ? "bg-primary/95 py-3 top-3 left-3 right-3 md:top-4 md:left-4 md:right-4 rounded-2xl shadow-lg shadow-black/20"
          : "bg-transparent py-4 top-0 left-0 right-0",
      )}
    >
      <nav className="container mx-auto px-5 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group" onClick={scrollToTop} aria-label={`${business.name} — home`}>
          <Wordmark />
        </Link>

        <ul className="hidden lg:flex items-center gap-9 text-sm tracking-wide">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="text-white/90 hover:text-gold transition-colors duration-300 relative after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 hover:after:w-full after:bg-gold after:transition-all after:duration-300"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <BooksyButton
            icon={false}
            className="hidden xl:inline-flex text-sm text-gold-light hover:text-gold underline-offset-4 hover:underline transition-colors"
          >
            Book online
          </BooksyButton>
          <a
            href={business.phoneHref}
            className="inline-flex items-center gap-2 text-sm px-4 py-2.5 text-white border border-white/25 hover:border-gold hover:text-gold transition-all duration-300"
          >
            <Phone className="w-4 h-4" strokeWidth={1.75} aria-hidden />
            {business.phoneDisplay}
          </a>
          <TalkButton className="inline-flex items-center gap-2 text-sm px-5 py-2.5 bg-gold text-primary font-semibold hover:bg-gold-light transition-all duration-300">
            Talk to us
          </TalkButton>
        </div>

        <button
          className="md:hidden z-50 transition-colors duration-300 text-white p-2 -mr-2"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="4" y1="8" x2="20" y2="8" />
              <line x1="4" y1="16" x2="20" y2="16" />
            </svg>
          )}
        </button>
      </nav>

      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
          mobileMenuOpen ? "max-h-[640px] opacity-100 mt-6" : "max-h-0 opacity-0",
        )}
      >
        <div className="container mx-auto px-5">
          <ul className="flex flex-col gap-5 mb-8">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="hover:text-gold transition-colors duration-300 text-white text-4xl font-light block"
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 mb-4">
            <TalkButton className="inline-flex items-center justify-center gap-2 text-sm px-5 py-3.5 bg-gold text-primary font-semibold">
              Talk to our assistant
            </TalkButton>
            <a
              href={business.phoneHref}
              className="inline-flex items-center justify-center gap-2 text-sm px-5 py-3.5 text-white border border-white/25"
              onClick={closeMobileMenu}
            >
              <Phone className="w-4 h-4" strokeWidth={1.75} aria-hidden />
              Call {business.phoneDisplay}
            </a>
            <BooksyButton className="inline-flex items-center justify-center gap-2 text-sm px-5 py-3.5 text-gold-light border border-gold/50" />
          </div>
        </div>
      </div>
    </header>
  )
}
