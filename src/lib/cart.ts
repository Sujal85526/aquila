"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartLine {
  slug: string;
  qty: number;
}

interface CartState {
  lines: CartLine[];
  open: boolean;
  discount: string | null;
  setOpen: (open: boolean) => void;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  applyDiscount: (code: string | null) => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      open: false,
      discount: null,
      setOpen: (open) => set({ open }),
      add: (slug, qty = 1) =>
        set((s) => {
          const found = s.lines.find((l) => l.slug === slug);
          return {
            open: true,
            lines: found
              ? s.lines.map((l) => (l.slug === slug ? { ...l, qty: Math.min(l.qty + qty, 10) } : l))
              : [...s.lines, { slug, qty }],
          };
        }),
      setQty: (slug, qty) =>
        set((s) => ({
          lines: qty <= 0 ? s.lines.filter((l) => l.slug !== slug) : s.lines.map((l) => (l.slug === slug ? { ...l, qty: Math.min(qty, 10) } : l)),
        })),
      remove: (slug) => set((s) => ({ lines: s.lines.filter((l) => l.slug !== slug) })),
      clear: () => set({ lines: [], discount: null }),
      applyDiscount: (code) => set({ discount: code }),
    }),
    { name: "aquila-cart", partialize: (s) => ({ lines: s.lines, discount: s.discount }) },
  ),
);
