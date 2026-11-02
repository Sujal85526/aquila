import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { OrderRef } from "@/components/checkout/order-ref";

export const metadata: Metadata = { title: "Order received" };

export default function Confirmed() {
  return (
    <div className="grid min-h-[80vh] place-items-center bg-paper px-6 pt-[var(--header-h)] text-center">
      <div className="max-w-xl">
        <p className="eyebrow text-taupe">Thank you</p>
        <h1 className="display mt-4 text-[clamp(40px,6vw,68px)]">Order received.</h1>
        <Suspense><OrderRef /></Suspense>
        <p className="mt-5 text-[13px] leading-[1.9] text-ink/70">
          We’ll email you with your order details. For anything else, write to us at aquila.ae1@gmail.com.
        </p>
        <Link href="/shop" className="btn-outline mt-9 text-espresso"><span>Continue shopping</span></Link>
      </div>
    </div>
  );
}
