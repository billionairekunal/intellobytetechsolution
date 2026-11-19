import { createServerClient } from "@supabase/ssr";
import { createClient as createJsClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
if (!url || !key) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY — add them in Vercel → Settings → Environment Variables (see .env.example).");

/** Request-scoped client that acts as the signed-in user (RLS applies). */
export async function createClient() {
  const store = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // called from a Server Component; proxy.ts refreshes the session instead
        }
      },
    },
  });
}

/** Anonymous client for public catalog reads (cacheable, no cookies). */
export const publicClient = () => createJsClient(url, key, { auth: { persistSession: false } });

/** Service-role client. Server only — bypasses RLS. */
export const adminClient = () =>
  createJsClient(url, process.env.SUPABASE_SECRET_KEY!, { auth: { persistSession: false } });

export async function getUser() {
  const sb = await createClient();
  const { data } = await sb.auth.getUser();
  return data.user;
}

/** Gate for admin pages. Layout and page render in parallel, so every admin page calls this itself. */
export async function requireAdminPage() {
  const user = await getUser();
  if (!isAdmin(user?.email)) notFound();
}

export function isAdmin(email?: string | null) {
  const list = (process.env.ADMIN_EMAILS ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  return !!email && list.includes(email.toLowerCase());
}
