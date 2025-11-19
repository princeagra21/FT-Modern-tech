'use client'
import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserIdentityCard, NavigationMenu, type NavItem, type UserIdentity } from "@/components/common/sidenav";

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
import VehicleDetailsPreview from "@/components/superadmin/vehicledetailscontent";
import VehicleUsersListItem from "@/components/superadmin/vehicleuserslist";
import VehicleSendCommand from "@/components/superadmin/vehiclesendcommand";
import VehicleDocumentsPage from "@/components/superadmin/vehicledocuments";
import VehicleLogsPage from "@/components/superadmin/vehiclelogs";
import VehicleConfig from "@/components/superadmin/vehicleconfig";


// ---- Types and Data ----
type Vehicledatatype = {
  id: string;
  vehicleNo: string;
  imei: string;
  vin: string;
  status: "running" | "idle" | "stop";
  speed: number;
  vehicleType: { name: string };
  deviceType: { name: string };
  lastUpdate: string; // ISO
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
  primaryExpiry: string; // YYYY-MM-DD
  secondaryExpiry: string; // YYYY-MM-DD
  createdAt: string; // ISO
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
  coords: { lat: 28.6139, lon: 77.2090 }, // sample (Delhi)
  deviceAttributes: {
    satellites: 9,
    hdop: 0.8,
    batteryVoltage: 12.6,
    externalPower: 13.8,
    signal: "good",
    fix: true,
  },
};



// ——————————————————————————————————————————
// Navigation Configuration & Content Components
// ——————————————————————————————————————————
const navItems: NavItem[] = [
  { key: "vehicle", label: "Vehicle Details", icon: PersonOutlineRoundedIcon },
  { key: "users", label: "Vehicle users", icon: PersonOutlineRoundedIcon },
  { key: "sendcommands", label: "Send Commands", icon: DescriptionRoundedIcon },
  { key: "logs", label: "Logs", icon: DescriptionRoundedIcon },
  { key: "maps", label: "Maps", icon: DescriptionRoundedIcon },
  { key: "sensors", label: "Sensors", icon: DescriptionRoundedIcon },
  { key: "documents", label: "Documents", icon: DescriptionRoundedIcon }, 
  { key: "config", label: "Vehicle Config", icon: SettingsRoundedIcon }, 
  { key: "events", label: "Vehicle Events", icon: SettingsRoundedIcon }, 
  { key: "delete", label: "Delete Vehicle", icon: DeleteRoundedIcon, danger: true },
];





function DeleteAccountContent() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="typo-h1 mb-2 text-red-600">Delete Account</h2>
        <p className="text-neutral-600">Permanently delete this user account and all associated data.</p>
      </div>
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <DeleteRoundedIcon className="text-red-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-800 mb-2">Danger Zone</h3>
            <p className="text-red-700 text-sm mb-4">
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

// Content renderer based on active navigation
function renderContent(activeKey: string, VEHICLE_DATA: Vehicledatatype) {
  switch (activeKey) {
    case "vehicle":
      return <VehicleDetailsPreview data={VEHICLE_DATA} />;
    case "users":
      return <VehicleUsersListItem />
    case "sendcommands":
      return <VehicleSendCommand />
    case "logs":
      return <VehicleLogsPage />;
    case "maps":
      return "Maps Content";
      case "sensors":
      return "Sensors Content";
    case "documents":
      return <VehicleDocumentsPage />;
    case "config":
      return <VehicleConfig />;
    case "events":
      return "Vehicle Events Content";
    case "delete":
      return <DeleteAccountContent />;
    default:
      return <VehicleDetailsPreview data={VEHICLE_DATA} />;
  }
}

export default function SingleVehicle({ params }: { params: Promise<{ id: string }> }) {
  const [activeNavKey, setActiveNavKey] = React.useState("vehicle");
  
  // Unwrap params Promise using React.use()
  const resolvedParams = React.use(params);
  const vehicleID = resolvedParams.id;

//   // Prepare user identity for SideNav
//   const userIdentity: UserIdentity = {
//     name: user.name,
//     username: user.username,
//     profileUrl: user.profileUrl,
//     isEmailVerified: user.isEmailVerified,
//   };

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
                {/* <UserIdentityCard user={userIdentity} /> */}
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
                {renderContent(activeNavKey, VEHICLE_DATA)}
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


