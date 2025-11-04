"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  UserIdentityCard,
  NavigationMenu,
  type NavItem,
  type UserIdentity,
} from "@/components/common/sidenav";

// Material Design Icons
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import AdminProfileContent from "@/components/superadmin/adminprofilecontent";
import CreditHistoryPage from "@/components/superadmin/credithistorypage";
import AdminDocumentsPage from "@/components/superadmin/admindocuments";
import AdminSettingPage from "@/components/superadmin/adminsettings";
import AdminVehiclesList from "@/components/superadmin/adminvehicleslist";
import RoleContent from "@/components/superadmin/administrators/roles/RolePreview";

// ——————————————————————————————————————————
// User Type Definition
// ——————————————————————————————————————————
export type User = {
  id: string;
  profileUrl: string;
  name: string;
  mobilePrefix: string;
  mobileNumber: string;
  email: string;
  isEmailVerified: boolean;
  username: string;
  address: {
    line1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    countryCode: string;
  };
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
  status: "active" | "inactive";
  vehiclesCount: number;
  credits: number;
  company: {
    name: string;
    logolight?: string;
    logodark?: string;
    website?: string;
    socials?: Record<string, string>;
  };
};

// ——————————————————————————————————————————
// Mock Single User Data
// ——————————————————————————————————————————
const user: User = {
  id: "234",
  profileUrl: "/uploads/users/u001.png",
  name: "Aarav Sharma",
  mobilePrefix: "+91",
  mobileNumber: "8987675654",
  email: "aarav.sharma@fleetstackglobal.com",
  isEmailVerified: true,
  username: "aarav.sharma",
  address: {
    line1: "42, Indus Tech Park",
    city: "Bengaluru",
    state: "Karnataka",
    postalCode: "560001",
    country: "India",
    countryCode: "IN",
  },
  createdAt: "2025-09-12T08:30:00Z",
  updatedAt: "2025-09-12T08:30:00Z",
  lastLogin: "2025-10-15T15:05:00Z",
  status: "active",
  vehiclesCount: 512,
  credits: 12000,
  company: {
    name: "Fleet Stack Global Pvt. Ltd.",
    logolight: "/brand/fleetstack-logo-light.svg",
    logodark: "/brand/fleetstack-logo-dark.svg",
    website: "https://fleetstackglobal.com",
    socials: {
      linkedin: "https://www.linkedin.com/company/fleetstackglobal",
      twitter: "https://twitter.com/fleetstack",
      facebook: "https://facebook.com/fleetstackglobal",
      youtube: "https://youtube.com/@fleetstack",
      github: "https://github.com/fleetstack",
      instagram: "https://instagram.com/fleetstack",
    },
  },
};

// ——————————————————————————————————————————
// Navigation Configuration
// ——————————————————————————————————————————
const navItems: NavItem[] = [
  { key: "profile", label: "Profile", icon: PersonOutlineRoundedIcon },
  { key: "credithistory", label: "Credit History", icon: PersonOutlineRoundedIcon },
  { key: "documents", label: "Documents", icon: DescriptionRoundedIcon },
  { key: "vehicles", label: "Vehicles", icon: DirectionsCarFilledRoundedIcon },
  { key: "settings", label: "Settings", icon: SettingsRoundedIcon },
  { key: "role", label: "Role", icon: SecurityRoundedIcon },
  {
    key: "delete",
    label: "Delete Account",
    icon: DeleteRoundedIcon,
    danger: true,
  },
];

// ——————————————————————————————————————————
// Content Components
// ——————————————————————————————————————————

function DeleteAccountContent() {
  return (
    <div className="p-8 space-y-6 bg-background text-foreground">
      <div>
        <h2 className="text-2xl font-semibold mb-2 text-destructive">Delete Account</h2>
        <p className="text-muted">
          Permanently delete this user account and all associated data.
        </p>
      </div>

      <div className="border border-destructive/20 rounded-xl p-6 dark:bg-foreground/5">
        <div className="flex items-start gap-4">
          <DeleteRoundedIcon className="text-destructive mt-0.5" />
          <div>
            <h3 className="font-medium text-destructive mb-2">Danger Zone</h3>
            <p className="text-sm text-destructive/90 mb-4">
              This action cannot be undone. It will permanently delete the user account and remove
              all associated data.
            </p>
            <Button variant="destructive" size="sm">
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}



// ——————————————————————————————————————————
// Content Renderer
// ——————————————————————————————————————————
function renderContent(activeKey: string, userId: string) {
  switch (activeKey) {
    case "profile":
      return <AdminProfileContent adminId={userId} />;
    case "credithistory":
      return <CreditHistoryPage />;
    case "documents":
      return <AdminDocumentsPage />;
    case "vehicles":
      return <AdminVehiclesList />;
    case "settings":
      return <AdminSettingPage />;
    case "role":
      return <RoleContent />;
    case "delete":
      return <DeleteAccountContent />;
    default:
      return null;
  }
}

// ——————————————————————————————————————————
// Main Component
// ——————————————————————————————————————————
export default function SingleUser({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [activeNavKey, setActiveNavKey] = React.useState("profile");
  const resolvedParams = React.use(params);
  const userId = resolvedParams.id;

  const userIdentity: UserIdentity = {
    name: user.name,
    username: user.username,
    profileUrl: user.profileUrl,
    isEmailVerified: user.isEmailVerified,
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-10 gap-8 items-start">
            {/* LEFT SIDEBAR */}
            <aside className="md:col-span-3">
              <div className="sticky top-[72px] space-y-6">
                <UserIdentityCard user={userIdentity} />
                <NavigationMenu
                  navItems={navItems}
                  activeKey={activeNavKey}
                  onNavChange={setActiveNavKey}
                />
              </div>
            </aside>

            {/* MAIN CONTENT */}
            <section className="md:col-span-7">
              <Card className="rounded-3xl border border-border bg-card shadow-sm min-h-[600px] overflow-hidden">
                {renderContent(activeNavKey, userId)}
              </Card>
            </section>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
