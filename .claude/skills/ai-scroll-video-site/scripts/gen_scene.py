#!/usr/bin/env python3
"""gen_scene.py out.mp4 "prompt" [first.jpg] [last.jpg]  -> 16:9 720p clip from Gemini Omni Flash (Interactions API).
Two images = first/last-frame interpolation; one image = starts on it; none = text-to-video. Synchronous (1-4 min)."""
import base64, json, os, sys, urllib.request, urllib.error
key=os.environ["GEMINI_API_KEY"]
out, prompt = sys.argv[1], sys.argv[2]
inp=[{"type":"image","data":base64.b64encode(open(p,'rb').read()).decode(),"mime_type":"image/jpeg"} for p in sys.argv[3:]]
inp.append({"type":"text","text":prompt})
body={"model":"gemini-omni-1.1-flash","input":inp,"response_format":{"type":"video","aspect_ratio":"16:9","resolution":"720p"}}
req=urllib.request.Request("https://generativelanguage.googleapis.com/v1beta/interactions",data=json.dumps(body).encode(),method="POST",
    headers={"x-goog-api-key":key,"Content-Type":"application/json","User-Agent":"site-builder/1.0"})
try:
    with urllib.request.urlopen(req,timeout=900) as r: d=json.load(r)
except urllib.error.HTTPError as e: sys.exit(f"{out}: {e.code} {e.read().decode()[:500]}")
for st in d.get("steps",[]):
    for c in st.get("content",[]) or []:
        if c.get("type")=="video" and c.get("data"):
            open(out,'wb').write(base64.b64decode(c["data"])); print("wrote",out, d.get("status")); sys.exit(0)
sys.exit(f"{out}: no video: {json.dumps(d)[:600]}")
