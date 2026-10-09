import { ArrowUpRight } from "lucide-react"
import { products } from "@/lib/business"

export function Shop() {
  return (
    <section id="shop" className="py-24 md:py-32">
      <div className="container mx-auto px-5 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-5">Wellness Essentials</p>
            <h2 className="text-5xl lg:text-6xl leading-[1.05] tracking-tight text-balance">
              Fuel for the <span className="italic text-gold-deep">in-between</span> days.
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm">
            Practitioner-picked supplements, protein shakes and bars that support your plan between visits.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {products.map((p) => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="overflow-hidden aspect-square mb-5 bg-secondary">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex items-baseline justify-between gap-4 mb-1.5">
                <h3 className="text-xl font-medium">{p.name}</h3>
                <ArrowUpRight className="w-4 h-4 text-gold-deep transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">{p.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
