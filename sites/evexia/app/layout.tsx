import type React from "react"
import type { Metadata, Viewport } from "next"
import { DM_Sans, Fraunces } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { VoiceAssistant } from "@/components/voice-assistant"
import { SmoothScroll } from "@/components/smooth-scroll"
import { business, locations } from "@/lib/business"
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
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")

const title = `${business.name} | Medical Weight Loss & Hormone Therapy in Baltimore, MD`
const description =
  "Medically supervised GLP-1 weight loss, BHRT for women, testosterone therapy for men and primary care with Kerryann Gross, CRNP. Parkville & Pikesville, MD plus telemedicine. Rated 5.0★ — call or talk to our AI assistant to book."

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

export const viewport: Viewport = { themeColor: "#0f2a44" }

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": locations.map((l) => ({
    "@type": "MedicalClinic",
    "@id": `${siteUrl}/#${l.id}`,
    name: `${business.fullName} - ${l.name}`,
    image: `${siteUrl}/brand/og.jpg`,
    telephone: "+1-410-670-9063",
    email: business.email,
    url: siteUrl,
    medicalSpecialty: ["Obesity medicine", "Endocrinology", "Primary care"],
    founder: { "@type": "Person", name: business.owner, jobTitle: "Nurse Practitioner" },
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
    aggregateRating: { "@type": "AggregateRating", ratingValue: l.rating, reviewCount: l.reviewCount },
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
