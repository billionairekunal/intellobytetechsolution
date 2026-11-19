"use client";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, BadgeCheck, EyeOff, Lock, Package, Plus, Sparkles, Truck } from "lucide-react";
import { Counter, Magnetic, Marquee, Reveal, SectionHead, SplitText, Stars } from "./ui";
import { ProductCard, ProductRail } from "./product-card";
import { useStore } from "./store";
import { inr } from "@/lib/format";
import type { Category, Product } from "@/lib/types";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero({ spot }: { spot: Product }) {
  const { add } = useStore();
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 }), sy = useSpring(my, { stiffness: 60, damping: 20 });
  const ix = useTransform(sx, (v) => v * -18), iy = useTransform(sy, (v) => v * -18);
  const cx = useTransform(sx, (v) => v * 30), cy = useTransform(sy, (v) => v * 30);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const fade = useTransform(scrollYProgress, [0, 1], [1, 0.3]);
  const lift = useTransform(scrollYProgress, [0, 1], [0, -120]);

  return (
    <section
      ref={ref}
      onPointerMove={(e) => { mx.set(e.clientX / innerWidth - 0.5); my.set(e.clientY / innerHeight - 0.5); }}
      className="grain relative -mt-[4.6rem] overflow-hidden rounded-b-[2.5rem] bg-plum pt-[4.6rem] text-white sm:rounded-b-[3.5rem]"
    >
      <motion.div style={{ x: cx, y: cy }} className="pointer-events-none absolute top-10 -left-32 size-[34rem] rounded-full bg-rose/35 blur-[120px]" />
      <motion.div style={{ x: ix, y: iy }} className="pointer-events-none absolute -right-20 bottom-0 size-[30rem] rounded-full bg-lilac/30 blur-[120px]" />

      <motion.div style={{ opacity: fade, y: lift }} className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pt-14 pb-20 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:pt-20 lg:pb-28">
        <div>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold tracking-wide text-white/80 backdrop-blur">
            <Sparkles size={14} className="text-lime" /> India&apos;s smartest pleasure boutique
          </motion.p>
          <h1 className="display mt-7 text-[3.2rem] leading-[0.95] font-medium sm:text-7xl lg:text-[5.6rem]">
            <SplitText text="Pleasure," delay={0.1} /><br />
            <em className="font-normal text-lime"><SplitText text="intelligently" delay={0.25} /></em><br />
            <SplitText text="designed." delay={0.4} />
          </h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.9, ease }} className="mt-7 max-w-md text-lg text-white/65">
            Curated, body-safe toys from the world&apos;s most loved brands — delivered in a plain box, with zero awkwardness.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 0.9, ease }} className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic>
              <Link href="/shop?t=bestseller" className="group inline-flex items-center gap-3 rounded-full bg-lime py-2 pr-2 pl-6 font-extrabold text-ink transition hover:shadow-[0_0_40px_-5px_var(--color-lime)]">
                Shop bestsellers
                <span className="grid size-10 place-items-center rounded-full bg-ink text-lime transition-transform duration-500 group-hover:rotate-45"><ArrowUpRight size={18} /></span>
              </Link>
            </Magnetic>
            <Link href="/quiz" className="rounded-full border border-white/20 px-6 py-4 font-bold text-white/90 transition hover:bg-white hover:text-ink">Take the 30-sec quiz</Link>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 1 }} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/60">
            {[[Package, "Plain box"], [Truck, "2–5 day delivery"], [Lock, "Cash on delivery"]].map(([I, t]) => {
              const Icon = I as typeof Package;
              return <span key={t as string} className="flex items-center gap-2"><Icon size={16} className="text-lime" />{t as string}</span>;
            })}
          </motion.div>
        </div>

        <div className="relative mx-auto w-full max-w-[30rem]">
          <motion.div initial={{ clipPath: "inset(100% 0 0 0 round 999px 999px 28px 28px)" }} animate={{ clipPath: "inset(0% 0 0 0 round 999px 999px 28px 28px)" }}
            transition={{ duration: 1.4, delay: 0.2, ease }} style={{ x: ix, y: iy }} className="relative aspect-[4/5] overflow-hidden arch">
            <motion.div initial={{ scale: 1.3 }} animate={{ scale: 1 }} transition={{ duration: 2.2, ease }} className="absolute inset-0">
              <Image src="/e/hero-5.webp" alt="Hands holding a rose-gold air-pulse massager" fill priority sizes="(max-width:1024px) 90vw, 480px" className="object-cover" />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-plum/60 via-transparent" />
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1, duration: 1, ease }}
            className="absolute -top-4 -left-6 sm:-left-14">
            <div className="relative grid size-28 animate-spin-slow place-items-center sm:size-32">
              <svg viewBox="0 0 100 100" className="absolute inset-0" aria-hidden>
                <defs><path id="c" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" /></defs>
                <text className="fill-white text-[8.5px] font-bold uppercase"><textPath href="#c" textLength="236" lengthAdjust="spacing">discreet • body-safe • authentic •</textPath></text>
              </svg>
            </div>
            <span className="absolute inset-0 m-auto grid size-12 place-items-center rounded-full bg-rose text-xl">♥</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2, duration: 1, ease }} style={{ x: cx, y: cy }}
            className="absolute top-[18%] -right-3 hidden w-36 overflow-hidden rounded-[1.5rem] border-4 border-plum shadow-2xl sm:block lg:-right-12">
            <div className="relative aspect-square"><Image src="/e/hero-2.webp" alt="" fill sizes="144px" className="object-cover" /></div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.35, duration: 1, ease }}
            className="absolute -bottom-6 left-2 flex animate-float items-center gap-3 rounded-[1.4rem] border border-white/15 bg-white/10 p-2.5 pr-3 shadow-2xl backdrop-blur-xl sm:-left-10">
            <Link href={`/product/${spot.slug}`} className="relative size-14 overflow-hidden rounded-xl bg-white">
              <Image src={spot.images[0]} alt={spot.name} fill sizes="56px" className="object-cover" />
            </Link>
            <div className="min-w-0">
              <p className="text-[0.6rem] font-extrabold tracking-widest text-lime uppercase">#1 Bestseller</p>
              <p className="max-w-[9rem] truncate text-sm font-bold">{spot.name}</p>
              <p className="text-sm text-white/70">{inr(spot.price)}</p>
            </div>
            <button onClick={() => add({ id: spot.id, slug: spot.slug, name: spot.name, price: spot.price, image: spot.images[0] })} aria-label={`Add ${spot.name} to bag`}
              className="grid size-10 place-items-center rounded-full bg-lime text-ink transition hover:scale-110"><Plus size={18} /></button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

