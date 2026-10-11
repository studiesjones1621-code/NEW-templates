import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Services } from "@/components/services"
import { Anatomy } from "@/components/anatomy"
import { ClearPath } from "@/components/clear-path"
import { Shop } from "@/components/shop"
import { WhyUs } from "@/components/why-us"
import { Testimonials } from "@/components/testimonials"
import { Menu } from "@/components/menu"
import { Visit } from "@/components/visit"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <Anatomy />
      <ClearPath />
      <WhyUs />
      <Testimonials />
      <Menu />
      <Shop />
      <Visit />
      <Footer />
    </main>
  )
}
