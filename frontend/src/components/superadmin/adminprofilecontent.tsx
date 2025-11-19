import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Material Design Icons (MUI) — default component exports

import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";

import EditRoundedIcon from "@mui/icons-material/EditRounded";

import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";

// Social icons
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EditIcon from "@mui/icons-material/Edit";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";
import EditSuperAdminDialog from "./administrators/profile/EditSuperAdminDialog";
import UpdatePasswordDialog from "../common/UpdatePasswordDialog";
import { EditCompanyDialog } from "../common/EditCompanyDialog";

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

function AdminProfileContent({ adminId }: { adminId: string }) {
  const [loading, setLoading] = React.useState(false);
  const [adminData, setAdminData] = React.useState<User | null>(user);
  const [inactive, setInactive] = React.useState(user.status !== "active");
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openPassword, setOpenPassword] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleSave = (updatedCompany: any) => {
    // Here you’d typically call your API or update parent state
    console.log("Updated company:", updatedCompany);
  };

  const handleEdit = () => setOpenEdit(true);

  if (loading) {
    return (
      <div className="p-8">
        <h2 className="typo-h1 mb-2 dark:text-neutral-100">
          Loading...
        </h2>
      </div>
    );
  }

  return (
    <>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          {/* Left section */}
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted">
              Profile
            </div>
            <CardTitle className="typo-h1  text-foreground">
              User Overview
            </CardTitle>
          </div>

          {/* Right action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              className="rounded-xl border-border text-foreground dark:bg-foreground/5 hover:bg-foreground/10"
              onClick={() => setInactive((v) => !v)}
            >
              {inactive ? (
                <ToggleOffIcon className="mr-2" fontSize="small" />
              ) : (
                <ToggleOnIcon className="mr-2" fontSize="small" />
              )}
              {inactive ? "Set Active" : "Set Inactive"}
            </Button>

            <Button
              variant="outline"
              onClick={() => setOpenPassword(true)}
              className="rounded-xl border-border text-foreground dark:bg-foreground/5 hover:bg-foreground/10"
            >
              <LockResetRoundedIcon className="mr-2" fontSize="small" />
              Update Password
            </Button>

            <Button
              onClick={handleEdit}
              className="rounded-xl bg-primary text-primary-foreground text-white hover:bg-primary/90"
            >
              <EditRoundedIcon className="mr-2" fontSize="small" />
              Edit
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        {/* Identity */}
        <div className="flex flex-wrap items-center gap-4">
          <Avatar className="h-16 w-16 border border-border">
            <AvatarImage src={user.profileUrl} alt={user.name} />
            <AvatarFallback className="bg-foreground/5 text-foreground">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-[220px]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="typo-h2">
                {user.name}
              </span>
              <Badge
                className={`rounded-full ${
                  inactive
                    ? "bg-background text-foreground border border-border"
                    : "bg-primary text-white"
                }`}
              >
                {inactive ? "Inactive" : "Active"}
              </Badge>

              {user.isEmailVerified && (
                <Badge
                  variant="outline"
                  className="rounded-full border-border text-muted-foreground"
                >
                  Email Verified
                </Badge>
              )}
            </div>

            <div className="text-sm text-muted-foreground">
              @{user.username}
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 items-stretch ">
          <KPITile label="Vehicles" value={user.vehiclesCount} />
          <KPITile label="Credits" value={user.credits} />

          <KPITile
            label="Last Login"
            value={
              <span className="text-sm font-medium text-foreground">
                15 Oct 2025, 8:35 pm
              </span>
            }
            sub={
              <span className="inline-block rounded-full border border-border px-1.5 py-[1px] text-muted-foreground">
                in 17 hours
              </span>
            }
          />
          <KPITile
            label="Created"
            value={
              <span className="text-sm font-medium text-foreground">
                12 Sept 2025, 2:00 pm
              </span>
            }
          />
        </div>

        <Separator className="my-6 bg-border" />

        {/* Company + Address */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Company block */}
          <div
            className="relative rounded-2xl border border-border p-5 bg-card dark:bg-foreground/5 transition-all"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {/* Hover Edit Button */}
            {hovered && (
              <button
                onClick={() => setOpen(true)}
                className="absolute top-3 right-3 p-2 bg-muted rounded-full hover:bg-muted-foreground/20 transition"
                title="Edit Company"
              >
                <EditIcon fontSize="small" className="text-muted-foreground" />
              </button>
            )}

            <div className="typo-subtitle-foreground mb-2">
              Company
            </div>

            <div className="flex flex-col items-center gap-3">
              {user.company.logolight || user.company.logodark ? (
                <img
                  src={user.company.logolight || user.company.logodark}
                  alt={user.company.name}
                  className="w-32 h-16 object-contain p-1"
                />
              ) : (
                <div className="w-32 h-16 bg-muted rounded-lg flex items-center justify-center text-muted-foreground text-sm">
                  No Logo
                </div>
              )}

              <div>
                <div className="font-semibold  text-foreground">
                  {user.company.name}
                </div>
                {user.company.website && (
                  <a
                    className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                    href={user.company.website}
                    target="_blank"
                  >
                    {(user.company.website || "").replace("https://", "")}
                  </a>
                )}
              </div>
            </div>

            {user.company.socials && (
              <div className="mt-4">
                <div className="typo-subtitle-foreground mb-2">
                  Socials
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(user.company.socials).map(([k, v]) => {
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
                        className="inline-flex items-center gap-1 text-sm rounded-lg border border-border px-3 py-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors dark:bg-foreground/5"
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

          {/* Address block */}
          <div className="rounded-2xl border border-border p-5 bg-card dark:bg-foreground/5">
            <div className="typo-subtitle-foreground mb-2">
              Address
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Line</span>{" "}
                <span className="ml-2 font-medium text-foreground">
                  {user.address.line1}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">City</span>{" "}
                <span className="ml-2 font-medium text-foreground">
                  {user.address.city}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">State</span>{" "}
                <span className="ml-2 font-medium text-foreground">
                  {user.address.state || "—"}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Postal</span>{" "}
                <span className="ml-2 font-medium text-foreground">
                  {user.address.postalCode || "—"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Country</span>
                <span className="ml-2 inline-flex items-center gap-2 font-medium text-foreground">
                  <span
                    className={`fi fi-${user.address.countryCode.toLowerCase()} h-4 w-6 border border-border`}
                  ></span>
                  {user.address.country} ({user.address.countryCode})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="mt-6 rounded-2xl border border-border p-5 dark:bg-foreground/5">
          <div className="typo-subtitle-foreground mb-2">
            Contact
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <EmailRoundedIcon fontSize="small" />
                <a
                  href={`mailto:${user.email}`}
                  className="underline-offset-4 hover:underline text-foreground"
                >
                  {user.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <LocalPhoneRoundedIcon fontSize="small" />
                <span className="text-foreground">
                  {user.mobilePrefix} {user.mobileNumber}
                </span>
              </div>
              {user.company.website && (
                <div className="flex items-center gap-3">
                  <LanguageRoundedIcon fontSize="small" />
                  <a
                    href={user.company.website}
                    target="_blank"
                    className="underline-offset-4 hover:underline text-foreground"
                  >
                    {(user.company.website || "").replace("https://", "")}
                  </a>
                </div>
              )}
            </div>
            <div />
          </div>
        </div>

        {/* Activity */}
        <div className="mt-6 rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-4 border-b border-border text-sm font-medium  text-foreground bg-foreground/5">
            Recent Activity
          </div>
          <ScrollArea className="h-56">
            <div className="p-5 space-y-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg border border-border grid place-items-center typo-subtitle">
                    {i}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      Updated vehicle status
                    </div>
                    <div className="typo-subtitle">
                      2 hours ago · VIN 9BG116GW04C400001
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
      <EditSuperAdminDialog
        open={openEdit}
        onOpenChange={setOpenEdit}
        data={{
          name: user.name,
          email: user.email,
          mobilePrefix: user.mobilePrefix,
          mobileNumber: user.mobileNumber,
          addressLine: user.address.line1,
          countryCode: user.address.countryCode,
          stateCode: user.address.state || "",
          cityName: user.address.city || "",
          pincode: user.address.postalCode || "",
        }}
        onSave={(updated) => {
          setAdminData((prev) => (prev ? { ...prev, ...updated } : prev));
          console.log("Updated admin:", updated);
        }}
      />
       <EditCompanyDialog
        open={open}
        onOpenChange={setOpen}
        company={user.company}
        onSave={handleSave}
      />
      <UpdatePasswordDialog
        open={openPassword}
        onOpenChange={setOpenPassword}
        onUpdate={(data) => {
          console.log("Password updated:", data);
        }}
      />
    </>
  );
}

// Reusable KPI tile
function KPITile({
  label,
  value,
  sub,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border p-3 h-full bg-card dark:bg-foreground/5">
      <div className="typo-subtitle-foreground">
        {label}
      </div>
      <div className="mt-0.5 text-lg font-semibold leading-tight text-foreground">
        {value}
      </div>
      {sub ? (
        <div className="mt-0.5 text-[11px] text-muted-foreground">{sub}</div>
      ) : null}
    </div>
  );
}

export default AdminProfileContent;
