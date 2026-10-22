import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import { InstagramIcon } from "./icons";
import { CONTACT } from "@/lib/products";
import { Reveal, SplitHeading } from "./motion";
import { FooterWordmark } from "./footer-wordmark";

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-cocoa text-ivory">
      <Image
        src="/deck/footer-c.jpg"
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover object-[50%_40%]"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cocoa/90 via-cocoa/70 to-cocoa/30" />
      <div data-footer-inner className="relative">
      <Reveal className="mx-auto grid max-w-[1480px] gap-12 px-6 py-16 md:grid-cols-[1.1fr_auto_1fr] md:items-center md:gap-16 md:px-12 md:py-[4.5vw]">
        <div>
          <p className="eyebrow text-sand">Contact us</p>
          <SplitHeading className="display mt-3 text-[40px] md:text-[clamp(30px,3vw,50px)]">
            <span className="block">We’re here</span>
            <span className="block">for you.</span>
          </SplitHeading>
        </div>
        <span aria-hidden className="hidden h-24 w-px bg-ivory/50 md:block" />
        <div className="grid gap-8 sm:grid-cols-2">
          <a href={`mailto:${CONTACT.email}`} className="group flex items-start gap-4">
            <Mail size={26} strokeWidth={1} className="mt-1 shrink-0" />
            <span>
              <span className="eyebrow block text-[10px] font-normal">Email</span>
              <span className="link-underline mt-2 block break-all text-[15px] tracking-wide">{CONTACT.email}</span>
            </span>
          </a>
          <a href={CONTACT.instagramUrl} target="_blank" rel="noreferrer" className="group flex items-start gap-4">
            <InstagramIcon size={26} strokeWidth={1} className="mt-1 shrink-0" />
            <span>
              <span className="eyebrow block text-[10px] font-normal">Instagram</span>
              <span className="link-underline mt-2 block text-[15px] tracking-wide">{CONTACT.instagramHandle}</span>
            </span>
          </a>
        </div>
      </Reveal>
      <FooterWordmark />
      <div className="relative border-t border-ivory/15">
        <div className="mx-auto flex max-w-[1480px] flex-col gap-4 px-6 py-6 text-[10px] uppercase tracking-[0.22em] text-sand md:flex-row md:items-center md:justify-between md:px-12">
          <p>© Aquila · Abu Dhabi</p>
          <nav className="flex flex-wrap gap-x-7 gap-y-2" aria-label="Policies">
            <Link href="/policy/shipping" className="link-underline pb-0.5">Shipping &amp; Delivery</Link>
            <Link href="/policy/returns" className="link-underline pb-0.5">Returns &amp; Exchanges</Link>
            <Link href="/our-story" className="link-underline pb-0.5">Our Story</Link>
          </nav>
        </div>
      </div>
      </div>
    </footer>
  );
}
