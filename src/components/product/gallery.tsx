"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/products";

interface Shot {
  src: string;
  thumb: string;
  alt: string;
  fit?: "cover" | "contain";
}

/** The Dune page uses the exact imagery from the brand deck mockup; other products reuse their render + real photography. */
function shotsFor(p: Product): { shots: Shot[]; details: string[] } {
  if (p.slug === "the-dune") {
    return {
      shots: [
        { src: "/deck/dune-rock-clean.webp", thumb: "/deck/dune-thumb-0.webp", alt: "The Dune on desert rock" },
        { src: "/deck/dune-detail-a.webp", thumb: "/deck/dune-thumb-1.webp", alt: "The Dune temple, side view" },
        { src: "/deck/dune-detail-b.webp", thumb: "/deck/dune-thumb-2.webp", alt: "AQUILA temple detail" },
        { src: "/deck/dune-thumb-3.webp", thumb: "/deck/dune-thumb-3.webp", alt: "Wearing The Dune" },
        { src: "/deck/dune-thumb-4.webp", thumb: "/deck/dune-thumb-4.webp", alt: "Aquila packaging" },
      ],
      details: ["/deck/dune-detail-a.webp", "/deck/dune-detail-b.webp"],
    };
  }
  return {
    shots: [
      { src: p.tile, thumb: p.tile, alt: p.name, fit: "contain" },
      { src: "/photos/DSC00436.jpg", thumb: "/photos/DSC00436.jpg", alt: "AQUILA temple detail" },
      { src: "/photos/DSC00712.jpg", thumb: "/photos/DSC00712.jpg", alt: "Profile wearing Aquila" },
      { src: "/photos/DSC00403.jpg", thumb: "/photos/DSC00403.jpg", alt: "Portrait wearing Aquila" },
      { src: "/photos/packaging-ref.jpg", thumb: "/photos/packaging-ref.jpg", alt: "Aquila packaging" },
    ],
    details: ["/photos/DSC00436.jpg", "/photos/DSC00712.jpg"],
  };
}

export function Gallery({ product }: { product: Product }) {
  const { shots, details } = shotsFor(product);
  const [i, setI] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const go = (n: number) => {
    const t = (n + shots.length) % shots.length;
    gsap.fromTo(stage.current, { opacity: 0.2, scale: 1.02 }, { opacity: 1, scale: 1, duration: 0.7, ease: "power2.out" });
    setI(t);
  };
  const cur = shots[i];

  return (
    <div className="grid gap-3 md:grid-cols-[92px_1fr] md:gap-4">
      <ul className="order-2 flex gap-2 overflow-x-auto md:order-1 md:flex-col" aria-label="Product images">
        {shots.map((s, idx) => (
          <li key={s.src} className="shrink-0">
            <button
              onClick={() => go(idx)}
              aria-label={`Show image ${idx + 1}`}
              aria-current={idx === i}
              className={`relative block h-[84px] w-[84px] overflow-hidden border bg-[#ede8e2] transition-colors md:h-[92px] md:w-[92px] ${idx === i ? "border-ink" : "border-transparent hover:border-ink/40"}`}
            >
              <Image src={s.thumb} alt="" fill sizes="100px" className="object-cover" />
            </button>
          </li>
        ))}
      </ul>

      <div className="order-1 md:order-2">
        <div className="relative aspect-[631/460] overflow-hidden bg-[#ede8e2]">
          <div ref={stage} className="absolute inset-0">
            <Image src={cur.src} alt={cur.alt} fill priority sizes="(min-width:768px) 50vw, 100vw" className={cur.fit === "contain" ? "object-contain p-[6%]" : "object-cover"} />
          </div>
          <button aria-label="Previous image" onClick={() => go(i - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 text-ivory drop-shadow transition hover:scale-110"><ChevronLeft size={26} strokeWidth={1.1} /></button>
          <button aria-label="Next image" onClick={() => go(i + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-ivory drop-shadow transition hover:scale-110"><ChevronRight size={26} strokeWidth={1.1} /></button>
        </div>
        <div className="mt-2.5 hidden grid-cols-2 gap-2.5 md:grid">
          {details.map((src) => (
            <div key={src} className="relative aspect-[310/237] overflow-hidden">
              <Image src={src} alt="" fill sizes="25vw" className="object-cover transition-transform duration-[1400ms] hover:scale-105" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
