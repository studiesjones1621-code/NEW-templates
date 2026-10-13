// Single source of truth for the business details. Lumen Skin Studio is a FICTIONAL business: this site is a
// concept demo, so every name, address and phone number below is made up (555 numbers are reserved for fiction).

export const business = {
  name: "Lumen Skin Studio",
  fullName: "Lumen Skin Studio · Esthetics + Wellness",
  shortName: "Lumen",
  type: "Esthetics + Wellness · Acne, Facials & Corrective Skincare",
  owner: "Maya",
  ownerShort: "Maya",
  credentials: "Licensed Esthetician",
  phoneDisplay: "(555) 010-0123",
  phoneHref: "tel:+15550100123",
  tagline: "Calm skin. Clear plan. Lasting glow.",
  hook: "Skin that glows from within.",
  city: "Springfield",
  years: "12+",
  demoNote: "Concept demo · fictional business",
} as const

export type Hours = { day: string; short: string; open: string; close: string; label: string }

const closed = (day: string, short: string): Hours => ({ day, short, open: "", close: "", label: "Closed" })
const open = (day: string, short: string): Hours => ({ day, short, open: "10:00", close: "18:00", label: "10 AM – 6 PM" })

export const locations = [
  {
    id: "springfield",
    name: "Springfield",
    street: "100 Main Street, Suite 2",
    city: "Springfield",
    note: "By appointment only, no walk-ins.",
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

export const addressOf = (l: Location) => `${l.street}, ${l.city}`

export const fullAddress = addressOf(locations[0])
export const hours = locations[0].hours

export const clearPath = {
  name: "Clarity Reset",
  first: { name: "Consultation + first treatment", price: "$175", duration: "60 min" },
  series: { name: "Treatments 2 through 6", price: "$120", duration: "45 min each" },
  total: "$775",
  cadence: "6 treatments, every 2 weeks",
  steps: [
    { title: "Find the root", text: "A full consultation and skin analysis, looking at the habits and triggers behind your breakouts." },
    { title: "Treat the surface", text: "Customized exfoliation, extractions and acne-safe actives, adjusted every visit to how your skin responds." },
    { title: "Heal from within", text: "Home care, nutrition and lifestyle guidance so clear skin lasts after the series ends." },
  ],
}

export const membership = {
  name: "Lumen Monthly",
  price: "$99.99",
  per: "/mo",
  perks: "One treatment every month (Signature, Microderm, Dermaplaning, Chemical Peel or Nano Glow) plus LED.",
}

export const policies = {
  byAppointment: "Appointment required. No walk-ins.",
  gentle: "Gentle, supportive care for sensitive skin and clients navigating health conditions.",
}

export type MenuItem = { name: string; price?: string; note?: string }

export const menu: { category: string; items: MenuItem[] }[] = [
  {
    category: "Start here",
    items: [
      { name: "Intro Custom Facial", price: "$99", note: "60 min, first-time clients. Customized to your skin on the day." },
      { name: "Skin Health Assessment", price: "$40", note: "30 min. A full look at your skin and a plan to fix it." },
      { name: "Lumen Monthly membership", price: "$99.99/mo", note: "One monthly treatment plus LED." },
    ],
  },
  {
    category: "Clarity Reset Acne Program",
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
      { name: "Dermal Rejuvenation", price: "$189", note: "60 min." },
      { name: "Hydrating Glow Facial", price: "$179", note: "60 min. Deep cleanse, extraction and hydration." },
      { name: "RF Lift & Contour", price: "$169", note: "60 min. Radiofrequency tightening and contouring." },
    ],
  },
  {
    category: "Corrective facials",
    items: [
      { name: "Signature Custom Treatment", price: "$130", note: "60 min. Microderm, nano infusion, dermaplaning or enzyme, chosen for you." },
      { name: "Bright Renewal Peel with Retinol Booster", price: "$159", note: "30 min." },
      { name: "Microderm + Nano Infusion", price: "$159" },
      { name: "Dermaplaning + Nano Infusion", price: "$159" },
      { name: "Enzyme Renewal + Nano Infusion & LED", price: "$159" },
    ],
  },
  {
    category: "Limited time",
    items: [
      { name: "Hydrating Glow Facial", price: "$130", note: "Special pricing while it lasts." },
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
    name: "Treatment add-ons",
    description: "Add LED, brow shaping or a quick lip or chin wax to any visit, priced from $18.",
    cta: "Ask the assistant",
  },
  {
    name: "Skin Health Assessment",
    description: "Not sure where to start? Thirty minutes, $40, and a clear plan for what your skin needs next.",
    cta: "Ask the assistant",
  },
  {
    name: "Packages & series",
    description: "Bundle a treatment series at one price and keep your results on schedule.",
    cta: "Ask the assistant",
  },
  {
    name: "Gift certificates",
    description: "From $50 to $350, redeemable on any treatment. Financing is also available.",
    cta: "Ask the assistant",
  },
]

// Sample quotes written for this concept demo (not real reviews)
export const testimonials = [
  {
    name: "Elena",
    service: "Chemical peel",
    text: "My skin feels smoother and looks brighter, and Maya explained every step so I knew exactly what to expect.",
  },
  {
    name: "Jordan",
    service: "Acne program",
    text: "Three sessions in and I can finally see my breakouts calming down. The studio is calm and I never feel rushed.",
  },
  {
    name: "Priya",
    service: "Monthly member",
    text: "The space is soothing, the treatments are tailored to my skin, and I always leave relaxed and glowing.",
  },
  {
    name: "Sam",
    service: "Facials",
    text: "Maya actually listens to my goals. Every facial leaves me refreshed, and my skin keeps getting better.",
  },
]
