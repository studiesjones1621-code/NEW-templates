// Single source of truth for the business details. CONCEPT DEMO: "Aurelle Medical Aesthetics" is a fictional
// sample business; the name, person, address and 555 phone number are all made up.

export const business = {
  name: "Aurelle Medical Aesthetics",
  fullName: "Aurelle Medical Aesthetics",
  shortName: "Aurelle",
  type: "Med Spa · Botox, Fillers & Weight Loss",
  owner: "Nadia",
  ownerShort: "Nadia",
  credentials: "Aesthetic Nurse Injector",
  phoneDisplay: "(555) 010-0123",
  phoneHref: "tel:+15550100123",
  tagline: "Expert care. Natural results. Confidence you can feel.",
  city: "Springfield",
  years: "10+",
  isConceptDemo: true,
} as const

export type Hours = { day: string; short: string; open: string; close: string; label: string }

const closed = (day: string, short: string): Hours => ({ day, short, open: "", close: "", label: "Closed" })

export const locations = [
  {
    id: "springfield",
    name: "Springfield",
    street: "100 Main Street",
    city: "Springfield",
    state: "",
    zip: "",
    note: "Sample address for this concept demo.",
    hours: [
      closed("Monday", "Mon"),
      { day: "Tuesday", short: "Tue", open: "10:00", close: "18:00", label: "10 AM – 6 PM" },
      { day: "Wednesday", short: "Wed", open: "10:00", close: "18:00", label: "10 AM – 6 PM" },
      { day: "Thursday", short: "Thu", open: "10:00", close: "19:00", label: "10 AM – 7 PM" },
      { day: "Friday", short: "Fri", open: "09:00", close: "17:00", label: "9 AM – 5 PM" },
      { day: "Saturday", short: "Sat", open: "09:00", close: "15:00", label: "9 AM – 3 PM" },
      closed("Sunday", "Sun"),
    ] as Hours[],
  },
] as const

export type Location = (typeof locations)[number]

export const addressOf = (l: Location) => `${l.street}, ${l.city}`

export const fullAddress = addressOf(locations[0])
export const hours = locations[0].hours

export const weightLoss = {
  consult: "$75",
  consultNote: "30-minute virtual consult, applied to your first month if you join.",
  plans: [
    { name: "Semaglutide subscription", price: "$325", per: "/month", note: "Any dose" },
    { name: "Tirzepatide subscription", price: "$475", per: "/month", note: "Up to 10 mg ($595 for 12–14 mg)" },
    { name: "Coaching & accountability", price: "$75", per: "/month", note: "Without medication" },
  ],
  includes: [
    "A full month of medication",
    "Monthly provider check-ins",
    "Initial and follow-up labs",
    "Body composition analysis",
    "10% off aesthetics and skincare",
  ],
  pharmacy: "Medication dispensed through a licensed, accredited US pharmacy.",
}

export const memberships = [
  { name: "Essentials", price: "$35", per: "/mo", perks: "Tox at a member rate, 10% off skincare, a yearly facial, peel or microneedling" },
  { name: "Skin Club", price: "$99", per: "/mo", perks: "One professional facial every month" },
  { name: "Glow", price: "$25", per: "/mo", perks: "10% off skincare, $10 monthly credit, Rx retinoids, a yearly facial" },
]

export const policies = {
  noShow: "A $75 fee applies to no-call, no-show appointments, including free consultations.",
  financing: "Patient financing available.",
  consult: "Injectable consultations are always free.",
  byAppointment: "Office hours are by appointment only.",
}

export type MenuItem = { name: string; price?: string; note?: string }

