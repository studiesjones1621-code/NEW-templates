import type React from "react"
import type { Metadata, Viewport } from "next"
import { Manrope, Instrument_Serif } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { VoiceAssistant } from "@/components/voice-assistant"
import { business, fullAddress, hours } from "@/lib/business"
import "./globals.css"

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" })
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
})

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")

const title = `${business.name} | Barbershop in Baltimore, MD`
const description =
  "Precision fades, beard sculpting, color and loc retwists by Reem on Reisterstown Rd, Baltimore. Rated 4.8★ — call or talk to our AI assistant to book."

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
    images: [{ url: "/brand/og.jpg", width: 1200, height: 630, alt: `${business.name} logo over the studio` }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/brand/og.jpg"] },
}

export const viewport: Viewport = { themeColor: "#0f0d0a" }

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BarberShop",
  name: business.name,
  image: `${siteUrl}/brand/og.jpg`,
  telephone: "+1-667-495-8877",
  url: siteUrl,
  priceRange: "$20–$125",
  address: {
    "@type": "PostalAddress",
    streetAddress: business.address.street,
    addressLocality: business.address.city,
    addressRegion: business.address.state,
    postalCode: business.address.zip,
    addressCountry: "US",
  },
  geo: { "@type": "GeoCoordinates", latitude: business.geo.lat, longitude: business.geo.lng },
  openingHoursSpecification: hours.map((h) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: h.day,
    opens: h.open,
    closes: h.close,
  })),
  aggregateRating: { "@type": "AggregateRating", ratingValue: 4.76, reviewCount: business.reviewCount },
  sameAs: [business.instagram, business.booksy],
  hasMap: `https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${instrument.variable}`}>
      <body className="font-sans antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
        <VoiceAssistant />
        <Analytics />
      </body>
    </html>
  )
}
