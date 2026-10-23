"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

/** Email sign-up. Nothing is stored yet; it only confirms on screen until Supabase is connected. */
export function FooterSignup() {
  const [done, setDone] = useState(false);
  if (done) return <p className="mt-6 text-[14px] text-sand">Thank you — you’re on the list.</p>;
  return (
    <form
      className="mt-6 flex max-w-sm border-b border-ivory/30 transition-colors focus-within:border-ivory"
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
    >
      <input
        type="email"
        required
        placeholder="Email address"
        aria-label="Email address"
        className="flex-1 bg-transparent py-3 text-[14px] tracking-wide text-ivory placeholder:text-ivory/40 focus:outline-none"
      />
      <button type="submit" aria-label="Subscribe" className="px-1 text-ivory">
        <ArrowRight size={16} strokeWidth={1.2} />
      </button>
    </form>
  );
}
