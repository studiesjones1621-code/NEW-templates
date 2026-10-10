# Signature moment: turn the business's name into a cinematic scene

The single thing visitors remember is a hero that plays on the business's own identity. For **First Class Cutz** (a barbershop whose menu is Economy / Business Class / First Class) that was: the shop's real chair edited into a cockpit pilot seat with the branded cape and a captain's hat, a scroll-driven reveal, then the camera climbing into gold-lit clouds while a black-and-gold jet flies through, and the clouds clearing straight into the Services photos.

Do this when the user asks for "immersive", "cinematic", "more wow", or when the name or menu has an obvious theme. Offer it otherwise.

## 1. Find the metaphor (from the business's own words)
| Business hook | Hero object (edit a REAL photo) | Transition layer | Crossing object |
| - | - | - | - |
| "First Class" barber | chair → pilot seat + captain's hat | clouds | private jet |
| "Smooth Sailing" detailing | car on a dock, or a captain's wheel | sea spray / mist | sailboat |
| "Rocket" plumbing / HVAC | service van → launch pad | smoke / vapour | rocket |
| "Royal" / "Crown" salon | chair → throne | gold dust / light | crown or carriage |
| "Summit" dental / ortho | chair under mountain light | mountain fog | eagle or plane |
Keep it tasteful and on-palette. The real place stays recognisable; only the theme object changes.

## 2. Make the assets
1. **Hero object:** `scripts/edit_photo.py <real photo> public/biz/<name>.jpg "<instructions>"`. Spell out what must stay (room, camera angle, the logo text letter for letter, which straps or objects must not cover it) and the brand grade. Look at every result. Expect 2–4 tries; when one is close, edit *that* output with "keep everything, change only X". Upscale with ImageMagick to about 1920px wide.
2. **Transition layers:** `gen_images.py` with "isolated on a pure solid black background" for a dense layer (a cloud bank filling the lower two thirds, lit from the top) and a wispy layer. Then `alpha_tools.py soft-black` (dense layer with `--solid-below`), with `--tint/--shadow/--warm` set from the palette.
3. **Crossing object:** `gen_images.py` with "on a perfectly flat solid pure green (#00FF00) chroma-key background, no shadow", side profile facing the travel direction. Check it actually faces that way; Gemini sometimes flips it. Then `alpha_tools.py key-green`.
4. Composite every layer over both the dark and the light page colours and look before wiring it in.

## 3. Wire the scene (assets/components/hero.tsx + cinematic-hero.css)
One pinned stage (`section` ~340svh with a `sticky top-0 h-[100svh]` child) and one progress value `p` (0→1) from scroll position. Never hijack the wheel. Timeline used:
| p | What happens |
| - | - |
| 0–0.22 | Scene 1 headline tilts back (rotateX) and fades |
| 0.20–0.40 | Reveal: camera pulls back (scale 1.14→0.94, translateY +15%, translateX +17% on ≥1024px so the caption sits left), grade and shade lift |
| 0.40–0.54 | Scene 2 caption plus CTA (talk / call / book), fading out from 0.46 |
| 0.50–0.66 | Climb: cloud bank rises from below, wisps fade in, bg pushes in |
| 0.58–0.83 | Jet crosses left→right (x from −w to stageW+0.1w, slight climb, rotate −2→−5°, scale .85→1.15) between the bank (behind) and a thin front-wisp layer at 0.4 opacity |
| 0.62–0.74 | White-out: a fill in the next section's exact colour (`--sky`) reaches 1 |
| 0.74–1.00 | Clouds scale up and fade, which "clears" into the page |
The next section (Services) gets `relative z-10`, the hero gets `mb-[-60svh]`, and Services' background is `linear-gradient(transparent → var(--sky) 38svh)`. Its content then rises through the thinning clouds with no hard edge and no empty screen. The white-out must finish before the overlap starts (p ≈ 0.75 for 60svh over 240svh of travel).

## 4. Rules learned the hard way
- **Measure against the stage, not the window.** Use `stage.offsetHeight/offsetWidth` for travel, the jet path and breakpoints. `window.innerHeight` changes when mobile browser bars show or hide, and the whole hero jolts.
- **Never animate expensive effects per frame:** `filter: blur()`, `drop-shadow()`, `backdrop-filter`, `mix-blend-mode`. They cause stutter. Animate only `transform` and `opacity`.
- **Static film grain.** A moving grain layer reads as the screen shaking.
- **Gradient text:** use `background-image` (the `background` shorthand gets re-emitted and kills `background-clip: text`), and never on the element running a transform animation; wrap it instead.
- **Entrance animations override inline styles** (`animation-fill-mode: forwards`). Put the entrance on an inner element if JS also sets that element's opacity or transform.
- **Keep the theme object visible at every size:** check the full object (the hat) clears the fixed nav at 1440×900, 1280×720 and 390×844.
- **Smooth scrolling:** add `smooth-scroll.tsx` (Lenis, `lerp: 0.09`, `anchors: true`, touch stays native, reduced motion opts out) plus `html.lenis { scroll-behavior: auto }`. Don't also pass an anchor offset if sections have `scroll-margin-top`, or the two offsets stack.
- **Scroll-linked photo unveils** (services.tsx): drive each curtain's `scaleY` from the card's position (`(vh*0.95 - top) / (height*0.7)`, eased). A one-shot IntersectionObserver plus timed transition fires out of view (restored scroll, cards rising under the clouds), and visitors only ever see open photos.
- Verify with frame captures at several `p` values on desktop and phone, and the actual frame timing (a median of about 16.7ms) while wheel-scrolling.

## 5. Optional: 3D exploded-view section (the "product anatomy" moment)
For a business with a signature tool or product (med spa syringe, barber clippers, a dental implant, a shoe),
a second cinematic beat after Services: a real 3D object on a dark studio stage that comes apart on scroll
with numbered labels pinned to each part, steps lighting up beside it, then reassembles. Reference build:
`sites/charm/public/anatomy.js` + `components/anatomy.tsx` (pattern from github.com/IRdotAI/pc-exploded).
- Plain three.js from jsdelivr (`three@0.170.0/build/three.module.min.js`) in `public/<name>.js`, exporting
  `init(root)` and auto-running on `[data-anatomy]`. The React component only imports it in an effect
  (`import(/* webpackIgnore: true */ "/x.js")`). Mark the section `data-module="/x.js"` and build_artifact.py
  copies and loads it, so it also runs in the artifact preview.
- Build the object from primitives (Cylinder/Box/Torus/Sphere) when no GLB exists. Each part: resting
  position, offset vector, small delay and wobble; explode e = ease(clamp((e - delay)/0.7)).
- Avoid addon imports (they need an import map): make the reflection environment by rendering a few
  emissive panels in a box room through PMREMGenerator.
- On a dark stage, `transmission` glass renders as dark tinted glass. Use a transparent clear-coated shell
  (opacity ~0.3, envMapIntensity ~2.4, depthWrite false) for clear glass and liquids.
- Labels are HTML: project each part's anchor through the camera every frame; fade them in by scroll.
- Render only while the section is on screen (IntersectionObserver). Cap pixel ratio at 1.5–1.75. Frame
  the exploded state so every part stays in view at 1440×900 and 390×844 (pull the camera back on phones).
- Test headless with `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader`.
