import React from 'react'
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
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";


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

  if(loading) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold tracking-tight mb-2 dark:text-neutral-100">Loading...</h2>
      </div>
    );
  }

  return (
    <>
    <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">Profile</div>
                      <CardTitle className="text-2xl tracking-tight dark:text-neutral-100">User Overview</CardTitle>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">

                      <Button variant="outline" className="rounded-xl border-neutral-300 dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-700" onClick={() => setInactive((v) => !v)}>
                        {inactive ? <ToggleOffIcon className="mr-2" fontSize="small" /> : <ToggleOnIcon className="mr-2" fontSize="small" />}
                        {inactive ? "Set Active" : "Set Inactive"}
                      </Button>
                      <Button variant="outline" className="rounded-xl border-neutral-300 dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-700"><LockResetRoundedIcon className="mr-2" fontSize="small" /> Update Password</Button>
                      <Button className="rounded-xl bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-neutral-100"><EditRoundedIcon className="mr-2" fontSize="small" /> Edit</Button>
                    </div>
                  </div>
                </CardHeader>
                 <CardContent className="pt-2">
                  {/* Identity */}
                  <div className="flex flex-wrap items-center gap-4">
                    <Avatar className="h-16 w-16 border border-neutral-200 dark:border-neutral-700">
                      <AvatarImage src={user.profileUrl} alt={user.name} />
                      <AvatarFallback className="dark:bg-neutral-200 dark:text-neutral-800">{user.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-[220px]">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xl font-semibold tracking-tight dark:text-neutral-100">{user.name}</span>
                        <Badge className={`rounded-full ${inactive ? "bg-white text-black border border-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-600" : "bg-black text-white dark:bg-white dark:text-black"}`}>{inactive ? "Inactive" : "Active"}</Badge>
                        {user.isEmailVerified && (<Badge variant="outline" className="rounded-full border-neutral-300 dark:border-neutral-600 dark:text-neutral-300">Email Verified</Badge>)}
                      </div>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">@{user.username}</div>
                    </div>
                  </div>


                  {/* Stats strip */}
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 items-stretch">
                    <KPITile label="Vehicles" value={user.vehiclesCount} />
                    <KPITile label="Credits" value={user.credits} />

                    <KPITile
                      label="Last Login"
                      value={<span className="text-sm font-medium dark:text-neutral-100"> 15 Oct 2025, 8:35 pm </span>}
                      sub={<span className="inline-block rounded-full border border-neutral-200 px-1.5 py-[1px] dark:border-neutral-700 dark:text-neutral-300"> in 17 hours </span>}
                    />
                    <KPITile
                      label="Created"
                      value={<span className="text-sm font-medium dark:text-neutral-100">12 Sept 2025, 2:00 pm</span>}
                    />
                  </div>

                  <Separator className="my-6 dark:bg-neutral-700" />

                  {/* Company + Address */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Company block */}
                    <div className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-700 dark:bg-neutral-800">
                      <div className="text-xs uppercase tracking-widest text-neutral-500 mb-2 dark:text-neutral-400">Company</div>
                      <div className="flex flex-col items-center gap-3">
                        {(user.company.logolight || user.company.logodark) ? (
                          <img 
                            src={user.company.logolight || user.company.logodark} 
                            alt={user.company.name} 
                            className="w-32 h-16 object-contain p-1" 
                          />
                        ) : (
                          <div className="w-32 h-16 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-500 text-sm dark:bg-neutral-700 dark:text-neutral-400">
                            No Logo
                          </div>
                        )}
                        <div>
                          <div className="font-semibold tracking-tight dark:text-neutral-100">{user.company.name}</div>
                          {user.company.website && (
                            <a className="text-sm text-neutral-500 underline-offset-4 hover:underline dark:text-neutral-400" href={user.company.website} target="_blank">{(user.company.website || "").replace("https://", "")}</a>
                          )}
                        </div>
                      </div>

                      {user.company.socials && (
                        <div className="mt-4">
                          <div className="text-xs uppercase tracking-widest text-neutral-500 mb-2 dark:text-neutral-400">Socials</div>
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
                                <a key={k} href={v} target="_blank" className="inline-flex items-center gap-1 text-sm rounded-lg border border-neutral-200 px-3 py-1 hover:bg-neutral-100 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700">
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
                    <div className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-700 dark:bg-neutral-800">
                      <div className="text-xs uppercase tracking-widest text-neutral-500 mb-2 dark:text-neutral-400">Address</div>
                      <div className="space-y-2 text-sm">
                        <div><span className="text-neutral-500 dark:text-neutral-400">Line</span> <span className="ml-2 font-medium dark:text-neutral-100">{user.address.line1}</span></div>
                        <div><span className="text-neutral-500 dark:text-neutral-400">City</span> <span className="ml-2 font-medium dark:text-neutral-100">{user.address.city}</span></div>
                        <div><span className="text-neutral-500 dark:text-neutral-400">State</span> <span className="ml-2 font-medium dark:text-neutral-100">{user.address.state || "—"}</span></div>
                        <div><span className="text-neutral-500 dark:text-neutral-400">Postal</span> <span className="ml-2 font-medium dark:text-neutral-100">{user.address.postalCode || "—"}</span></div>
                        <div className="flex items-center gap-2">
                          <span className="text-neutral-500 dark:text-neutral-400">Country</span> 
                          <span className="ml-2 inline-flex items-center gap-2 font-medium dark:text-neutral-100">
                            <span className={`fi fi-${user.address.countryCode.toLowerCase()} h-4 w-6 border border-neutral-200 dark:border-neutral-600`}></span>
                            {user.address.country} ({user.address.countryCode})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact (email/phone/website only; address shown once above) */}
                  <div className="mt-6 rounded-2xl border border-neutral-200 p-5 dark:border-neutral-700 dark:bg-neutral-800">
                    <div className="text-xs uppercase tracking-widest text-neutral-500 mb-2 dark:text-neutral-400">Contact</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2 text-sm dark:text-neutral-300">
                        <div className="flex items-center gap-3"><EmailRoundedIcon fontSize="small" className="dark:text-neutral-400" /><a href={`mailto:${user.email}`} className="underline-offset-4 hover:underline">{user.email}</a></div>
                        <div className="flex items-center gap-3"><LocalPhoneRoundedIcon fontSize="small" className="dark:text-neutral-400" /><span>{user.mobilePrefix} {user.mobileNumber}</span></div>
                        {user.company.website && (
                          <div className="flex items-center gap-3"><LanguageRoundedIcon fontSize="small" className="dark:text-neutral-400" /><a href={user.company.website} target="_blank" className="underline-offset-4 hover:underline">{(user.company.website || "").replace("https://", "")}</a></div>
                        )}
                      </div>
                      {/* Intentionally leaving the second column empty to avoid repeating address. */}
                      <div />
                    </div>
                  </div>

                  {/* Activity */}
                  <div className="mt-6 rounded-2xl border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800">
                    <div className="px-5 py-4 border-b border-neutral-200 text-sm font-medium tracking-tight dark:border-neutral-700 dark:text-neutral-100">Recent Activity</div>
                    <ScrollArea className="h-56">
                      <div className="p-5 space-y-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-lg border border-neutral-200 grid place-items-center text-xs dark:border-neutral-700 dark:text-neutral-300">{i}</div>
                            <div>
                              <div className="text-sm font-medium dark:text-neutral-100">Updated vehicle status</div>
                              <div className="text-xs text-neutral-500 dark:text-neutral-400">2 hours ago · VIN 9BG116GW04C400001</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </CardContent>
    
    
    </>
    
    )
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

export default AdminProfileContent