import React from 'react'
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Material Design Icons (MUI)
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import BusinessIcon from "@mui/icons-material/Business";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

// Social icons
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";


export type SuperAdmin = {
  id: string;
  profileUrl: string;
  name: string;
  mobilePrefix: string;
  mobileNumber: string;
  email: string;
  isEmailVerified: boolean;
  username: string;
  role: "superadmin";
  address: {
    line1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    countryCode: string;
  };
  currency: {
    code: string;
    symbol: string;
    name: string;
  };
  createdAt: string; // ISO format
  updatedAt: string; // ISO format
  lastLogin: string; // ISO format
  status: "active" | "inactive";
  company: {
    name: string;
    logolight?: string;
    logodark?: string;
    website?: string;
    socials?: Record<string, string>;
  };
};


// Mock data for SuperAdmin
const superAdminData: SuperAdmin = {
  id: "SA001",
  profileUrl: "/uploads/superadmin/sa001.png",
  name: "Rajesh Kumar",
  mobilePrefix: "+91",
  mobileNumber: "9876543210",
  email: "rajesh.kumar@fleetstacksuperadmin.com",
  isEmailVerified: true,
  username: "rajesh.superadmin",
  role: "superadmin",
  address: {
    line1: "Tower A, Tech Park, Whitefield",
    city: "Bengaluru",
    state: "Karnataka",
    postalCode: "560066",
    country: "India",
    countryCode: "IN",
  },
  currency: {
    code: "INR",
    symbol: "₹",
    name: "Indian Rupee",
  },
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2025-10-18T12:30:00Z",
  lastLogin: "2025-10-18T09:15:00Z",
  status: "active",
  company: {
    name: "Fleet Stack Enterprise",
    logolight: "/brand/fleetstack-enterprise-light.svg",
    logodark: "/brand/fleetstack-enterprise-dark.svg",
    website: "https://enterprise.fleetstack.com",
    socials: {
      linkedin: "https://www.linkedin.com/company/fleetstackenterprise",
      twitter: "https://twitter.com/fleetstackent",
      facebook: "https://facebook.com/fleetstackenterprise",
      youtube: "https://youtube.com/@fleetstackenterprise",
      github: "https://github.com/fleetstackenterprise",
      instagram: "https://instagram.com/fleetstackenterprise",
    },
  },
};


