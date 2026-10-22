"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { aed, bySlug } from "@/lib/products";
import { Glasses } from "./glasses";

export function CartDrawer() {
  const { open, setOpen, lines, setQty, remove } = useCart();
  const panel = useRef<HTMLDivElement>(null);
  const veil = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted) gsap.set(panel.current, { translate: "none", x: 0, xPercent: 100 });
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = open ? "hidden" : "";
    if (open) {
      gsap.to(veil.current, { opacity: 1, duration: 0.4 });
      gsap.to(panel.current, { xPercent: 0, x: 0, duration: 0.6, ease: "power3.out" });
    } else {
      gsap.to(veil.current, { opacity: 0, duration: 0.3 });
      gsap.to(panel.current, { xPercent: 100, x: 0, duration: 0.45, ease: "power3.in" });
    }
  }, [open, mounted]);

  const items = lines.flatMap((l) => {
    const p = bySlug(l.slug);
    return p ? [{ ...l, p }] : [];
  });
  const subtotal = items.reduce((n, i) => n + i.p.price * i.qty, 0);

  return (
    <div className={open ? "" : "pointer-events-none"} aria-hidden={!open}>
      <div ref={veil} onClick={() => setOpen(false)} className="fixed inset-0 z-[70] bg-ink/50 opacity-0" />
      <aside
        ref={panel}
        data-lenis-prevent
        role="dialog"
        aria-label="Shopping bag"
        className="fixed right-0 top-0 z-[80] flex h-dvh w-full max-w-[440px] translate-x-full flex-col bg-paper text-ink shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-ink/15 px-6 py-6">
          <h2 className="eyebrow tracking-[0.3em]">Your bag ({items.reduce((n, i) => n + i.qty, 0)})</h2>
          <button aria-label="Close bag" onClick={() => setOpen(false)}>
            <X size={20} strokeWidth={1.2} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-8 text-center">
            <p className="font-serif text-3xl uppercase">Your bag is empty</p>
            <Link href="/shop" onClick={() => setOpen(false)} className="btn-outline text-espresso">
              <span>Shop the collection</span>
            </Link>
          </div>
        ) : (
          <>
            <ul data-lenis-prevent className="flex-1 divide-y divide-ink/10 overflow-y-auto px-6">
              {items.map(({ p, qty }) => (
                <li key={p.slug} className="flex gap-5 py-6">
                  <Link href={`/products/${p.slug}`} onClick={() => setOpen(false)} className="grid h-24 w-28 shrink-0 place-items-center bg-[#ece3d3] p-2">
                    <Glasses product={p} className="w-full" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <p className="eyebrow tracking-[0.22em]">{p.name}</p>
                    <p className="mt-1 text-[12px] text-taupe">{p.colour}</p>
                    <p className="mt-1 text-[13px]">{aed(p.price)}</p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center border border-ink/25">
                        <button aria-label="Decrease" className="p-2" onClick={() => setQty(p.slug, qty - 1)}><Minus size={12} /></button>
                        <span className="w-7 text-center text-[12px]">{qty}</span>
                        <button aria-label="Increase" className="p-2" onClick={() => setQty(p.slug, qty + 1)}><Plus size={12} /></button>
                      </div>
                      <button onClick={() => remove(p.slug)} className="text-[10px] uppercase tracking-[0.2em] text-taupe underline underline-offset-4">Remove</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-ink/15 px-6 py-6">
              <div className="mb-1 flex justify-between text-[13px]">
                <span className="eyebrow tracking-[0.22em]">Subtotal</span>
                <span>{aed(subtotal)}</span>
              </div>
              <p className="mb-5 text-[11px] text-taupe">Shipping calculated at checkout. Inclusive of VAT.</p>
              <Link href="/checkout" onClick={() => setOpen(false)} className="btn-solid">Checkout</Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
