export type Product = {
  id: string; slug: string; name: string; brand: string | null; category: string; tags: string[];
  price: number; mrp: number | null; badge: string | null; short: string | null; description: string | null;
  features: string[]; images: string[]; stock: number; rating: number; review_count: number; created_at: string;
};
export type Category = { slug: string; name: string; tagline: string | null; image: string | null; sort: number };
export type Review = { id: string; author: string; rating: number; title: string | null; body: string | null; created_at: string };
export type CartItem = { id: string; slug: string; name: string; price: number; image: string; qty: number };
