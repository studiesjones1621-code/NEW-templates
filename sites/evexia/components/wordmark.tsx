import { cn } from "@/lib/utils"

/** The Evexia logo (white lettering on dark backgrounds, brand blue on light) with the clinic's descriptor. */
export function Wordmark({ className, light = true }: { className?: string; light?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-3 leading-none", className)}>
      <img
        src={light ? "/brand/logo-light.png" : "/brand/logo.png"}
        alt="Evexia"
        width={760}
        height={306}
        className="h-9 md:h-10 w-auto"
      />
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
