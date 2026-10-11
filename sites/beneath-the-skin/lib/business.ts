// Single source of truth for all real business details (sourced from beneaththeskinbeauty.com, the studio's
// Acuity booking menu at beneaththeskin.as.me, and public directory listings).

export const business = {
  name: "Beneath the Skin",
  fullName: "Beneath the Skin Esthetics + Wellness",
  shortName: "Beneath the Skin",
  type: "Esthetics + Wellness · Acne, Facials & Corrective Skincare",
  owner: "Katrina Parker",
  ownerShort: "Katrina",
  credentials: "LE",
  phoneDisplay: "(301) 971-2769",
  phoneHref: "tel:+13019712769",
  email: "Beneaththeskininfo@gmail.com",
  website: "https://www.beneaththeskinbeauty.com/",
  bookOnline: "https://beneaththeskin.as.me/",
  bookConsult: "https://beneaththeskin.as.me/?appointmentType=category:CONSULTATION",
  instagram: "https://www.instagram.com/_beneath_the_skin",
  facebook: "https://www.facebook.com/browbeaters",
  tagline: "Clear skin. Total confidence. Holistic care.",
  hook: "Shine beyond skin deep.",
  city: "Ellicott City",
  state: "MD",
  years: "15+",
} as const

export type Hours = { day: string; short: string; open: string; close: string; label: string }

const closed = (day: string, short: string): Hours => ({ day, short, open: "", close: "", label: "Closed" })
const open = (day: string, short: string): Hours => ({ day, short, open: "10:00", close: "18:00", label: "10 AM – 6 PM" })

export const locations = [
  {
    id: "ellicott-city",
    name: "Ellicott City",
    street: "8480 Baltimore National Pike, Suite 318",
    city: "Ellicott City",
    state: "MD",
    zip: "21043",
    note: "By appointment only, no walk-ins.",
    geo: { lat: 39.287041, lng: -76.8086835 }, // OpenStreetMap geocode of the street address
    hours: [
      closed("Monday", "Mon"),
      closed("Tuesday", "Tue"),
      open("Wednesday", "Wed"),
      open("Thursday", "Thu"),
      open("Friday", "Fri"),
      open("Saturday", "Sat"),
      closed("Sunday", "Sun"),
    ] as Hours[],
  },
] as const

export type Location = (typeof locations)[number]

export const addressOf = (l: Location) => `${l.street}, ${l.city}, ${l.state} ${l.zip}`
export const mapsLinkOf = (l: Location) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.name}, ${addressOf(l)}`)}`
export const mapEmbedOf = (l: Location) =>
  `https://www.google.com/maps?q=${encodeURIComponent(addressOf(l))}&z=15&output=embed`

export const fullAddress = addressOf(locations[0])
export const hours = locations[0].hours

export const clearPath = {
  first: { name: "Consultation + first treatment", price: "$175", duration: "60 min" },
  series: { name: "Treatments 2 through 6", price: "$120", duration: "45 min each" },
  total: "$775",
  cadence: "6 treatments, every 2 weeks",
  steps: [
    { title: "Find the root", text: "A full consultation and skin analysis, with functional lab testing when your acne points to something internal." },
    { title: "Treat the surface", text: "Customized exfoliation, extractions and acne-safe actives, adjusted every visit to how your skin responds." },
    { title: "Heal from within", text: "Home care, nutrition and lifestyle guidance so clear skin lasts after the series ends." },
  ],
}

export const membership = {
  name: "Healthy Skin Monthly",
  price: "$99.99",
  per: "/mo",
  perks: "One treatment every month (Signature, Microderm, Dermaplaning, Chemical Peel or Nano Glow) plus LED.",
}

export const policies = {
  byAppointment: "Appointment required. No walk-ins.",
  oncology: "Oncology-trained: gentle, supportive care for clients navigating cancer and chronic health conditions.",
}

export type MenuItem = { name: string; price?: string; note?: string }

