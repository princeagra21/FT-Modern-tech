"use client";
import React, { useEffect, useMemo, useState } from "react";

// shadcn/ui (assumed available)
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import KpiCardBase from "@/components/common/KpiCardBase";
import {
  DirectionsCar,
  EventBusy,
  Payments,
  People,
  TrendingUp,
  WarningAmber,
  CheckCircleOutline,
} from "@mui/icons-material";

// ------------------ Lazy React‑ApexCharts (guarded) ------------------
// We keep the imported component in state and only render it if it is callable (a valid React component).
let _ChartCache: any = null; // avoids re-import churn across Renders in some environments

// ------------------ Mock Data (raw) ------------------
// NOTE: We normalize this below to avoid React #130 from any malformed entry.
const PLANS_RAW: Array<any> = [
  { id: "annual-basic", name: "Annual Basic", months: 12, price: 1499 },
  { id: "annual-pro", name: "Annual Pro", months: 12, price: 2499 },
  { id: "halfyear", name: "Half‑Year", months: 6, price: 899 },
  { id: "quarter", name: "Quarter", months: 3, price: 499 },
];

type Plan = { id: string; name: string; months: number; price: number };
function normalizePlans(arr: any[]): Plan[] {
  return (arr || [])
    .map((p) => ({
      id: String(p?.id ?? "").trim(),
      name: String(p?.name ?? "").trim(),
      months: Number.isFinite(Number(p?.months)) ? Number(p.months) : NaN,
      price: Number.isFinite(Number(p?.price)) ? Number(p.price) : NaN,
    }))
    .filter(
      (p) =>
        p.id.length > 0 &&
        p.name.length > 0 &&
        Number.isFinite(p.months) &&
        Number.isFinite(p.price)
    );
}

const PLANS: Plan[] = normalizePlans(PLANS_RAW);

const CUSTOMERS = [
  "Sharma Logistics",
  "Vijay Transports",
  "RapidMove Co.",
  "NorthStar Fleet",
  "Kiran Carriers",
  "Metro Haul",
];
const VEH = [
  "MH12AB1234",
  "GJ06CD4567",
  "DL01EF9876",
  "UP14GH2222",
  "KA05JK7654",
  "RJ13LM9988",
];

// Generate 120 devices spread across statuses & dates using normalized PLANS
const DEVICES = Array.from({ length: 120 }).map((_, i) => {
  const plan = PLANS[i % Math.max(1, PLANS.length)] || {
    id: "fallback",
    name: "Plan",
    months: 12,
    price: 0,
  };
  const installed = new Date();
  installed.setMonth(installed.getMonth() - (i % 14) - 1);
  const expiry = new Date(installed);
  expiry.setMonth(expiry.getMonth() + plan.months);
  const daysLeft = Math.ceil((expiry.getTime() - Date.now()) / 86400000);
  const status =
    daysLeft < 0 ? "OVERDUE" : daysLeft <= 30 ? "EXPIRING" : "ACTIVE";
  const suspended = i % 17 === 0;
  return {
    id: `D-${1000 + i}`,
    customer: CUSTOMERS[i % CUSTOMERS.length],
    vehicle: VEH[i % VEH.length],
    imei: `863482040279${900 + i}`,
    planId: plan.id,
    planName: plan.name,
    price: plan.price,
    installedAt: installed,
    expiryAt: expiry,
    status: suspended ? "SUSPENDED" : status,
    channel: i % 2 === 0 ? "Online" : "Manual",
  } as const;
});

// Payments over 90 days (randomized, online/manual) using normalized PLANS for amounts
const PAYMENTS = Array.from({ length: 160 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (i % 90));
  const plan = PLANS[i % Math.max(1, PLANS.length)] || {
    id: "fallback",
    name: "Plan",
    months: 12,
    price: 0,
  };
  const base = plan.price;
  const tax = Math.round(base * 0.18);
  return {
    at: d,
    channel: i % 3 === 0 ? "Manual" : "Online",
    amount: base + tax,
  };
});

