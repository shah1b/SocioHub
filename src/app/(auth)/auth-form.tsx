"use client";

import { useState } from "react";
import Image from "next/image";
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
      <div className="relative flex items-center gap-3">
        <Image
          src="/icon.webp"
          alt="Flow logo"
          width={48}
          height={48}
          className="rounded-2xl shadow-lg shadow-accent/30"
          priority
        />
        <p className="text-2xl font-extrabold tracking-tight">Flow</p>
      </div>
      <h1 className="relative mt-8 text-4xl font-extrabold leading-tight tracking-tight">
        {isLogin ? "Welcome back." : "Your feed. Your rules."}
      </h1>
      <p className="relative mt-2 text-[15px] text-muted">
        {isLogin
          ? "Pick up right where you left off."
          : "One clean feed with only the creators and topics you choose."}
      </p>

      <form onSubmit={submit} className="relative mt-10 space-y-3">
        <input
          type="email"
          required={isSupabaseConfigured}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          autoComplete="email"
          className="w-full rounded-full bg-card px-5 py-4 text-sm font-medium text-card-foreground shadow-lg shadow-black/30 outline-none placeholder:text-card-muted"
        />
        <input
          type="password"
          required={isSupabaseConfigured}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          autoComplete={isLogin ? "current-password" : "new-password"}
          className="w-full rounded-full bg-card px-5 py-4 text-sm font-medium text-card-foreground shadow-lg shadow-black/30 outline-none placeholder:text-card-muted"
        />

        {error && <p className="px-2 text-xs text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="bg-brand flex w-full items-center justify-center gap-2 rounded-full py-4 text-[15px] font-bold text-white shadow-lg shadow-accent/40 transition active:scale-[0.98] disabled:opacity-60"
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
        <p className="relative mt-3 text-center text-xs text-faint">
          Demo mode — Supabase isn&apos;t configured, so this continues without
          an account.
        </p>
      )}

      <p className="relative mt-10 text-center text-sm text-muted">
        {isLogin ? "New to Flow?" : "Already have an account?"}{" "}
        <Link
          href={isLogin ? "/signup" : "/login"}
          className="font-bold text-accent"
        >
          {isLogin ? "Create account" : "Sign in"}
        </Link>
      </p>
      <p className="relative mt-2 text-center">
        <Link href="/" className="text-xs text-faint underline-offset-2">
          Skip for now → explore the demo feed
        </Link>
      </p>
    </div>
  );
}
