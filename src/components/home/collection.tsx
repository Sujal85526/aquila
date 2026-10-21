import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { products } from "@/lib/products";
import { ProductCard } from "../product-card";
import { Reveal } from "../reveal";

export function Collection() {
  return (
    <section className="bg-paper px-6 pb-10 pt-14 md:px-12 md:pb-12 md:pt-16" aria-labelledby="collection-title">
      <h2 id="collection-title" className="eyebrow text-center text-[13px] tracking-[0.34em]">The Collection</h2>
      <Reveal stagger={0.12} className="mx-auto mt-8 grid max-w-[1480px] grid-cols-2 gap-x-4 gap-y-10 md:mt-10 md:grid-cols-4 md:gap-x-8">
        {products.map((p) => (
          <ProductCard key={p.slug} p={p} />
        ))}
      </Reveal>
      <div className="mx-auto mt-6 flex max-w-[1480px] justify-center md:justify-end">
        <Link href="/shop" className="eyebrow link-underline inline-flex items-center gap-3 pb-1 tracking-[0.24em]">
          View all <ArrowRight size={14} strokeWidth={1.2} />
        </Link>
      </div>
    </section>
  );
}
