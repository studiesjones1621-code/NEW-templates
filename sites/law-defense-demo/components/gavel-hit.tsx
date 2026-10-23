"use client"

import { useEffect } from "react"
import { SCRUB_FRAME_EVENT } from "./scrub-scene"

/*
  Our own "dun dun": an original gavel thud synthesized with Web Audio (no recording, nothing to license),
  played as the footage's gavel lands on the block (frames 47 and 65 of the gavel scene) while scrolling down.
  It respects the header's sound pill (muted → silent) and, like all web audio, only plays after the
  visitor's first tap, click or key press.
*/

const SCENE = "gavel"
const HITS = [46, 64] // zero-based frame indexes where the gavel meets the block
const PREF_KEY = "calderreyes-sound" // same key as <SiteMusic />

function thud(ctx: AudioContext, when: number, pitch: number, level: number) {
  const out = ctx.createGain()
  out.gain.setValueAtTime(0.0001, when)
  out.gain.exponentialRampToValueAtTime(level, when + 0.006)
  out.gain.exponentialRampToValueAtTime(0.0001, when + 1.1)
  out.connect(ctx.destination)

  // Body: a deep, falling boom
  const body = ctx.createOscillator()
  body.type = "sine"
  body.frequency.setValueAtTime(pitch, when)
  body.frequency.exponentialRampToValueAtTime(pitch * 0.45, when + 0.5)
  body.connect(out)
  body.start(when)
  body.stop(when + 1.15)

  // Strike: a short wooden knock (filtered noise burst)
  const len = Math.floor(ctx.sampleRate * 0.07)
  const buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3)
  const knock = ctx.createBufferSource()
  knock.buffer = buf
  const band = ctx.createBiquadFilter()
  band.type = "bandpass"
  band.frequency.value = 900
  band.Q.value = 1.2
  const kg = ctx.createGain()
  kg.gain.value = level * 0.9
  knock.connect(band).connect(kg).connect(ctx.destination)
  knock.start(when)
}

export function GavelHit() {
  useEffect(() => {
    let ctx: AudioContext | null = null
    let lastFrame = -1
    const unlock = () => {
      try {
        ctx ??= new AudioContext()
        void ctx.resume()
      } catch {}
    }
    const soundOn = () => {
      try {
        return (localStorage.getItem(PREF_KEY) ?? "on") !== "off"
      } catch {
        return true
      }
    }
    const onFrame = (e: Event) => {
      const { name, frame } = (e as CustomEvent<{ name: string; frame: number }>).detail
      if (name !== SCENE) return
      const prev = lastFrame
      lastFrame = frame
      if (prev < 0 || frame <= prev || frame - prev > 40) return // only when scrolling forward through it (not a jump from a nav link)
      // If one scroll step passes both strikes, play them as a quick "dun dun" instead of a single hit
      let delay = 0.01
      HITS.forEach((h, i) => {
        if (prev < h && frame >= h && ctx && ctx.state === "running" && soundOn()) {
          thud(ctx, ctx.currentTime + delay, i === 0 ? 92 : 78, i === 0 ? 0.55 : 0.6)
          delay += 0.42
        }
      })
    }
    window.addEventListener("pointerdown", unlock, { capture: true })
    window.addEventListener("keydown", unlock, { capture: true })
    window.addEventListener(SCRUB_FRAME_EVENT, onFrame)
    return () => {
      window.removeEventListener("pointerdown", unlock, { capture: true })
      window.removeEventListener("keydown", unlock, { capture: true })
      window.removeEventListener(SCRUB_FRAME_EVENT, onFrame)
      void ctx?.close()
    }
  }, [])
  return null
}
