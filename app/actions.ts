"use server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { adminClient, createClient, getUser, isAdmin } from "@/lib/supabase/server";

type State = { ok: boolean; msg: string } | null;
const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribe(_: State, f: FormData): Promise<State> {
  const email = str(f, "email").toLowerCase();
  if (!EMAIL.test(email)) return { ok: false, msg: "Please enter a valid email." };
  const { error } = await adminClient().from("subscribers").upsert({ email });
  return error ? { ok: false, msg: "Something went wrong. Try again." } : { ok: true, msg: "You're in. Watch your inbox 💌" };
}

export async function placeOrder(_: State, f: FormData): Promise<State> {
  let items: { id: string; qty: number }[];
  try {
    items = (JSON.parse(str(f, "items")) as { id: string; qty: number }[]).map((i) => ({ id: String(i.id), qty: Number(i.qty) }));
  } catch {
    return { ok: false, msg: "Your cart could not be read." };
  }
  const d = {
    email: str(f, "email").toLowerCase(), name: str(f, "name"), phone: str(f, "phone").replace(/\D/g, ""),
    line1: str(f, "line1"), line2: str(f, "line2"), city: str(f, "city"), state: str(f, "state"), pin: str(f, "pin"),
  };
  if (!EMAIL.test(d.email)) return { ok: false, msg: "Please enter a valid email." };
  if (d.name.length < 2) return { ok: false, msg: "Please enter your name." };
  if (!/^[6-9]\d{9}$/.test(d.phone.slice(-10))) return { ok: false, msg: "Please enter a valid 10-digit mobile number." };
  if (!d.line1 || !d.city || !d.state) return { ok: false, msg: "Please complete your address." };
  if (!/^\d{6}$/.test(d.pin)) return { ok: false, msg: "Please enter a valid 6-digit PIN code." };

  const user = await getUser();
  const { data, error } = await adminClient().rpc("place_order", {
    p_user: user?.id ?? null, p_email: d.email, p_name: d.name, p_phone: d.phone.slice(-10),
    p_address: { line1: d.line1, line2: d.line2, city: d.city, state: d.state, pin: d.pin },
    p_items: items, p_coupon: str(f, "coupon") || null, p_payment: "cod",
  });
  if (error) return { ok: false, msg: error.message.replace(/^.*?:\s*/, "") || "Could not place order." };
  const row = (data as { order_id: string }[])[0];
  redirect(`/order/${row.order_id}`);
}

export async function checkCoupon(code: string, subtotal: number) {
  const { data } = await adminClient().from("coupons").select("percent,min_total").eq("code", code.trim().toUpperCase()).eq("active", true).maybeSingle();
  if (!data) return { ok: false as const, msg: "That code isn't valid." };
  if (subtotal < data.min_total) return { ok: false as const, msg: `Valid on orders over ₹${data.min_total.toLocaleString("en-IN")}.` };
  return { ok: true as const, percent: data.percent as number, msg: `${data.percent}% off applied` };
}

export async function signIn(_: State, f: FormData): Promise<State> {
  const sb = await createClient();
  const { error } = await sb.auth.signInWithPassword({ email: str(f, "email"), password: str(f, "password") });
  if (error) return { ok: false, msg: error.message };
  redirect(str(f, "next") || "/account");
}

export async function signUp(_: State, f: FormData): Promise<State> {
  const sb = await createClient();
  const password = str(f, "password");
  if (password.length < 8) return { ok: false, msg: "Password must be at least 8 characters." };
  const { data, error } = await sb.auth.signUp({
    email: str(f, "email"), password,
    options: { data: { name: str(f, "name") }, emailRedirectTo: `${(await headers()).get("origin") ?? ""}/auth/callback` },
  });
  if (error) return { ok: false, msg: error.message };
  if (data.session) redirect("/account");
  return { ok: true, msg: "Check your inbox to confirm your email, then sign in." };
}

export async function signOut() {
  const sb = await createClient();
  await sb.auth.signOut();
  redirect("/");
}

export async function addReview(_: State, f: FormData): Promise<State> {
  const user = await getUser();
  if (!user) return { ok: false, msg: "Please sign in to write a review." };
  const rating = Number(f.get("rating"));
  if (!(rating >= 1 && rating <= 5)) return { ok: false, msg: "Pick a star rating." };
  const sb = await createClient();
  const { error } = await sb.from("reviews").insert({
    product_id: str(f, "product_id"), user_id: user.id, rating,
    author: (user.user_metadata?.name as string) || user.email!.split("@")[0],
    title: str(f, "title").slice(0, 80) || null, body: str(f, "body").slice(0, 1000) || null,
  });
  if (error) return { ok: false, msg: "Could not save your review." };
  revalidatePath(`/product/${str(f, "slug")}`);
  return { ok: true, msg: "Thanks! Your review is live." };
}

async function requireAdmin() {
  const user = await getUser();
  if (!isAdmin(user?.email)) throw new Error("Forbidden");
}

export async function updateOrderStatus(f: FormData) {
  await requireAdmin();
  const status = str(f, "status");
  if (!["placed", "packed", "shipped", "delivered", "cancelled"].includes(status)) return;
  await adminClient().from("orders").update({ status }).eq("id", str(f, "id"));
  revalidatePath("/admin");
}

export async function updateProduct(f: FormData) {
  await requireAdmin();
  const price = Number(f.get("price")), stock = Number(f.get("stock"));
  if (!Number.isInteger(price) || price < 0 || !Number.isInteger(stock) || stock < 0) return;
  await adminClient().from("products").update({ price, stock, active: f.get("active") === "on" }).eq("id", str(f, "id"));
  revalidatePath("/admin/products");
  revalidatePath("/", "layout");
}
