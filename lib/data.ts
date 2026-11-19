import { unstable_cache } from "next/cache";
import { publicClient } from "./supabase/server";
import type { Category, Product, Review } from "./types";

const COLS = "id,slug,name,brand,category,tags,price,mrp,badge,short,description,features,images,stock,rating,review_count,created_at";
const OPTS = { revalidate: 300, tags: ["catalog"] };

// ponytail: whole catalog (~74 rows) cached once and filtered in memory; move filters back to SQL past a few thousand products.
const allProducts = unstable_cache(async () => {
  const { data, error } = await publicClient().from("products").select(COLS).eq("active", true).order("name");
  if (error) throw error;
  return data as Product[];
}, ["products"], OPTS);

export type Filter = { c?: string; t?: string; q?: string; sort?: string; max?: number; limit?: number };

export async function getProducts(f: Filter = {}): Promise<Product[]> {
  const q = f.q?.trim().toLowerCase();
  const list = (await allProducts()).filter((p) =>
    (!f.c || p.category === f.c) &&
    (!f.t || f.t === "sale" || p.tags.includes(f.t)) && // "sale" = everything, sorted by discount
    (!q || p.name.toLowerCase().includes(q) || (p.brand ?? "").toLowerCase().includes(q)) &&
    (!f.max || p.price <= f.max));
  const disc = (p: Product) => (p.mrp ? (p.mrp - p.price) / p.mrp : 0);
  const by: Record<string, (a: Product, b: Product) => number> = {
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    new: (a, b) => b.created_at.localeCompare(a.created_at),
    rating: (a, b) => b.review_count - a.review_count,
  };
  list.sort(f.t === "sale" && !f.sort ? (a, b) => disc(b) - disc(a) : by[f.sort ?? ""] ?? by.rating); // stable sort keeps name order on ties
  // lists feed cards only: drop the long description so client props (and the HTML) stay small
  return (f.limit ? list.slice(0, f.limit) : list).map((p) => ({ ...p, description: null }));
}

export async function getProduct(slug: string) {
  return (await allProducts()).find((p) => p.slug === slug) ?? null;
}

export const getCategories = unstable_cache(async (): Promise<Category[]> => {
  const { data } = await publicClient().from("categories").select("*").order("sort");
  return (data ?? []) as Category[];
}, ["categories"], OPTS);

export const getReviews = unstable_cache(async (productId: string): Promise<Review[]> => {
  const { data } = await publicClient().from("reviews").select("id,author,rating,title,body,created_at")
    .eq("product_id", productId).order("created_at", { ascending: false }).limit(30);
  return (data ?? []) as Review[];
}, ["reviews"], OPTS);
