"use client";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Plus, Star } from "lucide-react";
import { useStore } from "./store";
import { inr, off } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ p, i = 0, dark }: { p: Product; i?: number; dark?: boolean }) {
  const { add, toggleWish, wish, ready } = useStore();
  const saved = ready && wish.includes(p.slug);
  const pct = off(p.price, p.mrp);
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, delay: (i % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-gradient-to-b from-[#f3eeee] to-[#e6dfe0]">
        <Link href={`/product/${p.slug}`} className="absolute inset-0" aria-label={p.name}>
          <Image src={p.images[0]} alt={p.name} fill sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
            className="object-cover transition-all duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-110 group-hover:opacity-0" />
          {p.images[1] && (
            <Image src={p.images[1]} alt="" fill sizes="(max-width:640px) 50vw, 25vw" aria-hidden
              className="scale-110 object-cover opacity-0 transition-all duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-100 group-hover:opacity-100" />
          )}
        </Link>
          <div className="pointer-events-none absolute top-3 left-3 flex flex-col items-start gap-1.5">
            {p.badge && <span className="rounded-full bg-ink px-2.5 py-1 text-[0.62rem] font-extrabold tracking-wider text-white uppercase">{p.badge}</span>}
            {pct >= 20 && <span className="rounded-full bg-lime px-2.5 py-1 text-[0.62rem] font-extrabold text-ink">-{pct}%</span>}
          </div>
          <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1.5 text-sm font-extrabold text-ink shadow-sm backdrop-blur">{inr(p.price)}</span>

      <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={() => toggleWish(p.slug)}
        aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
        aria-pressed={saved}
        className="absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:scale-110"
      >
        <Heart size={17} className={saved ? "fill-rose text-rose" : "text-ink"} />
      </motion.button>
      <button
        onClick={() => add({ id: p.id, slug: p.slug, name: p.name, price: p.price, image: p.images[0] })}
        disabled={p.stock < 1}
        aria-label={`Add ${p.name} to bag`}
        className="absolute right-3 bottom-3 grid size-11 place-items-center rounded-full bg-rose text-white shadow-[0_10px_24px_-8px_var(--color-rose)] transition-all duration-500 ease-[var(--ease-out-expo)] hover:scale-110 hover:bg-rose-deep disabled:bg-muted sm:translate-y-3 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
      >
        <Plus size={20} />
      </button>
      </div>

      <Link href={`/product/${p.slug}`} className="block h-24 px-1 pt-3">
        <div className="flex items-center justify-between gap-2">
          <p className={`text-[0.65rem] font-extrabold tracking-[0.18em] uppercase ${dark ? "text-lilac" : "text-rose"}`}>{p.brand}</p>
          {p.review_count > 0 && (
            <span className={`flex items-center gap-1 text-xs font-bold ${dark ? "text-white/70" : "text-ink/70"}`}>
              <Star size={12} className="fill-rose text-rose" /> {p.rating} <span className="font-medium opacity-60">({p.review_count})</span>
            </span>
          )}
        </div>
        <h3 className={`mt-1 line-clamp-1 font-bold ${dark ? "text-white" : "text-ink"}`}>{p.name}</h3>
        <p className={`mt-0.5 flex items-baseline gap-2 text-sm ${dark ? "text-white/50" : "text-muted"}`}>
          {p.mrp && p.mrp > p.price && <s>{inr(p.mrp)}</s>}
          {p.stock < 1 ? <span className="font-bold text-rose">Sold out</span> : p.stock < 15 ? <span className="font-semibold text-rose">Only {p.stock} left</span> : null}
        </p>
      </Link>
    </motion.article>
  );
}

export function ProductGrid({ products, dark }: { products: Product[]; dark?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p, i) => <ProductCard key={p.id} p={p} i={i} dark={dark} />)}
    </div>
  );
}

export function ProductRail({ products, dark }: { products: Product[]; dark?: boolean }) {
  return (
    <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6">
      {products.map((p, i) => (
        <div key={p.id} className="w-[46vw] shrink-0 snap-start sm:w-64 lg:w-72"><ProductCard p={p} i={i} dark={dark} /></div>
      ))}
    </div>
  );
}
