"use client";

import React, { useEffect, useMemo, useState } from "react";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import SubscriptionBanner from "@/components/superadmin/dashboard/SubscriptionBanner";
import KpiStats from "@/components/superadmin/dashboard/KpiStats";
import AdoptionAndVehicleSection from "@/components/superadmin/dashboard/AdoptionAndVehicleSection";
import RecentActivities from "@/components/superadmin/dashboard/RecentActivities";
import NotificationsAndActivitySection from "@/components/superadmin/dashboard/NotificationsAndActivitySection";
import AddUserDialog from "@/components/admin/AddUserDialog";
import { Button } from "@/components/ui/button";
import { Payments, Send } from "@mui/icons-material";


export default function FleetStackDashboard() {
  // State
  const [isDarkMode, setIsDarkMode] = useState(false);
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
       const [notifyOpen, setNotifyOpen] = useState(false);

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
        {/* <SubscriptionBanner /> */}

        {/* Top Bar */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-sm text-neutral-500">Self‑hosted GPS Software • FleetStack</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setNotifyOpen(true)}>
              <Send className="h-4 w-4" /> Notify Users
            </Button>
            <Button>
              <Payments className="h-4 w-4" /> (7) Buy Credits
            </Button>
          </div>
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