const BUBBLES = [
  ["b-sale", "Up to 60% off", "/shop?t=sale"], ["b-vibes", "Vibrators", "/shop?c=vibrators"], ["b-smart", "App toys", "/shop?c=smart"],
  ["b-strokers", "Strokers", "/shop?c=strokers"], ["b-plugs", "Plugs", "/shop?c=anal"], ["b-cups", "For Him", "/shop?t=him"],
  ["s-couples", "Couples", "/shop?t=couples"], ["s-prostate", "Prostate", "/shop?c=prostate"], ["s-vibes", "For Her", "/shop?t=her"],
];
export function Bubbles() {
  return (
    <div className="no-scrollbar mx-auto flex max-w-7xl gap-4 overflow-x-auto px-5 py-10 sm:justify-center sm:gap-6 sm:px-8">
      {BUBBLES.map(([img, label, href], i) => (
        <motion.div key={img} initial={{ opacity: 0, y: 20, scale: 0.8 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.7, ease }}>
          <Link href={href} className="group flex w-[4.75rem] shrink-0 flex-col items-center gap-2 sm:w-24">
            <span className="rounded-full bg-[conic-gradient(from_180deg,var(--color-rose),var(--color-lilac),var(--color-lime),var(--color-rose))] p-[3px] transition-transform duration-500 group-hover:scale-105 group-hover:rotate-6">
              <span className="block rounded-full bg-porcelain p-[3px]">
                <span className="relative block size-[4.2rem] overflow-hidden rounded-full sm:size-[5.2rem]">
                  <Image src={`/e/${img}.webp`} alt="" fill sizes="96px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                </span>
              </span>
            </span>
            <span className="text-center text-xs font-bold text-ink/80">{label}</span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

const TINTS = ["#f9d9e2", "#e5dcff", "#e8f7b8", "#ffe1cf", "#d9ecf6", "#f4d6f0", "#efe4dc"];
export function CategoryArches({ cats }: { cats: Category[] }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHead kicker="Explore collections" title="Find what" accent="moves you" />
        <Reveal><Link href="/shop" className="group inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-3 text-sm font-bold transition hover:bg-ink hover:text-white">Browse everything <ArrowRight size={16} className="transition group-hover:translate-x-1" /></Link></Reveal>
      </div>
      <div className="no-scrollbar -mx-5 mt-12 flex snap-x gap-4 overflow-x-auto px-5 pb-4 sm:-mx-8 sm:px-8 lg:grid lg:grid-cols-7 lg:overflow-visible">
        {cats.map((c, i) => (
          <motion.div key={c.slug} initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.9, ease }}
            className="w-40 shrink-0 snap-start lg:w-auto">
            <Link href={`/shop?c=${c.slug}`} className="group block">
              <div className="relative aspect-[3/4.4] overflow-hidden arch p-2 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-3" style={{ background: TINTS[i % TINTS.length] }}>
                <div className="relative h-full overflow-hidden arch">
                  <Image src={c.image!} alt={c.name} fill sizes="200px" className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                </div>
                <span className="absolute right-3 bottom-3 grid size-9 scale-0 place-items-center rounded-full bg-ink text-white transition-transform duration-500 group-hover:scale-100"><ArrowUpRight size={16} /></span>
              </div>
              <p className="mt-3 font-bold leading-tight">{c.name}</p>
              <p className="text-xs text-muted">{c.tagline}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const TABS = [["her", "For Her"], ["him", "For Him"], ["couples", "Couples"], ["smart", "Smart"], ["luxe", "Luxe"]] as const;
export function Bestsellers({ products }: { products: Product[] }) {
  const [tab, setTab] = useState<string>("her");
  const list = products.filter((p) => p.tags.includes(tab)).slice(0, 8);
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <SectionHead kicker="Loved right now" title="Our" accent="bestsellers" sub="The toys our customers keep coming back for — chosen for quality, power and how quietly they ship." />
        <div className="no-scrollbar -mx-5 flex gap-1 overflow-x-auto px-5 lg:mx-0 lg:rounded-full lg:bg-white lg:p-1.5 lg:px-1.5 lg:shadow-sm" role="tablist">
          {TABS.map(([k, l]) => (
            <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className="relative shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition">
              {tab === k && <motion.span layoutId="best-tab" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
              <span className={`relative ${tab === k ? "text-white" : "text-ink/60 hover:text-ink"}`}>{l}</span>
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}
          className="mt-12 grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
          {list.map((p, i) => <ProductCard key={p.id} p={p} i={i} />)}
        </motion.div>
      </AnimatePresence>
      <div className="mt-10 text-center">
        <Link href={`/shop?t=${tab}`} className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-sm font-bold text-white transition hover:bg-plum-2">
          View all {TABS.find((t) => t[0] === tab)?.[1]} <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

const MOODS = [
  ["Quiet & discreet", "Whisper-soft, bag-friendly", "/shop?t=discreet", "/e/life-5.webp", "#f9d9e2"],
  ["First-timer friendly", "Easy, gentle, joyful", "/shop?t=beginner", "/e/life-4.webp", "#e8f7b8"],
  ["Long-distance love", "Control it from anywhere", "/shop?c=smart", "/e/cat-smart.webp", "#e5dcff"],
  ["Hands-free bliss", "Set it and forget it", "/shop?c=prostate", "/e/life-6.webp", "#ffe1cf"],
];
export function Moods() {
  return (
    <section className="px-3 py-10 sm:px-5">
      <div className="grain relative mx-auto max-w-[90rem] overflow-hidden rounded-[2.5rem] bg-ink px-5 py-16 sm:px-10 lg:py-20">
        <div className="pointer-events-none absolute -top-32 right-0 size-96 rounded-full bg-rose/30 blur-[120px]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_2.2fr]">
          <SectionHead light kicker="Shop by mood" title="Design by" accent="desire" sub="Not sure what you're looking for? Start with how you want to feel." />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {MOODS.map(([t, s, href, img, tint], i) => (
              <motion.div key={t} initial={{ opacity: 0, y: 50, rotate: i % 2 ? 4 : -4 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 1, ease }}
                className={i % 2 ? "lg:mt-12" : ""}>
                <Link href={href} className="group block">
                  <div className="relative aspect-square overflow-hidden rounded-full p-2 transition-transform duration-700 group-hover:scale-[1.04]" style={{ background: tint }}>
                    <div className="relative h-full overflow-hidden rounded-full">
                      <Image src={img} alt="" fill sizes="240px" className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                    </div>
                    <span className="absolute bottom-[8%] left-1/2 grid size-11 -translate-x-1/2 place-items-center rounded-full bg-white text-ink shadow-lg transition group-hover:bg-lime"><ArrowRight size={18} /></span>
                  </div>
                  <p className="display mt-4 text-center text-xl text-white">{t}</p>
                  <p className="text-center text-xs text-white/50">{s}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function OfferBand() {
  return (
    <section className="px-3 py-10 sm:px-5">
      <Reveal className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[linear-gradient(110deg,#ffd6e5,#e5dcff_35%,#fff6c9_65%,#ffd6e5)] bg-[length:200%_100%] p-1 [animation:shine_8s_linear_infinite]">
        <div className="flex flex-col items-center justify-between gap-6 rounded-[1.8rem] bg-white/40 px-6 py-8 text-center backdrop-blur sm:flex-row sm:px-10 sm:text-left">
          <p className="display text-2xl italic">First time here?</p>
          <p className="display text-4xl font-semibold sm:text-5xl">Take <span className="text-rose">10% OFF</span></p>
          <div className="flex items-center gap-3">
            <span className="rounded-full border-2 border-dashed border-ink/30 px-5 py-3 font-mono text-sm font-bold tracking-widest">WELCOME10</span>
            <Link href="/shop" className="rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-white transition hover:bg-rose">Shop now</Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

const STEPS = [
  [Package, "A plain, unmarked box", "No logos, no product names, no tell-tale shapes. Just a neutral brown parcel.", "#f9d9e2"],
  [EyeOff, "A neutral sender name", "The label and courier details never mention what's inside.", "#e5dcff"],
  [Lock, "Private billing", "Your bank statement shows a discreet merchant name. Nobody needs to know.", "#e8f7b8"],
  [BadgeCheck, "Sealed & authentic", "Every toy is brand-new, factory-sealed and 100% genuine.", "#ffe1cf"],
] as const;
export function DiscreetStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const h = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const rot = useTransform(scrollYProgress, [0, 1], [-8, 8]);
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <div ref={ref} className="grid grid-cols-1 gap-14 lg:grid-cols-2">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHead kicker="Privacy, obsessively" title="Nobody knows." accent="Except you." sub="We built Intellobyte for people who value their privacy as much as their pleasure." />
          <motion.div style={{ rotate: rot }} className="relative mt-10 hidden aspect-[4/3] max-w-md overflow-hidden rounded-[2rem] bg-[#c9a27e] p-8 shadow-2xl lg:block">
            <div className="absolute inset-x-0 top-1/2 h-10 -translate-y-1/2 bg-[#b48b66]" />
            <div className="absolute top-8 right-8 w-40 rotate-2 rounded-lg bg-white p-3 text-[0.6rem] text-ink/70 shadow">
              <div className="mb-2 h-6 bg-[repeating-linear-gradient(90deg,#140a18_0_2px,transparent_2px_4px)]" />
              <p className="font-bold">SHIP TO: You</p><p>FROM: IB Retail Pvt Ltd</p><p>CONTENTS: Lifestyle goods</p>
            </div>
            <p className="absolute bottom-6 left-8 font-mono text-xs tracking-widest text-ink/50">FRAGILE · HANDLE WITH CARE</p>
          </motion.div>
        </div>
        <div className="relative pl-10">
          <div className="absolute top-0 bottom-0 left-4 w-0.5 rounded-full bg-ink/10"><motion.div style={{ height: h }} className="w-full rounded-full bg-gradient-to-b from-rose to-lilac" /></div>
          {STEPS.map(([Icon, t, s, tint], i) => (
            <Reveal key={t} delay={0.05} className="relative mb-8 last:mb-0">
              <span className="absolute top-8 -left-[2.3rem] size-4 rounded-full border-4 border-porcelain bg-rose" />
              <div className="rounded-[2rem] p-8" style={{ background: tint }}>
                <span className="grid size-12 place-items-center rounded-2xl bg-white text-rose shadow-sm"><Icon size={22} /></span>
                <p className="mt-2 text-right font-mono text-xs text-ink/40">0{i + 1}</p>
                <h3 className="display text-3xl">{t}</h3>
                <p className="mt-2 text-ink/70">{s}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LuxeSpotlight({ p }: { p: Product }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const { add } = useStore();
  return (
    <section ref={ref} className="px-3 py-10 sm:px-5">
      <div className="grain relative mx-auto grid max-w-[90rem] overflow-hidden rounded-[2.5rem] bg-plum text-white lg:grid-cols-2">
        <div className="relative min-h-[26rem] overflow-hidden">
          <motion.div style={{ y }} className="absolute -inset-y-[15%] inset-x-0">
            <Image src={p.images[p.images.length - 1]} alt={p.name} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-plum/80 max-lg:bg-gradient-to-t" />
        </div>
        <div className="relative flex flex-col justify-center p-8 sm:p-14">
          <p className="text-xs font-extrabold tracking-[0.3em] text-lime uppercase">The Luxe Edit</p>
          <h2 className="display mt-4 text-5xl leading-none sm:text-6xl"><SplitText text={p.name} /></h2>
          <p className="mt-5 max-w-md text-white/65">{p.short}</p>
          <ul className="mt-7 grid grid-cols-2 gap-3">
            {p.features.slice(0, 4).map((f) => <li key={f} className="flex items-center gap-2 text-sm"><Sparkles size={14} className="text-lilac" />{f}</li>)}
          </ul>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <p className="text-3xl font-extrabold">{inr(p.price)}</p>
            {p.mrp && <s className="text-white/40">{inr(p.mrp)}</s>}
            <button onClick={() => add({ id: p.id, slug: p.slug, name: p.name, price: p.price, image: p.images[0] })} className="rounded-full bg-lime px-7 py-4 font-extrabold text-ink transition hover:scale-105">Add to bag</button>
            <Link href={`/product/${p.slug}`} className="font-bold underline decoration-lilac underline-offset-4">Details</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Brands({ brands }: { brands: string[] }) {
  return (
    <section className="py-14">
      <p className="mb-6 text-center text-xs font-extrabold tracking-[0.3em] text-muted uppercase">Authorised stockist of the world&apos;s best</p>
      <Marquee>
        {brands.map((b) => (
          <span key={b} className="display mx-6 flex items-center gap-12 text-4xl text-ink/80 italic sm:text-6xl">
            {b}<span className="size-3 rounded-full bg-rose not-italic" />
          </span>
        ))}
      </Marquee>
    </section>
  );
}

export function Stats({ products, brands }: { products: number; brands: number }) {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-5 py-10 sm:px-8 lg:grid-cols-4">
      {[[products, "+", "Curated toys", "#f9d9e2"], [brands, "", "Global brands", "#e5dcff"], [100, "%", "Plain packaging", "#e8f7b8"], [7, "-day", "Easy returns on sealed items", "#ffe1cf"]].map(([n, s, l, c], i) => (
        <Reveal key={l as string} delay={i * 0.08} className="rounded-[2rem] p-7" style={{ background: c as string }}>
          <p className="display text-5xl font-semibold sm:text-6xl"><Counter to={n as number} suffix={s as string} /></p>
          <p className="mt-2 text-sm font-semibold text-ink/60">{l as string}</p>
        </Reveal>
      ))}
    </section>
  );
}

type R = { id: string; author: string; rating: number; title: string | null; body: string | null; product: { name: string; slug: string; images: string[] } | null };
export function ReviewWall({ reviews }: { reviews: R[] }) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8"><SectionHead kicker="Real talk" title="Loved by" accent="our people" /></div>
      <div className="mt-12 space-y-4">
        {[reviews.slice(0, Math.ceil(reviews.length / 2)), reviews.slice(Math.ceil(reviews.length / 2))].map((row, k) => (
          <Marquee key={k} reverse={k === 1}>
            {row.map((r) => (
              <figure key={r.id} className="mx-2 w-80 shrink-0 rounded-[1.75rem] bg-white p-6 shadow-[0_10px_40px_-25px_rgba(20,10,24,.4)]">
                <Stars value={r.rating} />
                <blockquote className="mt-3"><p className="font-bold">{r.title}</p><p className="mt-1 line-clamp-3 text-sm text-ink/65">{r.body}</p></blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-ink/5 pt-4">
                  <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-rose to-lilac text-sm font-bold text-white">{r.author[0]}</span>
                  <span className="min-w-0 flex-1"><span className="block text-sm font-bold">{r.author}</span>
                    {r.product && <Link href={`/product/${r.product.slug}`} className="block truncate text-xs text-muted hover:text-rose">on {r.product.name}</Link>}</span>
                </figcaption>
              </figure>
            ))}
          </Marquee>
        ))}
      </div>
    </section>
  );
}

export function QuizCta() {
  return (
    <section className="px-3 py-10 sm:px-5">
      <div className="relative mx-auto grid max-w-7xl items-center gap-8 overflow-hidden rounded-[2.5rem] bg-lime p-8 sm:p-14 lg:grid-cols-2">
        <div className="pointer-events-none absolute -right-20 -bottom-20 size-80 rounded-full bg-lilac/60 blur-3xl" />
        <div className="relative">
          <h2 className="display text-5xl leading-[0.95] sm:text-6xl"><SplitText text="Not sure where" /><br /><em><SplitText text="to start?" delay={0.2} /></em></h2>
          <p className="mt-5 max-w-md text-ink/70">Answer four quick, private questions and we&apos;ll match you with toys made for exactly what you&apos;re into.</p>
          <Magnetic className="mt-8"><Link href="/quiz" className="inline-flex items-center gap-3 rounded-full bg-ink px-8 py-4 font-bold text-white">Find my match <ArrowRight size={18} /></Link></Magnetic>
        </div>
        <div className="relative flex justify-center gap-4">
          {["/e/life-1.webp", "/e/hero-3.webp", "/e/hero-4.webp"].map((s, i) => (
            <motion.div key={s} initial={{ y: 80, opacity: 0 }} whileInView={{ y: i === 1 ? -30 : 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 1, ease }}
              className="relative aspect-[3/4.5] w-1/3 max-w-44 overflow-hidden arch">
              <Image src={s} alt="" fill sizes="180px" className="object-cover" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { ProductRail };
