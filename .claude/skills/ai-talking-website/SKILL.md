---
name: ai-talking-website
description: Build a premium one-page website for a local business (barber, salon, med spa, clinic, dentist, contractor, restaurant…) with an embedded Retell AI voice agent that answers questions and books real appointments through Cal.com, optionally on top of a template zip, with a cinematic themed hero (scroll-driven reveal, themed transition, the business's real object rising), an optional scroll-driven 3D exploded product section, and smooth scrolling, using real photos and real objects first; then preview it as a claude.ai artifact and deploy it live on Vercel. Use this whenever someone pastes a business URL (Booksy, Google, Yelp, Wix, WordPress, their own site), asks for an "AI talking website", "voice agent website", "website with an AI receptionist", "do this one now" after a previous talking site, wants a template rebranded for a local business or swapped onto an existing talking site, or wants a local-business site made more immersive, cinematic or 3D — even if they don't use those exact words.
---

# AI talking website

You're producing a site that looks like a $3,000 custom build for one real local business, plus a voice agent that is genuinely useful on a call. Work autonomously and use smart defaults. The user expects not to be asked questions mid-build.

Inputs usually arrive as a filled-in form: business URL, Retell API key, Retell public key, Gemini key, Cal.com key. Any field may say SKIP. Put every secret in `.env` (gitignored, with a committed `.env.example`). Never hardcode secrets in site files or commit them. If the user pasted keys into chat, suggest rotating them at the end.

Bundled resources (paths relative to this skill):
- `scripts/booksy_fetch.py`: real details, reviews and photos from a Booksy URL
- `scripts/cal_event_types.py`: list Cal.com event types and schedule, or set working hours
- `scripts/retell_setup.py`: create or update the LLM, agent and Cal.com tools, then publish (idempotent)
- `scripts/retell_check.py`: text-chat the agent to verify prompt, tools and credits
- `scripts/gen_images.py`: Gemini image generation for missing visuals and scene layers
- `scripts/edit_photo.py`: Gemini edit of a REAL business photo (keeps room and branding, changes one object)
- `scripts/alpha_tools.py`: generated image → transparent WebP (`key-green` for solid objects, `key-magenta` for green subjects like plants, `soft-black` for clouds, smoke, cream, droplets)
- `scripts/build_artifact.py`: static export → claude.ai artifact preview
- `assets/components/`: proven components: voice-assistant, talk-button, booksy-button (secondary online booking), hero.tsx + cinematic-hero.css (pinned reveal, clouds, jet), services.tsx (scroll-linked photo unveil), smooth-scroll.tsx (Lenis), highlighted-text, visit-locations.tsx (several offices with tabs), business.ts example
- `assets/components/charm/`: the latest build: hero-subject-emblem.tsx (owner cutout + business object rising through a themed layer, single sunlit drip), anatomy.tsx + anatomy.js (scroll-driven 3D exploded product with pinned labels), results.tsx (before/after), charm-extras.css
- `references/retell.md`: Retell API, Cal.com integration, widget internals, error meanings. Read before Phase 3.
- `references/design.md`: section mapping, copy rules, hero gotchas, verification checklist, going live. Read before Phase 2.
- `references/signature-moment.md`: how to turn the business's name into the cinematic hero (metaphor table, asset recipes, the scroll timeline, performance rules). Read when building the hero.

## Phase 1: Research the business

1. **Booksy URL**: run `python3 scripts/booksy_fetch.py <url> <scratch-dir>`. The page is a JS app, so the API is the only reliable source. **Any other site**: fetch the HTML, then look for schema.org JSON-LD (`LocalBusiness`, `openingHoursSpecification`), which is usually the cleanest data.
2. Capture name, services with prices and durations, phone (Booksy often hides it, but the script scans descriptions for it), address and geo, hours, rating, review count, verbatim reviews, amenities, policies and socials. Cross-check hours against the page's schema.org data when available.
3. Look at every photo before using it (montage them into a contact sheet and view it). Label files by content (`reem-cutting.jpg`, `studio-lounge.jpg`). Drop photos with stickers, certificates, or near-duplicates, and resize to ≤1600px. Real photos beat generated ones.
4. Missing fields get professional defaults inferred from the business type. If there's no CTA, pick the obvious one: dental and medical book appointments, contractors get quotes, restaurants reserve tables, salons and barbers book cuts, med spas book consultations.
5. Find the hook in the business's own language (service names, slogans, Instagram bio). It drives the headline and the agent's personality.
6. Recipes that worked on real sites:
   - **WordPress**: `/wp-json/wp/v2/pages?per_page=100&_fields=slug,title,content` gives every page's text, and `/wp-json/wp/v2/media?per_page=100` lists every image with sizes.
   - **Wix**: subpages are server-rendered, so strip tags from each page's HTML. Images are `static.wixstatic.com/media/<id>~mv2.<ext>` (full size without the `/v1/fill/...` suffix).
   - **Booking systems** often expose the real price list: find the AJAX call in the booking page's JS (e.g. OptiMantra `getServicesByLocationAndUserV2`) and read names, durations and prices. Prices on the booking menu beat "pricing per unit" on the marketing site.
   - **Google rating and hours** when Google itself is blocked: clinic directories (e.g. glp1clinics.org, mypeptidematch.com) mirror the Google listing. Use them, but flag conflicts (old address in schema.org vs footer, hours "by appointment") in the summary for the client to confirm.
   - Never use the user's email or any personal data in request headers (User-Agent etc.); use a generic tool name.

## Phase 2: Build the site

**Template zip present**: unzip into the project (inspect it in scratch first), delete foreign lockfiles if they conflict, `npm install`, and fix install issues. Do a full rebrand, not find-and-replace. Map sections per `references/design.md`, delete what doesn't fit, recolor tokens from the logo, and rewrite all copy. Keep the template's signature motion and layout ideas; that's why the user chose it. Delete all template images.

**No template**: Next.js (app router) + Tailwind, built from scratch to the same standard: distinctive Google Fonts pairing, an industry-appropriate palette, generous whitespace, subtle scroll animation, fully responsive.

**Several clients in one repo**: put each business in `sites/<slug>/` as its own Next app (scaffold by copying the most recent site, hard-linking `node_modules` with `cp -al`, then rewriting every component). Exclude `sites` in the root `tsconfig.json` so a root app's build never typechecks them. Each site gets its own Vercel project with Root Directory `sites/<slug>`, the working branch as production branch, and "Skip deployments when there are no changes" on. After a full rebrand, grep the new site for the previous client's names before shipping.

Either way:
- Put all real data in one `lib/business.ts` (see `assets/components/business.ts`) and import it everywhere.
- Sections: Hero, Services grid, Why Choose Us, Testimonials, Hours & Location (tel: links, Google Maps embed `https://www.google.com/maps?q=<address>&z=15&output=embed`), Footer. A full price menu is a good addition when there are many services.
- CTAs: click-to-call, plus "Talk to our assistant" buttons that dispatch the talk event (`talk-button.tsx`). No booking forms; the agent books. If the business already books online (Booksy, Vagaro, Square, etc.), add a secondary "Book on …" link (`booksy-button.tsx`) beside talk and call in the hero, nav, service cards, menu and visit sections, and tell the agent about it in its prompt.
- SEO: title `Business Name | Business Type in City, ST`, meta description, Open Graph with a 1200×630 image, one h1, LocalBusiness JSON-LD, `metadataBase` from `NEXT_PUBLIC_SITE_URL` or `VERCEL_PROJECT_PRODUCTION_URL`.
- Images: real photos first. If a Gemini key is given, run `gen_images.py` only for slots with no real photo. If it 429s with "limit: 0", the key has no billing; fall back without retrying. Never leave a broken image or placeholder.
- **Signature moment:** build the hero around the business's own name or theme (`references/signature-moment.md`). Example: "First Class Cutz" got its real chair edited into a pilot seat, then a fly-through of gold-lit clouds with a jet that clears into the service photos. Use the bundled hero, smooth scrolling and scroll-linked unveils. Generate and edit assets with Gemini when there's a key with billing; without one, use the plain cinematic hero over the best real photo.
- **Real objects first (user preference).** Any 3D object or featured product must be a REAL model or real photo when one can be found: the business's own product photos, or a real 3D model (GLB/glTF) from a free library with a license that allows commercial use. Search, check the license, and credit the author when required. Build from code primitives or generate with Gemini only when no usable real asset exists, and say so in the summary.
- **The symbol must be about the business.** A generic pretty object (a lotus charm for a med spa) gets rejected; use what they actually do or use (their real filler syringe, their chair, their product). The transition layer should fit too (clouds for "First Class", silk for a crown/beauty bar, mist for wellness, a cream wave for skincare/injectables).
- **3D product moment (optional, high impact):** after Services, a scroll-driven exploded view of the business's signature object with numbered labels, like Apple product pages (`references/signature-moment.md` §5, reference build in `assets/components/charm/`). Use a real model or the business's real product as the reference.
- Show the user the result early (artifact link) and iterate on their visual feedback. Small asks ("can't see the hat", "too much space after the clouds", "it's shaky") are common and quick to fix.

### Companion skills (installed alongside this one)
Load the matching skill when a build reaches that part. They are copies of third-party skills (license and source in each folder's `SOURCE.md`):
- **Design quality:** `impeccable` (commands: shape, audit, critique, polish, bolder, delight, animate, typeset, layout). Run `audit`/`polish` before delivering. Its download-and-run engine was removed; do its steps by hand.
- **Scroll motion & interactivity:** `gsap-core`, `gsap-scrolltrigger`, `gsap-timeline`, `gsap-react`, `gsap-plugins` (SplitText etc., all free now), `gsap-performance`; for the cinematic look `cinematic-gsap-lenis-motion-system`, `cinematic-scroll-storytelling`, `build-awwwards-quality-sites`.
- **Loading experience:** `fire-paper-loader` (worker-driven loader pattern), preloader section of `cinematic-scroll-storytelling`. Never cover the LCP hero with a loader; intro ≤1.2 s, once per session.
- **Micro-interactions:** `cinematic-gsap-lenis-motion-system` (magnetic buttons, custom cursor), `pointer-trail-emitter`, `reveal-hover-effect`. Desktop only (`(hover:hover) and (pointer:fine)`).
- **3D:** the `threejs-*` skills (renderer, lighting, materials, loaders, shaders, performance, model-optimizer), `build-threejs-scroll-worlds` for 3D scrollytelling.
- **Sound:** `site-music` for background music (the approved setup: on by default, starts as soon as the browser allows, Sound/Muted pill in the header, fades out during assistant calls); `ui-sound-design` for UI sounds; `threejs-impl-audio` for audio in 3D. Music needs a license that covers the client's site.
- **Product sway / bend (proven in `sites/lattice`):** `lib/sway.ts` (pointer-velocity springs; sleeves on looser springs so they swing a beat behind), `lib/bend.ts` (raw WebGL2 sheet that curves a transparent cut-out from its collar, sleeves hinged at the shoulders, no seams), `components/sway-jacket.tsx` (shared loop, hovered card sways fully, others gently), `components/motion-extras.tsx` (magnetic `data-magnetic` buttons, `data-skew` scroll-speed shear). Desktop only; phones and reduced motion keep still images.
- **Product clients:** `product-showcase-site` (the Lattice / NULLFORM template: travelling product, mouse sway and bend, lattice glow, decoding labels, 3D exploded layers). Use it as the site design for clients who sell physical products, then add the voice agent from this skill.
- **Final check:** `web-design-guidelines` (Vercel's Web Interface Guidelines, pinned locally): run it on `app/` and `components/` before delivering and fix what applies.
These are tools, not rules that override this skill: the business's real photos and objects, the Retell agent, and the user's preferences below still come first.

## Phase 3: Voice agent (Retell)

1. Read `references/retell.md`, then check https://docs.retellai.com/llms.txt for anything newer. The API has changed recently: legacy Cal.com tools are gone.
2. Write `retell/system-prompt.md` for this business. Structure: Identity (named assistant, the business, the owner), Style (voice: 1–2 sentences, one question at a time, prices and numbers spoken naturally), Goal (support first, with a background nudge toward the CTA offered once and never pushed), Business details, Services and prices, the Booking procedure, Boundaries. Include `{{current_time_<TZ>}}` and `{{current_calendar_<TZ>}}` so it knows the date.
3. Booking:
   - **Cal.com key given**: `CAL_API_KEY=… python3 scripts/cal_event_types.py`. When the account already serves another business, never change its default schedule: create a new schedule named after this business with its real hours (`POST /v2/schedules`, `isDefault: false`) and a new event type (`POST /v2/event-types` with `scheduleId`, a clear title such as "<Business> Appointment", and the address in `locations`). For a single-business account, pick the closest event type and set the schedule with `--set-hours` (note the original in your summary). `retell_setup.py` reuses the account's existing Retell Cal.com app automatically (one Cal key can back only one app). The prompt's booking procedure: ask the service → ask the day → check availability for that day → offer 2–3 times within hours → collect name, then phone, then email (spell the email back) → book with the service and phone in notes → confirm and mention the confirmation email. Never claim success unless the tool confirmed it.
   - **Cal.com SKIP**: lead-capture mode. Collect name, phone and preferred time, and say the office will confirm shortly. Omit `cal_event_type_id`.
4. Write `retell/agent.json` and run `python3 <skill>/scripts/retell_setup.py retell/agent.json` from the project root. IDs land in `retell/ids.json`, and re-running updates the same agent. Never create duplicate agents when iterating, and never touch other agents already on the account.
5. Verify with `retell_check.py "<a realistic question + availability ask>"`. A 402 means no credits: report it, since you can't fix it.
6. Medical, med spa and wellness agents: no diagnosis, doses, unit counts or promised results ("the provider decides at your consult"); don't collect detailed health information; send emergencies or post-treatment complications to 911 (988 for a mental health crisis) or the clinic. Only state facts you found (don't add "free parking" unless a source says so).

## Phase 4: Embed the agent

0. Commit the two browser-safe values (`NEXT_PUBLIC_RETELL_PUBLIC_KEY`, `NEXT_PUBLIC_RETELL_AGENT_ID`) in `.env.production` (with `!.env.production` in `.gitignore` and `.vercelignore`). They are visible in the page anyway and protected by Retell's domain allowlist, so any Vercel build, including a git-connected one, enables the widget without dashboard env vars. Server secrets stay in the ignored `.env`.
1. Copy `assets/components/voice-assistant.tsx` and `talk-button.tsx`, and render `<VoiceAssistant />` in the root layout. Customize the bot name, prompt copy and colors (`data-theme-color`, `data-component-color`). It reads `NEXT_PUBLIC_RETELL_PUBLIC_KEY` and `NEXT_PUBLIC_RETELL_AGENT_ID`.
2. What it gives you: a branded floating "Talk to us" launcher, a friendly prompt after 4s, a mic check before any call with friendly messages (mic not found / blocked / busy, each with the phone number), the widget opened for the visitor to tap start (never auto-start: phones won't join the audio), and a "call us" fallback if Retell refuses the call. Re-verify the widget's shadow-DOM selectors if Retell has shipped a new widget (retell.md).
3. Verify in Playwright: granted, denied and no-device paths, plus the `create-web-call` response. `401 not allowed for this domain` means the user must add domains in the dashboard. On the page that shows as "Our assistant isn't available on this page yet — please call us", which users report as "chat isn't available". When a temporary Vercel deploy is claimed, its domain drops the `temporary-` prefix (it redirects), so the claimed domain is the one to allow.

## Phase 5: Verify, preview, deliver

1. Run the checks in `references/design.md` (desktop + mobile screenshots and look at them, errors, overflow, broken images, h1/meta), then `tsc` and `next build`. Include a short laptop viewport (1366×657): pinned sections must keep their buttons on screen there.
2. Commit and push (secrets excluded; grep the staged diff for key prefixes first).
3. **Artifact preview** (the user wants to see it, and in a cloud session they can't open localhost): static export → `scripts/build_artifact.py` → publish with the Artifact tool, including the referenced `biz/` and `brand/` files. A live page beats screenshots. Say plainly that the voice call and live map only work on the deployed site.
4. Final summary, short:
   1. What was built and which real details were used.
   2. Preview: the artifact link, plus localhost if they run it locally.
   3. Live site. Best: the user imports the GitHub repo in Vercel (Add New → Project → pick the branch → Deploy). With the public values in `.env.production`, no env vars are needed, and every push auto-deploys. After each push, poll the live URL until the new build is served, then re-test. If Claude has no Vercel write access (403 scope), use the anonymous temporary deploy in `references/design.md` and give the claim link plus the exact expiry time.
   4. Booking mode: real Cal.com booking (which event type, hours change made) or lead capture.
   5. Manual attention: add `localhost` and the production domain to the Retell public key's allowed domains; Retell credits; Gemini billing if it failed (image models are not on the free tier: pay-as-you-go API billing, not a Google AI subscription); renaming generic Cal.com event types (the name shows in confirmation emails); rotating keys pasted in chat.

## Working with this user (preferences learned)
- Use REAL objects: the business's own photos and products, or real licensed 3D models, before anything generated or built in code (and say when you had to fall back).
- The hero is always cinematic and immersive, and the themed symbol must relate to what the business actually does.
- Keep animations tasteful: one drip, not a loop of drips; light catching an object ("like the sun hitting it") is a welcome touch.
- After each change: push, wait for the live build, check it on the live URL, and update the artifact preview. Give links grouped by business type with a one-line description each when asked for "all the links".
- Fixed UI must never cover in-page buttons: hide the header and the voice pop-up while a pinned stage fills the screen, and let taps pass through the launcher's wrapper.

## Template revamp (existing talking site + new template zip)
Throw away the old UI and rebuild on the new template's design. Keep everything that isn't design: `lib/business.ts`, photos, copy rules, SEO, tel links, `voice-assistant.tsx`, mic handling, `.env`, `retell/` (do **not** create a new agent). Remap sections, recolor, replace all template copy, re-verify (including that the widget still loads), and republish the artifact preview.
