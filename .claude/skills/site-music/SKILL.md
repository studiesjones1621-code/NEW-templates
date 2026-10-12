---
name: site-music
description: Add background music to a website the way it works on the Beneath the Skin site — on by default, starting the instant the browser allows it (right away where autoplay is permitted, otherwise on the visitor's first tap/click/key anywhere), with a labelled Sound/Muted pill in the header, remembered mute, smooth Web Audio fades, iPhone silent-switch handling, pause on hidden tab, and automatic fade-out while the voice assistant is in a call. Use whenever the user wants music, a soundtrack, background audio, an ambient loop or a sound toggle on a site, says "make it play automatically", or sends an mp3 for a website.
---

# Site music

Background music that feels automatic without breaking browser rules. Proven on the Beneath the Skin talking site; the user approved this exact behaviour.

## What the user expects (and what browsers allow)

- **"Play automatically" is not fully possible.** Safari (all iPhones) and Chrome block sound on page open for sites the visitor hasn't engaged with. Never claim otherwise. The closest allowed behaviour, which this skill builds:
  - music is **on by default**;
  - it starts **immediately where the browser already allows autoplay** (some desktops);
  - everywhere else it starts on the visitor's **first tap, click or key press anywhere** on the page. Scrolling alone is not a gesture, so it does not count.
- Muting with the pill is remembered (`localStorage`); a visitor who muted it stays muted on later visits.
- Explain this to the user in one plain sentence when delivering.

## Files

- `assets/site-music.tsx`: the client component (`SiteMusic`) and `ASSISTANT_EVENT`. Copy it to `components/site-music.tsx`.
- `assets/site-music.css`: the equalizer-bar styles. Append to `app/globals.css` (needs the site's `--gold` tokens or swap the classes).
- `scripts/test-music.cjs`: Playwright check of every path (blocked autoplay, allowed autoplay, toggle, remembered mute).

## Steps

1. **License first.** Only use a track the user has rights to for this site:
   - Pixabay Music: free for commercial use, no credit needed. Pixabay filenames look like `12345678-title-123456.mp3`.
   - Freesound: CC0 is fine; CC BY needs credit; never use CC BY-NC.
   - Paid libraries (Epidemic, Artlist, Uppbeat): only on a tier that covers client websites.
   - Record title, source and license in a comment above `SRC` in the component.
2. **Encode a web copy**: loudness-normalised, soft edge fades so the loop restarts smoothly, metadata stripped, about 2–3 MB.
   ```
   ffmpeg -i in.mp3 -af "loudnorm=I=-18:TP=-2:LRA=11,afade=t=in:d=2,afade=t=out:st=<duration-3>:d=3" \
     -c:a libmp3lame -b:a 128k -ar 44100 -map_metadata -1 public/audio/ambient.mp3
   ```
   Get the duration with `ffprobe -v error -show_entries format=duration -of csv=p=0 in.mp3`.
3. **Add the component** and render `<SiteMusic />` **inside the header** (one instance for all screen sizes), never as a floating button. Fixed UI must never cover page buttons; in the header it can't. On Beneath the Skin it sits in a `flex items-center gap-4` wrapper with the desktop buttons and the mobile menu button. The label hides below 380px wide (`max-[379px]:hidden`), so narrow phones show just the bars.
4. **Duck for the voice assistant.** In `components/voice-assistant.tsx` add:
   ```tsx
   import { ASSISTANT_EVENT } from "./site-music"
   // …
   useEffect(() => {
     window.dispatchEvent(new CustomEvent(ASSISTANT_EVENT, { detail: { busy: status !== "idle" } }))
   }, [status])
   ```
   The music then fades out during the mic check and the call and returns afterwards.
5. **Tune if asked**: `VOLUME` (default 0.32) and `FADE_S` (1.6 s) are constants at the top of the component.
6. **Verify**: run `node .claude/skills/site-music/scripts/test-music.cjs <url>` against the local build and again on the live site. Expected:
   - autoplay blocked: not playing after load, playing after the first tap, stopped after tapping the pill, and still muted after a reload plus a tap;
   - autoplay allowed: playing right after load.
   Then screenshot the header on desktop (1280, 1440) and phone (390, 360) and check the pill doesn't crowd the nav.

## Why it is built this way

- **Web Audio route:** it runs through a `GainNode` (via `createMediaElementSource`) because iOS ignores `volume` on a plain `<audio>`. That's the only way to fade on iPhones.
- **Silent switch:** `navigator.audioSession.type = "playback"` makes music play with the iPhone silent switch on. Without it, Web Audio is muted.
- **Delayed creation:** the audio is created 1.2 s after load, so the 2–3 MB file never competes with the hero image (LCP).
- **Equalizer bars** animate only while sound is actually audible (`data-sound="on"`). The pill reads SOUND/MUTED from the visitor's choice, so it never shows dancing bars over silence.
- **Pauses** when the tab is hidden and resumes when it returns.
- **Gesture listeners** are `pointerdown`, `touchend`, `keydown` and `click`, in the capture phase. A first tap on the pill itself is ignored by that listener and handled by the pill's own click, so it can't turn on and off in the same tap.
