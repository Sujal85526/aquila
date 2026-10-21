"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ChevronDown, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { Logo } from "./logo";
import { useCart } from "@/lib/cart";
import { products } from "@/lib/products";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/our-story", label: "Our Story" },
  { href: "/policy", label: "Policy" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [mounted, setMounted] = useState(false);
  const count = useCart((s) => s.lines.reduce((n, l) => n + l.qty, 0));
  const setOpen = useCart((s) => s.setOpen);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    setMenu(false);
    setSearch(false);
  }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = menu || search ? "hidden" : "";
  }, [menu, search]);
  useEffect(() => {
    if (!menu || !menuRef.current) return;
    gsap.fromTo(
      menuRef.current.querySelectorAll("[data-m]"),
      { y: 28, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: "power3.out", delay: 0.15 },
    );
  }, [menu]);

  const overlay = pathname === "/";
  const dark = pathname === "/checkout";
  const solid = !overlay || scrolled || menu;
  const tone = overlay && !scrolled && !menu ? "text-ivory" : dark || scrolled || menu ? "text-ivory" : "text-ink";
  const bg =
    overlay && !scrolled && !menu
      ? "bg-gradient-to-b from-black/45 to-transparent"
      : dark || scrolled || menu
        ? "bg-espresso/95 backdrop-blur-md"
        : "bg-paper border-b border-ink/70";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background,color] duration-500 ${tone} ${bg}`}
        style={{ height: "var(--header-h)" }}
      >
        <div className="mx-auto grid h-full max-w-[1480px] grid-cols-[1fr_auto_1fr] items-center px-5 md:px-12">
          <nav aria-label="Primary" className="hidden gap-10 md:flex">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="eyebrow link-underline pb-1 tracking-[0.24em]">
                {n.label}
              </Link>
            ))}
          </nav>
          <button
            className="-ml-2 flex h-10 w-10 items-center md:hidden"
            aria-label={menu ? "Close menu" : "Open menu"}
            onClick={() => setMenu((m) => !m)}
          >
            {menu ? <X size={22} strokeWidth={1.2} /> : <Menu size={22} strokeWidth={1.2} />}
          </button>

          <Link href="/" aria-label="AQUILA home" className="justify-self-center">
            <Logo className={solid && !dark ? "w-[104px] md:w-[124px]" : "w-[112px] md:w-[132px]"} />
          </Link>

          <div className="flex items-center justify-end gap-4 md:gap-6">
            <span className="eyebrow hidden items-center gap-1.5 lg:flex">
              UAE | AED <ChevronDown size={11} strokeWidth={1.4} />
            </span>
            <button aria-label="Search" onClick={() => setSearch(true)} className="p-1">
              <Search size={19} strokeWidth={1.2} />
            </button>
            <Link href="/account" aria-label="Account" className="hidden p-1 sm:block">
              <User size={19} strokeWidth={1.2} />
            </Link>
            <button aria-label="Open bag" onClick={() => setOpen(true)} className="relative p-1">
              <ShoppingBag size={19} strokeWidth={1.2} />
              {mounted && count > 0 && (
                <span className="absolute -right-1 -top-0.5 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-ivory px-1 text-[9px] font-normal text-espresso">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {menu && (
        <div ref={menuRef} className="fixed inset-0 z-40 flex flex-col justify-center bg-espresso px-8 pt-[var(--header-h)] text-ivory md:hidden grain">
          <nav className="flex flex-col gap-7">
            {[{ href: "/", label: "Home" }, ...NAV, { href: "/account", label: "Account" }].map((n) => (
              <Link key={n.href} data-m href={n.href} className="font-serif text-[40px] uppercase leading-none tracking-wide">
                {n.label}
              </Link>
            ))}
          </nav>
          <p data-m className="eyebrow mt-14 text-sand">
            UAE | AED &nbsp;·&nbsp; @aquila.ae
          </p>
        </div>
      )}

      {search && <SearchOverlay onClose={() => setSearch(false)} />}
    </>
  );
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const results = products.filter((p) => `${p.name} ${p.colour}`.toLowerCase().includes(q.toLowerCase()));
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[60] bg-paper/97 px-5 pt-24 backdrop-blur-md md:px-12" role="dialog" aria-label="Search">
      <button aria-label="Close search" onClick={onClose} className="absolute right-5 top-6 p-2 md:right-12">
        <X size={22} strokeWidth={1.2} />
      </button>
      <div className="mx-auto max-w-2xl">
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search the collection"
          className="w-full border-b border-ink/40 bg-transparent pb-4 font-serif text-3xl uppercase outline-none placeholder:text-taupe/60 md:text-4xl"
        />
        <ul className="mt-8 divide-y divide-ink/10">
          {results.map((p) => (
            <li key={p.slug}>
              <Link href={`/products/${p.slug}`} className="flex items-baseline justify-between py-4 text-[12px] uppercase tracking-[0.2em]">
                <span>{p.name}</span>
                <span className="text-taupe">{p.colour}</span>
              </Link>
            </li>
          ))}
          {!results.length && <li className="py-4 text-sm text-taupe">No results.</li>}
        </ul>
      </div>
    </div>
  );
}
