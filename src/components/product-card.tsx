"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP, hasFinePointer, prefersReducedMotion } from "@/lib/gsap";
import { aed, type Product } from "@/lib/products";
import { Scramble } from "./motion";

/** `paper`: transparent render on the page (home). `tile`: render on its own light tile (product page, shop). */
export function ProductCard({ p, tone = "paper" }: { p: Product; tone?: "paper" | "tile" }) {
  const root = useRef<HTMLAnchorElement>(null);
  const float = useRef<HTMLDivElement>(null);
  const art = useRef<HTMLDivElement>(null);

  // idle float, offset per card so the row never moves in unison
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.to(float.current, { y: -5, duration: 2.4 + Math.random() * 1.2, ease: "sine.inOut", yoyo: true, repeat: -1, delay: Math.random() * 1.5 });
    },
    { scope: root },
  );

  const move = (e: React.MouseEvent) => {
    if (!hasFinePointer()) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(art.current, { rotateY: x * 16, rotateX: -y * 8, scale: 1.06, duration: 0.6, ease: "power3.out", overwrite: "auto" });
  };
  const leave = () => gsap.to(art.current, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.9, ease: "elastic.out(1,0.6)", overwrite: "auto" });

  return (
    <Link ref={root} href={`/products/${p.slug}`} data-cursor="View" className="group block text-center" onMouseMove={move} onMouseLeave={leave}>
      <div className="[perspective:900px]">
        <div ref={float} className="will-change-transform">
          <div ref={art} className="will-change-transform">
            <Image src={tone === "tile" ? p.tile : p.img} alt={`${p.name} sunglasses`} width={1176} height={408} sizes="(min-width:768px) 25vw, 50vw" className="h-auto w-full" />
          </div>
        </div>
      </div>
      <h3 className="eyebrow mt-2 text-[10px] font-normal tracking-[0.22em] text-ink md:text-[10.5px]">
        <Scramble text={p.name.toUpperCase()} hover />
      </h3>
      <p className="mt-2 text-[10px] tracking-[0.2em] text-taupe">{aed(p.price)}</p>
    </Link>
  );
}
