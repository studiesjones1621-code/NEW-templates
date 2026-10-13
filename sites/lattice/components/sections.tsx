import { brand, hero, specs, details, collection } from "@/lib/brand"
import { Technology } from "./technology"
import { SwayJacket } from "./sway-jacket"

const Arrow = () => <span aria-hidden className="ml-3">→</span>

export function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] flex flex-col justify-between pt-24 pb-8 px-5 md:px-10 overflow-hidden">
      <img src="/img/wings.webp" alt="" aria-hidden className="hero-wings" />
      <div data-slot data-rot="0" className="hero-slot" />
      <div className="flex-1" />
      <div className="hero-sides pointer-events-none">
        <p className="bracket text-left">
          {hero.left.map((l) => (
            <span key={l} className="block" data-decode>{l}</span>
          ))}
        </p>
        <p className="bracket bracket-right text-right">
          {hero.right.map((l) => (
            <span key={l} className="block" data-decode>{l}</span>
          ))}
        </p>
      </div>
      <h1 className="sr-only">{brand.name}: {brand.tagline}. {brand.description}</h1>
      <div className="relative z-20 text-center">
        <p className="font-display text-[12px] md:text-[13px] tracking-[0.14em] uppercase leading-relaxed">
          <span className="block" data-decode>{hero.line1}</span>
          <span className="block" data-decode>{hero.line2}</span>
        </p>
        <a href="#collections" className="btn mt-5" data-decode-trigger>
          <span data-decode>{hero.cta}</span>
          <Arrow />
        </a>
      </div>
      <div className="relative z-20 mt-6 hidden sm:flex items-end justify-between gap-6">
        <div className="badge">
          <span className="badge-icon">◎<small>{brand.est}</small></span>
          <span>{hero.badgeLeft.map((l) => <span key={l} className="block">{l}</span>)}</span>
        </div>
        <div className="badge">
          <span className="badge-icon">⌖</span>
          <span>{hero.badgeRight.map((l) => <span key={l} className="block">{l}</span>)}</span>
        </div>
      </div>
    </section>
  )
}

export function Specs() {
  return (
    <section id="specs" className="relative min-h-[100svh] px-5 md:px-10 py-24 md:py-32 grid lg:grid-cols-2 gap-10 items-center">
      <div data-slot data-rot="-9" className="specs-slot" />
      <div className="relative z-20 lg:col-start-2">
        <h2 className="font-display text-5xl md:text-7xl uppercase leading-[0.95] mb-6" data-decode>{specs.title}</h2>
        <p className="mono-small max-w-md mb-10">{specs.intro}</p>
        <dl className="spec-table">
          {specs.rows.map((r) => (
            <div key={r.k} className="spec-row" data-decode-trigger>
              <dt data-decode>{r.k}</dt>
              <dd data-decode>{r.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export function Details() {
  return (
    <section id="details" className="relative min-h-[110svh] px-5 md:px-10 py-24 md:py-32 grid lg:grid-cols-[1fr_1.1fr_0.9fr] gap-10 items-center">
      <div className="relative z-20 self-start lg:pt-16">
        <h2 className="font-display text-5xl md:text-7xl uppercase leading-[0.95] mb-6" data-decode>{details.title}</h2>
        <p className="mono-small max-w-xs mb-8">{details.intro}</p>
        <a href="#technology" className="btn" data-decode-trigger>
          <span data-decode>{details.cta}</span>
          <Arrow />
        </a>
      </div>
      <div data-slot data-rot="6" className="details-slot" />
      <ol className="relative z-20 detail-list">
        {details.items.map((d) => (
          <li key={d.n} data-decode-trigger>
            <span className="text-white/35">{d.n}</span>
            <div>
              <p className="font-display uppercase tracking-[0.12em] text-[13px]" data-decode>{d.title}</p>
              <p className="mono-small mt-1">{d.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function Collections() {
  return (
    <section id="collections" className="relative px-5 md:px-10 py-24 md:py-32">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <h2 className="font-display text-5xl md:text-7xl uppercase leading-none" data-decode>{collection.title}</h2>
        <p className="mono-small md:text-right">
          {collection.aside.map((l) => <span key={l} className="block">{l}</span>)}
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {collection.items.map((p) => (
          <article key={p.n} className="product" data-decode-trigger data-sway-card style={{ ["--glow" as string]: p.color }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] text-white/35 mb-2">{p.n}</p>
                <h3 className="font-display uppercase text-[14px] md:text-[15px] tracking-[0.06em] leading-tight max-w-[12ch]" data-decode>{p.name}</h3>
              </div>
              <div className="text-right">
                <span className="product-plus" aria-hidden>+</span>
                <p className="text-[11px] text-white/45 mt-3">{p.price}</p>
              </div>
            </div>
            <div className="product-img">
              <SwayJacket src={p.image} alt={p.name} />
              <span className="product-swatches" aria-hidden><i /><i /><i /></span>
            </div>
            <div className="product-foot">
              <div className="product-tags">
                {p.tags.map((t) => <span key={t}>{t}</span>)}
              </div>
              <a href="#collections" className="product-shop">
                <span>Shop now</span>
                <span aria-hidden>→</span>
              </a>
            </div>
          </article>
        ))}
      </div>
      <div className="text-center mt-12">
        <a href="#collections" className="btn" data-decode-trigger>
          <span data-decode>{collection.cta}</span>
          <Arrow />
        </a>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="relative px-5 md:px-10 pt-16 pb-10 border-t border-white/10">
      <p className="footer-word font-display uppercase" aria-hidden>{brand.name}</p>
      <div className="mt-8 flex flex-col md:flex-row justify-between gap-4 mono-small">
        <p>{brand.description}</p>
        <p>© {new Date().getFullYear()} {brand.name}</p>
      </div>
    </footer>
  )
}

export { Technology }
