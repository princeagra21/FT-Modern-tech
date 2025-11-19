"use client";
import React from "react";
import {
  SmartCheckboxAutoTable,
  DisplayMap,
  MultiSelectOption,
} from "@/components/common/smartcheckboxautotable";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronRight, ExpandMore } from "@mui/icons-material";
import StatusBadge from "@/components/common/StatusBadge";
import { formatDate, formatINR } from "@/lib/data/admin";
import { BillingDeviceRow } from "@/lib/types/admin";

interface BillingCustomersTableProps {
  groups: Record<string, BillingDeviceRow[]>;
  expanded: Record<string, boolean>;
  setExpanded: (next: Record<string, boolean>) => void;
  selected: string[];
  setSelected: (ids: string[]) => void;
  onAction: (action: string, rows: BillingDeviceRow[]) => void;
}

export function BillingCustomersTable({
  groups,
  expanded,
  setExpanded,
  selected,
  setSelected,
  onAction,
}: BillingCustomersTableProps) {
  const customers = Object.keys(groups);

  const displayOptions: DisplayMap<BillingDeviceRow> = {
    0: {
      title: () => <div className="font-semibold">Device (Vehicle / IMEI)</div>,
      content: (row) => (
        <div>
          <div className="font-medium">{row.vehicle}</div>
          <div className="typo-subtitle">IMEI {row.imei}</div>
        </div>
      ),
    },
    1: {
      title: () => <div className="font-semibold">Plan</div>,
      content: (row) => row.planName,
    },
    2: {
      title: () => <div className="font-semibold">Amount</div>,
      content: (row) => <div>{formatINR(row.price)}</div>,
    },
    3: {
      title: () => <div className="font-semibold">Expiry</div>,
      content: (row) => (
        <div>
          <div>{formatDate(row.expiryAt)}</div>
          <div className="typo-subtitle">
            {row.daysLeft < 0
              ? `${Math.abs(row.daysLeft)} days overdue`
              : `${row.daysLeft} days left`}
          </div>
        </div>
      ),
    },
    4: {
      title: () => <div className="font-semibold">Status</div>,
      content: (row) => <StatusBadge status={row.status} />,
    },
    5: {
      title: () => <div className="font-semibold">Auto</div>,
      content: (row) => (
        <span className="text-sm text-gray-500">{row.autoRenew ? "Yes" : "No"}</span>
      ),
    },
  };

  const multiSelectOptions: MultiSelectOption<BillingDeviceRow>[] = [
    { name: "Renew", callback: (rows) => onAction("renew", rows), iconName: "loop" },
    { name: "Extend", callback: (rows) => onAction("extend", rows), iconName: "schedule" },
    { name: "Suspend", callback: (rows) => onAction("suspend", rows), iconName: "block" },
    { name: "Collect Payment", callback: (rows) => onAction("collect", rows), iconName: "payments" },
    { name: "Send Reminder", callback: (rows) => onAction("remind", rows), iconName: "notifications" },
  ];

  if (customers.length === 0) {
    return (
      <Card className="border-zinc-200">
        <CardContent className="p-10 text-center ">
          No results. Adjust filters or search.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      {customers.map((customer) => {
        const devices = groups[customer];
        const isExpanded = expanded[customer] ?? false;

        const ids = devices.map((d) => d.id);
        const checked = ids.every((id) => selected.includes(id));
        const partial = !checked && ids.some((id) => selected.includes(id));

        const stats = {
          total: devices.length,
          expiring: devices.filter((d) => d.status === "EXPIRING").length,
          overdue: devices.filter((d) => d.status === "OVERDUE").length,
          suspended: devices.filter((d) => d.status === "SUSPENDED").length,
          amount: devices.reduce((a, d) => a + d.price, 0),
        };

        return (
          <Card key={customer} className=" overflow-hidden">
            {/* Group Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-foreground/5">
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    setExpanded({ ...expanded, [customer]: !isExpanded })
                  }
                  className="rounded-lg border bg-foreground/5 p-1"
                >
                  {isExpanded ? (
                    <ExpandMore sx={{ fontSize: 16 }} />
                  ) : (
                    <ChevronRight sx={{ fontSize: 16 }} />
                  )}
                </button>
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    {customer}
                    <Badge
                      variant="secondary"
                      className="bg-foreground/10 border"
                    >
                      {stats.total} devices
                    </Badge>
                  </div>
                  <div className="text-xs ">
                    {stats.expiring} expiring • {stats.overdue} overdue •{" "}
                    {stats.suspended} suspended
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-sm  font-medium hidden md:block">
                  {formatINR(stats.amount)}
                </div>
                <Checkbox
                  checked={checked}
                  onCheckedChange={(c) => {
                    setSelected(
                      c ? Array.from(new Set([...selected, ...ids])) : selected.filter((x) => !ids.includes(x))
                    );
                  }}
                  className={partial ? "data-[state=indeterminate]:opacity-100" : ""}
                />
              </div>
            </div>

            {/* Group Body */}
            {isExpanded && (
              <div className="p-0">
                <SmartCheckboxAutoTable
                  data={devices}
                  displayOptions={displayOptions}
                  multiSelectOptions={multiSelectOptions}
                />
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
