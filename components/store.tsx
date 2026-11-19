"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { MotionConfig } from "motion/react";
import type { CartItem } from "@/lib/types";

type Store = {
  cart: CartItem[]; wish: string[]; open: boolean; ready: boolean;
  setOpen: (v: boolean) => void;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  toggleWish: (slug: string) => void;
  toast: string | null; notify: (msg: string) => void;
};
const Ctx = createContext<Store | null>(null);

function load<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? "") as T; } catch { return fallback; }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wish, setWish] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from localStorage once
    setCart(load("ib-cart", [])); setWish(load("ib-wish", [])); setReady(true);
  }, []);
  useEffect(() => { if (ready) try { localStorage.setItem("ib-cart", JSON.stringify(cart)); } catch {} }, [cart, ready]);
  useEffect(() => { if (ready) try { localStorage.setItem("ib-wish", JSON.stringify(wish)); } catch {} }, [wish, ready]);

  const notify = (msg: string) => { setToast(msg); setTimeout(() => setToast((t) => (t === msg ? null : t)), 2600); };

  const value: Store = {
    cart, wish, open, ready, setOpen, toast, notify,
    add: (item, qty = 1) => {
      setCart((c) => {
        const hit = c.find((x) => x.id === item.id);
        return hit ? c.map((x) => (x.id === item.id ? { ...x, qty: Math.min(10, x.qty + qty) } : x)) : [...c, { ...item, qty }];
      });
      setOpen(true);
    },
    setQty: (id, qty) => setCart((c) => (qty <= 0 ? c.filter((x) => x.id !== id) : c.map((x) => (x.id === id ? { ...x, qty: Math.min(10, qty) } : x)))),
    clear: () => setCart([]),
    toggleWish: (slug) => setWish((w) => {
      const has = w.includes(slug);
      notify(has ? "Removed from wishlist" : "Saved to wishlist ♥");
      return has ? w.filter((s) => s !== slug) : [...w, slug];
    }),
  };
  return <MotionConfig reducedMotion="user"><Ctx.Provider value={value}>{children}</Ctx.Provider></MotionConfig>;
}

export const useStore = () => {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore outside StoreProvider");
  return s;
};
