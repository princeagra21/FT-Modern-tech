"use client";

import * as React from "react";
import { DateRange } from "react-day-picker";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES
// ============================================================================

export interface DateRangeValue {
  from: Date | null;
  to: Date | null;
  preset?: string;
}

export interface DateRangePreset {
  key: string;
  label: string;
  compute: (() => DateRangeValue) | null;
}

export interface MultiDateRangePickerProps {
  /** Current selected date range */
  value?: DateRangeValue;
  /** Callback when date range changes (only fired on Apply) */
  onChange?: (value: DateRangeValue) => void;
  /** Optional className for the trigger button */
  className?: string;
  /** Week starts on: 0 = Sunday, 1 = Monday */
  weekStartsOn?: 0 | 1;
  /** Number of months to display in calendar */
  numberOfMonths?: 1 | 2;
  /** Custom presets - if not provided, default presets will be used */
  presets?: DateRangePreset[];
  /** Placeholder text when no date is selected */
  placeholder?: string;
  /** Disabled state */
  disabled?: boolean;
}

// ============================================================================
// UTILITIES
// ============================================================================

function startOfDay(d: Date): Date {
  const nd = new Date(d);
  nd.setHours(0, 0, 0, 0);
  return nd;
}

function addDays(d: Date, n: number): Date {
  const nd = new Date(d);
  nd.setDate(nd.getDate() + n);
  return nd;
}

function startOfWeek(d: Date, weekStartsOn = 0): Date {
  const nd = startOfDay(d);
  const day = nd.getDay();
  const diff = (day - weekStartsOn + 7) % 7;
  return addDays(nd, -diff);
}

