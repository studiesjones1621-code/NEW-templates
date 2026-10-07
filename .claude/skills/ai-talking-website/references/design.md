# Design and build reference

## Section map (required sections)
Hero → Services (card grid) → Why Choose Us → Testimonials → (optional full price menu) → Hours & Location → Footer.

When remapping a template, reuse its strongest layouts instead of deleting them:
| Template section type | Becomes |
| - | - |
| Portfolio / projects image grid with reveal | Services cards (photo, tag, price, duration, "Book this with our assistant") |
| Icon feature list / expertise | Why Choose Us (6 benefits; use real differentiators: licensing, amenities, reviews themes) |
| Sticky title + image + numbered list | Testimonials (rating badge, owner photo, verbatim review excerpts) |
| FAQ accordion | Full price menu by category, or a short real FAQ |
| Big dark CTA band | Hours & Location (address link, hours table with "today" and open-now badge, call + talk buttons, map) |
Delete pricing tiers, feature comparisons, newsletter forms, booking forms (the agent books), fake team pages.

## Copy rules
- Headlines under 8 words, benefit-first. Paragraphs at most 2 sentences.
- Mine the business's own vocabulary for the hook. Example: a barbershop with "Economy / Business Class / First Class" service names got "Every cut, flown first class.", "Choose your class.", "Now boarding".
- Reviews: verbatim excerpts with first names; trimming is fine, rewording is not. Skip 1–3 star and nonsense reviews.
- Never ship placeholder text, fake phone numbers, invented awards or invented stats.

## Look
- Derive the palette from the logo. Express it as tokens in globals.css (`--primary`, `--accent`, plus brand-specific ones like `--gold`, `--gold-light`, `--gold-deep`) and use Tailwind utilities like `bg-gold`.
- Font pairing via next/font/google: a characterful display or italic serif accent plus a clean sans (e.g. Manrope + Instrument Serif). Template font files that are 1KB placeholders are broken; delete them.
- Logos on a black JPG: convert to a true-alpha PNG (alpha = max(r,g,b), un-premultiply) so they sit on any background. `mix-blend-screen` leaves a visible box on translucent headers.
- Favicons: `app/icon.png` and `app/apple-icon.png` (Next app-dir convention). OG image: 1200×630 photo with a dark overlay and the logo composited (ImageMagick).

## Cinematic hero (assets/components/hero.tsx + cinematic-hero.css)
A section about 230svh tall with a sticky 100svh stage, driven by scroll position (never hijack wheel/touch):
- Camera: CSS drift (slow scale/translate, 24s alternate) inside a JS push-in tied to scroll progress.
- Grade: gradient darkening, a scroll-deepening shade, vignette, a drifting gold light leak (`mix-blend-mode: screen`), animated SVG-noise film grain, and letterbox bars that slide away on load.
- Scene 1 on load: eyebrow rules draw in, headline lines rise from masks (staggered `--d` delays), then subline, CTAs and scroll cue. On scroll it tilts back (rotateX), blurs and fades.
- Scene 2 fades up mid-scroll: the voice-assistant pitch ("Book your seat in one conversation.") with a pulsing talk button and the rating.
- Respect `prefers-reduced-motion` (hero collapses to one screen, animations off).
Gotchas found the hard way:
- Gradient text: use `background-image`, never the `background` shorthand. Tailwind/LightningCSS emits a second `@supports` rule with the shorthand, which resets `background-clip: text` and paints a solid bar.
- Don't put `background-clip: text` on the same element that runs a transform animation; the text disappears in Chromium. Wrap it: animated outer span, gradient inner span.

## Verification
- Playwright (chromium at /opt/pw-browsers or system) at 1440×900 and 390×844. Scroll the whole page before a full-page screenshot so reveal animations fire, then check:
  - console/page errors and HTTP ≥400
  - no horizontal overflow (`scrollWidth > innerWidth`)
  - no broken images (`img.complete && naturalWidth === 0`)
  - exactly one h1, plus title, meta description and og:image
- Use `waitUntil: 'load'`, not `networkidle`. The dev server's HMR socket and Google Maps keep the network busy.
- Lazy map iframes look blank in full-page screenshots. Scroll to the map and screenshot the element to confirm it loads.
- Don't `pkill -f "next dev"` from a shell whose own command line contains that string; it kills the shell. Find the PID instead.
- Run `npx tsc --noEmit` and `npx next build`. Remove the template's `typescript.ignoreBuildErrors` once types are clean.
