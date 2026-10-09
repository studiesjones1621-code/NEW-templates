"use client"

import type React from "react"
import { Mic } from "lucide-react"
import { cn } from "@/lib/utils"

export const TALK_EVENT = "fcc:talk"

/** Opens the voice assistant (handled by <VoiceAssistant />, which checks the mic first). */
export function openAssistant() {
  window.dispatchEvent(new Event(TALK_EVENT))
}

export function TalkButton({
  className,
  children = "Talk to our assistant",
  icon = true,
}: {
  className?: string
  children?: React.ReactNode
  icon?: boolean
}) {
  return (
    <button type="button" onClick={openAssistant} className={cn("cursor-pointer", className)}>
      {icon && <Mic className="w-4 h-4" strokeWidth={1.75} aria-hidden />}
      {children}
    </button>
  )
}
