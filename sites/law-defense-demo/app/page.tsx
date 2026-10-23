import { Header, Attorneys, Contact, Footer } from "@/components/sections"
import { HeroScene, GavelScene, PrepScene, DawnScene } from "@/components/scenes"
import { ChargePicker, Rights, DeadlineCalc } from "@/components/tools"

export default function Home() {
  return (
    <main id="top" className="min-h-screen">
      <Header />
      <HeroScene />
      <GavelScene />
      <ChargePicker />
      <PrepScene />
      <Rights />
      <Attorneys />
      <DeadlineCalc />
      <DawnScene />
      <Contact />
      <Footer />
    </main>
  )
}
