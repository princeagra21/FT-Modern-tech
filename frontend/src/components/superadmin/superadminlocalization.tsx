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

// Material Design Icons
import LanguageIcon from "@mui/icons-material/Language";
import PublicIcon from "@mui/icons-material/Public";
import TranslateIcon from "@mui/icons-material/Translate";
import FormatTextdirectionRToLIcon from "@mui/icons-material/FormatTextdirectionRToL";
import FormatTextdirectionLToRIcon from "@mui/icons-material/FormatTextdirectionLToR";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TodayIcon from "@mui/icons-material/Today";
import RestoreIcon from "@mui/icons-material/Restore";
import SaveIcon from "@mui/icons-material/Save";
import MapIcon from "@mui/icons-material/Map";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import StraightenIcon from "@mui/icons-material/Straighten";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import MonitorIcon from "@mui/icons-material/Monitor";
import ResuableCard from "./settings/localization/ResuableCard";
import {
  Direction,
  TimeFormat,
  Units,
  Theme,
  LocalizationSettings,
} from "@/lib/types/superadmin";
import {
  DATE_FORMATS,
  LANGUAGE_OPTIONS,
  TIMEZONE_OFFSETS,
  LOCATION_PRESETS,
} from "@/lib/data/superadmin";
import {
  DEFAULTS,
  formatPreview,
  loadSettings,
  saveSettings,
} from "@/lib/utils/superadmin/settingsLocalizations";

// ---------------- Types & Constants ----------------

// Languages (expanded list)

// Get system timezone offset

function classNames(...cx: Array<string | false | undefined>) {
  return cx.filter(Boolean).join(" ");
}

// ---------------- Component ----------------

