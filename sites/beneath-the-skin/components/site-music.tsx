"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

/** Fired by the voice assistant with `{ busy: boolean }` while its mic check or call is open. */
export const ASSISTANT_EVENT = "bts:assistant"

const SRC = "/audio/ambient.mp3" // "Desires" (R&B type beat), Pixabay Content License: commercial use, no attribution
const VOLUME = 0.32
const FADE_S = 1.6
const PREF_KEY = "bts-sound"

type Engine = { ctx: AudioContext; gain: GainNode; el: HTMLAudioElement }

/**
 * Opt-in background music. Muted by default and never autoplays: sound starts only from a tap on this toggle (or, for
 * a visitor who turned it on before, their first tap anywhere on the page). The track runs through Web Audio so it can
 * fade in and out (iOS ignores volume on a plain <audio>), plays even with the iPhone silent switch on, pauses when the
 * tab is hidden, and fades out while the voice assistant is in a call.
 */
export function SiteMusic({ className }: { className?: string }) {
  const [on, setOn] = useState(false)
  const engine = useRef<Engine | null>(null)
  const wanted = useRef(false) // the visitor's choice
  const blocked = useRef(false) // assistant busy or tab hidden

  const getEngine = useCallback(() => {
    if (engine.current) return engine.current
    // Play through the media channel so the silent switch on iPhones does not mute it
    const nav = navigator as Navigator & { audioSession?: { type: string } }
    if (nav.audioSession) nav.audioSession.type = "playback"
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new Ctx()
    const el = new Audio(SRC)
    el.loop = true
    el.preload = "auto"
    el.crossOrigin = "anonymous"
    const gain = ctx.createGain()
    gain.gain.value = 0
    ctx.createMediaElementSource(el).connect(gain).connect(ctx.destination)
    engine.current = { ctx, gain, el }
    return engine.current
  }, [])

  // Fade toward the right level for the current state; pause the element once fully faded out
  const apply = useCallback(() => {
    const e = engine.current
    if (!e) return
    const audible = wanted.current && !blocked.current
    const now = e.ctx.currentTime
    e.gain.gain.cancelScheduledValues(now)
    e.gain.gain.setValueAtTime(e.gain.gain.value, now)
    e.gain.gain.linearRampToValueAtTime(audible ? VOLUME : 0, now + FADE_S)
    if (audible) {
      void e.ctx.resume()
      void e.el.play().catch(() => {})
    } else {
      window.setTimeout(() => {
        if (!(wanted.current && !blocked.current)) e.el.pause()
      }, FADE_S * 1000 + 50)
    }
  }, [])

  // Must run inside a tap: creating and resuming audio is only allowed from a user gesture
  const setSound = useCallback(
    (next: boolean) => {
      wanted.current = next
      setOn(next)
      try {
        localStorage.setItem(PREF_KEY, next ? "on" : "off")
      } catch {}
      if (next) getEngine()
      apply()
    },
    [apply, getEngine],
  )

  useEffect(() => {
    // A visitor who turned sound on last time gets it back on their first tap, never before
    let pref = "off"
    try {
      pref = localStorage.getItem(PREF_KEY) ?? "off"
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const firstTap = (e: Event) => {
      // A first tap on the toggle itself is handled by its own click
      if ((e.target as Element | null)?.closest?.(".site-music")) return
      setSound(true)
    }
    if (pref === "on" && !reduce) {
      window.addEventListener("pointerdown", firstTap, { once: true, capture: true })
      window.addEventListener("keydown", firstTap, { once: true, capture: true })
    }
    const onVisibility = () => {
      blocked.current = document.hidden || assistantBusy
      apply()
    }
    let assistantBusy = false
    const onAssistant = (e: Event) => {
      assistantBusy = Boolean((e as CustomEvent<{ busy: boolean }>).detail?.busy)
      blocked.current = document.hidden || assistantBusy
      apply()
    }
    document.addEventListener("visibilitychange", onVisibility)
    window.addEventListener(ASSISTANT_EVENT, onAssistant)
    return () => {
      window.removeEventListener("pointerdown", firstTap, { capture: true })
      window.removeEventListener("keydown", firstTap, { capture: true })
      document.removeEventListener("visibilitychange", onVisibility)
      window.removeEventListener(ASSISTANT_EVENT, onAssistant)
      engine.current?.el.pause()
      void engine.current?.ctx.close()
      engine.current = null
    }
  }, [apply, setSound])

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        setSound(!wanted.current)
      }}
      aria-pressed={on}
      aria-label={on ? "Turn music off" : "Turn music on"}
      title={on ? "Music on" : "Music off"}
      data-sound={on ? "on" : "off"}
      className={cn(
        "site-music inline-flex items-center gap-2 text-white/85 hover:text-gold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold",
        className,
      )}
    >
      <span className="site-music-bars" aria-hidden>
        <span />
        <span />
        <span />
        <span />
      </span>
      <span className="hidden 2xl:inline text-xs tracking-[0.2em] uppercase">{on ? "Sound on" : "Sound off"}</span>
    </button>
  )
}
