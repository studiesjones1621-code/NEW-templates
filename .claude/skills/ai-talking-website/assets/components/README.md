Components from the First Class Cutz build. Copy what you need and adapt it; they contain that business's copy
(names, wording, the airline theme) which must be rewritten for each new business.

- hero.tsx + cinematic-hero.css: pinned cinematic hero: themed-object reveal, cloud fly-through with a crossing jet, clears into the next section (see references/signature-moment.md)
- services.tsx: photo cards with a scroll-linked unveil, plus talk / Booksy actions per card
- smooth-scroll.tsx: Lenis momentum scrolling (needs `npm i lenis`)
- voice-assistant.tsx + talk-button.tsx: branded Retell launcher, mic check, tap-to-start, refused-call fallback
- booksy-button.tsx: secondary "Book on Booksy" link (swap the label/URL for the business's own booking system)
- header.tsx: nav with call / book online / talk; highlighted-text.tsx: gold underline accent
- business.ts: single source of truth for real business data
- visit-locations.tsx: hours & location for one or more offices (tabs only when there are several), per-office hours with open-now badge and map
- charm/: the Charm Medical Aesthetics build (rewrite its copy too)
  - hero-subject-emblem.tsx: owner cutout → transition layer → business object rising with a single sunlit drip
  - anatomy.tsx + anatomy.js: scroll-driven 3D exploded view (three.js from a CDN, lazy-loaded), labels, steps, always-visible CTA
  - results.tsx: before/after gallery with a "results vary" note
  - charm-extras.css: drip + glint, anatomy styles, header/pop-up hiding while the 3D stage is pinned