export default function SuperAdminLocalization() {
  const [settings, setSettings] = useState<LocalizationSettings>(DEFAULTS);

  // Load
  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  const now = new Date();
  const preview = formatPreview(
    now,
    settings.timezone,
    settings.dateFormatId,
    settings.timeFormat === "24h"
  );

  // Handlers
  const set = <K extends keyof LocalizationSettings>(
    key: K,
    value: LocalizationSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const toggleLanguage = (code: string) => {
    setSettings((prev) => {
      const isSupported = prev.supportedLanguages.includes(code);
      return {
        ...prev,
        supportedLanguages: isSupported
          ? prev.supportedLanguages.filter((c) => c !== code)
          : [...prev.supportedLanguages, code],
      };
    });
  };

  const applyLocationPreset = (preset: (typeof LOCATION_PRESETS)[number]) => {
    setSettings((prev) => ({
      ...prev,
      mapLat: preset.lat,
      mapLng: preset.lng,
      mapZoom: preset.zoom,
    }));
  };

  const onSave = () => {
    saveSettings(settings);
  };

  const onReset = () => {
    setSettings(DEFAULTS);
    saveSettings(DEFAULTS);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-background"
          >
            <LanguageIcon className="text-foreground" />
          </motion.div>
          <div>
            <h1 className="typo-h1">
              Localization Settings
            </h1>
            <p className="text-sm text-muted">
              Configure language, timezone, date formats, and map focus for your
              application.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onReset} className="">
            <RestoreIcon className="mr-2" /> Reset
          </Button>
          <Button onClick={onSave} className="">
            <SaveIcon className="mr-2" /> Save
          </Button>
        </div>
      </div>

      {/* Live Preview */}
      <div className="mb-6">
        <div className="rounded-2xl border border-border bg-background p-5 transition-colors">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm text-muted">Live Preview</div>
            <div className="typo-subtitle">
              Lang: {settings.language.toUpperCase()} • Dir:{" "}
              {settings.direction.toUpperCase()} • TZ: {settings.timezone}
            </div>
          </div>
          <Separator className="bg-border" />
          <div
            dir={settings.direction}
            className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3"
          >
            <div>
              <div className="typo-subtitle">Date</div>
              <div className="text-lg font-medium text-foreground">
                {preview.dateStr}
              </div>
            </div>
            <div>
              <div className="typo-subtitle">Time</div>
              <div className="text-lg font-medium text-foreground">
                {preview.timeStr}
              </div>
            </div>
            <div>
              <div className="typo-subtitle">Map Center</div>
              <div className="text-sm font-medium font-mono text-foreground">
                {settings.mapLat.toFixed(4)}, {settings.mapLng.toFixed(4)}
              </div>
              <div className="typo-subtitle">Zoom: {settings.mapZoom}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {/* Default Language */}
        <ResuableCard title="Default Language" icon={<TranslateIcon />}>
          <Label className="mb-2 block text-foreground">Primary language</Label>
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
                  {opt.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ResuableCard>

        {/* Direction */}
        <ResuableCard
          title="Text Direction"
          icon={<FormatTextdirectionLToRIcon />}
        >
          <div className="flex gap-2">
            {(["ltr", "rtl"] as Direction[]).map((dir) => (
              <button
                key={dir}
                onClick={() => set("direction", dir)}
                className={classNames(
                  "flex-1 rounded-xl border px-3 py-2 text-sm transition-all",
                  settings.direction === dir
                    ? "border-primary bg-primary text-white"
                    : "border-border text-foreground hover:bg-foreground/5"
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
        </ResuableCard>

        {/* Date Format */}
        <ResuableCard title="Date Format" icon={<TodayIcon />}>
          <Label className="mb-2 block text-foreground">Display style</Label>
          <Select
            value={settings.dateFormatId}
            onValueChange={(v) =>
              set("dateFormatId", v as LocalizationSettings["dateFormatId"])
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
        </ResuableCard>

        {/* Time Format */}
        <ResuableCard title="Time Format" icon={<AccessTimeIcon />}>
          <div className="flex items-center justify-between rounded-xl border border-border bg-background p-3">
            <span className="text-sm text-foreground">24-hour clock</span>
            <Switch
              checked={settings.timeFormat === "24h"}
              onCheckedChange={(v) => set("timeFormat", v ? "24h" : "12h")}
            />
          </div>
          <div className="mt-2 typo-subtitle">
            Example: {settings.timeFormat === "24h" ? "14:30" : "02:30 PM"}
          </div>
        </ResuableCard>

        {/* Timezone */}
        <ResuableCard title="Timezone" icon={<PublicIcon />}>
          <Label className="mb-2 block text-foreground">UTC Offset</Label>
          <Select
            value={settings.timezone}
            onValueChange={(v) => set("timezone", v)}
          >
            <SelectTrigger className="rounded-xl border-border text-foreground bg-background focus-visible:ring-ring">
              <SelectValue>
                <span className="font-mono font-semibold">
                  {settings.timezone}
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-72 overflow-auto rounded-2xl border-border bg-background">
              {TIMEZONE_OFFSETS.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  <span className="font-mono">{tz.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ResuableCard>

        {/* Units */}
        <ResuableCard title="Units" icon={<StraightenIcon />}>
          <div className="flex gap-2">
            {(["km", "miles"] as Units[]).map((unit) => (
              <button
                key={unit}
                className="rounded-xl border border-border px-3 py-2 text-sm text-foreground hover:bg-foreground/5"
              >
                {unit.toUpperCase()}
              </button>
            ))}
          </div>
        </ResuableCard>

        {/* Theme */}
        <ResuableCard title="Theme" icon={<DarkModeIcon />}>
          <div className="flex gap-2">
            {(["light", "dark", "system"] as Theme[]).map((th) => (
              <button
                key={th}
                className="rounded-xl border border-border px-3 py-2 text-sm text-foreground hover:bg-foreground/5"
              >
                {th === "light" && <LightModeIcon className="mr-1" />}
                {th === "dark" && <DarkModeIcon className="mr-1" />}
                {th === "system" && <MonitorIcon className="mr-1" />}
                {th.toUpperCase()}
              </button>
            ))}
          </div>
        </ResuableCard>

        {/* Map Focus Coordinates */}
        <ResuableCard
          title="Map Focus Coordinates"
          icon={<MapIcon />}
          className="md:col-span-2 xl:col-span-3"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="mb-2 block text-foreground">
                Latitude (N/S)
              </Label>
              <Input
                type="number"
                step="0.000001"
                value={settings.mapLat}
                onChange={(e) => set("mapLat", parseFloat(e.target.value) || 0)}
                className="rounded-xl border-border bg-background text-foreground"
                placeholder="0.000000"
              />
              <div className="mt-2 typo-subtitle">Range: -90 to 90</div>
            </div>
            <div>
              <Label className="mb-2 block text-foreground">
                Longitude (E/W)
              </Label>
              <Input
                type="number"
                step="0.000001"
                value={settings.mapLng}
                onChange={(e) => set("mapLng", parseFloat(e.target.value) || 0)}
                className="rounded-xl border-border bg-background text-foreground"
                placeholder="0.000000"
              />
              <div className="mt-2 typo-subtitle">Range: -180 to 180</div>
            </div>
            <div>
              <Label className="mb-2 block text-foreground">Zoom Level</Label>
              <Input
                type="number"
                min="1"
                max="20"
                value={settings.mapZoom}
                onChange={(e) => set("mapZoom", parseInt(e.target.value) || 2)}
                className="rounded-xl border-border bg-background text-foreground"
                placeholder="2"
              />
              <div className="mt-2 typo-subtitle">
                Range: 1 (world) to 20 (street)
              </div>
            </div>
          </div>
        </ResuableCard>

        {/* Location Presets */}
        <ResuableCard
          title="Quick Location Presets"
          icon={<PublicIcon />}
          className="md:col-span-2 xl:col-span-3"
        >
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
            {LOCATION_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyLocationPreset(preset)}
                className="rounded-xl border border-border px-3 py-2 typo-p12n transition-all hover:border-primary hover:bg-foreground/5"
              >
                <div className="font-medium">{preset.name}</div>
                <div className="text-[10px] text-muted mt-0.5">
                  {preset.lat.toFixed(2)}, {preset.lng.toFixed(2)}
                </div>
              </button>
            ))}
          </div>
        </ResuableCard>
      </div>
    </div>
  );
}

// -------------- Reusable Card --------------
