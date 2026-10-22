import { Tag } from "lucide-react"
import { shop } from "@/lib/business"

export function Shop() {
  return (
    <section id="shop" className="relative bg-marigold text-primary py-24 md:py-32 overflow-hidden">
      <div className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-tangerine/40 blur-3xl" aria-hidden />
      <div className="relative container mx-auto px-5 md:px-8">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-16 items-center">
          <div className="reveal">
            <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.18em]">The pet supply shop</p>
            <h2 className="mt-3 font-display font-extrabold tracking-tight text-4xl md:text-6xl leading-[0.95]">Closeout prices, fitted by a groomer.</h2>
            <p className="mt-5 text-lg leading-relaxed text-primary/80">{shop.intro}</p>
            <p className="mt-5 inline-flex rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold">{shop.regulars}</p>
          </div>
          <div className="reveal relative h-[320px] md:h-[380px]">
            {shop.photos.map((p, i) => (
              <figure
                key={p.src}
                className={`absolute w-[70%] bg-white p-2.5 pb-3 shadow-2xl shadow-primary/30 ${i === 0 ? "left-0 top-0 -rotate-6" : "right-0 bottom-0 rotate-[5deg]"}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt={p.alt} loading="lazy" className="w-full aspect-[16/10] object-cover" />
              </figure>
            ))}
          </div>
        </div>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shop.deals.map((d) => (
            <div key={d.name} className="reveal flex items-center justify-between gap-4 rounded-2xl bg-background/85 px-5 py-4">
              <span className="flex items-center gap-3 font-semibold">
                <Tag className="w-4 h-4 text-tangerine" aria-hidden /> {d.name}
              </span>
              <span className="shrink-0 text-right">
                {"was" in d && <s className="mr-2 text-sm text-muted-foreground">{d.was}</s>}
                <span className="font-display font-bold">{d.price}</span>
              </span>
            </div>
          ))}
        </div>
        <p className="reveal mt-10 text-sm font-semibold uppercase tracking-[0.14em]">Also on the shelves</p>
        <ul className="reveal mt-4 flex flex-wrap gap-2">
          {shop.more.map((m) => (
            <li key={m} className="rounded-full border border-primary/25 px-3.5 py-1.5 text-sm">
              {m}
            </li>
          ))}
        </ul>
        <p className="reveal mt-6 text-xs text-primary/70">Stock changes, especially closeouts. Call to check an item.</p>
      </div>
    </section>
  )
}
