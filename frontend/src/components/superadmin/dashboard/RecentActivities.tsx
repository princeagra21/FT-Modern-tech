import React from "react";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Link from "next/link";
import StatusBadge from "@/components/common/StatusBadge";

const RecentActivities = () => {
  const recentVehicles = [
    { name: "MH-12-AB-1234", model: "Tata Ace", status: "Active", added: "Today, 10:15" },
    { name: "DL-08-CD-5678", model: "Mahindra Bolero", status: "Active", added: "Today, 09:30" },
    { name: "KA-01-EF-9012", model: "Ashok Leyland", status: "Inactive", added: "Yesterday, 16:45" },
    { name: "TN-22-GH-3456", model: "Eicher Pro", status: "Active", added: "Yesterday, 14:20" },
    { name: "GJ-18-IJ-7890", model: "Tata 407", status: "Active", added: "Oct 16, 11:00" },
    { name: "RJ-14-KL-2345", model: "Force Traveller", status: "Not Working", added: "Oct 15, 13:30" },
    { name: "UP-32-MN-6789", model: "Mahindra Pickup", status: "Active", added: "Oct 14, 15:10" },
  ];

  const recentTransactions = [
    { id: "TXN-2024-10-1234", admin: "Aarav Sharma", type: "License Purchase", amount: 15000, status: "Completed", date: "Today, 11:30" },
    { id: "TXN-2024-10-1233", admin: "Maya Rao", type: "Subscription Renewal", amount: 25000, status: "Completed", date: "Today, 09:15" },
    { id: "TXN-2024-10-1232", admin: "Ibrahim Khan", type: "License Purchase", amount: 8500, status: "Pending", date: "Yesterday, 18:20" },
    { id: "TXN-2024-10-1231", admin: "Sophia Das", type: "Add-on Features", amount: 5000, status: "Completed", date: "Yesterday, 15:45" },
    { id: "TXN-2024-10-1230", admin: "Ethan Patel", type: "License Purchase", amount: 12000, status: "Completed", date: "Oct 16, 14:30" },
    { id: "TXN-2024-10-1229", admin: "Liam Chen", type: "Subscription Renewal", amount: 30000, status: "Failed", date: "Oct 16, 10:00" },
    { id: "TXN-2024-10-1228", admin: "Olivia Kumar", type: "License Purchase", amount: 18000, status: "Completed", date: "Oct 15, 16:50" },
  ];

  const recentUsers = [
    { name: "Aarav Sharma", email: "aarav.s@example.com", time: "Today, 15:22" },
    { name: "Maya Rao", email: "maya.rao@example.com", time: "Today, 14:10" },
    { name: "Ibrahim Khan", email: "ibrahim.k@example.com", time: "Yesterday, 20:06" },
    { name: "Sophia Das", email: "sophia.d@example.com", time: "Yesterday, 18:41" },
    { name: "Ethan Patel", email: "ethan.p@example.com", time: "Oct 14, 09:33" },
    { name: "Liam Chen", email: "liam.c@example.com", time: "Oct 13, 16:20" },
    { name: "Olivia Kumar", email: "olivia.k@example.com", time: "Oct 12, 11:45" },
  ];

  return (
    <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* Recent Vehicles */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DirectionsCarOutlinedIcon className="h-5 w-5 text-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Recent Vehicles</h3>
          </div>
        </div>
        <div className="h-80 overflow-y-auto pr-1">
          <ul className="divide-y divide-border">
            {recentVehicles.map((v, idx) => (
              <li key={idx} className="flex items-center justify-between py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background">
                    <DirectionsCarOutlinedIcon className="h-4 w-4 text-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{v.name}</p>
                    <p className="truncate text-xs text-muted">{v.model}</p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <StatusBadge status={v.status} />
                  <p className="mt-1 text-xs text-muted">{v.added}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ReceiptLongOutlinedIcon className="h-5 w-5 text-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Recent Transactions</h3>
          </div>
          <button className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted hover:bg-foreground/5">
            <Link href="transactions">View All</Link>
            <ArrowForwardIcon className="h-3 w-3" />
          </button>
        </div>
        <div className="h-80 overflow-y-auto pr-1">
          <ul className="divide-y divide-border">
            {recentTransactions.map((t, idx) => (
              <li key={idx} className="py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{t.id}</p>
                    <p className="truncate text-xs text-muted">
                      {t.admin} • {t.type}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-foreground">
                      ₹{Intl.NumberFormat().format(t.amount)}
                    </p>
                     <StatusBadge status={t.status} />
                  </div>
                </div>
                <p className="mt-1 text-xs text-muted">{t.date}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recent Users */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <PersonAddAltOutlinedIcon className="h-5 w-5 text-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Recent Users</h3>
        </div>
        <div className="h-80 overflow-y-auto pr-1">
          <ul className="divide-y divide-border">
            {recentUsers.map((u, idx) => (
              <li key={idx} className="flex items-center justify-between py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-xs font-medium text-foreground">
                    {u.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{u.name}</p>
                    <p className="truncate text-xs text-muted">{u.email}</p>
                  </div>
                </div>
                <span className="shrink-0 text-xs text-muted">{u.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default RecentActivities;
