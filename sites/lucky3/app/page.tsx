import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Services } from "@/components/services"
import { GroomStack } from "@/components/groom-stack"
import { Stories } from "@/components/stories"
import { Team } from "@/components/team"
import { Cats } from "@/components/cats"
import { Shop } from "@/components/shop"
import { Visit } from "@/components/visit"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <GroomStack />
      <Stories />
      <Team />
      <Cats />
      <Shop />
      <Visit />
      <Footer />
    </main>
  )
}
