import { memberships, products } from "@/lib/business"

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
          <p className="text-muted-foreground max-w-xs text-sm">Gift certificates available in clinic.</p>
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

        <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-8">Medical-grade skincare, in clinic</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {products.map((p) => (
            <div key={p.name} className="group block">
              <div className="overflow-hidden aspect-square mb-5 bg-secondary">
                <img
                  src={p.image}
                  alt={`${p.name}: unbranded skincare still life`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="text-xl font-medium mb-1.5">{p.name}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
