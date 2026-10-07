// Single source of truth for all real business details (sourced from the studio's Booksy profile).

export const business = {
  name: "First Class Cutz by Reem",
  shortName: "First Class Cutz",
  venue: "First Class Studio",
  type: "Barbershop",
  barber: "Reem",
  phoneDisplay: "(667) 495-8877",
  phoneHref: "tel:+16674958877",
  smsHref: "sms:+16674958877",
  instagram: "https://www.instagram.com/firstclasscutzbyreem/",
  instagramHandle: "@firstclasscutzbyreem",
  booksy: "https://booksy.com/en-us/1583787_first-class-studio_barber-shop_134613_baltimore",
  address: {
    street: "6524 Reisterstown Rd, Suite 123",
    city: "Baltimore",
    state: "MD",
    zip: "21215",
  },
  geo: { lat: 39.356449285143036, lng: -76.7051320443949 },
  rating: 4.8,
  reviewCount: 25,
} as const

export const fullAddress = `${business.address.street}, ${business.address.city}, ${business.address.state} ${business.address.zip}`

export const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${business.name}, ${fullAddress}`,
)}`

export const mapEmbed = `https://www.google.com/maps?q=${encodeURIComponent(`${business.venue}, ${fullAddress}`)}&z=15&output=embed`

// Booksy day order confirmed against the profile's schema.org data.
export const hours = [
  { day: "Monday", short: "Mon", open: "10:00", close: "20:00", label: "10 AM – 8 PM" },
  { day: "Tuesday", short: "Tue", open: "09:00", close: "20:00", label: "9 AM – 8 PM" },
  { day: "Wednesday", short: "Wed", open: "09:00", close: "20:00", label: "9 AM – 8 PM" },
  { day: "Thursday", short: "Thu", open: "09:00", close: "20:00", label: "9 AM – 8 PM" },
  { day: "Friday", short: "Fri", open: "08:00", close: "19:00", label: "8 AM – 7 PM" },
  { day: "Saturday", short: "Sat", open: "08:00", close: "20:00", label: "8 AM – 8 PM" },
  { day: "Sunday", short: "Sun", open: "14:00", close: "17:00", label: "2 PM – 5 PM" },
] as const

export type MenuItem = { name: string; price: string; time: string; note?: string }

export const menu: { category: string; items: MenuItem[] }[] = [
  {
    category: "Haircuts",
    items: [
      { name: "Economy Cut", price: "$35", time: "30 min", note: "One-length cut, sharp line-up." },
      { name: "Economy Plus", price: "$40", time: "45 min", note: "Taper or fade, mustache and chin." },
      { name: "Economy Plus One", price: "$45", time: "50 min", note: "Taper or fade with full beard." },
      { name: "Business Class Experience", price: "$50", time: "60 min", note: "Fade, beard, hot towel, razor." },
      { name: "First Class Luxury Experience", price: "$105", time: "90 min", note: "Cut, beard sculpt, facial, massage." },
      { name: "Kids Cut (12 & under)", price: "$35", time: "30 min", note: "Enhancements included." },
      { name: "Teen Economy Cut (13–17)", price: "$40", time: "30 min", note: "Tapers and fades included." },
      { name: "Women’s Undercut", price: "$25", time: "20 min" },
    ],
  },
  {
    category: "Beard & Shape-Ups",
    items: [
      { name: "Beard", price: "$20", time: "30 min", note: "Trim, shape, sharp line work." },
      { name: "Signature Beard Service", price: "$30", time: "30 min", note: "Wash, hot towel, steam, oils." },
      { name: "Shape-Up — Head Only", price: "$25", time: "20 min", note: "Razor finish." },
      { name: "Shape-Up — Head & Beard", price: "$35", time: "30 min" },
      { name: "Head Shave & Beard Trim", price: "$50", time: "45 min" },
    ],
  },
  {
    category: "Color",
    items: [
      { name: "Jet Black Coverage", price: "$40", time: "35 min", note: "Grey to black." },
      { name: "Permanent Color & Haircut", price: "$85", time: "90 min" },
      { name: "Platinum Transformation", price: "$120", time: "1 hr 45 min", note: "Bleach, tone, cut." },
    ],
  },
  {
    category: "Locs & Treatments",
    items: [
      { name: "Loc Retwist", price: "$85", time: "90 min", note: "Shampoo included." },
      { name: "Loc Retwist — Extended", price: "$125", time: "90 min", note: "Locs past the neck." },
      { name: "Ingrown Treatment", price: "$25", time: "30 min" },
      { name: "Dandruff Treatment", price: "$20", time: "15 min" },
    ],
  },
  {
    category: "Before & After Hours",
    items: [
      { name: "Premium Pay — Before Shift", price: "$75", time: "60 min", note: "+$10 Sun & Mon. Call or text after booking." },
      { name: "Premium Pay — After Shift", price: "$75", time: "60 min", note: "+$10 Sun & Mon. Call or text after booking." },
    ],
  },
]
