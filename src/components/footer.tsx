import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { InstagramIcon } from "./icons";
import { CONTACT } from "@/lib/products";
import { Reveal, SplitHeading } from "./motion";

const EXPLORE = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/our-story", label: "Our Story" },
  { href: "/account", label: "Account" },
];
const HELP = [
  { href: "/policy/shipping", label: "Shipping & Delivery" },
  { href: "/policy/returns", label: "Returns & Exchanges" },
];

const col = "eyebrow mb-5 block text-[10px] text-sand/70";
const link = "link-underline inline-block pb-0.5 text-[14px] tracking-wide text-ivory/90 transition-colors hover:text-ivory";

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-cocoa text-ivory">
      <Image src="/deck/footer-c.jpg" alt="" fill sizes="100vw" className="-z-20 object-cover object-[60%_45%]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-cocoa/95 via-cocoa/60 to-cocoa/25" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cocoa/60 to-transparent" />
      <div data-footer-inner className="relative">
        <Reveal className="mx-auto max-w-[1480px] px-6 pb-8 pt-12 md:px-12 md:pb-10 md:pt-[3.5vw]">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow text-sand">Contact us</p>
              <SplitHeading className="display mt-4 text-[clamp(30px,3.4vw,52px)] leading-[1.04]">
                <span className="block">We’re here</span>
                <span className="block">for you.</span>
              </SplitHeading>
            </div>
            <a
              href={`mailto:${CONTACT.email}`}
              className="group inline-flex w-fit items-center gap-3 border-b border-ivory/40 pb-2 text-[15px] tracking-wide transition-colors hover:border-ivory md:mb-2 md:text-[15px]"
            >
              {CONTACT.email}
              <ArrowUpRight size={18} strokeWidth={1.2} className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-ivory/15 pt-8 md:mt-10 md:grid-cols-3 md:gap-x-12 md:pt-9">
            <nav aria-label="Explore">
              <span className={col}>Explore</span>
              <ul className="space-y-2.5">
                {EXPLORE.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={link}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Help">
              <span className={col}>Help</span>
              <ul className="space-y-2.5">
                {HELP.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={link}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="col-span-2 md:col-span-1">
              <span className={col}>Connect</span>
              <ul className="space-y-2.5">
                <li>
                  <a href={`mailto:${CONTACT.email}`} className="group flex items-center gap-3 text-[14px] tracking-wide text-ivory/90 hover:text-ivory">
                    <Mail size={18} strokeWidth={1.1} /> <span className="link-underline pb-0.5">Email us</span>
                  </a>
                </li>
                <li>
                  <a href={CONTACT.instagramUrl} target="_blank" rel="noreferrer" className="group flex items-center gap-3 text-[14px] tracking-wide text-ivory/90 hover:text-ivory">
                    <InstagramIcon size={18} strokeWidth={1.1} /> <span className="link-underline pb-0.5">{CONTACT.instagramHandle}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </Reveal>
        <div className="relative border-t border-ivory/15">
          <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-4 px-6 py-5 text-[10px] uppercase tracking-[0.22em] text-sand/80 md:px-12">
            <p>© Aquila · Abu Dhabi</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