export const menu: { category: string; items: MenuItem[] }[] = [
  {
    category: "Start here",
    items: [
      { name: "Intro Custom Facial", price: "$99", note: "60 min, first-time clients. Customized to your skin on the day." },
      { name: "Skin Health Assessment", price: "$40", note: "30 min. A full look at your skin and a plan to fix it." },
      { name: "Healthy Skin Monthly membership", price: "$99.99/mo", note: "One monthly treatment plus LED." },
    ],
  },
  {
    category: "Clear Path Acne Program",
    items: [
      { name: "Consultation + treatment (session 1)", price: "$175", note: "60 min. Root-cause assessment and your first treatment." },
      { name: "Series sessions 2–6", price: "$120 each", note: "45 min, every two weeks." },
      { name: "Full six-session program", price: "$775" },
    ],
  },
  {
    category: "Advanced treatments",
    items: [
      { name: "Microneedling with peptides & growth factors", price: "$350", note: "90 min. Microneedling + RF for texture, scarring and firmness." },
      { name: "SWICH Dermal Rejuvenation", price: "$189", note: "60 min." },
      { name: "Hydra Glow Facial", price: "$179", note: "60 min. Deep cleanse, extraction and hydration." },
      { name: "Lift & Sculpt RF", price: "$169", note: "60 min. Radiofrequency tightening and contouring." },
    ],
  },
  {
    category: "Corrective facials",
    items: [
      { name: "Signature Custom Treatment", price: "$130", note: "60 min. Microderm, nano infusion, dermaplaning or enzyme, chosen for you." },
      { name: "Clarity Glow Peel with Retinol Booster", price: "$159", note: "30 min." },
      { name: "Purely Polished: Microderm + Nano Infusion", price: "$159" },
      { name: "Smooth & Infuse: Dermaplaning + Nano Infusion", price: "$159" },
      { name: "Enzyme Renewal + Nano Infusion & LED", price: "$159" },
    ],
  },
  {
    category: "Limited time",
    items: [
      { name: "Hydra Glow Facial", price: "$130", note: "Special pricing while it lasts." },
      { name: "Advanced Chemical Peel", price: "$130" },
    ],
  },
  {
    category: "Waxing & brows",
    items: [
      { name: "Brow maintenance", price: "$30" },
      { name: "Chin wax", price: "$20" },
      { name: "Lip wax", price: "$18" },
    ],
  },
]

export const more = [
  {
    name: "Healthy Skin Monthly",
    description: "$99.99 a month for one treatment of your choice plus LED. The easiest way to stay consistent.",
    href: "https://beneaththeskin.as.me/",
    cta: "Join online",
  },
  {
    name: "Refinement Pro for estheticians",
    description: "Katrina's training method: hands-on intensives, clinical and career refinement, and leadership advisory.",
    href: "https://www.beneaththeskinbeauty.com/",
    cta: "Learn more",
  },
  {
    name: "Suites for rent",
    description: "Private treatment suites inside the studio for independent beauty and wellness pros.",
    href: "https://www.beneaththeskinbeauty.com/",
    cta: "Ask about a suite",
  },
  {
    name: "Gift certificates",
    description: "From $50 to $350, redeemable on any treatment. Financing is also available.",
    href: "https://beneaththeskin.as.me/",
    cta: "Send a gift",
  },
]

export const testimonials = [
  {
    name: "Nicole O.",
    service: "TCA Peel",
    text: "The TCA Peel is a game-changer! My skin feels smoother, looks brighter, and the results are long-lasting. Katrina was so welcoming and thoroughly addressed my concerns which made the whole experience a pleasure.",
  },
  {
    name: "Shania M.",
    service: "Acne treatments",
    text: "I look forward to my appointment every month! Comfortable location, very welcoming and I see progress in my acne from 3 services so far. 10/10 I recommend.",
  },
  {
    name: "Rachel A.",
    service: "Regular client",
    text: "I love visiting Beneath the Skin. The ambiance is soothing and relaxed. The practitioners bring years of skincare experience and works magic on my skin. I always leave soothed & glowing.",
  },
  {
    name: "Jessica G.",
    service: "Facials",
    text: "After each facial session, I leave refreshed and glowing. Katrina listens to my skin health goals and makes it a relaxing experience.",
  },
]
