import Link from "next/link";
import { Lock, Package, ShieldCheck, Truck } from "lucide-react";
import { Logo } from "./ui";
import { Newsletter } from "./newsletter";

const cols = [
  { h: "Shop", l: [["All toys", "/shop"], ["For Her", "/shop?t=her"], ["For Him", "/shop?t=him"], ["Couples", "/shop?t=couples"], ["Smart Toys", "/shop?c=smart"], ["Sale", "/shop?t=sale"]] },
  { h: "Help", l: [["Track order", "/account"], ["Shipping", "/help#shipping"], ["Returns", "/help#returns"], ["Privacy", "/help#privacy"], ["FAQs", "/help"]] },
  { h: "Explore", l: [["Find your match quiz", "/quiz"], ["Luxe collection", "/shop?t=luxe"], ["New arrivals", "/shop?t=new"], ["Beginner friendly", "/shop?t=beginner"]] },
];

export function Footer() {
  return (
    <footer className="grain relative mt-24 overflow-hidden rounded-t-[2.5rem] bg-ink pb-28 text-white sm:pb-10">
      <div className="pointer-events-none absolute -top-40 left-1/3 size-[30rem] rounded-full bg-rose/25 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-5 pt-16 sm:px-8">
        <div className="grid grid-cols-2 gap-4 border-b border-white/10 pb-12 md:grid-cols-4">
          {[[Package, "Plain packaging", "No logos, no names"], [Truck, "Fast delivery", "2–5 days pan-India"], [Lock, "Private billing", "Neutral bank statement"], [ShieldCheck, "100% authentic", "Body-safe materials"]].map(([Icon, t, s]) => {
            const I = Icon as typeof Package;
            return (
              <div key={t as string} className="flex items-center gap-3 rounded-2xl bg-white/5 p-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-lime/15 text-lime"><I size={18} /></span>
                <div><p className="text-sm font-bold">{t as string}</p><p className="text-xs text-white/50">{s as string}</p></div>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-1 gap-12 py-14 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Logo light />
            <p className="display mt-6 max-w-sm text-3xl leading-tight">Pleasure, <em className="text-lime">intelligently</em> designed.</p>
            <Newsletter />
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {cols.map((c) => (
              <div key={c.h}>
                <p className="mb-4 text-xs font-extrabold tracking-[0.2em] text-lilac uppercase">{c.h}</p>
                <ul className="space-y-2.5">
                  {c.l.map(([t, h]) => <li key={h}><Link href={h} className="text-sm text-white/70 transition hover:text-white">{t}</Link></li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <p className="display pointer-events-none -mb-4 text-center text-[17vw] leading-none font-semibold text-white/[0.04] select-none lg:text-[13rem]">intellobyte</p>
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row">
          <p>© {new Date().getFullYear()} Intellobyte Toys. For adults 18+ only.</p>
          <p>Cash on delivery · UPI · Cards</p>
        </div>
      </div>
    </footer>
  );
}
