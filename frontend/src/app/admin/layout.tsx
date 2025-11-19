'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Notifications, Language, DarkMode, Search, Settings, LightMode, Person, Menu, Close, KeyboardArrowDown } from "@mui/icons-material";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


import { useRouter } from 'next/navigation';
import DesktopNavItem from '@/components/common/desktopnavitem';
import MobileAccordion from '@/components/common/mobileaccordion';
import HeaderWithoutInfo from '@/components/common/headerwithoutinfo';
import TopHeader from '@/components/common/topheader';
import { getStoredUser } from '@/services/common/storage';
import { STORAGE_KEYS } from '@/services/common/constants';
import type { IconName } from '@/lib/iconResolver';





const navData: {
  label: string;
  icon: IconName;
  route?: string;
  items?: { name: string; icon: IconName; route?: string }[];
}[] = [
    {
      label: "Dashboard",
      icon: "layout-dashboard",
      route: "/admin/dashboard"
    },
    {
      label: "Accounts",
      icon: "settings",
      route: "",
      items: [
        {
          name: "Users",
          icon: "support",
          route: "/admin/users"
        },
        {
          name: "Vehicles",
          icon: "calendar",
          route: "/admin/vehicles"
        },
        {
          name: "Drivers",
          icon: "logs",
          route: "/admin/drivers"
        },
        {
          name: "Teams",
          icon: "webhooks",
          route: "/admin/teams"
        }

      ]
    },
    {
      label: "Assets",
      icon: "settings",
      route: "",
      items: [
        {
          name: "Devices",
          icon: "support",
          route: "/admin/devices"
        },
        {
          name: "Sim Cards",
          icon: "calendar",
          route: "/admin/simcards"
        }

      ]
    },
    {
      label: "Map",
      icon: "map",
      route: "/admin/map"
    },
    {
      label: "Finance",
      icon: "settings",
      route: "",
      items: [
        {
          name: "Finance Dashboard",
          icon: "support",
          route: "/admin/finance"
        },
        {
          name: "Renewals & Billing",
          icon: "support",
          route: "/admin/billing"
        },
        {
          name: "Payments",
          icon: "calendar",
          route: "/admin/payments"
        },
                        {
          name: "Transaction History",
          icon: "calendar",
          route: "/admin/transactions"
        }

      ]
    },

    {
      label: "Other",
      icon: "settings",
      route: "",
      items: [
        {
          name: "Support",
          icon: "support",
          route: "/admin/support"
        },
        {
          name: "Calendar",
          icon: "calendar",
          route: "/admin/calendar"
        },
        {
          name: "Logs",
          icon: "logs",
          route: "/admin/logs"
        },
        {
          name: "Roles",
          icon: "webhooks",
          route: "/admin/roles"
        },
        {
          name: "Plans",
          icon: "webhooks",
          route: "/admin/plans"
        }
   

      ]
    },
    {
      label: "Settings",
      icon: "settings",
      route: "/admin/settings"
    },
  ];

export default function Layout({ children }: { children: ReactNode }) {



  const [user, setUser] = useState<any>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobilePanelRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();

  // Handle hydration and user data loading



  // Close mobile panel on outside click

  useEffect(() => {
    setIsHydrated(true);
    const userData = getStoredUser(STORAGE_KEYS.ADMIN);
    setUser(userData);
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!mobilePanelRef.current) return;
      if (mobileOpen && !mobilePanelRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    }
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [mobileOpen]);


  // Prevent hydration mismatch by not rendering user-dependent content until hydrated
  if (!isHydrated) {
    return <HeaderWithoutInfo />;
  }

  return (
    <>
      <header className="sticky top-0 z-[100] border-b border-border bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        {/* Top Bar (mobile-first) */}
        <TopHeader mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} role="ADMIN" />

        {/* Desktop Nav Row */}
        <nav className="relative hidden border-t border-border bg-background shadow-lg md:block">
          <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2 text-sm font-medium text-muted-foreground">
            {navData.map((nav) => (
              <DesktopNavItem key={nav.label} label={nav.label} icon={nav.icon} route={nav.route} items={nav.items} />
            ))}
          </div>
        </nav>

        {/* Mobile Slide-down Panel */}
        <div
          ref={mobilePanelRef}
          className={`md:hidden ${mobileOpen ? "max-h-screen opacity-100 visible" : "max-h-0 opacity-0 invisible"} overflow-y-auto border-t border-border/80 bg-background/95 backdrop-blur transition-all duration-300 ease-out`}
        >
          <div className="px-3 py-2 min-h-[300px]">
            {/* Mobile Search */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search orders, customers, devices…"
                className="h-9 w-full rounded-xl border-input bg-background pl-9 pr-10 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:ring-4 focus-visible:ring-ring/60"
              />
            </div>

            {/* Mobile Nav as Accordions */}
            <ul className="mt-3 divide-y divide-border rounded-xl border border-border bg-background min-h-[200px]">
              {navData.map((nav) => (
                <MobileAccordion key={nav.label} label={nav.label} icon={nav.icon} route={nav.route} items={nav.items} />)
              )}
            </ul>
          </div>
        </div>
      </header>
      <div className='p-5 min-h-[calc(100vh-170px)]'>
        {children}
      </div>
      <footer className="border-t border-border bg-background">
        <div className="py-3 flex justify-center text-center typo-subtitle">
          © {new Date().getFullYear()} Fleet Stack. All rights reserved.
        </div>
      </footer>
    </>
  );
}
