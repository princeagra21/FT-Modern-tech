'use client'
import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserIdentityCard, NavigationMenu, type NavItem, type UserIdentity } from "@/components/common/sidenav";

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
import VehicleDetailsPreview from "@/components/superadmin/vehicledetailscontent";
import VehicleUsersListItem from "@/components/superadmin/vehicleuserslist";
import VehicleSendCommand from "@/components/superadmin/vehiclesendcommand";
import VehicleDocumentsPage from "@/components/superadmin/vehicledocuments";
import VehicleLogsPage from "@/components/superadmin/vehiclelogs";
import VehicleConfig from "@/components/superadmin/vehicleconfig";

type Vehicledatatype = {
  id: string;
  vehicleNo: string;
  imei: string;
  vin: string;
  status: "running" | "idle" | "stop";
  speed: number;
  vehicleType: { name: string };
  deviceType: { name: string };
  lastUpdate: string;
  primaryUser: {
    name: string;
    email: string;
    mobilePrefix: string;
    mobile: string;
    isEmailVerified: boolean;
    profileUrl: string;
    username: string;
  };
  addedBy: {
    name: string;
    email: string;
    mobilePrefix: string;
    mobile: string;
    isEmailVerified: boolean;
    profileUrl: string;
    username: string;
  };
  primaryExpiry: string;
  secondaryExpiry: string;
  createdAt: string;
  ignition: boolean;
  engineHour: number;
  odometer: number;
  gmt: string;
  parking: boolean;
  isActive: boolean;
  vehicleMeta?: { [k: string]: any };
  coords?: { lat: number; lon: number };
  deviceAttributes?: Record<string, any>;
};

const VEHICLE_DATA: Vehicledatatype = {
  id: "v-0001",
  vehicleNo: "DL01 AB 1287",
  imei: "358920108765431",
  vin: "MA1TA2C43J5K78901",
  status: "running",
  speed: 62,
  vehicleType: { name: "Truck" },
  deviceType: { name: "GT06" },
  lastUpdate: "2025-10-17T08:02:15+05:30",
  primaryUser: {
    name: "Akash Kumar",
    email: "akash.kumar@example.com",
    mobilePrefix: "+91",
    mobile: "9810012345",
    isEmailVerified: true,
    profileUrl: "/uploads/users/akash.png",
    username: "akash.k",
  },
  addedBy: {
    name: "Vinod Singh",
    email: "vinod.singh@example.com",
    mobilePrefix: "+91",
    mobile: "9899011122",
    isEmailVerified: true,
    profileUrl: "/uploads/users/vinod.png",
    username: "vinod.s",
  },
  primaryExpiry: "2026-08-31",
  secondaryExpiry: "2026-12-31",
  createdAt: "2024-11-03T10:22:40+05:30",
  ignition: true,
  engineHour: 1820.5,
  odometer: 148520.7,
  gmt: "+05:30",
  parking: false,
  isActive: true,
  vehicleMeta: { fuelType: "diesel", axleCount: 2, gpsModule: "v2.1", customColor: "matte-black" },
  coords: { lat: 28.6139, lon: 77.2090 },
  deviceAttributes: {
    satellites: 9,
    hdop: 0.8,
    batteryVoltage: 12.6,
    externalPower: 13.8,
    signal: "good",
    fix: true,
  },
};

const navItems: NavItem[] = [
  { key: "vehicle", label: "Vehicle Details", icon: PersonOutlineRoundedIcon },
  { key: "users", label: "Vehicle users", icon: PersonOutlineRoundedIcon },
  { key: "sendcommands", label: "Send Commands", icon: DescriptionRoundedIcon },
  { key: "logs", label: "Logs", icon: DescriptionRoundedIcon },
  { key: "maps", label: "Maps", icon: DescriptionRoundedIcon },
  { key: "documents", label: "Documents", icon: DescriptionRoundedIcon },
  { key: "config", label: "Vehicle Config", icon: SettingsRoundedIcon },
  { key: "delete", label: "Delete Vehicle", icon: DeleteRoundedIcon, danger: true },
];

function DeleteAccountContent() {
  return (
    <div className="p-8 space-y-6 bg-background text-foreground">
      <div>
        <h2 className="typo-h1 mb-2 text-destructive">
          Delete Account
        </h2>
        <p className="text-muted-foreground">
          Permanently delete this user account and all associated data.
        </p>
      </div>
      <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 dark:bg-foreground/5">
        <div className="flex items-start gap-3">
          <DeleteRoundedIcon className="text-destructive mt-0.5" />
          <div>
            <h3 className="font-semibold text-destructive mb-2">Danger Zone</h3>
            <p className="text-destructive/90 text-sm mb-4">
              This action cannot be undone. This will permanently delete the user account and remove all associated data.
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


function renderContent(activeKey: string, VEHICLE_DATA: Vehicledatatype) {
  switch (activeKey) {
    case "vehicle":
      return <VehicleDetailsPreview data={VEHICLE_DATA} />;
    case "users":
      return <VehicleUsersListItem />;
    case "sendcommands":
      return <VehicleSendCommand />;
    case "logs":
      return <VehicleLogsPage />;
    case "maps":
      return "Maps Content";
    case "documents":
      return <VehicleDocumentsPage />;
    case "config":
      return <VehicleConfig />;
    case "delete":
      return <DeleteAccountContent />;
    default:
      return <VehicleDetailsPreview data={VEHICLE_DATA} />;
  }
}

export default function SingleVehicle({ params }: { params: Promise<{ id: string }> }) {
  const [activeNavKey, setActiveNavKey] = React.useState("vehicle");
  const resolvedParams = React.use(params);
  const vehicleID = resolvedParams.id;

  const handleNavChange = (key: string) => {
    setActiveNavKey(key);
  };

  return (
    <TooltipProvider>
      <div className="min-h-[100vh] w-full">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-10 gap-6 items-start">
            <aside className="md:col-span-3">
              <div className="sticky top-[68px] space-y-6">
                <NavigationMenu
                  navItems={navItems}
                  activeKey={activeNavKey}
                  onNavChange={handleNavChange}
                />
              </div>
            </aside>

            <section className="md:col-span-7">
              <Card className="rounded-3xl border-border shadow-sm bg-background text-foreground min-h-[600px]">
                {renderContent(activeNavKey, VEHICLE_DATA)}
              </Card>
            </section>
          </div>
        </div>

        <div className="h-8" />
      </div>
    </TooltipProvider>
  );
}
