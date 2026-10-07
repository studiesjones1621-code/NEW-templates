#!/usr/bin/env python3
"""Talk to the agent in text (no audio, no browser) to verify prompt, tools and credits.

Usage (from the project root):  python3 retell_check.py "How much is a haircut, and what's open Friday?"

Uses Retell's stateless agent-playground-completion endpoint. It runs real tool calls, so an
availability lookup hits the live calendar (read-only); never ask it to book unless you mean it.
Common results:
  402 "Credit balance exhausted"         -> the Retell account needs credits; calls will fail too
  tool_call_result with available_slots  -> Cal.com booking is wired correctly
"""
import json, os, pathlib, sys, urllib.error, urllib.request

ROOT = pathlib.Path.cwd()
for line in (ROOT / ".env").read_text().splitlines():
    if "=" in line and not line.lstrip().startswith("#"):
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip())
agent = json.loads((ROOT / "retell" / "ids.json").read_text())["agent_id"]
msg = sys.argv[1] if len(sys.argv) > 1 else "What services do you offer and how much do they cost?"
req = urllib.request.Request(f"https://api.retellai.com/agent-playground-completion/{agent}", method="POST",
                             data=json.dumps({"messages": [{"role": "user", "content": msg}]}).encode(),
                             headers={"Authorization": f"Bearer {os.environ['RETELL_API_KEY']}", "Content-Type": "application/json"})
try:
    with urllib.request.urlopen(req, timeout=120) as r:
        data = json.load(r)
except urllib.error.HTTPError as e:
    sys.exit(f"{e.code}: {e.read().decode()}")
for m in data.get("messages", []):
    body = m.get("content") or m.get("arguments") or ""
    print(f"[{m.get('role')}] {m.get('name', '')} {str(body)[:500]}")
