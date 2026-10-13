// Everything a new client changes lives here: name, copy, products and specs. Swap the images in /public/img to match.
export const brand = {
  name: "NULLFORM",
  tagline: "Technical outerwear",
  description: "Lacquered, insulated outerwear engineered for motion. Oversized fit, limited runs.",
  est: "EST.2024",
  logo: "/img/wings.webp", // small mark beside the name in the header ("" for none)
  nav: [
    { label: "Shop", href: "#collections" },
    { label: "Collections", href: "#collections" },
    { label: "Technology", href: "#technology" },
    { label: "About", href: "#details" },
  ],
}

export const hero = {
  // The travelling product cut-out (transparent WebP, front view, centred, ~1100px square)
  image: "/img/jacket-hero.webp",
  // true for garments with sleeves: the sleeves hinge at the shoulders and swing a beat behind.
  // false for rigid products (clippers, bottles, devices): the whole cut-out sways and bends as one piece.
  hinges: true,
  // Big decorative art behind the hero product (set to "" for none)
  backdrop: "/img/wings.webp",
  left: ["Engineered", "for motion.", "Built to endure."],
  right: ["Designed", "for the unknown.", "Ready for anything."],
  line1: "Weather-resistant. Thermal insulation.",
  line2: "Oversized fit. Limited quantity.",
  cta: "Shop now",
  badgeLeft: ["Built on experience.", "Driven by innovation.", "Focused on you."],
  badgeRight: ["Worldwide shipping", "Fast & secure", "delivery"],
}

export const specs = {
  title: "Need to know.",
  intro: "One jacket, built from four layers and a short list of things that matter when the weather turns.",
  rows: [
    { k: "Shell", v: "3L lacquered nylon, PU coated" },
    { k: "Fill", v: "Recycled synthetic down, 180 g/m²" },
    { k: "Rating", v: "20,000 mm water column" },
    { k: "Weight", v: "1.1 kg (size M)" },
    { k: "Fit", v: "Oversized, cropped at the hip" },
    { k: "Range", v: "−15 °C to 10 °C" },
  ],
}

export const details = {
  title: "Details matter.",
  intro: "Every seam is there for a reason. Nothing decorative, nothing extra.",
  items: [
    { n: "01", title: "Storm collar", body: "A tall funnel neck that zips to the chin and blocks the wind." },
    { n: "02", title: "Two-way zip", body: "Open from the hem to sit, cycle or move without the jacket riding up." },
    { n: "03", title: "Cargo chest pockets", body: "Fleece-lined, with storm flaps that keep a phone dry." },
    { n: "04", title: "Thermal-lock cuffs", body: "Wide inner cuffs seal heat in at the wrist." },
    { n: "05", title: "Drawcord hem", body: "Cinch it close or let it hang for the oversized shape." },
  ],
  cta: "Explore the jacket",
}

export const technology = {
  title: ["Technology", "engineered", "to endure"],
  body: ["Every detail has a purpose.", "From the protective outer shell", "to the insulation inside,", "the jacket is designed to perform", "without compromising its form."],
  layers: [
    { n: "01", title: "Outer shell", body: "Durable outer layer that repels water and protects against wind and rain." },
    { n: "02", title: "Ripstop protection", body: "Tear-resistant weave adds durability and stops small snags spreading." },
    { n: "03", title: "Thermal insulation", body: "Quilted padding traps heat and keeps you warm without the weight." },
    { n: "04", title: "Soft lining", body: "Smooth satin glides over layers and wicks moisture away from the body." },
  ],
}

export const collection = {
  hinges: true, // same as hero.hinges, for the product cards
  title: "Collections.",
  aside: ["Technical jackets", "for changing weather,", "movement and everyday use."],
  cta: "View all jackets",
  items: [
    { n: "01", name: "Shadow puffer jacket", price: "$480", image: "/img/jacket-lime.webp", tags: ["Oversized fit", "Limited quantity"], color: "#b6e01a" },
    { n: "02", name: "Tactical hooded jacket", price: "$395", image: "/img/jacket-pink.webp", tags: ["Layering piece", "Utility"], color: "#ff3fa4" },
    { n: "03", name: "Thermal bomber jacket", price: "$340", image: "/img/jacket-orange.webp", tags: ["Ribbed cuffs", "Lightweight"], color: "#ff4a1c" },
    { n: "04", name: "Tech shell jacket", price: "$520", image: "/img/jacket-cobalt.webp", tags: ["Water-resistant", "Breathable"], color: "#1f4fff" },
  ],
}
