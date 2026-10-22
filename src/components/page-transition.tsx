"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { markReady } from "@/lib/ready";
import { bySlug } from "@/lib/products";

const LABELS: Record<string, string> = {
  "/": "Home",
  "/shop": "The Collection",
  "/our-story": "Our Story",
  "/policy": "Policy",
  "/policy/shipping": "Shipping & Delivery",
  "/policy/returns": "Returns & Exchanges",
  "/checkout": "Checkout",
  "/account": "Account",
};

function labelFor(path: string) {
  if (LABELS[path]) return LABELS[path];
  const slug = path.split("/products/")[1];
  return (slug && bySlug(slug)?.name) || "Aquila";
}

/**
 * Route transitions. Internal links are intercepted: an espresso curtain rises with the name of the
 * destination, the route changes behind it, then the curtain lifts as the new page animates in.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const cover = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const pending = useRef(false);
  const first = useRef(true);
  const busy = useRef(false);

  const lift = () => {
    if (!pending.current) return;
    pending.current = false;
    gsap
      .timeline({ onComplete: () => { gsap.set(cover.current, { display: "none" }); busy.current = false; } })
      .to(label.current, { autoAlpha: 0, y: -14, duration: 0.35, ease: "power2.in" }, 0)
      .call(markReady, undefined, 0.3)
      .to(cover.current, { yPercent: -100, duration: 0.95, ease: "aq" }, 0.2);
  };

  // the new route has mounted: lift the curtain
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const t = setTimeout(lift, 120);
    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || busy.current) return;
      if (prefersReducedMotion()) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search) return; // same page / hash jump
      e.preventDefault();
      busy.current = true;
      const href = url.pathname + url.search + url.hash;
      const el = cover.current!;
      const text = labelFor(url.pathname).toUpperCase();
      gsap.set(el, { display: "flex", yPercent: 100 });
      gsap.set(label.current, { autoAlpha: 0, y: 14, text: "" });
      gsap
        .timeline({
          onComplete: () => {
            window.__aqReady = false;
            pending.current = true;
            router.push(href);
            setTimeout(lift, 4500); // never leave the curtain down
          },
        })
        .to(el, { yPercent: 0, duration: 0.8, ease: "aq" })
        .to(label.current, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.35)
        .to(label.current, { duration: 0.6, scrambleText: { text, chars: "upperCase", speed: 0.7 } }, 0.35);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return (
    <div ref={cover} aria-hidden className="fixed inset-0 z-[90] hidden flex-col items-center justify-center gap-6 bg-espresso text-ivory">
      <span className="aq-logo w-[min(46vw,200px)] opacity-90" />
      <span ref={label} className="text-[11px] uppercase tracking-[0.5em] text-sand" />
    </div>
  );
}
