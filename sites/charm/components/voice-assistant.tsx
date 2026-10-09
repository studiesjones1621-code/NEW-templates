"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Script from "next/script"
import { Mic, Phone, X } from "lucide-react"
import { business } from "@/lib/business"
import { TALK_EVENT } from "./talk-button"

const AGENT_ID = process.env.NEXT_PUBLIC_RETELL_AGENT_ID
const PUBLIC_KEY = process.env.NEXT_PUBLIC_RETELL_PUBLIC_KEY
const PROMPT_DELAY_MS = 4000
const PROMPT_DISMISSED_KEY = "fcc_prompt_dismissed"

// Hides Retell's stock launcher (we render our own) while leaving its call window intact.
const WIDGET_STYLE_ID = "fcc-widget-overrides"
const WIDGET_CSS = `[class*="_fabWrapBase"], [class*="_poweredByBase"] { display: none !important; }`

type Status = "idle" | "checking" | "open"

function micErrorMessage(err: unknown): string {
  const name = err instanceof DOMException || err instanceof Error ? err.name : ""
  const call = `or call us at ${business.phoneDisplay}`
  switch (name) {
    case "NotFoundError":
    case "DevicesNotFoundError":
    case "OverconstrainedError":
      return `Mic not found — check your microphone and try again, ${call}.`
    case "NotAllowedError":
    case "PermissionDeniedError":
    case "SecurityError":
      return `Microphone access is blocked — allow it in your browser's site settings and try again, ${call}.`
    case "NotReadableError":
    case "TrackStartError":
      return `Your mic is busy in another app — close it and try again, ${call}.`
    default:
      return `We couldn't start your mic — try again, ${call}.`
  }
}

function isMicError(reason: unknown) {
  const name = reason instanceof DOMException || reason instanceof Error ? reason.name : ""
  return ["NotFoundError", "NotAllowedError", "NotReadableError", "OverconstrainedError", "PermissionDeniedError"].includes(
    name,
  )
}

/** The widget renders into an open shadow root under #retell-widget-root. */
function getWidgetShadow(): ShadowRoot | null {
  const root = document.getElementById("retell-widget-root")
  if (!root) return null
  if (root.shadowRoot) return root.shadowRoot
  for (const el of Array.from(root.querySelectorAll("*"))) {
    if (el.shadowRoot) return el.shadowRoot
  }
  return null
}

function styleWidget(shadow: ShadowRoot) {
  if (shadow.getElementById(WIDGET_STYLE_ID)) return
  const style = document.createElement("style")
  style.id = WIDGET_STYLE_ID
  style.textContent = WIDGET_CSS
  shadow.appendChild(style)
}

function widgetFab(shadow: ShadowRoot) {
  return shadow.querySelector<HTMLElement>('[class*="_fabWrapBase"] button, button[class*="_fabBase"]')
}

function widgetWindowOpen(shadow: ShadowRoot) {
  return !!shadow.querySelector('[class*="_window_"]')
}

function findButtonByText(shadow: ShadowRoot, text: string) {
  return Array.from(shadow.querySelectorAll<HTMLButtonElement>("button")).find((b) =>
    b.textContent?.trim().toLowerCase().includes(text),
  )
}

/** Swap the widget's generic subtitle for one that fits the studio. */
function relabelWidget(shadow: ShadowRoot) {
  const walker = document.createTreeWalker(shadow, NodeFilter.SHOW_TEXT)
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node.nodeValue?.trim() === "Your RetellAI assistant") node.nodeValue = "Ask anything · book your visit"
    if (node.nodeValue?.trim() === "Start to call") node.nodeValue = "Tap to start talking"
  }
}

/** Friendly text for a refused call (Retell's create-web-call response status). */
function callErrorMessage(status: number) {
  if (status === 402) return `Our assistant can't take calls right now — please call us at ${business.phoneDisplay}.`
  if (status === 401 || status === 403)
    return `Our assistant isn't available on this page yet — please call us at ${business.phoneDisplay}.`
  return `We couldn't connect the call — try again, or call us at ${business.phoneDisplay}.`
}

