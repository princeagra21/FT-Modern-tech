"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import HomeIcon from "@mui/icons-material/Home";
import CallIcon from "@mui/icons-material/Call";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import VerifiedIcon from "@mui/icons-material/Verified";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LoginIcon from "@mui/icons-material/Login";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BadgeIcon from "@mui/icons-material/Badge";

import {
  SmartCheckboxAutoTable,
  type DisplayMap,
  type FilterConfigMap,
  type MultiSelectOption,
} from "@/components/common/smartcheckboxautotable";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import AdminRightDrawerInfo from "@/components/superadmin/adminrightdrawerinfo";
import { AdminRow } from "@/lib/types/superadmin";
import { ADMIN_DATA } from "@/lib/data/superadmin";



export default function Page() {
  const router = useRouter();

  // reactive state
  const [adminData, setAdminData] = useState<AdminRow[]>(ADMIN_DATA);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>();

  // ✅ SUPER SIMPLE REFRESH: call API → set state
  const handleRefresh = async () => {
    // Replace the URL with your real API endpoint

    console.log("Refresh admin data");

    // const res = await fetch("/api/admins?limit=50", { cache: "no-store" });
    // if (!res.ok) throw new Error("Failed to refresh admins");
    // const data: AdminRow[] = await res.json();
    // setAdminData(data);

    // NOTE: If API not ready, you can temporarily simulate:
    // await new Promise(r => setTimeout(r, 500));
    // setAdminData(prev => [...prev].sort(() => Math.random() - 0.5));
  };

  // Toggle active status (unchanged)
  const toggleActiveStatus = async (userId: string) => {
    setLoadingStates((prev) => ({ ...prev, [userId]: true }));
    try {
      const current = adminData.find((a) => a.id === userId);
      if (!current) return;
      const next = !current.isActive;

      // await fetch(`/api/admins/${userId}/status`, { method: "POST", body: JSON.stringify({ isActive: next }) });

      setAdminData((prev) =>
        prev.map((a) => (a.id === userId ? { ...a, isActive: next } : a))
      );
    } finally {
      setLoadingStates((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // -------- table columns --------
  const displayOptions: DisplayMap<AdminRow> = {
    0: {
      title: () => (
        <div className="flex items-center gap-1.5 font-medium text-[10px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
          <PersonIcon
            style={{ fontSize: "14px" }}
            className="text-neutral-500 dark:text-neutral-400"
          />
          Administrator
        </div>
      ),
      content: (row) => (
        <div className="group">
          <div
            className="flex gap-2 cursor-pointer py-1 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`administrators/${row.id}`);
            }}
          >
            <Avatar className="h-8 w-8 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center flex-shrink-0">
              <AvatarImage
                src={row?.profileUrl}
                alt={row?.name}
                className="rounded-lg"
              />
              <AvatarFallback className="text-[11px] font-medium">
                {row?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-[13px] font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors truncate">
                  {row.name}
                </h3>
                {row.isEmailVerified && (
                  <VerifiedIcon
                    style={{ fontSize: "13px" }}
                    className="text-blue-500 dark:text-blue-400 flex-shrink-0"
                  />
                )}
              </div>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono mt-0.5">
                {row.mobilePrefix} {row.mobileNumber}
              </div>
            </div>
          </div>
        </div>
      ),
      tooltip: (row) => (
        <div className="p-2 max-w-xs">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-700 dark:text-neutral-300 font-medium text-[10px]">
              {row.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div>
              <div className="font-semibold text-[12px] text-neutral-900 dark:text-neutral-100">
                {row.name}
              </div>
              <div className="text-[9px] text-neutral-500 dark:text-neutral-400">
                Administrator
              </div>
            </div>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex items-center gap-1.5">
              <EmailIcon
                style={{ fontSize: "11px" }}
                className="text-neutral-400 dark:text-neutral-500"
              />
              <span className="text-neutral-700 dark:text-neutral-300 truncate">
                {row.email}
              </span>
              {row.isEmailVerified && (
                <VerifiedIcon
                  style={{ fontSize: "10px" }}
                  className="text-blue-500 dark:text-blue-400 flex-shrink-0"
                />
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <CallIcon
                style={{ fontSize: "11px" }}
                className="text-neutral-400 dark:text-neutral-500"
              />
              <span className="text-neutral-700 dark:text-neutral-300 font-mono">
                {row.mobilePrefix} {row.mobileNumber}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <LocationOnIcon
                style={{ fontSize: "11px" }}
                className="text-neutral-400 dark:text-neutral-500"
              />
              <span className="text-neutral-700 dark:text-neutral-300">
                {row.city}, {row.country}
              </span>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-700">
            <div className="flex justify-between text-[10px]">
              <span className="text-neutral-500 dark:text-neutral-400">
                Fleet:
              </span>
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                {row.vehicles} vehicles
              </span>
            </div>
            <div className="flex justify-between text-[10px] mt-1">
              <span className="text-neutral-500 dark:text-neutral-400">
                Credits:
              </span>
              <span className="font-medium text-neutral-900 dark:text-neutral-100">
                {row.credits}
              </span>
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center gap-1 text-[10px] text-neutral-500 dark:text-neutral-400">
              <AccessTimeIcon style={{ fontSize: "9px" }} />
              <span>Last: {row.lastLogin || "Never"}</span>
            </div>
          </div>
        </div>
      ),
    },
    1: {
      title: () => (
        <div className="flex items-center gap-1.5 font-medium text-[10px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
          <AccountCircleIcon
            style={{ fontSize: "14px" }}
            className="text-neutral-500 dark:text-neutral-400"
          />
          Account
        </div>
      ),
      content: (row) => (
        <div className="space-y-1 py-0.5">
          <div className="flex items-center gap-1.5">
            <BadgeIcon
              style={{ fontSize: "12px" }}
              className="text-neutral-400 dark:text-neutral-500"
            />
            <span className="text-[12px] font-medium text-neutral-700 dark:text-neutral-300">
              @{row.username}
            </span>
          </div>
          <div className="flex items-start gap-1.5">
            <EmailIcon
              style={{ fontSize: "12px" }}
              className="text-neutral-400 dark:text-neutral-500 mt-0.5 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <a
                href={`mailto:${row.email}`}
                className="text-[11px] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:underline transition-colors truncate block"
                onClick={(e) => e.stopPropagation()}
              >
                {row.email}
              </a>
              {row.isEmailVerified ? (
                <span className="inline-flex items-center gap-0.5 mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                  <VerifiedIcon style={{ fontSize: "9px" }} />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400">
                  Pending
                </span>
              )}
            </div>
          </div>
        </div>
      ),
    },
    2: {
      title: () => (
        <div className="flex items-center gap-1.5 font-medium text-[10px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
          <DirectionsCarIcon
            style={{ fontSize: "14px" }}
            className="text-neutral-500 dark:text-neutral-400"
          />
          Fleet
        </div>
      ),
      content: (row) => (
        <div className="text-center py-0.5">
          <div className="text-[21px] font-semibold text-neutral-900 dark:text-neutral-100 leading-none">
            {row.vehicles?.toLocaleString() || 0}
          </div>
          <div className="text-[8px] text-neutral-500 dark:text-neutral-400 mt-1 uppercase tracking-wide">
            {row.vehicles === 1 ? "Vehicle" : "Vehicles"}
          </div>
        </div>
      ),
    },
    3: {
      title: () => (
        <div className="flex items-center gap-1.5 font-medium text-[10px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
          <CreditCardIcon
            style={{ fontSize: "14px" }}
            className="text-neutral-500 dark:text-neutral-400"
          />
          Credits
        </div>
      ),
      content: (row) => (
        <div className="text-center py-0.5">
          <div className="text-[21px] font-semibold text-neutral-900 dark:text-neutral-100 leading-none">
            {row.credits.toLocaleString()}
          </div>
          <div
            className={`text-[8px] mt-1 font-medium uppercase tracking-wide ${
              row.credits > 50
                ? "text-emerald-600 dark:text-emerald-400"
                : row.credits > 20
                ? "text-amber-600 dark:text-amber-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {row.credits > 50 ? "High" : row.credits > 20 ? "Medium" : "Low"}
          </div>
        </div>
      ),
    },
    4: {
      title: () => (
        <div className="flex items-center gap-1.5 font-medium text-[10px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
          <LoginIcon
            style={{ fontSize: "14px" }}
            className="text-neutral-500 dark:text-neutral-400"
          />
          Action
        </div>
      ),
      content: () => (
        <div className="py-0.5">
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-3 text-[11px] font-medium border-neutral-300 dark:border-neutral-600 hover:bg-neutral-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors"
          >
            <LoginIcon style={{ fontSize: "13px" }} className="mr-1" />
            Login
          </Button>
        </div>
      ),
    },
    5: {
      title: () => (
        <div className="flex items-center gap-1.5 font-medium text-[10px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
          <AccessTimeIcon
            style={{ fontSize: "14px" }}
            className="text-neutral-500 dark:text-neutral-400"
          />
          Recent Login
        </div>
      ),
      content: (row) => (
        <div className="py-0.5">
          {row.lastLogin ? (
            <div className="flex items-center gap-1.5">
              <AccessTimeIcon
                style={{ fontSize: "13px" }}
                className="text-neutral-400 dark:text-neutral-500"
              />
              <div>
                <div className="text-[12px] font-medium text-neutral-900 dark:text-neutral-100">
                  {new Date(row.lastLogin).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
                  {new Date(row.lastLogin).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <AccessTimeIcon
                style={{ fontSize: "13px" }}
                className="text-neutral-300 dark:text-neutral-600"
              />
              <span className="text-[11px] text-neutral-400 dark:text-neutral-500 italic">
                Never
              </span>
            </div>
          )}
        </div>
      ),
    },
    6: {
      title: () => (
        <div className="flex items-center gap-1.5 font-medium text-[10px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
          <PersonIcon
            style={{ fontSize: "14px" }}
            className="text-neutral-500 dark:text-neutral-400"
          />
          Status
        </div>
      ),
      content: (row) => {
        const isLoading = loadingStates[row.id] || false;
        return (
          <div className="flex items-center gap-2 py-0.5">
            <Toggle
              checked={row.isActive}
              onChange={() => toggleActiveStatus(row.id)}
              disabled={isLoading}
              size="sm"
              onClick={(e) => e.stopPropagation()}
            />
            {isLoading && (
              <div className="w-3 h-3 border-2 border-neutral-900 dark:border-neutral-100 border-t-transparent rounded-full animate-spin" />
            )}
          </div>
        );
      },
    },
    7: {
      title: () => (
        <div className="flex items-center gap-1.5 font-medium text-[10px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
          <LocationOnIcon
            style={{ fontSize: "14px" }}
            className="text-neutral-500 dark:text-neutral-400"
          />
          Location
        </div>
      ),
      content: (row) => (
        <div className="flex items-start gap-1.5 py-0.5">
          <span
            className={`fi fi-${row.countryCode.toLowerCase()} mt-0.5`}
            style={{ fontSize: "13px" }}
          />
          <div className="flex-1 min-w-0">
            {row.address && (
              <div className="text-[11px] text-neutral-700 dark:text-neutral-300 truncate">
                {row.address}
              </div>
            )}
            <div className="text-[10px] text-neutral-500 dark:text-neutral-400 capitalize mt-0.5">
              {row.city}, {row.country}
            </div>
          </div>
        </div>
      ),
    },
    8: {
      title: () => (
        <div className="flex items-center gap-1.5 font-medium text-[10px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
          <CalendarTodayIcon
            style={{ fontSize: "14px" }}
            className="text-neutral-500 dark:text-neutral-400"
          />
          Joined
        </div>
      ),
      content: (row) => (
        <div className="flex items-center gap-1.5 py-0.5">
          <CalendarTodayIcon
            style={{ fontSize: "13px" }}
            className="text-neutral-400 dark:text-neutral-500"
          />
          <div>
            <div className="text-[12px] font-medium text-neutral-900 dark:text-neutral-100">
              {new Date(row.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
            <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
              {(() => {
                const days = Math.floor(
                  (Date.now() - new Date(row.createdAt).getTime()) /
                    (1000 * 60 * 60 * 24)
                );
                return days === 0 ? "Today" : days === 1 ? "1 day" : `${days}d`;
              })()}
            </div>
          </div>
        </div>
      ),
    },
    9: {
      title: () => (
        <div className="flex items-center gap-1.5 font-medium text-[10px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
          <BusinessIcon
            style={{ fontSize: "14px" }}
            className="text-neutral-500 dark:text-neutral-400"
          />
          Organization
        </div>
      ),
      content: (row) => (
        <div className="flex items-center gap-1.5 py-0.5">
          <BusinessIcon
            style={{ fontSize: "13px" }}
            className="text-neutral-400 dark:text-neutral-500"
          />
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-medium text-neutral-900 dark:text-neutral-100 truncate">
              {row.companies?.[0]?.name || "No Company"}
            </div>
            {row.companies?.length ? (
              <span className="inline-block text-[9px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                Primary
              </span>
            ) : (
              <span className="inline-block text-[9px] text-neutral-400 dark:text-neutral-500 italic mt-0.5">
                Independent
              </span>
            )}
          </div>
        </div>
      ),
    },
  };

  // -------- filters --------
  const filterConfig: FilterConfigMap<AdminRow> = {
    name: { kind: "text", label: "🔍 Search Name", field: "name" },
    email: { kind: "text", label: "📧 Search Email", field: "email" },
    username: { kind: "text", label: "👤 Search Username", field: "username" },
    country: {
      kind: "custom",
      label: "🌍 Country",
      editor: (value, setValue) => {
        const [isOpen, setIsOpen] = React.useState(false);
        const [searchQuery, setSearchQuery] = React.useState("");
        const countries = Array.from(
          new Map(
            adminData
              .filter((admin) => admin.country && admin.countryCode)
              .map(
                (admin) =>
                  [admin.country, admin.countryCode] as [string, string]
              )
          )
        ).sort(([a], [b]) => a.localeCompare(b));

        const selectedCountry = countries.find(
          ([country]) => country === value
        );

        // Filter countries based on search query
        const filteredCountries = countries.filter(([country]) =>
          country.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsOpen(!isOpen);
                setSearchQuery(""); // Reset search when opening
              }}
              className="w-full h-8 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-2.5 text-[11px] outline-none flex items-center justify-between text-left hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors"
            >
              <div className="flex items-center gap-1.5">
                {selectedCountry ? (
                  <>
                    <span
                      className={`fi fi-${selectedCountry[1].toLowerCase()}`}
                      style={{ fontSize: "11px" }}
                    />
                    <span className="text-neutral-900 dark:text-neutral-100">
                      {selectedCountry[0]}
                    </span>
                  </>
                ) : (
                  <span className="text-neutral-500 dark:text-neutral-400">
                    (Any Country)
                  </span>
                )}
              </div>
              <svg
                className="w-3 h-3 text-neutral-400 dark:text-neutral-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md shadow-lg max-h-80 overflow-hidden">
                {/* Search Input */}
                <div className="p-1.5 border-b border-neutral-200 dark:border-neutral-700">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search countries..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-7 pl-7 pr-2 rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-[11px] outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-500 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                    <svg
                      className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Options List */}
                <div className="max-h-52 overflow-y-auto">
                  <div
                    className="px-2.5 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer text-[11px] border-b border-neutral-100 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100"
                    onClick={() => {
                      setValue(undefined);
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                  >
                    <span className="text-neutral-500 dark:text-neutral-400">
                      (Any Country)
                    </span>
                  </div>

                  {filteredCountries.length > 0 ? (
                    filteredCountries.map(([country, countryCode]) => (
                      <div
                        key={country}
                        className="px-2.5 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer flex items-center gap-1.5 text-[11px] text-neutral-900 dark:text-neutral-100"
                        onClick={() => {
                          setValue(country);
                          setIsOpen(false);
                          setSearchQuery("");
                        }}
                      >
                        <span
                          className={`fi fi-${countryCode.toLowerCase()}`}
                          style={{ fontSize: "11px" }}
                        />
                        <span>{country}</span>
                      </div>
                    ))
                  ) : (
                    <div className="px-2.5 py-3 text-[10px] text-neutral-500 dark:text-neutral-400 text-center">
                      No countries found matching "{searchQuery}"
                    </div>
                  )}
                </div>
              </div>
            )}

            {isOpen && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => {
                  setIsOpen(false);
                  setSearchQuery("");
                }}
              />
            )}
          </div>
        );
      },
      predicate: (row, value) => {
        if (!value) return true;
        return row.country === value;
      },
    },
    city: {
      kind: "custom",
      label: "🏙️ City",
      editor: (value, setValue) => {
        const [isOpen, setIsOpen] = React.useState(false);
        const [searchQuery, setSearchQuery] = React.useState("");
        const cities = Array.from(
          new Set(
            adminData.filter((admin) => admin.city).map((admin) => admin.city)
          )
        ).sort((a, b) => a.localeCompare(b));

        // Filter cities based on search query
        const filteredCities = cities.filter((city) =>
          city.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsOpen(!isOpen);
                setSearchQuery(""); // Reset search when opening
              }}
              className="w-full h-8 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-2.5 text-[11px] outline-none flex items-center justify-between text-left hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors"
            >
              <div className="flex items-center gap-1.5">
                {value ? (
                  <span className="capitalize text-neutral-900 dark:text-neutral-100">
                    {value}
                  </span>
                ) : (
                  <span className="text-neutral-500 dark:text-neutral-400">
                    (Any City)
                  </span>
                )}
              </div>
              <svg
                className="w-3 h-3 text-neutral-400 dark:text-neutral-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md shadow-lg max-h-80 overflow-hidden">
                {/* Search Input */}
                <div className="p-1.5 border-b border-neutral-200 dark:border-neutral-700">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search cities..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-7 pl-7 pr-2 rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-[11px] outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-500 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                    <svg
                      className="absolute left-2 top-2 w-3 h-3 text-neutral-400 dark:text-neutral-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Options List */}
                <div className="max-h-52 overflow-y-auto">
                  <div
                    className="px-2.5 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer text-[11px] border-b border-neutral-100 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100"
                    onClick={() => {
                      setValue(undefined);
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                  >
                    <span className="text-neutral-500 dark:text-neutral-400">
                      (Any City)
                    </span>
                  </div>

                  {filteredCities.length > 0 ? (
                    filteredCities.map((city) => (
                      <div
                        key={city}
                        className="px-2.5 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer flex items-center gap-1.5 text-[11px] text-neutral-900 dark:text-neutral-100"
                        onClick={() => {
                          setValue(city);
                          setIsOpen(false);
                          setSearchQuery("");
                        }}
                      >
                        <span className="capitalize">{city}</span>
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-4 text-sm text-slate-500 text-center">
                      No cities found matching "{searchQuery}"
                    </div>
                  )}
                </div>
              </div>
            )}

            {isOpen && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => {
                  setIsOpen(false);
                  setSearchQuery("");
                }}
              />
            )}
          </div>
        );
      },
      predicate: (row, value) => {
        if (!value) return true;
        return row.city === value;
      },
    },
    company: {
      kind: "custom",
      label: "🏢 Company",
      editor: (value, setValue) => {
        const [isOpen, setIsOpen] = React.useState(false);
        const [searchQuery, setSearchQuery] = React.useState("");
        const companies = Array.from(
          new Set(
            adminData
              .flatMap((admin) => admin.companies?.map((c) => c.name) || [])
              .filter(Boolean)
          )
        ).sort();

        // Filter companies based on search query
        const filteredCompanies = companies.filter((company) =>
          company.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsOpen(!isOpen);
                setSearchQuery(""); // Reset search when opening
              }}
              className="w-full h-8 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-2.5 text-[11px] outline-none flex items-center justify-between text-left hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors"
            >
              <div className="flex items-center gap-1.5">
                {value ? (
                  <span className="truncate text-neutral-900 dark:text-neutral-100">
                    {value}
                  </span>
                ) : (
                  <span className="text-neutral-500 dark:text-neutral-400">
                    (Any Company)
                  </span>
                )}
              </div>
              <svg
                className="w-3 h-3 text-neutral-400 dark:text-neutral-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md shadow-lg max-h-80 overflow-hidden">
                {/* Search Input */}
                <div className="p-1.5 border-b border-neutral-200 dark:border-neutral-700">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search companies..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-7 pl-7 pr-2 rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-[11px] outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-500 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                    <svg
                      className="absolute left-2 top-2 w-3 h-3 text-neutral-400 dark:text-neutral-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Options List */}
                <div className="max-h-52 overflow-y-auto">
                  <div
                    className="px-2.5 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer text-[11px] border-b border-neutral-100 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100"
                    onClick={() => {
                      setValue(undefined);
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                  >
                    <span className="text-neutral-500 dark:text-neutral-400">
                      (Any Company)
                    </span>
                  </div>

                  {filteredCompanies.length > 0 ? (
                    filteredCompanies.map((company) => (
                      <div
                        key={company}
                        className="px-2.5 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer flex items-center gap-1.5 text-[11px] text-neutral-900 dark:text-neutral-100"
                        onClick={() => {
                          setValue(company);
                          setIsOpen(false);
                          setSearchQuery("");
                        }}
                      >
                        <span className="truncate">{company}</span>
                      </div>
                    ))
                  ) : (
                    <div className="px-2.5 py-3 text-[10px] text-neutral-500 dark:text-neutral-400 text-center">
                      No companies found matching "{searchQuery}"
                    </div>
                  )}
                </div>
              </div>
            )}

            {isOpen && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => {
                  setIsOpen(false);
                  setSearchQuery("");
                }}
              />
            )}
          </div>
        );
      },
      predicate: (row, value) => {
        if (!value) return true;
        return row.companies?.some((c) => c.name === value) || false;
      },
    },
    _status: {
      kind: "boolean",
      label: "✅ Account Status",
      field: "isActive",
      tristate: true,
    },
    _verified: {
      kind: "boolean",
      label: "📝 Email Verified",
      field: "isEmailVerified",
      tristate: true,
    },
    vehicles: {
      kind: "numberRange",
      label: "🚗 Vehicle Count",
      field: "vehicles",
    },
    credits: {
      kind: "numberRange",
      label: "💳 Credits Range",
      field: "credits",
    },
    lastLogin: {
      kind: "dateRange",
      label: "⏰ Last Login Range",
      field: "lastLogin",
    },
    createdAt: {
      kind: "dateRange",
      label: "📅 Registration Range",
      field: "createdAt",
    },
  };

  // -------- bulk actions --------
  const bulkActions: MultiSelectOption<AdminRow>[] = [
    {
      name: "🗑️ Delete Selected",
      iconName: "delete_outline",
      variant: "destructive",
      tooltip: "Permanently remove selected administrators",
      callback: (rows, ids) => {
        console.log(
          "Bulk delete",
          rows.map((r) => r.id),
          ids
        );
      },
    },
    {
      name: "💳 Assign Credits",
      iconName: "credit_card",
      variant: "outline",
      tooltip: "Add credits to selected administrator accounts",
      callback: (rows, ids) => {
        console.log(
          "Bulk assign credits",
          rows.map((r) => r.id),
          ids
        );
      },
    },
    {
      name: "🚫 Deactivate All",
      iconName: "person_off",
      variant: "outline",
      tooltip: "Deactivate selected administrator accounts",
      callback: (rows) => {
        setAdminData((prevData) =>
          prevData.map((admin) =>
            rows.some((r) => r.id === admin.id)
              ? { ...admin, isActive: false }
              : admin
          )
        );
      },
    },
    {
      name: "✅ Activate All",
      iconName: "person",
      variant: "outline",
      tooltip: "Activate selected administrator accounts",
      callback: (rows) => {
        setAdminData((prevData) =>
          prevData.map((admin) =>
            rows.some((r) => r.id === admin.id)
              ? { ...admin, isActive: true }
              : admin
          )
        );
      },
    },
    {
      name: "📧 Send Email",
      iconName: "email",
      variant: "outline",
      tooltip: "Send notification email to selected administrators",
      callback: (rows) => {
        console.log(
          "Bulk email",
          rows.map((r) => r.email)
        );
      },
    },
  ];

  return (
    <>
      <SmartCheckboxAutoTable<AdminRow>
        title="Administrator Management"
        data={adminData}
        getRowId={(r) => r.id}
        displayOptions={displayOptions}
        filterConfig={filterConfig}
        multiSelectOptions={bulkActions}
        onRowClick={(row) => {
          console.log("Row Clicked →", row.name);
          setSelectedUserId(row.id);
          setDrawerOpen(true);
        }}
        onRefresh={handleRefresh} // ✅ only one function, super simple
        exportBrand={{
          name: "Fleet Stack",
          logoUrl: "/images/logo-light.png",
          addressLine1: "Self-Hosted GPS Software",
          addressLine2: "fleetstackglobal.com",
          footerNote: "We make it easiest — just deploy.",
        }}
      />

      {/* Admin Details Drawer */}
      <AdminRightDrawerInfo
        userId={selectedUserId}
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedUserId(undefined);
        }}
      />
    </>
  );
}
