"use client";

import * as React from "react";
import { DateRange } from "react-day-picker";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
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

export interface DateTimeRangeValue {
  from: Date | null;
  to: Date | null;
  preset?: string;
}

export interface DateTimeRangePreset {
  key: string;
  label: string;
  compute: (() => DateTimeRangeValue) | null;
}

export interface MultiDateTimeRangePickerProps {
  /** Current selected date-time range */
  value?: DateTimeRangeValue;
  /** Callback when date-time range changes (only fired on Apply) */
  onChange?: (value: DateTimeRangeValue) => void;
  /** Optional className for the trigger button */
  className?: string;
  /** Week starts on: 0 = Sunday, 1 = Monday */
  weekStartsOn?: 0 | 1;
  /** Number of months to display in calendar */
  numberOfMonths?: 1 | 2;
  /** Custom presets - if not provided, default presets will be used */
  presets?: DateTimeRangePreset[];
  /** Placeholder text when no date is selected */
  placeholder?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Enable 24-hour format */
  use24HourFormat?: boolean;
}

// ============================================================================
// UTILITIES
// ============================================================================

function startOfDay(d: Date): Date {
  const nd = new Date(d);
  nd.setHours(0, 0, 0, 0);
  return nd;
}

function endOfDay(d: Date): Date {
  const nd = new Date(d);
  nd.setHours(23, 59, 59, 999);
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

function formatDateTime(d?: Date | null, use24Hour = false): string {
  if (!d) return "";
  const dateStr = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: !use24Hour,
  });
  return `${dateStr} ${timeStr}`;
}

function formatDate(d?: Date | null): string {
  if (!d) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(d?: Date | null, use24Hour = false): string {
  if (!d) return "";
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: !use24Hour,
  });
}

// ============================================================================
// DEFAULT PRESETS
// ============================================================================

export const buildDefaultDateTimePresets = (
  today = new Date()
): DateTimeRangePreset[] => {
  const now = new Date(today);
  const startToday = startOfDay(now);
  const endToday = endOfDay(now);
  const lastSunday = startOfWeek(now, 0);
  const prevWeekSun = addDays(lastSunday, -7);
  const prevWeekSat = addDays(lastSunday, -1);

  return [
    { key: "custom", label: "Custom", compute: null },
    {
      key: "last-hour",
      label: "Last Hour",
      compute: () => {
        const end = new Date();
        const start = new Date(end.getTime() - 60 * 60 * 1000);
        return { from: start, to: end, preset: "Last Hour" };
      },
    },
    {
      key: "last-3-hours",
      label: "Last 3 Hours",
      compute: () => {
        const end = new Date();
        const start = new Date(end.getTime() - 3 * 60 * 60 * 1000);
        return { from: start, to: end, preset: "Last 3 Hours" };
      },
    },
    {
      key: "last-6-hours",
      label: "Last 6 Hours",
      compute: () => {
        const end = new Date();
        const start = new Date(end.getTime() - 6 * 60 * 60 * 1000);
        return { from: start, to: end, preset: "Last 6 Hours" };
      },
    },
    {
      key: "last-12-hours",
      label: "Last 12 Hours",
      compute: () => {
        const end = new Date();
        const start = new Date(end.getTime() - 12 * 60 * 60 * 1000);
        return { from: start, to: end, preset: "Last 12 Hours" };
      },
    },
    {
      key: "last-24-hours",
      label: "Last 24 Hours",
      compute: () => {
        const end = new Date();
        const start = new Date(end.getTime() - 24 * 60 * 60 * 1000);
        return { from: start, to: end, preset: "Last 24 Hours" };
      },
    },
    {
      key: "today",
      label: "Today",
      compute: () => ({ from: startToday, to: endToday, preset: "Today" }),
    },
    {
      key: "yesterday",
      label: "Yesterday",
      compute: () => ({
        from: startOfDay(addDays(now, -1)),
        to: endOfDay(addDays(now, -1)),
        preset: "Yesterday",
      }),
    },
    {
      key: "this-week",
      label: "This Week",
      compute: () => ({ from: lastSunday, to: now, preset: "This Week" }),
    },
    {
      key: "last-week",
      label: "Last Week",
      compute: () => ({
        from: prevWeekSun,
        to: endOfDay(prevWeekSat),
        preset: "Last Week",
      }),
    },
    {
      key: "last-7-days",
      label: "Last 7 Days",
      compute: () => ({
        from: startOfDay(addDays(now, -6)),
        to: now,
        preset: "Last 7 Days",
      }),
    },
    {
      key: "last-30-days",
      label: "Last 30 Days",
      compute: () => ({
        from: startOfDay(addDays(now, -29)),
        to: now,
        preset: "Last 30 Days",
      }),
    },
  ];
};

