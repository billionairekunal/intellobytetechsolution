import type { Metadata } from "next";
import { getUser } from "@/lib/supabase/server";
import { CheckoutForm } from "@/components/checkout-form";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function Checkout() {
  const user = await getUser();
  return (
    <div className="mx-auto max-w-6xl px-5 pt-10 sm:px-8">
      <h1 className="display text-5xl sm:text-6xl">Almost <em className="text-rose">yours</em>.</h1>
      <p className="mt-2 text-muted">Discreet packaging, neutral billing, cash on delivery.</p>
      <CheckoutForm email={user?.email ?? ""} name={(user?.user_metadata?.name as string) ?? ""} />
    </div>
  );
}
