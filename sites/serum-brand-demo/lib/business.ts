// Saffra Skin is a FICTIONAL brand: this site is a concept template for skincare and beauty product brands.
// The brand, product, prices and phone number are made up (555 numbers are reserved for fiction). Ingredient
// notes are general cosmetic information, written conservatively; they are not medical claims.

export const business = {
  name: "Saffra",
  fullName: "Saffra Skin",
  type: "Skincare",
  tagline: "Golden hour, in a bottle.",
  phoneDisplay: "(555) 010-0148",
  phoneHref: "tel:+15550100148",
  email: "hello@saffra.example",
  city: "Springfield",
  hours: "Advisor answers 24/7 · Orders ship Mon–Fri",
  demoNote: "Concept template · fictional brand",
} as const

export const product = {
  name: "Golden Hour Serum",
  short: "Vitamin C + sea buckthorn brightening serum",
  photo: "/biz/bottle.jpg",
  sizes: [
    { id: "15", label: "15 ml", price: 34 },
    { id: "30", label: "30 ml", price: 58 },
  ],
  subscribeOff: 0.15,
  freeShipping: 50,
  highlights: ["15% stabilized vitamin C", "Cold-pressed sea buckthorn oil", "Saffron extract", "Fragrance-free · vegan"],
} as const

export type SizeId = (typeof product.sizes)[number]["id"]

export const stats = [
  { value: "15%", label: "stabilized vitamin C" },
  { value: "3", label: "drops, morning and night" },
  { value: "0", label: "added fragrance" },
  { value: "Amber", label: "glass that blocks light" },
] as const

/** Ingredient explorer. General cosmetic information, kept conservative. */
export const ingredients = [
  {
    id: "vitc",
    name: "Vitamin C",
    role: "Brightens",
    headline: "The bright-looking one.",
    body: "An antioxidant that helps protect skin from everyday environmental stress and, used consistently, helps even the look of dull skin and dark spots.",
    tip: "Vitamin C is light-sensitive, so it lives in amber glass. A slight deepening of color over time is normal.",
  },
  {
    id: "buckthorn",
    name: "Sea buckthorn",
    role: "Nourishes",
    headline: "The orange in the bottle.",
    body: "A cold-pressed berry oil rich in fatty acids and carotenoids. It gives the serum its golden color and leaves skin feeling soft, not greasy.",
    tip: "Its natural color can tint the drop, then disappears as it sinks in.",
  },
  {
    id: "saffron",
    name: "Saffron",
    role: "Glows",
    headline: "Where the name comes from.",
    body: "Saffron flower extract is a traditional radiance ingredient. Here it backs up vitamin C for a warm, healthy-looking glow.",
    tip: "We use an extract, not the spice threads, so there's no staining.",
  },
  {
    id: "ha",
    name: "Hyaluronic acid",
    role: "Hydrates",
    headline: "The bounce.",
    body: "Holds water in the top layers of skin so it looks plumper and feels comfortable, which helps vitamin C feel gentle.",
    tip: "Apply to slightly damp skin for the most hydration.",
  },
] as const

export const skinTypes = [
  { id: "dry", label: "Dry", note: "Follow with a richer cream and press, don't rub." },
  { id: "oily", label: "Oily", note: "Two drops is plenty; follow with a light gel moisturizer." },
  { id: "combo", label: "Combination", note: "Focus drops on dull or uneven areas, lighter on the T-zone." },
  { id: "sensitive", label: "Sensitive", note: "Patch test first and start every other day for the first two weeks." },
] as const

export type SkinTypeId = (typeof skinTypes)[number]["id"]

export const faqs = [
  {
    q: "When will I see a difference?",
    a: "Skin feels softer right away. Brightness and evenness build with daily use over several weeks, and results vary from person to person.",
  },
  { q: "Morning or night?", a: "Both work. In the morning, always follow with sunscreen: it protects your skin and the results you're working toward." },
  { q: "Can I use it with retinol?", a: "Yes, at different times: Golden Hour in the morning, retinol at night. If your skin feels tight, alternate nights." },
  { q: "Why is the serum orange?", a: "That's the sea buckthorn oil. It's natural color, and it sinks in clear." },
  { q: "Is it okay during pregnancy or with a skin condition?", a: "Check with your doctor or dermatologist first. Our advisor can share the full ingredient list for them." },
] as const
