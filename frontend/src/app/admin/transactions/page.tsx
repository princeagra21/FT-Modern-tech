// FleetStack — Transactions (Admin ⇄ SuperAdmin Credits) • Tier‑1 Minimal UI (v1.1.1)
// Context: ALL transactions are via online gateways (Stripe, Card, UPI, NetBanking, Wallet).
// Change: Fix CSV export (terminated regex + proper newlines + safe quoting); minor cleanup.
"use client";
import React, { useEffect, useMemo, useState } from "react";

// shadcn/ui
import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { copy, formatDate, genId } from "@/lib/data/admin";
import { Txn } from "@/lib/types/admin";
import TransactionDetailModal from "@/components/admin/transaction/TransactionDetailModal";
import {
  DisplayMap,
  SmartCheckboxAutoTable,
} from "@/components/common/smartcheckboxautotable";
import StatusBadge from "@/components/common/StatusBadge";
import { FilterConfigMap } from "@/components/common/smartcheckboxautotable";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import KpiCardBase from "@/components/common/KpiCardBase";

// ------------------------------------------------------------------
// Google Material Symbols (icon font)
// ------------------------------------------------------------------
function useMaterialSymbols() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.getElementById("material-symbols")) return;
    const link = document.createElement("link");
    link.id = "material-symbols";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0";
    document.head.appendChild(link);
  }, []);
}
function Mi({
  name,
  className = "",
  title,
}: {
  name: string;
  className?: string;
  title?: string;
}) {
  useMaterialSymbols();
  return (
    <span
      className={`material-symbols-outlined align-middle ${className}`}
      aria-hidden
      title={title}
    >
      {name}
    </span>
  );
}

// ------------------------------------------------------------------
// Types & helpers (ONLINE ONLY)
// ------------------------------------------------------------------

function fmtMoney(amt: number, ccy: string) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: ccy,
    }).format(amt);
  } catch {
    return `${ccy} ${amt.toFixed(2)}`;
  }
}

