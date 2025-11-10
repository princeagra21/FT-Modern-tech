"use client";

import React, { useEffect, useMemo, useState } from "react";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import SubscriptionBanner from "@/components/superadmin/dashboard/SubscriptionBanner";
import KpiStats from "@/components/superadmin/dashboard/KpiStats";
import AdoptionAndVehicleSection from "@/components/superadmin/dashboard/AdoptionAndVehicleSection";
import RecentActivities from "@/components/superadmin/dashboard/RecentActivities";
import NotificationsAndActivitySection from "@/components/superadmin/dashboard/NotificationsAndActivitySection";
import AddUserDialog from "@/components/admin/AddUserDialog";


const Lastsync =()=>{
   const [secondsSinceSync, setSecondsSinceSync] = useState(0);
     useEffect(() => {
    const id = setInterval(() => setSecondsSinceSync((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
     <div className="flex items-center gap-2 text-xs text-muted">
            <span className="hidden sm:inline">Last sync:</span>
            <span>{secondsSinceSync}s ago</span>
            <button
              className="rounded-lg p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Refresh"
            >
              <RefreshOutlinedIcon fontSize="small" />
            </button>
      </div>
  )
}

export default function FleetStackDashboard() {
  // State
  const [isDarkMode, setIsDarkMode] = useState(false);
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // Detect dark mode changes
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();

    // Watch for theme changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

   const handleAddAdminSave = (data: any) => {
    console.log("New admin added:", data);
  
  };
 


  // Render
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-6 pb-14 pt-8">
        {/* License Banner */}
        <SubscriptionBanner />

        {/* Quick Actions */}
        <div className="mb-6 flex items-end justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button className="rounded-xl border border-border px-3 py-2 text-xs text-muted  hover:bg-neutral-100 " onClick={() => setIsAddUserOpen(true)}>
              + Create User
            </button>
          </div>
          <Lastsync/>
        </div>

        {/* KPI Row */}
        <KpiStats isSuperadmin={false} />

        {/* Chart + Vehicle Status */}
        <AdoptionAndVehicleSection />

        {/* Lists Row (Scrollable) - First Row */}

        <RecentActivities />

        {/* Lists Row (Scrollable) - Second Row */}
        <NotificationsAndActivitySection />
      </div>

      {/* Copy Modal (last resort when clipboard is blocked) */}
          <AddUserDialog
        open={isAddUserOpen}
        onOpenChange={setIsAddUserOpen}
        onSave={handleAddAdminSave}
      />
    </main>
  );
}
