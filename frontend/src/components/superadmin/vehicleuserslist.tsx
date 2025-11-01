import React, { useMemo, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import VerifiedIcon from "@mui/icons-material/Verified";
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LoginIcon from "@mui/icons-material/Login";
import SearchIcon from "@mui/icons-material/Search";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ---------- Types ----------
type Profile = {
  name: string;
  mobilePrefix?: string;
  mobile: string;
  email: string;
  username: string;
  profileUrl?: string;
  lastLogin?: string; // ISO
  isEmailVerified?: boolean; // accepts isemailverified too when mapping
};

// ---------- Demo Data (edit freely) ----------
const PROFILES: Profile[] = [
  {
    name: "Akash Kumar",
    mobilePrefix: "+91",
    mobile: "9810012345",
    email: "akash.kumar@example.com",
    username: "akash.k",
    profileUrl: "/uploads/users/akash.png",
    lastLogin: "2025-10-17T07:40:00+05:30",
    isEmailVerified: true,
  },
  {
    name: "Vinod Singh",
    mobilePrefix: "+91",
    mobile: "9899011122",
    email: "vinod.singh@example.com",
    username: "vinod.s",
    profileUrl: "/uploads/users/vinod.png",
    lastLogin: "2025-10-16T20:10:00+05:30",
    isEmailVerified: true,
  },
  {
    name: "Priya Mehta",
    mobilePrefix: "+91",
    mobile: "9876543210",
    email: "priya.mehta@example.com",
    username: "priya.m",
    profileUrl: "/uploads/users/priya.png",
    lastLogin: "2025-10-15T09:12:00+05:30",
    isEmailVerified: false,
  },
  {
    name: "Rahul Verma",
    mobilePrefix: "+91",
    mobile: "9988776655",
    email: "rahul.verma@example.com",
    username: "rahul.v",
    profileUrl: "/uploads/users/rahul.png",
    lastLogin: "2025-10-17T06:05:00+05:30",
    isEmailVerified: true,
  },
  {
    name: "Sanya Kapoor",
    mobilePrefix: "+91",
    mobile: "9123456780",
    email: "sanya.kapoor@example.com",
    username: "sanya.k",
    profileUrl: "/uploads/users/sanya.png",
    lastLogin: "2025-10-14T18:44:00+05:30",
    isEmailVerified: false,
  },
  {
    name: "Arjun Iyer",
    mobilePrefix: "+91",
    mobile: "9000012345",
    email: "arjun.iyer@example.com",
    username: "arjun.i",
    profileUrl: "/uploads/users/arjun.png",
    lastLogin: "2025-10-10T12:30:00+05:30",
    isEmailVerified: true,
  },
];

// ---------- Helpers ----------
function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
}
function timeAgo(iso?: string) {
  if (!iso) return "—";
  const t = new Date(iso).getTime();
  const diff = Date.now() - t;
  if (diff < 0) return "just now";
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

// ---------- Card Component ----------
function ProfileCard({ p, onLogin }: { p: Profile; onLogin: (u: string) => void }) {
  const VerifiedBadge = p.isEmailVerified ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="grid h-6 w-6 place-items-center rounded-full bg-black text-white cursor-help dark:bg-white dark:text-black">
          <VerifiedIcon style={{ fontSize: 14 }} />
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs font-medium">Verified</p>
      </TooltipContent>
    </Tooltip>
  ) : (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="grid h-6 w-6 place-items-center rounded-full border border-black text-black cursor-help dark:border-white dark:text-white">
          <ReportGmailerrorredOutlinedIcon style={{ fontSize: 14 }} />
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs font-medium">Unverified</p>
      </TooltipContent>
    </Tooltip>
  );

  return (
    <div className="group flex flex-col rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800">
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 overflow-hidden rounded-full border dark:border-neutral-600">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {p.profileUrl ? (
            <img src={p.profileUrl} alt={p.name} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center text-sm font-semibold dark:text-neutral-100">{initials(p.name)}</div>
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="truncate text-sm font-semibold dark:text-neutral-100">{p.name}</div>
            {VerifiedBadge}
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="inline-flex items-center gap-1">@{p.username}</span>
            <span className="text-neutral-300 dark:text-neutral-600">•</span>
            <span className="inline-flex items-center gap-1"><AccessTimeIcon style={{fontSize:12}}/>{timeAgo(p.lastLogin)}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-2 text-sm">
        <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
          <MailOutlineIcon fontSize="small"/>
          <a className="truncate hover:underline" href={`mailto:${p.email}`}>{p.email}</a>
        </div>
        <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
          <PhoneIphoneIcon fontSize="small"/>
          <a className="hover:underline" href={`tel:${(p.mobilePrefix ?? "") + p.mobile}`}>{p.mobilePrefix ?? ""} {p.mobile}</a>
        </div>       
      </div>

      <div className="mt-4 flex items-center justify-end">
        <button onClick={() => onLogin(p.username)} className="inline-flex items-center gap-2 rounded-lg bg-black px-3 py-1.5 text-xs text-white transition hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90">
          <LoginIcon style={{ fontSize: 16 }} />
          <span>Login</span>
        </button>
      </div>
    </div>
  );
}

// ---------- Grid Page ----------
export default function VehicleUsersListItem() {
  const [query, setQuery] = useState("");

  const handleLogin = (username: string) => {
    // Replace with your auth flow
    // eslint-disable-next-line no-console
    console.log("Login clicked for:", username);
    alert(`Login: @${username}`);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PROFILES;
    return PROFILES.filter((p) =>
      [p.name, p.email, p.username, `${p.mobilePrefix ?? ""} ${p.mobile}`]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [query]);

  // Minimal runtime tests
  if (typeof window !== "undefined") {
    try {
      console.assert(Array.isArray(PROFILES) && PROFILES.length >= 3, "Need at least 3 profiles for 3-up grid");
      for (const p of PROFILES) {
        console.assert(!!p.name && !!p.email && !!p.username, "Profile missing key fields", p);
      }
    } catch {}
  }

  return (
    <TooltipProvider>
      <div className="mx-auto max-w-6xl p-4 md:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight dark:text-neutral-100">List of Users</h1>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Card-based directory (3 per row on desktop, clean black & white).</p>
        </div>
        {/* Search */}
        <div className="flex w-full items-center gap-2 sm:w-80">
          <div className="flex w-full items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800">
            <SearchIcon style={{ fontSize: 16 }} className="dark:text-neutral-300" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, username, or mobile…"
              className="h-6 w-full border-none bg-transparent text-sm outline-none dark:text-neutral-100 dark:placeholder-neutral-400"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <ProfileCard key={p.username} p={p} onLogin={handleLogin} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full rounded-xl border border-neutral-200 bg-white p-6 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
            No profiles match "{query}".
          </div>
        )}
      </div>
    </div>
    </TooltipProvider>
  );
}
