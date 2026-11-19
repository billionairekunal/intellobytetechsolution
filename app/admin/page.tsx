import Link from "next/link";
import { adminClient } from "@/lib/supabase/server";
import { inr } from "@/lib/format";
import { updateOrderStatus } from "@/app/actions";

const STATUS = ["placed", "packed", "shipped", "delivered", "cancelled"];

export default async function AdminOrders() {
  const sb = adminClient();
  const { data: orders } = await sb.from("orders").select("id,order_no,name,phone,email,total,status,payment_method,created_at,address,order_items(qty)").order("created_at", { ascending: false }).limit(200);
  const list = orders ?? [];
  const revenue = list.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const pending = list.filter((o) => o.status === "placed" || o.status === "packed").length;
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        {[["Orders", list.length], ["To fulfil", pending], ["Revenue (excl. cancelled)", inr(revenue)]].map(([l, v]) => (
          <div key={l as string} className="rounded-[1.75rem] bg-white p-6"><p className="text-sm text-muted">{l}</p><p className="display mt-1 text-4xl">{v}</p></div>
        ))}
      </div>
      <div className="mt-6 overflow-x-auto rounded-[1.75rem] bg-white">
        <table className="w-full min-w-[52rem] text-sm">
          <thead className="text-left text-xs text-muted uppercase"><tr>{["Order", "Customer", "Ship to", "Items", "Total", "Status"].map((h) => <th key={h} className="px-5 py-4 font-bold">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-ink/5">
            {list.map((o) => {
              const a = o.address as { city: string; pin: string };
              return (
                <tr key={o.id}>
                  <td className="px-5 py-4"><Link href={`/order/${o.id}`} className="font-bold hover:text-rose">#{o.order_no}</Link><p className="text-xs text-muted">{new Date(o.created_at).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}</p></td>
                  <td className="px-5 py-4"><p className="font-semibold">{o.name}</p><p className="text-xs text-muted">{o.phone} · {o.email}</p></td>
                  <td className="px-5 py-4">{a.city} {a.pin}</td>
                  <td className="px-5 py-4">{o.order_items.reduce((s, i) => s + i.qty, 0)}</td>
                  <td className="px-5 py-4 font-bold">{inr(o.total)} <span className="text-xs font-normal text-muted uppercase">{o.payment_method}</span></td>
                  <td className="px-5 py-4">
                    <form action={updateOrderStatus} className="flex gap-2">
                      <input type="hidden" name="id" value={o.id} />
                      <select name="status" defaultValue={o.status} className="rounded-full border border-ink/10 px-3 py-2 font-semibold capitalize">{STATUS.map((s) => <option key={s}>{s}</option>)}</select>
                      <button className="rounded-full bg-ink px-4 text-xs font-bold text-white">Save</button>
                    </form>
                  </td>
                </tr>
              );
            })}
            {!list.length && <tr><td colSpan={6} className="px-5 py-10 text-center text-muted">No orders yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
