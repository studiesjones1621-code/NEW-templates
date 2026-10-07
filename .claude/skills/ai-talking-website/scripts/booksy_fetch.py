#!/usr/bin/env python3
"""Pull a business's real details, reviews and photos from Booksy.

Booksy pages are a JS app, so scraping the HTML gets nothing. Its public customer API
returns everything as JSON.

Usage:
  python3 booksy_fetch.py <booksy-url-or-id> <out-dir>

Writes:
  <out-dir>/business.json   name, description, phone (if any), address, geo, hours, rating,
                            services (name/price/duration/description), staff, amenities,
                            policies, instagram, booksy url
  <out-dir>/reviews.json    all reviews (rank, first name, date, text, services)
  <out-dir>/photos/*.jpg    every photo (cover, logo, gallery, inspiration, staff), resized to <=1600px

Phone numbers are often missing from the API but appear inside service descriptions
("call/txt 667-495-8877") — the script scans for them and reports what it found.
Hours: Booksy day_of_week 0 = Sunday (verified against the page's schema.org data).
"""
import json, os, re, subprocess, sys, urllib.request

API_KEY = "web-e3d812bf-d7a2-445d-ab38-55589ae6a121"  # Booksy's public web-client key
BASE = "https://us.booksy.com/api/us/2/customer_api"
DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]


def get(url):
    req = urllib.request.Request(url, headers={"X-Api-Key": API_KEY, "Accept-Language": "en-US", "User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r)


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    m = re.search(r"(?:widget/|/)(\d{4,})(?:[_/?]|$)", sys.argv[1]) or re.fullmatch(r"(\d+)", sys.argv[1])
    if not m:
        sys.exit("Could not find a Booksy business id in that URL")
    biz_id, out = m.group(1), sys.argv[2]
    os.makedirs(os.path.join(out, "photos"), exist_ok=True)

    b = get(f"{BASE}/businesses/{biz_id}/")["business"]
    reviews = get(f"{BASE}/businesses/{biz_id}/reviews/?reviews_page=1&reviews_per_page=100").get("reviews", [])

    services = []
    for cat in b.get("service_categories", []):
        for s in cat.get("services", []):
            v = (s.get("variants") or [{}])[0]
            services.append({
                "category": cat.get("name") or "",
                "name": s.get("name"),
                "price": v.get("price"),
                "price_label": v.get("label") or "",
                "duration_min": v.get("duration"),
                "description": (s.get("description") or "").strip(),
            })

    text_blob = " ".join(x["description"] for x in services) + " " + (b.get("description") or "")
    phones = sorted(set(re.findall(r"\(?\b\d{3}\)?[-. ]?\d{3}[-. ]\d{4}\b", text_blob)))

    data = {
        "id": b["id"],
        "name": b["name"],
        "contact_name": b.get("contact_name"),
        "category": [c["name"] for c in b.get("business_categories", [])],
        "description": b.get("description"),
        "phone": b.get("phone"),
        "phones_found_in_text": phones,
        "location": b.get("location"),
        "regions": [r["full_name"] for r in b.get("regions", [])],
        "hours": [{"day": DAYS[h["day_of_week"]], "open": h["open_from"], "close": h["open_till"]} for h in b.get("open_hours", [])],
        "rating": b.get("reviews_rank"),
        "review_count": b.get("reviews_count"),
        "services": services,
        "staff": [{"name": s.get("name"), "photo": s.get("photo_url")} for s in b.get("staff", [])],
        "amenities": [a.get("label") for a in b.get("amenities", [])],
        "booking_policy": b.get("booking_policy"),
        "deposit_policy": b.get("deposit_policy"),
        "instagram": b.get("instagram_link"),
        "facebook": b.get("facebook_link"),
        "website": b.get("website"),
        "booksy_url": f"https://booksy.com/en-us/{b.get('url')}",
    }
    json.dump(data, open(os.path.join(out, "business.json"), "w"), indent=2, ensure_ascii=False)
    json.dump([{"rank": r.get("rank"), "name": (r.get("user") or {}).get("first_name"), "date": (r.get("created") or "")[:10],
                "text": r.get("review"), "services": [s.get("name") for s in r.get("services", [])]} for r in reviews],
              open(os.path.join(out, "reviews.json"), "w"), indent=2, ensure_ascii=False)

    urls = []
    for kind, imgs in (b.get("images") or {}).items():
        if isinstance(imgs, list):
            urls += [(kind, i["image"]) for i in imgs if isinstance(i, dict) and i.get("image")]
    urls += [("staff", s["photo"]) for s in data["staff"] if s.get("photo")]
    for n, (kind, url) in enumerate(urls, 1):
        dest = os.path.join(out, "photos", f"{kind}-{n:02d}.jpg")
        urllib.request.urlretrieve(url, dest)
        subprocess.run(["convert", dest, "-resize", "1600x1600>", "-strip", "-quality", "82", dest], check=False)

    print(f"{data['name']}: {len(services)} services, {len(reviews)} reviews, {len(urls)} photos, phones in text: {phones}")


if __name__ == "__main__":
    main()
