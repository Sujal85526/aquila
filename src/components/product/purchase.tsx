"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { Box, Plus, ShieldCheck, Truck } from "lucide-react";
import { ACCORDIONS, TBC, aed, products, type Product } from "@/lib/products";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { whenReady } from "@/lib/ready";
import { Magnetic, SplitHeading } from "../motion";
import { useCart } from "@/lib/cart";

export function Purchase({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const items = root.current!.querySelectorAll("[data-in]");
      gsap.set(items, { autoAlpha: 0, y: 22 });
      const off = whenReady(() => gsap.to(items, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.07, delay: 0.35, ease: "expo.out" }));
      return () => off();
    },
    { scope: root },
  );

  // The product image shrinks and arcs into the bag icon, then the bag opens.
  const addToBag = () => {
    const bag = document.querySelector<HTMLElement>('button[aria-label="Open bag"]');
    const img = document.querySelector<HTMLImageElement>("[data-stage-img] img");
    if (!bag || !img || prefersReducedMotion()) {
      add(product.slug);
      return;
    }
    const from = img.getBoundingClientRect();
    const to = bag.getBoundingClientRect();
    const size = Math.min(from.width, 260);
    const ghost = document.createElement("div");
    Object.assign(ghost.style, {
      position: "fixed",
      zIndex: "130",
      pointerEvents: "none",
      left: `${from.left + from.width / 2 - size / 2}px`,
      top: `${from.top + from.height / 2 - size / 2}px`,
      width: `${size}px`,
      height: `${size}px`,
      background: `#ede8e2 url(${img.currentSrc}) center / cover`,
      boxShadow: "0 18px 40px rgba(36,30,26,0.35)",
    });
    document.body.appendChild(ghost);
    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height / 2 - (from.top + from.height / 2);
    gsap.timeline({ onComplete: () => { ghost.remove(); add(product.slug); } })
      .to(ghost, { x: dx, duration: 0.95, ease: "power2.inOut" }, 0)
      .to(ghost, { y: dy, duration: 0.95, ease: "back.in(1.2)" }, 0)
      .to(ghost, { scale: 0.08, rotate: 14, duration: 0.95, ease: "power2.in" }, 0)
      .to(ghost, { autoAlpha: 0, duration: 0.2 }, 0.78);
  };

  return (
    <div ref={root} className="md:sticky md:top-[calc(var(--header-h)+24px)] md:self-start">
      <p data-in className="eyebrow text-[10px] text-taupe">{product.name}</p>
      <SplitHeading as="h1" delay={0.3} className="display mt-3 text-[clamp(36px,4.4vw,56px)]">{product.name}</SplitHeading>
      <p data-in className="mt-3 text-[20px] tracking-[0.08em]">{aed(product.price)}</p>
      <p data-in className="mt-5 text-[13px] leading-[1.9] tracking-[0.06em] text-ink/70">{product.blurb}</p>

      <div data-in className="mt-8 border-t border-ink/20 pt-6">
        <p className="eyebrow text-[10.5px]">Colour: <span className="font-normal">{product.colour}</span></p>
        <div className="mt-3 grid grid-cols-4 gap-2.5">
          {products.map((p) => (
            <Link key={p.slug} href={`/products/${p.slug}`} aria-label={`${p.name} — ${p.colour}`} aria-current={p.slug === product.slug} scroll={false}
              className={`relative block aspect-[1.65] overflow-hidden bg-[#ede8e2] transition ${p.slug === product.slug ? "outline outline-1 outline-offset-2 outline-ink" : "opacity-85 hover:opacity-100"}`}>
              <Image src={p.tile} alt="" fill sizes="100px" className="object-cover" />
            </Link>
          ))}
        </div>
      </div>

      <div data-in className="mt-7">
        <Magnetic className="!flex w-full" strength={0.08}>
          <button
            className="btn-solid"
            data-cursor="Add"
            onClick={() => {
              addToBag();
              setAdded(true);
              setTimeout(() => setAdded(false), 2200);
            }}
          >
            {added ? "Added to bag ✓" : "Add to bag"}
          </button>
        </Magnetic>
      </div>

      <div data-in className="mt-7 grid grid-cols-3 gap-3">
        {[
          { icon: ShieldCheck, t: "Premium quality", s: "Crafted to last" },
          { icon: Truck, t: "UAE wide delivery", s: "Express delivery in 1–3 business days" },
          { icon: Box, t: "Secure payment", s: "Safe & encrypted" },
        ].map(({ icon: Icon, t, s }) => (
          <div key={t} className="flex items-start gap-2.5">
            <Icon size={24} strokeWidth={0.9} className="mt-0.5 shrink-0" />
            <div>
              <p className="text-[8.5px] font-normal uppercase tracking-[0.14em]">{t}</p>
              <p className="mt-1 text-[8px] uppercase tracking-[0.14em] text-taupe">{s}</p>
            </div>
          </div>
        ))}
      </div>

      <div data-in className="mt-9 border-t border-ink/25">
        {ACCORDIONS.map((s) => {
          const isOpen = open === s.id;
          return (
            <div key={s.id} className="border-b border-ink/25">
              <button className="flex w-full items-center justify-between py-[18px] text-left" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : s.id)}>
                <span className="eyebrow text-[10.5px] tracking-[0.24em] text-ink/80">{s.label}</span>
                <Plus size={15} strokeWidth={1.1} className={`transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} />
              </button>
              <div className={`grid transition-all duration-500 ease-out ${isOpen ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <p className="overflow-hidden text-[12.5px] leading-[1.8] tracking-[0.04em] text-ink/70">{TBC}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
