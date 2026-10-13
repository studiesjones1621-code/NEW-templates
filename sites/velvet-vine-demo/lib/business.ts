// Single source of truth for the business details. CONCEPT DEMO: "Velvet & Vine" is a fictional business;
// the name, owner, address and 555 phone number are all made up for portfolio purposes.

export const business = {
  name: "Velvet & Vine",
  fullName: "Velvet & Vine Beauty Bar & Hair Studio",
  shortName: "Velvet & Vine",
  type: "Hair Studio & Beauty Bar",
  owner: "Simone",
  ownerShort: "Simone",
  phoneDisplay: "(555) 010-0123",
  phoneHref: "tel:+15550100123",
  smsHref: "sms:+15550100123",
  tagline: "Hair that feels like you again. A concept demo of an AI talking website.",
  address: {
    street: "100 Main Street",
    city: "Springfield",
    neighborhood: "Old Town",
  },
  years: "20+",
  demo: true,
} as const

export const fullAddress = `${business.address.street}, ${business.address.city}`

export const hours = [
  { day: "Monday", short: "Mon", open: "09:00", close: "17:00", label: "9 AM – 5 PM" },
  { day: "Tuesday", short: "Tue", open: "09:00", close: "17:00", label: "9 AM – 5 PM" },
  { day: "Wednesday", short: "Wed", open: "09:00", close: "17:00", label: "9 AM – 5 PM" },
  { day: "Thursday", short: "Thu", open: "09:00", close: "17:00", label: "9 AM – 5 PM" },
  { day: "Friday", short: "Fri", open: "09:00", close: "17:00", label: "9 AM – 5 PM" },
  { day: "Saturday", short: "Sat", open: "09:00", close: "17:00", label: "9 AM – 5 PM" },
  { day: "Sunday", short: "Sun", open: "", close: "", label: "Closed" },
] as const

export const policies = {
  deposit: "All salon bookings require a $25 non-refundable deposit.",
  cancel: "Please cancel at least 24 hours ahead; later cancellations carry a $25 fee.",
  consult: "Hair loss consultations need 72 hours’ notice to cancel.",
}

export type MenuItem = { name: string; price: string; time: string; note?: string }

export const menu: { category: string; items: MenuItem[] }[] = [
  {
    category: "Hair Loss Studio",
    items: [
      { name: "Hair Loss Consultation & Maintenance", price: "$250", time: "25 min", note: "Scalp and history review with Simone. Start here." },
      { name: "2-Step Protein Hair Treatment", price: "$97", time: "60 min", note: "Nourishes and repairs damaged hair." },
    ],
  },
  {
    category: "Short Hair & Cuts",
    items: [
      { name: "Pixie Short Cut & Trim", price: "$105", time: "2 hr", note: "Shampoo, deep conditioning, light trim." },
      { name: "Hair Cut", price: "$125", time: "60 min" },
      { name: "Hair Trim", price: "$100", time: "60 min" },
      { name: "Wrap & Curls", price: "$100", time: "45 min" },
    ],
  },
  {
    category: "Color",
    items: [
      { name: "Platinum Pixie", price: "$250", time: "3 hr" },
      { name: "Permanent Highlights", price: "$100", time: "2 hr", note: "Consultation needed first." },
      { name: "Demi Hair Color", price: "$40", time: "60 min", note: "Gray coverage or a fresh tone." },
      { name: "Rinse Only", price: "$25", time: "—" },
    ],
  },
  {
    category: "Relaxers & Sew-Ins",
    items: [
      { name: "Virgin Full Relaxer", price: "$250", time: "2 hr" },
      { name: "Spot Relaxer", price: "$75", time: "—", note: "Targets frizz and specific areas." },
      { name: "27-Piece Quick Weave", price: "$220", time: "3 hr" },
    ],
  },
  {
    category: "Education",
    items: [{ name: "One-on-One Hair Cutting Class", price: "$325", time: "2 hr", note: "Private precision-cutting class with Simone." }],
  },
]

export const products = [
  { name: "Rosemary & Mint Growth Oil", price: "$32", note: "Botanical scalp oil to support follicles and circulation.", image: "/biz/oil-growth.jpg" },
  { name: "Golden Shine Oil", price: "$35", note: "Lightweight soya-bean oil. Soothes the scalp, adds shine.", image: "/biz/oil-shine.jpg" },
  { name: "Silicone Scalp Massager", price: "$18", note: "Soft bristles for a daily scalp massage between visits.", image: "/biz/scalp-massager.jpg" },
]
