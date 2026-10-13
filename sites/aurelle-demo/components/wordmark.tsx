import { cn } from "@/lib/utils"

/** The Aurelle Medical Aesthetics wordmark (fictional concept-demo brand; ivory on dark, forest green on light). */
export function Wordmark({ className, light = true }: { className?: string; light?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-3 leading-none", className)}>
      <img
        src={light ? "/brand/logo-light.png" : "/brand/logo.png"}
        alt="Aurelle Medical Aesthetics"
        width={1497}
        height={625}
        className="h-10 md:h-12 w-auto"
      />
    </span>
  )
}
