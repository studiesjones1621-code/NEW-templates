# First Class Cutz by Reem — AI talking website

One-page site for First Class Cutz by Reem (barbershop, 6524 Reisterstown Rd #123, Baltimore, MD), built on the Hously template (Next.js 16 + Tailwind 4) with an embedded Retell AI voice assistant that answers questions and books real appointments through Cal.com.

## Run locally

```bash
cp .env.example .env   # fill in keys (already present in your local .env)
npm install
npm run dev            # http://localhost:3000
```

## Voice agent

- Retell agent: `agent_1974dcab1a2cfdd5777470101b` (LLM `llm_2667eba9b2c03b6e2b3f9ebee378`, voice `retell-Leland`)
- Booking: Retell Cal.com integration (`app_823116af07261b8329842c35`) → Cal.com event type `7384212` ("30 min meeting")
- Prompt: `retell/system-prompt.md`. After editing, run `python3 .claude/skills/ai-talking-website/scripts/retell_setup.py retell/agent.json` to update and republish the same agent (IDs live in `retell/ids.json`).
- Widget: `components/voice-assistant.tsx` loads Retell's `retell-widget-v2.js`, hides its stock button, and drives it from the branded "Talk to us" launcher after a microphone check.

## Images

Real photos from the studio's Booksy profile live in `public/biz/`. `scripts/gen-images.py` can generate extra visuals with Gemini once the Gemini key has billing enabled.
