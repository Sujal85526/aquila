import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { CONTACT } from "@/lib/products";

export const metadata: Metadata = { title: "Returns & Exchanges" };

export default function Returns() {
  return (
    <PageShell eyebrow="Policy" title="Returns & Exchanges" narrow>
      <div className="space-y-6 text-[15px] leading-[2] tracking-[0.03em] text-ink/80">
        <p className="font-serif text-[26px] uppercase leading-snug text-ink">At Aquila, every purchase is final.</p>
        <p>We do not offer returns or exchanges for changes of mind, personal preferences, or incorrect selections.</p>
        <p>Aquila does not provide general sunglasses repair services.</p>
        <p>
          If your order arrives damaged, defective, incomplete, or does not match its description, please contact us at{" "}
          <a className="underline underline-offset-4" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> with your order details so we can review the issue and provide the remedy required under applicable UAE consumer protection laws.
        </p>
      </div>
    </PageShell>
  );
}
