import type React from "react"
import type { Metadata, Viewport } from "next"
import { Share_Tech_Mono, IBM_Plex_Mono } from "next/font/google"
import { brand } from "@/lib/brand"
import "./globals.css"

const display = Share_Tech_Mono({ subsets: ["latin"], weight: "400", variable: "--font-display", display: "swap" })
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" })

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  ((u) => (u ? `https://${u}` : "http://localhost:3000"))(process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL)

const title = `${brand.name} | ${brand.tagline}`
const description = brand.description

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", siteName: brand.name, title, description, images: [{ url: "/img/og.jpg", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title, description, images: ["/img/og.jpg"] },
}

export const viewport: Viewport = { themeColor: "#050507" }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
