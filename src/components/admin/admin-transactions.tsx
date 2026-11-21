"use client";

import { useState } from "react";
import {
  Download,
  FileText,
  Receipt,
  ShieldCheck,
  TrendingUp,
  Users,
  Wallet,
  X,
} from "lucide-react";
import type { AdminPayment } from "@/lib/admin-data";
import { formatDate, money } from "@/lib/customer-data";

export function AdminTransactions({
  payments,
}: {
  payments: AdminPayment[];
}) {
  const [invoice, setInvoice] = useState<AdminPayment | null>(null);

  const total = payments.reduce(
    (sum, payment) => sum + payment.amount,
    0,
  );
  const monthKeys = [...new Set(payments.map((p) => p.paidAt.slice(0, 7)))].sort();
  const currentMonth = monthKeys[monthKeys.length - 1] ?? "";
  const thisMonthPayments = payments.filter((payment) =>
    payment.paidAt.startsWith(currentMonth),
  );
  const thisMonth = thisMonthPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0,
  );
  const techniciansPaid = new Set(
    payments.map((payment) => payment.technician),
  ).size;

  function exportCsv() {
    const rows = [
      [
        "Transaction ID",
        "Booking",
        "Service",
        "Customer",
        "Customer email",
        "Technician",
        "Amount",
        "Paid at",
      ],
      ...payments.map((payment) => [
        payment.transactionId,
        payment.bookingId,
        payment.title,
        payment.customer,
        payment.customerEmail,
        payment.technician,
        String(payment.amount),
        payment.paidAt,
      ]),
    ];
    const csv = rows
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "fixmate-transactions.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  const stats = [
    {
      label: "Total revenue",
      value: money(total),
      note: "All time",
      icon: <Wallet className="size-4" />,
      tone: "mint" as const,
    },
    {
      label: "This month",
      value: money(thisMonth),
      note: `${thisMonthPayments.length} payment${thisMonthPayments.length === 1 ? "" : "s"}`,
      icon: <TrendingUp className="size-4" />,
      tone: "indigo" as const,
    },
    {
      label: "Transactions",
      value: String(payments.length),
      note: "100% successful",
      icon: <FileText className="size-4" />,
      tone: "amber" as const,
    },
    {
      label: "Technicians paid",
      value: String(techniciansPaid),
      note: "Across all categories",
      icon: <Users className="size-4" />,
      tone: "mint" as const,
    },
  ];

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-heading text-[1.9rem] font-extrabold leading-tight tracking-[-0.04em] text-[#0f1a15] sm:text-[2.2rem] dark:text-white">
            Transactions
          </h1>
          <p className="mt-1 max-w-[58ch] text-[13px] text-[#5f6f68] dark:text-[#9dab9f]">
            Every Stripe payment recorded by the platform.
          </p>
        </div>

        <button
          type="button"
          onClick={exportCsv}
          disabled={payments.length === 0}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-[9px] border border-[#d2ccbc] bg-white px-4 text-[12.5px] font-semibold text-[#27352f] transition hover:bg-[#fbfaf6] disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/15 dark:bg-[#101a16] dark:text-white dark:hover:bg-white/[0.04]"
        >
          <Download className="size-4" />
          Export CSV
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[#e5e1d6] bg-white p-4 dark:border-white/[0.08] dark:bg-[#101a16]"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11.5px] text-[#5f6f68] dark:text-[#9dab9f]">
                {stat.label}
              </p>
              <span
                className={`flex size-8 items-center justify-center rounded-[8px] ${
                  stat.tone === "indigo"
                    ? "bg-[#ecebff] text-[#4f46e5] dark:bg-[#1c1a3a] dark:text-[#a9a4ff]"
                    : stat.tone === "amber"
                      ? "bg-[#fcf0d7] text-[#a65c07] dark:bg-[#2b2415] dark:text-[#f0bb6a]"
                      : "bg-[#e4f2ec] text-[#0e6b54] dark:bg-[#112c25] dark:text-[#43d3ab]"
                }`}
              >
                {stat.icon}
              </span>
            </div>
            <p className="mt-3 font-heading text-[28px] font-extrabold leading-none tracking-[-0.04em] text-[#0f1a15] dark:text-white">
              {stat.value}
            </p>
            <p className="mt-3 truncate text-[10.5px] text-[#5f6f68] dark:text-[#9dab9f]">
              {stat.note}
            </p>
          </div>
        ))}
      </div>

      <section className="mt-4 overflow-hidden rounded-2xl border border-[#e5e1d6] bg-white dark:border-white/[0.08] dark:bg-[#101a16]">
        <div className="flex flex-col gap-3 border-b border-[#e5e1d6] p-5 sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.08]">
          <div>
            <h2 className="flex items-center gap-2 font-heading text-[15px] font-bold text-[#0f1a15] dark:text-white">
              <Receipt className="size-4 text-[#87948d]" />
              Payment records
            </h2>
            <p className="mt-1 text-[11.5px] text-[#5f6f68] dark:text-[#9dab9f]">
              One document per paid booking · duplicate-proof
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-[6px] bg-[#e4f2ec] px-2.5 py-1.5 text-[10px] font-semibold text-[#0e6b54] dark:bg-[#112c25] dark:text-[#43d3ab]">
            <span className="size-1.5 rounded-full bg-current" />
            Stripe checkout
          </span>
        </div>

        {payments.length === 0 && (
          <div className="px-5 py-10 text-center">
            <Receipt className="mx-auto size-8 text-[#87948d]" />
            <p className="mt-3 font-heading text-[15px] font-bold text-[#0f1a15] dark:text-white">
              No transactions yet
            </p>
            <p className="mx-auto mt-2 max-w-[44ch] text-[12px] leading-[1.6] text-[#5f6f68] dark:text-[#9dab9f]">
              Payments appear here after a completed repair is paid through
              Stripe.
            </p>
          </div>
        )}

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[980px] text-left">
            <thead>
              <tr className="border-b border-[#e5e1d6] text-[9.5px] uppercase tracking-[0.08em] text-[#87948d] dark:border-white/[0.08]">
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-3 py-3 font-semibold">Technician</th>
                <th className="px-3 py-3 font-semibold">Service</th>
                <th className="px-3 py-3 font-semibold">Paid on</th>
                <th className="px-3 py-3 font-semibold">Transaction ID</th>
                <th className="px-3 py-3 text-right font-semibold">Amount</th>
                <th className="px-5 py-3 text-right font-semibold">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e1d6] dark:divide-white/[0.07]">
              {payments.map((payment, index) => (
                <tr key={payment.id} className="text-[11.5px]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`flex size-8 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
                          AVATAR_TONES[index % AVATAR_TONES.length]
                        }`}
                      >
                        {initials(payment.customer)}
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-[#0f1a15] dark:text-white">
                          {payment.customer}
                        </p>
                        <p className="mt-0.5 truncate text-[10px] text-[#87948d]">
                          {payment.customerEmail}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-[#5f6f68] dark:text-[#9dab9f]">
                    {payment.technician}
                  </td>
                  <td className="px-3 py-4">
                    <p className="max-w-[180px] truncate font-semibold text-[#0f1a15] dark:text-white">
                      {payment.title}
                    </p>
                    <p className="mt-0.5 text-[10px] text-[#87948d]">
                      #{payment.bookingNumber ?? payment.bookingId.toUpperCase()}
                    </p>
                  </td>
                  <td className="px-3 py-4 text-[#5f6f68] dark:text-[#9dab9f]">
                    {formatDate(payment.paidAt)}
                  </td>
                  <td className="px-3 py-4">
                    <span className="block max-w-[160px] truncate font-mono text-[10px] text-[#5f6f68] dark:text-[#9dab9f]">
                      {payment.transactionId}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-right font-semibold text-[#0f1a15] dark:text-white">
                    ${payment.amount.toFixed(2)}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setInvoice(payment)}
                      aria-label={`View invoice for ${payment.title}`}
                      className="inline-flex size-8 items-center justify-center rounded-[7px] border border-[#e5e1d6] text-[#5f6f68] hover:bg-[#fbfaf6] dark:border-white/10 dark:text-[#9dab9f] dark:hover:bg-white/[0.04]"
                    >
                      <FileText className="size-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-[#e5e1d6] lg:hidden dark:divide-white/[0.07]">
          {payments.map((payment, index) => (
            <div key={payment.id} className="p-4">
              <div className="flex items-start gap-3">
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                    AVATAR_TONES[index % AVATAR_TONES.length]
                  }`}
                >
                  {initials(payment.customer)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-semibold text-[#0f1a15] dark:text-white">
                    {payment.customer}
                  </p>
                  <p className="truncate text-[10px] text-[#87948d]">
                    {payment.customerEmail}
                  </p>
                </div>
                <p className="shrink-0 text-[12px] font-bold text-[#0f1a15] dark:text-white">
                  ${payment.amount.toFixed(2)}
                </p>
              </div>

              <div className="mt-2.5">
                <p className="text-[11px] font-semibold text-[#0f1a15] dark:text-white">
                  {payment.title}
                </p>
                <p className="mt-0.5 text-[10px] text-[#87948d]">
                  #{payment.bookingNumber ?? payment.bookingId.toUpperCase()} · {payment.technician} ·{" "}
                  {formatDate(payment.paidAt)}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#e5e1d6] pt-2.5 dark:border-white/[0.07]">
                <p className="max-w-[200px] truncate font-mono text-[9.5px] text-[#87948d]">
                  {payment.transactionId}
                </p>
                <button
                  type="button"
                  onClick={() => setInvoice(payment)}
                  className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold text-[#0e6b54] dark:text-[#63e6b6]"
                >
                  <FileText className="size-3.5" />
                  Invoice
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 border-t border-[#e5e1d6] px-5 py-3 text-[10px] text-[#87948d] sm:flex-row sm:items-center sm:justify-between dark:border-white/[0.08]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-3.5" />
            Payments are recorded by the verified Stripe webhook.
          </span>
          <span>Total {money(total)}</span>
        </div>
      </section>

      {invoice && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Invoice"
        >
          <div className="w-full max-w-[440px] rounded-2xl border border-[#e5e1d6] bg-white p-5 dark:border-white/10 dark:bg-[#101a16]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.1em] text-[#87948d]">
                  FixMate invoice
                </p>
                <h2 className="mt-1 font-heading text-[16px] font-bold text-[#0f1a15] dark:text-white">
                  {invoice.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setInvoice(null)}
                aria-label="Close invoice"
                className="flex size-8 items-center justify-center rounded-[8px] text-[#87948d] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
              >
                <X className="size-4" />
              </button>
            </div>

            <dl className="mt-4 grid gap-2.5 border-y border-[#e5e1d6] py-4 text-[11.5px] dark:border-white/[0.08]">
              <Row
                label="Booking"
                value={`#${invoice.bookingNumber ?? invoice.bookingId.toUpperCase()}`}
              />
              <Row label="Customer" value={invoice.customer} />
              <Row label="Technician" value={invoice.technician} />
              <Row label="Paid on" value={formatDate(invoice.paidAt)} />
              <Row label="Transaction" value={invoice.transactionId} mono />
            </dl>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-[11px] text-[#5f6f68] dark:text-[#9dab9f]">
                Amount paid
              </span>
              <span className="font-heading text-[22px] font-extrabold text-[#0f1a15] dark:text-white">
                {money(invoice.amount)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setInvoice(null)}
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

const AVATAR_TONES = [
  "bg-[#f6e7c8] text-[#a86a12]",
  "bg-[#e9efff] text-[#274ec4]",
  "bg-[#e2f4e9] text-[#147a4b]",
  "bg-[#fcecea] text-[#b42318]",
  "bg-[#f3e8ff] text-[#7e22ce]",
  "bg-[#e0f2fe] text-[#0369a1]",
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function Row({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-[#5f6f68] dark:text-[#9dab9f]">{label}</dt>
      <dd
        className={`max-w-[240px] truncate text-right font-semibold text-[#0f1a15] dark:text-white ${
          mono ? "font-mono text-[9.5px]" : ""
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
