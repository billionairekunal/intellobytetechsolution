"use client";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Check, ChevronDown, Heart, Minus, Package, Plus, RotateCcw, ShieldCheck, Truck, Zap } from "lucide-react";
import { useStore } from "./store";
import { Reveal, SectionHead, Stars } from "./ui";
import { inr, off } from "@/lib/format";
import { addReview } from "@/app/actions";
import type { Product, Review } from "@/lib/types";

export function Gallery({ images, name, badge }: { images: string[]; name: string; badge: string | null }) {
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  return (
    <div className="lg:sticky lg:top-28 lg:self-start">
      <div className="flex flex-col-reverse gap-3 sm:flex-row">
        {images.length > 1 && (
          <div className="no-scrollbar flex gap-3 overflow-x-auto sm:flex-col">
            {images.map((src, k) => (
              <button key={src} onClick={() => setI(k)} aria-label={`View image ${k + 1}`}
                className={`relative size-20 shrink-0 overflow-hidden rounded-2xl bg-sand ring-2 transition ${k === i ? "ring-rose" : "ring-transparent opacity-60 hover:opacity-100"}`}>
                <Image src={src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
        <div
          className="relative aspect-square flex-1 cursor-zoom-in overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#f3eeee] to-[#e6dfe0]"
          onPointerMove={(e) => { if (e.pointerType !== "mouse") return; const r = e.currentTarget.getBoundingClientRect(); setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }); }}
          onPointerLeave={() => setZoom(null)}
        >
          <AnimatePresence mode="popLayout">
            <motion.div key={i} initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              drag={images.length > 1 ? "x" : false} dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, d) => { if (Math.abs(d.offset.x) > 60) setI((v) => (v + (d.offset.x < 0 ? 1 : -1) + images.length) % images.length); }}
              className="absolute inset-0">
              <Image src={images[i]} alt={name} fill priority sizes="(max-width:1024px) 100vw, 55vw" className="object-cover transition-transform duration-300"
                style={zoom ? { transform: "scale(1.8)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined} />
            </motion.div>
          </AnimatePresence>
          {badge && <span className="absolute top-5 left-5 rounded-full bg-ink px-3 py-1.5 text-xs font-extrabold tracking-wider text-white uppercase">{badge}</span>}
          {images.length > 1 && (
            <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-1.5 sm:hidden">
              {images.map((_, k) => <span key={k} className={`h-1.5 rounded-full transition-all ${k === i ? "w-6 bg-ink" : "w-1.5 bg-ink/30"}`} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function BuyBox({ p, upsell }: { p: Product; upsell: Product[] }) {
  const { add, toggleWish, wish, ready } = useStore();
  const [qty, setQty] = useState(1);
  const [extra, setExtra] = useState<string[]>([]);
  const [open, setOpen] = useState<string | null>("about");
  const pct = off(p.price, p.mrp);
  const saved = ready && wish.includes(p.slug);
  const extras = upsell.filter((u) => extra.includes(u.id));
  const total = p.price * qty + extras.reduce((s, u) => s + u.price, 0);
  const addAll = () => {
    add({ id: p.id, slug: p.slug, name: p.name, price: p.price, image: p.images[0] }, qty);
    extras.forEach((u) => add({ id: u.id, slug: u.slug, name: u.name, price: u.price, image: u.images[0] }));
  };

  return (
    <div>
      <Reveal>
        <p className="text-xs font-extrabold tracking-[0.25em] text-rose uppercase">{p.brand}</p>
        <h1 className="display mt-2 text-4xl leading-tight sm:text-5xl">{p.name}</h1>
        <a href="#reviews" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
          {p.review_count > 0 ? <><Stars value={p.rating} /> {p.rating} · {p.review_count} reviews</> : "Be the first to review"}
        </a>
        <div className="mt-6 flex flex-wrap items-baseline gap-3">
          <span className="text-4xl font-extrabold">{inr(p.price)}</span>
          {pct > 0 && <><s className="text-lg text-muted">{inr(p.mrp!)}</s><span className="rounded-full bg-lime px-3 py-1 text-sm font-extrabold">Save {pct}%</span></>}
        </div>
        <p className="mt-1 text-xs text-muted">Inclusive of all taxes · Free delivery over ₹999</p>
        <p className="mt-5 text-ink/75">{p.short}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {p.features.map((f) => <li key={f} className="rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-ink/75 shadow-sm">{f}</li>)}
        </ul>
      </Reveal>

      {upsell.length > 0 && (
        <div className="mt-7 rounded-[1.75rem] bg-white p-5">
          <p className="text-sm font-extrabold">Complete the experience</p>
          <ul className="mt-3 space-y-2">
            {upsell.map((u) => {
              const on = extra.includes(u.id);
              return (
                <li key={u.id}>
                  <button onClick={() => setExtra(on ? extra.filter((x) => x !== u.id) : [...extra, u.id])} aria-pressed={on}
                    className={`flex w-full items-center gap-3 rounded-2xl border p-2 text-left transition ${on ? "border-rose bg-blush/60" : "border-ink/5 hover:border-ink/20"}`}>
                    <span className={`grid size-5 shrink-0 place-items-center rounded-md border-2 transition ${on ? "border-rose bg-rose text-white" : "border-ink/20"}`}>{on && <Check size={12} strokeWidth={3} />}</span>
                    <span className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-sand"><Image src={u.images[0]} alt="" fill sizes="48px" className="object-cover" /></span>
                    <span className="min-w-0 flex-1 truncate text-sm font-bold">{u.name}</span>
                    <span className="text-sm font-extrabold">+{inr(u.price)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="mt-6 flex items-center gap-3">
        <div className="flex items-center rounded-full border border-ink/10 bg-white">
          <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity" className="p-3.5"><Minus size={16} /></button>
          <span className="w-8 text-center font-extrabold" aria-live="polite">{qty}</span>
          <button onClick={() => setQty(Math.min(10, qty + 1))} aria-label="Increase quantity" className="p-3.5"><Plus size={16} /></button>
        </div>
        <motion.button whileTap={{ scale: 0.97 }} onClick={addAll} disabled={p.stock < 1}
          className="flex-1 rounded-full bg-rose py-4 font-extrabold text-white shadow-[0_16px_34px_-14px_var(--color-rose)] transition hover:bg-rose-deep disabled:bg-muted">
          {p.stock < 1 ? "Sold out" : `Add to bag · ${inr(total)}`}
        </motion.button>
        <motion.button whileTap={{ scale: 0.8 }} onClick={() => toggleWish(p.slug)} aria-label="Save to wishlist" aria-pressed={saved} className="grid size-14 place-items-center rounded-full border border-ink/10 bg-white">
          <Heart size={20} className={saved ? "fill-rose text-rose" : ""} />
        </motion.button>
      </div>
      {p.stock > 0 && p.stock < 15 && <p className="mt-3 flex items-center gap-2 text-sm font-bold text-rose"><Zap size={15} /> Hurry — only {p.stock} left in stock</p>}

      <div className="mt-6 grid grid-cols-3 gap-2 text-center">
        {[[Truck, "Delivered in 2–5 days"], [Package, "Plain, unmarked box"], [RotateCcw, "7-day sealed returns"]].map(([I, t]) => {
          const Icon = I as typeof Truck;
          return <div key={t as string} className="rounded-2xl bg-white px-2 py-4"><Icon size={18} className="mx-auto text-rose" /><p className="mt-2 text-[0.7rem] leading-tight font-bold">{t as string}</p></div>;
        })}
      </div>

      <div className="mt-6 divide-y divide-ink/10 rounded-[1.75rem] bg-white px-5">
        {[
          ["about", "Description", p.description],
          ["specs", "Highlights", p.features.map((f) => `• ${f}`).join("\n")],
          ["ship", "Shipping & returns", "Ships within 24 hours in a plain, unbranded box with a neutral sender name. Delivered in 2–5 business days across India. Cash on delivery available. Unopened, sealed items can be returned within 7 days of delivery; for hygiene reasons opened intimate products can't be returned unless defective."],
          ["care", "Care & safety", "Clean before and after every use with warm water and mild soap or a toy cleaner. Use water-based lubricant with silicone toys. Store in a cool, dry place away from other toys."],
        ].map(([k, t, body]) => (
          <div key={k}>
            <button onClick={() => setOpen(open === k ? null : k)} aria-expanded={open === k} className="flex w-full items-center justify-between py-4 text-left font-extrabold">
              {t}<ChevronDown size={18} className={`transition-transform duration-500 ${open === k ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {open === k && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
                  <p className="pb-5 text-sm leading-relaxed whitespace-pre-line text-ink/70">{body}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      <p className="mt-5 flex items-center gap-2 text-xs text-muted"><ShieldCheck size={14} className="text-rose" /> 100% authentic · Body-safe materials · Secure checkout</p>

      {/* mobile sticky bar */}
      <div className="fixed inset-x-3 bottom-[5.25rem] z-30 flex items-center gap-3 rounded-full bg-white p-2 pl-5 shadow-2xl sm:hidden">
        <span className="font-extrabold">{inr(p.price)}</span>
        <button onClick={addAll} disabled={p.stock < 1} className="flex-1 rounded-full bg-rose py-3 text-sm font-extrabold text-white disabled:bg-muted">{p.stock < 1 ? "Sold out" : "Add to bag"}</button>
      </div>
    </div>
  );
}

export function Reviews({ p, reviews }: { p: Product; reviews: Review[] }) {
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => { createClient().auth.getSession().then(({ data }) => setSignedIn(!!data.session)); }, []);
  const [state, action, pending] = useActionState(addReview, null);
  const [rating, setRating] = useState(5);
  const dist = [5, 4, 3, 2, 1].map((s) => [s, reviews.filter((r) => r.rating === s).length] as const);
  return (
    <section id="reviews" className="scroll-mt-28 py-20">
      <SectionHead kicker="Reviews" title="What people" accent="are saying" />
      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[22rem_1fr]">
        <div className="space-y-4 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[2rem] bg-white p-7">
            <p className="display text-7xl">{p.review_count ? p.rating : "–"}</p>
            <Stars value={p.rating} size={18} />
            <p className="mt-1 text-sm text-muted">Based on {p.review_count} reviews</p>
            <ul className="mt-5 space-y-2">
              {dist.map(([s, n]) => (
                <li key={s} className="flex items-center gap-3 text-xs font-bold">
                  <span className="w-3">{s}</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-ink/10"><motion.span className="block h-full rounded-full bg-rose" initial={{ width: 0 }} whileInView={{ width: `${reviews.length ? (n / reviews.length) * 100 : 0}%` }} viewport={{ once: true }} transition={{ duration: 1 }} /></span>
                  <span className="w-5 text-right text-muted">{n}</span>
                </li>
              ))}
            </ul>
          </div>
          {signedIn ? (
            <form action={action} className="space-y-3 rounded-[2rem] bg-white p-7">
              <p className="font-extrabold">Write a review</p>
              <input type="hidden" name="product_id" value={p.id} /><input type="hidden" name="slug" value={p.slug} /><input type="hidden" name="rating" value={rating} />
              <div className="flex gap-1" role="radiogroup" aria-label="Rating">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} type="button" role="radio" aria-checked={rating === s} aria-label={`${s} stars`} onClick={() => setRating(s)} className={`text-2xl transition hover:scale-125 ${s <= rating ? "text-rose" : "text-ink/20"}`}>★</button>
                ))}
              </div>
              <input name="title" placeholder="Headline" maxLength={80} className="w-full rounded-xl bg-porcelain px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-rose" />
              <textarea name="body" placeholder="Tell others what you think (stays anonymous to your first name)" rows={3} maxLength={1000} className="w-full rounded-xl bg-porcelain px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-rose" />
              <button disabled={pending} className="w-full rounded-full bg-ink py-3 text-sm font-bold text-white disabled:opacity-50">{pending ? "Posting…" : "Post review"}</button>
              {state && <p className={`text-sm ${state.ok ? "text-green-700" : "text-rose"}`} role="status">{state.msg}</p>}
            </form>
          ) : (
            <Link href={`/login?next=/product/${p.slug}`} className="block rounded-[2rem] bg-ink p-6 text-center text-sm font-bold text-white">Sign in to write a review</Link>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {reviews.map((r, i) => (
            <Reveal key={r.id} delay={(i % 2) * 0.08} className="rounded-[1.75rem] bg-white p-6">
              <div className="flex items-center justify-between"><Stars value={r.rating} /><span className="text-xs text-muted">{new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span></div>
              {r.title && <p className="mt-3 font-extrabold">{r.title}</p>}
              {r.body && <p className="mt-1 text-sm leading-relaxed text-ink/70">{r.body}</p>}
              <p className="mt-4 flex items-center gap-2 text-xs font-bold"><span className="grid size-7 place-items-center rounded-full bg-gradient-to-br from-rose to-lilac text-white">{r.author[0]}</span>{r.author}</p>
            </Reveal>
          ))}
          {!reviews.length && <p className="rounded-[1.75rem] bg-white p-8 text-muted sm:col-span-2">No reviews yet — be the first to share your experience.</p>}
        </div>
      </div>
    </section>
  );
}
