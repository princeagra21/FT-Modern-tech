"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

// shadcn/ui — adjust import paths to your setup
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input"; // optional (used for search in timezone)
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Material Design Icons (MUI Icons)
import SettingsIcon from "@mui/icons-material/Settings";
import PublicIcon from "@mui/icons-material/Public";
import TranslateIcon from "@mui/icons-material/Translate";
import FormatTextdirectionRToLIcon from "@mui/icons-material/FormatTextdirectionRToL";
import FormatTextdirectionLToRIcon from "@mui/icons-material/FormatTextdirectionLToR";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import MonitorIcon from "@mui/icons-material/Monitor";
import StraightenIcon from "@mui/icons-material/Straighten";
import TodayIcon from "@mui/icons-material/Today";
import RestoreIcon from "@mui/icons-material/Restore";
import SaveIcon from "@mui/icons-material/Save";

// ---------------- Types & Constants ----------------

type Theme = "light" | "dark" | "system";
type Units = "km" | "miles";
type Direction = "ltr" | "rtl";

// Locales (expand as needed)
const LANGUAGE_OPTIONS = [
  { code: "en-IN", label: "English (India)" },
  { code: "en-US", label: "English (US)" },
  { code: "en-GB", label: "English (UK)" },
  { code: "hi-IN", label: "हिन्दी (India)" },
  { code: "ar-SA", label: "العربية (Saudi)" },
  { code: "fr-FR", label: "Français (France)" },
];

// Expanded date formats (includes dot/slash/dash, month names, weekday variants)
const DATE_FORMATS = [
  { id: "DD-MMM-YYYY", label: "24 Oct 2025" },
  { id: "DD/MM/YYYY", label: "24/10/2025" },
  { id: "YYYY-MM-DD", label: "2025-10-24" },
  { id: "MMM DD, YYYY", label: "Oct 24, 2025" },
  { id: "DD.MM.YYYY", label: "24.10.2025" },
  { id: "MM/DD/YYYY", label: "10/24/2025" },
  { id: "D MMM YYYY", label: "24 Oct 2025" },
  { id: "ddd, DD MMM YYYY", label: "Fri, 24 Oct 2025" },
  { id: "MMMM DD, YYYY", label: "October 24, 2025" },
] as const;

// First day of week options
const FIRST_DOW = [
  { id: "monday", label: "Monday" },
  { id: "sunday", label: "Sunday" },
  { id: "saturday", label: "Saturday" },
];

// Timezone offset options (simplified - just numbers)
const TIMEZONE_OFFSETS = [
  { value: "-12:00", label: "-12:00" },
  { value: "-11:00", label: "-11:00" },
  { value: "-10:00", label: "-10:00" },
  { value: "-09:30", label: "-09:30" },
  { value: "-09:00", label: "-09:00" },
  { value: "-08:00", label: "-08:00" },
  { value: "-07:00", label: "-07:00" },
  { value: "-06:00", label: "-06:00" },
  { value: "-05:00", label: "-05:00" },
  { value: "-04:00", label: "-04:00" },
  { value: "-03:30", label: "-03:30" },
  { value: "-03:00", label: "-03:00" },
  { value: "-02:00", label: "-02:00" },
  { value: "-01:00", label: "-01:00" },
  { value: "+00:00", label: "+00:00" },
  { value: "+01:00", label: "+01:00" },
  { value: "+02:00", label: "+02:00" },
  { value: "+03:00", label: "+03:00" },
  { value: "+03:30", label: "+03:30" },
  { value: "+04:00", label: "+04:00" },
  { value: "+04:30", label: "+04:30" },
  { value: "+05:00", label: "+05:00" },
  { value: "+05:30", label: "+05:30" },
  { value: "+05:45", label: "+05:45" },
  { value: "+06:00", label: "+06:00" },
  { value: "+06:30", label: "+06:30" },
  { value: "+07:00", label: "+07:00" },
  { value: "+08:00", label: "+08:00" },
  { value: "+08:45", label: "+08:45" },
  { value: "+09:00", label: "+09:00" },
  { value: "+09:30", label: "+09:30" },
  { value: "+10:00", label: "+10:00" },
  { value: "+10:30", label: "+10:30" },
  { value: "+11:00", label: "+11:00" },
  { value: "+12:00", label: "+12:00" },
  { value: "+12:45", label: "+12:45" },
  { value: "+13:00", label: "+13:00" },
  { value: "+14:00", label: "+14:00" },
];

