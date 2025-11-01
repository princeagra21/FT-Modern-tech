'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// shadcn/ui components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Material Design Icons
import LanguageIcon from '@mui/icons-material/Language';
import PublicIcon from '@mui/icons-material/Public';
import TranslateIcon from '@mui/icons-material/Translate';
import FormatTextdirectionRToLIcon from '@mui/icons-material/FormatTextdirectionRToL';
import FormatTextdirectionLToRIcon from '@mui/icons-material/FormatTextdirectionLToR';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TodayIcon from '@mui/icons-material/Today';
import RestoreIcon from '@mui/icons-material/Restore';
import SaveIcon from '@mui/icons-material/Save';
import MapIcon from '@mui/icons-material/Map';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import StraightenIcon from "@mui/icons-material/Straighten";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import MonitorIcon from "@mui/icons-material/Monitor";

// ---------------- Types & Constants ----------------

type Direction = 'ltr' | 'rtl';
type TimeFormat = '12h' | '24h';
type Units = "km" | "miles";
type Theme = "light" | "dark" | "system";

// Languages (expanded list)
const LANGUAGE_OPTIONS = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish (Español)' },
  { code: 'fr', name: 'French (Français)' },
  { code: 'de', name: 'German (Deutsch)' },
  { code: 'it', name: 'Italian (Italiano)' },
  { code: 'pt', name: 'Portuguese (Português)' },
  { code: 'ru', name: 'Russian (Русский)' },
  { code: 'zh', name: 'Chinese (中文)' },
  { code: 'ja', name: 'Japanese (日本語)' },
  { code: 'ko', name: 'Korean (한국어)' },
  { code: 'ar', name: 'Arabic (العربية)' },
  { code: 'hi', name: 'Hindi (हिन्दी)' },
];

// Date formats with examples
const DATE_FORMATS = [
  { id: 'DD-MMM-YYYY', label: '24 Oct 2025' },
  { id: 'DD/MM/YYYY', label: '24/10/2025' },
  { id: 'YYYY-MM-DD', label: '2025-10-24' },
  { id: 'MMM DD, YYYY', label: 'Oct 24, 2025' },
  { id: 'DD.MM.YYYY', label: '24.10.2025' },
  { id: 'MM/DD/YYYY', label: '10/24/2025' },
  { id: 'D MMM YYYY', label: '24 Oct 2025' },
  { id: 'ddd, DD MMM YYYY', label: 'Fri, 24 Oct 2025' },
  { id: 'MMMM DD, YYYY', label: 'October 24, 2025' },
] as const;

// Timezone offsets
const TIMEZONE_OFFSETS = [
  { value: '-12:00', label: 'UTC -12:00' },
  { value: '-11:00', label: 'UTC -11:00' },
  { value: '-10:00', label: 'UTC -10:00' },
  { value: '-09:30', label: 'UTC -09:30' },
  { value: '-09:00', label: 'UTC -09:00' },
  { value: '-08:00', label: 'UTC -08:00' },
  { value: '-07:00', label: 'UTC -07:00' },
  { value: '-06:00', label: 'UTC -06:00' },
  { value: '-05:00', label: 'UTC -05:00' },
  { value: '-04:00', label: 'UTC -04:00' },
  { value: '-03:30', label: 'UTC -03:30' },
  { value: '-03:00', label: 'UTC -03:00' },
  { value: '-02:00', label: 'UTC -02:00' },
  { value: '-01:00', label: 'UTC -01:00' },
  { value: '+00:00', label: 'UTC +00:00' },
  { value: '+01:00', label: 'UTC +01:00' },
  { value: '+02:00', label: 'UTC +02:00' },
  { value: '+03:00', label: 'UTC +03:00' },
  { value: '+03:30', label: 'UTC +03:30' },
  { value: '+04:00', label: 'UTC +04:00' },
  { value: '+04:30', label: 'UTC +04:30' },
  { value: '+05:00', label: 'UTC +05:00' },
  { value: '+05:30', label: 'UTC +05:30' },
  { value: '+05:45', label: 'UTC +05:45' },
  { value: '+06:00', label: 'UTC +06:00' },
  { value: '+06:30', label: 'UTC +06:30' },
  { value: '+07:00', label: 'UTC +07:00' },
  { value: '+08:00', label: 'UTC +08:00' },
  { value: '+08:45', label: 'UTC +08:45' },
  { value: '+09:00', label: 'UTC +09:00' },
  { value: '+09:30', label: 'UTC +09:30' },
  { value: '+10:00', label: 'UTC +10:00' },
  { value: '+10:30', label: 'UTC +10:30' },
  { value: '+11:00', label: 'UTC +11:00' },
  { value: '+12:00', label: 'UTC +12:00' },
  { value: '+12:45', label: 'UTC +12:45' },
  { value: '+13:00', label: 'UTC +13:00' },
  { value: '+14:00', label: 'UTC +14:00' },
];

