import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { products } from "@/lib/products";
import { ProductCard } from "../product-card";
import { Reveal } from "../reveal";

export function Collection() {
  return (
    <section className="bg-paper px-5 pb-6 pt-10 md:px-[5vw] md:pb-[1.4vw] md:pt-[2.6vw]" aria-labelledby="collection-title">
      <h2 id="collection-title" className="eyebrow text-center text-[12px] font-normal tracking-[0.34em] md:text-[clamp(12px,1vw,16px)]">The Collection</h2>
      <Reveal stagger={0.12} className="mx-auto mt-6 grid max-w-[1700px] grid-cols-2 gap-x-3 gap-y-8 md:mt-[1.6vw] md:grid-cols-4 md:gap-x-[1.5vw]">
        {products.map((p) => (
          <ProductCard key={p.slug} p={p} />
        ))}
      </Reveal>
      <div className="mx-auto mt-5 flex max-w-[1700px] justify-center md:mt-[0.6vw] md:justify-end">
        <Link href="/shop" className="eyebrow link-underline inline-flex items-center gap-3 pb-1 text-[10px] tracking-[0.22em]">
          View all <ArrowRight size={14} strokeWidth={1.2} />
        </Link>
      </div>
    </section>
  );
}
