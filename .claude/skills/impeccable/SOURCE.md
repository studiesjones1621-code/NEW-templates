Adapted from https://github.com/pbakaus/impeccable (.claude/skills/impeccable, v4.5.2, commit 919dbeb), Apache License 2.0, (c) Paul Bakaus. See LICENSE.

Changes in this copy (Apache 2.0 section 4(b) notice):
- Removed `scripts/` (the `impeccable` launcher downloads and executes a platform binary on first run) and the project hooks from `.claude/settings.json`.
- SKILL.md setup step rewritten to read PRODUCT.md / DESIGN.md directly and to perform engine steps by hand; removed the engine-only `live`, `generate`, pin, hooks and doctor commands and their reference files.
- All other reference files are unmodified.
