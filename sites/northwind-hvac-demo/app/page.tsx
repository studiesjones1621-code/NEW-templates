import { Header, Services, Contact, Footer } from "@/components/sections"
import { HeroScene, FlameScene, AirflowScene } from "@/components/scenes"
import { Thermostat } from "@/components/thermostat"
import { FilterCheck, Systems, RepairOrReplace } from "@/components/tools"

export default function Home() {
  return (
    <main id="top" className="min-h-screen">
      <Header />
      <HeroScene />
      <FlameScene />
      <Thermostat />
      <FilterCheck />
      <Systems />
      <AirflowScene />
      <RepairOrReplace />
      <Services />
      <Contact />
      <Footer />
    </main>
  )
}
