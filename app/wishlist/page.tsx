import { getProducts } from "@/lib/data";
import { WishlistGrid } from "@/components/wishlist-grid";

export const metadata = { title: "Wishlist" };
export const revalidate = 300;

export default async function Wishlist() {
  const products = await getProducts();
  return (
    <div className="mx-auto max-w-7xl px-5 pt-10 sm:px-8">
      <h1 className="display text-5xl sm:text-6xl">Saved for <em className="text-rose">later</em></h1>
      <p className="mt-2 text-muted">Your wishlist lives on this device — private by design.</p>
      <WishlistGrid products={products} />
    </div>
  );
}
