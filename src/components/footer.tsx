import Image from "next/image";
import Link from "next/link";
import { CONTACT, products } from "@/lib/products";
import { FooterSignup } from "./footer-signup";
import { Logo } from "./logo";

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All sunglasses" },
      ...products.slice(0, 3).map((p) => ({ href: `/products/${p.slug}`, label: p.name })),
    ],
  },
  {
    title: "Client care",
    links: [
      { href: "/account", label: "My account" },
      { href: "/policy/shipping", label: "Shipping & delivery" },
      { href: "/policy/returns", label: "Returns & exchanges" },
      { href: `mailto:${CONTACT.email}`, label: "Contact us" },
    ],
  },
  {
    title: "The house",
    links: [
      { href: "/our-story", label: "Our story" },
      { href: CONTACT.instagramUrl, label: `Instagram ${CONTACT.instagramHandle}` },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-cocoa text-ivory">
      <Image src="/deck/footer-c.jpg" alt="" fill sizes="100vw" className="-z-20 object-cover object-[50%_40%]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-cocoa/95 via-cocoa/80 to-cocoa/60" />
      <div data-footer-inner className="relative">
        <div className="mx-auto grid max-w-[1480px] gap-12 px-6 py-14 md:px-12 lg:grid-cols-[1.2fr_2fr] lg:gap-16 lg:py-16">
          <div className="max-w-sm">
            <Logo className="w-[104px] md:w-[116px]" />
            <p className="display mt-6 text-[24px] md:text-[28px]">For those who see further.</p>
            <p className="mt-3 text-[13px] leading-relaxed text-sand/70">New frames, private previews and the occasional note. Rarely, and only when it matters.</p>
            <FooterSignup />
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
            {columns.map((c) => (
              <div key={c.title}>
                <h3 className="eyebrow text-[10px] text-sand/60">{c.title}</h3>
                <ul className="mt-5 space-y-3 text-[14px]">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        {...(l.href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
                        className="link-underline inline-block pb-0.5 tracking-wide text-ivory/85 transition-colors hover:text-ivory"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-ivory/15">
          <div className="mx-auto flex max-w-[1480px] flex-col items-start gap-2 px-6 py-5 text-[10px] uppercase tracking-[0.22em] text-sand/70 sm:flex-row sm:items-center sm:justify-between md:px-12">
            <p>© Aquila · Abu Dhabi</p>
            <p>UAE | AED</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
