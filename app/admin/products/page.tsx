import Image from "next/image";
import { adminClient } from "@/lib/supabase/server";
import { updateProduct } from "@/app/actions";

export default async function AdminProducts() {
  const { data } = await adminClient().from("products").select("id,name,brand,price,stock,active,images").order("name");
  return (
    <div className="overflow-x-auto rounded-[1.75rem] bg-white">
      <table className="w-full min-w-[44rem] text-sm">
        <thead className="text-left text-xs text-muted uppercase"><tr>{["Product", "Price (₹)", "Stock", "Live", ""].map((h) => <th key={h} className="px-5 py-4 font-bold">{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-ink/5">
          {data?.map((p) => (
            <tr key={p.id}>
              <td colSpan={5} className="p-0">
                <form action={updateProduct} className="grid grid-cols-[1fr_8rem_6rem_4rem_5rem] items-center">
                  <input type="hidden" name="id" value={p.id} />
                  <span className="flex items-center gap-3 px-5 py-3">
                    <span className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-sand"><Image src={p.images[0]} alt="" fill sizes="40px" className="object-cover" /></span>
                    <span><span className="block font-bold">{p.name}</span><span className="text-xs text-muted">{p.brand}</span></span>
                  </span>
                  <input name="price" type="number" min={0} defaultValue={p.price} aria-label="Price" className="mx-2 rounded-xl border border-ink/10 px-3 py-2" />
                  <input name="stock" type="number" min={0} defaultValue={p.stock} aria-label="Stock" className={`mx-2 rounded-xl border px-3 py-2 ${p.stock < 10 ? "border-rose text-rose" : "border-ink/10"}`} />
                  <input name="active" type="checkbox" defaultChecked={p.active} aria-label="Live" className="mx-auto size-5 accent-rose" />
                  <button className="mr-4 rounded-full bg-ink py-2 text-xs font-bold text-white">Save</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
