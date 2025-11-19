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
  route: string;
  items?: { name: string; icon: IconName; route?: string }[];
}[] = [
  { label: "Dashboard", icon: "layout-dashboard", route: "/superadmin/dashboard" },
  { label: "Administrators", icon: "admin-panel", route: "/superadmin/administrators" },
  { label: "Vehicles", icon: "truck", route: "/superadmin/vehicles" },
  { label: "Map", icon: "map", route: "/superadmin/map" },
  { label: "Calendar", icon: "calendar", route: "/superadmin/calendar" },
  { label: "Server", icon: "server", route: "/superadmin/server" },
  {
    label: "Other",
    icon: "more",
    route: "/superadmin/other",
    items: [
      { name: "Support", icon: "headset", route: "/superadmin/support" },
      { name: "Roles", icon: "shield", route: "/superadmin/roles" },
      { name: "SSL", icon: "lock", route: "/superadmin/ssl" },
    ],
  },
  { label: "Settings", icon: "settings", route: "/superadmin/settings" },
];

export default function Layout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobilePanelRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    setIsHydrated(true);
    const userData = getStoredUser(STORAGE_KEYS.SUPER_ADMIN);
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

  if (!isHydrated) {
    return <HeaderWithoutInfo />;
  }

  return (
    <>
      <header className="sticky top-0 z-[100] border-b border-border bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <TopHeader mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} role="SUPER_ADMIN" />

        <nav className="relative hidden border-t border-border bg-background shadow-lg md:block">
          <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2 text-sm font-medium text-foreground">
            {navData.map((nav) => (
              <DesktopNavItem key={nav.label} label={nav.label} icon={nav.icon} route={nav.route} items={nav.items} />
            ))}
          </div>
        </nav>

        <div
          ref={mobilePanelRef}
          className={`md:hidden ${
            mobileOpen ? "max-h-screen opacity-100 visible" : "max-h-0 opacity-0 invisible"
          } overflow-y-auto border-t border-border bg-background/95 backdrop-blur transition-all duration-300 ease-out`}
        >
          <div className="px-3 py-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-4 h-4 w-4 -translate-y-1/2 text-muted" />
              <Input
                placeholder="Search orders, customers, devices…"
                className="h-9 w-full rounded-xl border-input bg-background pl-9 pr-10 text-sm shadow-sm placeholder:text-muted focus-visible:ring-4 focus-visible:ring-primary/60"
              />
            </div>

            <ul className="mt-3 divide-y divide-border rounded-xl border border-border bg-background">
              {navData.map((nav) => (
                <MobileAccordion key={nav.label} label={nav.label} icon={nav.icon} route={nav.route} items={nav.items} />
              ))}
            </ul>
          </div>
        </div>
      </header>

      <div className="p-5 min-h-[calc(100vh-170px)]">
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
