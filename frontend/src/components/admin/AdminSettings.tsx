"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Icons
import SettingsIcon from "@mui/icons-material/Settings";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import RestoreIcon from "@mui/icons-material/Restore";
import SaveIcon from "@mui/icons-material/Save";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

type ReverseGeocodingDigits = "2" | "3";

const BACKUP_RETENTION_OPTIONS = [
  { value: "1-month", label: "1 Month" },
  { value: "3-months", label: "3 Months" },
  { value: "6-months", label: "6 Months" },
  { value: "9-months", label: "9 Months" },
  { value: "1-year", label: "1 Year" },
  { value: "1.5-years", label: "1 Year 6 Months" },
  { value: "2-years", label: "2 Years" },
  { value: "3-years", label: "3 Years" },
  { value: "5-years", label: "5 Years" },
  { value: "forever", label: "Forever" },
];

// ---------------- Persistence ----------------

const LS_KEY = "admin-settings-v1";

type AdminSettings = {
  demoLoginEnabled: boolean;
  reverseGeocodingDigits: ReverseGeocodingDigits;
  databaseBackupRetention: string;
  signupAllowed: boolean;
  signupFreeCredits: number;
};

const DEFAULTS: AdminSettings = {
  demoLoginEnabled: false,
  reverseGeocodingDigits: "2",
  databaseBackupRetention: "3-months",
  signupAllowed: true,
  signupFreeCredits: 100,
};

function loadSettings(): AdminSettings {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as AdminSettings;
    return { ...DEFAULTS, ...parsed };
  } catch {
    return DEFAULTS;
  }
}

function saveSettings(s: AdminSettings) {
  localStorage.setItem(LS_KEY, JSON.stringify(s));
}

// ---------------- Helpers ----------------

function classNames(...cx: Array<string | false | undefined>) {
  return cx.filter(Boolean).join(" ");
}

// ---------------- State ----------------
export default function AdminSettings() {
  const [settings, setSettings] = useState(DEFAULTS);

  useEffect(() => setSettings(loadSettings()), []);

  const set = <K extends keyof AdminSettings>(
    key: K,
    value: AdminSettings[K]
  ) => setSettings((prev) => ({ ...prev, [key]: value }));

  const onSave = () => saveSettings(settings);
  const onReset = () => {
    setSettings(DEFAULTS);
    saveSettings(DEFAULTS);
  };

  return (
    <div className=" px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-foreground/5"
          >
            <SettingsIcon className="text-foreground/90" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">
              Application Settings
            </h1>
            <p className="text-sm text-muted">
              Configure system-wide settings for your application.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onReset} className="rounded-lg">
            <RestoreIcon className="mr-2" /> Reset
          </Button>
          <Button onClick={onSave} className="rounded-lg">
            <SaveIcon className="mr-2" /> Save
          </Button>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* Signup Settings */}
        <Card
          title="Signup Configuration"
          icon={<PersonAddIcon />}
          className="md:col-span-2 xl:col-span-3"
        >
          <div className="space-y-6">
            {/* Allow Signup */}
            <div className="flex items-center justify-between rounded-xl border border-border bg-background p-5">
              <div className="space-y-1">
                <span className="font-medium text-foreground text-sm">
                  Allow New Signups
                </span>
                <p className="text-xs text-muted">
                  {settings.signupAllowed
                    ? "New users can register"
                    : "Signup is currently disabled"}
                </p>
              </div>
              <Switch
                checked={settings.signupAllowed}
                onCheckedChange={(v) => set("signupAllowed", Boolean(v))}
              />
            </div>

            {/* Credits Input */}
            {settings.signupAllowed && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="rounded-xl border border-border bg-foreground/5/40 p-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <AccountBalanceWalletIcon className="text-foreground/80 h-5 w-5" />
                  <Label className="text-sm font-medium text-foreground">
                    Free Signup Credits
                  </Label>
                </div>
                <Input
                  type="number"
                  min="0"
                  step="10"
                  value={settings.signupFreeCredits}
                  onChange={(e) =>
                    set("signupFreeCredits", parseInt(e.target.value) || 0)
                  }
                  className="rounded-lg"
                  placeholder="100"
                />
                <p className="mt-2 text-xs text-muted">
                  Credits awarded to new users when they register
                </p>
              </motion.div>
            )}

            {/* Hint when disabled */}
            {!settings.signupAllowed && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-muted italic"
              >
                Enable signups to configure free credits for new users.
              </motion.p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ---------------- Reusable Card Component ---------------- */
function Card({ title, icon, children, className }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className={`rounded-2xl border border-border bg-background p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/5 border border-border text-foreground/80">
          {icon}
        </div>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}
