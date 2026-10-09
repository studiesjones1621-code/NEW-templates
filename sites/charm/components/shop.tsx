import { ArrowUpRight, Gift } from "lucide-react"
import { business, memberships, products } from "@/lib/business"

export function Shop() {
  return (
    <section id="shop" className="py-24 md:py-32">
      <div className="container mx-auto px-5 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-5">Memberships & Skincare</p>
            <h2 className="text-5xl lg:text-6xl leading-[1.05] tracking-tight text-balance">
              Glow that <span className="italic text-gold-deep">keeps going.</span>
            </h2>
          </div>
          <a
            href={business.giftCard}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Gift className="w-4 h-4 text-gold-deep" aria-hidden />
            Buy an e-gift certificate
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {memberships.map((m) => (
            <div key={m.name} className="border border-border bg-card p-7">
              <p className="text-xs tracking-[0.25em] uppercase text-gold-deep mb-3">{m.name}</p>
              <p className="font-serif text-5xl leading-none mb-4">
                {m.price}
                <span className="text-base text-muted-foreground">{m.per}</span>
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">{m.perks}</p>
            </div>
          ))}
        </div>

        <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-8">Medical-grade skincare we trust</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {products.map((p) => (
            <a key={p.name} href={p.href} target="_blank" rel="noopener noreferrer" className="group block">
              <div className="overflow-hidden aspect-square mb-5 bg-secondary">
                <img
                  src={p.image}
                  alt={`${p.name} skincare`}
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
