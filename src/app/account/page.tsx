import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Account" };

export default function Account() {
  return (
    <div className="grid min-h-[70vh] place-items-center bg-paper px-6 pt-[var(--header-h)] text-center">
      <div className="max-w-md">
        <p className="eyebrow text-taupe">Account</p>
        <h1 className="display mt-4 text-[clamp(34px,5vw,56px)]">Coming soon.</h1>
        <p className="mt-5 text-[13px] leading-[1.9] text-ink/70">Customer accounts are on the way. You can check out as a guest in the meantime.</p>
        <Link href="/shop" className="btn-outline mt-8 text-espresso"><span>Shop the collection</span></Link>
      </div>
    </div>
  );
}
