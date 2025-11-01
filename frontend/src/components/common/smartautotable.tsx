"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FilterList as FilterIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  Fullscreen as FullIcon,
  FullscreenExit as ExitFullIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  KeyboardArrowDown as ChevronDown,
  KeyboardArrowUp as ChevronUp,
  ViewColumn as ColumnsIcon,
  DragIndicator as GripIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import {
  motion,
  AnimatePresence,
  MotionConfig,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

// shadcn/ui primitives
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ------------------------------------
// Types
// ------------------------------------
export type DisplayCell<T> = {
  title: () => React.ReactNode;
  content: (row: T) => React.ReactNode;
  tooltip?: (row: T) => React.ReactNode;
};
export type DisplayMap<T> = Record<number, DisplayCell<T>>;

type TextFilter<T> = { kind: "text"; label?: string; field: keyof T | string };
type SelectFilter<T> = {
  kind: "select";
  label?: string;
  field: keyof T | string;
  options?: Array<{ label: string; value: any }>;
  derive?: boolean;
  multiple?: boolean;
};
type BooleanFilter<T> = {
  kind: "boolean";
  label?: string;
  field: keyof T | string;
  tristate?: boolean;
};
type NumberRangeFilter<T> = {
  kind: "numberRange";
  label?: string;
  field: keyof T | string;
};
type DateRangeFilter<T> = {
  kind: "dateRange";
  label?: string;
  field: keyof T | string;
};
type CustomFilter<T> = {
  kind: "custom";
  label?: string;
  editor: (value: any, setValue: (v: any) => void) => React.ReactNode;
  predicate: (row: T, value: any) => boolean;
};
export type FilterConfig<T> =
  | TextFilter<T>
  | SelectFilter<T>
  | BooleanFilter<T>
  | NumberRangeFilter<T>
  | DateRangeFilter<T>
  | CustomFilter<T>;
export type FilterConfigMap<T> = Record<string | number, FilterConfig<T>>;

type SmartAutoTableProps<T> = {
  title?: string;
  data: T[];
  getRowId?: (row: T, index: number) => string;
  displayOptions: DisplayMap<T>;
  filterConfig?: FilterConfigMap<T>;
  onRowClick?: (row: T) => void;
};

// ------------------------------------
// Z-indices & constants
// ------------------------------------
const Z_FILTER = "z-[740]"; // main filter popover
const Z_SELECT = "z-[800]"; // select menus above filter
const Z_CAL = "z-[780]"; // calendar above filter, below select
const Z_TIP = "z-[650]"; // tooltips below others
const ANY_SENTINEL = "__ANY__";

// Motion helpers
const springCard = { type: "spring", stiffness: 520, damping: 38, mass: 0.7 };
const springList = { type: "spring", stiffness: 420, damping: 32, mass: 0.6 };
const springPress = { type: "spring", stiffness: 600, damping: 36 };

// Framer-motion Button keeping shadcn styles
const MotionButton = motion(Button as any);

// ------------------------------------
// Utilities
// ------------------------------------
function getCell<T extends Record<string, any>>(
  row: T,
  field: keyof T | string
) {
  return row[field as keyof T];
}

// Parse "YYYY-MM-DD hh:mm AM/PM" or "YYYY-MM-DD"
function parseUserDate(input: any): Date | null {
  if (!input) return null;
  if (input instanceof Date) return isNaN(input.getTime()) ? null : input;
  if (typeof input === "string") {
    const m = input.match(
      /^(\d{4})-(\d{2})-(\d{2})\s+(\d{1,2}):(\d{2})\s*(AM|PM)$/i
    );
    if (m) {
      const [, ys, ms, ds, hs, mins, ampm] = m;
      let h = parseInt(hs, 10) % 12;
      if ((ampm || "").toUpperCase() === "PM") h += 12;
      return new Date(
        parseInt(ys),
        parseInt(ms) - 1,
        parseInt(ds),
        h,
        parseInt(mins),
        0,
        0
      );
    }
    const m2 = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m2) {
      const [, ys, ms, ds] = m2;
      return new Date(parseInt(ys), parseInt(ms) - 1, parseInt(ds));
    }
    const d2 = new Date(input);
    return isNaN(d2.getTime()) ? null : d2;
  }
  const d = new Date(input);
  return isNaN(d.getTime()) ? null : d;
}

