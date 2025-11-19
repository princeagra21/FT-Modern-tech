// FleetStack — Payments (Admin UI • Tier‑1)
// UI‑only demo page for viewing and adding payments (online & manual) tied to device renewals.
// Uses shadcn/ui + Tailwind + Material Design Icons. TypeScript friendly React component.
"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  CurrencyRupee as IndianRupee,
  CheckCircle as CheckCircle2,
  Schedule as Clock3,
  Warning as AlertTriangle,
  Search,
  FilterList as Filter,
  Add as Plus,
  Upload,
  Download,
  Receipt,
  Send,
  Visibility as Eye,
  ContentCopy as Copy,
} from "@mui/icons-material";

// shadcn/ui components (assumed available in your project)
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddPaymentSheet from "@/components/admin/payment/AddPaymentSheet";
import { genId } from "@/lib/data/admin";
import KpiCardBase from "@/components/common/KpiCardBase";
import { PaymentsTable } from "@/components/admin/payment/PaymentsTable";

// ---------------------------------------------
// Mock Data & Helpers
// ---------------------------------------------

type Method = "Online" | "UPI" | "Cash" | "Bank" | "Cheque" | "Card";
type Status = "Settled" | "Pending" | "Refunded";

type Payment = {
  id: string;
  date: string; // ISO
  customer: string;
  vehicle: string; // e.g., MH12AB1234
  imei: string;
  plan: string;
  channel: "Online" | "Manual";
  method: Method;
  amount: number; // base amount (without tax)
  tax: number; // GST etc
  total: number; // amount + tax
  status: Status;
  reference: string; // txn id, cheque no, etc
  invoiceNo: string;
};

const CUSTOMERS = [
  "Sharma Logistics",
  "Vijay Transports",
  "RapidMove Co.",
  "NorthStar Fleet",
  "Kiran Carriers",
];
const VEHICLES = [
  { vehicle: "MH12AB1234", imei: "863482040279901" },
  { vehicle: "GJ06CD4567", imei: "863482040279902" },
  { vehicle: "DL01EF9876", imei: "863482040279903" },
  { vehicle: "UP14GH2222", imei: "863482040279904" },
  { vehicle: "KA05JK7654", imei: "863482040279905" },
];

const PLANS = ["Annual Basic", "Annual Pro", "Half‑Year Basic", "Quarterly"];

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(n);
}

function fmtDate(d: string | Date) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const SAMPLE_PAYMENTS: Payment[] = Array.from({ length: 22 }).map((_, i) => {
  const cust = CUSTOMERS[i % CUSTOMERS.length];
  const dev = VEHICLES[i % VEHICLES.length];
  const plan = PLANS[i % PLANS.length];
  const methodList: Method[] = [
    "Online",
    "UPI",
    "Cash",
    "Bank",
    "Cheque",
    "Card",
  ];
  const method = methodList[i % methodList.length];
  const channel = method === "Online" ? "Online" : "Manual";
  const amount = [1499, 2499, 899, 499][i % 4];
  const tax = Math.round(amount * 0.18);
  const total = amount + tax;
  const status: Status =
    i % 9 === 0 ? "Refunded" : i % 5 === 0 ? "Pending" : "Settled";
  const dt = new Date();
  dt.setDate(dt.getDate() - (i % 18));
  return {
    id: genId(),
    date: dt.toISOString(),
    customer: cust,
    vehicle: dev.vehicle,
    imei: dev.imei,
    plan,
    channel,
    method,
    amount,
    tax,
    total,
    status,
    reference: method === "Online" ? `RAZ-${100000 + i}` : `REF-${1000 + i}`,
    invoiceNo: `INV-${202500 + i}`,
  };
});

// ---------------------------------------------
// Main Component
// ---------------------------------------------

