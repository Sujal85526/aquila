export type Shape = "slim" | "rect" | "round" | "oval";

export interface Product {
  slug: string;
  name: string;
  price: number; // AED, VAT inclusive
  colour: string;
  shape: Shape;
  frame: string;
  frameDark: string;
  lens: string;
  lensDark: string;
  tortoise?: boolean;
  blurb: string;
  details: string[];
  materials: string[];
  size: { label: string; value: string }[];
}

const SHARED_MATERIALS = [
  "Frame: premium cellulose acetate, polished by hand",
  "Lenses: polarised, 100% UVA / UVB protection (category 3)",
  "Hardware: corrosion-resistant stainless steel hinges",
];

const SHARED_SIZE = [
  { label: "Lens width", value: "54 mm" },
  { label: "Bridge", value: "18 mm" },
  { label: "Temple length", value: "145 mm" },
  { label: "Fit", value: "Medium — suits most face shapes" },
];

export const products: Product[] = [
  {
    slug: "the-horizon",
    name: "The Horizon",
    price: 720,
    colour: "Midnight Black",
    shape: "slim",
    frame: "#16130f",
    frameDark: "#050403",
    lens: "#2a2724",
    lensDark: "#0d0c0b",
    blurb:
      "A low, wide silhouette drawn from the line where land meets sky. The Horizon is quiet, sharp and made to be worn every day.",
    details: [
      "Slim wrap rectangle silhouette",
      "Embossed AQUILA temple mark",
      "Delivered with hard case and microfibre cloth",
    ],
    materials: SHARED_MATERIALS,
    size: SHARED_SIZE,
  },
  {
    slug: "the-dune",
    name: "The Dune",
    price: 720,
    colour: "Tortoise Brown",
    shape: "rect",
    frame: "#6b3a1c",
    frameDark: "#2a140a",
    lens: "#6a4326",
    lensDark: "#2c1809",
    tortoise: true,
    blurb:
      "Inspired by the quiet strength of the desert, The Dune blends timeless design with everyday versatility. A refined silhouette made for those who see further.",
    details: [
      "Soft rectangle silhouette with a gently raised brow",
      "Hand-polished tortoise acetate — every pair is unique",
      "Delivered with hard case and microfibre cloth",
    ],
    materials: SHARED_MATERIALS,
    size: SHARED_SIZE,
  },
  {
    slug: "the-falcon",
    name: "The Falcon",
    price: 720,
    colour: "Black & Olive",
    shape: "round",
    frame: "#14120f",
    frameDark: "#040303",
    lens: "#4a5238",
    lensDark: "#1c2013",
    blurb:
      "Bold, rounded and decisive. The Falcon pairs a deep black frame with olive-green lenses for true-to-life contrast in strong light.",
    details: [
      "Rounded cushion silhouette",
      "Olive G-15 style lenses for natural colour",
      "Delivered with hard case and microfibre cloth",
    ],
    materials: SHARED_MATERIALS,
    size: SHARED_SIZE,
  },
  {
    slug: "the-oasis",
    name: "The Oasis",
    price: 720,
    colour: "Amber Sand",
    shape: "oval",
    frame: "#a9622d",
    frameDark: "#5a2f12",
    lens: "#9c5a2a",
    lensDark: "#4d2810",
    blurb:
      "Warm, translucent and softly curved — The Oasis catches the light like sand at golden hour.",
    details: [
      "Soft oval silhouette in translucent amber acetate",
      "Warm brown lenses that lift shadows",
      "Delivered with hard case and microfibre cloth",
    ],
    materials: SHARED_MATERIALS,
    size: SHARED_SIZE,
  },
];

export const bySlug = (slug: string) => products.find((p) => p.slug === slug);

export const CARE_GUIDE = [
  "Clean lenses with the microfibre cloth supplied — never with paper towels or clothing.",
  "Rinse with lukewarm water and a drop of mild soap before wiping to remove sand and dust.",
  "Store in the hard case when not in use and avoid leaving frames on a car dashboard.",
  "Hold the frame with both hands when putting on or removing to protect the hinges.",
];

export const aed = (n: number) => `AED ${n.toLocaleString("en-AE")}`;

export const SHIPPING = {
  standard: { id: "standard", label: "UAE Wide Delivery", eta: "2–4 business days", price: 20 },
  express: { id: "express", label: "Express Delivery", eta: "1–2 business days", price: 40 },
} as const;

export const EMIRATES = [
  "Abu Dhabi",
  "Dubai",
  "Sharjah",
  "Ajman",
  "Umm Al Quwain",
  "Ras Al Khaimah",
  "Fujairah",
];

export const CONTACT = {
  email: "aquila.ae1@gmail.com",
  instagramHandle: "@aquila.ae",
  instagramUrl: "https://www.instagram.com/aquila.ae",
};
