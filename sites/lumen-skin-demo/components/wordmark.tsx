import { cn } from "@/lib/utils"

/** The Lumen Skin Studio wordmark, set in type (serif caps over spaced "esthetics + wellness"). Fictional brand. */
export function Wordmark({ className, light = true }: { className?: string; light?: boolean }) {
  return (
    <span
      className={cn("inline-flex flex-col items-center leading-none", light ? "text-white" : "text-primary", className)}
      aria-label="Lumen Skin Studio, Esthetics + Wellness"
    >
      <span className="font-serif text-[1rem] sm:text-[1.3rem] md:text-[1.5rem] tracking-[0.04em] uppercase whitespace-nowrap">Lumen Skin Studio</span>
      <span className="mt-1 text-[0.5rem] md:text-[0.56rem] tracking-[0.36em] uppercase opacity-75 whitespace-nowrap pl-[0.42em]">
        Esthetics + Wellness
      </span>
    </span>
  )
}
