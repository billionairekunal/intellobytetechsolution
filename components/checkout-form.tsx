"use client";
import Image from "next/image";
import Link from "next/link";
import { useActionState, useState, useTransition } from "react";
import { motion } from "motion/react";
import { Banknote, Loader2, Lock, Package, Tag } from "lucide-react";
import { useStore } from "./store";
import { FREE_SHIP, SHIP_FEE, inr } from "@/lib/format";
import { checkCoupon, placeOrder } from "@/app/actions";

const STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jammu & Kashmir","Jharkhand","Karnataka","Kerala","Ladakh","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Puducherry","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Chandigarh","Andaman & Nicobar","Dadra & Nagar Haveli and Daman & Diu","Lakshadweep"];

function Field({ label, className, ...p }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-1.5 block text-xs font-bold text-ink/60">{label}</span>
      <input {...p} className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-rose focus:ring-4 focus:ring-rose/10" />
    </label>
  );
}

export function CheckoutForm({ email, name }: { email: string; name: string }) {
  const { cart, ready } = useStore();
  const [state, action, pending] = useActionState(placeOrder, null);
  const [code, setCode] = useState("");
  const [coupon, setCoupon] = useState<{ code: string; percent: number; msg: string } | null>(null);
  const [cmsg, setCmsg] = useState("");
  const [checking, start] = useTransition();
  const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const disc = coupon ? Math.floor((sub * coupon.percent) / 100) : 0;
  const ship = sub - disc >= FREE_SHIP ? 0 : SHIP_FEE;

  if (ready && !cart.length) return (
    <div className="mt-10 rounded-[2rem] bg-white py-20 text-center">
      <p className="display text-3xl">Your bag is empty</p>
      <Link href="/shop" className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-sm font-bold text-white">Go shopping</Link>
    </div>
  );

  return (
    <form action={action} className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
      <input type="hidden" name="items" value={JSON.stringify(cart.map(({ id, qty }) => ({ id, qty })))} />
      <input type="hidden" name="coupon" value={coupon?.code ?? ""} />
      <div className="space-y-6">
        <section className="rounded-[2rem] bg-white/60 p-6 sm:p-8">
          <h2 className="display mb-5 text-2xl">1 · Contact</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" name="name" required autoComplete="name" defaultValue={name} />
            <Field label="Mobile number" name="phone" required type="tel" inputMode="numeric" autoComplete="tel" placeholder="10-digit mobile" pattern="[0-9+ ]{10,14}" />
            <Field label="Email (for order updates)" name="email" type="email" required autoComplete="email" defaultValue={email} className="sm:col-span-2" />
          </div>
        </section>
        <section className="rounded-[2rem] bg-white/60 p-6 sm:p-8">
          <h2 className="display mb-5 text-2xl">2 · Delivery address</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Flat, house no., building" name="line1" required autoComplete="address-line1" className="sm:col-span-2" />
            <Field label="Area, street, landmark (optional)" name="line2" autoComplete="address-line2" className="sm:col-span-2" />
            <Field label="City" name="city" required autoComplete="address-level2" />
            <Field label="PIN code" name="pin" required inputMode="numeric" pattern="\d{6}" maxLength={6} autoComplete="postal-code" />
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-bold text-ink/60">State</span>
              <select name="state" required defaultValue="" className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3.5 text-sm outline-none focus:border-rose">
                <option value="" disabled>Select state</option>{STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
          </div>
        </section>
        <section className="rounded-[2rem] bg-white/60 p-6 sm:p-8">
          <h2 className="display mb-5 text-2xl">3 · Payment</h2>
          <label className="flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-rose bg-white p-4">
            <input type="radio" name="pay" defaultChecked className="accent-rose" />
            <Banknote className="text-rose" />
            <span><span className="block font-bold">Cash / UPI on delivery</span><span className="text-xs text-muted">Pay the courier when your parcel arrives</span></span>
          </label>
          <p className="mt-3 text-xs text-muted">Online card & UPI payments are coming soon.</p>
        </section>
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-[2rem] bg-white p-6 sm:p-8">
          <p className="display text-2xl">Order summary</p>
          <ul className="mt-5 max-h-72 space-y-3 overflow-y-auto" data-lenis-prevent>
            {cart.map((i) => (
              <li key={i.id} className="flex items-center gap-3">
                <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-sand">
                  <Image src={i.image} alt="" fill sizes="56px" className="object-cover" />
                  <span className="absolute top-0.5 right-0.5 grid size-5 place-items-center rounded-full bg-ink text-[0.6rem] font-bold text-white">{i.qty}</span>
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-bold">{i.name}</span>
                <span className="text-sm font-bold">{inr(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-full border border-ink/10 px-4"><Tag size={15} className="text-muted" />
              <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code" aria-label="Coupon code" className="w-full bg-transparent py-3 text-sm uppercase outline-none" />
            </div>
            <button type="button" disabled={!code || checking} onClick={() => start(async () => {
              const r = await checkCoupon(code, sub);
              setCmsg(r.msg); setCoupon(r.ok ? { code: code.toUpperCase(), percent: r.percent, msg: r.msg } : null);
            })} className="rounded-full bg-ink px-5 text-sm font-bold text-white disabled:opacity-40">{checking ? <Loader2 size={16} className="animate-spin" /> : "Apply"}</button>
          </div>
          {cmsg && <p className={`mt-2 text-xs font-semibold ${coupon ? "text-green-700" : "text-rose"}`}>{cmsg}</p>}
          <dl className="mt-5 space-y-2 border-t border-ink/10 pt-5 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="font-bold">{inr(sub)}</dd></div>
            {disc > 0 && <div className="flex justify-between text-green-700"><dt>Discount ({coupon!.code})</dt><dd className="font-bold">−{inr(disc)}</dd></div>}
            <div className="flex justify-between"><dt className="text-muted">Discreet shipping</dt><dd className="font-bold">{ship ? inr(ship) : "Free"}</dd></div>
            <div className="flex justify-between border-t border-ink/10 pt-3 text-lg"><dt className="font-extrabold">Total</dt><dd className="font-extrabold">{inr(sub - disc + ship)}</dd></div>
          </dl>
          {state && !state.ok && <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-2xl bg-rose/10 px-4 py-3 text-sm font-semibold text-rose-deep" role="alert">{state.msg}</motion.p>}
          <button disabled={pending || !ready} className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-rose py-4 font-extrabold text-white shadow-[0_16px_34px_-14px_var(--color-rose)] transition hover:bg-rose-deep disabled:opacity-60">
            {pending ? <><Loader2 size={18} className="animate-spin" /> Placing order…</> : <><Lock size={16} /> Place order · {inr(sub - disc + ship)}</>}
          </button>
          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted"><Package size={14} /> Ships in a plain box with a neutral sender name</p>
        </div>
      </aside>
    </form>
  );
}
