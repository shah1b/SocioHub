"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, LoaderCircle, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type OAuthProvider = "google" | "apple" | "facebook";

/* Minimal brand glyphs for the provider buttons. */
function GoogleIcon({ className = "size-4.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.1h6.5c-.1 1.1-.8 2.7-2.4 3.8l3.7 2.9c2.3-2.1 3.7-5.1 3.7-8.6Z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.7-2.9c-1 .7-2.4 1.2-4.2 1.2-3.2 0-6-2.1-6.9-5.1L1.2 17.2C3.2 21.2 7.3 24 12 24Z" />
      <path fill="#FBBC05" d="M5.1 14.3a7.6 7.6 0 0 1 0-4.6L1.2 6.8a12 12 0 0 0 0 10.4l3.9-2.9Z" />
      <path fill="#EA4335" d="M12 4.7c1.8 0 3 .8 3.7 1.4l3.3-3.2C17.9 1.1 15.2 0 12 0 7.3 0 3.2 2.8 1.2 6.8l3.9 2.9C6 6.7 8.8 4.7 12 4.7Z" />
    </svg>
  );
}

function AppleIcon({ className = "size-4.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M16.7 12.9c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-2-.9-3.2-.9-1.7 0-3.2 1-4 2.5-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.4 0 1.9.8 3.2.8 1.3 0 2.1-1.2 2.9-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.4-1-2.4-3.9ZM14.4 5.6c.7-.8 1.1-1.9 1-3.1-1 .1-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.6 2.9-1.4Z" />
    </svg>
  );
}

function FacebookIcon({ className = "size-4.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="#1877F2" className={className} aria-hidden>
      <path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4h-3V12h3V9.4c0-3 1.8-4.7 4.6-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12Z" />
    </svg>
  );
}

const PROVIDERS: { id: OAuthProvider; label: string; icon: typeof GoogleIcon }[] = [
  { id: "google", label: "Continue with Google", icon: GoogleIcon },
  { id: "apple", label: "Continue with Apple", icon: AppleIcon },
  { id: "facebook", label: "Continue with Facebook", icon: FacebookIcon },
];

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const params = useSearchParams();
  const [method, setMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(
    params.get("error") === "auth" ? "Sign-in didn't complete — try again." : null,
  );
  const [pending, setPending] = useState(false);

  const isLogin = mode === "login";

  const demoContinue = () => {
    router.push(isLogin ? "/" : "/onboarding");
  };

  const oauth = async (provider: OAuthProvider) => {
    setError(null);
    if (!isSupabaseConfigured) return demoContinue();
    setPending(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
    setPending(false);
    if (authError) {
      setError(
        authError.message.includes("not enabled")
          ? `${provider[0].toUpperCase() + provider.slice(1)} sign-in isn't enabled yet — use email for now.`
          : authError.message,
      );
    }
    // On success the browser redirects to the provider.
  };

  const submitEmail = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!isSupabaseConfigured) return demoContinue();

    setPending(true);
    const supabase = createClient();
    const { error: authError } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    setPending(false);

    if (authError) return setError(authError.message);
    router.push(isLogin ? "/" : "/onboarding");
    router.refresh();
  };

  const submitPhone = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!isSupabaseConfigured) return demoContinue();

    setPending(true);
    const supabase = createClient();

    if (!otpSent) {
      const { error: authError } = await supabase.auth.signInWithOtp({ phone });
      setPending(false);
      if (authError) {
        return setError(
          authError.message.toLowerCase().includes("provider") ||
            authError.message.toLowerCase().includes("not enabled")
            ? "Phone sign-in isn't enabled yet — use email for now."
            : authError.message,
        );
      }
      setOtpSent(true);
      return;
    }

    const { error: authError } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: "sms",
    });
    setPending(false);
    if (authError) return setError(authError.message);
    router.push(isLogin ? "/" : "/onboarding");
    router.refresh();
  };

  const inputClass =
    "w-full rounded-full bg-card px-5 py-4 text-sm font-medium text-card-foreground shadow-lg shadow-black/30 outline-none placeholder:text-card-muted";

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
      <h1 className="relative mt-7 text-4xl font-extrabold leading-tight tracking-tight">
        {isLogin ? "Welcome back." : "Your feed. Your rules."}
      </h1>
      <p className="relative mt-2 text-[15px] text-muted">
        {isLogin
          ? "Pick up right where you left off."
          : "One clean feed with only the creators and topics you choose."}
      </p>

      {/* Social sign-in. */}
      <div className="relative mt-8 space-y-2.5">
        {PROVIDERS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => oauth(id)}
            disabled={pending}
            className="flex w-full items-center justify-center gap-2.5 rounded-full bg-card py-3.5 text-sm font-bold text-card-foreground shadow-lg shadow-black/30 transition active:scale-[0.98] disabled:opacity-60"
          >
            <Icon />
            {label}
          </button>
        ))}
      </div>

      <div className="relative my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-glass-border" />
        <span className="text-xs font-bold uppercase tracking-wider text-faint">
          or
        </span>
        <span className="h-px flex-1 bg-glass-border" />
      </div>

      {/* Email / phone switcher. */}
      <div className="glass relative mb-4 flex gap-1 rounded-full p-1">
        {(["email", "phone"] as const).map((value) => (
          <button
            key={value}
            onClick={() => {
              setMethod(value);
              setError(null);
              setOtpSent(false);
            }}
            aria-pressed={method === value}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-bold capitalize transition ${
              method === value
                ? "bg-card text-card-foreground shadow-md shadow-black/20"
                : "text-muted"
            }`}
          >
            {value === "phone" && <Phone className="size-3.5" />}
            {value}
          </button>
        ))}
      </div>

      {method === "email" ? (
        <form onSubmit={submitEmail} className="relative space-y-3">
          <input
            type="email"
            required={isSupabaseConfigured}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            className={inputClass}
          />
          <input
            type="password"
            required={isSupabaseConfigured}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            className={inputClass}
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
      ) : (
        <form onSubmit={submitPhone} className="relative space-y-3">
          <input
            type="tel"
            required={isSupabaseConfigured}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number, e.g. +15551234567"
            autoComplete="tel"
            disabled={otpSent}
            className={`${inputClass} disabled:opacity-60`}
          />
          {otpSent && (
            <input
              type="text"
              inputMode="numeric"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit code"
              autoComplete="one-time-code"
              className={`${inputClass} tracking-[0.3em]`}
            />
          )}
          {error && <p className="px-2 text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="bg-brand flex w-full items-center justify-center gap-2 rounded-full py-4 text-[15px] font-bold text-white shadow-lg shadow-accent/40 transition active:scale-[0.98] disabled:opacity-60"
          >
            {pending ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : otpSent ? (
              <>Verify code</>
            ) : (
              <>
                Send code <ArrowRight className="size-4" />
              </>
            )}
          </button>
          {otpSent && (
            <button
              type="button"
              onClick={() => {
                setOtpSent(false);
                setOtp("");
              }}
              className="w-full text-center text-xs font-semibold text-faint"
            >
              Use a different number
            </button>
          )}
        </form>
      )}

      {!isSupabaseConfigured && (
        <p className="relative mt-3 text-center text-xs text-faint">
          Demo mode — Supabase isn&apos;t configured, so this continues without
          an account.
        </p>
      )}

      <p className="relative mt-8 text-center text-sm text-muted">
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
