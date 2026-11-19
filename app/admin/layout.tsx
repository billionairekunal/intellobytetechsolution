import Link from "next/link";
import { requireAdminPage } from "@/lib/supabase/server";

export const metadata = { title: "Admin", robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPage();
  return (
    <div className="mx-auto max-w-7xl px-5 pt-10 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="display text-5xl">Admin</h1>
        <nav className="flex gap-2 rounded-full bg-white p-1.5">
          <Link href="/admin" className="rounded-full px-5 py-2 text-sm font-bold hover:bg-ink hover:text-white">Orders</Link>
          <Link href="/admin/products" className="rounded-full px-5 py-2 text-sm font-bold hover:bg-ink hover:text-white">Products</Link>
        </nav>
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