// Location presets
const LOCATION_PRESETS = [
  { name: 'San Francisco', lat: 37.7749, lng: -122.4194, zoom: 10 },
  { name: 'New York', lat: 40.7128, lng: -74.0060, zoom: 10 },
  { name: 'London', lat: 51.5074, lng: -0.1278, zoom: 10 },
  { name: 'Paris', lat: 48.8566, lng: 2.3522, zoom: 10 },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, zoom: 10 },
  { name: 'Dubai', lat: 25.2048, lng: 55.2708, zoom: 10 },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198, zoom: 11 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777, zoom: 10 },
];

// Get system timezone offset
function getSystemTimezoneOffset(): string {
  const offset = -new Date().getTimezoneOffset();
  const hours = Math.floor(Math.abs(offset) / 60);
  const minutes = Math.abs(offset) % 60;
  const sign = offset >= 0 ? '+' : '-';
  return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// ---------------- Persistence ----------------

const LS_KEY = 'localization-settings-v1';

type LocalizationSettings = {
  language: string;
  supportedLanguages: string[];
  direction: Direction;
  dateFormatId: typeof DATE_FORMATS[number]['id'];
  timeFormat: TimeFormat;
  timezone: string;
  mapLat: number;
  mapLng: number;
  mapZoom: number;
};

const DEFAULTS: LocalizationSettings = {
  language: 'en',
  supportedLanguages: ['en'],
  direction: 'ltr',
  dateFormatId: 'DD-MMM-YYYY',
  timeFormat: '24h',
  timezone: getSystemTimezoneOffset(),
  mapLat: 0,
  mapLng: 0,
  mapZoom: 2,
};

function loadSettings(): LocalizationSettings {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as LocalizationSettings;
    return { ...DEFAULTS, ...parsed };
  } catch {
    return DEFAULTS;
  }
}

function saveSettings(s: LocalizationSettings) {
  localStorage.setItem(LS_KEY, JSON.stringify(s));
}

// ---------------- Helpers ----------------

function pad2(n: number) {
  return n.toString().padStart(2, '0');
}

function formatDateByPattern(date: Date, pattern: LocalizationSettings['dateFormatId']) {
  const Y = date.getFullYear();
  const M = date.getMonth() + 1;
  const D = date.getDate();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthsFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  switch (pattern) {
    case 'DD-MMM-YYYY':
      return `${pad2(D)} ${months[M - 1]} ${Y}`;
    case 'DD/MM/YYYY':
      return `${pad2(D)}/${pad2(M)}/${Y}`;
    case 'YYYY-MM-DD':
      return `${Y}-${pad2(M)}-${pad2(D)}`;
    case 'MMM DD, YYYY':
      return `${months[M - 1]} ${pad2(D)}, ${Y}`;
    case 'DD.MM.YYYY':
      return `${pad2(D)}.${pad2(M)}.${Y}`;
    case 'MM/DD/YYYY':
      return `${pad2(M)}/${pad2(D)}/${Y}`;
    case 'D MMM YYYY':
      return `${D} ${months[M - 1]} ${Y}`;
    case 'ddd, DD MMM YYYY':
      return `${days[date.getDay()]}, ${pad2(D)} ${months[M - 1]} ${Y}`;
    case 'MMMM DD, YYYY':
      return `${monthsFull[M - 1]} ${pad2(D)}, ${Y}`;
    default:
      return `${pad2(D)} ${months[M - 1]} ${Y}`;
  }
}

function formatPreview(date: Date, tzOffset: string, dateFormatId: LocalizationSettings['dateFormatId'], use24h: boolean) {
  const match = tzOffset.match(/([+-])(\d{2}):(\d{2})/);
  if (!match) {
    const dateStr = formatDateByPattern(date, dateFormatId);
    const timeStr = use24h
      ? `${pad2(date.getHours())}:${pad2(date.getMinutes())}`
      : date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return { dateStr, timeStr };
  }

  const sign = match[1] === '+' ? 1 : -1;
  const hours = parseInt(match[2], 10);
  const minutes = parseInt(match[3], 10);
  const offsetMs = sign * (hours * 60 + minutes) * 60 * 1000;
  const adjustedDate = new Date(date.getTime() + offsetMs);

  const dateStr = formatDateByPattern(adjustedDate, dateFormatId);
  const timeStr = use24h
    ? `${pad2(adjustedDate.getUTCHours())}:${pad2(adjustedDate.getUTCMinutes())}`
    : adjustedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC' });

  return { dateStr, timeStr };
}

