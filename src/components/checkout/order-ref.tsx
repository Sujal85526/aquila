"use client";

import { useSearchParams } from "next/navigation";

export function OrderRef() {
  const ref = useSearchParams().get("ref");
  return ref ? <p className="mt-5 text-[13px] tracking-[0.2em]">Reference · {ref}</p> : null;
}
