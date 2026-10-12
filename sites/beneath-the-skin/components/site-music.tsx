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
 * Background music, on by default. Browsers never allow sound the instant a page opens (unless that visitor's browser
 * has already granted the site autoplay), so it starts as early as it is allowed: right away where autoplay is
 * permitted, otherwise on the visitor's first tap, click or key press anywhere on the page. The toggle turns it off
 * (and that choice is remembered). The track runs through Web Audio so it can fade in and out (iOS ignores volume on a
 * plain <audio>), plays even with the iPhone silent switch on, pauses when the tab is hidden, and fades out while the
 * voice assistant is in a call.
 */
export function SiteMusic({ className }: { className?: string }) {
  const [on, setOn] = useState(true)
  const [audible, setAudible] = useState(false)
  const engine = useRef<Engine | null>(null)
  const wanted = useRef(true) // on unless the visitor turned it off
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
      void e.ctx
        .resume()
        .then(() => e.el.play())
        .then(() => setAudible(e.ctx.state === "running"))
        .catch(() => setAudible(false))
    } else {
      setAudible(false)
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
    let autoTimer = 0
    let pref = "on"
    try {
      pref = localStorage.getItem(PREF_KEY) ?? "on"
    } catch {}
    const gestures = ["pointerdown", "touchend", "keydown", "click"] as const
    const start = (e: Event) => {
      // A first tap on the toggle itself is handled by its own click
      if ((e.target as Element | null)?.closest?.(".site-music")) return
      gestures.forEach((g) => window.removeEventListener(g, start, { capture: true }))
      if (wanted.current) setSound(true)
    }
    if (pref === "off") {
      wanted.current = false
      setOn(false)
    } else {
      // Where this browser already allows autoplay the context starts running and the music begins at once;
      // everywhere else it waits for the first tap, click or key press anywhere on the page
      gestures.forEach((g) => window.addEventListener(g, start, { capture: true, passive: true }))
      // A beat after load, so the music never competes with the first screen for bandwidth
      autoTimer = window.setTimeout(() => {
        if (!wanted.current || engine.current) return
        const e = getEngine()
        if (e.ctx.state === "running") apply()
      }, 1200)
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
      clearTimeout(autoTimer)
      ;(["pointerdown", "touchend", "keydown", "click"] as const).forEach((g) =>
        window.removeEventListener(g, start, { capture: true }),
      )
      document.removeEventListener("visibilitychange", onVisibility)
      window.removeEventListener(ASSISTANT_EVENT, onAssistant)
      engine.current?.el.pause()
      void engine.current?.ctx.close()
      engine.current = null
    }
  }, [apply, getEngine, setSound])

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
      data-sound={on && audible ? "on" : "off"}
      className={cn(
        "site-music inline-flex items-center gap-2 rounded-full border border-white/25 px-3 py-1.5 text-white/90 hover:border-gold hover:text-gold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold",
        className,
      )}
    >
      <span className="site-music-bars" aria-hidden>
        <span />
        <span />
        <span />
        <span />
      </span>
      <span className="text-[10px] font-medium tracking-[0.2em] uppercase max-[379px]:hidden">{on ? "Sound" : "Muted"}</span>
    </button>
  )
}
