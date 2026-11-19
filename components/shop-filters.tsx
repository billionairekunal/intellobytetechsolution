"use client";
import { motion } from "motion/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Loader2, X } from "lucide-react";

const TAGS = [["her", "For Her"], ["him", "For Him"], ["couples", "Couples"], ["luxe", "Luxe"], ["new", "New"], ["beginner", "Beginner"], ["discreet", "Discreet"], ["sale", "Sale"]];
const PRICES = [["1999", "Under ₹2k"], ["4999", "Under ₹5k"], ["9999", "Under ₹10k"]];

export function ShopFilters({ cats }: { cats: { slug: string; name: string }[] }) {
  const sp = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const [pending, start] = useTransition();
  const set = (k: string, v?: string) => {
    const n = new URLSearchParams(sp);
    if (!v || n.get(k) === v) n.delete(k); else n.set(k, v);
    start(() => router.push(`${path}?${n}`, { scroll: false }));
  };
  const Chip = ({ k, v, label }: { k: string; v: string; label: string }) => {
    const on = sp.get(k) === v;
    return (
      <button onClick={() => set(k, v)} aria-pressed={on} className={`relative shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition ${on ? "border-ink text-white" : "border-ink/10 bg-white text-ink/70 hover:border-ink/30"}`}>
        {on && <motion.span layoutId={`chip-${k}`} className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
        <span className="relative">{label}</span>
      </button>
    );
  };
  const active = [...sp.keys()].length > 0;
  return (
    <div className="sticky top-[5.2rem] z-30 -mx-5 mt-6 space-y-2 bg-porcelain/85 px-5 py-3 backdrop-blur-lg sm:-mx-8 sm:px-8">
      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
        {cats.map((c) => <Chip key={c.slug} k="c" v={c.slug} label={c.name} />)}
      </div>
      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
        {TAGS.map(([v, l]) => <Chip key={v} k="t" v={v} label={l} />)}
        <span className="mx-1 h-6 w-px shrink-0 bg-ink/10" />
        {PRICES.map(([v, l]) => <Chip key={v} k="max" v={v} label={l} />)}
        <select value={sp.get("sort") ?? ""} onChange={(e) => set("sort", e.target.value || undefined)} aria-label="Sort products"
          className="ml-auto shrink-0 rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-bold outline-none">
          <option value="">Most popular</option><option value="new">Newest</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option>
        </select>
        {active && <button onClick={() => start(() => router.push(path, { scroll: false }))} className="flex shrink-0 items-center gap-1 rounded-full px-3 py-2 text-sm font-bold text-rose"><X size={14} />Clear</button>}
        {pending && <Loader2 size={18} className="shrink-0 animate-spin text-rose" />}
      </div>
    </div>
  );
}
