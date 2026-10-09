// Single source of truth for all real business details (sourced from tyeandcompany.com, its Wix booking
// data, and public review listings).

export const business = {
  name: "Tye & Company",
  fullName: "Tye & Company Beauté Bar & Hair Loss Studio",
  shortName: "Tye & Company",
  type: "Hair Loss Studio & Beauté Bar",
  owner: "Tye Bailey",
  ownerShort: "Ms. Tye",
  phoneDisplay: "(410) 567-3099",
  phoneHref: "tel:+14105673099",
  smsHref: "sms:+14105673099",
  email: "info@tyeandcompany.com",
  website: "https://www.tyeandcompany.com/",
  bookOnline: "https://www.tyeandcompany.com/book-online",
  shop: "https://www.tyeandcompany.com/shop-1",
  tagline: "If your hair is not becoming to you, you should be coming to Tye’s.",
  address: {
    street: "2051 Pennsylvania Ave",
    city: "Baltimore",
    state: "MD",
    zip: "21217",
    neighborhood: "Upton",
  },
  geo: { lat: 39.3067171, lng: -76.638227 }, // OpenStreetMap geocode of the street address
  rating: 4.9,
  reviewCount: 191,
  reviewSource: "Google",
  years: "20+",
} as const

export const fullAddress = `${business.address.street}, ${business.address.city}, ${business.address.state} ${business.address.zip}`

export const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${business.fullName}, ${fullAddress}`,
)}`

export const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(`${business.name}, ${fullAddress}`)}&z=15&output=embed`

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
      { name: "Hair Loss Consultation & Maintenance", price: "$250", time: "25 min", note: "Scalp and history review with Ms. Tye. Start here." },
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
    items: [{ name: "One-on-One Hair Cutting Class", price: "$325", time: "2 hr", note: "Private precision-cutting class with Ms. Tye." }],
  },
]

export const products = [
  { name: "Organic Hair Growth Oil", note: "Rosemary & mint. Stimulates follicles and scalp circulation.", image: "/biz/oil-rosemary-mint.jpg" },
  { name: "Liquid Gold Hair Shine", price: "$35", note: "Gold soya bean oil. Soothes the scalp, adds shine.", image: "/biz/oil-gold-soya.jpg" },
  { name: "Grace Through the Hard Days", price: "$27.99", note: "A daily guided journal by Tye Bailey for navigating loss with intention.", image: "/biz/journal.jpg" },
]
