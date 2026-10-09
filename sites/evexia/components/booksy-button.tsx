import type React from "react"
import { CalendarCheck } from "lucide-react"
import { business } from "@/lib/business"
import { cn } from "@/lib/utils"

/** Opens Evexia's own online booking page (Patient Fusion) in a new tab, for visitors who'd rather book themselves. */
export function BooksyButton({
  className,
  children = "Book online",
  icon = true,
}: {
  className?: string
  children?: React.ReactNode
  icon?: boolean
}) {
  return (
    <a href={business.bookOnline} target="_blank" rel="noopener noreferrer" className={cn(className)}>
      {icon && <CalendarCheck className="w-4 h-4" strokeWidth={1.75} aria-hidden />}
      {children}
    </a>
  )
}
