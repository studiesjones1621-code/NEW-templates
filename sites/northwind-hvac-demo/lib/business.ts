// Northwind Heating & Air is a FICTIONAL business: this site is a concept demo, so the name, address and
// phone number below are made up (555 numbers are reserved for fiction). The HVAC facts are real.

export const business = {
  name: "Northwind",
  fullName: "Northwind Heating & Air",
  type: "Heating, Cooling & Air Quality",
  phoneDisplay: "(555) 010-0144",
  phoneHref: "tel:+15550100144",
  city: "Springfield",
  area: "Springfield and surrounding towns",
  address: "100 Main Street, Springfield",
  hours: "Office Mon–Sat, 7 AM – 7 PM · Emergency calls answered 24/7",
  demoNote: "Concept demo · fictional business",
} as const

/** Labels that light up on the x-ray condenser */
export const parts = [
  { id: "fan", label: "Condenser fan", note: "Blades, balance & motor bearings", x: 50, y: 22 },
  { id: "coil", label: "Copper coil", note: "Cleaned, fins straightened, leak-checked", x: 22, y: 50 },
  { id: "compressor", label: "Compressor", note: "Amp draw & start capacitor tested", x: 64, y: 70 },
  { id: "charge", label: "Refrigerant charge", note: "Pressures measured against spec", x: 82, y: 46 },
] as const

/** "Which one fits your house?" */
export const systems = [
  {
    id: "furnace",
    name: "Gas furnace",
    image: "/biz/u-furnace.jpg",
    alt: "A white high-efficiency gas furnace",
    pitch: "Fast, strong heat for cold winters. Pairs with central air for summer.",
    bestFor: "Homes with natural gas and existing ducts",
    life: "15–20 yrs",
    efficiency: "Up to 98% AFUE",
  },
  {
    id: "heatpump",
    name: "Heat pump",
    image: "/biz/u-heatpump.jpg",
    alt: "A white air-source heat pump outdoor unit",
    pitch: "One system that heats and cools by moving heat instead of burning fuel.",
    bestFor: "All-electric homes and mixed climates",
    life: "10–15 yrs",
    efficiency: "2 in 1: heat + A/C",
  },
  {
    id: "minisplit",
    name: "Ductless mini-split",
    image: "/biz/u-minisplit.jpg",
    alt: "A white ductless mini-split indoor and outdoor unit",
    pitch: "Room-by-room comfort with no ductwork. Quiet and easy to add on.",
    bestFor: "Additions, attics, garages and older homes without ducts",
    life: "15–20 yrs",
    efficiency: "Zoned, no duct losses",
  },
] as const

export const services = [
  { title: "Heating repair", body: "Furnaces, boilers and heat pumps. Same-day when we can." },
  { title: "A/C repair", body: "Warm air, frozen coils, short cycling, strange noises." },
  { title: "Tune-ups", body: "A seasonal check of every part on the x-ray above." },
  { title: "New systems", body: "Free in-home estimate and sizing for your house, not a guess." },
  { title: "Ductwork & sealing", body: "Find and seal the leaks that waste your air." },
  { title: "Indoor air quality", body: "Filters, humidifiers, purifiers and fresh-air ventilation." },
] as const
