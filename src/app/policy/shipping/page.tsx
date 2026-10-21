import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { SHIPPING, aed } from "@/lib/products";

export const metadata: Metadata = { title: "Shipping & Delivery" };

export default function Shipping() {
  return (
    <PageShell eyebrow="Policy" title="Shipping & Delivery" narrow>
      <div className="space-y-6 text-[15px] leading-[2] tracking-[0.03em] text-ink/80">
        <p>Aquila delivers across the United Arab Emirates. All prices are shown in AED and include VAT.</p>
        <ul className="divide-y divide-ink/15 border-y border-ink/15">
          {Object.values(SHIPPING).map((s) => (
            <li key={s.id} className="flex items-baseline justify-between gap-4 py-5">
              <span><span className="eyebrow block text-ink">{s.label}</span><span className="text-[13px] text-taupe">{s.eta}</span></span>
              <span>{aed(s.price)}</span>
            </li>
          ))}
        </ul>
        <p className="text-[13px] text-taupe">Delivery timings are estimates and will be confirmed before launch.</p>
      </div>
    </PageShell>
  );
}
