"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { aed, type Product } from "@/lib/products";

/** `paper`: transparent render on the page (home). `tile`: render on its own light tile (product page, shop). */
export function ProductCard({ p, tone = "paper" }: { p: Product; tone?: "paper" | "tile" }) {
  const art = useRef<HTMLDivElement>(null);
  const move = (e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(art.current, { rotateY: x * 12, rotateX: -y * 6, y: -5, duration: 0.5, ease: "power2.out", overwrite: "auto" });
  };
  const leave = () => gsap.to(art.current, { rotateY: 0, rotateX: 0, y: 0, duration: 0.7, ease: "power3.out", overwrite: "auto" });
  return (
    <Link href={`/products/${p.slug}`} className="group block text-center" onMouseMove={move} onMouseLeave={leave}>
      <div className="[perspective:900px]">
        <div ref={art} className="will-change-transform">
          <Image
            src={tone === "tile" ? p.tile : p.img}
            alt={`${p.name} sunglasses`}
            width={1176}
            height={408}
            sizes="(min-width:768px) 25vw, 50vw"
            className="h-auto w-full"
          />
        </div>
      </div>
      <h3 className="eyebrow mt-2 text-[10px] font-normal tracking-[0.22em] text-ink md:text-[10.5px]">{p.name}</h3>
      <p className="mt-2 text-[10px] tracking-[0.2em] text-taupe">{aed(p.price)}</p>
    </Link>
  );
}
