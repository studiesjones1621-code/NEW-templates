#!/usr/bin/env python3
"""List the Cal.com account's event types and schedule, and optionally set working hours.

Usage:
  CAL_API_KEY=cal_live_... python3 cal_event_types.py
  CAL_API_KEY=... python3 cal_event_types.py --set-hours hours.json

hours.json: [{"days": ["Monday"], "startTime": "10:00", "endTime": "20:00"}, ...]
The agent only offers slots inside the Cal.com schedule, so it must match the business's
real hours. Record the original schedule (printed below) before changing it.
"""
import json, os, sys, urllib.request

KEY = os.environ.get("CAL_API_KEY") or sys.exit("Set CAL_API_KEY")


def call(method, path, version, body=None):
    req = urllib.request.Request("https://api.cal.com/v2" + path, method=method,
                                 data=json.dumps(body).encode() if body else None,
                                 headers={"Authorization": f"Bearer {KEY}", "cal-api-version": version,
                                          "Content-Type": "application/json",
                                          "User-Agent": "Mozilla/5.0 (talking-website-setup)"})  # default urllib UA gets a 403
    with urllib.request.urlopen(req) as r:
        return json.load(r)


me = call("GET", "/me", "2024-06-14")["data"]
print(f"Account: {me['username']} ({me['email']}), timezone {me['timeZone']}, default schedule {me['defaultScheduleId']}")
for e in call("GET", "/event-types", "2024-06-14")["data"]:
    print(f"  event type {e['id']}: {e['title']} ({e['lengthInMinutes']} min){' [hidden]' if e.get('hidden') else ''}")
sched = call("GET", f"/schedules/{me['defaultScheduleId']}", "2024-06-11")["data"]
print("Current schedule:", json.dumps(sched["availability"]))

if "--set-hours" in sys.argv:
    hours = json.load(open(sys.argv[sys.argv.index("--set-hours") + 1]))
    res = call("PATCH", f"/schedules/{me['defaultScheduleId']}", "2024-06-11", {"availability": hours})
    print("Updated schedule:", json.dumps(res["data"]["availability"]))
