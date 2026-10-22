"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { aed, type Product } from "@/lib/products";
import { Glasses } from "./glasses";

export function ProductCard({ p, tone = "paper" }: { p: Product; tone?: "paper" | "tile" }) {
  const art = useRef<HTMLDivElement>(null);
  const move = (e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(art.current, { rotateY: x * 14, rotateX: -y * 8, y: -6, duration: 0.5, ease: "power2.out" });
  };
  const leave = () => gsap.to(art.current, { rotateY: 0, rotateX: 0, y: 0, duration: 0.7, ease: "power3.out" });
  return (
    <Link href={`/products/${p.slug}`} className="group block text-center" onMouseMove={move} onMouseLeave={leave}>
      <div className={`grid aspect-[16/9] place-items-center px-[6%] [perspective:900px] ${tone === "tile" ? "bg-[#ece3d3]" : ""}`}>
        <div ref={art} className="w-full will-change-transform">
          <Glasses product={p} className="w-full" />
        </div>
      </div>
      <h3 className="eyebrow mt-4 tracking-[0.24em] text-ink">{p.name}</h3>
      <p className="mt-2 text-[11px] tracking-[0.2em] text-taupe">{aed(p.price)}</p>
    </Link>
  );
}
