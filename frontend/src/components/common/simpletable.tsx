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
const Z_FILTER = "z-[740]";
const Z_SELECT = "z-[800]";
const Z_CAL = "z-[780]";
const Z_TIP = "z-[650]";
const ANY_SENTINEL = "__ANY__";

// Motion helpers
const springCard = { type: "spring", stiffness: 520, damping: 38, mass: 0.7 };
const springList = {
  type: "spring",
  stiffness: 420,
  damping: 32,
  mass: 0.6,
} as const;
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
      <div className="typo-subtitle">
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
              transition={{ type: "spring", stiffness: 520, damping: 38, mass: 0.7 }}
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
                onSelect={(range: { from?: Date; to?: Date } | undefined) =>
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
  const visibleCols = useMemo(() => initialOrder, [initialOrder]);

  // ---- search/sort/paging
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<number>(initialOrder[0] ?? 0);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // ---- filtering (only search, no complex filters)
  const filteredData = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;

    return data.filter((row) => {
      return Object.values(row).join(" ").toLowerCase().includes(q);
    });
  }, [data, search]);

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

  // ------------------------------------
  // UI
  // ------------------------------------
  return (
    <MotionConfig
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      reducedMotion="user"
    >
      <div className="mx-auto max-w-7xl py-4">
        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springList}
          className="mb-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur border border-slate-200/80 dark:border-slate-700 rounded-2xl p-4 shadow-[0_6px_24px_rgba(2,6,23,0.06)]"
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Left: search */}
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
                  placeholder="Search"
                  className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 pl-10 pr-4 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 outline-none ring-0 transition focus:border-slate-400 dark:focus:border-slate-400 focus:bg-white dark:focus:bg-slate-600 focus:shadow-sm"
                />
              </div>
            </div>

            {/* Right: records per page */}
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
                        transition={springList}
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
                  className="px-3 py-2 typo-p12n font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200 disabled:opacity-50"
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                >
                  First
                </button>
                <button
                  className="px-3 py-2 typo-p12n font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
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
                  className="px-3 py-2 typo-p12n font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </button>
                <button
                  className="px-3 py-2 typo-p12n font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
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
