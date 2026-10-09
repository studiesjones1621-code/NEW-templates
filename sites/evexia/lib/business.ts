// Single source of truth for all real business details (sourced from evexianp.com, its service pages and
// schema data, and public Google listings for both offices).

export const business = {
  name: "Evexia",
  fullName: "Evexia Weight Loss and Wellness Clinic",
  shortName: "Evexia",
  type: "Medical Weight Loss & Hormone Therapy Clinic",
  owner: "Kerryann Gross",
  ownerShort: "Kerryann",
  credentials: "CRNP, FNP-BC",
  phoneDisplay: "(410) 670-9063",
  phoneHref: "tel:+14106709063",
  email: "info@evexianp.com",
  website: "https://evexianp.com/",
  bookOnline: "https://www.patientfusion.com/external/appointment/ef63774c-772b-4e20-981a-93b8458cc6ca?origin=doctor",
  instagram: "https://www.instagram.com/evexianp/",
  facebook: "https://www.facebook.com/EvexiaNP",
  tagline: "Make your health a priority now, before you’re forced to make it a priority later.",
  city: "Baltimore",
  state: "MD",
  rating: 5.0,
  reviewCount: 125,
  reviewSource: "Google",
  years: "20+",
  telemedStates: ["Maryland", "Delaware", "Virginia", "Connecticut"],
} as const

export type Hours = { day: string; short: string; open: string; close: string; label: string }

const closed = (day: string, short: string): Hours => ({ day, short, open: "", close: "", label: "Closed" })

export const locations = [
  {
    id: "parkville",
    name: "Parkville",
    street: "7112 Darlington Drive",
    city: "Parkville",
    state: "MD",
    zip: "21234",
    geo: { lat: 39.3728916, lng: -76.5588897 }, // OpenStreetMap geocode of the street address
    rating: 5.0,
    reviewCount: 125,
    hours: [
      { day: "Monday", short: "Mon", open: "09:00", close: "18:00", label: "9 AM – 6 PM" },
      closed("Tuesday", "Tue"),
      { day: "Wednesday", short: "Wed", open: "09:00", close: "18:00", label: "9 AM – 6 PM" },
      { day: "Thursday", short: "Thu", open: "09:00", close: "15:30", label: "9 AM – 3:30 PM" },
      closed("Friday", "Fri"),
      { day: "Saturday", short: "Sat", open: "09:00", close: "14:00", label: "9 AM – 2 PM" },
      closed("Sunday", "Sun"),
    ] as Hours[],
  },
  {
    id: "pikesville",
    name: "Pikesville",
    street: "1726 Reisterstown Rd, Suite 229",
    city: "Pikesville",
    state: "MD",
    zip: "21208",
    geo: { lat: 39.3823924, lng: -76.7334774 },
    rating: 4.9,
    reviewCount: 55,
    hours: [
      closed("Monday", "Mon"),
      { day: "Tuesday", short: "Tue", open: "08:00", close: "17:00", label: "8 AM – 5 PM" },
      closed("Wednesday", "Wed"),
      { day: "Thursday", short: "Thu", open: "09:00", close: "17:00", label: "9 AM – 5 PM" },
      { day: "Friday", short: "Fri", open: "08:00", close: "18:00", label: "8 AM – 6 PM" },
      { day: "Saturday", short: "Sat", open: "10:00", close: "15:00", label: "10 AM – 3 PM" },
      closed("Sunday", "Sun"),
    ] as Hours[],
  },
] as const

export type Location = (typeof locations)[number]

export const addressOf = (l: Location) => `${l.street}, ${l.city}, ${l.state} ${l.zip}`
export const mapsLinkOf = (l: Location) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.fullName}, ${addressOf(l)}`)}`
export const mapEmbedOf = (l: Location) =>
  `https://www.google.com/maps?q=${encodeURIComponent(`${business.fullName}, ${addressOf(l)}`)}&z=14&output=embed`

