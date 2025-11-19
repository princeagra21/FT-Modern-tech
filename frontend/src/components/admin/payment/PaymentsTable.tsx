"use client";

import React from "react";
import {
  SmartCheckboxAutoTable,
  DisplayMap,
  MultiSelectOption,
} from "@/components/common/smartcheckboxautotable";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/common/StatusBadge";
import { Payment } from "@/lib/types/admin";
import { formatDate, formatINR } from "@/lib/data/admin";

interface PaymentsTableProps {
  payments: Payment[];
  selected: string[];
  setSelected: (ids: string[]) => void;
  onAction?: (action: string, rows: Payment[]) => void;
}

export function PaymentsTable({
  payments,
  selected,
  setSelected,
  onAction,
}: PaymentsTableProps) {
  const displayOptions: DisplayMap<Payment> = {
    0: {
      title: () => <div className="font-semibold">Date</div>,
      content: (row) => (
        <div>
          <div className="font-medium">{formatDate(row.date)}</div>
          <div className="typo-destructive">{row.plan}</div>
        </div>
      ),
    },
    1: {
      title: () => <div className="font-semibold">Customer</div>,
      content: (row) => row.customer,
    },
    2: {
      title: () => <div className="font-semibold">Device</div>,
      content: (row) => (
        <div>
          <div className="font-medium">{row.vehicle}</div>
          <div className="typo-destructive">IMEI {row.imei}</div>
        </div>
      ),
    },
    3: {
      title: () => <div className="font-semibold">Method</div>,
      content: (row) => (
        <div className="inline-flex items-center gap-2">
          <ChannelBadge channel={row.channel} />
          <span className="text-sm text-zinc-700">{row.method}</span>
        </div>
      ),
    },
    4: {
      title: () => <div className="font-semibold text-right">Amount</div>,
      content: (row) => (
        <div className="text-right">{formatINR(row.amount)}</div>
      ),
    },
    5: {
      title: () => <div className="font-semibold text-right">Tax</div>,
      content: (row) => <div className="text-right">{formatINR(row.tax)}</div>,
    },
    6: {
      title: () => <div className="font-semibold text-right">Total</div>,
      content: (row) => (
        <div className="text-right font-medium">{formatINR(row.total)}</div>
      ),
    },
    7: {
      title: () => <div className="font-semibold">Status</div>,
      content: (row) => <StatusBadge status={row.status} />,
    },
    8: {
      title: () => <div className="font-semibold">Reference / Invoice</div>,
      content: (row) => (
        <div>
          <div className="text-sm">{row.reference}</div>
          <div className="typo-destructive">{row.invoiceNo}</div>
        </div>
      ),
    },
  };

  const multiSelectOptions: MultiSelectOption<Payment>[] = [
    {
      name: "Copy references",
      callback: (rows) => {
        const refs = rows.map((r) => r.reference).join("\n");
        navigator.clipboard.writeText(refs);
      },
      iconName: "content_copy",
      tooltip: "Copy payment reference numbers",
    },
    {
      name: "Resend invoices",
      callback: (rows) => onAction?.("resend_invoice", rows),
      iconName: "send",
      tooltip: "Send invoices again",
    },
  ];

  return (
    <SmartCheckboxAutoTable
      title="Payments"
      data={payments}
      displayOptions={displayOptions}
      multiSelectOptions={multiSelectOptions}
      showtoolbar
      showtoolbarInput
      showtoolbarFilter
      showtoolbarRecords
      showtoolbarExport
      showtoolbarColumn
      showtoolbarRefreshbtn={false}
      showtoolbarFullScreen
    />
  );
}

// Same badge styling
function ChannelBadge({ channel }: { channel: "Online" | "Manual" }) {
  const map: Record<string, string> = {
    Online: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Manual: "bg-zinc-100 text-zinc-700 border-zinc-200",
  };
  return (
    <Badge variant="outline" className={`border ${map[channel]} font-medium`}>
      {channel}
    </Badge>
  );
}
