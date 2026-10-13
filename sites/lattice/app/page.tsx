import { Header } from "@/components/header"
import { Hero, Specs, Details, Technology, Collections, Footer } from "@/components/sections"
import { Lattice } from "@/components/lattice"
import { Traveler } from "@/components/traveler"
import { Decode } from "@/components/decode"
import { SmoothScroll } from "@/components/smooth-scroll"

export default function Page() {
  return (
    <>
      <SmoothScroll />
      <Lattice />
      <Decode />
      <Header />
      <main className="relative">
        <Hero />
        <Traveler />
        <Specs />
        <Details />
        <Technology />
        <Collections />
      </main>
      <Footer />
    </>
  )
}
