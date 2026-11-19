import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, getUser, isAdmin } from "@/lib/supabase/server";
import { inr } from "@/lib/format";
import { signOut } from "@/app/actions";

export const metadata = { title: "My account", robots: { index: false } };
const STEPS = ["placed", "packed", "shipped", "delivered"];

export default async function Account() {
  const user = await getUser();
  if (!user) redirect("/login?next=/account");
  const sb = await createClient();
  const { data: orders } = await sb.from("orders").select("id,order_no,total,status,created_at,order_items(name,image,qty)").order("created_at", { ascending: false });
  return (
    <div className="mx-auto max-w-5xl px-5 pt-10 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold tracking-[0.3em] text-rose uppercase">My account</p>
          <h1 className="display mt-2 text-5xl">Hey, <em className="text-rose">{(user.user_metadata?.name as string) || user.email!.split("@")[0]}</em></h1>
          <p className="mt-1 text-sm text-muted">{user.email}</p>
        </div>
        <div className="flex gap-2">
          {isAdmin(user.email) && <Link href="/admin" className="rounded-full bg-lime px-5 py-3 text-sm font-bold">Admin</Link>}
          <form action={signOut}><button className="rounded-full border border-ink/15 px-5 py-3 text-sm font-bold hover:bg-ink hover:text-white">Sign out</button></form>
        </div>
      </div>
      <h2 className="display mt-12 text-3xl">Your orders</h2>
      <div className="mt-6 space-y-4">
        {orders?.map((o) => {
          const step = STEPS.indexOf(o.status);
          return (
            <Link key={o.id} href={`/order/${o.id}`} className="block rounded-[2rem] bg-white p-6 transition hover:shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><p className="font-extrabold">Order #{o.order_no}</p><p className="text-xs text-muted">{new Date(o.created_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}</p></div>
                <p className="font-extrabold">{inr(o.total)}</p>
              </div>
              <div className="mt-4 flex -space-x-3">
                {o.order_items.slice(0, 5).map((i) => <span key={i.name} className="relative size-12 overflow-hidden rounded-full border-2 border-white bg-sand">{i.image && <Image src={i.image} alt={i.name} fill sizes="48px" className="object-cover" />}</span>)}
              </div>
              {o.status === "cancelled" ? <p className="mt-4 text-sm font-bold text-rose">Cancelled</p> : (
                <div className="mt-5 grid grid-cols-4 gap-2">
                  {STEPS.map((s, k) => (
                    <div key={s}><div className={`h-1.5 rounded-full ${k <= step ? "bg-rose" : "bg-ink/10"}`} /><p className={`mt-1.5 text-[0.7rem] font-bold capitalize ${k <= step ? "text-ink" : "text-muted"}`}>{s}</p></div>
                  ))}
                </div>
              )}
            </Link>
          );
        })}
        {!orders?.length && <div className="rounded-[2rem] bg-white p-10 text-center"><p className="text-muted">No orders yet.</p><Link href="/shop" className="mt-4 inline-block rounded-full bg-ink px-6 py-3 text-sm font-bold text-white">Start shopping</Link></div>}
      </div>
    </div>
  );
}
