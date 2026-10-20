"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";

type StoreCtx = {
  currency: string;
  freeShippingThreshold: number;
};

const Ctx = createContext<StoreCtx>({ currency: "৳", freeShippingThreshold: 0 });

export function StoreProvider({ value, children }: { value: StoreCtx; children: React.ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  return { ...ctx, money: (n: number) => formatPrice(n, ctx.currency) };
}

/** True after the first client render — avoids hydration mismatch for localStorage-backed UI. */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
