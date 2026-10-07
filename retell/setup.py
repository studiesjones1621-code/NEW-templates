"""Create (or update) the Retell LLM + voice agent for First Class Cutz by Reem.

Usage:  python3 retell/setup.py            # reads secrets from .env
Writes the resulting IDs to retell/ids.json and NEXT_PUBLIC_RETELL_AGENT_ID into .env/.env.local.
"""
import json, os, pathlib, re, urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
for line in (ROOT / ".env").read_text().splitlines():
    if "=" in line and not line.startswith("#"):
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip())

API = "https://api.retellai.com"
KEY = os.environ["RETELL_API_KEY"]
CAL_EVENT_TYPE_ID = "7384212"  # Cal.com "30 min meeting" event type
IDS_FILE = ROOT / "retell" / "ids.json"
ids = json.loads(IDS_FILE.read_text()) if IDS_FILE.exists() else {}


def call(method, path, body=None):
    req = urllib.request.Request(
        API + path, method=method,
        data=json.dumps(body).encode() if body is not None else None,
        headers={"Authorization": f"Bearer {KEY}", "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req) as r:
            raw = r.read()
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        raise SystemExit(f"{method} {path} -> {e.code}: {e.read().decode()}")


# 1. Cal.com connection (workspace-level App)
if "app_id" not in ids:
    app = call("POST", "/create-app", {
        "type": "calendar", "provider": "calcom", "name": "Cal.com - First Class Cutz",
        "tenant_url": "cal.com",
        "auth_config": {"type": "api_key", "api_key": os.environ["CAL_API_KEY"]},
    })
    ids["app_id"] = app["app_id"]
app_id = ids["app_id"]

event_param = {"type": "object", "properties": {"event_type_id": {"type": "string", "const": CAL_EVENT_TYPE_ID}},
               "required": ["event_type_id"]}

tools = [
    {"type": "end_call", "name": "end_call", "description": "End the call when the caller is done or says goodbye."},
    {
        "type": "integration_app", "name": "check_calcom_availability", "app_id": app_id, "provider": "calcom",
        "app_tool_template_name": "check_calcom_availability",
        "description": "Check Reem's open appointment times on the calendar for a time window.",
        "parameters": [{
            "type": "object",
            "properties": {
                "event_type_id": {"type": "string", "const": CAL_EVENT_TYPE_ID},
                "start_time": {"type": "string", "description": "Start of the window, local Eastern time, ISO 8601 (YYYY-MM-DDTHH:MM:SS), not converted to UTC."},
                "end_time": {"type": "string", "description": "End of the window, local Eastern time, ISO 8601 (YYYY-MM-DDTHH:MM:SS), not converted to UTC."},
                "timezone": {"type": "string", "description": "Always America/New_York."},
            },
            "required": ["event_type_id", "start_time", "end_time", "timezone"],
        }],
        "speak_during_execution": True, "execution_message_type": "static_text",
        "execution_message_description": "One sec, let me check Reem's book.",
    },
    {
        "type": "integration_app", "name": "book_calcom_appointment", "app_id": app_id, "provider": "calcom",
        "app_tool_template_name": "book_calcom_appointment",
        "description": "Book the appointment once the caller has confirmed the time and given name, phone and email.",
        "parameters": [event_param, {
            "type": "object",
            "properties": {
                "time": {"type": "string", "description": "The confirmed time, local Eastern time, ISO 8601 (YYYY-MM-DDTHH:MM:SS), not converted to UTC."},
                "timezone": {"type": "string", "description": "Always America/New_York."},
                "name": {"type": "string", "description": "Caller's full name."},
                "email": {"type": "string", "description": "Caller's confirmed email address."},
                "notes": {"type": "string", "description": "Service requested and the caller's phone number, e.g. 'Service: Business Class Experience. Phone: 410-555-0199.'"},
            },
            "required": ["time", "timezone", "name", "email"],
        }],
        "speak_during_execution": True, "execution_message_type": "static_text",
        "execution_message_description": "Perfect, locking that in now.",
    },
]

llm_body = {
    "general_prompt": (ROOT / "retell" / "system-prompt.md").read_text(),
    "general_tools": tools,
    "start_speaker": "agent",
    "begin_message": "Hey, welcome to First Class Cutz by Reem! I can answer questions or get you booked in the chair. What can I do for you?",
    "model_temperature": 0.3,
}
if "llm_id" in ids:
    llm = call("PATCH", f"/update-retell-llm/{ids['llm_id']}", llm_body)
else:
    llm = call("POST", "/create-retell-llm", llm_body)
    ids["llm_id"] = llm["llm_id"]

agent_body = {
    "response_engine": {"type": "retell-llm", "llm_id": ids["llm_id"]},
    "agent_name": "First Class Cutz by Reem - Website Assistant",
    "voice_id": "retell-Leland",
    "language": "en-US",
    "timezone": "America/New_York",
    "interruption_sensitivity": 0.9,
    "enable_backchannel": True,
    "end_call_after_silence_ms": 60000,
    "max_call_duration_ms": 900000,
    "boosted_keywords": ["Reem", "Kareem", "First Class Cutz", "Reisterstown", "taper", "fade", "line-up", "retwist", "locs"],
}
if "agent_id" in ids:
    agent = call("PATCH", f"/update-agent/{ids['agent_id']}", agent_body)
else:
    agent = call("POST", "/create-agent", agent_body)
    ids["agent_id"] = agent["agent_id"]

# Publish so the widget (which uses the latest published version) picks it up
call("POST", f"/publish-agent/{ids['agent_id']}")

IDS_FILE.write_text(json.dumps(ids, indent=2) + "\n")
for name in (".env",):
    p = ROOT / name
    if p.exists():
        t = p.read_text()
        t = re.sub(r"^NEXT_PUBLIC_RETELL_AGENT_ID=.*$", f"NEXT_PUBLIC_RETELL_AGENT_ID={ids['agent_id']}", t, flags=re.M)
        p.write_text(t)
print(json.dumps(ids, indent=2))
