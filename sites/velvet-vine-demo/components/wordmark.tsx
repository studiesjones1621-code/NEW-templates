import { cn } from "@/lib/utils"

/** Typographic wordmark for the fictional demo studio. */
export function Wordmark({ className, light = true }: { className?: string; light?: boolean }) {
  return (
    <span className={cn("inline-flex flex-col leading-none", className)}>
      <span className={cn("font-serif text-[1.65rem] md:text-[1.9rem] font-medium tracking-tight", light ? "text-white" : "text-foreground")}>
        Velvet <span className="italic text-gold">&amp;</span> Vine
      </span>
      <span className={cn("mt-1 text-[9px] md:text-[10px] tracking-[0.32em] uppercase", light ? "text-gold-light/90" : "text-gold-deep")}>
        Beauty Bar · Hair Studio
      </span>
    </span>
  )
}
