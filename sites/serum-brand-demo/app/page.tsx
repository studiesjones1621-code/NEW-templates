import { Header, Faq, AskAmber, Footer } from "@/components/sections"
import { HeroScene, DropScene, SkinScene, GlowScene } from "@/components/scenes"
import { Ingredients, Routine } from "@/components/tools"
import { Shop } from "@/components/shop"
import { business, product } from "@/lib/business"

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name,
  brand: { "@type": "Brand", name: business.fullName },
  description: product.short,
  image: product.photo,
  offers: product.sizes.map((s) => ({ "@type": "Offer", name: s.label, price: s.price, priceCurrency: "USD" })),
}

export default function Home() {
  return (
    <main id="top" className="min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <HeroScene />
      <DropScene />
      <Ingredients />
      <SkinScene />
      <Routine />
      <GlowScene />
      <Shop />
      <Faq />
      <AskAmber />
      <Footer />
    </main>
  )
}
