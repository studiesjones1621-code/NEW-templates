"""Generate missing service visuals with Gemini (Nano Banana). Usage: python3 scripts/gen-images.py"""
import base64, json, os, pathlib, sys, urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
for line in (ROOT / ".env").read_text().splitlines():
    if "=" in line and not line.startswith("#"):
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip())

MODEL = "gemini-3.1-flash-image"
STYLE = ("Photorealistic editorial photograph, shot on 50mm, shallow depth of field, moody low-key lighting, "
         "deep black background with warm metallic gold accents and brass highlights, premium modern barbershop. "
         "No text, no logos, no watermarks.")
SHOTS = {
    "gen-first-class-hot-towel.jpg": "A Black man reclining in a black leather barber chair receiving a luxury hot towel treatment, steam rising softly, barber's hands placing a folded white towel, fresh sharp fade visible.",
    "gen-platinum-color.jpg": "Side profile of a young Black man with a fresh platinum blonde bleached low fade and crisp line-up, sitting in a barber chair wearing a black cape.",
    "gen-signature-beard.jpg": "Close-up of a barber applying beard oil and shaping a full, well-groomed beard on a Black man with a straight razor line, warm golden rim light.",
}

out_dir = ROOT / "public" / "biz"
for name, shot in SHOTS.items():
    dest = out_dir / name
    if dest.exists():
        print("skip", name); continue
    body = {"contents": [{"parts": [{"text": f"{shot} {STYLE}"}]}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "4:3"}}}
    req = urllib.request.Request(
        f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent",
        data=json.dumps(body).encode(), method="POST",
        headers={"x-goog-api-key": os.environ["GEMINI_API_KEY"], "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=180) as r:
            data = json.load(r)
    except urllib.error.HTTPError as e:
        sys.exit(f"{name}: {e.code} {e.read().decode()[:400]}")
    parts = data["candidates"][0]["content"]["parts"]
    img = next((p["inlineData"]["data"] for p in parts if "inlineData" in p), None)
    if not img:
        sys.exit(f"{name}: no image returned: {json.dumps(data)[:400]}")
    dest.write_bytes(base64.b64decode(img))
    print("wrote", dest)