export const fullAddress = addressOf(locations[0])

// Days either office is open (for JSON-LD and the agent)
export const hours = locations[0].hours

export const pricing = {
  bhrtStart: "$199",
  bhrtIncludes: ["Patient intake", "Initial labs", "Consult and lab review"],
  bhrtCompare: "$749",
  bhrtNote: "One-time start fee. Medications are priced separately at your consultation.",
}

export const policies = {
  payment:
    "Weight loss and hormone programs are cash-pay, with no insurance in between. FSA/HSA welcome, and invoices provided for reimbursement.",
  insurance: "Primary care accepts major plans including Aetna, Cigna, UnitedHealthcare and CareFirst.",
  referral: "No referral needed.",
  disclaimer:
    "Compounded GLP-1/GIP medications come from specialty compounding pharmacies and are not affiliated with Novo Nordisk™ or Eli Lilly™ brand-name drugs. Results vary by individual.",
}

export type MenuItem = { name: string; price?: string; note?: string }

export const menu: { category: string; items: MenuItem[] }[] = [
  {
    category: "Medical Weight Loss",
    items: [
      { name: "GLP-1 or dual-action GLP-1/GIP injections", note: "Weekly injections that curb appetite so you feel fuller longer." },
      { name: "Lipotropic injections", note: "Amino acids and B complex that help turn fat and sugar into energy." },
      { name: "Phentermine", note: "Short-term appetite support, with diet and exercise." },
      { name: "Contrave", note: "Targets hunger and cravings, including emotional eating." },
      { name: "Body composition analysis", note: "Included at your first visit, with a personal plan." },
      { name: "Weekly weigh-ins & accountability calls", note: "Plus meal suggestions, recipes and exercise tips." },
    ],
  },
  {
    category: "Hormone Therapy",
    items: [
      { name: "BHRT for women", price: "$199 start", note: "Perimenopause, menopause, PCOS and PMDD. Intake, labs and review included." },
      { name: "Testosterone therapy for men", note: "Injection, cream, capsule or patch, built on a full hormone panel." },
      { name: "Testosterone therapy for women", note: "For low libido, energy and drive, guided by labs." },
    ],
  },
  {
    category: "Wellness & Aesthetics",
    items: [
      { name: "NAD+ injections", note: "Energy, focus, metabolism and skin, with no IV needed." },
      { name: "IV hydration & nutrient therapy", note: "Vitamin and electrolyte cocktails tailored to you." },
      { name: "Lipodissolve", note: "Non-surgical reduction of small fat pockets: chin, arms, abdomen." },
      { name: "Hair restoration", note: "Finasteride, minoxidil and biotin, in person or by telemedicine." },
    ],
  },
  {
    category: "Primary Care",
    items: [
      { name: "Wellness exams", note: "Regular check-ups that catch issues early." },
      { name: "Chronic disease management", note: "Diabetes, hypertension and more." },
      { name: "Sick visits", note: "Flu, sinus infections, sore throat, pink eye, allergies, STI treatment." },
      { name: "Sports physicals", note: "School, sports and camp ready." },
      { name: "Telemedicine visits", note: "Care from home when it fits your schedule." },
    ],
  },
]

export const products = [
  {
    name: "Fullscript supplements",
    description: "Practitioner-recommended supplements delivered to your door, easy to refill.",
    image: "/biz/supplements.jpg",
    href: "https://us.fullscript.com/welcome/kadams1/store-start",
  },
  {
    name: "UNJURY protein",
    description: "Medical-quality protein shakes and bars that support weight loss and recovery.",
    image: "/biz/unjury.jpg",
    href: "https://www.bariatricfusion.com/?rfsn=8725013.f9279a",
  },
  {
    name: "BioCare nutrition",
    description: "High-protein snacks and clean formulations, from gut health to immune support.",
    image: "/biz/biocare.jpg",
    href: "https://biocarenutrition.com/EVEXIANP",
  },
]
