// Single source of truth for all real business details (sourced from charmmedicalaesthetics.com, its
// OptiMantra booking menu, and the public Google listing).

export const business = {
  name: "Charm Medical Aesthetics",
  fullName: "Charm Medical Aesthetics",
  shortName: "Charm",
  type: "Med Spa · Botox, Fillers & Weight Loss",
  owner: "Olga Lannon",
  ownerShort: "Olga",
  credentials: "CRNP, FNP-C",
  phoneDisplay: "(410) 709-8661",
  phoneHref: "tel:+14107098661",
  email: "info@charmmedicalaesthetics.com",
  website: "https://www.charmmedicalaesthetics.com/",
  bookOnline:
    "https://www.optimantra.com/optimus/patient/patientaccess/servicesall?pid=TjFWYzN6MXdzVzVGeGx4ODVsRTF5dz09&lid=eTl3MHBIbHZPMjFETlhYSWFpV09nZz09",
  giftCard: "https://www.optimantra.com/optimus/patient/patientaccess/onlinegiftcard?pid=Uy9kS05WQjROenRyVFRpM1VZSDlNZz09",
  reviewLink: "https://g.page/r/CUYwqHzh3IlxEB0/review",
  instagram: "https://www.instagram.com/charmmedicalaesthetics/",
  facebook: "https://www.facebook.com/profile.php?id=61560850980210",
  tiktok: "https://www.tiktok.com/@charmmedicalaesthetics",
  tagline: "Expert care. Real results. Confidence you can feel.",
  city: "Rosedale",
  state: "MD",
  rating: 5.0,
  reviewCount: 54,
  reviewSource: "Google",
  years: "11+",
  telemedStates: ["Maryland"],
} as const

export type Hours = { day: string; short: string; open: string; close: string; label: string }

const closed = (day: string, short: string): Hours => ({ day, short, open: "", close: "", label: "Closed" })

export const locations = [
  {
    id: "rosedale",
    name: "Rosedale",
    street: "6700 Ridge Road, Suite 2",
    city: "Rosedale",
    state: "MD",
    zip: "21237",
    note: "Entrance around the right side of the building.",
    geo: { lat: 39.3443786, lng: -76.486858 }, // OpenStreetMap geocode of the street address
    rating: 5.0,
    reviewCount: 54,
    hours: [
      closed("Monday", "Mon"),
      closed("Tuesday", "Tue"),
      { day: "Wednesday", short: "Wed", open: "09:00", close: "14:00", label: "9 AM – 2 PM" },
      closed("Thursday", "Thu"),
      { day: "Friday", short: "Fri", open: "09:00", close: "14:00", label: "9 AM – 2 PM" },
      { day: "Saturday", short: "Sat", open: "09:00", close: "17:00", label: "9 AM – 5 PM" },
      { day: "Sunday", short: "Sun", open: "", close: "", label: "Closed" },
    ] as Hours[],
  },
] as const

export type Location = (typeof locations)[number]

export const addressOf = (l: Location) => `${l.street}, ${l.city}, ${l.state} ${l.zip}`
export const mapsLinkOf = (l: Location) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.fullName}, ${addressOf(l)}`)}`
export const mapEmbedOf = (l: Location) =>
  `https://www.google.com/maps?q=${encodeURIComponent(`${business.fullName}, ${addressOf(l)}`)}&z=15&output=embed`

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
  pharmacy: "Dispensed through Strive Pharmacy (NABP, PCAB and LegitScript accredited).",
}

export const memberships = [
  { name: "Charm Essentials", price: "$35", per: "/mo", perks: "Tox at $10.80/unit, 10% off skincare, a yearly facial, peel or microneedling" },
  { name: "Luxe Skin Club", price: "$99", per: "/mo", perks: "One professional facial every month (over 29% off)" },
  { name: "Charm Glow", price: "$25", per: "/mo", perks: "10% off skincare, $10 monthly credit, Rx retinols, a yearly facial" },
]

export const policies = {
  noShow: "A $75 fee applies to no-call, no-show appointments, including free consultations.",
  financing: "CareCredit® financing available.",
  consult: "Injectable consultations are always free.",
  byAppointment: "Office hours are by appointment only.",
}

export type MenuItem = { name: string; price?: string; note?: string }

export const menu: { category: string; items: MenuItem[] }[] = [
  {
    category: "Injectables",
    items: [
      { name: "Free injectables consultation", price: "Free", note: "Talk through goals and options, no pressure." },
      { name: "Xeomin / Botox", price: "$12/unit", note: "Forehead, 11s, crow’s feet, masseter, neck and more." },
      { name: "Dysport", price: "$15/unit", note: "About 3 Dysport units equal 1 Botox unit." },
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
      { name: "Sculptra®", price: "$850", note: "Rebuilds collagen gradually; results can last 2+ years." },
      { name: "Radiesse® facial harmonization", price: "$850" },
      { name: "EZ Gel / under-eye correction", price: "$650", note: "Your own platelet-rich fibrin." },
      { name: "Biostimulator duo", price: "$1,750", note: "2 syringes Radiesse + full-face microneedling." },
      { name: "Intro to Collagen", price: "$1,999", note: "1 vial Sculptra + 2 syringes filler + HA skincare." },
      { name: "Mini Rejuvenation", price: "$1,700", note: "Lower face or mid-face balancing." },
      { name: "Collagen Renewal", price: "$2,999", note: "2 Sculptra + 2 filler, or 4 Sculptra." },
      { name: "Full Face Rejuvenation", price: "$3,000", note: "Biostimulators + filler, any areas needed." },
    ],
  },
  {
    category: "Skin",
    items: [
      { name: "Signature facial", price: "$140" },
      { name: "Silktox facial", price: "$165", note: "Red-carpet glass-skin glow, no downtime." },
      { name: "Microneedling (full face)", price: "$350", note: "Add PRP $100 or VAMP $150." },
      { name: "Perfect Derma chemical peel", price: "$325" },
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
    name: "PCA Skin",
    description: "Dermatologist-backed regimens that extend your in-office results. Restock anytime.",
    image: "/biz/pca-kits.jpg",
    href: "https://partners.pcaskin.com/charmmedicalaesthetics",
  },
  {
    name: "Amarté",
    description: "Luxury Korean skincare, professional-grade and available only through licensed providers.",
    image: "/biz/amarte.jpg",
    href: "https://mystore.amarteskincare.com/shop-1379586534",
  },
  {
    name: "EltaMD",
    description: "The #1 dermatologist-recommended sunscreen. Online store coming soon; ask in office.",
    image: "/biz/eltamd-shelf.jpg",
    href: "https://www.charmmedicalaesthetics.com/",
  },
]
