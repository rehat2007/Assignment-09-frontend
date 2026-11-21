"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Ban, Eye, Lock, RotateCcw, Search, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";
import type { AdminRole, AdminUser } from "@/lib/admin-data";
import { formatDate } from "@/lib/customer-data";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const ROLE_LABEL: Record<AdminRole, string> = {
  customer: "Customer",
  technician: "Technician",
  admin: "Admin",
};

const AVATAR_TONES = [
  "bg-[#f6e7c8] text-[#a86a12]",
  "bg-[#e9efff] text-[#274ec4]",
  "bg-[#e2f4e9] text-[#147a4b]",
  "bg-[#fcecea] text-[#b42318]",
  "bg-[#f3e8ff] text-[#7e22ce]",
  "bg-[#e0f2fe] text-[#0369a1]",
];

export function AdminUsers({
  initialUsers,
  currentEmail,
}: {
  initialUsers: AdminUser[];
  currentEmail: string;
}) {
  const [users, setUsers] = useState(initialUsers);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<AdminRole | "all">("all");
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [error, setError] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return users.filter((user) => {
      const matchesRole =
        roleFilter === "all" || user.role === roleFilter;
      const matchesQuery =
        !needle ||
        [user.name, user.email, user.area].join(" ").toLowerCase().includes(needle);
      return matchesRole && matchesQuery;
    });
  }, [users, query, roleFilter]);

  async function changeRole(
    id: string,
    role: "customer" | "technician",
  ) {
    if (pendingId) return;

    setPendingId(id);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/v1/admin/users/${id}/role`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role }),
        },
      );
      const body = (await response.json().catch(() => null)) as
        | { data?: AdminUser; error?: { message?: string } }
        | null;

      if (!response.ok || !body?.data) {
        throw new Error(body?.error?.message ?? "Could not change this role.");
      }

      const updated = body.data;
      setUsers((current) =>
        current.map((user) => (user.id === id ? updated : user)),
      );
      setSelected((current) => (current?.id === id ? updated : current));
      toast.success(`${updated.name} is now ${ROLE_LABEL[updated.role]}.`);
    } catch (caught) {
      const message =
        caught instanceof Error
          ? caught.message
          : "Could not change this role.";
      setError(message);
      toast.error(message);
    } finally {
      setPendingId(null);
    }
  }

  async function toggleSuspend(user: AdminUser) {
    if (pendingId) return;

    const isSuspended = Boolean(user.banned);
    setPendingId(user.id);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/v1/admin/users/${user.id}/${
          isSuspended ? "restore" : "suspend"
        }`,
        {
          method: "POST",
          credentials: "include",
          ...(isSuspended
            ? {}
            : {
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason: "Suspended by admin" }),
              }),
        },
      );
      const body = (await response.json().catch(() => null)) as
        | { data?: AdminUser; error?: { message?: string } }
        | null;

      if (!response.ok || !body?.data) {
        throw new Error(
          body?.error?.message ?? "Could not update this account.",
        );
      }

      const updated = body.data;
      setUsers((current) =>
        current.map((item) => (item.id === user.id ? updated : item)),
      );
      setSelected((current) =>
        current?.id === user.id ? updated : current,
      );
      toast.success(
        isSuspended
          ? `${user.name} restored.`
          : `${user.name} suspended.`,
      );
    } catch (caught) {
      const message =
        caught instanceof Error
          ? caught.message
          : "Could not update this account.";
      setError(message);
      toast.error(message);
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-heading text-[1.9rem] font-extrabold leading-tight tracking-[-0.04em] text-[#0f1a15] sm:text-[2.2rem] dark:text-white">
            Manage users
          </h1>
          <p className="mt-1 max-w-[58ch] text-[13px] text-[#5f6f68] dark:text-[#9dab9f]">
            Change roles, review accounts and keep the marketplace healthy.
          </p>
        </div>

        <span className="inline-flex w-fit items-center gap-1.5 rounded-[7px] bg-[#e4f2ec] px-3 py-2 text-[10.5px] font-semibold text-[#0e6b54] dark:bg-[#112c25] dark:text-[#43d3ab]">
          <span className="size-1.5 rounded-full bg-current" />
          {users.length} accounts
        </span>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-[9px] border border-[#b42318]/20 bg-[#fcecea] px-3 py-2.5 text-[11.5px] text-[#b42318] dark:border-[#ff8f82]/20 dark:bg-[#2e1613] dark:text-[#ff8f82]"
        >
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
          {error}
        </p>
      )}

      <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative w-full max-w-[330px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#87948d]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, email or area…"
            aria-label="Search users"
            className="h-10 w-full rounded-[9px] border border-[#e5e1d6] bg-white pl-9 pr-3 text-[12px] text-[#0f1a15] outline-none transition placeholder:text-[#87948d] focus:border-[#0e6b54] focus:ring-[3px] focus:ring-[#0e6b54]/10 dark:border-[#263a30] dark:bg-[#101a16] dark:text-white dark:placeholder:text-[#6f8579] dark:focus:border-[#43d3ab]"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(event) =>
            setRoleFilter(event.target.value as AdminRole | "all")
          }
          aria-label="Filter by role"
          className="h-10 w-full rounded-[9px] border border-[#e5e1d6] bg-white px-3 text-[12px] font-medium text-[#27352f] outline-none transition focus:border-[#0e6b54] lg:w-[150px] dark:border-[#263a30] dark:bg-[#101a16] dark:text-white dark:focus:border-[#43d3ab]"
        >
          <option value="all">All roles</option>
          <option value="customer">Customers</option>
          <option value="technician">Technicians</option>
          <option value="admin">Admins</option>
        </select>

        <p className="text-[11.5px] text-[#87948d] lg:ml-auto">
          {filtered.length} results
        </p>
      </div>

      <section className="mt-4 overflow-hidden rounded-2xl border border-[#e5e1d6] bg-white dark:border-white/[0.08] dark:bg-[#101a16]">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[940px] text-left">
            <thead>
              <tr className="border-b border-[#e5e1d6] text-[9.5px] uppercase tracking-[0.08em] text-[#87948d] dark:border-white/[0.08]">
                <th className="px-5 py-3 font-semibold">User</th>
                <th className="px-3 py-3 font-semibold">Role</th>
                <th className="px-3 py-3 font-semibold">Area</th>
                <th className="px-3 py-3 font-semibold">Plan</th>
                <th className="px-3 py-3 font-semibold">Joined</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e1d6] dark:divide-white/[0.07]">
              {filtered.map((user, index) => {
                const isSelf = user.email === currentEmail;
                const isSuspended = Boolean(user.banned);

                return (
                  <tr key={user.id} className="text-[11.5px]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "flex size-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                            AVATAR_TONES[index % AVATAR_TONES.length],
                          )}
                        >
                          {initials(user.name)}
                        </span>
                        <div className="min-w-0">
                          <p className="flex items-center gap-2 font-semibold text-[#0f1a15] dark:text-white">
                            {user.name}
                            {isSuspended && (
                              <span className="rounded-[4px] bg-[#fcecea] px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wide text-[#b42318] dark:bg-[#2e1613] dark:text-[#ff8f82]">
                                Suspended
                              </span>
                            )}
                          </p>
                          <p className="mt-0.5 truncate text-[10px] text-[#87948d]">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <select
                        value={user.role}
                        onChange={(event) => {
                          const next = event.target.value;
                          if (next === "customer" || next === "technician") {
                            changeRole(user.id, next);
                          }
                        }}
                        disabled={isSelf || pendingId === user.id}
                        aria-label={`Role for ${user.name}`}
                        className="h-8 rounded-[7px] border border-[#e5e1d6] bg-white px-2 text-[10.5px] font-medium text-[#27352f] outline-none disabled:cursor-not-allowed disabled:opacity-70 dark:border-white/15 dark:bg-[#101a16] dark:text-white"
                      >
                        <option value="customer">Customer</option>
                        <option value="technician">Technician</option>
                        <option value="admin" disabled>
                          Admin
                        </option>
                      </select>
                      {isSelf && (
                        <p className="mt-1 text-[9.5px] text-[#87948d]">
                          That is you
                        </p>
                      )}
                    </td>
                    <td className="px-3 py-4 text-[#5f6f68] dark:text-[#9dab9f]">
                      {user.area}
                    </td>
                    <td className="px-3 py-4">
                      {user.role === "technician" && user.plan === "pro" ? (
                        <span className="inline-flex h-6 items-center gap-1.5 rounded-[5px] bg-[#fcf0d7] px-2 text-[10px] font-semibold text-[#a65c07] dark:bg-[#2b2415] dark:text-[#f0bb6a]">
                          <span className="size-1.5 rounded-full bg-current" />
                          Pro
                        </span>
                      ) : (
                        <span className="text-[#87948d]">—</span>
                      )}
                    </td>
                    <td className="px-3 py-4 text-[#5f6f68] dark:text-[#9dab9f]">
                      {formatDate(user.joined)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setSelected(user)}
                          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#27352f] hover:text-[#0e6b54] dark:text-[#cfdbd3] dark:hover:text-[#63e6b6]"
                        >
                          <Eye className="size-3.5" />
                          View
                        </button>
                        {!isSelf && user.role !== "admin" && (
                          <button
                            type="button"
                            onClick={() => toggleSuspend(user)}
                            disabled={pendingId === user.id}
                            className={cn(
                              "inline-flex items-center gap-1.5 text-[11px] font-semibold disabled:cursor-not-allowed disabled:opacity-60",
                              isSuspended
                                ? "text-[#0e6b54] dark:text-[#63e6b6]"
                                : "text-[#b42318] dark:text-[#ff8f82]",
                            )}
                          >
                            {isSuspended ? (
                              <RotateCcw className="size-3.5" />
                            ) : (
                              <Ban className="size-3.5" />
                            )}
                            {isSuspended ? "Restore" : "Suspend"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-[#e5e1d6] md:hidden dark:divide-white/[0.07]">
          {filtered.map((user, index) => {
            const isSelf = user.email === currentEmail;
            const isSuspended = Boolean(user.banned);

            return (
              <div key={user.id} className="p-4">
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                      AVATAR_TONES[index % AVATAR_TONES.length],
                    )}
                  >
                    {initials(user.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-1.5 text-[12px] font-semibold text-[#0f1a15] dark:text-white">
                      {user.name}
                      {isSuspended && (
                        <span className="rounded-[4px] bg-[#fcecea] px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wide text-[#b42318] dark:bg-[#2e1613] dark:text-[#ff8f82]">
                          Suspended
                        </span>
                      )}
                    </p>
                    <p className="truncate text-[10px] text-[#87948d]">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-[10.5px]">
                  <div>
                    <p className="text-[#87948d]">Role</p>
                    <select
                      value={user.role}
                      onChange={(event) => {
                        const next = event.target.value;
                        if (next === "customer" || next === "technician") {
                          changeRole(user.id, next);
                        }
                      }}
                      disabled={isSelf || pendingId === user.id}
                      aria-label={`Role for ${user.name}`}
                      className="mt-1 h-8 w-full rounded-[7px] border border-[#e5e1d6] bg-white px-2 text-[10.5px] font-medium text-[#27352f] disabled:cursor-not-allowed disabled:opacity-70 dark:border-white/15 dark:bg-[#101a16] dark:text-white"
                    >
                      <option value="customer">Customer</option>
                      <option value="technician">Technician</option>
                      <option value="admin" disabled>
                        Admin
                      </option>
                    </select>
                  </div>
                  <div>
                    <p className="text-[#87948d]">Area</p>
                    <p className="mt-1 font-medium text-[#27352f] dark:text-[#cfdbd3]">
                      {user.area}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#87948d]">Plan</p>
                    <p className="mt-1 font-medium text-[#27352f] dark:text-[#cfdbd3]">
                      {user.role === "technician" && user.plan === "pro"
                        ? "Pro"
                        : "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#87948d]">Joined</p>
                    <p className="mt-1 font-medium text-[#27352f] dark:text-[#cfdbd3]">
                      {formatDate(user.joined)}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-3 border-t border-[#e5e1d6] pt-3 dark:border-white/[0.07]">
                  <button
                    type="button"
                    onClick={() => setSelected(user)}
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#27352f] dark:text-[#cfdbd3]"
                  >
                    <Eye className="size-3.5" />
                    View
                  </button>
                  {!isSelf && user.role !== "admin" && (
                    <button
                      type="button"
                      onClick={() => toggleSuspend(user)}
                      disabled={pendingId === user.id}
                      className={cn(
                        "ml-auto inline-flex items-center gap-1.5 text-[11px] font-semibold disabled:cursor-not-allowed disabled:opacity-60",
                        isSuspended
                          ? "text-[#0e6b54] dark:text-[#63e6b6]"
                          : "text-[#b42318] dark:text-[#ff8f82]",
                      )}
                    >
                      {isSuspended ? (
                        <RotateCcw className="size-3.5" />
                      ) : (
                        <Ban className="size-3.5" />
                      )}
                      {isSuspended ? "Restore" : "Suspend"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="p-10 text-center text-[12px] text-[#5f6f68] dark:text-[#9dab9f]">
            No accounts match this search.
          </p>
        )}

        <div className="flex flex-col gap-2 border-t border-[#e5e1d6] px-5 py-3 text-[10px] text-[#87948d] sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.08]">
          <span className="flex items-center gap-1.5">
            <Lock className="size-3.5" />
            Roles are protected by the admin middleware. You cannot demote
            yourself.
          </span>
          <span>Page 1 of 1</span>
        </div>
      </section>

      {selected && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${selected.name} account details`}
        >
          <div className="w-full max-w-[440px] rounded-2xl border border-[#e5e1d6] bg-white p-5 dark:border-white/10 dark:bg-[#101a16]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-full bg-[#e9efff] text-[12px] font-bold text-[#274ec4]">
                  {initials(selected.name)}
                </span>
                <div className="min-w-0">
                  <h2 className="truncate font-heading text-[16px] font-bold text-[#0f1a15] dark:text-white">
                    {selected.name}
                  </h2>
                  <p className="truncate text-[11px] text-[#5f6f68] dark:text-[#9dab9f]">
                    {selected.email}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close account details"
                className="flex size-8 shrink-0 items-center justify-center rounded-[8px] text-[#87948d] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
              >
                <X className="size-4" />
              </button>
            </div>

            <dl className="mt-4 grid gap-2.5 border-y border-[#e5e1d6] py-4 text-[11.5px] dark:border-white/[0.08]">
              <Detail label="Role" value={ROLE_LABEL[selected.role]} />
              <Detail
                label="Status"
                value={selected.banned ? "Suspended" : "Active"}
              />
              <Detail label="Area" value={selected.area} />
              <Detail label="Phone" value={selected.phone} />
              <Detail label="Joined" value={formatDate(selected.joined)} />
              <Detail
                label="Plan"
                value={selected.plan === "pro" ? "Pro" : "Free"}
              />
              {selected.jobs !== undefined && (
                <Detail label="Jobs" value={String(selected.jobs)} />
              )}
            </dl>

            {selected.bio && (
              <p className="mt-3 text-[11.5px] leading-[1.6] text-[#5f6f68] dark:text-[#9dab9f]">
                {selected.bio}
              </p>
            )}

            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mt-5 flex h-10 w-full items-center justify-center rounded-[9px] bg-[#0e6b54] text-[12.5px] font-semibold text-white dark:bg-[#63e6b6] dark:text-[#06231b]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-[#5f6f68] dark:text-[#9dab9f]">{label}</dt>
      <dd className="max-w-[240px] truncate text-right font-semibold text-[#0f1a15] dark:text-white">
        {value}
      </dd>
    </div>
  );
}
