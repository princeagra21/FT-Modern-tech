"use client";
import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  UserIdentityCard,
  NavigationMenu,
  type NavItem,
  type UserIdentity,
} from "@/components/common/sidenav";

// Material Design Icons (MUI) - only used icons
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import DirectionsCarFilledRoundedIcon from "@mui/icons-material/DirectionsCarFilledRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AdminProfileContent from "@/components/superadmin/adminprofilecontent";
import CreditHistoryPage from "@/components/superadmin/credithistorypage";
import AdminDocuments from "@/components/superadmin/admindocuments";
import AdminDocumentsPage from "@/components/superadmin/admindocuments";
import AdminSettingPage from "@/components/superadmin/adminsettings";
import AdminVehiclesList from "@/components/superadmin/adminvehicleslist";

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
  createdAt: string; // ISO format
  updatedAt: string; // ISO format
  lastLogin: string; // ISO format
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
// Single User Data
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
// Navigation Configuration & Content Components
// ——————————————————————————————————————————
const navItems: NavItem[] = [
  { key: "profile", label: "Profile", icon: PersonOutlineRoundedIcon },
  {
    key: "credithistory",
    label: "Credit History",
    icon: PersonOutlineRoundedIcon,
  },
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

function RoleContent() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">
          Role Management
        </h2>
        <p className="text-neutral-600">Manage user roles and permissions.</p>
      </div>
      <div className="text-center py-12 text-neutral-500">
        <SecurityRoundedIcon fontSize="large" />
        <p className="mt-2">Role management coming soon...</p>
      </div>
    </div>
  );
}

function DeleteAccountContent() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-2 text-red-600">
          Delete Account
        </h2>
        <p className="text-neutral-600">
          Permanently delete this user account and all associated data.
        </p>
      </div>
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <DeleteRoundedIcon className="text-red-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-800 mb-2">Danger Zone</h3>
            <p className="text-red-700 text-sm mb-4">
              This action cannot be undone. This will permanently delete the
              user account and remove all associated data.
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

// Content renderer based on active navigation
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
      return <> </>;
  }
}

export default function SingleUser({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [activeNavKey, setActiveNavKey] = React.useState("profile");

  // Unwrap params Promise using React.use()
  const resolvedParams = React.use(params);
  const userId = resolvedParams.id;

  // Prepare user identity for SideNav
  const userIdentity: UserIdentity = {
    name: user.name,
    username: user.username,
    profileUrl: user.profileUrl,
    isEmailVerified: user.isEmailVerified,
  };

  // Handle navigation change
  const handleNavChange = (key: string) => {
    setActiveNavKey(key);
  };

  return (
    <TooltipProvider>
      <div className="min-h-[100vh] w-full">
        {/* Main 3/7 layout */}
        <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-10 gap-6 items-start">
            {/* LEFT: 3 — Separate User Identity and Navigation */}
            <aside className="md:col-span-3">
              <div className="sticky top-[68px] space-y-6">
                <UserIdentityCard user={userIdentity} />
                <NavigationMenu
                  navItems={navItems}
                  activeKey={activeNavKey}
                  onNavChange={handleNavChange}
                />
              </div>
            </aside>

            {/* RIGHT: 7 — Dynamic content based on navigation */}
            <section className="md:col-span-7">
              <Card className="rounded-3xl border-neutral-200 shadow-sm min-h-[600px]">
                {renderContent(activeNavKey, userId)}
              </Card>
            </section>
          </div>
        </div>

        {/* Bottom spacer */}
        <div className="h-8" />
      </div>
    </TooltipProvider>
  );
}
