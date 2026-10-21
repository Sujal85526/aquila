"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, ChevronDown, CreditCard, HandCoins, Minus, Plus, Trash2, Truck } from "lucide-react";
import { Glasses } from "../glasses";
import { useCart } from "@/lib/cart";
import { EMIRATES, SHIPPING, aed, bySlug } from "@/lib/products";

const COD_FEE = 10;

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="mb-5 mt-12 flex items-center gap-4">
      <span className="grid h-9 w-9 place-items-center rounded-full border border-ink text-[13px] font-normal">{n}</span>
      <h2 className="eyebrow text-[12px] tracking-[0.3em]">{children}</h2>
    </div>
  );
}

export function CheckoutForm() {
  const router = useRouter();
  const { lines, setQty, remove, clear, discount, applyDiscount } = useCart();
  const [mounted, setMounted] = useState(false);
  const [ship, setShip] = useState<keyof typeof SHIPPING>("standard");
  const [pay, setPay] = useState<"card" | "cod">("card");
  const [code, setCode] = useState("");
  const [codeMsg, setCodeMsg] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => setMounted(true), []);

  const items = lines.flatMap((l) => {
    const p = bySlug(l.slug);
    return p ? [{ ...l, p }] : [];
  });
  const subtotal = items.reduce((n, i) => n + i.p.price * i.qty, 0);
  const total = subtotal + SHIPPING[ship].price + (pay === "cod" ? COD_FEE : 0);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!items.length) return;
    setBusy(true);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    // Payments + database are not wired yet: the order is kept in this browser only.
    const order = { id: `AQ-${Date.now().toString(36).toUpperCase()}`, items: items.map((i) => ({ slug: i.slug, qty: i.qty })), shipping: ship, pay, total, customer: { ...data, cardNumber: undefined, cardExpiry: undefined, cardCvc: undefined } };
    localStorage.setItem("aquila-last-order", JSON.stringify(order));
    clear();
    router.push(`/order/confirmed?ref=${order.id}`);
  }

  if (mounted && !items.length) {
    return (
      <div className="grid min-h-[70vh] place-items-center bg-paper px-6 pt-[var(--header-h)] text-center">
        <div>
          <h1 className="display text-4xl">Your bag is empty</h1>
          <Link href="/shop" className="btn-outline mt-8 text-espresso"><span>Shop the collection</span></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-dvh pt-[var(--header-h)] lg:grid-cols-[1.18fr_1fr]">
      <form onSubmit={submit} className="bg-paper px-6 pb-20 pt-12 md:px-12 lg:pl-[max(48px,calc((100vw-1480px)/2+48px))] lg:pr-16 lg:pt-14">
        <div className="max-w-[660px]">
          <p className="eyebrow text-[12px] tracking-[0.3em]">Checkout</p>
          <h1 className="mt-5 font-serif text-[clamp(44px,6vw,76px)] font-medium uppercase leading-[0.98]">Complete<br />your order.</h1>
          <div className="mt-10 border-t border-ink/25" />

          <div className="mt-12 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="grid h-9 w-9 place-items-center rounded-full border border-ink text-[13px]">1</span>
              <h2 className="eyebrow text-[12px] tracking-[0.3em]">Contact information</h2>
            </div>
            <p className="hidden text-[12px] text-taupe sm:block">Already have an account? <Link href="/account" className="text-ink underline underline-offset-4">Login</Link></p>
          </div>
          <div className="mt-5 space-y-3 sm:pl-[52px]">
            <input required name="email" type="email" autoComplete="email" placeholder="Email address" className="field" />
            <label className="flex items-center gap-3 text-[13px]">
              <input type="checkbox" name="news" defaultChecked className="peer sr-only" />
              <span className="grid h-[18px] w-[18px] place-items-center border border-ink bg-ink text-ivory peer-focus-visible:ring-2 peer-focus-visible:ring-ink/40 [input:not(:checked)~&]:bg-transparent [input:not(:checked)~&>svg]:hidden"><Check size={12} strokeWidth={2} /></span>
              Email me with news, offers and updates.
            </label>
          </div>

          <Step n={2}>Shipping information</Step>
          <div className="grid gap-3 sm:grid-cols-2 sm:pl-[52px]">
            <input required name="first" autoComplete="given-name" placeholder="First name" className="field" />
            <input required name="last" autoComplete="family-name" placeholder="Last name" className="field" />
            <input required name="address" autoComplete="address-line1" placeholder="Address" className="field sm:col-span-2" />
            <input name="address2" autoComplete="address-line2" placeholder="Apartment, suite, etc. (optional)" className="field sm:col-span-2" />
            <input required name="city" autoComplete="address-level2" placeholder="City" className="field" />
            <div className="relative">
              <select required name="emirate" defaultValue="" className="field appearance-none pr-10 invalid:text-taupe">
                <option value="" disabled>Emirate</option>
                {EMIRATES.map((e) => <option key={e}>{e}</option>)}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" />
            </div>
            <div className="flex sm:col-span-2">
              <input required name="phone" type="tel" autoComplete="tel-national" inputMode="tel" placeholder="Phone number" className="field flex-1 border-r-0" />
              <span className="flex items-center gap-2 border border-espresso/30 px-5 text-[13px]">+971 <ChevronDown size={13} /></span>
            </div>
          </div>

          <Step n={3}>Shipping method</Step>
          <div className="space-y-2.5 sm:pl-[52px]" role="radiogroup" aria-label="Shipping method">
            {Object.values(SHIPPING).map((s) => (
              <label key={s.id} className={`flex cursor-pointer items-center gap-4 border px-5 py-4 transition-colors ${ship === s.id ? "border-ink bg-white/40" : "border-espresso/30 hover:border-ink/60"}`}>
                <input type="radio" name="ship" className="peer sr-only" checked={ship === s.id} onChange={() => setShip(s.id)} />
                <Radio on={ship === s.id} />
                <Truck size={30} strokeWidth={0.9} className="shrink-0" />
                <span className="flex-1">
                  <span className="eyebrow block text-[11px] font-normal tracking-[0.2em]">{s.label}</span>
                  <span className="mt-1 block text-[12px] text-taupe">{s.eta}</span>
                </span>
                <span className="text-[12px] tracking-[0.12em]">{aed(s.price)}</span>
              </label>
            ))}
          </div>

          <Step n={4}>Payment method</Step>
          <div className="space-y-2.5 sm:pl-[52px]" role="radiogroup" aria-label="Payment method">
            <label className={`flex cursor-pointer items-center gap-4 border px-5 py-4 ${pay === "card" ? "border-ink bg-white/40" : "border-espresso/30"}`}>
              <input type="radio" name="pay" className="sr-only" checked={pay === "card"} onChange={() => setPay("card")} />
              <Radio on={pay === "card"} />
              <CreditCard size={30} strokeWidth={0.9} className="shrink-0" />
              <span className="flex-1 text-[13px]">Credit / Debit Card</span>
              <span className="flex items-center gap-2.5 text-[13px]">
                <b className="font-semibold italic text-[#1a3d8f]">VISA</b>
                <span className="relative inline-block h-[18px] w-[28px]"><i className="absolute left-0 h-[18px] w-[18px] rounded-full bg-[#eb001b]" /><i className="absolute right-0 h-[18px] w-[18px] rounded-full bg-[#f79e1b] mix-blend-multiply" /></span>
                <span className="font-medium"> Pay</span>
              </span>
            </label>
            <label className={`flex cursor-pointer items-center gap-4 border px-5 py-4 ${pay === "cod" ? "border-ink bg-white/40" : "border-espresso/30"}`}>
              <input type="radio" name="pay" className="sr-only" checked={pay === "cod"} onChange={() => setPay("cod")} />
              <Radio on={pay === "cod"} />
              <HandCoins size={30} strokeWidth={0.9} className="shrink-0" />
              <span className="flex-1 text-[13px]">Cash on Delivery</span>
              <span className="text-[12px] tracking-[0.12em]">{aed(COD_FEE)}</span>
            </label>
          </div>

          <p className="mt-6 border border-dashed border-taupe/60 bg-sand/20 p-4 text-[12px] leading-relaxed text-ink/70 sm:ml-[52px]">
            Payment processing is not connected yet. Placing an order here saves it in this browser only and no card is charged.
          </p>

          <button disabled={busy || !items.length} className="btn-solid mt-6 gap-3 disabled:opacity-60 sm:ml-[52px] sm:w-[calc(100%-52px)]">
            {busy ? "Placing order…" : "Place order"} <span aria-hidden>→</span>
          </button>
        </div>
      </form>

      <aside className="bg-gradient-to-b from-[#f3e8d6] to-[#ecdfca] px-6 py-12 md:px-12 lg:pt-14">
        <div className="mx-auto max-w-[480px] lg:sticky lg:top-[calc(var(--header-h)+40px)]">
          <div className="flex items-baseline justify-between">
            <h2 className="eyebrow text-[13px] tracking-[0.3em]">Order summary ({items.reduce((n, i) => n + i.qty, 0)})</h2>
            <Link href="/shop" className="text-[13px] underline underline-offset-4">Edit</Link>
          </div>
          <ul className="mt-8 divide-y divide-ink/15 border-b border-ink/25">
            {items.map(({ p, qty }) => (
              <li key={p.slug} className="flex gap-5 pb-7 pt-1">
                <div className="grid h-[112px] w-[132px] shrink-0 place-items-center bg-[#e6d9c3] p-3"><Glasses product={p} className="w-full" /></div>
                <div className="flex flex-1 flex-col">
                  <p className="eyebrow text-[12px] tracking-[0.24em]">{p.name}</p>
                  <p className="mt-1.5 text-[13px] text-taupe">{p.colour}</p>
                  <p className="mt-1 text-[14px]">{aed(p.price)}</p>
                  <div className="mt-auto flex items-end justify-between">
                    <div className="flex items-center border border-ink/30 bg-paper/50">
                      <button type="button" aria-label="Decrease quantity" className="p-2.5" onClick={() => setQty(p.slug, qty - 1)}><Minus size={13} /></button>
                      <span className="w-8 text-center text-[13px]">{qty}</span>
                      <button type="button" aria-label="Increase quantity" className="p-2.5" onClick={() => setQty(p.slug, qty + 1)}><Plus size={13} /></button>
                    </div>
                    <button type="button" aria-label={`Remove ${p.name}`} onClick={() => remove(p.slug)} className="p-2"><Trash2 size={18} strokeWidth={1.1} /></button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-7 flex">
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Discount code" aria-label="Discount code" className="field flex-1 bg-paper/50" />
            <button
              type="button"
              onClick={() => {
                if (!code.trim()) return;
                applyDiscount(null);
                setCodeMsg("This code isn’t valid.");
              }}
              className="bg-espresso px-9 text-[11px] uppercase tracking-[0.3em] text-ivory transition hover:bg-ink"
            >
              Apply
            </button>
          </div>
          {codeMsg && !discount && <p role="status" className="mt-2 text-[12px] text-taupe">{codeMsg}</p>}

          <dl className="mt-7 space-y-3 border-t border-ink/25 pt-7 text-[13.5px]">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{aed(subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Shipping</dt><dd>{aed(SHIPPING[ship].price)}</dd></div>
            {pay === "cod" && <div className="flex justify-between"><dt>Cash on delivery</dt><dd>{aed(COD_FEE)}</dd></div>}
          </dl>
          <div className="mt-6 flex items-baseline justify-between border-t border-ink/25 pt-6">
            <span className="font-serif text-[26px]">Total</span>
            <span className="font-serif text-[30px]">{aed(total)}</span>
          </div>
          <p className="mt-1 text-right text-[12px] text-taupe">Inclusive of VAT</p>
        </div>
      </aside>
    </div>
  );
}

function Radio({ on }: { on: boolean }) {
  return (
    <span aria-hidden className={`grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border ${on ? "border-ink" : "border-taupe"}`}>
      {on && <span className="h-2.5 w-2.5 rounded-full bg-ink" />}
    </span>
  );
}
