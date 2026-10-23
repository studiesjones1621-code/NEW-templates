#!/usr/bin/env python3
"""gen_image.py out.jpg <aspect e.g. 16:9> "prompt" [input.jpg]  -> Gemini image; with input.jpg it edits that image.
Needs GEMINI_API_KEY in the environment (set -a; . ./.env; set +a). Tries gemini-3-pro-image, then gemini-3.1-flash-image."""
import base64, json, os, sys, urllib.request, urllib.error
key=os.environ["GEMINI_API_KEY"]
out, aspect, prompt = sys.argv[1], sys.argv[2], sys.argv[3]
parts=[{"text": prompt}]
if len(sys.argv)>4:
    parts.insert(0, {"inlineData": {"mimeType": "image/jpeg", "data": base64.b64encode(open(sys.argv[4],'rb').read()).decode()}})
body={"contents":[{"parts":parts}],"generationConfig":{"responseModalities":["IMAGE"],"imageConfig":{"aspectRatio":aspect}}}
for model in ["gemini-3-pro-image","gemini-3.1-flash-image"]:
    req=urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",data=json.dumps(body).encode(),method="POST",headers={"x-goog-api-key":key,"Content-Type":"application/json","User-Agent":"site-builder/1.0"})
    try:
        with urllib.request.urlopen(req,timeout=240) as r: ps=json.load(r)["candidates"][0]["content"]["parts"]
        d=next((p["inlineData"]["data"] for p in ps if "inlineData" in p),None)
        if d:
            open(out,'wb').write(base64.b64decode(d)); print("wrote",out,model); break
    except urllib.error.HTTPError as e: print(model,e.code,e.read().decode()[:200])
else: sys.exit("failed "+out)
