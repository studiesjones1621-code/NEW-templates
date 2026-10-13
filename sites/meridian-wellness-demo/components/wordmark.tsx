import { cn } from "@/lib/utils"

/** The meridian mark: a globe outline crossed by a single meridian line, with a small sun at the top. */
export function MeridianMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden className={className}>
      <circle cx="24" cy="28" r="15" stroke="currentColor" strokeWidth="3" />
      <ellipse cx="24" cy="28" rx="6" ry="15" stroke="currentColor" strokeWidth="2.5" />
      <path d="M9 28h30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
      <circle cx="24" cy="5.5" r="3" fill="currentColor" />
    </svg>
  )
}

/** The Meridian wordmark (fictional concept-demo brand) with the clinic's descriptor. */
export function Wordmark({ className, light = true }: { className?: string; light?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-3 leading-none", className)}>
      <span className="inline-flex items-center gap-2.5">
        <MeridianMark className="h-8 w-8 md:h-9 md:w-9 text-gold" />
        <span
          className={cn(
            "font-serif text-[1.65rem] md:text-[1.9rem] font-medium tracking-tight",
            light ? "text-white" : "text-primary",
          )}
        >
          Meridian
        </span>
      </span>
      <span
        className={cn(
          "hidden sm:block border-l pl-3 text-[9px] md:text-[10px] tracking-[0.28em] uppercase leading-[1.5]",
          light ? "border-white/20 text-white/70" : "border-border text-muted-foreground",
        )}
      >
        Weight Loss
        <br />& Wellness
      </span>
    </span>
  )
}
