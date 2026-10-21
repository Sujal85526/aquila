# AQUILA

E-commerce storefront for **Aquila**, a UAE-born sunglasses brand. Built from the *Aquila Brand Guidelines* deck.

**Stack:** Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · GSAP + ScrollTrigger · Lenis smooth scroll · Zustand cart

## Brand tokens

| Token | Value |
| --- | --- |
| Espresso | `#453D38` |
| Ivory | `#FAF0D7` |
| Headings | Playfair Display (stand-in for the editorial serif; the wordmark itself is the original artwork) |
| UI / body | Jost |

The wordmark is the original exported artwork, traced to `public/brand/aquila-logo.svg` — never retyped.

## Pages

`/` home · `/shop` · `/products/[slug]` · `/checkout` · `/order/confirmed` · `/our-story` · `/policy` · `/policy/shipping` · `/policy/returns`

## Run

```bash
npm install
npm run dev
```

## Status / TODO

- [ ] Replace illustrated placeholder product art (`src/components/glasses.tsx`) with real Aquila product photography
- [ ] Supabase: products, orders, customers (not connected yet)
- [ ] Payment provider + Apple Pay (checkout currently stores the order in the browser only; nothing is charged)
- [ ] Confirm final supporting colour HEX values, delivery timings and legal review of policy copy
