import type React from "react"
import type { Metadata, Viewport } from "next"
import { Cormorant_Garamond, Manrope } from "next/font/google"
import { VoiceAssistant } from "@/components/voice-assistant"
import { SmoothScroll } from "@/components/smooth-scroll"
import { Reveal } from "@/components/reveal"
import { business } from "@/lib/business"
import "./globals.css"

const sans = Manrope({ subsets: ["latin"], variable: "--font-sans-brand", display: "swap" })
const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600", "700"], style: ["normal", "italic"], variable: "--font-display-brand", display: "swap" })

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")

const title = `${business.fullName} | Criminal Defense Lawyers in ${business.city}, MD`
const description =
  "Trial-tested Baltimore criminal defense: DUI/DWI, jailable traffic, parole and probation violations, and personal injury. Step inside the courtroom, know your rights, and talk to our 24/7 intake assistant. Concept template."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  robots: { index: false, follow: false },
  openGraph: { type: "website", url: "/", siteName: business.fullName, title, description, images: [{ url: "/brand/og.jpg", width: 1200, height: 630, alt: business.fullName }] },
  twitter: { card: "summary_large_image", title, description, images: ["/brand/og.jpg"] },
}

export const viewport: Viewport = { themeColor: "#151925" }

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
