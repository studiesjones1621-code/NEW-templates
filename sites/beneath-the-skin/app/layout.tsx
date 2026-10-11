import type React from "react"
import type { Metadata, Viewport } from "next"
import { Jost, Cormorant_Garamond } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { VoiceAssistant } from "@/components/voice-assistant"
import { SmoothScroll } from "@/components/smooth-scroll"
import { business, locations } from "@/lib/business"
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

const title = `${business.name} | Acne Treatment, Facials & Esthetics in Ellicott City, MD`
const description =
  "Root-cause acne healing, custom facials, microneedling, RF and corrective peels with Katrina Parker, LE, an oncology-trained esthetician with 15+ years in Ellicott City. Talk to our AI assistant or call to book."

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
    images: [{ url: "/brand/og.jpg", width: 1200, height: 630, alt: `${business.fullName} in Ellicott City` }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/brand/og.jpg"] },
}

export const viewport: Viewport = { themeColor: "#2a211c" }

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": locations.map((l) => ({
    "@type": ["BeautySalon", "DaySpa"],
    "@id": `${siteUrl}/#${l.id}`,
    name: business.fullName,
    image: `${siteUrl}/brand/og.jpg`,
    telephone: "+1-301-971-2769",
    email: business.email,
    url: siteUrl,
    priceRange: "$18–$775",
    founder: { "@type": "Person", name: business.owner, jobTitle: "Licensed Esthetician" },
    address: {
      "@type": "PostalAddress",
      streetAddress: l.street,
      addressLocality: l.city,
      addressRegion: l.state,
      postalCode: l.zip,
      addressCountry: "US",
    },
    geo: { "@type": "GeoCoordinates", latitude: l.geo.lat, longitude: l.geo.lng },
    openingHoursSpecification: l.hours.filter((h) => h.open).map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.day,
      opens: h.open,
      closes: h.close,
    })),
    sameAs: [business.website, business.instagram, business.facebook],
  })),
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
