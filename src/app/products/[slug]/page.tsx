import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Gallery } from "@/components/product/gallery";
import { Purchase } from "@/components/product/purchase";
import { ProductCard } from "@/components/product-card";
import { CardsReveal } from "@/components/cards-reveal";
import { bySlug, products } from "@/lib/products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const p = bySlug((await params).slug);
  return { title: p?.name ?? "Product", description: p?.blurb };
}

export default function ProductPage({ params }: PageProps<"/products/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-dvh" />}>
      <ProductContent params={params} />
    </Suspense>
  );
}

async function ProductContent({ params }: Pick<PageProps<"/products/[slug]">, "params">) {
  const product = bySlug((await params).slug);
  if (!product) notFound();
  return (
    <div className="pt-[var(--header-h)]">
      <div className="mx-auto grid max-w-[1480px] gap-10 px-5 py-8 md:grid-cols-[1.45fr_1fr] md:gap-14 md:px-12 md:py-10 lg:gap-20">
        <Gallery key={`g-${product.slug}`} product={product} />
        <Purchase key={`p-${product.slug}`} product={product} />
      </div>
      <section className="mx-auto max-w-[1480px] px-5 pb-20 pt-10 md:px-12" aria-labelledby="related">
        <h2 id="related" className="eyebrow mb-10 text-center text-[13px] tracking-[0.34em]">You may also like</h2>
        <CardsReveal className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
          {products.map((p) => (
            <ProductCard key={p.slug} p={p} tone="tile" />
          ))}
        </CardsReveal>
      </section>
    </div>
  );
}
