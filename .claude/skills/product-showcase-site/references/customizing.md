# Customizing the Lattice template

## Cut-outs (the product images)

Every product image is a **transparent WebP**:
- front view, centred, about 1100 × 1100 px;
- the product filling ~90% of the width;
- the same framing for every product, so the grid looks like one set.

1. **Real photo** (always try first). Take the client's own product shot from their site, Instagram or supplier sheet, but only with their permission, since it's their product.
   - Clean background: run `python3 -I ../ai-talking-website/scripts/alpha_tools.py key-green <in> <out.webp> --width 1100` on a shot over flat green, or use `soft-black` for light products on black.
   - Busy background: first `edit_photo.py <in> <out> "Keep the product exactly as it is (shape, colour, every logo and stitch). Replace the background with a perfectly flat solid pure green (#00FF00), no shadow. Centre it, front view."`, then key it.
2. **Generated** (only when no usable photo exists). Use `gen_images.py` with a style line like this: "Ultra-detailed 3D product render, studio lighting … front view, perfectly symmetrical … on a perfectly flat solid pure green (#00FF00) chroma-key background, no shadow, no floor. No text, no logos." Then key it.
   - Garments: ask for "sleeves hanging slightly away from the body", so the sleeve hinge can separate them.
   - Colour variants: generate them from one prompt so their shapes match.
3. **Look at every cut-out** composited on the page colour (a contact sheet) before using it.
4. **Never** use another brand's product photos (retail and stock photos are copyrighted).

**Hinges.** For garments set `hinges: true`. The shader expects sleeves outside about 20–31% / 69–80% of the width, below about 10–26% of the height, with shoulders near (0.24, 0.21) and (0.76, 0.21). Adjust `SHOULDER_L/R` and the `smoothstep` bounds in `lib/bend.ts` if a garment's proportions differ (long coats, kimono sleeves). For everything rigid set `hinges: false`: the whole cut-out bends from its top.

**Pivot.** The bend hangs from `COLLAR = (0.5, 0.12)`. Lower it for products that should pivot from the middle (bottles: 0.5, 0.5).

## Slots: where the travelling product sits

Each section has an empty `<div data-slot>` box. The product glides from box to box as you scroll and lingers at each.
- `data-rot="-9"`: tilt in degrees at that slot.
- `data-opacity="0"`: fade out there (used in the 3D section, so the product "becomes" the exploded stack).

Size and place the boxes with CSS (`.hero-slot`, `.specs-slot`, `.details-slot`, `.tech-slot`), with separate rules for phones. A slot box can extend off-screen for a cropped close-up (the "Details matter" zoom).

## 3D layers (`public/layers-scene.js`)

`buildStack()` returns `{ model, parts, shadow }`. Each part:
- is a group with a `base` height and an `off` explode offset;
- has a stagger `delay`;
- has an `anchor` (a local point, on the layer's top surface near the back-right corner, that the pointer line attaches to).

Keep four parts, in the same order as `technology.layers` in `brand.ts`. Textures are drawn on canvases (`canvas2d`), which works both in the worker and on the page. Recipes:

- **Outerwear (shipped):** lacquered shell with water beads (InstancedMesh, transmission on desktop), ripstop (grid texture), quilted insulation (flattened capsules), satin lining.
- **Sneaker:** upper mesh (perforated texture), midsole foam (extruded rounded shape with a sheen), air/gel unit (transmission capsule), rubber outsole (tread texture plus bump).
- **Skincare bottle / serum:** glass shell (transmission), formula liquid (coloured transmission with bubbles), actives (glowing instanced spheres), pump/cap (metal).
- **Device / tool (clippers, trimmers, speakers):** see `public/clipper-scene.js` in the repo root (housing halves, blades, motor, battery) and `sites/beneath-the-skin/public/anatomy-scene.js` (skin layers) for full working examples of the same engine.

Lighting is a dark studio with coloured panels (`studioEnvironment`). Tint the panels to the brand. Flat glossy layers mostly reflect the **overhead** panels, so colour lives there. Avoid strong white panels (they wash colour out) and iridescence (it went yellow-green in tests). Use `specularColor` for tinted lacquer.

## Copy

Short, uppercase, mono, factual: the template's labels decode letter by letter, so 2–6 word lines read best. Use the client's real specs (materials, weights, ratings) and prices from their own site. The "Need to know" rows and the layer facts must be true.

## Verify

```bash
cd sites/<slug> && npx tsc --noEmit && npx next build && npx next start -p 3311 &
node .claude/skills/product-showcase-site/scripts/verify.cjs http://localhost:3311 <scratch>/shots
```

Look at the screenshots, both desktop and phone:
- the hero product is clear of the text;
- the "Need to know" product doesn't cover the title on phones;
- each 3D layer gets a pointer and card;
- the cards and the "Shop now" buttons are visible on touch.

Then run it against the live URL after deploying.