function formatDate(d?: Date | null): string {
  if (!d) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ============================================================================
// DEFAULT PRESETS
// ============================================================================

export const buildDefaultPresets = (today = new Date()): DateRangePreset[] => {
  const T = startOfDay(today);
  const lastSunday = startOfWeek(T, 0);
  const prevWeekSun = addDays(lastSunday, -7);
  const prevWeekSat = addDays(lastSunday, -1);

  return [
    { key: "custom", label: "Custom", compute: null },
    {
      key: "today",
      label: "Today",
      compute: () => ({ from: T, to: T, preset: "Today" }),
    },
    {
      key: "yesterday",
      label: "Yesterday",
      compute: () => ({
        from: addDays(T, -1),
        to: addDays(T, -1),
        preset: "Yesterday",
      }),
    },
    {
      key: "this-week",
      label: "This Week",
      compute: () => ({ from: lastSunday, to: T, preset: "This Week" }),
    },
    {
      key: "last-week",
      label: "Last Week",
      compute: () => ({
        from: prevWeekSun,
        to: prevWeekSat,
        preset: "Last Week",
      }),
    },
    {
      key: "last-7",
      label: "Last 7 Days",
      compute: () => ({ from: addDays(T, -6), to: T, preset: "Last 7 Days" }),
    },
    {
      key: "last-30",
      label: "Last 30 Days",
      compute: () => ({ from: addDays(T, -29), to: T, preset: "Last 30 Days" }),
    },
    {
      key: "last-90",
      label: "Last 90 Days",
      compute: () => ({ from: addDays(T, -89), to: T, preset: "Last 90 Days" }),
    },
  ];
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function MultiDateRangePicker({
  value,
  onChange,
  className,
  weekStartsOn = 0,
  numberOfMonths = 2,
  presets: customPresets,
  placeholder = "Select date range",
  disabled = false,
}: MultiDateRangePickerProps) {
  const presets = React.useMemo(
    () => customPresets || buildDefaultPresets(),
    [customPresets]
  );

  const [open, setOpen] = React.useState(false);

  // Safe values
  const safeFrom = value?.from ?? null;
  const safeTo = value?.to ?? null;

  // Committed value (what was applied)
  const committed = React.useRef<DateRangeValue>({
    from: safeFrom,
    to: safeTo,
    preset: value?.preset,
  });

  // Initial preset key
  const initialPresetKey = React.useMemo(() => {
    if (!value?.preset) return "custom";
    return presets.find((p) => p.label === value.preset)?.key ?? "custom";
  }, [value?.preset, presets]);

  const [selectedPreset, setSelectedPreset] =
    React.useState<string>(initialPresetKey);
  const [draft, setDraft] = React.useState<DateRange>({
    from: (safeFrom ?? undefined) as Date | undefined,
    to: (safeTo ?? undefined) as Date | undefined,
  });

  // Sync external changes
  React.useEffect(() => {
    const next: DateRangeValue = {
      from: value?.from ?? null,
      to: value?.to ?? null,
      preset: value?.preset,
    };
    committed.current = next;
    setDraft({ from: next.from ?? undefined, to: next.to ?? undefined });
    setSelectedPreset(
      value?.preset
        ? presets.find((p) => p.label === value.preset)?.key ?? "custom"
        : "custom"
    );
  }, [value, presets]);

  const label =
    draft?.from && draft?.to
      ? `${formatDate(draft.from)} – ${formatDate(draft.to)}`
      : placeholder;

  // Apply preset
  const applyPreset = (key: string) => {
    setSelectedPreset(key);
    const p = presets.find((x) => x.key === key);
    if (!p || !p.compute) return;
    const v = p.compute();
    setDraft({ from: v.from ?? undefined, to: v.to ?? undefined });
  };

  // Cancel
  const onCancel = () => {
    const c = committed.current;
    setDraft({ from: c.from ?? undefined, to: c.to ?? undefined });
    setSelectedPreset(
      c.preset
        ? presets.find((p) => p.label === c.preset)?.key ?? "custom"
        : "custom"
    );
    setOpen(false);
  };

  // Clear
  const onClear = () => {
    setSelectedPreset("custom");
    setDraft({ from: undefined, to: undefined });
  };

  // Apply
  const onApply = () => {
    const next: DateRangeValue = {
      from: draft?.from ?? null,
      to: draft?.to ?? null,
      preset:
        selectedPreset === "custom"
          ? undefined
          : presets.find((p) => p.key === selectedPreset)?.label,
    };
    committed.current = next;
    onChange?.(next);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "inline-flex w-full items-center justify-between rounded-lg border-neutral-300 px-3 py-2 text-left font-normal text-sm h-10 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100",
            !draft?.from && "text-neutral-500 dark:text-neutral-400",
            className
          )}
        >
          <span className="inline-flex items-center gap-2 truncate">
            <CalendarMonthIcon sx={{ fontSize: 18 }} />
            <span className="truncate">{label}</span>
          </span>
          <KeyboardArrowDownIcon
            sx={{ fontSize: 18 }}
            className="ml-2 flex-shrink-0"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="end"
        className="z-[1000] w-[95vw] sm:w-[720px] p-0 shadow-xl"
      >
        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-200 px-3 py-2.5 dark:border-neutral-700">
            <div className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
              {draft?.from && draft?.to ? (
                <span className="flex items-center gap-2">
                  {selectedPreset !== "custom" && (
                    <span className="rounded bg-neutral-100 px-2 py-0.5 typo-h6 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                      {presets.find((p) => p.key === selectedPreset)?.label}
                    </span>
                  )}
                  <span className="typo-p12n">
                    {formatDate(draft.from)} → {formatDate(draft.to)}
                  </span>
                </span>
              ) : (
                <span className="text-neutral-500 dark:text-neutral-400">
                  Choose a date range
                </span>
              )}
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
              aria-label="Close"
            >
              <CloseIcon sx={{ fontSize: 18 }} />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row">
            {/* Presets */}
            <div className="w-full sm:w-44 shrink-0 border-b sm:border-b-0 sm:border-r border-neutral-200 dark:border-neutral-700">
              <div className="p-2 space-y-0.5 max-h-[200px] sm:max-h-[400px] overflow-y-auto">
                {presets.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => applyPreset(p.key)}
                    className={cn(
                      "flex w-full items-center justify-between rounded px-2.5 py-1.5 text-left text-sm transition-colors",
                      selectedPreset === p.key
                        ? "bg-neutral-900 text-white dark:bg-white dark:text-black"
                        : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    )}
                  >
                    <span>{p.label}</span>
                    {p.key !== "custom" && (
                      <ChevronRightIcon
                        sx={{ fontSize: 16 }}
                        className={cn(selectedPreset === p.key && "opacity-80")}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar & Actions */}
            <div className="grow p-3">
              {/* Date Inputs */}
              <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="mb-1 font-medium text-neutral-500 dark:text-neutral-400">
                    Start
                  </div>
                  <div className="flex items-center rounded border border-neutral-300 bg-white px-2 py-1.5 dark:border-neutral-600 dark:bg-neutral-800">
                    <CalendarMonthIcon
                      sx={{ fontSize: 16 }}
                      className="mr-1.5 text-neutral-500 dark:text-neutral-400"
                    />
                    <span className="truncate text-neutral-700 dark:text-neutral-200">
                      {draft?.from ? formatDate(draft.from) : "—"}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="mb-1 font-medium text-neutral-500 dark:text-neutral-400">
                    End
                  </div>
                  <div className="flex items-center rounded border border-neutral-300 bg-white px-2 py-1.5 dark:border-neutral-600 dark:bg-neutral-800">
                    <CalendarMonthIcon
                      sx={{ fontSize: 16 }}
                      className="mr-1.5 text-neutral-500 dark:text-neutral-400"
                    />
                    <span className="truncate text-neutral-700 dark:text-neutral-200">
                      {draft?.to ? formatDate(draft.to) : "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Calendar */}
              <div className="rounded border border-neutral-200 p-2 mb-3 dark:border-neutral-700">
                <Calendar
                  mode="range"
                  weekStartsOn={weekStartsOn}
                  numberOfMonths={numberOfMonths}
                  selected={draft}
                  defaultMonth={draft?.from ?? new Date()}
                  onSelect={(range: DateRange | undefined) => {
                    if (!range) {
                      setDraft({ from: undefined, to: undefined });
                      setSelectedPreset("custom");
                      return;
                    }
                    // Ensure chronological order
                    if (range.from && range.to && range.from > range.to) {
                      setDraft({ from: range.to, to: range.from });
                    } else {
                      setDraft({
                        from: range.from ?? undefined,
                        to: range.to ?? undefined,
                      });
                    }
                    setSelectedPreset("custom");
                  }}
                  className="mx-auto"
                />
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between">
                <button
                  onClick={onClear}
                  className="typo-h6 text-neutral-600 hover:text-neutral-900 underline-offset-2 hover:underline dark:text-neutral-400 dark:hover:text-neutral-200"
                >
                  Clear
                </button>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={onCancel}
                    className="h-8 rounded border-neutral-300 text-xs px-3 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={onApply}
                    className="h-8 rounded bg-neutral-900 text-white hover:bg-neutral-800 text-xs px-3 dark:bg-white dark:text-black dark:hover:bg-neutral-100"
                    disabled={!draft?.from || !draft?.to}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ============================================================================
// CONVENIENCE EXPORT (for backward compatibility)
// ============================================================================

export default MultiDateRangePicker;
