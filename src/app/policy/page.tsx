import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = { title: "Policy" };

const LINKS = [
  { href: "/policy/shipping", title: "Shipping & Delivery", sub: "How and when your order reaches you." },
  { href: "/policy/returns", title: "Returns & Exchanges", sub: "Our policy on every purchase." },
];

export default function Policy() {
  return (
    <PageShell eyebrow="Customer care" title="Policy" narrow>
      <ul className="divide-y divide-ink/20 border-y border-ink/20">
        {LINKS.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="group flex items-center justify-between gap-6 py-8">
              <span>
                <span className="block font-serif text-[26px] uppercase md:text-[32px]">{l.title}</span>
                <span className="mt-2 block text-[13px] text-taupe">{l.sub}</span>
              </span>
              <ArrowRight size={20} strokeWidth={1} className="transition-transform duration-300 group-hover:translate-x-2" />
            </Link>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
