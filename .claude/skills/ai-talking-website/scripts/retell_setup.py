#!/usr/bin/env python3
"""Create or update the Retell voice agent (LLM + agent + optional Cal.com booking) and publish it.

Usage (from the project root):
  python3 <skill>/scripts/retell_setup.py retell/agent.json

Reads secrets from ./.env (RETELL_API_KEY, CAL_API_KEY). Idempotent: IDs are stored in
retell/ids.json, so re-running updates the SAME agent instead of making a new one. Writes
NEXT_PUBLIC_RETELL_AGENT_ID into .env.

retell/agent.json:
{
  "agent_name": "Acme Dental - Website Assistant",
  "prompt_file": "retell/system-prompt.md",
  "begin_message": "Hi, thanks for calling Acme Dental! ...",
  "voice_id": "retell-Leland",            # platform voices have built-in TTS fallback
  "timezone": "America/New_York",
  "cal_event_type_id": "7384212",         # omit or null -> lead-capture mode (no booking tools)
  "boosted_keywords": ["Acme", "Invisalign"]
}

Cal.com notes (as of Oct 2026): the legacy tool types check_availability_cal /
book_appointment_cal are rejected by the API since 09/30/2026. Booking uses the Cal.com
integration: a workspace "App" (provider "calcom", tenant_url "cal.com") plus general_tools
of type "integration_app" with templates check_calcom_availability / book_calcom_appointment.
The book tool's parameters are a two-step list: [{event_type_id const}, {time, timezone, name, email, notes}].
"""
import json, os, pathlib, re, sys, urllib.error, urllib.request

ROOT = pathlib.Path.cwd()
for line in (ROOT / ".env").read_text().splitlines():
    if "=" in line and not line.lstrip().startswith("#"):
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip())

cfg = json.loads(pathlib.Path(sys.argv[1]).read_text()) if len(sys.argv) > 1 else sys.exit(__doc__)
API, KEY = "https://api.retellai.com", os.environ["RETELL_API_KEY"]
IDS = ROOT / "retell" / "ids.json"
ids = json.loads(IDS.read_text()) if IDS.exists() else {}
tz = cfg.get("timezone", "America/New_York")
event_id = cfg.get("cal_event_type_id")


def call(method, path, body=None):
    req = urllib.request.Request(API + path, method=method, data=json.dumps(body).encode() if body is not None else None,
                                 headers={"Authorization": f"Bearer {KEY}", "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req) as r:
            raw = r.read()
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        sys.exit(f"{method} {path} -> {e.code}: {e.read().decode()}")


tools = [{"type": "end_call", "name": "end_call", "description": "End the call when the caller is done or says goodbye."}]

if event_id:
    if "app_id" not in ids:
        ids["app_id"] = call("POST", "/create-app", {
            "type": "calendar", "provider": "calcom", "name": f"Cal.com - {cfg['agent_name']}", "tenant_url": "cal.com",
            "auth_config": {"type": "api_key", "api_key": os.environ["CAL_API_KEY"]},
        })["app_id"]
        call("POST", f"/test-app-auth/{ids['app_id']}")
    iso = "local {tz} time, ISO 8601 (YYYY-MM-DDTHH:MM:SS), not converted to UTC".format(tz=tz)
    ev = {"event_type_id": {"type": "string", "const": str(event_id)}}
    tools += [
        {"type": "integration_app", "name": "check_calcom_availability", "app_id": ids["app_id"], "provider": "calcom",
         "app_tool_template_name": "check_calcom_availability",
         "description": "Check open appointment times on the calendar for a time window.",
         "parameters": [{"type": "object", "properties": {**ev,
             "start_time": {"type": "string", "description": f"Start of the window, {iso}."},
             "end_time": {"type": "string", "description": f"End of the window, {iso}."},
             "timezone": {"type": "string", "description": f"Always {tz}."}},
             "required": ["event_type_id", "start_time", "end_time", "timezone"]}],
         "speak_during_execution": True, "execution_message_type": "static_text",
         "execution_message_description": "One sec, let me check the calendar."},
        {"type": "integration_app", "name": "book_calcom_appointment", "app_id": ids["app_id"], "provider": "calcom",
         "app_tool_template_name": "book_calcom_appointment",
         "description": "Book the appointment once the caller confirmed the time and gave name, phone and email.",
         "parameters": [{"type": "object", "properties": ev, "required": ["event_type_id"]},
                        {"type": "object", "properties": {
                            "time": {"type": "string", "description": f"The confirmed time, {iso}."},
                            "timezone": {"type": "string", "description": f"Always {tz}."},
                            "name": {"type": "string", "description": "Caller's full name."},
                            "email": {"type": "string", "description": "Caller's confirmed email address."},
                            "notes": {"type": "string", "description": "Service requested and the caller's phone number."}},
                         "required": ["time", "timezone", "name", "email"]}],
         "speak_during_execution": True, "execution_message_type": "static_text",
         "execution_message_description": "Perfect, locking that in now."},
    ]

llm_body = {"general_prompt": (ROOT / cfg["prompt_file"]).read_text(), "general_tools": tools,
            "start_speaker": "agent", "begin_message": cfg["begin_message"], "model_temperature": 0.3}
if "llm_id" in ids:
    call("PATCH", f"/update-retell-llm/{ids['llm_id']}", llm_body)
else:
    ids["llm_id"] = call("POST", "/create-retell-llm", llm_body)["llm_id"]

agent_body = {"response_engine": {"type": "retell-llm", "llm_id": ids["llm_id"]}, "agent_name": cfg["agent_name"],
              "voice_id": cfg.get("voice_id", "retell-Leland"), "language": "en-US", "timezone": tz,
              "interruption_sensitivity": 0.9, "enable_backchannel": True, "end_call_after_silence_ms": 60000,
              "max_call_duration_ms": 900000, "boosted_keywords": cfg.get("boosted_keywords", [])}
if "agent_id" in ids:
    call("PATCH", f"/update-agent/{ids['agent_id']}", agent_body)
else:
    ids["agent_id"] = call("POST", "/create-agent", agent_body)["agent_id"]
call("POST", f"/publish-agent/{ids['agent_id']}")

IDS.parent.mkdir(exist_ok=True)
IDS.write_text(json.dumps(ids, indent=2) + "\n")
env = (ROOT / ".env").read_text()
line = f"NEXT_PUBLIC_RETELL_AGENT_ID={ids['agent_id']}"
env = re.sub(r"^NEXT_PUBLIC_RETELL_AGENT_ID=.*$", line, env, flags=re.M) if "NEXT_PUBLIC_RETELL_AGENT_ID=" in env else env.rstrip() + "\n" + line + "\n"
(ROOT / ".env").write_text(env)
print(json.dumps(ids, indent=2))
