export interface Product {
  slug: string;
  name: string;
  price: number; // AED, VAT inclusive
  colour: string;
  /** product render on a transparent background (home / shop) */
  img: string;
  /** same render on its light tile background (product page, bag, checkout) */
  tile: string;
  blurb: string;
}

const BLURB = "A refined silhouette made for those who see further.";

export const products: Product[] = [
  { slug: "the-horizon", name: "The Horizon", price: 720, colour: "Black", img: "/deck/product-0.webp", tile: "/deck/product-tile-0.webp", blurb: BLURB },
  {
    slug: "the-dune",
    name: "The Dune",
    price: 720,
    colour: "Tortoise Brown",
    img: "/deck/product-1.webp",
    tile: "/deck/product-tile-1.webp",
    blurb:
      "Inspired by the quiet strength of the desert, The Dune blends timeless design with everyday versatility. A refined silhouette made for those who see further.",
  },
  { slug: "the-falcon", name: "The Falcon", price: 720, colour: "Black & Green", img: "/deck/product-2.webp", tile: "/deck/product-tile-2.webp", blurb: BLURB },
  { slug: "the-oasis", name: "The Oasis", price: 720, colour: "Amber Brown", img: "/deck/product-3.webp", tile: "/deck/product-tile-3.webp", blurb: BLURB },
];

/** Product-page accordions. The brand deck lists these sections but supplies no copy yet. */
export const TBC = "Details will be confirmed before launch.";
export const ACCORDIONS = [
  { id: "details", label: "Product details" },
  { id: "materials", label: "Materials" },
  { id: "size", label: "Size & fit" },
  { id: "care", label: "Care guide" },
];

export const bySlug = (slug: string) => products.find((p) => p.slug === slug);

export const aed = (n: number) => `AED ${n.toLocaleString("en-AE")}`;

export const SHIPPING = {
  standard: { id: "standard", label: "UAE Wide Delivery", eta: "2–4 business days", price: 20 },
  express: { id: "express", label: "Express Delivery", eta: "1–3 business days", price: 40 },
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
