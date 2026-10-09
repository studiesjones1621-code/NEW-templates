import type React from "react"
import type { Metadata, Viewport } from "next"
import { Jost, Cormorant_Garamond } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { VoiceAssistant } from "@/components/voice-assistant"
import { SmoothScroll } from "@/components/smooth-scroll"
import { business, fullAddress, hours } from "@/lib/business"
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
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")

const title = `${business.name} | Hair Loss Studio & Beauté Bar in Baltimore, MD`
const description =
  "Hair loss consultations, pixie cuts, color and relaxers with Ms. Tye Bailey on Pennsylvania Ave, Baltimore. 20+ years, rated 4.9★ — call or talk to our AI assistant to book."

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
    images: [{ url: "/brand/og.jpg", width: 1200, height: 630, alt: `${business.fullName} in Baltimore` }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/brand/og.jpg"] },
}

export const viewport: Viewport = { themeColor: "#1c1216" }

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  name: business.fullName,
  image: `${siteUrl}/brand/og.jpg`,
  telephone: "+1-410-567-3099",
  email: business.email,
  founder: { "@type": "Person", name: business.owner },
  url: siteUrl,
  priceRange: "$25–$325",
  address: {
    "@type": "PostalAddress",
    streetAddress: business.address.street,
    addressLocality: business.address.city,
    addressRegion: business.address.state,
    postalCode: business.address.zip,
    addressCountry: "US",
  },
  geo: { "@type": "GeoCoordinates", latitude: business.geo.lat, longitude: business.geo.lng },
  openingHoursSpecification: hours.filter((h) => h.open).map((h) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: h.day,
    opens: h.open,
    closes: h.close,
  })),
  aggregateRating: { "@type": "AggregateRating", ratingValue: business.rating, reviewCount: business.reviewCount },
  sameAs: [business.website],
  hasMap: `https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`,
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
