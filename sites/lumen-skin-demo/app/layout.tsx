import type React from "react"
import type { Metadata, Viewport } from "next"
import { Jost, Cormorant_Garamond } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { VoiceAssistant } from "@/components/voice-assistant"
import { SmoothScroll } from "@/components/smooth-scroll"
import { business } from "@/lib/business"
import "./globals.css"

const sans = Jost({ subsets: ["latin"], variable: "--font-sans-brand", display: "swap" })
const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif-brand",
  display: "swap",
})

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  // Temporary (unclaimed) deploys have no production URL yet, so fall back to the deployment's own URL
  ((u) => (u ? `https://${u}` : "http://localhost:3000"))(
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL,
  )

const title = `${business.name} | Acne Treatment, Facials & Corrective Skincare (Concept Demo)`
const description =
  "Concept demo of an AI talking website for a fictional skincare studio: root-cause acne care, custom facials, microneedling, RF and corrective peels, with a voice assistant that answers every question."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: business.fullName,
    title,
    description,
    locale: "en_US",
    images: [{ url: "/brand/og.jpg", width: 1200, height: 630, alt: `${business.name}, a concept demo skincare studio` }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/brand/og.jpg"] },
}

export const viewport: Viewport = { themeColor: "#2a211c" }

// Fictional business: structured data stays minimal (no address, phone or coordinates) so it can't be mistaken for a real listing
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: `${business.name} (concept demo)`,
  url: siteUrl,
  description,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
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
