// Single source of truth for the business details shown on the site.
// CONCEPT DEMO: Meridian is a fictional clinic. Names, addresses and phone numbers are placeholders
// (555 numbers are reserved for fiction), so nothing here identifies a real business or person.

export const business = {
  name: "Meridian",
  fullName: "Meridian Weight Loss & Wellness Clinic",
  shortName: "Meridian",
  type: "Medical Weight Loss & Hormone Therapy Clinic",
  owner: "Dana",
  ownerShort: "Dana",
  credentials: "Nurse Practitioner",
  phoneDisplay: "(555) 010-0123",
  phoneHref: "tel:+15550100123",
  tagline: "Make your health a priority now, on your terms, with a team that listens.",
  city: "Springfield",
  telemed: "Telemedicine visits available by appointment.",
  demoNote: "Concept demo · fictional clinic",
} as const

export type Hours = { day: string; short: string; open: string; close: string; label: string }

const closed = (day: string, short: string): Hours => ({ day, short, open: "", close: "", label: "Closed" })

export const locations = [
  {
    id: "main-street",
    name: "Main Street",
    street: "100 Main Street",
    city: "Springfield",
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
    id: "riverside",
    name: "Riverside",
    street: "200 River Road, Suite 2",
    city: "Springfield",
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

export const addressOf = (l: Location) => `${l.street}, ${l.city}`

export const fullAddress = addressOf(locations[0])

// Days the main office is open (for JSON-LD and the agent)
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
  insurance: "Primary care accepts most major insurance plans.",
  referral: "No referral needed.",
  disclaimer:
    "Compounded GLP-1/GIP medications come from specialty compounding pharmacies and are not the brand-name drugs. Not every treatment is right for everyone; eligibility is decided by a licensed provider. Results vary by individual.",
}

export type MenuItem = { name: string; price?: string; note?: string }

export const menu: { category: string; items: MenuItem[] }[] = [
  {
    category: "Medical Weight Loss",
    items: [
      { name: "GLP-1 or dual-action GLP-1/GIP injections", note: "Weekly injections that curb appetite so you feel fuller longer." },
      { name: "Lipotropic injections", note: "Amino acids and B complex that help turn fat and sugar into energy." },
      { name: "Phentermine", note: "Short-term appetite support, with diet and exercise." },
      { name: "Naltrexone-bupropion", note: "Targets hunger and cravings, including emotional eating." },
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
      { name: "Fat-dissolving injections", note: "Non-surgical reduction of small fat pockets: chin, arms, abdomen." },
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
    name: "Practitioner-grade supplements",
    description: "Provider-recommended supplements delivered to your door, easy to refill.",
    image: "/biz/supplements.jpg",
  },
  {
    name: "Medical-quality protein",
    description: "Protein shakes that support weight loss and recovery between meals.",
    image: "/biz/protein-shake.jpg",
  },
  {
    name: "High-protein snacks",
    description: "Clean, high-protein bars for busy days, picked to fit your plan.",
    image: "/biz/protein-bar.jpg",
  },
]
