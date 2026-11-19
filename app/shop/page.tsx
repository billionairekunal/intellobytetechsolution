import type { Metadata } from "next";
import Link from "next/link";
import { getCategories, getProducts } from "@/lib/data";
import { ProductGrid } from "@/components/product-card";
import { ShopFilters } from "@/components/shop-filters";
import { SplitText } from "@/components/ui";

const TAGS: Record<string, [string, string]> = {
  her: ["For Her", "Toys designed around her pleasure."], him: ["For Him", "Strokers, prostate play and more."],
  couples: ["For Couples", "Made to be shared."], luxe: ["The Luxe Edit", "Investment pieces from iconic brands."],
  new: ["New Arrivals", "Fresh drops, just landed."], bestseller: ["Bestsellers", "Our community's favourites."],
  sale: ["The Sale", "Biggest savings first."], beginner: ["Beginner Friendly", "Gentle, intuitive, joyful."],
  discreet: ["Quiet & Discreet", "Small, silent, secret."], smart: ["Smart Toys", "App-controlled, long-distance."],
};
type SP = Promise<{ c?: string; t?: string; q?: string; sort?: string; max?: string }>;

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const sp = await searchParams;
  return { title: sp.q ? `Search: ${sp.q}` : TAGS[sp.t ?? ""]?.[0] ?? "Shop all toys" };
}

export default async function Shop({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const [products, cats] = await Promise.all([
    getProducts({ c: sp.c, t: sp.t, q: sp.q, sort: sp.sort, max: sp.max ? Number(sp.max) : undefined }),
    getCategories(),
  ]);
  const cat = cats.find((c) => c.slug === sp.c);
  const [title, sub] = sp.q ? [`“${sp.q}”`, `${products.length} results`] : cat ? [cat.name, cat.tagline ?? ""] : TAGS[sp.t ?? ""] ?? ["Shop all", "Every toy, thoughtfully curated."];

  return (
    <div className="mx-auto max-w-7xl px-5 pt-10 sm:px-8">
      <nav className="text-xs font-semibold text-muted" aria-label="Breadcrumb"><Link href="/" className="hover:text-rose">Home</Link> / <Link href="/shop" className="hover:text-rose">Shop</Link>{title !== "Shop all" && <> / <span className="text-ink">{title}</span></>}</nav>
      <header className="grain relative mt-5 overflow-hidden rounded-[2.25rem] bg-plum px-7 py-12 text-white sm:px-12 sm:py-16">
        <div className="pointer-events-none absolute -top-20 -right-10 size-80 rounded-full bg-rose/40 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 size-80 rounded-full bg-lilac/30 blur-[100px]" />
        <p className="relative text-xs font-extrabold tracking-[0.3em] text-lime uppercase">{products.length} toys</p>
        <h1 className="display relative mt-3 text-5xl sm:text-7xl" key={title}><SplitText text={title} /></h1>
        <p className="relative mt-3 max-w-md text-white/65">{sub}</p>
      </header>
      <ShopFilters cats={cats.map((c) => ({ slug: c.slug, name: c.name }))} />
      <div className="mt-8">
        {products.length ? <ProductGrid products={products} /> : (
          <div className="rounded-[2rem] bg-white py-20 text-center">
            <p className="display text-3xl">Nothing here… yet.</p>
            <p className="mt-2 text-muted">Try a different filter or search term.</p>
            <Link href="/shop" className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-sm font-bold text-white">Clear filters</Link>
          </div>
        )}
      </div>
    </div>
  );
}
