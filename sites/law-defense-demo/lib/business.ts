// Calder & Reyes, LLC is a FICTIONAL firm: this site is a concept template for Baltimore criminal defense
// practices. Names, portraits (AI-generated), phone numbers and email are made up (555 numbers are reserved
// for fiction). The attorney bios are sample content modeled on a typical Baltimore defense career; the
// Maryland law facts are real and cited.

export const business = {
  name: "Calder & Reyes",
  fullName: "Calder & Reyes, LLC",
  type: "Criminal Defense & Personal Injury",
  tagline: "Baltimore's trial-tested criminal defense firm.",
  phoneDisplay: "(555) 010-0192",
  phoneHref: "tel:+15550100192",
  email: "intake@calderreyes.example",
  address: "Saint Paul Street, Downtown Baltimore",
  city: "Baltimore",
  hours: "Calls answered 24/7 · Office Mon–Fri, 8:30 AM – 6 PM",
  demoNote: "Concept template · fictional firm",
} as const

export const stats = [
  { value: "150+", label: "jury trials to verdict" },
  { value: "35", label: "years in Maryland courts" },
  { value: "1,000s", label: "of cases handled" },
  { value: "24/7", label: "calls answered" },
] as const

export const attorneys = [
  {
    name: "Richard M. Calder",
    role: "Managing Partner",
    photo: "/biz/attorney-senior.jpg",
    bio: [
      "Represents clients facing everything from first-degree murder to simple possession, DUI/DWI, jailable traffic charges, and parole and probation violations. Known across the Maryland bar for complex sentencing matters.",
      "Spent 19 years at a busy Baltimore defense and injury practice handling thousands of cases before founding his own firm, which became Calder & Reyes. Nearly 35 years in, he has tried more than 150 jury trials to verdict.",
    ],
    admissions: ["Maryland, 1992", "U.S. District Court for the District of Maryland, 1993"],
    education: ["University of Baltimore School of Law, J.D. with honors, 1992", "Towson State University, B.S., 1989"],
    memberships: ["Maryland State Bar Association", "Maryland Criminal Defense Attorneys' Association"],
  },
  {
    name: "Daniel A. Reyes",
    role: "Partner",
    photo: "/biz/attorney-partner.jpg",
    bio: [
      "Handles criminal defense, DUI/DWI and personal injury cases in courts across Maryland, with a focus on early investigation and keeping cases out of trial when that serves the client.",
    ],
    admissions: ["Maryland"],
    education: [],
    memberships: ["Maryland State Bar Association"],
  },
] as const

/** "What are you facing?" — real Maryland law, summarized; not legal advice. */
export const charges = [
  {
    id: "criminal",
    name: "Criminal charges",
    headline: "From misdemeanors to felonies.",
    facts: [
      "You have the right to an attorney at every critical stage, including bail review.",
      "Anything you say to police can be used against you. Say you want a lawyer, then stop talking.",
      "Many Maryland cases start in District Court and can move to Circuit Court for a jury trial.",
    ],
    source: "U.S. Const. amends. V & VI; Maryland Rules",
  },
  {
    id: "dui",
    name: "DUI / DWI",
    headline: "Your license and your record.",
    facts: [
      "A first DUI in Maryland carries up to 1 year in jail and a $1,000 fine. A first DWI, up to 60 days and $500.",
      "A DUI conviction adds 12 points to your license. A DWI adds 8.",
      "You have a short window after arrest to request an MVA hearing on your license, so call quickly.",
    ],
    source: "Md. Code, Transp. §§ 21-902, 27-101, 16-402",
  },
  {
    id: "traffic",
    name: "Jailable traffic",
    headline: "Not every ticket is just a ticket.",
    facts: [
      "Some traffic charges, like driving on a suspended license, can carry jail time.",
      "Paying a ticket can count as a guilty plea and add points.",
      "We review the charge before you pay or appear.",
    ],
    source: "Md. Code, Transp. § 16-303",
  },
  {
    id: "probation",
    name: "Parole & probation",
    headline: "A violation isn't automatically jail.",
    facts: [
      "You get a hearing before probation can be revoked.",
      "Judges can continue probation, add conditions or impose part of a suspended sentence.",
      "What you bring to that hearing (treatment, work, compliance) matters.",
    ],
    source: "Maryland Rule 4-347",
  },
  {
    id: "injury",
    name: "Personal injury",
    headline: "The clock starts on the day you're hurt.",
    facts: [
      "Most Maryland injury claims must be filed within 3 years.",
      "Maryland follows contributory negligence: if you're found even 1% at fault, you can be barred from recovering.",
      "Get photos, names and medical records early.",
    ],
    source: "Md. Code, Cts. & Jud. Proc. § 5-101",
  },
] as const

/** "If you're stopped" — general know-your-rights points (not legal advice). */
export const rights = [
  { title: "Stay calm and keep your hands visible.", body: "Don't run, resist or argue, even if you think the stop is unfair." },
  { title: "You can stay silent.", body: "Say \"I want to remain silent and I want a lawyer.\" Then stop talking." },
  { title: "You don't have to consent to a search.", body: "Say \"I don't consent to searches.\" Don't physically resist." },
  { title: "Ask if you're free to leave.", body: "If they say yes, walk away calmly. If not, you're being detained." },
  { title: "Don't sign or explain without a lawyer.", body: "Call us before giving any statement." },
] as const
