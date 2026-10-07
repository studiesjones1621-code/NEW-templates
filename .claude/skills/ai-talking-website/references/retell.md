# Retell reference (verified October 2026)

Retell changes fast. Before building, skim https://docs.retellai.com/llms.txt and re-check anything below that fails. Fetch `.md` versions of pages (e.g. `https://docs.retellai.com/deploy/chat-widget.md`).

## API basics
- Base `https://api.retellai.com`, header `Authorization: Bearer <RETELL_API_KEY>`.
- `GET /list-agents`, `GET /list-voices`, `POST /create-retell-llm`, `PATCH /update-retell-llm/{id}`, `POST /create-agent`, `PATCH /update-agent/{id}`, `POST /publish-agent/{id}`.
- Publishing makes the current draft the published version and opens a new draft. The widget uses the latest version.
- Default LLM model is fine (omit `model`). `model_temperature: 0.3` keeps facts stable.
- Voices: platform voices (`retell-Leland`, `retell-Nico`, …) are tuned for calls and include TTS fallback. List all with `/list-voices` and match gender/age/accent to the brand.
- Dynamic date variables for prompts: `{{current_time_America/New_York}}` and `{{current_calendar_America/New_York}}` (14-day calendar). Use the business's own timezone.

## Cal.com booking (integration, not legacy tools)
- Legacy `check_availability_cal` / `book_appointment_cal` are rejected since 09/30/2026.
- Create the connection: `POST /create-app` with `{"type":"calendar","provider":"calcom","tenant_url":"cal.com","auth_config":{"type":"api_key","api_key":"cal_live_..."}}`. Provider is `calcom` (not `cal_com`); `tenant_url` must be `cal.com` or `cal.eu`. Then `POST /test-app-auth/{app_id}`.
- Tool templates: `check_calcom_availability`, `book_calcom_appointment` (also list/get/reschedule/cancel bookings).
- `POST /get-app-tool-schema/{app_id}` with `{"app_tool_template_name": ..., "parameters": [...]}` walks the schema step by step. Step 1 returns `event_type_id` (const). Pass it back and step 2 returns the rest. For booking, step 2 has `time, timezone, name, email, notes, guests, attendee_language`. There is no phone field, so put the phone number in `notes`.
- The tool goes in `general_tools` as `{"type":"integration_app","name":...,"app_id":...,"provider":"calcom","app_tool_template_name":...,"parameters":[step1, step2]}`. `scripts/retell_setup.py` builds this.
- Event type IDs: Cal.com API v2 `GET /v2/event-types` (header `cal-api-version: 2024-06-14`). Pick the one closest to the main appointment. Availability comes from the account's schedule (`/v2/schedules/{id}`, `cal-api-version: 2024-06-11`), so set it to the business's real hours. The default is Mon–Fri 9–5. Record the original first.

## Testing without audio
- `POST /agent-playground-completion/{agent_id}` with `{"messages":[{"role":"user","content":"..."}]}` returns agent turns and real tool calls (`scripts/retell_check.py`).
- `402 Credit balance exhausted` means the account has no credits. Web calls fail the same way. Tell the user to top up; you can't fix it.

## Website widget
Script (in `<head>` or via next/script, `id` must be `retell-widget`):
```
https://dashboard.retellai.com/retell-widget-v2.js   type="module"
data-voice-public-key  data-voice-agent-id   -> voice-only (goes straight to call UI)
data-public-key        data-agent-id         -> chat agent
data-title data-bot-name data-logo-url data-theme-color data-component-color data-fab-text
data-show-ai-popup="false" (we render our own prompt)
```
- It mounts `#retell-widget-root` with an **open shadow root**. Useful selectors: `[class*="_fabWrapBase"]` (stock launcher), `button[class*="_fabBase"]` (open), `[class*="_window_"]` (call window open), `button[class*="_startCallButton"]` ("Start to call"), `button[aria-label="Close assistant"]`. Class hashes change; match on the stable prefix.
- **Never auto-press the widget's start button.** Browsers (iPhone Safari especially) only start call audio from a real tap; a scripted click after the async mic check creates the call but it ends `error_user_not_joined`. Open the widget and let the visitor tap start (relabelled "Tap to start talking"). Check `POST /v2/list-calls` for `error_user_not_joined` when users say it doesn't work.
- `assets/components/voice-assistant.tsx` hides the stock launcher, shows a branded one with a delayed prompt, calls `getUserMedia` first (friendly messages for NotFound / NotAllowed / NotReadable), then opens the widget for the visitor to tap start. It wraps `window.fetch` to catch a refused `create-web-call` (401/402) and swaps in a "call us" message. It also catches unhandled mic rejections.
- `POST /v3/create-web-call` errors seen in the browser:
  - `401 Public key is not allowed for this domain`: add `localhost` and the production domain under Public Keys → allowed domains in the dashboard.
  - `402 Credit balance exhausted`: top up.
- Use `strategy="lazyOnload"` on next/script; `afterInteractive` emits a preload with the wrong credentials mode (console warning).
- Headless verification: Playwright with `--use-fake-ui-for-media-stream --use-fake-device-for-media-stream` (mic granted). Omit the fake UI to test denied, and omit the fake device to test no-device. Log responses from `api.retellai.com` to see the create-web-call result.
