"use client";

import { useState } from "react";
import { Ban, RotateCcw, Search } from "lucide-react";
import { adminUsers, type AdminUser } from "@/lib/admin-mock-data";

const planChip = (plan: AdminUser["plan"]) =>
  plan === "premium"
    ? "bg-[var(--viz-accent-wash)] text-[var(--viz-accent)]"
    : "bg-white/5 text-[var(--viz-ink-2)]";

export default function AdminUsersPage() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState(adminUsers);

  const shown = users.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase()),
  );

  const toggleStatus = (id: string) =>
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "active" ? "suspended" : "active" }
          : u,
      ),
    );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="mt-0.5 text-sm text-[var(--viz-muted)]">
            {users.length.toLocaleString("en-US")} accounts · demo data
          </p>
        </div>
        <label className="flex w-72 items-center gap-2 rounded-xl border border-[var(--viz-border)] bg-[var(--viz-surface)] px-3.5 py-2.5">
          <Search className="size-4 text-[var(--viz-muted)]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or email…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--viz-muted)]"
          />
        </label>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--viz-border)] bg-[var(--viz-surface)]">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--viz-border)] text-xs text-[var(--viz-muted)]">
              <th className="px-5 py-3.5 font-semibold">User</th>
              <th className="px-4 py-3.5 font-semibold">Plan</th>
              <th className="px-4 py-3.5 font-semibold">Status</th>
              <th className="px-4 py-3.5 text-right font-semibold">Creators</th>
              <th className="px-4 py-3.5 font-semibold">Joined</th>
              <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--viz-border)]">
            {shown.map((u) => (
              <tr key={u.id} className="hover:bg-white/[0.03]">
                <td className="px-5 py-3.5">
                  <p className="font-semibold">{u.name}</p>
                  <p className="text-xs text-[var(--viz-muted)]">{u.email}</p>
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${planChip(u.plan)}`}
                  >
                    {u.plan}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className="text-xs font-semibold"
                    style={{
                      color:
                        u.status === "active"
                          ? "var(--viz-good)"
                          : "var(--viz-critical)",
                    }}
                  >
                    {u.status === "active" ? "● Active" : "● Suspended"}
                  </span>
                </td>
                <td
                  className="px-4 py-3.5 text-right"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {u.creatorsFollowed}
                </td>
                <td className="px-4 py-3.5 text-[var(--viz-ink-2)]">
                  {u.joined}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    onClick={() => toggleStatus(u.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--viz-border)] px-3 py-1.5 text-xs font-semibold text-[var(--viz-ink-2)] transition hover:bg-white/5"
                  >
                    {u.status === "active" ? (
                      <>
                        <Ban className="size-3.5" /> Suspend
                      </>
                    ) : (
                      <>
                        <RotateCcw className="size-3.5" /> Reinstate
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
            {shown.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-sm text-[var(--viz-muted)]"
                >
                  No users match “{query}”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