function csvDownload(rows: Txn[]) {
  const headers = [
    "id",
    "date",
    "status",
    "method",
    "credits",
    "amount",
    "currency",
    "reference",
    "notes",
  ];
  const sanitize = (v: unknown) => {
    const s = (v ?? "").toString().replace(/\r?\n/g, " ").replace(/"/g, '""');
    return /,|"/.test(s) ? `"${s}"` : s;
  };
  const data = rows.map((r) => [
    r.id,
    r.date,
    r.status,
    r.method,
    r.credits,
    r.amount,
    r.currency,
    r.reference ?? "",
    r.notes ?? "",
  ]);
  const csv = [headers, ...data]
    .map((row) => row.map(sanitize).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `transactions_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

// ------------------------------------------------------------------
// Sample Data (ONLINE ONLY)
// ------------------------------------------------------------------

const SEED: Txn[] = [
  {
    id: genId(),
    date: new Date().toISOString(),
    status: "success",
    method: "UPI",
    credits: 10,
    amount: 14990,
    currency: "INR",
    reference: "upi://pay/intent_9A7B",
    notes: "Top-up: 10 credit-years",
    fee: 75,
    tax: 270,
    invoiceNo: "INV-2025-0101",
    meta: { vpa: "fleet@okaxis" },
  },
  {
    id: genId(),
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
    status: "success",
    method: "Card",
    credits: 5,
    amount: 7495,
    currency: "INR",
    reference: "pi_3Nxx4242",
    notes: "Stripe Card • **** 4242",
    fee: 50,
    tax: 135,
    invoiceNo: "INV-2025-0097",
  },
  {
    id: genId(),
    date: new Date(Date.now() - 5 * 86400000).toISOString(),
    status: "pending",
    method: "NetBanking",
    credits: 2,
    amount: 2998,
    currency: "INR",
    reference: "nb_7788",
    notes: "Awaiting bank confirmation",
  },
  {
    id: genId(),
    date: new Date(Date.now() - 7 * 86400000).toISOString(),
    status: "failed",
    method: "UPI",
    credits: 3,
    amount: 4497,
    currency: "INR",
    reference: "upi_fail_8899",
    notes: "Insufficient funds",
  },
  {
    id: genId(),
    date: new Date(Date.now() - 12 * 86400000).toISOString(),
    status: "refunded",
    method: "Card",
    credits: -1,
    amount: -1499,
    currency: "INR",
    reference: "re_93HG",
    notes: "Refund for duplicate",
  },
  {
    id: genId(),
    date: new Date(Date.now() - 14 * 86400000).toISOString(),
    status: "success",
    method: "Wallet",
    credits: 1,
    amount: 1499,
    currency: "INR",
    reference: "rzp_w_9812",
    notes: "Wallet promo",
  },
  {
    id: genId(),
    date: new Date(Date.now() - 25 * 86400000).toISOString(),
    status: "success",
    method: "UPI",
    credits: 20,
    amount: 29980,
    currency: "INR",
    reference: "upi_9922",
    notes: "Bulk purchase 20",
  },
  {
    id: genId(),
    date: new Date(Date.now() - 32 * 86400000).toISOString(),
    status: "success",
    method: "Card",
    credits: 1,
    amount: 1499,
    currency: "INR",
    reference: "pi_3abc1111",
    notes: "Auto top-up",
  },
];

// ------------------------------------------------------------------
// Component (MINIMAL)
// ------------------------------------------------------------------

export default function TransactionsPage() {
  const [rows] = useState<Txn[]>(SEED);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [method, setMethod] = useState<string>("all");
  const [range, setRange] = useState<string>("30d");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useMaterialSymbols();

  // Small metrics (minimal): Available credits, Processed (30d)
  const available = useMemo(
    () => rows.reduce((acc, r) => acc + r.credits, 0),
    [rows]
  );
  const processed30d = useMemo(() => {
    const since = daysAgo(30).getTime();
    return rows
      .filter(
        (r) =>
          new Date(r.date).getTime() >= since &&
          r.status === "success" &&
          r.amount > 0
      )
      .reduce((s, r) => s + r.amount, 0);
  }, [rows]);

  // Filtering
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const start = (() => {
      if (range === "all") return new Date(0);
      if (range === "7d") return daysAgo(7);
      if (range === "30d") return daysAgo(30);
      if (range === "90d") return daysAgo(90);
      if (range === "ytd") return new Date(new Date().getFullYear(), 0, 1);
      return daysAgo(30);
    })();

    return rows
      .filter((r) => {
        if (new Date(r.date) < start) return false;
        if (status !== "all" && r.status !== status) return false;
        if (method !== "all" && r.method !== method) return false;
        if (q) {
          const hay = `${r.id} ${r.reference ?? ""} ${
            r.notes ?? ""
          }`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [rows, search, status, method, range]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [filtered.length]);

  // Details modal
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Txn | null>(null);
  function openDetails(r: Txn) {
    setActive(r);
    setOpen(true);
  }

  const transactionsDisplayOptions: DisplayMap<Txn> = {
    1: {
      title: () => <span>Date</span>,
      content: (row) => (
        <div>
          <div className="font-medium">{formatDate(row.date)}</div>
          <div className="typo-subtitle">
            {row.invoiceNo ? `Invoice ${row.invoiceNo}` : row.reference || "—"}
          </div>
        </div>
      ),
    },

    2: {
      title: () => <span>Txn</span>,
      content: (row) => (
        <div>
          <div className="font-mono text-sm">{row.id}</div>
          <div className="typo-subtitle max-w-[26ch] truncate">
            {row.notes || "—"}
          </div>
        </div>
      ),
    },

    3: {
      title: () => <span>Method</span>,
      content: (row) => <span className="text-sm">{row.method}</span>,
    },

    4: {
      title: () => <span>Credits</span>,
      content: (row) => (
        <span className={row.credits < 0 ? "text-error" : "text-success"}>
          {row.credits > 0 ? "+" : ""}
          {row.credits}
        </span>
      ),
    },

    5: {
      title: () => <span>Amount</span>,
      content: (row) => (
        <span className={row.amount < 0 ? "text-error" : "font-medium"}>
          {new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: row.currency,
          }).format(row.amount)}
        </span>
      ),
    },

    6: {
      title: () => <span>Status</span>,
      content: (row) => <StatusBadge status={row.status} />,
    },

    7: {
      title: () => <span>Actions</span>,
      content: (row) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertIcon fontSize="small" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* 👉 Open Transaction Modal */}
              <DropdownMenuItem onClick={() => openDetails(row)}>
                <VisibilityIcon className="mr-2 h-4 w-4" /> View details
              </DropdownMenuItem>

              {/* 👉 Open receipt */}
              <DropdownMenuItem
                onClick={() => window.open(row.receiptUrl || "#", "_blank")}
              >
                <ReceiptLongIcon className="mr-2 h-4 w-4" /> Receipt
              </DropdownMenuItem>

              {/* 👉 Copy reference */}
              <DropdownMenuItem onClick={() => copy(row.reference || row.id)}>
                <ContentCopyIcon className="mr-2 h-4 w-4" /> Copy reference
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  };

  const transactionsFilterConfig: FilterConfigMap<Txn> = {
    status: {
      kind: "select",
      label: "Status",
      field: "status",
      options: [
        { label: "Success", value: "success" },
        { label: "Pending", value: "pending" },
        { label: "Failed", value: "failed" },
        { label: "Refunded", value: "refunded" },
      ],
    },
    method: {
      kind: "select",
      label: "Method",
      field: "method",
      options: [
        { label: "UPI", value: "UPI" },
        { label: "Card", value: "Card" },
        { label: "NetBanking", value: "NetBanking" },
        { label: "Wallet", value: "Wallet" },
      ],
    },
    reference: {
      kind: "text",
      label: "Reference / Notes",
      field: "reference",
    },
  };

  const kpis = [
    {
      title: "Available Credits",
      value: available,
      icon: null, // if you want an icon later you can add
      subTitle: null, // optional hint
    },
    {
      title: "Processed (30 days)",
      value: fmtMoney(processed30d, "INR"),
      icon: null,
      subTitle: null,
    },
  ];

  const transactionsBulkActions = [
    {
      id: "copy_refs",
      name: "Copy References",
      tooltip: "Copy reference numbers of selected transactions",
      callback: (rows: Txn[]) => {
        navigator.clipboard.writeText(rows.map((r) => r.reference).join("\n"));
      },
    },
    {
      id: "open_receipts",
      name: "Open Receipts",
      tooltip: "Open receipt URLs of selected rows",
      callback: (rows: Txn[]) => {
        rows.forEach((r) => window.open(r.receiptUrl ?? "#", "_blank"));
      },
    },
  ];

  return (
    <div className="min-h-screen bg-white text-zinc-950">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-7xl px-4 py-4 md:py-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="typo-h1">
                Transactions
              </h1>
              <p className="text-sm text-zinc-500 mt-1">
                Online payments & credits from your gateway
                (Stripe/UPI/Card/etc.).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => csvDownload(filtered)}
              >
                <Mi name="download" /> Export CSV
              </Button>
            </div>
          </div>

          {/* Minimal summary */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {kpis.map((k, idx) => (
              <KpiCardBase
                key={idx}
                title={k.title}
                value={k.value}
                Icon={k.icon}
                subTitle={k.subTitle ?? ""}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Table (minimal) */}
      <SmartCheckboxAutoTable<Txn>
        title="Transactions"
        data={filtered}
        getRowId={(r) => r.id}
        displayOptions={transactionsDisplayOptions}
        filterConfig={transactionsFilterConfig}
        multiSelectOptions={transactionsBulkActions}
        onRowClick={(row) => openDetails(row)}
        exportBrand={{
          name: "Fleet Stack",
          footerNote: "Self-hosted online gateway transactions",
        }}
        showtoolbar
        showtoolbarInput
        showtoolbarFilter
        showtoolbarRecords
        showtoolbarExport
        showtoolbarColumn
        showtoolbarRefreshbtn={false}
        showtoolbarFullScreen
      />

      {/* View Details Modal (compact) */}
      <TransactionDetailModal open={open} setOpen={setOpen} active={active} />

      <footer className="mx-auto max-w-7xl px-4 py-12 typo-subtitle">
        FleetStack • Transactions UI — v1.1.1 (online‑only)
      </footer>
    </div>
  );
}
