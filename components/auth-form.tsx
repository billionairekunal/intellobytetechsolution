"use client";
import { useActionState, useState } from "react";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import { signIn, signUp } from "@/app/actions";

export function AuthForm({ next }: { next: string }) {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [inState, inAction, inPending] = useActionState(signIn, null);
  const [upState, upAction, upPending] = useActionState(signUp, null);
  const state = mode === "in" ? inState : upState;
  const pending = inPending || upPending;
  const input = "w-full rounded-2xl border border-ink/10 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-rose focus:ring-4 focus:ring-rose/10";
  return (
    <div className="flex flex-col justify-center py-6">
      <h1 className="display text-5xl">{mode === "in" ? <>Welcome <em className="text-rose">back</em></> : <>Join the <em className="text-rose">club</em></>}</h1>
      <p className="mt-2 text-muted">Track orders, save favourites and write reviews.</p>
      <div className="mt-8 flex w-fit rounded-full bg-white p-1.5">
        {(["in", "up"] as const).map((m) => (
          <button key={m} type="button" onClick={() => setMode(m)} className="relative rounded-full px-6 py-2.5 text-sm font-bold">
            {mode === m && <motion.span layoutId="auth-tab" className="absolute inset-0 rounded-full bg-ink" />}
            <span className={`relative ${mode === m ? "text-white" : "text-ink/60"}`}>{m === "in" ? "Sign in" : "Create account"}</span>
          </button>
        ))}
      </div>
      <form action={mode === "in" ? inAction : upAction} className="mt-6 max-w-md space-y-4">
        <input type="hidden" name="next" value={next} />
        {mode === "up" && <input name="name" placeholder="First name" required autoComplete="given-name" className={input} aria-label="First name" />}
        <input name="email" type="email" placeholder="Email" required autoComplete="email" className={input} aria-label="Email" />
        <input name="password" type="password" placeholder="Password" required minLength={mode === "up" ? 8 : 1} autoComplete={mode === "in" ? "current-password" : "new-password"} className={input} aria-label="Password" />
        {state && <p className={`rounded-2xl px-4 py-3 text-sm font-semibold ${state.ok ? "bg-lime/40 text-ink" : "bg-rose/10 text-rose-deep"}`} role="alert">{state.msg}</p>}
        <button disabled={pending} className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 font-bold text-white transition hover:bg-plum-2 disabled:opacity-60">
          {pending && <Loader2 size={16} className="animate-spin" />}{mode === "in" ? "Sign in" : "Create account"}
        </button>
        <p className="text-xs text-muted">We never share your details. Your account name never appears on packaging.</p>
      </form>
    </div>
  );
}
