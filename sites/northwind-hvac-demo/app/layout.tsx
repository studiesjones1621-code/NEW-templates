import type React from "react"
import type { Metadata, Viewport } from "next"
import { Archivo, Manrope } from "next/font/google"
import { VoiceAssistant } from "@/components/voice-assistant"
import { SmoothScroll } from "@/components/smooth-scroll"
import { Reveal } from "@/components/reveal"
import { business } from "@/lib/business"
import "./globals.css"

const sans = Manrope({ subsets: ["latin"], variable: "--font-sans-brand", display: "swap" })
const display = Archivo({ subsets: ["latin"], weight: ["700", "800", "900"], variable: "--font-display-brand", display: "swap" })

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")

const title = `${business.fullName} | Heating & Air Conditioning in ${business.city}`
const description =
  "Heating and A/C repair, tune-ups, new furnaces, heat pumps and mini-splits, and duct sealing. Look inside your system, then talk to our 24/7 AI assistant. Concept demo."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  robots: { index: false, follow: false },
  openGraph: { type: "website", url: "/", siteName: business.fullName, title, description, images: [{ url: "/brand/og.jpg", width: 1200, height: 630, alt: business.fullName }] },
  twitter: { card: "summary_large_image", title, description, images: ["/brand/og.jpg"] },
}

export const viewport: Viewport = { themeColor: "#14171a" }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Reveal />
        <SmoothScroll />
        <VoiceAssistant />
      </body>
    </html>
  )
}
