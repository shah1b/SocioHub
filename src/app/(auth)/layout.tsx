export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="hero-glow pointer-events-none absolute inset-x-0 -top-16 h-96" />
      <main className="relative mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-10">
        {children}
      </main>
    </div>
  );
}
