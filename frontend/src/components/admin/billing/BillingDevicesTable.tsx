"use client";
import React from "react";
import {
  SmartCheckboxAutoTable,
  DisplayMap,
  MultiSelectOption,
} from "@/components/common/smartcheckboxautotable";
import StatusBadge from "@/components/common/StatusBadge";
import { formatDate, formatINR } from "@/lib/data/admin";
import { BillingDeviceRow } from "@/lib/types/admin";

interface BillingDevicesTableProps {
  devices: BillingDeviceRow[];
  onAction: (action: string, rows: BillingDeviceRow[]) => void;
}

export function BillingDevicesTable({ devices, onAction }: BillingDevicesTableProps) {
  const displayOptions: DisplayMap<BillingDeviceRow> = {
    0: {
      title: () => <div className="font-semibold">Customer</div>,
      content: (row) => <div className="font-medium">{row.customer}</div>,
    },
    1: {
      title: () => <div className="font-semibold">Vehicle / IMEI</div>,
      content: (row) => (
        <div>
          <div className="font-medium">{row.vehicle}</div>
          <div className="typo-subtitle">IMEI {row.imei}</div>
        </div>
      ),
    },
    2: {
      title: () => <div className="font-semibold">Plan</div>,
      content: (row) => row.planName,
    },
    3: {
      title: () => <div className="font-semibold">Amount</div>,
      content: (row) => <div>{formatINR(row.price)}</div>,
    },
    4: {
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
    5: {
      title: () => <div className="font-semibold">Status</div>,
      content: (row) => <StatusBadge status={row.status} />,
    },
    6: {
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

  return (
    <SmartCheckboxAutoTable
      data={devices}
      title="Billing Devices"
      displayOptions={displayOptions}
      multiSelectOptions={multiSelectOptions}
    />
  );
}
