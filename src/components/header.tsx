"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { ChevronDown, Menu, X } from "lucide-react";
import { AccountIcon, BagIcon, SearchIcon } from "./icons";
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
  const barRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (mounted && count > 0 && badgeRef.current) gsap.fromTo(badgeRef.current, { scale: 1.9 }, { scale: 1, duration: 0.8, ease: "elastic.out(1,0.5)" });
  }, [count, mounted]);
  useEffect(() => {
    let last = window.scrollY;
    let hidden = false;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      const down = y > last + 4;
      const up = y < last - 4;
      if (down && y > 260 && !hidden) {
        hidden = true;
        gsap.to(barRef.current, { yPercent: -100, duration: 0.6, ease: "power3.inOut" });
      } else if ((up || y < 260) && hidden) {
        hidden = false;
        gsap.to(barRef.current, { yPercent: 0, duration: 0.6, ease: "power3.out" });
      }
      if (down || up) last = y;
    };
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
        ? "bg-espresso"
        : "bg-paper border-b border-ink/70";

  return (
    <>
      <header
        ref={barRef}
        className={`fixed inset-x-0 top-0 z-50 transition-[background,color] duration-500 ${tone} ${bg}`}
        style={{ height: "var(--header-h)" }}
      >
        <div className="mx-auto grid h-full max-w-[1480px] grid-cols-[1fr_auto_1fr] items-center px-5 md:px-12">
          <nav aria-label="Primary" className="hidden gap-10 md:flex">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="eyebrow group relative inline-block overflow-hidden py-1 tracking-[0.24em]">
                <span className="block transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:-translate-y-full">{n.label}</span>
                <span aria-hidden className="absolute inset-x-0 top-1 block translate-y-[130%] transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:translate-y-0">{n.label}</span>
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
              <SearchIcon size={23} />
            </button>
            <Link href="/account" aria-label="Account" className="hidden p-1 sm:block">
              <AccountIcon size={23} />
            </Link>
            <button aria-label="Open bag" onClick={() => setOpen(true)} className="relative p-1">
              <BagIcon size={23} />
              {mounted && count > 0 && (
                <span ref={badgeRef} className={`absolute -bottom-0.5 -right-1.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-normal ${tone === "text-ink" ? "bg-ink text-ivory" : "bg-ivory text-espresso"}`}>
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {menu && (
        <div ref={menuRef} data-lenis-prevent className="fixed inset-0 z-40 flex flex-col justify-center bg-espresso px-8 pt-[var(--header-h)] text-ivory md:hidden grain">
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
    <div data-lenis-prevent className="fixed inset-0 z-[60] bg-paper px-5 pt-24 md:px-12" role="dialog" aria-label="Search">
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
