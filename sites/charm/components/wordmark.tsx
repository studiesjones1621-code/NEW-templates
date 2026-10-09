import { cn } from "@/lib/utils"

/** The Charm Medical Aesthetics logo (ivory on dark backgrounds, forest green on light). */
export function Wordmark({ className, light = true }: { className?: string; light?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-3 leading-none", className)}>
      <img
        src={light ? "/brand/logo-light.png" : "/brand/logo.png"}
        alt="Charm Medical Aesthetics"
        width={1456}
        height={625}
        className="h-11 md:h-12 w-auto"
      />
    </span>
  )
}