export default function PaymentsAdminPage() {
  const [query, setQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [range, setRange] = useState<string>("30d");
  const [items, setItems] = useState<Payment[]>(SAMPLE_PAYMENTS);
  const [selected, setSelected] = useState<string[]>([]);
  const [addOpen, setAddOpen] = useState(false);

  const today = new Date();
  const fromDate = useMemo(() => {
    const d = new Date();
    if (range === "today") d.setHours(0, 0, 0, 0);
    if (range === "7d") d.setDate(today.getDate() - 7);
    if (range === "30d") d.setDate(today.getDate() - 30);
    if (range === "all") return null;
    return d;
  }, [range]);

  const filtered = useMemo(() => {
    return items.filter((p) => {
      const q = query.trim().toLowerCase();
      const matchQ = q
        ? [
            p.customer,
            p.vehicle,
            p.imei,
            p.reference,
            p.invoiceNo,
            p.plan,
          ].some((x) => x.toLowerCase().includes(q))
        : true;
      const matchMethod =
        methodFilter === "all" || p.method.toLowerCase() === methodFilter;
      const matchStatus =
        statusFilter === "all" || p.status.toLowerCase() === statusFilter;
      const matchDate = fromDate ? new Date(p.date) >= fromDate : true;
      return matchQ && matchMethod && matchStatus && matchDate;
    });
  }, [items, query, methodFilter, statusFilter, fromDate]);

  const counts = useMemo(() => {
    const todayStr = new Date().toDateString();
    const todayAmt = items
      .filter(
        (p) =>
          new Date(p.date).toDateString() === todayStr && p.status === "Settled"
      )
      .reduce((a, p) => a + p.total, 0);

    const month = new Date().getMonth();
    const monthYear = new Date().getFullYear();
    const monthAmt = items
      .filter((p) => {
        const d = new Date(p.date);
        return (
          d.getMonth() === month &&
          d.getFullYear() === monthYear &&
          p.status === "Settled"
        );
      })
      .reduce((a, p) => a + p.total, 0);

    const online = items
      .filter((p) => p.channel === "Online" && p.status === "Settled")
      .reduce((a, p) => a + p.total, 0);
    const manual = items
      .filter((p) => p.channel === "Manual" && p.status === "Settled")
      .reduce((a, p) => a + p.total, 0);

    return { todayAmt, monthAmt, online, manual };
  }, [items]);

  const kpiList = [
    {
      title: "Collected Today",
      value: formatINR(counts.todayAmt),
      icon: CheckCircle2,
      hint: "Settled only",
    },
    {
      title: "This Month",
      value: formatINR(counts.monthAmt),
      icon: IndianRupee,
      hint: "Settled only",
    },
    {
      title: "Online",
      value: formatINR(counts.online),
      icon: Send,
      hint: "Razorpay/Stripe/etc",
    },
    {
      title: "Manual",
      value: formatINR(counts.manual),
      icon: Receipt,
      hint: "UPI/Cash/Bank/Cheque",
    },
  ];


  const onAddPayment = (p: Omit<Payment, "id">) => {
    const newItem: Payment = { ...p, id: genId() };
    setItems((prev) => [newItem, ...prev]);
    setAddOpen(false);
  };

  const exportCSV = () => {
    const headers = [
      "date",
      "customer",
      "vehicle",
      "imei",
      "plan",
      "channel",
      "method",
      "amount",
      "tax",
      "total",
      "status",
      "reference",
      "invoiceNo",
    ];
    const rows = filtered.map((p) => [
      new Date(p.date).toISOString(),
      p.customer,
      p.vehicle,
      p.imei,
      p.plan,
      p.channel,
      p.method,
      p.amount,
      p.tax,
      p.total,
      p.status,
      p.reference,
      p.invoiceNo,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white text-zinc-950">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-7xl px-4 py-4 md:py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="typo-h1">
                Payments
              </h1>
              <p className="text-sm text-zinc-500 mt-1">
                List of all received payments & manual receipts for device
                renewals.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2" onClick={exportCSV}>
                <Download className="h-4 w-4" /> Export CSV
              </Button>
              <Button className="gap-2" onClick={() => setAddOpen(true)}>
                <Plus className="h-4 w-4" /> Add Payment
              </Button>
            </div>
          </div>

          {/* KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
            {kpiList.map((kpi, idx) => (
              <KpiCardBase
                key={idx}
                title={kpi.title}
                value={kpi.value}
                Icon={kpi.icon}
                subTitle={kpi.hint}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mx-auto max-w-7xl px-4 pt-4">
       

        {/* Bulk bar */}
        {selected.length > 0 && (
          <Card className="mt-4 border-zinc-200">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="text-sm text-zinc-600">
                <span className="font-medium text-zinc-900">
                  {selected.length}
                </span>{" "}
                payment(s) selected
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="gap-2">
                  <Copy className="h-4 w-4" /> Copy refs
                </Button>
                <Button variant="outline" className="gap-2">
                  <Send className="h-4 w-4" /> Resend invoices
                </Button>
                <Button
                  variant="ghost"
                  className="text-zinc-600"
                  onClick={() => setSelected([])}
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Table */}
        {/* <Card className="mt-4 border-zinc-200">
          <CardContent className="p-0"> */}
        <PaymentsTable
          payments={filtered}
          selected={selected}
          setSelected={setSelected}
          onAction={(action, rows) => {
            console.log("Action triggered:", action, rows);
            // you can show modals or toast here
          }}
        />
        {/* </CardContent>
        </Card> */}
      </div>

      {/* Add Payment */}
      <AddPaymentSheet
        open={addOpen}
        onOpenChange={setAddOpen}
        onAdd={onAddPayment}
      />

      <footer className="mx-auto max-w-7xl px-4 py-12 text-xs text-zinc-400">
        FleetStack • Payments UI — v1.0
      </footer>
    </div>
  );
}