function toCSV<T>(
  rows: T[],
  visibleCols: number[],
  display: DisplayMap<T>
): string {
  const getText = (n: React.ReactNode): string => {
    if (typeof n === "string") return n;
    if (typeof n === "number") return String(n);
    if (Array.isArray(n)) return n.map(getText).join(" ");
    if (React.isValidElement(n)) return getText((n.props as any)?.children);
    return "";
  };
  const headers = visibleCols.map((i) =>
    getText(display[i]?.title?.() ?? `Col ${i}`)
  );
  const lines = rows.map((r) =>
    visibleCols
      .map((i) => getText(display[i]?.content?.(r)))
      .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
      .join(",")
  );
  return [headers.join(","), ...lines].join("\n");
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 300);
}

// ------------------------------------
// Fancy Button hover “magnet” (subtle parallax)
// ------------------------------------
function useMagnetic() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-10, 10], [4, -4]), {
    stiffness: 200,
    damping: 20,
  });
  const ry = useSpring(useTransform(x, [-10, 10], [-4, 4]), {
    stiffness: 200,
    damping: 20,
  });

  function onMouseMove(e: React.MouseEvent) {
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  }
  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }
  return { x, y, rx, ry, onMouseMove, onMouseLeave };
}

// ------------------------------------
// DateRangeField (calendar popover with parallax + solid background)
// ------------------------------------
function DateRangeField({
  value,
  onChange,
}: {
  value: { from?: Date | string; to?: Date | string } | undefined;
  onChange: (v: any) => void;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <div className="space-y-2">
      <div className="text-xs text-slate-500 dark:text-slate-400">
        {value?.from || value?.to
          ? `${
              value?.from ? format(new Date(value.from), "dd-MMM-yyyy") : "…"
            } → ${value?.to ? format(new Date(value.to), "dd-MMM-yyyy") : "…"}`
          : "Choose a range"}
      </div>

      <Popover modal={false}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full h-9 justify-between rounded-lg border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-left font-normal"
          >
            <span className="truncate">
              {value?.from || value?.to
                ? `${
                    value?.from
                      ? format(new Date(value.from), "dd-MMM-yyyy")
                      : "…"
                  } → ${
                    value?.to ? format(new Date(value.to), "dd-MMM-yyyy") : "…"
                  }`
                : "(Select date range)"}
            </span>
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="ml-2 h-4 w-4 opacity-70"
            >
              <path
                d="M5.25 7.5 10 12.25 14.75 7.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          side="bottom"
          sideOffset={10}
          collisionPadding={12}
          className={`rounded-2xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-[0_20px_60px_rgba(2,6,23,0.25)] overflow-hidden p-0 ${Z_CAL}`}
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key="calendar-card"
              initial={
                prefersReduced
                  ? { opacity: 0 }
                  : { opacity: 0, y: -10, rotateX: -6, scale: 0.98 }
              }
              animate={
                prefersReduced
                  ? { opacity: 1 }
                  : { opacity: 1, y: 0, rotateX: 0, scale: 1 }
              }
              exit={
                prefersReduced
                  ? { opacity: 0 }
                  : { opacity: 0, y: -6, rotateX: -4, scale: 0.985 }
              }
              transition={ { type: "spring", stiffness: 520, damping: 38, mass: 0.7 }}
              style={{ transformOrigin: "50% -10px" }}
              className="p-2 will-change-transform"
            >
              <Calendar
                mode="range"
                numberOfMonths={2}
                className="rounded-xl bg-white dark:bg-slate-800 p-2
                           [&_.rdp-months]:flex [&_.rdp-months]:gap-4
                           [&_.rdp-month]:bg-white dark:[&_.rdp-month]:bg-slate-800
                           [&_.rdp-month]:rounded-lg [&_.rdp-month]:p-2"
                selected={
                  value?.from || value?.to
                    ? {
                        from: value?.from ? new Date(value.from) : undefined,
                        to: value?.to ? new Date(value.to) : undefined,
                      }
                    : undefined
                }
                onSelect={(range) =>
                  onChange({
                    from: range?.from ?? undefined,
                    to: range?.to ?? undefined,
                  })
                }
                initialFocus
              />
            </motion.div>
          </AnimatePresence>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// ------------------------------------
// Component
// ------------------------------------
export function SmartAutoTable<T extends Record<string, any>>(
  props: SmartAutoTableProps<T>
) {
  const {
    title = "Table",
    data,
    getRowId = (_row, i) => String(i),
    displayOptions,
    filterConfig = {},
    onRowClick,
  } = props;

  // ---- column order/visibility
  const initialOrder = useMemo(
    () =>
      Object.keys(displayOptions)
        .map((k) => Number(k))
        .sort((a, b) => a - b),
    [displayOptions]
  );
  const [columnOrder, setColumnOrder] = useState<number[]>(initialOrder);
  const [hiddenCols, setHiddenCols] = useState<number[]>([]);
  const visibleCols = useMemo(
    () => columnOrder.filter((i) => !hiddenCols.includes(i)),
    [columnOrder, hiddenCols]
  );

  // drag to reorder
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const onDragStart = (i: number) => setDragIdx(i);
  const onDragOver = (e: React.DragEvent) => e.preventDefault();
  const onDrop = (i: number) => {
    if (dragIdx === null || dragIdx === i) return;
    setColumnOrder((prev) => {
      const arr = [...prev];
      const from = dragIdx!;
      const [moved] = arr.splice(from, 1);
      const targetIndex = i > from ? i - 1 : i;
      arr.splice(targetIndex, 0, moved);
      return arr;
    });
    setDragIdx(null);
  };

  // ---- search/sort/paging
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<number>(initialOrder[0] ?? 0);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // ---- filters
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState<
    Record<string | number, any>
  >({});
  const filterEntries = useMemo(
    () => Object.entries(filterConfig) as [string | number, FilterConfig<T>][],
    [filterConfig]
  );

  // select options when derive=true
  const derivedSelectOptions = useMemo(() => {
    const map: Record<string, Array<{ label: string; value: string }>> = {};
    for (const [key, conf] of filterEntries) {
      if (conf.kind === "select" && conf.derive) {
        const uniq = new Set<string>();
        data.forEach((row) => {
          const v = getCell(row, conf.field);
          if (v !== undefined && v !== null) uniq.add(String(v));
        });
        map[String(key)] = Array.from(uniq).map((u) => ({
          label: String(u),
          value: String(u),
        }));
      }
    }
    return map;
  }, [filterEntries, data]);

  // ---- fullscreen
  const containerRef = useRef<HTMLDivElement | null>(null);
  function toggleFullscreen() {
    const el = containerRef.current as HTMLElement | null;
    if (!document.fullscreenElement && el) el.requestFullscreen?.();
    else document.exitFullscreen?.();
  }

  // ---- filtering
  const filteredData = useMemo(() => {
    const q = search.trim().toLowerCase();

    return data.filter((row) => {
      if (q && !Object.values(row).join(" ").toLowerCase().includes(q))
        return false;

      for (const [key, conf] of filterEntries) {
        const rawValue = filterValues[key];
        if (
          rawValue == null ||
          rawValue === "" ||
          (Array.isArray(rawValue) && rawValue.length === 0) ||
          rawValue === ANY_SENTINEL
        )
          continue;

        if (conf.kind === "text") {
          const v = String(getCell(row, conf.field) ?? "").toLowerCase();
          const tokens = String(rawValue)
            .toLowerCase()
            .split(/\s+/)
            .filter(Boolean);
          if (!tokens.every((t) => v.includes(t))) return false;
        }

        if (conf.kind === "select") {
          const cell = String(getCell(row, conf.field) ?? "");
          if (conf.multiple) {
            const vals = Array.isArray(rawValue)
              ? rawValue.map(String)
              : [String(rawValue)];
            if (!vals.includes(cell)) return false;
          } else {
            if (String(rawValue) !== cell) return false;
          }
        }

        if (conf.kind === "boolean") {
          if (conf.tristate) {
            if (rawValue === "all") {
              /* no-op */
            } else if (rawValue === "true" || rawValue === true) {
              if (Boolean(getCell(row, conf.field)) !== true) return false;
            } else if (rawValue === "false" || rawValue === false) {
              if (Boolean(getCell(row, conf.field)) !== false) return false;
            }
          } else {
            if (!Boolean(getCell(row, conf.field))) return false; // Only True
          }
        }

        if (conf.kind === "numberRange") {
          const n = Number(getCell(row, conf.field));
          if (isNaN(n)) return false;
          if (rawValue?.min != null && n < rawValue.min) return false;
          if (rawValue?.max != null && n > rawValue.max) return false;
        }

        if (conf.kind === "dateRange") {
          const d = parseUserDate(getCell(row, conf.field));
          if (!d) continue;
          const from: Date | null = rawValue?.from
            ? parseUserDate(rawValue.from)
            : null;
          const to: Date | null = rawValue?.to
            ? parseUserDate(rawValue.to)
            : null;
          if (from && d < from) return false;
          if (to) {
            const end = new Date(to);
            end.setHours(23, 59, 59, 999);
            if (d > end) return false;
          }
        }

        if (conf.kind === "custom") {
          if (!conf.predicate(row, rawValue)) return false;
        }
      }

      return true;
    });
  }, [data, search, filterEntries, filterValues]);

  // ---- sorting & paging
  const sorted = useMemo(() => {
    const arr = [...filteredData];
    const dir = sortDir === "asc" ? 1 : -1;

    const txt = (n: React.ReactNode): string =>
      typeof n === "string"
        ? n
        : Array.isArray(n)
        ? n.map(txt).join(" ")
        : React.isValidElement(n)
        ? txt((n.props as any)?.children)
        : String(n ?? "");

    arr.sort((a, b) => {
      const va = txt(displayOptions[sortKey]?.content?.(a));
      const vb = txt(displayOptions[sortKey]?.content?.(b));
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });

    return arr;
  }, [filteredData, sortKey, sortDir, displayOptions]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  // ---- export/print
  function onExportCSV() {
    const csv = toCSV(sorted, visibleCols, displayOptions);
    downloadBlob(
      new Blob([csv], { type: "text/csv" }),
      `export_${Date.now()}.csv`
    );
  }
  function onExportJSON() {
    downloadBlob(
      new Blob([JSON.stringify(sorted, null, 2)], { type: "application/json" }),
      `export_${Date.now()}.json`
    );
  }
  function onPrint() {
    const printable = document.getElementById("smart-table-print");
    if (!printable) return;
    const win = window.open("", "_blank", "width=1024,height=768");
    if (!win) return;
    win.document
      .write(`<!doctype html><html><head><meta charset="utf-8"/><title>Print</title>
    <style>
      body{font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial;}
      h1{font-size:16px;margin:0 0 8px 0}
      table{width:100%;border-collapse:collapse;font-size:12px}
      th,td{border:1px solid #e5e7eb;padding:6px 8px;text-align:left}
      th{background:#f9fafb}
    </style></head><body>`);
    win.document.write(`<h1>${title}</h1>`);
    win.document.write(printable.outerHTML);
    win.document.write("</body></html>");
    win.document.close();
    win.focus();
    win.print();
    win.close();
  }

  // Magnetic hover for high-traffic buttons
  const magnet = useMagnetic();

  // ------------------------------------
  // UI
  // ------------------------------------
  return (
    <MotionConfig
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      reducedMotion="user"
    >
      <div ref={containerRef} className="mx-auto max-w-[1400px] p-4">
        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 520, damping: 38, mass: 0.7 }}
          className="mb-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur border border-slate-200/80 dark:border-slate-700 rounded-2xl p-4 shadow-[0_6px_24px_rgba(2,6,23,0.06)]"
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Left: search + filter */}
            <div className="flex flex-1 items-stretch gap-3">
              <div className="relative flex-1 lg:max-w-sm">
                <SearchIcon
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                  fontSize="small"
                />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search name, email, role, department…"
                  className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 pl-10 pr-4 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 outline-none ring-0 transition focus:border-slate-400 dark:focus:border-slate-400 focus:bg-white dark:focus:bg-slate-600 focus:shadow-sm"
                />
              </div>

              {/* Filter popover */}
              <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                <PopoverTrigger asChild>
                  <MotionButton
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ y: -1 }}
                    onMouseMove={magnet.onMouseMove}
                    onMouseLeave={magnet.onMouseLeave}
                    style={{ x: magnet.ry, y: magnet.rx }}
                    transition={springPress}
                    variant="outline"
                    className="h-10 gap-2 rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  >
                    <FilterIcon fontSize="small" /> Filter
                  </MotionButton>
                </PopoverTrigger>

                {/* MAIN FILTER PANEL */}
                <PopoverContent
                  align="start"
                  side="bottom"
                  sideOffset={10}
                  className={`w-[360px] sm:w-[460px] rounded-2xl border border-slate-200/80 dark:border-slate-600/80 bg-white/95 dark:bg-slate-800/95 backdrop-blur p-0 shadow-[0_20px_70px_rgba(2,6,23,0.25)] ${Z_FILTER} overflow-visible`}
                >
                  <AnimatePresence initial={false} mode="wait">
                    <motion.div
                      key={filterOpen ? "open" : "closed"}
                      initial={{
                        opacity: 0,
                        y: -10,
                        rotateX: -7,
                        scale: 0.985,
                      }}
                      animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, rotateX: -5, scale: 0.985 }}
                      transition={{ type: "spring", stiffness: 520, damping: 38, mass: 0.7 }}
                      style={{ transformOrigin: "50% -10px" }}
                      className="will-change-transform"
                    >
                      {/* Header */}
                      <div className="px-3 pt-3">
                        <div className="px-1 pb-2 text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400 font-medium">
                          Dynamic Filters
                        </div>
                        <Separator className="mb-3" />
                      </div>

                      {/* Scrollable body w/ staggered filter items */}
                      <div className="px-3 pb-3">
                        <div className="max-h-[520px] overflow-y-auto pr-2">
                          <motion.div
                            initial="hidden"
                            animate="show"
                            variants={{
                              hidden: {
                                transition: {
                                  staggerChildren: 0.02,
                                  staggerDirection: -1,
                                },
                              },
                              show: { transition: { staggerChildren: 0.04 } },
                            }}
                            className="space-y-3"
                          >
                            {Object.entries(filterConfig).map(([key, conf]) => {
                              const value = filterValues[key] as any;
                              const setVal = (v: any) => {
                                setFilterValues((prev) => ({
                                  ...prev,
                                  [key]: v,
                                }));
                                setPage(1);
                              };

                              // select options
                              let selectOptions:
                                | Array<{ label: string; value: string }>
                                | undefined;
                              if (conf.kind === "select") {
                                if (conf.options) {
                                  selectOptions = conf.options.map((o) => ({
                                    label: o.label,
                                    value: String(o.value ?? o.label ?? ""),
                                  }));
                                } else if (conf.derive) {
                                  const derived = new Set<string>();
                                  data.forEach((row) => {
                                    const v = getCell(row, conf.field);
                                    if (v !== undefined && v !== null)
                                      derived.add(String(v));
                                  });
                                  selectOptions = Array.from(derived).map(
                                    (u) => ({ label: u, value: u })
                                  );
                                } else selectOptions = [];
                              }

                              return (
                                <motion.div
                                  key={String(key)}
                                  variants={{
                                    hidden: { opacity: 0, y: 6 },
                                    show: { opacity: 1, y: 0 },
                                  }}
                                  transition={{ type: "spring", stiffness: 520, damping: 38, mass: 0.7 }}
                                  className="rounded-xl border border-slate-200 dark:border-slate-600 p-3 bg-white/70 dark:bg-slate-800/70"
                                >
                                  <Label className="mb-2 block text-xs text-slate-700 dark:text-slate-300">
                                    {conf.label ?? key}
                                  </Label>

                                  {/* TEXT */}
                                  {"text" === conf.kind && (
                                    <Input
                                      value={value ?? ""}
                                      onChange={(e) => setVal(e.target.value)}
                                      placeholder="Type to filter…"
                                      className="h-9"
                                    />
                                  )}

                                  {/* SELECT */}
                                  {"select" === conf.kind && (
                                    <>
                                      {conf.multiple ? (
                                        <select
                                          multiple
                                          value={
                                            Array.isArray(value)
                                              ? value.map(String)
                                              : value
                                              ? [String(value)]
                                              : []
                                          }
                                          onChange={(e) => {
                                            const arr = Array.from(
                                              e.target.selectedOptions
                                            ).map((o) => o.value);
                                            setVal(arr);
                                          }}
                                          className="h-24 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-2 text-sm outline-none"
                                        >
                                          {(selectOptions || []).map((opt) => (
                                            <option
                                              key={opt.value}
                                              value={opt.value}
                                            >
                                              {opt.label}
                                            </option>
                                          ))}
                                        </select>
                                      ) : (
                                        <Select
                                          value={value ?? ANY_SENTINEL}
                                          onValueChange={(v) =>
                                            setVal(
                                              v === ANY_SENTINEL ? undefined : v
                                            )
                                          }
                                        >
                                          <SelectTrigger className="h-9">
                                            <SelectValue placeholder="(Any)" />
                                          </SelectTrigger>
                                          <SelectContent
                                            position="popper"
                                            sideOffset={6}
                                            className={`${Z_SELECT} max-h-64 overflow-y-auto`}
                                          >
                                            <SelectItem value={ANY_SENTINEL}>
                                              (Any)
                                            </SelectItem>
                                            {(selectOptions || []).map(
                                              (opt) => (
                                                <SelectItem
                                                  key={opt.value}
                                                  value={opt.value}
                                                >
                                                  {opt.label}
                                                </SelectItem>
                                              )
                                            )}
                                          </SelectContent>
                                        </Select>
                                      )}
                                    </>
                                  )}

                                  {/* BOOLEAN */}
                                  {"boolean" === conf.kind && (
                                    <>
                                      {conf.tristate ? (
                                        <Select
                                          value={value ?? "all"}
                                          onValueChange={(v) => setVal(v)}
                                        >
                                          <SelectTrigger className="h-9">
                                            <SelectValue placeholder="All" />
                                          </SelectTrigger>
                                          <SelectContent
                                            position="popper"
                                            sideOffset={6}
                                            className={`${Z_SELECT} max-h-64 overflow-y-auto`}
                                          >
                                            <SelectItem value="all">
                                              All
                                            </SelectItem>
                                            <SelectItem value="true">
                                              True
                                            </SelectItem>
                                            <SelectItem value="false">
                                              False
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      ) : (
                                        <div className="flex items-center gap-2">
                                          <Checkbox
                                            id={`bool-${String(key)}`}
                                            checked={Boolean(value)}
                                            onCheckedChange={(v) =>
                                              setVal(Boolean(v))
                                            }
                                          />
                                          <Label
                                            htmlFor={`bool-${String(key)}`}
                                            className="text-sm"
                                          >
                                            Only True
                                          </Label>
                                        </div>
                                      )}
                                    </>
                                  )}

                                  {/* NUMBER RANGE */}
                                  {"numberRange" === conf.kind && (
                                    <div className="flex items-center gap-2">
                                      <Input
                                        type="number"
                                        placeholder="Min"
                                        className="h-9"
                                        value={value?.min ?? ""}
                                        onChange={(e) =>
                                          setVal({
                                            ...value,
                                            min:
                                              e.target.value === ""
                                                ? undefined
                                                : Number(e.target.value),
                                          })
                                        }
                                      />
                                      <span className="text-slate-400">—</span>
                                      <Input
                                        type="number"
                                        placeholder="Max"
                                        className="h-9"
                                        value={value?.max ?? ""}
                                        onChange={(e) =>
                                          setVal({
                                            ...value,
                                            max:
                                              e.target.value === ""
                                                ? undefined
                                                : Number(e.target.value),
                                          })
                                        }
                                      />
                                    </div>
                                  )}

                                  {/* DATE RANGE */}
                                  {"dateRange" === conf.kind && (
                                    <DateRangeField
                                      value={value}
                                      onChange={setVal}
                                    />
                                  )}

                                  {/* CUSTOM */}
                                  {"custom" === conf.kind && (
                                    <div>{conf.editor(value, setVal)}</div>
                                  )}
                                </motion.div>
                              );
                            })}
                          </motion.div>
                        </div>
                      </div>

                      {/* Sticky footer */}
                      <div className="sticky bottom-0 left-0 right-0 border-t border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur px-3 py-3 rounded-b-2xl">
                        <div className="flex items-center justify-between">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-slate-500"
                            onClick={() => {
                              setFilterValues({});
                              setPage(1);
                            }}
                          >
                            Clear all
                          </Button>
                          <MotionButton
                            size="sm"
                            className="text-xs"
                            whileTap={{ scale: 0.98 }}
                            whileHover={{ y: -0.5 }}
                            transition={springPress}
                            onClick={() => setFilterOpen(false)}
                          >
                            Apply
                          </MotionButton>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </PopoverContent>
              </Popover>
            </div>

            {/* Right: records per page + exports + columns + fullscreen */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap">
                  Records per page:
                </span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="h-10 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 px-3 text-sm font-medium outline-none"
                >
                  {[10, 20, 30, 50, 100].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <MotionButton
                whileTap={{ scale: 0.98 }}
                whileHover={{ y: -1 }}
                transition={springPress}
                onClick={onExportCSV}
                variant="outline"
                className="h-10 gap-2 rounded-xl"
              >
                <DownloadIcon fontSize="small" /> CSV
              </MotionButton>
              <MotionButton
                whileTap={{ scale: 0.98 }}
                whileHover={{ y: -1 }}
                transition={springPress}
                onClick={onExportJSON}
                variant="outline"
                className="h-10 gap-2 rounded-xl"
              >
                JSON
              </MotionButton>
              <MotionButton
                whileTap={{ scale: 0.98 }}
                whileHover={{ y: -1 }}
                transition={springPress}
                onClick={onPrint}
                variant="outline"
                className="h-10 gap-2 rounded-xl"
              >
                <PrintIcon fontSize="small" /> Print
              </MotionButton>

              {/* Column Manager */}
              <Popover>
                <PopoverTrigger asChild>
                  <MotionButton
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ y: -1 }}
                    transition={springPress}
                    variant="outline"
                    className="h-10 gap-2 rounded-xl"
                  >
                    <SettingsIcon fontSize="small" />{" "}
                    <span className="hidden sm:inline">Columns</span>
                  </MotionButton>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-72 rounded-2xl">
                  <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400 font-medium">
                    <ColumnsIcon fontSize="small" /> Drag to reorder · Toggle to
                    hide
                  </div>
                  <div className="space-y-2">
                    {columnOrder.map((idx, i) => (
                      <motion.div
                        key={idx}
                        layout
                        draggable
                        onDragStart={() => onDragStart(i)}
                        onDragOver={onDragOver}
                        onDrop={() => onDrop(i)}
                        whileTap={{ scale: 0.98 }}
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 600, damping: 36 }}
                        className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700"
                      >
                        <div className="flex items-center gap-2">
                          <GripIcon
                            fontSize="small"
                            className="text-slate-400"
                          />
                          <div className="text-sm">
                            {displayOptions[idx]?.title?.()}
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          className="h-4 w-4"
                          checked={!hiddenCols.includes(idx)}
                          onChange={() =>
                            setHiddenCols((prev) =>
                              prev.includes(idx)
                                ? prev.filter((c) => c !== idx)
                                : [...prev, idx]
                            )
                          }
                        />
                      </motion.div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <MotionButton
                whileTap={{ scale: 0.98 }}
                whileHover={{ y: -1 }}
                transition={springPress}
                onClick={toggleFullscreen}
                variant="outline"
                className="h-10 gap-2 rounded-xl"
              >
                {!document.fullscreenElement ? (
                  <FullIcon fontSize="small" />
                ) : (
                  <ExitFullIcon fontSize="small" />
                )}{" "}
                Full Screen
              </MotionButton>
            </div>
          </div>
        </motion.div>

        {/* Table */}
        <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div id="smart-table-print">
            <table className="w-full min-w-[800px] text-sm">
              <thead>
                <tr className="bg-white dark:bg-slate-800 text-left">
                  {visibleCols.map((i) => {
                    const active = sortKey === i;
                    return (
                      <th
                        key={i}
                        className={`whitespace-nowrap select-none px-3 py-4 bg-slate-100 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600 ${
                          active ? "bg-slate-200 dark:bg-slate-600" : ""
                        }`}
                      >
                        <button
                          onClick={() => {
                            if (sortKey === i)
                              setSortDir((d) => (d === "asc" ? "desc" : "asc"));
                            else {
                              setSortKey(i);
                              setSortDir("asc");
                            }
                          }}
                          className="inline-flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-slate-100 hover:text-slate-700 dark:hover:text-slate-300 transition-colors uppercase tracking-wide"
                          title="Sort"
                        >
                          {displayOptions[i]?.title?.()}
                          <span className="opacity-70">
                            {active ? (
                              sortDir === "asc" ? (
                                <ChevronUp fontSize="small" />
                              ) : (
                                <ChevronDown fontSize="small" />
                              )
                            ) : null}
                          </span>
                        </button>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody>
                <AnimatePresence initial={false}>
                  {pageRows.length === 0 && (
                    <motion.tr
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td
                        colSpan={visibleCols.length}
                        className="px-6 py-10 text-center text-slate-500 dark:text-slate-400"
                      >
                        No results match your filters.
                      </td>
                    </motion.tr>
                  )}

                  {pageRows.map((row, rowIdx) => {
                    const rowId = getRowId(row, rowIdx);
                    return (
                      <motion.tr
                        key={rowId}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ type: "spring", stiffness: 420, damping: 32, mass: 0.6 }}
                        className="group cursor-pointer border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200"
                        onClick={() => onRowClick?.(row)}
                      >
                        {visibleCols.map((i) => {
                          const cell = displayOptions[i];
                          const contentNode = cell?.content?.(row);
                          const tooltipNode = cell?.tooltip
                            ? cell.tooltip(row)
                            : null;

                          return (
                            <motion.td
                              key={i}
                              layout
                              className="px-3 py-3"
                              whileHover={{ y: -0.25 }}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 38,
                              }}
                            >
                              {tooltipNode ? (
                                <TooltipProvider delayDuration={150}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div>{contentNode}</div>
                                    </TooltipTrigger>
                                    <TooltipContent
                                      side="top"
                                      className={`max-w-xs rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xl ${Z_TIP}`}
                                    >
                                      {tooltipNode}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ) : (
                                contentNode
                              )}
                            </motion.td>
                          );
                        })}
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 sm:px-6 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="text-sm text-slate-600 dark:text-slate-400 text-center lg:text-left lg:flex-1">
                Showing{" "}
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {pageRows.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {sorted.length}
                </span>{" "}
                results
              </div>

              <div className="flex items-center justify-center gap-1 flex-wrap">
                <button
                  className="px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200 disabled:opacity-50"
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                >
                  First
                </button>
                <button
                  className="px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </button>

                <div className="flex items-center gap-1 mx-2">
                  {(() => {
                    const out = [];
                    const start = Math.max(1, page - 2);
                    const end = Math.min(totalPages, page + 2);
                    for (let i = start; i <= end; i++) {
                      out.push(
                        <button
                          key={i}
                          className={`min-w-[36px] h-9 px-2 text-sm font-medium rounded-lg transition-colors ${
                            i === page
                              ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm"
                              : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                          }`}
                          onClick={() => setPage(i)}
                        >
                          {i}
                        </button>
                      );
                    }
                    return out;
                  })()}
                </div>

                <button
                  className="px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </button>
                <button
                  className="px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                >
                  Last
                </button>
              </div>

              <div className="text-sm text-slate-600 dark:text-slate-400 text-center lg:text-right lg:flex-1">
                Page{" "}
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {page}
                </span>{" "}
                of{" "}
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {totalPages}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