// ============================================================================
// TIME PICKER COMPONENT
// ============================================================================

interface TimePickerProps {
  value: Date | undefined;
  onChange: (date: Date) => void;
  use24Hour?: boolean;
  label: string;
}

function TimePicker({
  value,
  onChange,
  use24Hour = false,
  label,
}: TimePickerProps) {
  const hours = value?.getHours() ?? 0;
  const minutes = value?.getMinutes() ?? 0;

  const handleHourChange = (newHour: number) => {
    const newDate = value ? new Date(value) : new Date();
    newDate.setHours(newHour);
    onChange(newDate);
  };

  const handleMinuteChange = (newMinute: number) => {
    const newDate = value ? new Date(value) : new Date();
    newDate.setMinutes(newMinute);
    onChange(newDate);
  };

  const displayHour = use24Hour ? hours : hours % 12 || 12;
  const period = hours >= 12 ? "PM" : "AM";

  const handlePeriodToggle = () => {
    if (!use24Hour) {
      const newHour = hours >= 12 ? hours - 12 : hours + 12;
      handleHourChange(newHour);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block typo-h6 typo-base-muted">
        {label}
      </label>
      <div className="flex items-center gap-2">
        {/* Hour Input */}
        <div className="flex-1">
          <input
            type="number"
            min={use24Hour ? 0 : 1}
            max={use24Hour ? 23 : 12}
            value={displayHour}
            onChange={(e) => {
              let newHour = parseInt(e.target.value) || 0;
              if (!use24Hour) {
                if (newHour > 12) newHour = 12;
                if (newHour < 1) newHour = 1;
                newHour =
                  period === "PM"
                    ? newHour === 12
                      ? 12
                      : newHour + 12
                    : newHour === 12
                    ? 0
                    : newHour;
              } else {
                if (newHour > 23) newHour = 23;
                if (newHour < 0) newHour = 0;
              }
              handleHourChange(newHour);
            }}
            className="w-full px-2 py-1.5 text-center border border-neutral-300 rounded typo-p focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
          />
        </div>
        <span className="typo-base-muted font-medium ">
          :
        </span>
        {/* Minute Input */}
        <div className="flex-1">
          <input
            type="number"
            min={0}
            max={59}
            value={minutes.toString().padStart(2, "0")}
            onChange={(e) => {
              let newMinute = parseInt(e.target.value) || 0;
              if (newMinute > 59) newMinute = 59;
              if (newMinute < 0) newMinute = 0;
              handleMinuteChange(newMinute);
            }}
            className="w-full px-2 py-1.5 text-center border border-neutral-300 rounded typo-p focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
          />
        </div>
        {/* AM/PM Toggle */}
        {!use24Hour && (
          <button
            onClick={handlePeriodToggle}
            className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded typo-p500 transition-colors dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:border-neutral-600 dark:text-neutral-200"
          >
            {period}
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function MultiDateTimeRangePicker({
  value,
  onChange,
  className,
  weekStartsOn = 0,
  numberOfMonths = 2,
  presets: customPresets,
  placeholder = "Select date-time range",
  disabled = false,
  use24HourFormat = false,
}: MultiDateTimeRangePickerProps) {
  const presets = React.useMemo(
    () => customPresets || buildDefaultDateTimePresets(),
    [customPresets]
  );

  const [open, setOpen] = React.useState(false);

  // Safe values
  const safeFrom = value?.from ?? null;
  const safeTo = value?.to ?? null;

  // Committed value (what was applied)
  const committed = React.useRef<DateTimeRangeValue>({
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
    const next: DateTimeRangeValue = {
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
      ? `${formatDateTime(draft.from, use24HourFormat)} – ${formatDateTime(
          draft.to,
          use24HourFormat
        )}`
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
    const next: DateTimeRangeValue = {
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

  // Update time for start date
  const handleStartTimeChange = (newDate: Date) => {
    setDraft((prev) => ({ ...prev, from: newDate }));
    setSelectedPreset("custom");
  };

  // Update time for end date
  const handleEndTimeChange = (newDate: Date) => {
    setDraft((prev) => ({ ...prev, to: newDate }));
    setSelectedPreset("custom");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "inline-flex w-full items-center justify-between rounded-lg border-neutral-300 px-3 py-2 text-left font-normal typo-p h-10 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100",
            !draft?.from && "text-neutral-500 ",
            className
          )}
        >
          <span className="inline-flex items-center gap-2 truncate">
            <AccessTimeIcon sx={{ fontSize: 18 }} />
            <span className="truncate typo-p12n">{label}</span>
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
            <div className="typo-p500 text-neutral-700 dark:text-neutral-200">
              {draft?.from && draft?.to ? (
                <span className="flex items-center gap-2 flex-wrap">
                  {selectedPreset !== "custom" && (
                    <span className="rounded bg-neutral-100 px-2 py-0.5 typo-h6 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                      {presets.find((p) => p.key === selectedPreset)?.label}
                    </span>
                  )}
                  <span className="text-xs">
                    {formatDateTime(draft.from, use24HourFormat)} →{" "}
                    {formatDateTime(draft.to, use24HourFormat)}
                  </span>
                </span>
              ) : (
                <span className="text-neutral-500 ">
                  Choose a date-time range
                </span>
              )}
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded p-1 text-neutral-500 hover:bg-neutral-100 hover:  dark:hover:bg-neutral-800 "
              aria-label="Close"
            >
              <CloseIcon sx={{ fontSize: 18 }} />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row">
            {/* Presets */}
            <div className="w-full sm:w-44 shrink-0 border-b sm:border-b-0 sm:border-r border-neutral-200 dark:border-neutral-700">
              <div className="p-2 space-y-0.5 max-h-[200px] sm:max-h-[500px] overflow-y-auto">
                {presets.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => applyPreset(p.key)}
                    className={cn(
                      "flex w-full items-center justify-between rounded px-2.5 py-1.5 text-left typo-p transition-colors",
                      selectedPreset === p.key
                        ? "bg-neutral-900 text-white dark:bg-white dark:text-black"
                        : "text-neutral-700 hover:bg-neutral-100  dark:hover:bg-neutral-800"
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

            {/* Calendar & Time Picker */}
            <div className="grow p-3 space-y-3">
              {/* Calendar */}
              <div className="rounded border border-neutral-200 p-2 dark:border-neutral-700">
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
                    // Preserve time when selecting dates
                    const newFrom = range.from
                      ? new Date(range.from)
                      : undefined;
                    const newTo = range.to ? new Date(range.to) : undefined;

                    if (newFrom && draft?.from) {
                      newFrom.setHours(
                        draft.from.getHours(),
                        draft.from.getMinutes()
                      );
                    }
                    if (newTo && draft?.to) {
                      newTo.setHours(
                        draft.to.getHours(),
                        draft.to.getMinutes()
                      );
                    }

                    // Ensure chronological order
                    if (newFrom && newTo && newFrom > newTo) {
                      setDraft({ from: newTo, to: newFrom });
                    } else {
                      setDraft({ from: newFrom, to: newTo });
                    }
                    setSelectedPreset("custom");
                  }}
                  className="mx-auto"
                />
              </div>

              {/* Time Pickers */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-200 dark:border-neutral-700">
                <TimePicker
                  value={draft?.from}
                  onChange={handleStartTimeChange}
                  use24Hour={use24HourFormat}
                  label="Start Time"
                />
                <TimePicker
                  value={draft?.to}
                  onChange={handleEndTimeChange}
                  use24Hour={use24HourFormat}
                  label="End Time"
                />
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-700">
                <button
                  onClick={onClear}
                  className="typo-h6 typo-base-muted underline-offset-2 hover:underline  "
                >
                  Clear
                </button>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={onCancel}
                    className="h-8 rounded border-neutral-300 typo-subtitle dark:hover:bg-neutral-800"
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

export default MultiDateTimeRangePicker;
