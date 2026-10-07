#!/usr/bin/env python3
"""Generate missing key visuals with Gemini image models ("Nano Banana").

Usage (from the project root, GEMINI_API_KEY in .env):
  python3 gen_images.py shots.json public/biz

shots.json: {"style": "Photorealistic editorial photo ... palette ... No text, no logos.",
             "shots": {"gen-hero.jpg": "A ...", "gen-service-x.jpg": "..."}}

Tries models newest-first and skips files that already exist. A 429 with
"generate_content_free_tier_requests, limit: 0" means the key has no billing: image models
are not on the free tier. Don't loop on it; fall back to real photos or a gradient/typographic
treatment and tell the user to enable billing in Google AI Studio.
"""
import base64, json, os, pathlib, sys, urllib.error, urllib.request

ROOT = pathlib.Path.cwd()
for line in (ROOT / ".env").read_text().splitlines():
    if "=" in line and not line.lstrip().startswith("#"):
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip())

MODELS = ["gemini-3.1-flash-image", "gemini-3-pro-image", "gemini-2.5-flash-image"]
cfg = json.loads(pathlib.Path(sys.argv[1]).read_text())
out = pathlib.Path(sys.argv[2]); out.mkdir(parents=True, exist_ok=True)

for name, shot in cfg["shots"].items():
    dest = out / name
    if dest.exists():
        print("skip", name); continue
    body = {"contents": [{"parts": [{"text": f"{shot} {cfg.get('style', '')}"}]}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": cfg.get("aspect", "4:3")}}}
    last = ""
    for model in MODELS:
        req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
                                     data=json.dumps(body).encode(), method="POST",
                                     headers={"x-goog-api-key": os.environ["GEMINI_API_KEY"], "Content-Type": "application/json"})
        try:
            with urllib.request.urlopen(req, timeout=180) as r:
                parts = json.load(r)["candidates"][0]["content"]["parts"]
            img = next((p["inlineData"]["data"] for p in parts if "inlineData" in p), None)
            if img:
                dest.write_bytes(base64.b64decode(img)); print("wrote", dest, "via", model); break
        except urllib.error.HTTPError as e:
            last = f"{e.code} {e.read().decode()[:300]}"
            if "limit: 0" in last:
                sys.exit(f"Gemini image generation needs billing on this key: {last}")
    else:
        print(f"failed {name}: {last}")
