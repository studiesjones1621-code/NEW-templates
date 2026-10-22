import type React from "react"
import type { Metadata, Viewport } from "next"
import { Bricolage_Grotesque, DM_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { VoiceAssistant } from "@/components/voice-assistant"
import { SmoothScroll } from "@/components/smooth-scroll"
import { Reveal } from "@/components/reveal"
import { business } from "@/lib/business"
import "./globals.css"

const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans-brand", display: "swap" })
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display-brand",
  display: "swap",
})

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")

const title = `${business.fullName} | Dog & Cat Groomer in Baltimore, MD`
const description =
  "Old-school, hand-scissored dog and cat grooming in Highlandtown, Baltimore by a New York–trained groomer and author. Matted and difficult pets welcome, no vaccine records needed. Call (410) 276-6666 or talk to our AI assistant."

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
    images: [{ url: "/brand/og.jpg", width: 1200, height: 630, alt: `${business.fullName} in Baltimore` }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/brand/og.jpg"] },
}

export const viewport: Viewport = { themeColor: "#f7f1e3" }

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["PetGrooming", "LocalBusiness"],
  "@id": `${siteUrl}/#business`,
  name: business.fullName,
  image: `${siteUrl}/brand/og.jpg`,
  logo: `${siteUrl}/brand/logo.png`,
  telephone: "+1-410-276-6666",
  email: business.email,
  url: siteUrl,
  priceRange: "$$",
  founder: { "@type": "Person", name: business.owner },
  address: {
    "@type": "PostalAddress",
    streetAddress: business.address.street,
    addressLocality: business.address.city,
    addressRegion: business.address.state,
    postalCode: business.address.zip,
    addressCountry: "US",
  },
  geo: { "@type": "GeoCoordinates", latitude: business.geo.lat, longitude: business.geo.lng },
  sameAs: [business.website],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="font-sans antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
        <Reveal />
        <SmoothScroll />
        <VoiceAssistant />
        <Analytics />
      </body>
    </html>
  )
}
