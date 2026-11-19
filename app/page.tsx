import { getCategories, getProducts } from "@/lib/data";
import { publicClient } from "@/lib/supabase/server";
import { Bestsellers, Brands, Bubbles, CategoryArches, DiscreetStory, Hero, LuxeSpotlight, Moods, OfferBand, ProductRail, QuizCta, ReviewWall, Stats } from "@/components/home";
import { SectionHead } from "@/components/ui";

export const revalidate = 300;

export default async function Home() {
  const [products, cats, { data: reviews }] = await Promise.all([
    getProducts(),
    getCategories(),
    publicClient().from("reviews").select("id,author,rating,title,body,product:products(name,slug,images)").gte("rating", 5).order("created_at", { ascending: false }).limit(16),
  ]);
  const bySlug = (s: string) => products.find((p) => p.slug === s) ?? products[0];
  const brands = [...new Set(products.map((p) => p.brand!).filter((b) => b && b !== "Intellobyte"))];
  const fresh = products.filter((p) => p.tags.includes("new"));

  return (
    <>
      <Hero spot={bySlug("satisfyer-pro-2-air-pulse")} />
      <Bubbles />
      <CategoryArches cats={cats} />
      <Bestsellers products={products} />
      <Moods />
      <OfferBand />
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <SectionHead kicker="Just landed" title="New" accent="arrivals" />
        <div className="mt-10"><ProductRail products={fresh} /></div>
      </section>
      <LuxeSpotlight p={bySlug("lelo-ora-3")} />
      <DiscreetStory />
      <Brands brands={brands} />
      <Stats products={products.length} brands={brands.length} />
      {/* @ts-expect-error supabase infers the join as an array */}
      <ReviewWall reviews={reviews ?? []} />
      <QuizCta />
    </>
  );
}
