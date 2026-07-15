"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const isLogin = mode === "login";

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!isSupabaseConfigured) {
      // Demo mode: no backend yet, drop straight into onboarding.
      router.push("/onboarding");
      return;
    }

    setPending(true);
    const supabase = createClient();
    const { error: authError } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    setPending(false);

    if (authError) {
      setError(authError.message);
      return;
    }
    router.push(isLogin ? "/" : "/onboarding");
    router.refresh();
  };

  return (
    <div className="animate-rise">
      <p className="text-brand text-3xl font-bold tracking-tight">Flow</p>
      <h1 className="mt-6 text-2xl font-semibold leading-tight">
        {isLogin ? "Welcome back." : "Your feed. Your rules."}
      </h1>
      <p className="mt-1.5 text-sm text-muted">
        {isLogin
          ? "Pick up right where you left off."
          : "One clean feed with only the creators and topics you choose."}
      </p>

      <form onSubmit={submit} className="mt-8 space-y-3">
        <input
          type="email"
          required={isSupabaseConfigured}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          autoComplete="email"
          className="glass w-full rounded-2xl px-4 py-3.5 text-sm outline-none transition placeholder:text-faint focus:border-accent/50"
        />
        <input
          type="password"
          required={isSupabaseConfigured}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          autoComplete={isLogin ? "current-password" : "new-password"}
          className="glass w-full rounded-2xl px-4 py-3.5 text-sm outline-none transition placeholder:text-faint focus:border-accent/50"
        />

        {error && <p className="px-1 text-xs text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-500 py-3.5 text-sm font-semibold text-white transition active:scale-[0.98] disabled:opacity-60"
        >
          {pending ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <>
              {isLogin ? "Sign in" : "Create account"}
              <ArrowRight className="size-4" />
            </>
          )}
        </button>
      </form>

      {!isSupabaseConfigured && (
        <p className="mt-3 text-center text-xs text-faint">
          Demo mode — Supabase isn&apos;t configured, so this continues without
          an account.
        </p>
      )}

      <p className="mt-8 text-center text-sm text-muted">
        {isLogin ? "New to Flow?" : "Already have an account?"}{" "}
        <Link
          href={isLogin ? "/signup" : "/login"}
          className="font-semibold text-accent"
        >
          {isLogin ? "Create account" : "Sign in"}
        </Link>
      </p>
      <p className="mt-2 text-center text-sm">
        <Link href="/" className="text-xs text-faint underline-offset-2">
          Skip for now → explore the demo feed
        </Link>
      </p>
    </div>
  );
}
