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
import SettingsIcon from '@mui/icons-material/Settings';
import LoginIcon from '@mui/icons-material/Login';
import PublicIcon from '@mui/icons-material/Public';
import StorageIcon from '@mui/icons-material/Storage';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import RestoreIcon from '@mui/icons-material/Restore';
import SaveIcon from '@mui/icons-material/Save';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

// ---------------- Types & Constants ----------------

type ReverseGeocodingDigits = '2' | '3';

const BACKUP_RETENTION_OPTIONS = [
  { value: '1-month', label: '1 Month' },
  { value: '3-months', label: '3 Months' },
  { value: '6-months', label: '6 Months' },
  { value: '9-months', label: '9 Months' },
  { value: '1-year', label: '1 Year' },
  { value: '1.5-years', label: '1 Year 6 Months' },
  { value: '2-years', label: '2 Years' },
  { value: '3-years', label: '3 Years' },
  { value: '5-years', label: '5 Years' },
  { value: 'forever', label: 'Forever' },
];

// ---------------- Persistence ----------------

const LS_KEY = 'superadmin-settings-v1';

type SuperAdminSettings = {
  demoLoginEnabled: boolean;
  reverseGeocodingDigits: ReverseGeocodingDigits;
  databaseBackupRetention: string;
  signupAllowed: boolean;
  signupFreeCredits: number;
};

const DEFAULTS: SuperAdminSettings = {
  demoLoginEnabled: false,
  reverseGeocodingDigits: '2',
  databaseBackupRetention: '3-months',
  signupAllowed: true,
  signupFreeCredits: 100,
};

function loadSettings(): SuperAdminSettings {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as SuperAdminSettings;
    return { ...DEFAULTS, ...parsed };
  } catch {
    return DEFAULTS;
  }
}

function saveSettings(s: SuperAdminSettings) {
  localStorage.setItem(LS_KEY, JSON.stringify(s));
}

// ---------------- Helpers ----------------

function classNames(...cx: Array<string | false | undefined>) {
  return cx.filter(Boolean).join(' ');
}

// ---------------- Component ----------------

export default function SuperAdminSettings() {
  const [settings, setSettings] = useState<SuperAdminSettings>(DEFAULTS);

  // Load
  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  // Handlers
  const set = <K extends keyof SuperAdminSettings>(key: K, value: SuperAdminSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
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
            <SettingsIcon className="dark:text-neutral-100" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">Application Settings</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Configure system-wide settings for your application.</p>
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
            <div className="text-sm opacity-70 dark:text-neutral-100">Current Configuration</div>
            <div className="text-xs opacity-60 dark:text-neutral-400">
              Demo: {settings.demoLoginEnabled ? 'ON' : 'OFF'} • 
              Geocoding: {settings.reverseGeocodingDigits} Digits • 
              Signup: {settings.signupAllowed ? 'ALLOWED' : 'DISABLED'}
            </div>
          </div>
          <Separator className="bg-neutral-200 dark:bg-neutral-700" />
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <div className="text-xs opacity-60 dark:text-neutral-400">Demo Login</div>
              <div className="text-lg font-medium dark:text-neutral-100">{settings.demoLoginEnabled ? 'Active' : 'Inactive'}</div>
            </div>
            <div>
              <div className="text-xs opacity-60 dark:text-neutral-400">Backup Retention</div>
              <div className="text-sm font-medium dark:text-neutral-100">
                {BACKUP_RETENTION_OPTIONS.find(opt => opt.value === settings.databaseBackupRetention)?.label || 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-xs opacity-60 dark:text-neutral-400">Free Signup Credits</div>
              <div className="text-lg font-medium dark:text-neutral-100">{settings.signupAllowed ? settings.signupFreeCredits : 'N/A'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {/* Demo Login */}
        <Card title="Demo Login" icon={<LoginIcon />}>
          <div className="flex items-center justify-between rounded-xl border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 p-3">
            <div>
              <span className="text-sm font-medium text-neutral-800 dark:text-neutral-100">Enable Demo Login</span>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                {settings.demoLoginEnabled ? 'Users can access demo mode' : 'Demo login is disabled'}
              </div>
            </div>
            <Switch 
              checked={settings.demoLoginEnabled} 
              onCheckedChange={(v) => set('demoLoginEnabled', Boolean(v))} 
            />
          </div>
        </Card>

        {/* Reverse Geocoding Precision */}
        <Card title="Reverse Geocoding" icon={<PublicIcon />}>
          <Label className="mb-2 block text-neutral-700 dark:text-neutral-200">Address Precision</Label>
          <div className="flex gap-2">
            {(['2', '3'] as ReverseGeocodingDigits[]).map((digit) => (
              <button
                key={digit}
                onClick={() => set('reverseGeocodingDigits', digit)}
                className={classNames(
                  'flex-1 rounded-xl border px-4 py-3 text-sm transition-all',
                  settings.reverseGeocodingDigits === digit
                    ? 'border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white text-white dark:text-black'
                    : 'border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                )}
              >
                <div className="font-medium">{digit} Digits</div>
                <div className="text-xs opacity-75 mt-1">
                  {digit === '2' ? 'City/Region' : 'Street Level'}
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Database Backup Retention */}
        <Card title="Database Backup" icon={<StorageIcon />}>
          <Label className="mb-2 block text-neutral-700 dark:text-neutral-200">Retention Period</Label>
          <Select 
            value={settings.databaseBackupRetention} 
            onValueChange={(v) => set('databaseBackupRetention', v)}
          >
            <SelectTrigger className="rounded-xl border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 dark:bg-neutral-800 focus-visible:ring-neutral-900 dark:focus-visible:ring-neutral-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-72 overflow-auto rounded-2xl border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800">
              {BACKUP_RETENTION_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
            Backups will be retained for the selected period
          </div>
        </Card>

        {/* Signup Settings - Full Width */}
        <Card title="Signup Configuration" icon={<PersonAddIcon />} className="md:col-span-2 xl:col-span-3">
          <div className="space-y-4">
            {/* Allow Signup Toggle */}
            <div className="flex items-center justify-between rounded-xl border border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 p-4">
              <div>
                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-100">Allow New Signups</span>
                <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {settings.signupAllowed ? 'New users can register' : 'Signup is temporarily disabled'}
                </div>
              </div>
              <Switch 
                checked={settings.signupAllowed} 
                onCheckedChange={(v) => set('signupAllowed', Boolean(v))} 
              />
            </div>

            {/* Free Credits Input (conditionally shown) */}
            {settings.signupAllowed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <AccountBalanceWalletIcon className="text-neutral-700 dark:text-neutral-100 h-5 w-5" />
                  <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Free Signup Credits</Label>
                </div>
                <Input
                  type="number"
                  min="0"
                  step="10"
                  value={settings.signupFreeCredits}
                  onChange={(e) => set('signupFreeCredits', parseInt(e.target.value) || 0)}
                  className="rounded-xl border-neutral-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
                  placeholder="100"
                />
                <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                  Number of free credits awarded to new users upon signup
                </div>
              </motion.div>
            )}

            {/* Info when signup is disabled */}
            {!settings.signupAllowed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-neutral-500 dark:text-neutral-400 italic"
              >
                Enable signups to configure free credits for new users
              </motion.div>
            )}
          </div>
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
  className 
}: { 
  title: string; 
  icon?: React.ReactNode; 
  children: React.ReactNode; 
  className?: string 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={classNames(
        'rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-5 shadow-sm hover:shadow-md transition-shadow',
        className
      )}
    >
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-100">
          {icon}
        </div>
        <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}
