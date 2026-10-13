import type React from "react"
import type { Metadata, Viewport } from "next"
import { Jost, Cormorant_Garamond } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { VoiceAssistant } from "@/components/voice-assistant"
import { SmoothScroll } from "@/components/smooth-scroll"
import { business, hours } from "@/lib/business"
import "./globals.css"

const jost = Jost({ subsets: ["latin"], variable: "--font-jost", display: "swap" })
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
})

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")

const title = `${business.name} | Hair Studio & Beauty Bar (Concept Demo)`
const description =
  "Concept demo of an AI talking website for a fictional hair studio: hair loss consultations, pixie cuts, color and relaxers, with a voice assistant that answers questions and takes callback requests."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: business.name,
    title,
    description,
    locale: "en_US",
    images: [{ url: "/brand/og.jpg", width: 1200, height: 630, alt: `${business.fullName} (concept demo)` }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/brand/og.jpg"] },
}

export const viewport: Viewport = { themeColor: "#1c1216" }

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  name: business.fullName,
  image: `${siteUrl}/brand/og.jpg`,
  description: "Concept demo for a fictional business.",
  telephone: "+1-555-010-0123",
  url: siteUrl,
  priceRange: "$25–$325",
  address: {
    "@type": "PostalAddress",
    streetAddress: business.address.street,
    addressLocality: business.address.city,
  },
  openingHoursSpecification: hours.filter((h) => h.open).map((h) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: h.day,
    opens: h.open,
    closes: h.close,
  })),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${jost.variable} ${cormorant.variable}`}>
      <body className="font-sans antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
        <SmoothScroll />
        <VoiceAssistant />
        <Analytics />
      </body>
    </html>
  )
}
