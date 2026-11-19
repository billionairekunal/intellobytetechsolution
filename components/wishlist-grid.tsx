"use client";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useStore } from "./store";
import { ProductGrid } from "./product-card";
import type { Product } from "@/lib/types";

export function WishlistGrid({ products }: { products: Product[] }) {
  const { wish, ready } = useStore();
  if (!ready) return null;
  const list = products.filter((p) => wish.includes(p.slug));
  if (!list.length) return (
    <div className="mt-10 rounded-[2rem] bg-white py-20 text-center">
      <Heart className="mx-auto animate-float text-rose" size={40} />
      <p className="display mt-4 text-3xl">Nothing saved yet</p>
      <p className="mt-1 text-muted">Tap the heart on anything you love.</p>
      <Link href="/shop" className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-sm font-bold text-white">Explore toys</Link>
    </div>
  );
  return <div className="mt-10"><ProductGrid products={list} /></div>;
}