function SuperAdminProfile({ superAdminId }: { superAdminId?: string }) {
  const [loading, setLoading] = React.useState(false);
  const [superAdmin, setSuperAdmin] = React.useState<SuperAdmin | null>(superAdminData);
  const [inactive, setInactive] = React.useState(superAdminData.status !== "active");

  // Handle Edit Profile
  const handleEdit = () => {
    console.log("Edit Super Admin Profile");
    // TODO: Open edit modal or navigate to edit page
  };

  // Handle Update Password
  const handleUpdatePassword = () => {
    console.log("Update Super Admin Password");
    // TODO: Open password update modal
  };

  // Handle Toggle Status
  const handleToggleStatus = () => {
    setInactive((prev) => !prev);
    console.log("Toggle Super Admin Status");
    // TODO: API call to update status
  };

  if (loading) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold tracking-tight mb-2 dark:text-neutral-100">Loading...</h2>
      </div>
    );
  }

  if (!superAdmin) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold tracking-tight mb-2 dark:text-neutral-100">Super Admin not found</h2>
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">Super Admin</div>
            <CardTitle className="text-2xl tracking-tight dark:text-neutral-100">Profile Overview</CardTitle>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button 
              variant="outline" 
              className="rounded-xl border-neutral-300 dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-700" 
              onClick={handleToggleStatus}
            >
              {inactive ? <ToggleOffIcon className="mr-2" fontSize="small" /> : <ToggleOnIcon className="mr-2" fontSize="small" />}
              {inactive ? "Set Active" : "Set Inactive"}
            </Button>
            <Button 
              variant="outline" 
              className="rounded-xl border-neutral-300 dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-700"
              onClick={handleUpdatePassword}
            >
              <LockResetRoundedIcon className="mr-2" fontSize="small" /> Update Password
            </Button>
            <Button 
              className="rounded-xl bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-neutral-100"
              onClick={handleEdit}
            >
              <EditRoundedIcon className="mr-2" fontSize="small" /> Edit
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        {/* Identity */}
        <div className="flex flex-wrap items-center gap-4">
          <Avatar className="h-16 w-16 border border-neutral-200 dark:border-neutral-700">
            <AvatarImage src={superAdmin.profileUrl} alt={superAdmin.name} />
            <AvatarFallback className="dark:bg-neutral-200 dark:text-neutral-800">{superAdmin.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
          </Avatar>
          <div className="min-w-[220px]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xl font-semibold tracking-tight dark:text-neutral-100">{superAdmin.name}</span>
              <Badge className="rounded-full bg-black text-white dark:bg-white dark:text-black">Super Admin</Badge>
              <Badge className={`rounded-full ${inactive ? "bg-white text-black border border-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-600" : "bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900"}`}>
                {inactive ? "Inactive" : "Active"}
              </Badge>
              {superAdmin.isEmailVerified && (
                <Badge variant="outline" className="rounded-full border-neutral-300 dark:border-neutral-600 dark:text-neutral-300">Email Verified</Badge>
              )}
            </div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">@{superAdmin.username}</div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 items-stretch">
          <KPITile
            label="Created"
            value={<span className="text-sm font-medium dark:text-neutral-100">15 Jan 2024, 10:00 am</span>}
          />
          <KPITile
            label="Last Login"
            value={<span className="text-sm font-medium dark:text-neutral-100">18 Oct 2025, 2:45 pm</span>}
            sub={<span className="inline-block rounded-full border border-neutral-200 px-1.5 py-[1px] dark:border-neutral-700 dark:text-neutral-300">just now</span>}
          />
        </div>

        <Separator className="my-6 dark:bg-neutral-700" />

        {/* Company + Address */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Company block */}
          <div className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-700 dark:bg-neutral-800 flex flex-col h-full">
            <div className="text-xs uppercase tracking-widest text-neutral-500 mb-4 dark:text-neutral-400">Company</div>
            <div className="flex flex-col items-center gap-3 mb-6">
              {(superAdmin.company.logolight || superAdmin.company.logodark) ? (
                <img 
                  src={superAdmin.company.logolight || superAdmin.company.logodark} 
                  alt={superAdmin.company.name} 
                  className="w-32 h-16 object-contain p-1" 
                />
              ) : (
                <div className="w-32 h-16 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-500 text-sm dark:bg-neutral-700 dark:text-neutral-400">
                  <BusinessIcon />
                </div>
              )}
              <div className="text-center">
                <div className="font-semibold tracking-tight dark:text-neutral-100">{superAdmin.company.name}</div>
                {superAdmin.company.website && (
                  <a 
                    className="text-sm text-neutral-500 underline-offset-4 hover:underline dark:text-neutral-400" 
                    href={superAdmin.company.website} 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {(superAdmin.company.website || "").replace("https://", "")}
                  </a>
                )}
              </div>
            </div>

            {superAdmin.company.socials && (
              <div className="mt-auto">
                <div className="text-xs uppercase tracking-widest text-neutral-500 mb-3 dark:text-neutral-400">Socials</div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(superAdmin.company.socials).map(([k, v]) => {
                    const map: Record<string, React.ElementType> = {
                      linkedin: LinkedInIcon,
                      twitter: TwitterIcon,
                      facebook: FacebookIcon,
                      youtube: YouTubeIcon,
                      github: GitHubIcon,
                      instagram: InstagramIcon,
                    };
                    const Icon = map[k.toLowerCase()] ?? LanguageRoundedIcon;
                    return (
                      <a 
                        key={k} 
                        href={v} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm rounded-lg border border-neutral-200 px-3 py-1.5 hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700"
                      >
                        <Icon fontSize="small" />
                        <span className="capitalize">{k}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Address */}
          <div className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-700 dark:bg-neutral-800 flex flex-col h-full">
            <div className="text-xs uppercase tracking-widest text-neutral-500 mb-4 dark:text-neutral-400">Address</div>
            <div className="space-y-3 flex-1">
              <div className="flex items-start gap-3">
                <span className="text-sm text-neutral-500 dark:text-neutral-400 min-w-[70px] flex-shrink-0">Line</span>
                <span className="text-sm font-medium dark:text-neutral-100 flex-1">{superAdmin.address.line1}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sm text-neutral-500 dark:text-neutral-400 min-w-[70px] flex-shrink-0">City</span>
                <span className="text-sm font-medium dark:text-neutral-100 flex-1">{superAdmin.address.city}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sm text-neutral-500 dark:text-neutral-400 min-w-[70px] flex-shrink-0">State</span>
                <span className="text-sm font-medium dark:text-neutral-100 flex-1">{superAdmin.address.state || "—"}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sm text-neutral-500 dark:text-neutral-400 min-w-[70px] flex-shrink-0">Postal</span>
                <span className="text-sm font-medium dark:text-neutral-100 flex-1">{superAdmin.address.postalCode || "—"}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-sm text-neutral-500 dark:text-neutral-400 min-w-[70px] flex-shrink-0">Country</span>
                <span className="text-sm font-medium dark:text-neutral-100 flex-1 inline-flex items-center gap-1.5">
                  <span className={`fi fi-${superAdmin.address.countryCode.toLowerCase()}`} style={{ fontSize: "14px" }}></span>
                  {superAdmin.address.country} ({superAdmin.address.countryCode})
                </span>
              </div>
            </div>
          </div>
        </div>



        {/* Contact */}
        <div className="mt-6 rounded-2xl border border-neutral-200 p-5 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="text-xs uppercase tracking-widest text-neutral-500 mb-2 dark:text-neutral-400">Contact</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3 text-sm dark:text-neutral-300">
              <div className="flex items-center gap-3">
                <EmailRoundedIcon fontSize="small" className="text-neutral-500 dark:text-neutral-400" />
                <a href={`mailto:${superAdmin.email}`} className="underline-offset-4 hover:underline">{superAdmin.email}</a>
              </div>
              <div className="flex items-center gap-3">
                <LocalPhoneRoundedIcon fontSize="small" className="text-neutral-500 dark:text-neutral-400" />
                <span>{superAdmin.mobilePrefix} {superAdmin.mobileNumber}</span>
              </div>
              {superAdmin.company.website && (
                <div className="flex items-center gap-3">
                  <LanguageRoundedIcon fontSize="small" className="text-neutral-500 dark:text-neutral-400" />
                  <a 
                    href={superAdmin.company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline-offset-4 hover:underline"
                  >
                    {(superAdmin.company.website || "").replace("https://", "")}
                  </a>
                </div>
              )}
            </div>
            <div />
          </div>
        </div>

        {/* Activity */}
        <div className="mt-6 rounded-2xl border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="px-5 py-4 border-b border-neutral-200 text-sm font-medium tracking-tight dark:border-neutral-700 dark:text-neutral-100">Recent Activity</div>
          <ScrollArea className="h-56">
            <div className="p-5 space-y-4">
              {[
                { action: "Created new admin account", time: "2 hours ago", detail: "Admin: Priya Patel" },
                { action: "System configuration updated", time: "5 hours ago", detail: "Updated currency settings" },
                { action: "Approved vehicle registration", time: "1 day ago", detail: "VIN 9BG116GW04C400001" },
                { action: "Generated system report", time: "2 days ago", detail: "Monthly fleet analytics" },
                { action: "Reviewed admin request", time: "3 days ago", detail: "Credit increase approval" },
                { action: "Updated system permissions", time: "4 days ago", detail: "Role management" },
                { action: "Added new vehicle type", time: "5 days ago", detail: "Electric Vehicle category" },
                { action: "System maintenance", time: "1 week ago", detail: "Database optimization" },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg border border-neutral-200 bg-neutral-50 grid place-items-center text-xs font-medium dark:border-neutral-700 dark:bg-neutral-700 dark:text-neutral-300">{i + 1}</div>
                  <div>
                    <div className="text-sm font-medium dark:text-neutral-100">{activity.action}</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">{activity.time} · {activity.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}


// Reusable KPI tile
function KPITile({ label, value, sub }: { label: string; value: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-neutral-200 p-3 h-full dark:border-neutral-700 dark:bg-neutral-800">
      <div className="text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">{label}</div>
      <div className="mt-0.5 text-lg font-semibold leading-tight dark:text-neutral-100">{value}</div>
      {sub ? <div className="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">{sub}</div> : null}
    </div>
  );
}

export default SuperAdminProfile;
