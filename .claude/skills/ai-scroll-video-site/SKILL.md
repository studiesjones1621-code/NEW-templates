---
name: ai-scroll-video-site
description: Build an immersive "interactive scroll website" where AI-generated cinematic video scenes play forward and back as you scroll (an outdoor unit turning into a glowing x-ray, burners igniting, a camera flying from the street through the house into the ducts), plus hands-on widgets (drag a thermostat dial to warm a frosty room, a before/after slider, a repair-or-replace calculator) and a Retell AI receptionist; scenes are made with Gemini images and Gemini Omni video, exported as frame sequences and deployed to Vercel. Use this whenever the user shows or describes a scroll-driven video website (often a Reel or TikTok captioned "interactive and scroll website for HVAC/roofing/plumbing…", "client paid $X"), asks to "make this", wants a "Prime Air style" site, a scroll video site, an x-ray or fly-through hero, or AI-generated scenes on a local-business site — even if they don't name the technique. Combine with ai-talking-website for real-business research, Cal.com booking and voice-agent details.
---

# AI scroll-video website

The look: a dark, cinematic page where each section is a short AI-generated film that the visitor drives with the scroll wheel, broken up by small "try it" tools. Proven build: `sites/northwind-hvac-demo` (live as Prime Air Heating & Cooling). The user loved it; keep its structure and quality bar.

## How it works
1. **Stills first** (`scripts/gen_image.py`, Gemini image): photoreal keyframes of the business's world. For transformations, make the *after* frame as an **edit of the before** ("keep the exact same camera angle, framing and objects") so the two line up.
2. **Scenes** (`scripts/gen_scene.py`, Gemini Omni Flash via the Interactions API): 8–10 s, 16:9, 720p clips.
   - Two images in = first/last-frame interpolation (condenser → x-ray, cold room → warm room).
   - One image in = the clip starts on it (house → fly-through).
   - Text only = free shot (burners igniting).
   Veo `predictLongRunning` models were retired (404 "use gemini-omni"); don't use them. Calls are synchronous and take 1–4 min; run scenes in parallel with `nohup … &`.
3. **Frames** (`scripts/export_frames.sh`): 100 WebP frames per scene at 800×450 (≈1–4 MB).
4. **Playback** (`assets/components/scrub-scene.tsx`): a pinned section (`height` 260–400svh) draws frame *i* to a cover-fit canvas, eased toward the scroll position. Frames load lazily (IntersectionObserver, 150% margin) in batches. The stage exposes eased progress as CSS var `--p`; overlays use the `.cue` class (`assets/components/cue.css`) with `--in-a/--in-b/--out-a/--out-b` to fade in and out with **no React re-renders**. The opening copy uses `cue(-1,-0.5,…)` so it's visible at rest.
5. **Widgets** (`assets/components/thermostat.tsx`, `tools.tsx`): the room footage is driven by a draggable SVG dial (and an `<input type=range>` for keyboard/screen readers) and auto-turns up once when seen. The filter slider crossfades clean→dirty stills. There's a tabbed system picker and a $5,000-rule calculator.

## Build steps
1. **Business:** a real client goes through ai-talking-website Phase 1 (research, real details, real photos where they exist). A demo uses a fictional brand, a 555 phone number, "Springfield", a footer saying it's a concept demo and `robots: noindex`. Never imitate the reel's own brand (the reel's site was "Emberline"; ours is original).
2. **Plan 4 scenes + 3 tools** from `references/scene-recipes.md`. Each scene has one job: a reveal, proof of expertise, a feeling, a stat. Copy is short and benefit-first, with real facts and sources (ENERGY STAR duct loss, flame color safety, filter intervals).
3. **Generate** stills (parallel), view a contact sheet, regenerate any that are off, then generate scenes (parallel). View each clip as a strip (`ffmpeg -vf fps=1.5` + `montage`) before using it.
4. **Scaffold** `sites/<slug>/` by copying the latest site (hard-link `node_modules` with `cp -al`). Copy the components from `assets/components/`, add `cue.css` to `globals.css`, and put data in `lib/business.ts`. Fonts in the proven build: Archivo (display) + Manrope.
5. **Voice agent:** follow ai-talking-website Phase 3–4. For HVAC and other trades, the prompt opens with **safety** (gas smell → leave and call from outside; CO alarm → get out, call 911; never touch panels or gas parts), then safe checks, then a service request. Never quote prices. If the user has their own agent in Retell, list agents with `POST /v2/list-agents` (the GET list endpoints were removed), confirm the name, and set its ID in `.env.production`. Don't publish or edit their agent unasked.
6. **Verify** (Playwright, 1440×860 and 390×844): step through the whole page in 0.55-viewport increments, then check the contact sheets, console, overflow, broken images and one h1. `npx tsc --noEmit` and `next build`.
7. **Deploy** to the user's Vercel team with `create_deployment` (gitSource = repo + working branch, `rootDirectory: sites/<slug>`). Add a readable `<name>.vercel.app` project domain (pick another if it's taken by another team). Generated deployment URLs sit behind Vercel login, so share only the project domain. A project domain follows new production deployments automatically. A `.tmp.now` domain from a claimed anonymous deploy does not.
8. **Retell domain:** the user adds the new domain under Retell → API Keys → Public Keys → allowed domains (dashboard only). Then test: Playwright with fake mic, click the launcher, tap start, and expect `create-web-call 201`.

## Gotchas learned
- Tailwind v4 `translate-*` classes use the CSS `translate` property, which **stacks** with an inline `transform`. Don't mix them on one element you animate from JS.
- Fixed UI must not cover pinned stages: the voice pop-up hides while any `[data-pin-stage]` fills the screen (ai-talking-website `voice-assistant.tsx`).
- `.cue` overlays are `pointer-events: none` with links and buttons re-enabled, so invisible layers never block clicks.
- Keep the DPR cap at 1.5 and redraw only when the frame index changes; that held 60 fps on desktop and phone.
- Gemini usage costs money: about $2–6 for 4 scenes and ~10 stills. Say so before generating, and give the user the number afterwards.

## Deliver
Live link, what each scene does, the agent and how to test it, the domain to allow in Retell, and the approximate generation cost. Offer next: swap in their real agent, rename, or a real client version.
