---
name: ai-talking-website
description: Build a premium one-page website for a local business (barber, salon, dentist, med spa, contractor, restaurant, law office…) with an embedded Retell AI voice agent that answers questions and books real appointments through Cal.com, optionally on top of a template zip, then preview it as a claude.ai artifact and deploy to Vercel. Use this whenever someone pastes a business URL (Booksy, Google, Yelp, their own site) with Retell / Cal.com / Gemini keys, asks for an "AI talking website", "voice agent website", "website with an AI receptionist", wants to rebrand a website template for a local business, or wants to swap a new template onto an existing talking site — even if they don't use those exact words.
---

# AI talking website

You're producing a site that looks like a $3,000 custom build for one real local business, plus a voice agent that is genuinely useful on a call. Work autonomously and use smart defaults. The user expects not to be asked questions mid-build.

Inputs usually arrive as a filled-in form: business URL, Retell API key, Retell public key, Gemini key, Cal.com key. Any field may say SKIP. Put every secret in `.env` (gitignored, with a committed `.env.example`). Never hardcode secrets in site files or commit them. If the user pasted keys into chat, suggest rotating them at the end.

Bundled resources (paths relative to this skill):
- `scripts/booksy_fetch.py`: real details, reviews and photos from a Booksy URL
- `scripts/cal_event_types.py`: list Cal.com event types and schedule, or set working hours
- `scripts/retell_setup.py`: create or update the LLM, agent and Cal.com tools, then publish (idempotent)
- `scripts/retell_check.py`: text-chat the agent to verify prompt, tools and credits
- `scripts/gen_images.py`: Gemini image generation for missing visuals
- `scripts/build_artifact.py`: static export → claude.ai artifact preview
- `assets/components/`: proven components (voice-assistant, talk-button, cinematic hero + CSS, highlighted-text, business.ts example)
- `references/retell.md`: Retell API, Cal.com integration, widget internals, error meanings. Read before Phase 3.
- `references/design.md`: section mapping, copy rules, hero gotchas, verification checklist. Read before Phase 2.

## Phase 1: Research the business

1. **Booksy URL**: run `python3 scripts/booksy_fetch.py <url> <scratch-dir>`. The page is a JS app, so the API is the only reliable source. **Any other site**: fetch the HTML, then look for schema.org JSON-LD (`LocalBusiness`, `openingHoursSpecification`), which is usually the cleanest data.
2. Capture name, services with prices and durations, phone (Booksy often hides it, but the script scans descriptions for it), address and geo, hours, rating, review count, verbatim reviews, amenities, policies and socials. Cross-check hours against the page's schema.org data when available.
3. Look at every photo before using it (montage them into a contact sheet and view it). Label files by content (`reem-cutting.jpg`, `studio-lounge.jpg`). Drop photos with stickers, certificates, or near-duplicates, and resize to ≤1600px. Real photos beat generated ones.
4. Missing fields get professional defaults inferred from the business type. If there's no CTA, pick the obvious one: dental and medical book appointments, contractors get quotes, restaurants reserve tables, salons and barbers book cuts, med spas book consultations.
5. Find the hook in the business's own language (service names, slogans, Instagram bio). It drives the headline and the agent's personality.

## Phase 2: Build the site

**Template zip present**: unzip into the project (inspect it in scratch first), delete foreign lockfiles if they conflict, `npm install`, and fix install issues. Do a full rebrand, not find-and-replace. Map sections per `references/design.md`, delete what doesn't fit, recolor tokens from the logo, and rewrite all copy. Keep the template's signature motion and layout ideas; that's why the user chose it. Delete all template images.

**No template**: Next.js (app router) + Tailwind, built from scratch to the same standard: distinctive Google Fonts pairing, an industry-appropriate palette, generous whitespace, subtle scroll animation, fully responsive.

Either way:
- Put all real data in one `lib/business.ts` (see `assets/components/business.ts`) and import it everywhere.
- Sections: Hero, Services grid, Why Choose Us, Testimonials, Hours & Location (tel: links, Google Maps embed `https://www.google.com/maps?q=<address>&z=15&output=embed`), Footer. A full price menu is a good addition when there are many services.
- CTAs: click-to-call, plus "Talk to our assistant" buttons that dispatch the talk event (`talk-button.tsx`). No booking forms; the agent books.
- SEO: title `Business Name | Business Type in City, ST`, meta description, Open Graph with a 1200×630 image, one h1, LocalBusiness JSON-LD, `metadataBase` from `NEXT_PUBLIC_SITE_URL` or `VERCEL_PROJECT_PRODUCTION_URL`.
- Images: real photos first. If a Gemini key is given, run `gen_images.py` only for slots with no real photo. If it 429s with "limit: 0", the key has no billing; fall back without retrying. Never leave a broken image or placeholder.
- If the user wants it "immersive" or "cinematic", use the bundled cinematic hero (`hero.tsx` + `cinematic-hero.css`) and read its gotchas in design.md.

