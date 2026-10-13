---
name: web-design-guidelines
description: Review UI code against Vercel's Web Interface Guidelines (accessibility, focus states, forms, animation, typography, images, performance, touch, theming, copy). Use when asked to "review my UI", "check accessibility", "audit design", "review UX", "check my site against best practices", and as the final check before shipping any site built with ai-talking-website.
---

# Web Interface Guidelines review

Review the given files (or, if none are named, the site's `app/` and `components/` folders) against the rules in
`references/guidelines.md`. That file is a pinned local copy, so the review is the same every time and no rules are
pulled from the internet at run time.

## How to run it

1. Read `references/guidelines.md` in full.
2. Read the files under review.
3. Check every rule. For scroll/3D sites, also confirm that:
   - motion honours `prefers-reduced-motion`;
   - only `transform` and `opacity` animate;
   - fixed UI never covers in-page buttons.
4. Report findings grouped by file in terse `file:line - issue` form, exactly as the guidelines' Output Format
   section describes. Write `✓ pass` for clean files.
5. Fix the findings that are clearly correct. List any you skipped and say why. Some rules don't fit this site
   type, e.g. Title Case when the brand uses uppercase mono labels.

## Updating the pinned rules

To refresh, download
`https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`, read the whole file, and
check that it is still only a list of UI rules. Then replace `references/guidelines.md` with it and commit.
