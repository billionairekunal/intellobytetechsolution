"use client";
import { useActionState } from "react";
import { ArrowRight } from "lucide-react";
import { subscribe } from "@/app/actions";

export function Newsletter() {
  const [state, action, pending] = useActionState(subscribe, null);
  return (
    <form action={action} className="mt-8 max-w-sm">
      <label htmlFor="nl" className="text-sm text-white/60">Secret drops & members-only offers</label>
      <div className="mt-2 flex rounded-full bg-white/10 p-1.5 focus-within:ring-2 focus-within:ring-lime">
        <input id="nl" name="email" type="email" required placeholder="you@email.com" className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-white/40" />
        <button disabled={pending} aria-label="Subscribe" className="grid size-10 place-items-center rounded-full bg-lime text-ink transition hover:scale-105 disabled:opacity-50"><ArrowRight size={18} /></button>
      </div>
      {state && <p className={`mt-2 text-xs ${state.ok ? "text-lime" : "text-rose"}`} role="status">{state.msg}</p>}
    </form>
  );
}
