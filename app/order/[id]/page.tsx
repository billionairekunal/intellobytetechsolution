import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { adminClient } from "@/lib/supabase/server";
import { inr } from "@/lib/format";
import { ClearCart } from "@/components/clear-cart";
import { Package } from "lucide-react";

export const metadata = { title: "Order confirmed", robots: { index: false } };

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  // ponytail: the order uuid acts as the guest's access token (unguessable); add signed links if orders hold more PII.
  const { data: o } = await adminClient().from("orders").select("order_no,name,email,total,subtotal,discount,shipping,status,address,created_at,order_items(name,image,price,qty)").eq("id", id).maybeSingle();
  if (!o) notFound();
  const a = o.address as { line1: string; line2?: string; city: string; state: string; pin: string };
  return (
    <div className="mx-auto max-w-3xl px-5 pt-14 text-center sm:px-8">
      <ClearCart />
      <div className="mx-auto grid size-24 animate-float place-items-center rounded-full bg-lime text-4xl">💌</div>
      <p className="mt-8 text-xs font-extrabold tracking-[0.3em] text-rose uppercase">Order #{o.order_no}</p>
      <h1 className="display mt-3 text-5xl sm:text-6xl">Thank you, <em className="text-rose">{o.name.split(" ")[0]}</em>.</h1>
      <p className="mx-auto mt-4 max-w-md text-muted">Your order is confirmed and will ship within 24 hours in a plain, unmarked box. Updates go to {o.email}.</p>
      <div className="mt-10 rounded-[2rem] bg-white p-6 text-left sm:p-8">
        <ul className="space-y-3">
          {o.order_items.map((i) => (
            <li key={i.name} className="flex items-center gap-3">
              <span className="relative size-14 overflow-hidden rounded-xl bg-sand">{i.image && <Image src={i.image} alt="" fill sizes="56px" className="object-cover" />}</span>
              <span className="flex-1 text-sm font-bold">{i.name} × {i.qty}</span><span className="text-sm font-bold">{inr(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-5 space-y-1.5 border-t border-ink/10 pt-5 text-sm">
          {o.discount > 0 && <div className="flex justify-between text-green-700"><dt>Discount</dt><dd>−{inr(o.discount)}</dd></div>}
          <div className="flex justify-between"><dt className="text-muted">Shipping</dt><dd>{o.shipping ? inr(o.shipping) : "Free"}</dd></div>
          <div className="flex justify-between text-lg font-extrabold"><dt>Total (pay on delivery)</dt><dd>{inr(o.total)}</dd></div>
        </dl>
        <p className="mt-5 flex gap-2 rounded-2xl bg-porcelain p-4 text-sm text-ink/70"><Package size={18} className="shrink-0 text-rose" />{a.line1}{a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.state} – {a.pin}</p>
      </div>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/shop" className="rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-white">Keep exploring</Link>
        <Link href="/account" className="rounded-full border border-ink/15 px-6 py-3.5 text-sm font-bold">My orders</Link>
      </div>
    </div>
  );
}
