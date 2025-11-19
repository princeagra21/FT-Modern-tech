import { DEVICES, formatINR } from "@/lib/data/admin";
import React, { useMemo } from "react";
import {
  Search,
  FilterList as Filter,
  ExpandMore as ChevronDown,
  ChevronRight,
  MoreHoriz as MoreHorizontal,
  Schedule as CalendarClock,
  Warning as AlertTriangle,
  CreditCard,
  Receipt,
  Schedule as Clock3,
  CheckCircle as CheckCircle2,
  CurrencyRupee as IndianRupee,
  NotificationsActive as BellRing,
  Send,
  Link as LinkIcon,
  Block as ShieldOff,
  VerifiedUser as BadgeCheck,
  Add as Plus,
  Upload,
  Info,
  People as Users,
  PhoneAndroid as MonitorSmartphone,
} from "@mui/icons-material";
import { Button } from "@/components/ui/button";
import KpiCardBase from "@/components/common/KpiCardBase";

const BillingHeader = () => {
  const metrics = useMemo(() => {
    const paymentsToday = Math.floor(Math.random() * 9);
    const expiring30 = DEVICES.filter((m) => m.status === "EXPIRING").length;
    const overdue = DEVICES.filter((m) => m.status === "OVERDUE").length;
    const mrr = DEVICES.reduce((acc, m) => acc + (m.price || 0), 0);
    return { paymentsToday, expiring30, overdue, mrr };
  }, []);
  const kpis = [
    {
      title: "Payments Today",
      value: `${metrics.paymentsToday}`,
      hint: "Completed renewals",
      icon: CheckCircle2,
    },
    {
      title: "Expiring (<30 days)",
      value: `${metrics.expiring30}`,
      hint: "Act early",
      icon: CalendarClock,
    },
    {
      title: "Overdue",
      value: `${metrics.overdue}`,
      hint: "Suspension risk",
      icon: AlertTriangle,
    },
    {
      title: "MRR (est.)",
      value: metrics.mrr,
      hint: "From active plans",
      icon: IndianRupee,
    },
  ];

  return (
    <div className="z-30 border-b ">
      <div className="mx-auto max-w-7xl px-4 py-4 md:py-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="typo-h1">
              Renewals & Billing
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Per‑device plans & renewals under each customer.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <Upload sx={{ fontSize: 16 }} /> Import CSV
            </Button>
            <Button className="gap-2">
              <Plus sx={{ fontSize: 16 }} /> New Manual Renewal
            </Button>
          </div>
        </div>
        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          {kpis.map((kpi, i) => (
            <KpiCardBase
              key={i}
              title={kpi.title}
              value={Number(kpi.value)}
              subTitle={kpi.hint}
              Icon={kpi.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BillingHeader;
