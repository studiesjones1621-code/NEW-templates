import type React from "react"
import type { Metadata, Viewport } from "next"
import { DM_Sans, Fraunces } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { VoiceAssistant } from "@/components/voice-assistant"
import { SmoothScroll } from "@/components/smooth-scroll"
import { business } from "@/lib/business"
import "./globals.css"

const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans-brand", display: "swap" })
const serif = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif-brand",
  display: "swap",
})

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")

const title = `${business.name} | Concept Demo · Botox, Fillers & Weight Loss`
const description =
  "Concept demo of an AI talking website for a fictional med spa: neurotoxin, lip and dermal filler, collagen biostimulators, microneedling, facials and GLP-1 weight loss, with a voice assistant that answers questions and takes callback requests."

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
    images: [{ url: "/brand/og.jpg", width: 1200, height: 630, alt: `${business.fullName}, a concept demo` }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/brand/og.jpg"] },
  robots: { index: false, follow: false },
}

export const viewport: Viewport = { themeColor: "#26372f" }

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: `${business.fullName} (concept demo)`,
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