export function VoiceAssistant() {
  const enabled = Boolean(AGENT_ID && PUBLIC_KEY)
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState<string | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [widgetReady, setWidgetReady] = useState(false)
  const statusRef = useRef(status)
  statusRef.current = status

  // Friendly nudge a few seconds after load (once per session)
  useEffect(() => {
    let dismissed = false
    try {
      dismissed = sessionStorage.getItem(PROMPT_DISMISSED_KEY) === "1"
    } catch {}
    if (dismissed) return
    const t = setTimeout(() => setShowPrompt(true), PROMPT_DELAY_MS)
    return () => clearTimeout(t)
  }, [])

  const dismissPrompt = useCallback(() => {
    setShowPrompt(false)
    try {
      sessionStorage.setItem(PROMPT_DISMISSED_KEY, "1")
    } catch {}
  }, [])

  // Watch the widget: restyle it once mounted and track whether its window is open
  useEffect(() => {
    if (!enabled) return
    let observer: MutationObserver | null = null
    const attach = () => {
      const shadow = getWidgetShadow()
      if (!shadow || !widgetFab(shadow)) return false
      styleWidget(shadow)
      setWidgetReady(true)
      observer = new MutationObserver(() => {
        relabelWidget(shadow)
        const open = widgetWindowOpen(shadow)
        if (open && statusRef.current !== "open") setStatus("open")
        if (!open && statusRef.current === "open") setStatus("idle")
      })
      observer.observe(shadow, { childList: true, subtree: true })
      return true
    }
    const interval = setInterval(() => attach() && clearInterval(interval), 250)
    return () => {
      clearInterval(interval)
      observer?.disconnect()
    }
  }, [enabled])

  // Watch the widget's own call request: if Retell refuses it (no credits, domain not allowed…),
  // close the widget and show a friendly message instead of leaving the visitor on a dead button.
  useEffect(() => {
    const original = window.fetch
    window.fetch = async (...args: Parameters<typeof fetch>) => {
      const res = await original(...args)
      try {
        const input = args[0]
        const url = typeof input === "string" ? input : input instanceof Request ? input.url : String(input)
        if (url.includes("create-web-call") && !res.ok) {
          getWidgetShadow()?.querySelector<HTMLButtonElement>('button[aria-label="Close assistant"]')?.click()
          setStatus("idle")
          setError(callErrorMessage(res.status))
        }
      } catch {}
      return res
    }
    return () => {
      window.fetch = original
    }
  }, [])

  // Safety net: never let a mic failure inside the widget surface as an uncaught runtime error
  useEffect(() => {
    const onRejection = (e: PromiseRejectionEvent) => {
      if (isMicError(e.reason)) {
        e.preventDefault()
        setError(micErrorMessage(e.reason))
        setStatus("idle")
      }
    }
    window.addEventListener("unhandledrejection", onRejection)
    return () => window.removeEventListener("unhandledrejection", onRejection)
  }, [])

  const start = useCallback(async () => {
    if (statusRef.current === "checking") return
    setError(null)
    setShowPrompt(false)

    if (!enabled) {
      setError(`Our assistant is offline right now — call us at ${business.phoneDisplay}.`)
      return
    }
    const shadow = getWidgetShadow()
    const fab = shadow && widgetFab(shadow)
    if (!shadow || !fab) {
      setError(`The assistant is still loading — try again in a moment, or call us at ${business.phoneDisplay}.`)
      return
    }
    if (widgetWindowOpen(shadow)) {
      setStatus("open")
      return
    }

    // Ask for the mic first so a missing/blocked mic gets a friendly message instead of a widget error
    if (!navigator.mediaDevices?.getUserMedia) {
      setError(`This browser can't use a microphone here — call us at ${business.phoneDisplay}.`)
      return
    }
    setStatus("checking")
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((t) => t.stop())
    } catch (err) {
      setStatus("idle")
      setError(micErrorMessage(err))
      return
    }

    // Open the widget; the visitor taps its "start" button themselves. Browsers (iPhone Safari especially)
    // only let a call's audio start from a real tap, so pressing it for them leaves the call unjoined.
    fab.click()
    setStatus("open")
  }, [enabled])

  useEffect(() => {
    const handler = () => void start()
    window.addEventListener(TALK_EVENT, handler)
    return () => window.removeEventListener(TALK_EVENT, handler)
  }, [start])

  const launcherHidden = status === "open"

  return (
    <>
      {enabled && (
        <Script
          id="retell-widget"
          src="https://dashboard.retellai.com/retell-widget-v2.js"
          type="module"
          strategy="lazyOnload"
          data-voice-public-key={PUBLIC_KEY}
          data-voice-agent-id={AGENT_ID}
          data-title={business.shortName}
          data-bot-name="Clara"
          data-logo-url="/brand/logo-square.png"
          data-theme-color="#26372f"
          data-component-color="#d6b77a"
          data-fab-text="Talk to us"
          data-show-ai-popup="false"
        />
      )}

      <div
        className={`fixed z-[60] bottom-4 right-4 md:bottom-6 md:right-6 flex flex-col items-end gap-3 transition-all duration-300 ${
          launcherHidden ? "opacity-0 pointer-events-none translate-y-2" : "opacity-100"
        }`}
        aria-hidden={launcherHidden}
      >
        {error && (
          <div
            role="alert"
            className="relative max-w-[min(20rem,calc(100vw-2rem))] bg-background text-foreground border border-border shadow-xl shadow-black/15 p-4 pr-9 text-sm leading-relaxed animate-in fade-in slide-in-from-bottom-2"
          >
            <p className="mb-3">{error}</p>
            <a
              href={business.phoneHref}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-xs font-medium tracking-wide"
            >
              <Phone className="w-3.5 h-3.5" aria-hidden /> Call {business.phoneDisplay}
            </a>
            <button
              type="button"
              onClick={() => setError(null)}
              className="absolute top-2.5 right-2.5 p-1 text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label="Dismiss message"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {showPrompt && !error && (
          <div className="relative max-w-[17rem] bg-background text-foreground border border-border shadow-xl shadow-black/15 p-4 pr-9 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <p className="text-sm font-semibold mb-1">Thinking about Botox or filler?</p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              Talk to our assistant. It knows every price and can book your free consult.
            </p>
            <button
              type="button"
              onClick={() => void start()}
              className="text-sm font-semibold underline decoration-gold underline-offset-4 cursor-pointer"
            >
              Start talking
            </button>
            <button
              type="button"
              onClick={dismissPrompt}
              className="absolute top-2.5 right-2.5 p-1 text-muted-foreground hover:text-foreground cursor-pointer"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
            <span
              className="absolute -bottom-[7px] right-10 w-3 h-3 rotate-45 bg-background border-r border-b border-border"
              aria-hidden
            />
          </div>
        )}

        <button
          type="button"
          onClick={() => void start()}
          disabled={status === "checking"}
          className="group inline-flex items-center gap-3 rounded-full bg-primary text-primary-foreground pl-2 pr-5 py-2 shadow-xl shadow-black/30 ring-1 ring-gold/50 hover:ring-gold transition-all cursor-pointer disabled:cursor-wait"
          aria-label="Talk to our voice assistant"
          data-widget-ready={widgetReady}
        >
          <span className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gold text-primary">
            {status !== "checking" && (
              <span className="absolute inset-0 rounded-full bg-gold/60 animate-ping [animation-duration:2.4s]" aria-hidden />
            )}
            <Mic className="relative w-[18px] h-[18px]" strokeWidth={2} aria-hidden />
          </span>
          <span className="text-sm font-semibold tracking-wide">{status === "checking" ? "Checking mic…" : "Talk to us"}</span>
        </button>
      </div>
    </>
  )
}
