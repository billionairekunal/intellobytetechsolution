import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getProducts, getReviews } from "@/lib/data";
import { Gallery, BuyBox, Reviews } from "@/components/product-detail";
import { ProductRail } from "@/components/product-card";
import { SectionHead } from "@/components/ui";

type P = { params: Promise<{ slug: string }> };

export const revalidate = 300;
export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const p = await getProduct((await params).slug);
  return p ? { title: p.name, description: p.short ?? undefined, openGraph: { images: p.images.slice(0, 1) } } : {};
}

export default async function ProductPage({ params }: P) {
  const p = await getProduct((await params).slug);
  if (!p) notFound();
  const [reviews, related] = await Promise.all([getReviews(p.id), getProducts({ c: p.category, limit: 12 })]);
  const others = related.filter((r) => r.id !== p.id);

  return (
    <div className="mx-auto max-w-7xl px-5 pt-8 sm:px-8">
      <nav className="text-xs font-semibold text-muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-rose">Home</Link> / <Link href={`/shop?c=${p.category}`} className="capitalize hover:text-rose">{p.category}</Link> / <span className="text-ink">{p.name}</span>
      </nav>
      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
        <Gallery images={p.images} name={p.name} badge={p.badge} />
        <BuyBox p={p} upsell={[...others].filter((o) => o.price < p.price).sort((a, b) => a.price - b.price).slice(0, 3)} />
      </div>
      <Reviews p={p} reviews={reviews} />
      {others.length > 0 && (
        <section className="py-16">
          <SectionHead kicker="Pairs well with" title="You may" accent="also love" />
          <div className="mt-10"><ProductRail products={others} /></div>
        </section>
      )}
    </div>
  );
}