## Phase 3: Voice agent (Retell)

1. Read `references/retell.md`, then check https://docs.retellai.com/llms.txt for anything newer. The API has changed recently: legacy Cal.com tools are gone.
2. Write `retell/system-prompt.md` for this business. Structure: Identity (named assistant, the business, the owner), Style (voice: 1–2 sentences, one question at a time, prices and numbers spoken naturally), Goal (support first, with a background nudge toward the CTA offered once and never pushed), Business details, Services and prices, the Booking procedure, Boundaries. Include `{{current_time_<TZ>}}` and `{{current_calendar_<TZ>}}` so it knows the date.
3. Booking:
   - **Cal.com key given**: `CAL_API_KEY=… python3 scripts/cal_event_types.py`. Pick the event type closest to the main appointment. Set the schedule to the business's real hours with `--set-hours` (note the original in your summary). The prompt's booking procedure: ask the service → ask the day → check availability for that day → offer 2–3 times within hours → collect name, then phone, then email (spell the email back) → book with the service and phone in notes → confirm and mention the confirmation email. Never claim success unless the tool confirmed it.
   - **Cal.com SKIP**: lead-capture mode. Collect name, phone and preferred time, and say the office will confirm shortly. Omit `cal_event_type_id`.
4. Write `retell/agent.json` and run `python3 <skill>/scripts/retell_setup.py retell/agent.json` from the project root. IDs land in `retell/ids.json`, and re-running updates the same agent. Never create duplicate agents when iterating, and never touch other agents already on the account.
5. Verify with `retell_check.py "<a realistic question + availability ask>"`. A 402 means no credits: report it, since you can't fix it.

## Phase 4: Embed the agent

1. Copy `assets/components/voice-assistant.tsx` and `talk-button.tsx`, and render `<VoiceAssistant />` in the root layout. Customize the bot name, prompt copy and colors (`data-theme-color`, `data-component-color`). It reads `NEXT_PUBLIC_RETELL_PUBLIC_KEY` and `NEXT_PUBLIC_RETELL_AGENT_ID`.
2. What it gives you: a branded floating "Talk to us" launcher, a friendly prompt after 4s, a mic check before any call with friendly messages (mic not found / blocked / busy, each with the phone number), the widget opened and the call auto-started, and a "call us" fallback if Retell refuses the call. Re-verify the widget's shadow-DOM selectors if Retell has shipped a new widget (retell.md).
3. Verify in Playwright: granted, denied and no-device paths, plus the `create-web-call` response. `401 not allowed for this domain` means the user must add domains in the dashboard.

## Phase 5: Verify, preview, deliver

1. Run the checks in `references/design.md` (desktop + mobile screenshots and look at them, errors, overflow, broken images, h1/meta), then `tsc` and `next build`.
2. Commit and push (secrets excluded; grep the staged diff for key prefixes first).
3. **Artifact preview** (the user wants to see it, and in a cloud session they can't open localhost): static export → `scripts/build_artifact.py` → publish with the Artifact tool, including the referenced `biz/` and `brand/` files. A live page beats screenshots. Say plainly that the voice call and live map only work on the deployed site.
4. Final summary, short:
   1. What was built and which real details were used.
   2. Preview: the artifact link, plus localhost if they run it locally.
   3. Vercel steps with no CLI: vercel.com → Add New → Project → import repo (pick the branch) → add env vars `NEXT_PUBLIC_RETELL_PUBLIC_KEY`, `NEXT_PUBLIC_RETELL_AGENT_ID` → Deploy.
   4. Booking mode: real Cal.com booking (which event type, hours change made) or lead capture.
   5. Manual attention: add `localhost` and the production domain to the Retell public key's allowed domains; Retell credits; Gemini billing if it failed; renaming generic Cal.com event types (the name shows in confirmation emails); rotating keys pasted in chat.

## Template revamp (existing talking site + new template zip)
Throw away the old UI and rebuild on the new template's design. Keep everything that isn't design: `lib/business.ts`, photos, copy rules, SEO, tel links, `voice-assistant.tsx`, mic handling, `.env`, `retell/` (do **not** create a new agent). Remap sections, recolor, replace all template copy, re-verify (including that the widget still loads), and republish the artifact preview.