function classNames(...cx: Array<string | false | undefined>) {
  return cx.filter(Boolean).join(' ');
}

// ---------------- Component ----------------

export default function SuperAdminLocalization() {
  const [settings, setSettings] = useState<LocalizationSettings>(DEFAULTS);

  // Load
  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  const now = new Date();
  const preview = formatPreview(now, settings.timezone, settings.dateFormatId, settings.timeFormat === '24h');

  // Handlers
  const set = <K extends keyof LocalizationSettings>(key: K, value: LocalizationSettings[K]) => {
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

  const applyLocationPreset = (preset: typeof LOCATION_PRESETS[number]) => {
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
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800"
          >
            <LanguageIcon className="dark:text-neutral-100" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">Localization Settings</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Configure language, timezone, date formats, and map focus for your application.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onReset} className="rounded-xl border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 hover:bg-white dark:hover:bg-neutral-700">
            <RestoreIcon className="mr-2" /> Reset
          </Button>
          <Button onClick={onSave} className="rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-neutral-100">
            <SaveIcon className="mr-2" /> Save
          </Button>
        </div>
      </div>

      {/* Live Preview */}
      <div className="mb-6">
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-5 transition-colors">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm opacity-70 dark:text-neutral-100">Live Preview</div>
            <div className="text-xs opacity-60 dark:text-neutral-400">
              Lang: {settings.language.toUpperCase()} • Dir: {settings.direction.toUpperCase()} • TZ: {settings.timezone}
            </div>
          </div>
          <Separator className="bg-neutral-200 dark:bg-neutral-700" />
          <div dir={settings.direction} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <div className="text-xs opacity-60 dark:text-neutral-400">Date</div>
              <div className="text-lg font-medium dark:text-neutral-100">{preview.dateStr}</div>
            </div>
            <div>
              <div className="text-xs opacity-60 dark:text-neutral-400">Time</div>
              <div className="text-lg font-medium dark:text-neutral-100">{preview.timeStr}</div>
            </div>
            <div>
              <div className="text-xs opacity-60 dark:text-neutral-400">Map Center</div>
              <div className="text-sm font-medium font-mono dark:text-neutral-100">
                {settings.mapLat.toFixed(4)}, {settings.mapLng.toFixed(4)}
              </div>
              <div className="text-xs opacity-60 dark:text-neutral-400">Zoom: {settings.mapZoom}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {/* Default Language */}
        <Card title="Default Language" icon={<TranslateIcon />}>
          <Label className="mb-2 block text-neutral-700 dark:text-neutral-200">Primary language</Label>
          <Select value={settings.language} onValueChange={(v) => set('language', v)}>
            <SelectTrigger className="rounded-xl border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 dark:bg-neutral-800 focus-visible:ring-neutral-900 dark:focus-visible:ring-neutral-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800">
              {LANGUAGE_OPTIONS.map((opt) => (
                <SelectItem key={opt.code} value={opt.code}>
                  {opt.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Card>

        {/* Direction */}
        <Card title="Text Direction" icon={<FormatTextdirectionLToRIcon />}>
          <div className="flex gap-2">
            {(['ltr', 'rtl'] as Direction[]).map((dir) => (
              <button
                key={dir}
                onClick={() => set('direction', dir)}
                className={classNames(
                  'flex-1 rounded-xl border px-3 py-2 text-sm transition-all',
                  settings.direction === dir
                    ? 'border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white text-white dark:text-black'
                    : 'border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                )}
              >
                {dir === 'ltr' ? <FormatTextdirectionLToRIcon className="mr-1" /> : <FormatTextdirectionRToLIcon className="mr-1" />}
                {dir.toUpperCase()}
              </button>
            ))}
          </div>
        </Card>

        {/* Date Format */}
        <Card title="Date Format" icon={<TodayIcon />}>
          <Label className="mb-2 block text-neutral-700 dark:text-neutral-200">Display style</Label>
          <Select value={settings.dateFormatId} onValueChange={(v) => set('dateFormatId', v as LocalizationSettings['dateFormatId'])}>
            <SelectTrigger className="rounded-xl border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 dark:bg-neutral-800 focus-visible:ring-neutral-900 dark:focus-visible:ring-neutral-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800">
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
          <div className="flex items-center justify-between rounded-xl border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 p-3">
            <span className="text-sm text-neutral-800 dark:text-neutral-100">24-hour clock</span>
            <Switch checked={settings.timeFormat === '24h'} onCheckedChange={(v) => set('timeFormat', v ? '24h' : '12h')} />
          </div>
          <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
            Example: {settings.timeFormat === '24h' ? '14:30' : '02:30 PM'}
          </div>
        </Card>

        {/* Timezone */}
        <Card title="Timezone" icon={<PublicIcon />}>
          <Label className="mb-2 block text-neutral-700 dark:text-neutral-200">UTC Offset</Label>
          <Select value={settings.timezone} onValueChange={(v) => set('timezone', v)}>
            <SelectTrigger className="rounded-xl border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 dark:bg-neutral-800 focus-visible:ring-neutral-900 dark:focus-visible:ring-neutral-100">
              <SelectValue>
                <span className="font-mono font-semibold dark:text-neutral-100">{settings.timezone}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-72 overflow-auto rounded-2xl border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800">
              {TIMEZONE_OFFSETS.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  <span className="font-mono">{tz.label}</span>
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
                // onClick={() => set("units", unit)}
                className={classNames(
                  "rounded-xl border px-3 py-2 text-sm",                 
                  // settings.units === unit
                  //   ? "border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white text-white dark:text-black"
                  //   : "border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                )}
              >
                {unit.toUpperCase()}
              </button>
            ))}
          </div>
        </Card>

                    {/* Theme */}
        <Card title="Theme" icon={<DarkModeIcon />}>
          <div className="flex gap-2">
            {(["light", "dark", "system"] as Theme[]).map((th) => (
              <button
                key={th}
                // onClick={() => set("theme", th)}
                className={classNames(
                  "rounded-xl border px-3 py-2 text-sm",
                  // settings.theme === th
                  //   ? "border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white text-white dark:text-black"
                  //   : "border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                )}
              >
                {th === "light" && <LightModeIcon className="mr-1"/>}
                {th === "dark" && <DarkModeIcon className="mr-1"/>}
                {th === "system" && <MonitorIcon className="mr-1"/>}
                {th.toUpperCase()}
              </button>
            ))}
          </div>
        </Card>



        {/* Map Focus Coordinates - Full Width */}
        <Card title="Map Focus Coordinates" icon={<MapIcon />} className="md:col-span-2 xl:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Latitude */}
            <div>
              <Label className="mb-2 block text-neutral-700 dark:text-neutral-200">Latitude (N/S)</Label>
              <Input
                type="number"
                step="0.000001"
                value={settings.mapLat}
                onChange={(e) => set('mapLat', parseFloat(e.target.value) || 0)}
                className="rounded-xl border-neutral-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
                placeholder="0.000000"
              />
              <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">Range: -90 to 90</div>
            </div>

            {/* Longitude */}
            <div>
              <Label className="mb-2 block text-neutral-700 dark:text-neutral-200">Longitude (E/W)</Label>
              <Input
                type="number"
                step="0.000001"
                value={settings.mapLng}
                onChange={(e) => set('mapLng', parseFloat(e.target.value) || 0)}
                className="rounded-xl border-neutral-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
                placeholder="0.000000"
              />
              <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">Range: -180 to 180</div>
            </div>

            {/* Zoom Level */}
            <div>
              <Label className="mb-2 block text-neutral-700 dark:text-neutral-200">Zoom Level</Label>
              <Input
                type="number"
                min="1"
                max="20"
                value={settings.mapZoom}
                onChange={(e) => set('mapZoom', parseInt(e.target.value) || 2)}
                className="rounded-xl border-neutral-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
                placeholder="2"
              />
              <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">Range: 1 (world) to 20 (street)</div>
            </div>
          </div>
        </Card>

        {/* Location Presets - Full Width */}
        <Card title="Quick Location Presets" icon={<PublicIcon />} className="md:col-span-2 xl:col-span-3">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
            {LOCATION_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyLocationPreset(preset)}
                className="rounded-xl border border-neutral-300 dark:border-neutral-600 px-3 py-2 text-xs text-neutral-900 dark:text-neutral-100 transition-all hover:border-neutral-900 dark:hover:border-white hover:bg-neutral-50 dark:hover:bg-neutral-700"
              >
                <div className="font-medium">{preset.name}</div>
                <div className="text-[10px] opacity-60 dark:text-neutral-400 mt-0.5">
                  {preset.lat.toFixed(2)}, {preset.lng.toFixed(2)}
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// -------------- Reusable Card --------------
function Card({ title, icon, children, className }: { title: string; icon?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={classNames('rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-5 shadow-sm hover:shadow-md transition-shadow', className)}
    >
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-100">{icon}</div>
        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}

