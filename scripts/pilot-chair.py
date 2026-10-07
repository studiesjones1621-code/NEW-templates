"""Edit the real studio chair photo into a pilot seat with Gemini. Usage: python3 scripts/pilot-chair.py"""
import base64, json, os, pathlib, sys, urllib.error, urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
for line in (ROOT / ".env").read_text().splitlines():
    if "=" in line and not line.startswith("#"):
        k, v = line.split("=", 1)
        os.environ.setdefault(k.strip(), v.strip())

SRC = ROOT / "public" / "biz" / "studio-chair-cape.jpg"
DEST = ROOT / "public" / "biz" / "pilot-chair.jpg"
PROMPT = (
    "Edit this photo of a barbershop chair. Turn the chair into an unmistakable airplane cockpit pilot seat: "
    "high padded black leather backrest with a headrest, side bolsters, a five-point harness with brushed-gold buckles, "
    "and aviation-style armrests. Keep the black barber cape draped over it exactly as it is, with the gold "
    "'First Class Cutz by Reem' script, crown and stars still clearly readable. Hang a classic airline captain's hat "
    "on the headrest: black with a gold braid band on the visor and a gold pilot-wings badge. Keep the same room, "
    "camera angle and floor. Color grade: deep black with warm metallic gold highlights and soft moody light, "
    "matching a black-and-gold luxury brand. Photorealistic. No extra text, no watermarks."
)
MODELS = ["gemini-3.1-flash-image", "gemini-3-pro-image", "gemini-2.5-flash-image"]

body = {
    "contents": [{"parts": [
        {"inlineData": {"mimeType": "image/jpeg", "data": base64.b64encode(SRC.read_bytes()).decode()}},
        {"text": PROMPT},
    ]}],
    "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9"}},
}
for model in MODELS:
    req = urllib.request.Request(
        f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
        data=json.dumps(body).encode(), method="POST",
        headers={"x-goog-api-key": os.environ["GEMINI_API_KEY"], "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=240) as r:
            parts = json.load(r)["candidates"][0]["content"]["parts"]
    except urllib.error.HTTPError as e:
        print(f"{model}: {e.code} {e.read().decode()[:200]}")
        continue
    img = next((p["inlineData"]["data"] for p in parts if "inlineData" in p), None)
    if img:
        DEST.write_bytes(base64.b64decode(img))
        print("wrote", DEST, "via", model)
        sys.exit(0)
sys.exit("No image generated")
