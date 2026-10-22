/** Every real fact on the site comes from here (sources: lucky3petgrooming.com, all pages, October 2026). */

export const business = {
  name: "Lucky 3",
  fullName: "Lucky 3 Dog & Cat Grooming",
  type: "Dog & Cat Grooming · Matted & Difficult Pets",
  owner: "David Walter",
  assistant: "Beverly",
  phoneDisplay: "(410) 276-6666",
  phoneHref: "tel:+14102766666",
  email: "wirefur@outlook.com",
  website: "https://www.lucky3petgrooming.com",
  tagline: "Old-school grooming, done by hand.",
  address: {
    street: "534 S Conkling St",
    city: "Baltimore",
    state: "MD",
    zip: "21224",
    neighborhood: "Highlandtown / Canton",
  },
  geo: { lat: 39.2857031, lng: -76.5674002 }, // OpenStreetMap geocode of the street address
  hours: "By appointment. Call to book.",
  offer: {
    title: "1 free gift for new customers",
    detail: "With a complete bath & haircut (ask when you book). Values up to $20.",
    ends: "Ends December 31, 2026",
  },
} as const

export const fullAddress = `${business.address.street}, ${business.address.city}, ${business.address.state} ${business.address.zip}`
export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
export const mapsEmbed = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&z=15&output=embed`

export const services = [
  {
    id: "dog",
    title: "Dog grooming",
    tag: "Bath · haircut · hand-scissored",
    body: "Soft coats blow-dried by hand, combed and hand-scissored many times for a smooth, even finish. 2 to 4 times the labor of a typical shop.",
    price: "Priced by size & coat",
    image: "/biz/shop-table-schnauzer.jpg",
    alt: "A freshly groomed dog standing on the grooming table at Lucky 3",
  },
  {
    id: "matted",
    title: "Matted & difficult dogs",
    tag: "The dogs other groomers turn away",
    body: "Severely matted, nervous, elderly or injured dogs, handled slowly with holding techniques David developed himself.",
    price: "Book ahead, extra time",
    image: "/biz/matted-coat.jpg",
    alt: "A heavily matted dog before grooming at Lucky 3",
  },
  {
    id: "cat",
    title: "Cat grooming",
    tag: "One of the few shops that still clips cats",
    body: "Bath, nails, ears and brushing, or a full clip, for a limited number of cats. First visits, the owner stays nearby.",
    price: "From $70",
    image: "/biz/cat-tree.jpg",
    alt: "Cats resting on a tall cat tree",
  },
  {
    id: "color",
    title: "Color & finishing",
    tag: "Head, tail or ears",
    body: "Add a little personality after the groom with semi-permanent color.",
    price: "Usually $10 extra",
    image: "/biz/fresh-groom-shop.jpg",
    alt: "A freshly groomed dog in the Lucky 3 shop",
  },
] as const

/** The groom, step by step (real grooming footage, Mixkit free license) */
export const steps = [
  { n: "01", title: "Look before we clip", body: "Every pet is assessed for coat, age, skin and temperament before a single tool comes out.", video: "/biz/groom-brush.mp4", poster: "/biz/groom-brush.jpg" },
  { n: "02", title: "A real bath", body: "Shampooed and rinsed by hand. We bathe around casts and sore spots without getting them wet.", video: "/biz/groom-bath.mp4", poster: "/biz/groom-bath.jpg" },
  { n: "03", title: "Hand blow-dry", body: "Soft coats dried by hand for extra fluff and shine, never just left in a cage dryer.", video: "/biz/groom-towel.mp4", poster: "/biz/groom-towel.jpg" },
  { n: "04", title: "Comb & hand-scissor", body: "Combed and scissored many times over for a smooth, even finish. No 15-minute shortcuts.", video: "/biz/groom-scissor.mp4", poster: "/biz/groom-scissor.jpg" },
  { n: "05", title: "Nails, ears & eyes", body: "Nails trimmed, ears cleaned, face tidied. Gentle hands, and grooming injuries are rare.", video: "/biz/groom-nails.mp4", poster: "/biz/groom-nails.jpg" },
] as const

export const catPrices = [
  { name: "Bath, nails, ears & brushing", price: "from $70", note: "Longhaired cats extra for blow-drying and combing. Dematting extra." },
  { name: "Nails & full clip", price: "from $100", note: "" },
  { name: "Full clip with bath", price: "from $120", note: "Higher for more complex grooms." },
] as const

export const catPolicy = [
  "Cash in advance for cat grooming. If your cat is too difficult to handle, everything is refunded except $15 for nails if only that was done.",
  "On a first visit, the owner stays while we clip, and is on the property while the bath starts.",
  "If your cat hisses, panics or bites at the vet, ask your vet about a sedative (about $1 a pill) before the visit.",
] as const

/** Real cases from the shop's own pages */
export const stories = [
  {
    title: "The mummy Lhasa",
    body: "A vet sent us a Lhasa Apso that hadn't had a haircut in 7 years, encased in mats from head to toe. We gave him a safe, successful groom.",
  },
  {
    title: "The poodle in a cast",
    body: "A rescued poodle mix came in after leg surgery, cast and all. We clipped and bathed the whole dog without a drop of water in the cast. The owner and vet were astounded.",
  },
  {
    title: "The Bichon nobody could handle",
    body: "We've groomed an aggressive Bichon for years. After a back injury he arrived matted, in a carrier. We moved him safely through the whole groom, with no injury to him or us.",
  },
] as const

export const perks = [
  { title: "No vaccine records needed", body: "We don't require vaccination or other records to groom your pet." },
  { title: "Recommended by vets", body: "Widely recommended by veterinarians across Maryland, with no referral deals." },
  { title: "Driving in? About 2 hours", body: "Call before you arrive and out-of-area pets are fully groomed in about two hours." },
  { title: "Street parking", body: "Usually available within 2 blocks. Wait at the library across the street, or shop nearby." },
] as const

export const team = [
  {
    name: "David Walter",
    role: "Owner & groomer",
    body: "Trained at the New York School of Dog Grooming in Manhattan. Author of Dog Grooming and Pet Care: Doing It With Style, featured in Globe magazine.",
  },
  {
    name: "Beverly",
    role: "Groomer, 20+ years with David",
    body: "Trained in Georgetown, Washington DC, and known across the region for quality work.",
  },
] as const

export const book = {
  title: "Dog Grooming and Pet Care: Doing It With Style",
  author: "David Walter",
  body: "56 chapters and over 100 pictures and cartoons: fleas and ticks, skin irritation, choosing a style, and easy ways to handle uncooperative pets, give medicine, clean ears and cut nails.",
  quote:
    "The style your dog receives from a grooming shop will depend on the creativity of the dog groomer and his experience with different styles and textures.",
  image: "/biz/book-cover.jpg",
} as const

export const shop = {
  intro:
    "We buy closeouts and special deals from suppliers across the country and pass the savings on. Collars, harnesses and sweaters are fitted by a groomer.",
  regulars: "Regular customers get 50%–75% off our large selection of pet supplies.",
  deals: [
    { name: "Dog self-feeders", price: "60% off" },
    { name: "Shampoo-eeze grooming gloves", price: "$4.99", was: "$18" },
    { name: "Fresh-n-clean 12 oz cologne", price: "$9.99" },
    { name: "Dress harness with leash", price: "Half price" },
    { name: "Pet picture frames", price: "$10" },
    { name: "Comic dog & cat doormats", price: "$16" },
  ],
  more: [
    "Dog cages",
    "Stainless dishes",
    "Pet beds & pillows",
    "Cat scratching posts",
    "3-in-1 stroller, car seat & carrier",
    "Coats & sweaters",
    "Dresses with matching hats",
    "Glow collars & leashes",
    "ID tags",
    "Flea & tick products",
    "De-matting products",
    "Peanut butter, carob & cheese dog cookies",
  ],
  photos: [
    { src: "/biz/shop-toys.jpg", alt: "Dog toys, bones and balls for sale at Lucky 3" },
    { src: "/biz/shop-socks.jpg", alt: "Pet-themed socks for sale at Lucky 3" },
  ],
} as const