// Get system timezone offset
function getSystemTimezoneOffset(): string {
  const offset = -new Date().getTimezoneOffset();
  const hours = Math.floor(Math.abs(offset) / 60);
  const minutes = Math.abs(offset) % 60;
  const sign = offset >= 0 ? "+" : "-";
  return `${sign}${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

// ---------------- Persistence ----------------

const LS_KEY = "admin-settings-v1";

type AdminSettings = {
  language: string;
  direction: Direction;
  dateFormatId: (typeof DATE_FORMATS)[number]["id"];
  time24h: boolean; // true = 24h, false = 12h
  theme: Theme;
  timezone: string; // UTC offset format like "+05:30"
  units: Units;
  firstDayOfWeek: string; // monday|sunday|saturday
};

const DEFAULTS: AdminSettings = {
  language: "en-IN",
  direction: "ltr",
  dateFormatId: "DD-MMM-YYYY",
  time24h: true,
  theme: "system",
  timezone: getSystemTimezoneOffset(),
  units: "km",
  firstDayOfWeek: "monday",
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

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function getPart(
  date: Date,
  locale: string,
  tz: string,
  opts: Intl.DateTimeFormatOptions
) {
  return new Intl.DateTimeFormat(locale, { timeZone: tz, ...opts }).format(
    date
  );
}

function formatDateByPattern(
  date: Date,
  locale: string,
  tz: string,
  pattern: AdminSettings["dateFormatId"]
) {
  const Y = getPart(date, locale, tz, { year: "numeric" });
  const M2 = getPart(date, locale, tz, { month: "2-digit" });
  const MN = getPart(date, locale, tz, { month: "numeric" });
  const MMM = getPart(date, locale, tz, { month: "short" });
  const MMMM = getPart(date, locale, tz, { month: "long" });
  const D2 = getPart(date, locale, tz, { day: "2-digit" });
  const D = getPart(date, locale, tz, { day: "numeric" });
  const ddd = getPart(date, locale, tz, { weekday: "short" });

  switch (pattern) {
    case "DD-MMM-YYYY":
      return `${D2} ${MMM} ${Y}`;
    case "DD/MM/YYYY":
      return `${D2}/${M2}/${Y}`;
    case "YYYY-MM-DD":
      return `${Y}-${pad2(Number(MN))}-${D2}`;
    case "MMM DD, YYYY":
      return `${MMM} ${D2}, ${Y}`;
    case "DD.MM.YYYY":
      return `${D2}.${M2}.${Y}`;
    case "MM/DD/YYYY":
      return `${pad2(Number(MN))}/${D2}/${Y}`;
    case "D MMM YYYY":
      return `${D} ${MMM} ${Y}`;
    case "ddd, DD MMM YYYY":
      return `${ddd}, ${D2} ${MMM} ${Y}`;
    case "MMMM DD, YYYY":
      return `${MMMM} ${D2}, ${Y}`;
    default:
      return `${D2} ${MMM} ${Y}`;
  }
}

function formatPreviewDate(
  date: Date,
  locale: string,
  tzOffset: string,
  dateFormatId: AdminSettings["dateFormatId"],
  use24h: boolean
) {
  // Parse offset string like "+05:30" or "-08:00"
  const match = tzOffset.match(/([+-])(\d{2}):(\d{2})/);
  if (!match) {
    const timeOpts: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: !use24h,
    };
    const dateStr = formatDateByPattern(date, locale, "UTC", dateFormatId);
    const timeStr = new Intl.DateTimeFormat(locale, timeOpts).format(date);
    return { dateStr, timeStr };
  }

  const sign = match[1] === "+" ? 1 : -1;
  const hours = parseInt(match[2], 10);
  const minutes = parseInt(match[3], 10);
  const offsetMs = sign * (hours * 60 + minutes) * 60 * 1000;

  // Adjust date by offset
  const adjustedDate = new Date(date.getTime() + offsetMs);

  const timeOpts: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: !use24h,
    timeZone: "UTC",
  };
  const dateStr = formatDateByPattern(
    adjustedDate,
    locale,
    "UTC",
    dateFormatId
  );
  const timeStr = new Intl.DateTimeFormat(locale, timeOpts).format(
    adjustedDate
  );
  return { dateStr, timeStr };
}

function classNames(...cx: Array<string | false | undefined>) {
  return cx.filter(Boolean).join(" ");
}

// ---------------- Component ----------------

export default function AdminSettingPage() {
  const [settings, setSettings] = useState<AdminSettings>(DEFAULTS);
  const [tzQuery, setTzQuery] = useState("");

  // Load
  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  const now = new Date();
  const preview = formatPreviewDate(
    now,
    settings.language,
    settings.timezone,
    settings.dateFormatId,
    settings.time24h
  );

  // Handlers
  const set = <K extends keyof AdminSettings>(
    key: K,
    value: AdminSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const onSave = () => {
    saveSettings(settings);
  };
  const onReset = () => {
    setSettings(DEFAULTS);
    saveSettings(DEFAULTS);
  };

  const previewTheme = settings.theme; // light|dark|system
  const isDark = previewTheme === "dark";

  return (
<div className="mx-auto max-w-7xl px-6 py-8">
  {/* Header */}
  <div className="mb-6 flex items-center justify-between gap-4">
    <div className="flex items-center gap-3">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-foreground/5"
      >
        <SettingsIcon className="text-muted" />
      </motion.div>
      <div>
        <h1 className="typo-h1">
          Admin Setting
        </h1>
        <p className="text-sm text-muted">
          Premium static settings for language, layout, formats, theme,
          timezone & units.
        </p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        onClick={onReset}
        className="rounded-xl border-border text-foreground hover:bg-background"
      >
        <RestoreIcon className="mr-2" /> Reset
      </Button>
      <Button
        onClick={onSave}
        className="rounded-xl bg-primary text-white hover:bg-primary/90"
      >
        <SaveIcon className="mr-2" /> Save
      </Button>
    </div>
  </div>

  {/* Live Preview */}
  <div>
    <div
      className={classNames(
        "rounded-2xl border p-5 transition-colors dark:bg-foreground/5",
        isDark
          ? "border-border bg-background text-foreground"
          : "border-border bg-background text-foreground"
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm text-muted">Live Preview</div>
        <div className="text-xs text-muted">
          Theme: {settings.theme.toUpperCase()} • Dir:{" "}
          {settings.direction.toUpperCase()} • Units:{" "}
          {settings.units.toUpperCase()}
        </div>
      </div>
      <Separator className="bg-border" />
      <div
        dir={settings.direction}
        className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <div>
          <div className="text-xs text-muted">Date</div>
          <div className="text-lg font-medium text-foreground">
            {preview.dateStr}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted">Time</div>
          <div className="text-lg font-medium text-foreground">
            {preview.timeStr}
          </div>
          <div className="text-xs text-muted mt-1 font-mono">
            UTC {settings.timezone}
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Grid */}
  <div className="grid grid-cols-1 mt-3 gap-4 md:grid-cols-2 xl:grid-cols-3">
    {/* Language */}
    <Card title="Language" icon={<TranslateIcon />}>
      <Label className="mb-2 block text-foreground">Choose language</Label>
      <Select
        value={settings.language}
        onValueChange={(v) => set("language", v)}
      >
        <SelectTrigger className="rounded-xl border-border text-foreground bg-background focus-visible:ring-ring">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="rounded-2xl border-border bg-background">
          {LANGUAGE_OPTIONS.map((opt) => (
            <SelectItem key={opt.code} value={opt.code}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Card>

    {/* Direction */}
    <Card title="Layout Direction" icon={<FormatTextdirectionLToRIcon />}>
      <div className="flex gap-2">
        {(["ltr", "rtl"] as Direction[]).map((dir) => (
          <button
            key={dir}
            onClick={() => set("direction", dir)}
            className={classNames(
              "rounded-xl border px-3 py-2 text-sm",
              settings.direction === dir
                ? "border-primary bg-primary text-white"
                : "border-border text-foreground hover:bg-muted"
            )}
          >
            {dir === "ltr" ? (
              <FormatTextdirectionLToRIcon className="mr-1" />
            ) : (
              <FormatTextdirectionRToLIcon className="mr-1" />
            )}
            {dir.toUpperCase()}
          </button>
        ))}
      </div>
    </Card>

    {/* Date Format */}
    <Card title="Date Format" icon={<TodayIcon />}>
      <Label className="mb-2 block text-foreground">Display style</Label>
      <Select
        value={settings.dateFormatId}
        onValueChange={(v) =>
          set("dateFormatId", v as AdminSettings["dateFormatId"])
        }
      >
        <SelectTrigger className="rounded-xl border-border text-foreground bg-background focus-visible:ring-ring">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="rounded-2xl border-border bg-background">
          {DATE_FORMATS.map((f) => (
            <SelectItem key={f.id} value={f.id}>
              {f.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Card>

    {/* Time Format */}
    <Card title="Time Format" icon={<AccessTimeIcon />}>
      <div className="flex items-center justify-between rounded-xl border border-border bg-foreground/5 p-3">
        <span className="text-sm text-foreground">24-hour clock</span>
        <Switch
          checked={settings.time24h}
          onCheckedChange={(v) => set("time24h", Boolean(v))}
        />
      </div>
    </Card>

    {/* Theme */}
    <Card title="Theme" icon={<DarkModeIcon />}>
      <div className="flex gap-2">
        {(["light", "dark", "system"] as Theme[]).map((th) => (
          <button
            key={th}
            onClick={() => set("theme", th)}
            className={classNames(
              "rounded-xl border px-3 py-2 text-sm",
              settings.theme === th
                ? "border-primary bg-primary text-white"
                : "border-border text-foreground hover:bg-muted"
            )}
          >
            {th === "light" && <LightModeIcon className="mr-1" />}
            {th === "dark" && <DarkModeIcon className="mr-1" />}
            {th === "system" && <MonitorIcon className="mr-1" />}
            {th.toUpperCase()}
          </button>
        ))}
      </div>
    </Card>

    {/* Timezone */}
    <Card title="Timezone" icon={<PublicIcon />}>
      <Label className="mb-2 block text-foreground">UTC Offset</Label>
      <Select
        value={settings.timezone}
        onValueChange={(v) => set("timezone", v)}
      >
        <SelectTrigger className="rounded-xl border-border text-foreground bg-background focus-visible:ring-ring">
          <SelectValue>
            <span className="font-mono font-semibold text-lg text-foreground">
              {settings.timezone}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-72 overflow-auto rounded-2xl border-border bg-background">
          {TIMEZONE_OFFSETS.map((tz) => (
            <SelectItem key={tz.value} value={tz.value}>
              <span className="font-mono font-semibold text-base text-foreground">
                {tz.label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Card>

    {/* Units */}
    <Card title="Units" icon={<StraightenIcon />}>
      <div className="flex gap-2">
        {(["km", "miles"] as Units[]).map((unit) => (
          <button
            key={unit}
            onClick={() => set("units", unit)}
            className={classNames(
              "rounded-xl border px-3 py-2 text-sm",
              settings.units === unit
                ? "border-primary bg-primary text-white"
                : "border-border text-foreground hover:bg-muted"
            )}
          >
            {unit.toUpperCase()}
          </button>
        ))}
      </div>
    </Card>

    {/* First Day of Week */}
    <Card title="First Day of Week" icon={<TodayIcon />}>
      <Select
        value={settings.firstDayOfWeek}
        onValueChange={(v) => set("firstDayOfWeek", v)}
      >
        <SelectTrigger className="rounded-xl border-border text-foreground bg-background focus-visible:ring-ring">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="rounded-2xl border-border bg-background">
          {FIRST_DOW.map((d) => (
            <SelectItem key={d.id} value={d.id}>
              {d.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Card>
  </div>
</div>

  );
}

// -------------- Reusable Card --------------
function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow dark:bg-foreground/5"
    >
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl  border border-border text-muted">
          {icon}
        </div>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}
