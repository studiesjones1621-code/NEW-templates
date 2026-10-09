#!/usr/bin/env python3
"""Edit a REAL business photo with Gemini (keeps their room, branding, angle) — e.g. turn the shop's chair
into a pilot seat for a business called "First Class Cutz".

Usage (from the project root, GEMINI_API_KEY in .env):
  python3 edit_photo.py <input.jpg> <output.jpg> "<edit instructions>" [--aspect 16:9]

Tips that made the difference in practice:
- Describe what must STAY exactly as it is (room, camera angle, logo/lettering spelled out letter for letter)
  as carefully as what changes. Name objects that must not cover branding ("straps run along the outer
  edges, never crossing the cape").
- Generate, LOOK at the result, then iterate. Expect 2–4 tries. When one result has the right object but a
  small flaw, feed THAT output back in with a narrow "keep everything, change only X" instruction instead of
  regenerating from the original (fresh generations tend to break something else).
- Finish with the brand's grade ("deep black with warm metallic gold highlights") so it matches the palette.
"""
import base64, json, os, pathlib, sys, urllib.error, urllib.request

ROOT = pathlib.Path.cwd()
for line in (ROOT / ".env").read_text().splitlines():
    if "=" in line and not line.lstrip().startswith("#"):
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip())

if len(sys.argv) < 4:
    sys.exit(__doc__)
src, dest, prompt = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2]), sys.argv[3]
aspect = sys.argv[sys.argv.index("--aspect") + 1] if "--aspect" in sys.argv else "16:9"
mime = "image/png" if src.suffix.lower() == ".png" else "image/jpeg"

body = {
    "contents": [{"parts": [
        {"inlineData": {"mimeType": mime, "data": base64.b64encode(src.read_bytes()).decode()}},
        {"text": prompt + " Photorealistic. No extra text, no watermarks."},
    ]}],
    "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": aspect}},
}
for model in ["gemini-3.1-flash-image", "gemini-3-pro-image", "gemini-2.5-flash-image"]:
    req = urllib.request.Request(
        f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
        data=json.dumps(body).encode(), method="POST",
        headers={"x-goog-api-key": os.environ["GEMINI_API_KEY"], "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=240) as r:
            parts = json.load(r)["candidates"][0]["content"]["parts"]
    except urllib.error.HTTPError as e:
        msg = e.read().decode()[:300]
        if "limit: 0" in msg:
            sys.exit(f"Gemini image models need billing on this key (free tier limit is 0): {msg}")
        print(f"{model}: {e.code} {msg}")
        continue
    img = next((p["inlineData"]["data"] for p in parts if "inlineData" in p), None)
    if img:
        dest.write_bytes(base64.b64decode(img))
        print("wrote", dest, "via", model)
        sys.exit(0)
sys.exit("No image generated")
