#!/usr/bin/env bash
# Start a new product-showcase site from the template.
# Usage (from the repo root): bash .claude/skills/product-showcase-site/scripts/new_site.sh <slug>
# Creates sites/<slug> from the newest template (sites/lattice in this repo when present, else the bundled copy),
# without node_modules, build output or any .env file, then installs dependencies.
set -euo pipefail
slug="${1:?usage: new_site.sh <slug>}"
case "$slug" in *[!a-z0-9-]*) echo "slug must be lowercase letters, digits and dashes" >&2; exit 1 ;; esac
here="$(cd "$(dirname "$0")/.." && pwd)"
dest="sites/$slug"
[ -e "$dest" ] && { echo "$dest already exists" >&2; exit 1; }
src="$here/assets/template"
[ -f sites/lattice/lib/brand.ts ] && src="sites/lattice"
mkdir -p "$dest"
tar -C "$src" -cf - --exclude=node_modules --exclude=.next --exclude='.env*' --exclude='*.tsbuildinfo' \
  --exclude=next-env.d.ts --exclude=.vercel . | tar -xf - -C "$dest"
sed -i "s/\"name\": \"lattice-template\"/\"name\": \"$slug\"/" "$dest/package.json"
(cd "$dest" && npm install --no-audit --no-fund)
echo "Created $dest from $src. Next: edit $dest/lib/brand.ts and replace $dest/public/img."
