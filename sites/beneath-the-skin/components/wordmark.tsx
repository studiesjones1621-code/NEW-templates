import { cn } from "@/lib/utils"

/** The Beneath the Skin wordmark, set in type to match their logo (serif caps over spaced "esthetics + wellness"). */
export function Wordmark({ className, light = true }: { className?: string; light?: boolean }) {
  return (
    <span
      className={cn("inline-flex flex-col items-center leading-none", light ? "text-white" : "text-primary", className)}
      aria-label="Beneath the Skin Esthetics + Wellness"
    >
      <span className="font-serif text-[1.35rem] md:text-[1.6rem] tracking-[0.04em] uppercase">Beneath the Skin</span>
      <span className="mt-1 text-[0.5rem] md:text-[0.56rem] tracking-[0.42em] uppercase opacity-75 pl-[0.42em]">
        Esthetics + Wellness
      </span>
    </span>
  )
}
