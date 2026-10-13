import { brand } from "@/lib/brand"

export function Header() {
  return (
    <header className="site-header fixed inset-x-0 top-0 z-50">
      <div className="flex items-center justify-between gap-6 px-5 md:px-10 h-16">
        <a href="#top" className="flex items-center gap-2.5" aria-label={`${brand.name} home`}>
          <img src="/img/wings.webp" alt="" className="h-6 w-auto opacity-90" />
          <span className="font-display text-[13px] tracking-[0.32em]">{brand.name}</span>
        </a>
        <nav className="hidden md:flex items-center gap-10 text-[11px] tracking-[0.18em] uppercase" aria-label="Main">
          {brand.nav.map((n) => (
            <a key={n.label} href={n.href} className="nav-link" data-decode="hover">
              {n.label}
            </a>
          ))}
        </nav>
        <a href="#collections" className="text-[11px] tracking-[0.18em] uppercase whitespace-nowrap">
          Cart <span className="text-white/50">[ 0 ]</span>
        </a>
      </div>
    </header>
  )
}
