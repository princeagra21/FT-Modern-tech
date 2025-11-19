"use client";
import React, { useMemo, useState } from "react";
import { ExpandMore as ChevronDown, ChevronRight } from "@mui/icons-material";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import StatusBadge from "@/components/common/StatusBadge";
import { DEVICES, formatDate, formatINR, PLANS } from "@/lib/data/admin";
import BillingHeader from "@/components/admin/billing/BillingHeader";
import RenewSheet from "@/components/admin/billing/RenewSheet";
import ExtendDialog from "@/components/admin/billing/ExtendDialog";
import SuspendDialog from "@/components/admin/billing/SuspendDialog";
import CollectSheet from "@/components/admin/billing/CollectSheet";
import ReminderSheet from "@/components/admin/billing/ReminderSheet";
import RowActionMenu from "@/components/admin/billing/RowActionMenu";
import BillingControls from "@/components/admin/billing/BillingControls";
import { BillingDevicesTable } from "@/components/admin/billing/BillingDevicesTable";
import { BillingCustomersTable } from "@/components/admin/billing/BillingCustomersTable";

export default function RenewalsBillingAdmin() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [onlyAutoRenew, setOnlyAutoRenew] = useState(false);
  const [selected, setSelected] = useState<string[]>([]); // device IDs
  const [view, setView] = useState<"customers" | "devices">("customers");
  const [renewOpen, setRenewOpen] = useState(false);
  const [extendOpen, setExtendOpen] = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [collectOpen, setCollectOpen] = useState(false);
  const [reminderOpen, setReminderOpen] = useState(false);

  const [activeRow, setActiveRow] = useState<any>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({}); // by customer

  // Filtered devices
  const filteredDevices = useMemo(() => {
    return DEVICES.filter((m) => {
      const q = query.trim().toLowerCase();
      const matchesQuery = q
        ? [m.customer, m.vehicle, m.imei, m.planName].some((x) =>
            x.toLowerCase().includes(q)
          )
        : true;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && m.status === "ACTIVE") ||
        (statusFilter === "expiring" && m.status === "EXPIRING") ||
        (statusFilter === "overdue" && m.status === "OVERDUE") ||
        (statusFilter === "suspended" && m.status === "SUSPENDED");
      const matchesPlan = planFilter === "all" || m.planId === planFilter;
      const matchesChannel =
        channelFilter === "all" || m.channel.toLowerCase() === channelFilter;
      const matchesAuto = !onlyAutoRenew || m.autoRenew;
      return (
        matchesQuery &&
        matchesStatus &&
        matchesPlan &&
        matchesChannel &&
        matchesAuto
      );
    });
  }, [query, statusFilter, planFilter, channelFilter, onlyAutoRenew]);

  // Group by customer
  const groups = useMemo(() => {
    const map: Record<string, any[]> = {};
    for (const d of filteredDevices) {
      if (!map[d.customer]) map[d.customer] = [];
      map[d.customer].push(d);
    }
    return map;
  }, [filteredDevices]);

  const counts = useMemo(() => {
    return {
      all: DEVICES.length,
      active: DEVICES.filter((d) => d.status === "ACTIVE").length,
      expiring: DEVICES.filter((d) => d.status === "EXPIRING").length,
      overdue: DEVICES.filter((d) => d.status === "OVERDUE").length,
      suspended: DEVICES.filter((d) => d.status === "SUSPENDED").length,
    };
  }, []);

  // Metrics

  // Selection helpers
  const toggleAllVisible = (checked: boolean) => {
    const ids = filteredDevices.map((d) => d.id);
    setSelected(checked ? ids : []);
  };
  const toggleOne = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const toggleGroup = (customer: string, checked: boolean) => {
    const ids = (groups[customer] || []).map((d) => d.id);
    setSelected((prev) => {
      if (checked) {
        const merged = new Set([...prev, ...ids]);
        return Array.from(merged);
      } else {
        return prev.filter((id) => !ids.includes(id));
      }
    });
  };

  return (
    <div className="min-h-screen ">
      {/* Header */}

      <BillingHeader />
      {/* Controls */}
      <div className="mx-auto max-w-7xl px-4 pt-4">
        <BillingControls
          view={view}
          setView={setView}
          query={query}
          setQuery={setQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          planFilter={planFilter}
          setPlanFilter={setPlanFilter}
          channelFilter={channelFilter}
          setChannelFilter={setChannelFilter}
          onlyAutoRenew={onlyAutoRenew}
          setOnlyAutoRenew={setOnlyAutoRenew}
          selected={selected}
          counts={counts}
          setSelected={setSelected}
          setExpanded={setExpanded}
          groups={groups}
          setExtendOpen={setExtendOpen}
          setRenewOpen={setRenewOpen}
          setSuspendOpen={setSuspendOpen}
          setReminderOpen={setReminderOpen}
        />
        {/* View switch */}
        {view === "devices" ? (
          <BillingDevicesTable
            devices={filteredDevices}
            onAction={(action, rows) => {
              setActiveRow(rows[0]);
              (
                ({
                  renew: setRenewOpen,
                  extend: setExtendOpen,
                  suspend: setSuspendOpen,
                  collect: setCollectOpen,
                  remind: setReminderOpen,
                }) as any
              )[action](true);
            }}
          />
        ) : (
          <BillingCustomersTable
            groups={groups}
            expanded={expanded}
            setExpanded={setExpanded}
            selected={selected}
            setSelected={setSelected}
            onAction={(action, rows) => {
              setActiveRow(rows[0]);
              (
                ({
                  renew: setRenewOpen,
                  extend: setExtendOpen,
                  suspend: setSuspendOpen,
                  collect: setCollectOpen,
                  remind: setReminderOpen,
                }) as any
              )[action](true);
            }}
          />
        )}
      </div>

      {/* Action Surfaces */}
      <RenewSheet
        open={renewOpen}
        onOpenChange={setRenewOpen}
        selection={resolveSelection(selected, activeRow)}
      />
      <ExtendDialog
        open={extendOpen}
        onOpenChange={setExtendOpen}
        selection={resolveSelection(selected, activeRow)}
      />
      <SuspendDialog
        open={suspendOpen}
        onOpenChange={setSuspendOpen}
        selection={resolveSelection(selected, activeRow)}
      />
      <CollectSheet
        open={collectOpen}
        onOpenChange={setCollectOpen}
        selection={resolveSelection(selected, activeRow)}
      />
      <ReminderSheet
        open={reminderOpen}
        onOpenChange={setReminderOpen}
        selection={resolveSelection(selected, activeRow)}
      />

      <footer className="mx-auto max-w-7xl px-4 py-12 typo-subtitle">
        FleetStack • Renewals & Billing UI — v2.1 (Customers → Devices)
      </footer>
    </div>
  );
}

function resolveSelection(selected: string[], activeRow: any) {
  const ids = selected.length > 0 ? selected : activeRow ? [activeRow.id] : [];
  const rows = DEVICES.filter((m) => ids.includes(m.id));
  return { ids, rows };
}
