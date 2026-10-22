import { Cat } from "lucide-react"
import { catPolicy, catPrices } from "@/lib/business"
import { TalkButton } from "./talk-button"

export function Cats() {
  return (
    <section id="cats" className="relative bg-background grain py-24 md:py-32">
      <div className="container mx-auto px-5 md:px-8 grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-start">
        <div className="reveal lg:sticky lg:top-28">
          <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-sky-deep">Cat grooming</p>
          <h2 className="mt-3 font-display font-extrabold tracking-tight text-4xl md:text-6xl leading-[0.95]">
            Yes, we <span className="lucky-text">groom cats.</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Most groomers stopped clipping cats. We still do, for a limited number of clients, and we&apos;re good at it.
          </p>
          <div className="mt-8 relative rounded-3xl overflow-hidden aspect-[4/5] max-w-sm shadow-xl shadow-primary/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/biz/cat-tree.jpg" alt="Cats relaxing on a cat tree" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>

        <div>
          <div className="reveal rounded-3xl bg-card ring-1 ring-primary/5 shadow-[0_30px_60px_-36px_oklch(0.3_0.03_235/0.5)] overflow-hidden">
            <div className="flex items-center gap-3 px-6 md:px-8 py-5 bg-primary text-primary-foreground">
              <Cat className="w-5 h-5 text-marigold" aria-hidden />
              <p className="font-display font-bold text-lg">Cat prices</p>
            </div>
            <ul className="divide-y divide-border">
              {catPrices.map((c) => (
                <li key={c.name} className="px-6 md:px-8 py-5 flex items-start justify-between gap-6">
                  <div>
                    <p className="font-semibold">{c.name}</p>
                    {c.note && <p className="mt-1 text-sm text-muted-foreground">{c.note}</p>}
                  </div>
                  <p className="shrink-0 font-display font-bold text-xl text-tangerine">{c.price}</p>
                </li>
              ))}
            </ul>
          </div>

          <h3 className="reveal mt-12 font-display font-bold text-2xl">Before you bring your cat</h3>
          <ul className="mt-5 space-y-4">
            {catPolicy.map((p) => (
              <li key={p} className="reveal flex gap-4 rounded-2xl bg-secondary/70 p-5 text-sm leading-relaxed">
                <span className="mt-1.5 shrink-0 w-2 h-2 rounded-full bg-tangerine" aria-hidden />
                {p}
              </li>
            ))}
          </ul>
          <TalkButton className="reveal mt-8 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3.5 text-sm font-semibold hover:bg-tangerine hover:text-primary transition-colors">
            Ask if your cat is a fit
          </TalkButton>
        </div>
      </div>
    </section>
  )
}