// ------------------ Helpers ------------------
const INR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    n
  );
const fmt = (d: Date) =>
  d.toLocaleDateString(undefined, { month: "short", day: "2-digit" });

// ------------------ Main Component ------------------
export default function AnalyticsDashboard() {
  const [mounted, setMounted] = useState(false);
  const [ChartComp, setChartComp] = useState<any>(_ChartCache);

  const [range, setRange] = useState<string>("30d");
  const [plan, setPlan] = useState<string>("all");
  const [statusOnly, setStatusOnly] = useState<{
    expiring: boolean;
    overdue: boolean;
  }>({ expiring: true, overdue: true });
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      try {
        if (!_ChartCache) {
          const mod = await import("react-apexcharts");
          const maybe = (mod as any)?.default;
          if (typeof maybe === "function") {
            _ChartCache = maybe;
          } else if (
            maybe &&
            typeof maybe === "object" &&
            typeof (maybe as any).render === "function"
          ) {
            // Some builds export an object-like component; still acceptable.
            _ChartCache = maybe;
          } else {
            _ChartCache = null; // guard: don't render an object/non-component
          }
        }
        setChartComp(() => _ChartCache);
        setMounted(true);
      } catch {
        _ChartCache = null;
        setChartComp(null);
        setMounted(true);
      }
    })();
  }, []);

  // Filter devices by plan and search
  const devicesFiltered = useMemo(() => {
    return DEVICES.filter((d) => {
      const passPlan = plan === "all" || d.planId === plan;
      const passQ = q
        ? [d.customer, d.vehicle, d.imei, d.planName].some((x) =>
            x.toLowerCase().includes(q.toLowerCase())
          )
        : true;
      return passPlan && passQ;
    });
  }, [plan, q]);

  const expiring = devicesFiltered.filter((d) => d.status === "EXPIRING");
  const overdue = devicesFiltered.filter((d) => d.status === "OVERDUE");
  const active = devicesFiltered.filter((d) => d.status === "ACTIVE");
  const suspended = devicesFiltered.filter((d) => d.status === "SUSPENDED");

  const mrr = devicesFiltered.reduce((a, d) => a + d.price, 0);
  const renewalValue30 = expiring.reduce((a, d) => a + (d.price || 0), 0);
  const churnRateGuess = overdue.length / (devicesFiltered.length || 1);
  const renewalRateGuess = devicesFiltered.length ? 1 - churnRateGuess : 0;
  const arpu = devicesFiltered.length ? mrr / devicesFiltered.length : 0;

  // Build time series based on range
  const days =
    range === "7d" ? 7 : range === "30d" ? 30 : range === "90d" ? 90 : 30;
  const buckets: { x: string; online: number; manual: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toDateString();
    const dayPayments = PAYMENTS.filter((p) => p.at.toDateString() === key);
    buckets.push({
      x: fmt(d),
      online: dayPayments
        .filter((p) => p.channel === "Online")
        .reduce((a, p) => a + p.amount, 0),
      manual: dayPayments
        .filter((p) => p.channel === "Manual")
        .reduce((a, p) => a + p.amount, 0),
    });
  }

  // Plan distribution & channel mix (normalized)
  const planCounts = PLANS.map(
    (p) => devicesFiltered.filter((d) => d.planId === p.id).length
  );
  const channelMix = [
    devicesFiltered.filter((d) => d.channel === "Online").length,
    devicesFiltered.filter((d) => d.channel === "Manual").length,
  ];

  // Top customers by upcoming renewal value in 30 days
  const byCustomer = new Map<string, number>();
  expiring.forEach((d) =>
    byCustomer.set(d.customer, (byCustomer.get(d.customer) || 0) + d.price)
  );
  const topExpiring = Array.from(byCustomer.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // Charts
  const seriesCash = [
    { name: "Online", data: buckets.map((b) => Math.round(b.online)) },
    { name: "Manual", data: buckets.map((b) => Math.round(b.manual)) },
  ];
  const optCash: any = {
    chart: { type: "bar", stacked: true, toolbar: { show: false } },
    legend: { show: true },
    dataLabels: { enabled: false },
    xaxis: {
      categories: buckets.map((b) => b.x),
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (v: number) =>
          v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`,
      },
    },
    grid: { borderColor: "#eee" },
    tooltip: { y: { formatter: (v: number) => INR(v) } },
    plotOptions: { bar: { columnWidth: "55%", borderRadius: 6 } },
  };

  const seriesDonutPlan = planCounts;
  const optDonutPlan: any = {
    chart: { type: "donut" },
    labels: PLANS.map((p) => p.name),
    legend: { show: true },
    dataLabels: { enabled: false },
    tooltip: { y: { formatter: (v: number) => `${v} devices` } },
  };

  const seriesDonutChannel = channelMix;
  const optDonutChannel: any = {
    chart: { type: "donut" },
    labels: ["Online", "Manual"],
    legend: { show: true },
    dataLabels: { enabled: false },
    tooltip: { y: { formatter: (v: number) => `${v} devices` } },
  };

  // ------------------ UI ------------------
  return (
    <div className="min-h-screen bg-white text-zinc-950">
      {/* Header */}
      <div className="sticky top-10 z-30 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-7xl px-4 py-4 md:py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="typo-h1">
                Analytics
              </h1>
              <p className="text-sm text-zinc-500 mt-1">
                Real‑time insight across renewals, payments, and device health.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2">
                <DownloadIcon fontSize="small" /> Export
              </Button>
              <Button className="gap-2">
                <NotificationsActiveIcon fontSize="small" /> Notify Expiring
              </Button>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[240px]">
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search customer, vehicle, IMEI, plan…"
                className="pl-9"
              />
              <SearchIcon
                fontSize="small"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              />
            </div>
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={plan}
              onValueChange={setPlan}
              disabled={PLANS.length === 0}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue
                  placeholder={PLANS.length ? "Plan" : "No plans configured"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All plans</SelectItem>
                {PLANS.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-3 rounded-xl border px-3 py-2">
              <TuneIcon fontSize="small" className="text-zinc-500" />
              <div className="flex items-center gap-2">
                <Checkbox
                  id="exp"
                  checked={statusOnly.expiring}
                  onCheckedChange={(c) =>
                    setStatusOnly((s) => ({ ...s, expiring: !!c }))
                  }
                />
                <label htmlFor="exp" className="text-sm">
                  Expiring
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="ovd"
                  checked={statusOnly.overdue}
                  onCheckedChange={(c) =>
                    setStatusOnly((s) => ({ ...s, overdue: !!c }))
                  }
                />
                <label htmlFor="ovd" className="text-sm">
                  Overdue
                </label>
              </div>
            </div>
          </div>

          {/* KPI Row */}
          <section className="mt-6 mb-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {[
              {
                title: "Active",
                value: active.length,
                icon: DirectionsCar,
                subTitle: "Tracked devices",
              },
              {
                title: "Expiring (<30d)",
                value: expiring.length,
                icon: EventBusy,
                subTitle: "Act now",
              },
              {
                title: "Overdue",
                value: overdue.length,
                icon: WarningAmber,
                subTitle: "Suspension risk",
              },
              {
                title: "Suspended",
                value: suspended.length,
                icon: CheckCircleOutline,
                subTitle: "Disabled access",
              },
              {
                title: "MRR (est.)",
                value: mrr,
                icon: Payments,
                subTitle: "From current plans",
              },
              {
                title: "ARPU",
                value: Math.round(arpu),
                icon: TrendingUp,
                subTitle: "MRR / device",
              },
            ].map((k) => (
              <KpiCardBase
                key={k.title}
                title={k.title}
                value={Number(k.value)}
                Icon={k.icon}
                subTitle={k.subTitle}
              />
            ))}
          </section>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-10">
        {/* Charts: Cashflow + Renewal Pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          <ChartCard
            title="Cashflow by Day"
            subtitle="Online vs Manual collections"
            span={2}
          >
            {mounted &&
            ChartComp &&
            (typeof ChartComp === "function" ||
              typeof ChartComp?.render === "function") ? (
              <ChartComp
                options={optCash}
                series={seriesCash}
                type="bar"
                height={320}
              />
            ) : (
              <ChartSkeleton />
            )}
          </ChartCard>
          <Card className="rounded-2xl border-zinc-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Renewals 30‑Day Window
              </CardTitle>
              <CardDescription>Value at risk if not renewed</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="text-3xl font-semibold">
                {INR(renewalValue30)}
              </div>
              <div className="mt-2 text-sm text-zinc-600">
                {expiring.length} devices expiring within 30 days
              </div>
              <Separator className="my-4" />
              <div className="grid grid-cols-2 gap-3">
                <MiniStat
                  label="Renewal rate (est.)"
                  value={`${Math.round(renewalRateGuess * 100)}%`}
                  icon={AutorenewIcon}
                />
                <MiniStat
                  label="Churn (est.)"
                  value={`${Math.round(churnRateGuess * 100)}%`}
                  icon={SignalCellularAltIcon}
                />
              </div>
              <Button className="mt-4 w-full gap-2">
                <NotificationsActiveIcon fontSize="small" /> Send reminders
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Top customers at risk */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <Card className="rounded-2xl border-zinc-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Top Customers • Expiring Value
              </CardTitle>
              <CardDescription>Next 30 days</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="divide-y rounded-xl border">
                {topExpiring.map(([name, amt], idx) => (
                  <div
                    key={name}
                    className="flex items-center justify-between p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="secondary"
                        className="bg-white border border-zinc-200"
                      >
                        #{idx + 1}
                      </Badge>
                      <div>
                        <div className="font-medium">{name}</div>
                        <div className="typo-destructive">
                          Potential: {INR(amt)}
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Remind
                    </Button>
                  </div>
                ))}
                {topExpiring.length === 0 && (
                  <div className="p-6 text-center text-zinc-500 text-sm">
                    No expiring devices in this window.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-zinc-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Operations Pulse</CardTitle>
              <CardDescription>Quick health across the funnel</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <PulseRow
                icon={CheckCircleIcon}
                label="Collection success (est.)"
                value={`${Math.round(renewalRateGuess * 100)}%`}
              />
              <PulseRow
                icon={WarningAmberIcon}
                label="At‑risk devices"
                value={`${expiring.length + overdue.length}`}
                tone="amber"
              />
              <PulseRow
                icon={PaymentsIcon}
                label="Avg. ticket"
                value={INR(Math.round(arpu))}
              />
              <PulseRow
                icon={PersonIcon}
                label="Customers with >10 devices"
                value={`${
                  new Set(
                    DEVICES.filter((d) => d.status !== "SUSPENDED").map(
                      (d) => d.customer
                    )
                  ).size
                }`}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <footer className="mx-auto max-w-7xl px-4 py-12 typo-subtitle">
        FleetStack • Analytics UI — v1.2
      </footer>
    </div>
  );
}


function ChartCard({
  title,
  subtitle,
  children,
  span = 1,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  span?: 1 | 2 | 3;
}) {
  return (
    <Card
      className={`rounded-2xl border-zinc-200 ${
        span === 2 ? "lg:col-span-2" : span === 3 ? "lg:col-span-3" : ""
      }`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        {subtitle ? <CardDescription>{subtitle}</CardDescription> : null}
      </CardHeader>
      <CardContent className="pt-2">{children}</CardContent>
    </Card>
  );
}

function ChartSkeleton() {
  return (
    <div className="h-[300px] w-full animate-pulse rounded-xl bg-zinc-100" />
  );
}

function MiniStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: any;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border p-3">
      <div>
        <div className="typo-destructive">{label}</div>
        <div className="text-lg font-semibold">{value}</div>
      </div>
      <div className="p-2 rounded-lg border bg-white">
        <Icon fontSize="small" />
      </div>
    </div>
  );
}

function PulseRow({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: any;
  label: string;
  value: string;
  tone?: "amber" | "rose";
}) {
  const clr =
    tone === "amber"
      ? "text-amber-700"
      : tone === "rose"
      ? "text-rose-700"
      : "text-zinc-900";
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg border bg-white ${clr}`}>
          <Icon fontSize="small" />
        </div>
        <div className="text-sm text-zinc-600">{label}</div>
      </div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

// ------------------ Inline Material‑style Icons (no external imports) ------------------
type IconProps = {
  fontSize?: "inherit" | "small" | "medium" | "large";
  className?: string;
};
function _size(fontSize: IconProps["fontSize"]) {
  return fontSize === "large"
    ? 28
    : fontSize === "medium"
    ? 24
    : fontSize === "inherit"
    ? 24
    : 20;
}
function SvgIcon({
  fontSize = "small",
  className,
  children,
}: React.PropsWithChildren<IconProps>) {
  const s = _size(fontSize);
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}
export function SearchIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.3-4.3" />
    </SvgIcon>
  );
}
export function TuneIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M4 6h16" />
      <path d="M10 6v4" />
      <path d="M4 14h16" />
      <path d="M14 14v4" />
    </SvgIcon>
  );
}
export function DownloadIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M12 3v12" />
      <path d="M8 11l4 4 4-4" />
      <path d="M4 21h16" />
    </SvgIcon>
  );
}
export function NotificationsActiveIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </SvgIcon>
  );
}
export function DirectionsCarIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <rect x="3" y="10" width="18" height="6" rx="2" />
      <path d="M6 16v2M18 16v2" />
      <circle cx="7" cy="18" r="1" fill="currentColor" stroke="none" />
      <circle cx="17" cy="18" r="1" fill="currentColor" stroke="none" />
    </SvgIcon>
  );
}
export function AccessTimeIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6l4 2" />
    </SvgIcon>
  );
}
export function WarningAmberIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M12 3l9 16H3l9-16z" />
      <path d="M12 9v5" />
      <circle cx="12" cy="17" r="1" fill="currentColor" stroke="none" />
    </SvgIcon>
  );
}
export function TroubleshootIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <circle cx="10" cy="10" r="6" />
      <path d="M14.8 14.8L20 20" />
    </SvgIcon>
  );
}
export function CurrencyRupeeIcon(props: IconProps) {
  const s = _size(props.fontSize);
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      className={props.className}
      aria-hidden="true"
    >
      <text x="5" y="18" fontSize="16" fill="currentColor">
        ₹
      </text>
    </svg>
  );
}
export function TrendingUpIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M3 17l6-6 4 4 8-8" />
    </SvgIcon>
  );
}
export function AutorenewIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M7 7h5v5" />
      <path d="M17 17h-5v-5" />
      <path d="M7 7a8 8 0 0110 10" />
      <path d="M17 17A8 8 0 017 7" />
    </SvgIcon>
  );
}
export function SignalCellularAltIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <rect x="4" y="14" width="3" height="6" />
      <rect x="10" y="10" width="3" height="10" />
      <rect x="16" y="6" width="3" height="14" />
    </SvgIcon>
  );
}
export function CheckCircleIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12l3 3 5-6" />
    </SvgIcon>
  );
}
export function PaymentsIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <rect x="3" y="7" width="18" height="12" rx="2" />
      <path d="M3 11h18" />
    </SvgIcon>
  );
}
export function PersonIcon(props: IconProps) {
  return (
    <SvgIcon {...props}>
      <circle cx="12" cy="8" r="3" />
      <path d="M5 20a7 7 0 0114 0" />
    </SvgIcon>
  );
}
