import { Header } from "@/components/header"
import { Hero, Specs, Details, Technology, Collections, Footer } from "@/components/sections"
import { Lattice } from "@/components/lattice"
import { Traveler } from "@/components/traveler"
import { Decode } from "@/components/decode"
import { SmoothScroll } from "@/components/smooth-scroll"
import { MotionExtras } from "@/components/motion-extras"

export default function Page() {
  return (
    <>
      <SmoothScroll />
      <Lattice />
      <Decode />
      <MotionExtras />
      <a href="#specs" className="skip-link">Skip to content</a>
      <Header />
      <main className="relative" id="main">
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
