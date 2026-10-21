"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/products";
import { Glasses } from "../glasses";

const LIFESTYLE = [
  { src: "/photos/DSC00436.jpg", pos: "60% 20%", alt: "AQUILA temple detail" },
  { src: "/photos/DSC00712.jpg", pos: "65% 30%", alt: "Profile wearing Aquila" },
  { src: "/photos/DSC00403.jpg", pos: "50% 30%", alt: "Portrait wearing Aquila" },
  { src: "/photos/packaging-ref.jpg", pos: "50% 40%", alt: "Aquila packaging" },
];

export function Gallery({ product }: { product: Product }) {
  const [i, setI] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const count = LIFESTYLE.length + 1;
  const go = (n: number) => {
    const t = (n + count) % count;
    gsap.fromTo(stage.current, { opacity: 0.2, scale: 1.02 }, { opacity: 1, scale: 1, duration: 0.7, ease: "power2.out" });
    setI(t);
  };
  const thumb = (idx: number) =>
    idx === 0 ? (
      <div className="grid h-full w-full place-items-center bg-[#e9dfcd] p-2"><Glasses product={product} className="w-full" /></div>
    ) : (
      <Image src={LIFESTYLE[idx - 1].src} alt="" fill sizes="120px" className="object-cover" style={{ objectPosition: LIFESTYLE[idx - 1].pos }} />
    );

  return (
    <div className="grid gap-3 md:grid-cols-[88px_1fr] md:gap-4">
      <ul className="order-2 flex gap-2 overflow-x-auto md:order-1 md:flex-col" aria-label="Product images">
        {Array.from({ length: count }).map((_, idx) => (
          <li key={idx} className="shrink-0">
            <button
              onClick={() => go(idx)}
              aria-label={`Show image ${idx + 1}`}
              aria-current={idx === i}
              className={`relative block h-[84px] w-[84px] overflow-hidden border transition-colors md:h-[92px] md:w-[88px] ${idx === i ? "border-ink" : "border-transparent hover:border-ink/40"}`}
            >
              {thumb(idx)}
            </button>
          </li>
        ))}
      </ul>

      <div className="order-1 md:order-2">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#e9dfcd]">
          <div ref={stage} className="absolute inset-0">
            {i === 0 ? (
              <div className="grid h-full place-items-center bg-[radial-gradient(ellipse_at_50%_60%,#f3eadb_0%,#dccdb4_100%)] p-[8%]">
                <Glasses product={product} className="w-full drop-shadow-[0_24px_22px_rgba(60,40,25,0.25)]" />
              </div>
            ) : (
              <Image src={LIFESTYLE[i - 1].src} alt={LIFESTYLE[i - 1].alt} fill priority sizes="(min-width:768px) 50vw, 100vw" className="object-cover" style={{ objectPosition: LIFESTYLE[i - 1].pos }} />
            )}
          </div>
          <button aria-label="Previous image" onClick={() => go(i - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-paper/70 p-2 backdrop-blur transition hover:bg-paper"><ChevronLeft size={20} strokeWidth={1.2} /></button>
          <button aria-label="Next image" onClick={() => go(i + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-paper/70 p-2 backdrop-blur transition hover:bg-paper"><ChevronRight size={20} strokeWidth={1.2} /></button>
        </div>
        <div className="mt-3 hidden grid-cols-2 gap-3 md:grid">
          {[LIFESTYLE[0], LIFESTYLE[1]].map((l) => (
            <div key={l.src} className="relative aspect-[4/3] overflow-hidden">
              <Image src={l.src} alt={l.alt} fill sizes="25vw" className="object-cover transition-transform duration-[1400ms] hover:scale-105" style={{ objectPosition: l.pos }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
