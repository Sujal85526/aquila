import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { ProductCard } from "@/components/product-card";
import { CardsReveal } from "@/components/cards-reveal";
import { products } from "@/lib/products";

export const metadata: Metadata = { title: "The Collection" };

export default function Shop() {
  return (
    <PageShell eyebrow="Shop" title="The collection">
      <CardsReveal className="grid grid-cols-2 gap-x-4 gap-y-14 md:grid-cols-4 md:gap-x-8">
        {products.map((p) => (
          <ProductCard key={p.slug} p={p} tone="tile" />
        ))}
      </CardsReveal>
    </PageShell>
  );
}
