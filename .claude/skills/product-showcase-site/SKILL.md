---
name: product-showcase-site
description: Build a premium dark "product showcase" site for a client from the Lattice template (live demo — NULLFORM jackets): a lattice grid that lights up under the cursor, labels that decode out of static, the client's real product travelling from screen to screen and swaying/bending with the mouse (WebGL cloth-like bend, sleeves swinging a beat behind for garments), magnetic buttons, scroll-speed skew, a scroll-driven 3D exploded view of the product's layers with pointers to fact cards (desktop and phone), and a product grid whose items sway on hover. Use when a client sells physical products (clothing, sneakers, tools, devices, bottles, skincare, gear) or wants "the jacket site", "the Lattice/Artefakt look", a dark techwear/streetwear/e-commerce landing page, or a product that moves with the mouse — even if they don't name the template. Combine with ai-talking-website for the voice agent.
---

# Product showcase site (Lattice template)

A complete, proven Next.js 16 + Tailwind 4 site. Live reference: https://zippy-indigo-jsm6s2u.vercel.app (repo
`sites/lattice`). You re-skin it for a client: copy, products, images and the 3D layer stack change. The motion
systems stay as they are; they are tuned and verified.

The user's standing rules still apply:
- Use **real objects**: the client's real product photos first.
- Fixed UI must never cover in-page buttons.
- Phone scrolling must stay smooth.
- Secrets go in `.env`, never committed.
- Push and verify on the live site.

## What's in it

| Piece | Files | Notes |
|---|---|---|
| Content | `lib/brand.ts` | **Everything a client changes**: name, logo, nav, hero copy, specs, details, 3D layer facts, products, prices |
| Lattice glow | `components/lattice.tsx`, `.lattice-grid` CSS | Squares light under the cursor; loop sleeps when idle |
| Decoding labels | `components/decode.tsx` | `data-decode` (on view), `data-decode="hover"`, `data-decode-trigger` (hover a parent) |
| Travelling product | `components/traveler.tsx` + `data-slot` boxes in sections | Glides between slots (`data-rot`, `data-opacity`); fades out into the 3D section |
| Mouse sway / bend | `lib/sway.ts`, `lib/bend.ts`, `components/sway-jacket.tsx` | Velocity-driven springs. WebGL2 sheet bends from the top (collar); `hinges` makes sleeves swing a beat behind. Falls back to DOM layers. Desktop only |
| Magnetic + skew | `components/motion-extras.tsx` | `data-magnetic` (+ `data-magnetic-label`), `data-skew`; desktop only |
| 3D exploded layers | `components/technology.tsx`, `public/layers.js`, `public/layers-worker.js`, `public/layers-scene.js` | three.js 0.170 from CDN, runs in a Web Worker (OffscreenCanvas). Setup waits for quiet moments. Pointer lines on desktop and phones |
| Smooth scroll | `components/smooth-scroll.tsx`, `lib/scroll.ts` | Lenis on desktop; phones keep native scrolling |

## Steps

1. **Research the client.** As in `ai-talking-website` Phase 1, get:
   - products, prices, materials and specs;
   - real photos;
   - brand colors and logo;
   - their booking or buying link.
2. **Create the site** from the repo root:
   ```bash
   bash .claude/skills/product-showcase-site/scripts/new_site.sh <slug>
   ```
3. **Product cut-outs.** These matter most; read `references/customizing.md` § Cut-outs.
   - Specs: transparent WebP, front view, centred, about 1100 px square, with consistent framing across products.
   - **Real photo first**: cut out the client's own product shot (`edit_photo.py` to put it on a flat #00FF00 background, then `alpha_tools.py key-green`).
   - Generate (`gen_images.py` + `alpha_tools.py`) only when no usable real photo exists, and say so to the user.
   - **Never use other brands' product photos.** They are copyrighted.
   - Set `hero.hinges` and `collection.hinges`: `true` for garments with sleeves, `false` for rigid products.
4. **Rewrite `lib/brand.ts`** in the client's voice: hero lines, specs ("Need to know"), details, 4 layer facts and products.
   - Short uppercase mono phrases.
   - Real facts only. Never invent ratings, certifications or prices.
5. **Adapt the 3D layer stack** (`public/layers-scene.js` → `buildStack`) to the product. Recipes are in `references/customizing.md` § 3D layers, e.g. sneaker sole layers, skincare formula layers, device internals. Keep the engine API (`createEngine`, `draw(goal, pointer, now)` returning `{labels, active, open}`) and the 4-layer order matching `technology.layers`.
6. **Recolor.** Edit the `:root` tokens in `app/globals.css`:
   - Set `--accent` and the lattice glow colour (`rgba(178,170,255,…)` in `lattice.tsx`) from the brand.
   - Replace `public/img/wings.webp` (hero backdrop and logo) with brand art, or set `backdrop: ""` / `logo: ""`.
7. **Voice agent (talking sites).** Follow `ai-talking-website` Phases 3–4:
   - Copy `voice-assistant.tsx` and `talk-button.tsx`, and render `<VoiceAssistant />` in `app/layout.tsx`.
   - Add a "Talk to us" button beside the hero CTA. Make it magnetic and decoding like the others.
   - Keep the assistant prompt off the hero product on phones.
8. **Music (optional):** `site-music` skill.
9. **Verify.** Use the checklist in `references/customizing.md` § Verify:
   - desktop and phone screenshots;
   - a mouse sweep, checking that the sway reads naturally;
   - the 3D section at several scroll points, with pointers on phones;
   - no horizontal overflow and no console errors;
   - `tsc`, `next build`, then the `web-design-guidelines` review.
10. **Ship.**
    - Commit, after grepping the staged diff for keys.
    - Push.
    - Deploy (`ai-talking-website` → `references/design.md` § going live).
    - A Vercel project connected to git **must have Root Directory `sites/<slug>`**. Otherwise it builds the repo's root app (that happened once).
    - Then check the live site serves the new code.

## Don'ts

- Don't animate anything but `transform` and `opacity`. Don't run the sway, bend, magnetic or skew effects on phones or under reduced motion; the code already checks.
- Don't put `overflow: hidden` on product cards to "fix" swing overlap. The bend canvases extend 18% past the box on purpose, and `html { overflow-x: clip }` prevents sideways scrolling.
- Don't load three.js on page load. `technology.tsx` waits for a quiet moment, and the worker compiles shaders between scroll gestures.

## Music

For background music, use the `site-music` skill. The live ONDUTY site (`sites/lattice`) shows the wiring:
- `components/site-music.tsx`, with `cn` inlined since the template has no `lib/utils`;
- the square mono pill, placed in the header's right-hand group beside Cart;
- a "Sound" label under 460px wide, so the pill fits on one line on phones.