export const menu: { category: string; items: MenuItem[] }[] = [
  {
    category: "Injectables",
    items: [
      { name: "Free injectables consultation", price: "Free", note: "Talk through goals and options, no pressure." },
      { name: "Neurotoxin (wrinkle relaxer)", price: "$12/unit", note: "Forehead, 11s, crow’s feet, masseter, neck and more." },
      { name: "Alternative neurotoxin", price: "$5/unit", note: "Dosed differently; your injector will explain the equivalent." },
      { name: "Lip flip", price: "$100" },
      { name: "Lip enhancement", price: "$700", note: "Hyaluronic acid filler, lasts 6–12 months." },
      { name: "Dermal filler (cheeks, folds, chin)", price: "At consult", note: "Priced per syringe." },
      { name: "PDO smooth threads", price: "At consult" },
      { name: "B12 injection", price: "$80" },
    ],
  },
  {
    category: "Collagen & Biostimulators",
    items: [
      { name: "Poly-L-lactic acid biostimulator", price: "$850", note: "Rebuilds collagen gradually; results can last 2+ years." },
      { name: "Calcium hydroxylapatite facial harmonization", price: "$850" },
      { name: "PRF gel under-eye correction", price: "$650", note: "Your own platelet-rich fibrin." },
      { name: "Biostimulator duo", price: "$1,750", note: "2 syringes biostimulator + full-face microneedling." },
      { name: "Intro to Collagen", price: "$1,999", note: "1 vial biostimulator + 2 syringes filler + HA skincare." },
      { name: "Mini Rejuvenation", price: "$1,700", note: "Lower face or mid-face balancing." },
      { name: "Collagen Renewal", price: "$2,999", note: "2 biostimulator vials + 2 filler, or 4 biostimulator vials." },
      { name: "Full Face Rejuvenation", price: "$3,000", note: "Biostimulators + filler, any areas needed." },
    ],
  },
  {
    category: "Skin",
    items: [
      { name: "Signature facial", price: "$140" },
      { name: "Glass-skin micro-tox facial", price: "$165", note: "Red-carpet glow, no downtime." },
      { name: "Microneedling (full face)", price: "$350", note: "Add PRP $100 or VAMP $150." },
      { name: "Medical-grade chemical peel", price: "$325" },
      { name: "Dermaplaning", price: "$50" },
      { name: "Hair restoration (PRP + microneedling)", price: "$300" },
      { name: "Brow lamination & tint", price: "$125" },
      { name: "Skincare consultation", price: "$100", note: "Applied toward your skincare purchase." },
    ],
  },
  {
    category: "Skincare Pathways",
    items: [
      { name: "Sensitivity & Redness Relief", price: "$349", note: "Express facial + calming peel + 4 full-size products." },
      { name: "Pigment Correction Pro", price: "$399", note: "Express facial + targeted peel + 4 full-size products." },
      { name: "Firm & Restore (anti-aging)", price: "$499", note: "Express facial + targeted peel + 4 full-size products." },
    ],
  },
  {
    category: "Medical Weight Loss",
    items: [
      { name: "Virtual weight loss consult", price: "$75", note: "Applied to your first month if you join." },
      { name: "Semaglutide subscription", price: "$325/mo" },
      { name: "Tirzepatide subscription", price: "$475/mo", note: "$595/mo for 12–14 mg doses." },
      { name: "Maintenance programs", price: "From $275/mo" },
      { name: "Membership with your insurance’s prescription", price: "$140", note: "Medication billed through your insurance." },
      { name: "Virtual one-on-one coaching", price: "$85" },
    ],
  },
]

export const products = [
  {
    name: "Serums & actives",
    description: "Professional-grade vitamin C, peptides and retinoids to extend your in-office results.",
    image: "/biz/shop-serum.jpg",
  },
  {
    name: "Barrier & repair",
    description: "Rich, calming moisturizers chosen for post-treatment skin. Ask in clinic for your match.",
    image: "/biz/shop-cream.jpg",
  },
  {
    name: "Daily mineral SPF",
    description: "Sheer, tinted mineral sunscreens. The single best way to protect your results.",
    image: "/biz/shop-spf.jpg",
  },
]
