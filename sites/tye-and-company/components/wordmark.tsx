import { cn } from "@/lib/utils"

/** Typographic wordmark (the studio's own logo file is only 100px wide, too small to use sharply). */
export function Wordmark({ className, light = true }: { className?: string; light?: boolean }) {
  return (
    <span className={cn("inline-flex flex-col leading-none", className)}>
      <span className={cn("font-serif text-[1.65rem] md:text-[1.9rem] font-medium tracking-tight", light ? "text-white" : "text-foreground")}>
        Tye <span className="italic text-gold">&amp;</span> Company
      </span>
      <span className={cn("mt-1 text-[9px] md:text-[10px] tracking-[0.32em] uppercase", light ? "text-gold-light/90" : "text-gold-deep")}>
        Beauté Bar · Hair Loss Studio
      </span>
    </span>
  )
}
