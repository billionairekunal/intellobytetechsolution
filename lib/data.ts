import { publicClient } from "./supabase/server";
import type { Category, Product, Review } from "./types";

const COLS = "id,slug,name,brand,category,tags,price,mrp,badge,short,description,features,images,stock,rating,review_count,created_at";

export type Filter = { c?: string; t?: string; q?: string; sort?: string; max?: number; limit?: number };

export async function getProducts(f: Filter = {}): Promise<Product[]> {
  let q = publicClient().from("products").select(COLS);
  if (f.c) q = q.eq("category", f.c);
  if (f.t && f.t !== "sale") q = q.contains("tags", [f.t]); // "sale" = everything, sorted by discount below
  if (f.q) q = q.or(`name.ilike.%${f.q.replace(/[%,()]/g, "")}%,brand.ilike.%${f.q.replace(/[%,()]/g, "")}%`);
  if (f.max) q = q.lte("price", f.max);
  const order: Record<string, [string, boolean]> = {
    "price-asc": ["price", true], "price-desc": ["price", false], new: ["created_at", false], rating: ["review_count", false],
  };
  const [col, asc] = order[f.sort ?? ""] ?? ["review_count", false];
  q = q.order(col, { ascending: asc }).order("name");
  if (f.limit) q = q.limit(f.limit);
  const { data, error } = await q;
  if (error) throw error;
  const list = data as Product[];
  if (f.t === "sale") list.sort((a, b) => (b.mrp! - b.price) / b.mrp! - (a.mrp! - a.price) / a.mrp!);
  return list;
}

export async function getProduct(slug: string) {
  const { data } = await publicClient().from("products").select(COLS).eq("slug", slug).maybeSingle();
  return data as Product | null;
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await publicClient().from("categories").select("*").order("sort");
  return (data ?? []) as Category[];
}

export async function getReviews(productId: string): Promise<Review[]> {
  const { data } = await publicClient().from("reviews").select("id,author,rating,title,body,created_at")
    .eq("product_id", productId).order("created_at", { ascending: false }).limit(30);
  return (data ?? []) as Review[];
}
