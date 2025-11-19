"use client";

import React from "react";

export type VehicleSettings = {
  speedVariationKmh: number;
  distanceVariationM: number;
  odometerKm: number;
  engineHours: number;
  ignitionSource: "motion" | "ignition";
};

export type VehicleSettingsPanelProps = {
  initial?: Partial<VehicleSettings>;
  loading?: boolean;
  onSave?: (values: VehicleSettings) => void;
  onReset?: () => void;
  className?: string;
};

const DEFAULTS: VehicleSettings = {
  speedVariationKmh: 1.0,
  distanceVariationM: 1.0,
  odometerKm: 0,
  engineHours: 0,
  ignitionSource: "ignition",
};

const RANGES = {
  speedVariationKmh: { min: 0, max: 10 },
  distanceVariationM: { min: 0, max: 10 },
  odometerKm: { min: 0, max: 10_000_000 },
  engineHours: { min: 0, max: 100_000 },
} as const;

type NumericKey = keyof Pick<VehicleSettings, "speedVariationKmh" | "distanceVariationM" | "odometerKm" | "engineHours">;

function clamp(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

function toNumberStrict(input: unknown, fallback = 0) {
  if (typeof input === "number" && Number.isFinite(input)) return input;
  if (typeof input === "string") {
    const n = Number(input.replace(/[^0-9.\-]/g, ""));
    return Number.isFinite(n) ? n : fallback;
  }
  if (input && typeof input === "object") {
    try {
      const v = (input as any).valueOf?.();
      if (typeof v === "number" && Number.isFinite(v)) return v;
      if (typeof v === "string") {
        const n = Number(v.replace(/[^0-9.\-]/g, ""));
        return Number.isFinite(n) ? n : fallback;
      }
    } catch {/* ignore */}
  }
  return fallback;
}

function coerceIgnitionSource(v: unknown): VehicleSettings["ignitionSource"] {
  return v === "motion" ? "motion" : "ignition";
}

function sanitizeSettings(partial?: Partial<VehicleSettings>): VehicleSettings {
  const p = partial ?? {};
  const sv = clamp(toNumberStrict((p as any).speedVariationKmh, DEFAULTS.speedVariationKmh), RANGES.speedVariationKmh.min, RANGES.speedVariationKmh.max);
  const dv = clamp(toNumberStrict((p as any).distanceVariationM, DEFAULTS.distanceVariationM), RANGES.distanceVariationM.min, RANGES.distanceVariationM.max);
  const od = clamp(toNumberStrict((p as any).odometerKm, DEFAULTS.odometerKm), RANGES.odometerKm.min, RANGES.odometerKm.max);
  const eh = clamp(toNumberStrict((p as any).engineHours, DEFAULTS.engineHours), RANGES.engineHours.min, RANGES.engineHours.max);
  const ig = coerceIgnitionSource((p as any).ignitionSource);
  return { speedVariationKmh: sv, distanceVariationM: dv, odometerKm: od, engineHours: eh, ignitionSource: ig };
}

export default function VehicleConfig({ initial, loading, onSave, onReset, className }: VehicleSettingsPanelProps) {
  const [values, setValues] = React.useState<VehicleSettings>({ ...DEFAULTS, ...sanitizeSettings(initial) });
  const [dirty, setDirty] = React.useState(false);

  React.useEffect(() => {
    const next = { ...DEFAULTS, ...sanitizeSettings(initial) };
    setValues(next);
    setDirty(false);
  }, [initial]);

  function update<K extends keyof VehicleSettings>(key: K, val: VehicleSettings[K]) {
    setValues(prev => {
      if ((["speedVariationKmh", "distanceVariationM", "odometerKm", "engineHours"] as const).includes(key as any)) {
        const k = key as NumericKey;
        const min = (RANGES as any)[k].min;
        const max = (RANGES as any)[k].max;
        const num = clamp(toNumberStrict(val), min, max);
        return { ...prev, [k]: num } as VehicleSettings;
      }
      if (key === "ignitionSource") {
        return { ...prev, ignitionSource: coerceIgnitionSource(val) } as VehicleSettings;
      }
      return prev;
    });
    setDirty(true);
  }

  function handleSave() {
    onSave?.(values);
    setDirty(false);
  }

  function handleReset() {
    const next = { ...DEFAULTS, ...sanitizeSettings(initial) };
    setValues(next);
    setDirty(false);
    onReset?.();
  }

  return (
    <div className={"w-full max-w-5xl mx-auto p-5 bg-background text-foreground" + (className ?? "")}>
      {/* Title */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold ">Vehicle Setting Configuration</h2>
          <p className="text-[12px] text-muted-foreground">Condensed layout • 2 per row on desktop</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            disabled={loading}
            className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-foreground/5"
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={!dirty || !!loading}
            className={`rounded-lg px-3 py-1.5 text-sm text-primary-foreground ${
              dirty ? "bg-primary hover:bg-primary/90" : "bg-foreground/5 cursor-not-allowed"
            }`}
          >
            Save
          </button>
        </div>
      </div>

      {/* 2-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ">
        <FieldCard title="Speed Multiplier (×)" hint="Multiply raw speed by this factor (e.g., 0.95, 1.00, 1.05).">
          <NumberField
            id="speedVariationKmh"
            label="Speed ×"
            value={values.speedVariationKmh}
            onChange={(n) => update("speedVariationKmh", n as any)}
            min={RANGES.speedVariationKmh.min}
            max={RANGES.speedVariationKmh.max}
            step={0.01}
            suffix="×"
          />
        </FieldCard>

        <FieldCard title="Distance Multiplier (×)" hint="Multiply raw distance by this factor (e.g., 0.98, 1.00, 1.10).">
          <NumberField
            id="distanceVariationM"
            label="Distance ×"
            value={values.distanceVariationM}
            onChange={(n) => update("distanceVariationM", n as any)}
            min={RANGES.distanceVariationM.min}
            max={RANGES.distanceVariationM.max}
            step={0.01}
            suffix="×"
          />
        </FieldCard>

        <FieldCard title="Set Odometer" hint="Override odometer baseline (km).">
          <NumberField
            id="odometerKm"
            label="Odometer"
            value={values.odometerKm}
            onChange={(n) => update("odometerKm", n as any)}
            min={RANGES.odometerKm.min}
            max={RANGES.odometerKm.max}
            step={1}
            suffix="km"
          />
        </FieldCard>

        <FieldCard title="Set Engine Hours" hint="Total engine runtime hours.">
          <NumberField
            id="engineHours"
            label="Engine Hours"
            value={values.engineHours}
            onChange={(n) => update("engineHours", n as any)}
            min={RANGES.engineHours.min}
            max={RANGES.engineHours.max}
            step={1}
            suffix="h"
          />
        </FieldCard>

        <div className="md:col-span-2 rounded-xl border border-border bg-card p-3 dark:bg-foreground/5">
          <div className="mb-2 ">
            <div className="text-sm font-medium">Ignition Source</div>
            <div className="text-[12px] text-muted-foreground">Choose how engine ON/OFF is derived.</div>
          </div>
          <div className="flex flex-wrap gap-6 text-sm">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="ignitionSource"
                value="ignition"
                checked={values.ignitionSource === "ignition"}
                onChange={(e) => update("ignitionSource", (e.target.value as any))}
              />
              <span>Ignition Wire</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="ignitionSource"
                value="motion"
                checked={values.ignitionSource === "motion"}
                onChange={(e) => update("ignitionSource", (e.target.value as any))}
              />
              <span>Motion-Based</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------
   Subcomponents
------------------------------ */
function FieldCard({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 dark:bg-foreground/5">
      <div className="mb-2">
        <div className="text-sm font-medium">{title}</div>
        {hint ? <div className="text-[12px] text-muted-foreground">{hint}</div> : null}
      </div>
      {children}
    </div>
  );
}

function NumberField({ id, label, value, onChange, min, max, step, suffix }: {
  id: string;
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  step?: number | "any";
  suffix?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      <div className="relative">
        <input
          id={id}
          type="number"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 pr-16 text-sm text-foreground outline-none focus:ring-0"
          value={Number.isFinite(value) ? String(value) : ""}
          onChange={(e) => onChange(clamp(toNumberStrict(e.target.value), min ?? Number.MIN_SAFE_INTEGER, max ?? Number.MAX_SAFE_INTEGER))}
          min={min}
          max={max}
          step={step ?? "any"}
          inputMode="decimal"
        />
        {suffix && (
          <span className="pointer-events-none absolute inset-y-0 right-2 my-auto h-6 rounded-md border border-border bg-foreground/5 px-2 text-[12px] leading-6 text-muted-foreground">{suffix}</span>
        )}
      </div>
    </div>
  );
}
