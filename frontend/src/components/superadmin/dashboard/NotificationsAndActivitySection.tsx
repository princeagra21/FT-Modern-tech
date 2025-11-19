import React from "react";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";

const NotificationsAndActivitySection = () => {
  const notifications = [
    { title: "Device offline > 24h", detail: "7 vehicles require attention", time: "10m ago" },
    { title: "New admin invited", detail: "sophia.d@example.com", time: "1h ago" },
    { title: "License quota nearing", detail: "85% of pool consumed", time: "3h ago" },
    { title: "Report generated", detail: "October Utilization PDF", time: "Yesterday" },
    { title: "System maintenance", detail: "Scheduled for Oct 20", time: "2 days ago" },
    { title: "New feature released", detail: "Advanced analytics available", time: "3 days ago" },
  ];

  const activities = [
    { who: "Aarav S.", what: "created geofence 'Warehouse-7'", when: "08:12" },
    { who: "Maya R.", what: "added 12 vehicles via CSV", when: "09:45" },
    { who: "Ibrahim K.", what: "updated driver profile #D-1183", when: "10:03" },
    { who: "Sophia D.", what: "scheduled daily idle report", when: "11:29" },
    { who: "Ethan P.", what: "exported monthly analytics", when: "12:15" },
    { who: "Liam C.", what: "configured new alert rule", when: "13:40" },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Recent Notifications */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <NotificationsNoneOutlinedIcon className="h-5 w-5 text-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Recent Notifications</h3>
        </div>
        <div className="h-80 overflow-y-auto pr-1">
          <ul className="divide-y divide-border">
            {notifications.map((n, idx) => (
              <li key={idx} className="flex items-center justify-between py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{n.title}</p>
                  <p className="truncate typo-subtitle">{n.detail}</p>
                </div>
                <span className="shrink-0 typo-subtitle">{n.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recent User Activity */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <TimelineOutlinedIcon className="h-5 w-5 text-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Recent User Activity</h3>
        </div>
        <div className="h-80 overflow-y-auto pr-1">
          <ul className="divide-y divide-border">
            {activities.map((a, idx) => (
              <li key={idx} className="flex items-center justify-between py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{a.who}</p>
                  <p className="truncate typo-subtitle">{a.what}</p>
                </div>
                <span className="shrink-0 typo-subtitle">{a.when}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default NotificationsAndActivitySection;
