"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { ProductGrid } from "./product-card";
import type { Product } from "@/lib/types";

type Q = { q: string; key: string; opts: [string, string, string][] };
const QS: Q[] = [
  { q: "Who's this for?", key: "who", opts: [["her", "🌸", "Vulva-owner"], ["him", "🔥", "Penis-owner"], ["couples", "💞", "Us, together"]] },
  { q: "How experienced are you?", key: "exp", opts: [["beginner", "🌱", "Totally new"], ["mid", "✨", "Know what I like"], ["luxe", "👑", "Seasoned explorer"]] },
  { q: "What's the vibe?", key: "vibe", opts: [["discreet", "🤫", "Quiet & discreet"], ["power", "⚡", "Powerful"], ["smart", "📱", "App / long-distance"], ["free", "🙌", "Hands-free"]] },
  { q: "Your budget?", key: "budget", opts: [["3000", "💸", "Under ₹3,000"], ["8000", "💳", "Under ₹8,000"], ["99999", "💎", "Treat myself"]] },
];

function score(p: Product, a: Record<string, string>) {
  let s = 0;
  if (p.tags.includes(a.who)) s += 5; else return -1;
  if (a.exp === "beginner" && p.tags.includes("beginner")) s += 3;
  if (a.exp === "luxe" && p.tags.includes("luxe")) s += 3;
  if (a.vibe === "discreet" && p.tags.includes("discreet")) s += 3;
  if (a.vibe === "smart" && p.tags.includes("smart")) s += 4;
  if (a.vibe === "free" && (p.category === "prostate" || p.tags.includes("smart"))) s += 3;
  if (a.vibe === "power" && (p.category === "suction" || p.category === "strokers")) s += 2;
  if (p.price > Number(a.budget)) return -1;
  return s + p.review_count / 10;
}

export function Quiz({ products }: { products: Product[] }) {
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Record<string, string>>({});
  const done = step >= QS.length;
  const picks = done ? products.map((p) => [p, score(p, a)] as const).filter(([, s]) => s >= 0).sort((x, y) => y[1] - x[1]).slice(0, 8).map(([p]) => p) : [];

  return (
    <div className="mx-auto max-w-5xl px-5 pt-10 sm:px-8">
      <div className="grain relative overflow-hidden rounded-[2.5rem] bg-plum px-6 py-12 text-white sm:px-14 sm:py-16">
        <div className="pointer-events-none absolute -top-20 -left-20 size-80 rounded-full bg-rose/40 blur-[100px]" />
        <div className="relative flex items-center justify-between">
          <button onClick={() => setStep(Math.max(0, step - 1))} disabled={!step} className="flex items-center gap-1 text-sm font-bold text-white/60 disabled:opacity-0"><ArrowLeft size={16} />Back</button>
          <p className="text-xs font-extrabold tracking-[0.3em] text-lime uppercase">{done ? "Your matches" : `Question ${step + 1} of ${QS.length}`}</p>
        </div>
        <div className="relative mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-lime to-lilac" animate={{ width: `${(Math.min(step, QS.length) / QS.length) * 100}%` }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} />
        </div>
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div key={step} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="relative mt-12">
              <h1 className="display text-4xl sm:text-6xl">{QS[step].q}</h1>
              <div className={`mt-10 grid gap-3 ${QS[step].opts.length === 4 ? "sm:grid-cols-4" : "sm:grid-cols-3"} grid-cols-2`}>
                {QS[step].opts.map(([v, e, l], i) => (
                  <motion.button key={v} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }} whileHover={{ y: -6 }} whileTap={{ scale: 0.96 }}
                    onClick={() => { setA({ ...a, [QS[step].key]: v }); setStep(step + 1); }}
                    className={`rounded-[1.75rem] border p-6 text-left transition ${a[QS[step].key] === v ? "border-lime bg-white/15" : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"}`}>
                    <span className="text-4xl">{e}</span><span className="mt-5 block font-bold">{l}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="relative mt-12 flex flex-wrap items-end justify-between gap-4">
              <h1 className="display text-4xl sm:text-6xl">We think you&apos;ll <em className="text-lime">love these.</em></h1>
              <button onClick={() => { setA({}); setStep(0); }} className="flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-bold"><RotateCcw size={15} />Retake</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {done && <div className="mt-10">{picks.length ? <ProductGrid products={picks} /> : <p className="rounded-[2rem] bg-white p-10 text-center text-muted">No exact match in that budget — try “Treat myself” or browse the shop.</p>}</div>}
    </div>
  );
}
