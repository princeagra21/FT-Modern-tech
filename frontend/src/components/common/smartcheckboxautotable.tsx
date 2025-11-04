// File: "@/components/common/smartcheckboxautotable.tsx"
/**
 * SmartCheckboxAutoTable with LocalStorage Preferences
 *
 * FEATURES:
 * - Automatic localStorage sync for user preferences based on table title
 * - Saves: column order, hidden columns, filters, sort settings
 * - Global page size setting (shared across all tables)
 * - Preferences persist across browser sessions
 * - Reset functionality to restore defaults
 *
 * USAGE:
 * Just pass a unique 'title' prop - preferences will be automatically saved/restored
 *
 * STORAGE KEYS:
 * - smartTable_globalPageSize: Global page size setting
 * - smartTable_preferences_{title}: Table-specific preferences
 */
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  // toolbar/common
  FilterList as FilterIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  Fullscreen as FullIcon,
  FullscreenExit as ExitFullIcon,
  KeyboardArrowDown as ChevronDown,
  KeyboardArrowUp as ChevronUp,
  ViewColumn as ColumnsIcon,
  DragIndicator as GripIcon,
  Refresh as RefreshIcon,

  // export/menu icons
  Download as DownloadIcon,
  InsertDriveFile as CsvIcon,
  TableChart as XlsxIcon,
  DataObject as JsonIcon,
  PictureAsPdf as PdfIcon,
  Html as HtmlIcon,

  // bulk/action icon candidates
  Delete as DeleteIcon,
  DeleteOutline as DeleteOutlineIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  PersonOff as PersonOffIcon,
  PowerSettingsNew as PowerOnIcon,
  PowerOff as PowerOffIcon,
  Archive as ArchiveIcon,
  Unarchive as UnarchiveIcon,
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

// shadcn/ui
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
import CommonDrawer from "./commonDrawer";

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

export type MultiSelectOption<T> = {
  name: string;
  callback: (
    selectedRows: T[],
    selectedIds: Set<string>
  ) => void | Promise<void>;
  variant?: "default" | "secondary" | "ghost" | "destructive" | "outline";
  tooltip?: string;
  /** Either pass iconName or explicit icon node */
  iconName?: string; // ex: "Download", "delete_outline", "toggleOff"
  icon?: React.ReactNode;
};

type BrandConfig = {
  name?: string;
  logoUrl?: string;
  addressLine1?: string;
  addressLine2?: string;
  footerNote?: string;
};

type SmartAutoTableProps<T> = {
  title?: string;
  data: T[];
  getRowId?: (row: T, index: number) => string;
  displayOptions: DisplayMap<T>;
  filterConfig?: FilterConfigMap<T>;
  onRowClick?: (row: T) => void;
  onSelectionChange?: (selectedRows: T[]) => void;
  multiSelectOptions?: MultiSelectOption<T>[]; // optional; if omitted -> no checkboxes/bulk bar
  exportBrand?: BrandConfig; // optional; branding for exports
  onRefresh?: () => Promise<any>; // optional; refresh callback
  isDrawerTypeFilter?: boolean;
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
const springList = { type: "spring", stiffness: 420, damping: 32, mass: 0.6 };
const springPress = { type: "spring", stiffness: 600, damping: 36 };
const MotionButton = motion(Button as any);

// ------------------------------------
// Icon registry + helpers
// ------------------------------------
function normalizeIconKey(name?: string) {
  return (name ?? "")
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2") // camelCase → snake_case
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/-+/g, "_");
}

const ICONS: Record<string, React.ElementType> = {
  // toolbar/common
  filter_list: FilterIcon,
  search: SearchIcon,
  settings: SettingsIcon,
  fullscreen: FullIcon,
  fullscreen_exit: ExitFullIcon,
  keyboard_arrow_down: ChevronDown,
  keyboard_arrow_up: ChevronUp,
  view_column: ColumnsIcon,
  drag_indicator: GripIcon,
  refresh: RefreshIcon,

  // export menu
  download: DownloadIcon,
  file_download: DownloadIcon,
  export: DownloadIcon,
  save: DownloadIcon,

  insert_drive_file: CsvIcon, // CSV
  table_chart: XlsxIcon, // XLSX
  data_object: JsonIcon, // JSON
  picture_as_pdf: PdfIcon, // PDF
  html: HtmlIcon, // HTML

  // bulk/action candidates
  delete: DeleteIcon,
  delete_outline: DeleteOutlineIcon,
  toggle_on: ToggleOnIcon,
  toggle_off: ToggleOffIcon,
  block: BlockIcon,
  check_circle: CheckCircleIcon,
  person: PersonIcon,
  person_off: PersonOffIcon,
  power_settings_new: PowerOnIcon,
  power_off: PowerOffIcon,
  archive: ArchiveIcon,
  unarchive: UnarchiveIcon,
};

// helpful fuzzy fallback
function inferIconFromName(name: string) {
  const k = normalizeIconKey(name);
  if (k.includes("download") || k.includes("export") || k.includes("save"))
    return DownloadIcon;
  if (k.includes("delete") || k.includes("remove")) return DeleteIcon;
  if (
    k.includes("deactivate") ||
    k.includes("disable") ||
    k.includes("toggle_off")
  )
    return ToggleOffIcon;
  if (k.includes("activate") || k.includes("enable") || k.includes("toggle_on"))
    return ToggleOnIcon;
  if (k.includes("archive")) return ArchiveIcon;
  if (k.includes("unarchive")) return UnarchiveIcon;
  if (k.includes("block")) return BlockIcon;
  if (k.includes("approve") || k.includes("confirm") || k.includes("check"))
    return CheckCircleIcon;
  if (k.includes("power_off")) return PowerOffIcon;
  if (k.includes("power")) return PowerOnIcon;
  return undefined;
}

function getIconByName(name?: string): React.ElementType | undefined {
  if (!name) return undefined;
  const key = normalizeIconKey(name);
  let Icon = ICONS[key];
  if (!Icon) {
    const inferred = inferIconFromName(name);
    Icon = inferred || "span"; // fallback to a neutral element
  }
  if (!Icon && process.env.NODE_ENV !== "production") {
    console.warn(
      `[SmartCheckboxAutoTable] iconName "${name}" not found. Register it in ICONS.`
    );
  }
  return Icon;
}

// ------------------------------------
// LocalStorage Utilities
// ------------------------------------
const STORAGE_KEYS = {
  GLOBAL_PAGE_SIZE: "smartTable_globalPageSize",
  TABLE_PREFERENCES: "smartTable_preferences_",
};

interface TablePreferences {
  columnOrder: number[];
  hiddenCols: number[];
  filters: Record<string | number, any>;
  sortKey: number;
  sortDir: "asc" | "desc";
}

function getStorageKey(title: string) {
  // Create a safe key from title
  const safeTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_");
  return `${STORAGE_KEYS.TABLE_PREFERENCES}${safeTitle}`;
}

function saveTablePreferences(title: string, preferences: TablePreferences) {
  try {
    const key = getStorageKey(title);
    localStorage.setItem(key, JSON.stringify(preferences));
  } catch (error) {
    console.warn("Failed to save table preferences:", error);
  }
}

function loadTablePreferences(title: string): Partial<TablePreferences> | null {
  try {
    const key = getStorageKey(title);
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn("Failed to load table preferences:", error);
  }
  return null;
}

function saveGlobalPageSize(pageSize: number) {
  try {
    localStorage.setItem(STORAGE_KEYS.GLOBAL_PAGE_SIZE, String(pageSize));
  } catch (error) {
    console.warn("Failed to save global page size:", error);
  }
}

function loadGlobalPageSize(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.GLOBAL_PAGE_SIZE);
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn("Failed to load global page size:", error);
  }
  return 10; // Default
}

function clearTablePreferences(title: string) {
  try {
    const key = getStorageKey(title);
    localStorage.removeItem(key);
  } catch (error) {
    console.warn("Failed to clear table preferences:", error);
  }
}

function getAllTablePreferences(): string[] {
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEYS.TABLE_PREFERENCES)) {
        keys.push(key);
      }
    }
    return keys;
  } catch (error) {
    console.warn("Failed to get table preferences keys:", error);
    return [];
  }
}

// ------------------------------------
// Utilities
// ------------------------------------
function getCell<T extends Record<string, any>>(
  row: T,
  field: keyof T | string
) {
  return row[field as keyof T];
}
function parseUserDate(input: any): Date | null {
  if (!input) return null;
  if (input instanceof Date && !isNaN(input.getTime())) return input;
  if (typeof input === "string") {
    const m1 = input.match(
      /^(\d{4})-(\d{2})-(\d{2})\s+(\d{1,2}):(\d{2})\s*(AM|PM)$/i
    );
    if (m1) {
      const [, ys, ms, ds, hs, mins, ampm] = m1;
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
  }
  const d = new Date(input);
  return isNaN(d.getTime()) ? null : d;
}
function textFromNode(n: React.ReactNode): string {
  if (typeof n === "string" || typeof n === "number") return String(n);
  if (Array.isArray(n)) return n.map(textFromNode).join(" ");
  if (React.isValidElement(n)) return textFromNode((n.props as any)?.children);
  return "";
}
function toCSV<T>(
  rows: T[],
  visibleCols: number[],
  display: DisplayMap<T>
): string {
  const headers = visibleCols.map((i) =>
    textFromNode(display[i]?.title?.() ?? `Col ${i}`)
  );
  const lines = rows.map((r) =>
    visibleCols
      .map((i) => textFromNode(display[i]?.content?.(r)))
      .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
      .join(",")
  );
  return [headers.join(","), ...lines].join("\n");
}

function exportHTMLDoc<T>(
  rows: T[],
  visibleCols: number[],
  display: DisplayMap<T>,
  opts: {
    title: string;
    brand: Required<BrandConfig>;
    landscape: boolean;
    fontScale: number;
    includeFooter?: boolean;
  }
) {
  const ths = visibleCols
    .map((i) => `<th>${textFromNode(display[i]?.title?.() ?? `Col ${i}`)}</th>`)
    .join("");
  const trs = rows
    .map((r) => {
      const tds = visibleCols
        .map((i) => `<td>${textFromNode(display[i]?.content?.(r))}</td>`)
        .join("");
      return `<tr>${tds}</tr>`;
    })
    .join("");

  const now = new Date();
  const dateStr = now.toLocaleString();

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${
    opts.title
  }</title>
<style>
  :root{ --font: ${12 * opts.fontScale}px; }
  @page { size: ${opts.landscape ? "landscape" : "portrait"}; margin: 12mm; }
  @media print {
    header { position: running(header); }
    footer { position: running(footer); }
  }
  body{font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial;margin:0;color:#0f172a}
  .wrap{padding:16px}
  header{
    display:flex;align-items:center;gap:12px;margin-bottom:12px;border-bottom:1px solid #e5e7eb;padding-bottom:10px
  }
  header img{height:28px}
  header .brand{font-weight:700;font-size:16px;letter-spacing:.2px}
  header .meta{margin-left:auto;text-align:right;color:#64748b;font-size:12px}
  table{border-collapse:collapse;width:100%}
  th,td{border:1px solid #e5e7eb;padding:6px 8px;text-align:left;font-size:var(--font)}
  th{background:#f9fafb}
  footer{margin-top:10px;color:#64748b;font-size:11px;border-top:1px solid #e5e7eb;padding-top:8px;display:flex;justify-content:space-between}
</style></head><body>
<div class="wrap">
  <header>
    <img src="${opts.brand.logoUrl}" alt="${opts.brand.name} logo" />
    <div class="brand">${opts.brand.name}</div>
    <div class="meta">
      <div>${opts.title}</div>
      <div>${dateStr}</div>
    </div>
  </header>

  ${
    opts.brand.addressLine1 || opts.brand.addressLine2
      ? `
    <div style="color:#64748b;font-size:12px;margin:6px 0 10px 0">
      ${opts.brand.addressLine1 ?? ""}${
          opts.brand.addressLine1 && opts.brand.addressLine2 ? " · " : ""
        }${opts.brand.addressLine2 ?? ""}
    </div>`
      : ""
  }

  <table>
    <thead><tr>${ths}</tr></thead>
    <tbody>${trs}</tbody>
  </table>

  ${
    opts.includeFooter !== false
      ? `
  <footer>
    <div>${opts.brand.footerNote ?? ""}</div>
    <div>Generated by ${opts.brand.name}</div>
  </footer>`
      : ""
  }
</div>
</body></html>`;
  return html;
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
// DateRangeField
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
      <div className="text-xs text-neutral-500 dark:text-neutral-400">
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
            className="w-full h-9 justify-between rounded-lg border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 text-left font-normal dark:text-neutral-100"
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
          className={`rounded-2xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 shadow-[0_20px_60px_rgba(2,6,23,0.25)] overflow-hidden p-0 ${Z_CAL}`}
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
              transition={{
                type: "spring",
                stiffness: 520,
                damping: 38,
                mass: 0.7,
              }}
              style={{ transformOrigin: "50% -10px" }}
              className="p-2 will-change-transform"
            >
              <Calendar
                mode="range"
                numberOfMonths={2}
                className="rounded-xl bg-white dark:bg-neutral-800 p-2
                           [&_.rdp-months]:flex [&_.rdp-months]:gap-4
                           [&_.rdp-month]:bg-white dark:[&_.rdp-month]:bg-neutral-800
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
export function SmartCheckboxAutoTable<T extends Record<string, any>>(
  props: SmartAutoTableProps<T>
) {
  const {
    title = "Table",
    data,
    getRowId = (_row, i) => String(i),
    displayOptions,
    filterConfig = {},
    onRowClick,
    onSelectionChange,
    multiSelectOptions,
    exportBrand,
    onRefresh,
    isDrawerTypeFilter = false,
  } = props;

  const hasBulk = (multiSelectOptions?.length ?? 0) > 0;

  // Branding defaults for exports
  const brand: Required<BrandConfig> = {
    name: exportBrand?.name ?? "Fleet Stack",
    logoUrl: exportBrand?.logoUrl ?? "/images/logo-light.png",
    addressLine1: exportBrand?.addressLine1 ?? "",
    addressLine2: exportBrand?.addressLine2 ?? "",
    footerNote: exportBrand?.footerNote ?? "",
  };

  // ---- column order/visibility with localStorage
  const initialOrder = useMemo(
    () =>
      Object.keys(displayOptions)
        .map((k) => Number(k))
        .sort((a, b) => a - b),
    [displayOptions]
  );

  // Initialize with saved preferences or defaults
  const [columnOrder, setColumnOrder] = useState<number[]>(() => {
    const saved = loadTablePreferences(title);
    return saved?.columnOrder && saved.columnOrder.length > 0
      ? saved.columnOrder
      : initialOrder;
  });

  const [hiddenCols, setHiddenCols] = useState<number[]>(() => {
    const saved = loadTablePreferences(title);
    return saved?.hiddenCols || [];
  });

  const visibleCols = useMemo(
    () => columnOrder.filter((i) => !hiddenCols.includes(i)),
    [columnOrder, hiddenCols]
  );

  // drag reordering with localStorage sync
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

  // Enhanced setters that ensure localStorage sync
  const updateColumnOrder = (newOrder: number[]) => {
    setColumnOrder(newOrder);
  };

  const updateHiddenCols = (newHidden: number[]) => {
    setHiddenCols(newHidden);
  };

  const updateFilterValues = (newFilters: Record<string | number, any>) => {
    setFilterValues(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const updateSort = (key: number, direction: "asc" | "desc") => {
    setSortKey(key);
    setSortDir(direction);
  };

  const updatePageSize = (newSize: number) => {
    setPageSize(newSize);
    setPage(1); // Reset to first page when page size changes
  };

  // Reset all preferences to default
  const resetPreferences = () => {
    clearTablePreferences(title);
    setColumnOrder(initialOrder);
    setHiddenCols([]);
    updateFilterValues({});
    setSortKey(initialOrder[0] ?? 0);
    setSortDir("asc");
    setPage(1);
    // Note: PageSize remains global, so we don't reset it here
  };

  // Debug function (for development)
  const debugPreferences = () => {
    if (process.env.NODE_ENV === "development") {
      console.log("Current Preferences:", {
        title,
        columnOrder,
        hiddenCols,
        filterValues,
        sortKey,
        sortDir,
        pageSize,
        storageKey: getStorageKey(title),
        savedPreferences: loadTablePreferences(title),
      });
    }
  };

  // ---- search/sort/paging with localStorage
  const [search, setSearch] = useState("");

  const [sortKey, setSortKey] = useState<number>(() => {
    const saved = loadTablePreferences(title);
    return saved?.sortKey ?? initialOrder[0] ?? 0;
  });

  const [sortDir, setSortDir] = useState<"asc" | "desc">(() => {
    const saved = loadTablePreferences(title);
    return saved?.sortDir || "asc";
  });

  const [page, setPage] = useState(1);

  const [pageSize, setPageSize] = useState(() => {
    return loadGlobalPageSize();
  });

  // ---- filters with localStorage
  const [filterOpen, setFilterOpen] = useState(false);

  const [filterValues, setFilterValues] = useState<
    Record<string | number, any>
  >(() => {
    const saved = loadTablePreferences(title);
    return saved?.filters || {};
  });

  const filterEntries = useMemo(
    () => Object.entries(filterConfig) as [string | number, FilterConfig<T>][],
    [filterConfig]
  );

  // ---- refresh state
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Handle refresh
  const handleRefresh = async () => {
    if (!onRefresh || isRefreshing) return;

    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  // ---- selection (only if hasBulk)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const getId = (row: T) => {
    const idx = data.indexOf(row);
    return getRowId(row, idx >= 0 ? idx : 0);
  };
  const toggleRowSelection = (row: T, checked: boolean) => {
    if (!hasBulk) return;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const id = getId(row);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };
  const selectedRows = useMemo(
    () =>
      hasBulk ? data.filter((r, idx) => selectedIds.has(getRowId(r, idx))) : [],
    [data, selectedIds, getRowId, hasBulk]
  );
  const clearSelection = () => setSelectedIds(new Set());

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
        const rawValue = (filterValues as any)[key];
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
          if (rawValue === "all") {
            /* no-op */
          } else if (rawValue === "true" || rawValue === true) {
            if (Boolean(getCell(row, conf.field)) !== true) return false;
          } else if (rawValue === "false" || rawValue === false) {
            if (Boolean(getCell(row, conf.field)) !== false) return false;
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

  // keep parent updated with selection
  useEffect(() => {
    if (!onSelectionChange || !hasBulk) return;
    onSelectionChange(selectedRows);
  }, [selectedRows, onSelectionChange, hasBulk]);

  // Save preferences to localStorage when they change
  useEffect(() => {
    const preferences: TablePreferences = {
      columnOrder,
      hiddenCols,
      filters: filterValues,
      sortKey,
      sortDir,
    };
    saveTablePreferences(title, preferences);
  }, [title, columnOrder, hiddenCols, filterValues, sortKey, sortDir]);

  // Save global page size when it changes
  useEffect(() => {
    saveGlobalPageSize(pageSize);
  }, [pageSize]);

  // ---- Exports (with branding)
  const decideOrientation = (cols: number) => cols > 5;
  const fontScaleForCols = (cols: number) =>
    cols >= 9 ? 0.85 : cols >= 7 ? 0.92 : 1;

  const exportCSV = () => {
    const csv = toCSV(sorted, visibleCols, displayOptions);
    downloadBlob(
      new Blob([csv], { type: "text/csv" }),
      `export_${Date.now()}.csv`
    );
  };
  const exportJSON = () => {
    downloadBlob(
      new Blob([JSON.stringify(sorted, null, 2)], { type: "application/json" }),
      `export_${Date.now()}.json`
    );
  };
  const exportHTML = () => {
    const html = exportHTMLDoc(sorted, visibleCols, displayOptions, {
      title,
      brand,
      landscape: decideOrientation(visibleCols.length),
      fontScale: fontScaleForCols(visibleCols.length),
      includeFooter: true,
    });
    downloadBlob(
      new Blob([html], { type: "text/html;charset=utf-8" }),
      `export_${Date.now()}.html`
    );
  };
  const exportXLSX = () => {
    // lightweight HTML-as-Excel export (opens in Excel fine)
    const html = exportHTMLDoc(sorted, visibleCols, displayOptions, {
      title,
      brand,
      landscape: false,
      fontScale: 1,
      includeFooter: false,
    });
    downloadBlob(
      new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8" }),
      `export_${Date.now()}.xlsx`
    );
  };
  const exportPDF = () => {
    // Use print-to-PDF with responsive header/branding and @page size rules
    const html = exportHTMLDoc(sorted, visibleCols, displayOptions, {
      title,
      brand,
      landscape: decideOrientation(visibleCols.length),
      fontScale: fontScaleForCols(visibleCols.length),
      includeFooter: true,
    });
    const win = window.open("", "_blank", "width=1024,height=768");
    if (!win) return;
    win.document.open();
    win.document.write(html);
    win.document.close();
    setTimeout(() => {
      try {
        win.focus();
      } catch {}
      win.print();
    }, 150);
  };

  // Export popover hover control
  const [exportOpen, setExportOpen] = useState(false);
  const handleExportEnter = () => setExportOpen(true);
  const handleExportLeave = () => setExportOpen(false);

  const magnet = useMagnetic();

  // Resolve bulk button icon (outline/minimal by default)
  const renderBulkButton = (opt: MultiSelectOption<T>, idx: number) => {
    const node = opt.icon;
    const IconFromName = !node && getIconByName(opt.iconName);
    const variant = opt.variant ?? "outline";

    const destructiveStyles =
      /delete|remove/i.test(opt.name) || opt.variant === "destructive"
        ? "border-red-500 text-red-600 hover:bg-red-50 dark:border-red-400 dark:text-red-300 dark:hover:bg-red-950/30"
        : "";

    return (
      <Button
        key={idx}
        variant={variant}
        onClick={() => opt.callback(selectedRows, selectedIds)}
        title={opt.tooltip}
        className={`h-9 inline-flex items-center gap-2 ${destructiveStyles}`}
      >
        {node ? node : IconFromName ? <IconFromName fontSize="small" /> : null}
        {opt.name}
      </Button>
    );
  };

  // ------------------------------------
  // UI
  // ------------------------------------
  return (
    <>
      <MotionConfig
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        reducedMotion="user"
      >
        <div ref={containerRef} className="mx-auto max-w-[1400px] p-4">
          {/* Bulk actions bar (only if hasBulk and selection) */}
          <AnimatePresence initial={false}>
            {hasBulk && selectedIds.size > 0 && (
              <motion.div
                key="bulk-bar"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{
                  type: "spring",
                  stiffness: 420,
                  damping: 32,
                  mass: 0.6,
                }}
                className="mb-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white/90 dark:bg-neutral-800/90 backdrop-blur p-3 shadow-[0_6px_24px_rgba(2,6,23,0.06)]"
              >
                <div className="flex flex-col px-3 sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="text-sm text-neutral-700 dark:text-neutral-300">
                    <span className="font-semibold">{selectedIds.size}</span>{" "}
                    selected
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {multiSelectOptions!.map(renderBulkButton)}
                    <Button
                      variant="ghost"
                      className="h-9"
                      onClick={clearSelection}
                    >
                      Clear selection
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toolbar */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 32,
              mass: 0.6,
            }}
            className="mb-4 bg-white/90 dark:bg-neutral-800/90 backdrop-blur border border-neutral-200/80 dark:border-neutral-700 rounded-2xl p-4 shadow-[0_6px_24px_rgba(2,6,23,0.06)]"
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              {/* Left: search + filter */}
              <div className="flex flex-1 items-stretch gap-3">
                <div className="relative flex-1 lg:max-w-sm">
                  <SearchIcon
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500"
                    fontSize="small"
                  />
                  <input
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Search name, email, role, department…"
                    className="h-10 w-full rounded-xl border border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 pl-10 pr-4 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-400 outline-none ring-0 transition focus:border-neutral-400 dark:focus:border-neutral-400 focus:bg-white dark:focus:bg-neutral-600 focus:shadow-sm"
                  />
                </div>
                {isDrawerTypeFilter && (
                  <MotionButton
                    onClick={() => setFilterOpen(true)}
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ y: -1 }}
                    onMouseMove={magnet.onMouseMove}
                    onMouseLeave={magnet.onMouseLeave}
                    style={{ x: magnet.ry, y: magnet.rx }}
                    transition={springPress}
                    variant="outline"
                    className="h-10 gap-2 rounded-xl border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                  >
                    <FilterIcon fontSize="small" /> Filter
                  </MotionButton>
                )}

                {/* Filter popover */}
                {!isDrawerTypeFilter && (
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
                        className="h-10 gap-2 rounded-xl border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                      >
                        <FilterIcon fontSize="small" /> Filter
                      </MotionButton>
                    </PopoverTrigger>

                    <PopoverContent
                      align="start"
                      side="bottom"
                      sideOffset={10}
                      className={`w-[360px] sm:w-[460px] rounded-2xl border border-neutral-200/80 dark:border-neutral-600/80 bg-white/95 dark:bg-neutral-800/95 backdrop-blur p-0 shadow-[0_20px_70px_rgba(2,6,23,0.25)] ${Z_FILTER} overflow-visible`}
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
                          exit={{
                            opacity: 0,
                            y: -8,
                            rotateX: -5,
                            scale: 0.985,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 520,
                            damping: 38,
                            mass: 0.7,
                          }}
                          style={{ transformOrigin: "50% -10px" }}
                          className="will-change-transform"
                        >
                          <div className="px-3 pt-3">
                            <div className="px-1 pb-2 text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400 font-medium">
                              Dynamic Filters
                            </div>
                            <Separator className="mb-3" />
                          </div>

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
                                  show: {
                                    transition: { staggerChildren: 0.04 },
                                  },
                                }}
                                className="space-y-3"
                              >
                                {Object.entries(filterConfig).map(
                                  ([key, conf]) => {
                                    const value = (filterValues as any)[key];
                                    const setVal = (v: any) => {
                                      const newFilters = {
                                        ...filterValues,
                                        [key]: v,
                                      };
                                      updateFilterValues(newFilters);
                                    };

                                    let selectOptions:
                                      | Array<{ label: string; value: string }>
                                      | undefined;
                                    if (conf.kind === "select") {
                                      if (conf.options) {
                                        selectOptions = conf.options.map(
                                          (o) => ({
                                            label: o.label,
                                            value: String(
                                              o.value ?? o.label ?? ""
                                            ),
                                          })
                                        );
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
                                        transition={{
                                          type: "spring",
                                          stiffness: 420,
                                          damping: 32,
                                          mass: 0.6,
                                        }}
                                        className="rounded-xl border border-neutral-200 dark:border-neutral-600 p-3 bg-white/70 dark:bg-neutral-800/70"
                                      >
                                        <Label className="mb-2 block text-xs text-neutral-700 dark:text-neutral-300">
                                          {conf.label ?? key}
                                        </Label>

                                        {"text" === conf.kind && (
                                          <Input
                                            value={value ?? ""}
                                            onChange={(e) =>
                                              setVal(e.target.value)
                                            }
                                            placeholder="Type to filter…"
                                            className="h-9"
                                          />
                                        )}

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
                                                className="h-24 w-full rounded-lg border border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 px-2 text-sm outline-none"
                                              >
                                                {(selectOptions || []).map(
                                                  (opt) => (
                                                    <option
                                                      key={opt.value}
                                                      value={opt.value}
                                                    >
                                                      {opt.label}
                                                    </option>
                                                  )
                                                )}
                                              </select>
                                            ) : (
                                              <Select
                                                value={value ?? ANY_SENTINEL}
                                                onValueChange={(v) =>
                                                  setVal(
                                                    v === ANY_SENTINEL
                                                      ? undefined
                                                      : v
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
                                                  <SelectItem
                                                    value={ANY_SENTINEL}
                                                  >
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

                                        {"boolean" === conf.kind && (
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
                                        )}

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
                                            <span className="text-neutral-400">
                                              —
                                            </span>
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

                                        {"dateRange" === conf.kind && (
                                          <DateRangeField
                                            value={value}
                                            onChange={setVal}
                                          />
                                        )}

                                        {"custom" === conf.kind && (
                                          <div>
                                            {conf.editor(value, setVal)}
                                          </div>
                                        )}
                                      </motion.div>
                                    );
                                  }
                                )}
                              </motion.div>
                            </div>
                          </div>

                          <div className="sticky bottom-0 left-0 right-0 border-t border-neutral-200 dark:border-neutral-700 bg-white/90 dark:bg-neutral-800/90 backdrop-blur px-3 py-3 rounded-b-2xl">
                            <div className="flex items-center justify-between">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-neutral-500"
                                onClick={() => {
                                  updateFilterValues({});
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
                )}
              </div>

              {/* Right: refresh + records per page + EXPORT + columns + fullscreen */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Refresh Button */}
                {onRefresh && (
                  <MotionButton
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ y: -1 }}
                    transition={springPress}
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    variant="outline"
                    className="h-10 gap-2 rounded-xl border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-600 disabled:opacity-60"
                  >
                    <RefreshIcon
                      fontSize="small"
                      className={isRefreshing ? "animate-spin" : ""}
                    />
                    {isRefreshing ? "Refreshing..." : "Refresh"}
                  </MotionButton>
                )}

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-neutral-600 dark:text-neutral-400 font-medium whitespace-nowrap">
                    Records:
                  </span>
                  <Select
                    value={String(pageSize)}
                    onValueChange={(value) => {
                      updatePageSize(Number(value));
                    }}
                  >
                    <SelectTrigger className="h-10 w-20 rounded-xl border border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 px-3 text-sm font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {[10, 20, 30, 50, 100].map((n) => (
                        <SelectItem
                          key={n}
                          value={String(n)}
                          className="cursor-pointer hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-black focus:bg-neutral-900 focus:text-white dark:focus:bg-white dark:focus:text-black"
                        >
                          {n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* EXPORT (hover to open) */}
                <Popover open={exportOpen} onOpenChange={setExportOpen}>
                  <PopoverTrigger asChild>
                    <MotionButton
                      whileTap={{ scale: 0.98 }}
                      whileHover={{ y: -1 }}
                      transition={springPress}
                      variant="outline"
                      className="h-10 gap-2 rounded-xl"
                      onMouseEnter={handleExportEnter}
                      onMouseLeave={handleExportLeave}
                    >
                      <DownloadIcon fontSize="small" /> Export
                    </MotionButton>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    side="bottom"
                    sideOffset={8}
                    className="w-48 rounded-xl p-1"
                    onMouseEnter={handleExportEnter}
                    onMouseLeave={handleExportLeave}
                  >
                    <ul className="text-sm">
                      <li>
                        <button
                          className="w-full text-left px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 inline-flex items-center gap-2"
                          onClick={exportCSV}
                        >
                          <CsvIcon fontSize="small" /> CSV
                        </button>
                      </li>
                      <li>
                        <button
                          className="w-full text-left px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 inline-flex items-center gap-2"
                          onClick={exportXLSX}
                        >
                          <XlsxIcon fontSize="small" /> XLSX
                        </button>
                      </li>
                      <li>
                        <button
                          className="w-full text-left px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 inline-flex items-center gap-2"
                          onClick={exportJSON}
                        >
                          <JsonIcon fontSize="small" /> JSON
                        </button>
                      </li>
                      <li>
                        <button
                          className="w-full text-left px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 inline-flex items-center gap-2"
                          onClick={exportPDF}
                        >
                          <PdfIcon fontSize="small" /> PDF
                        </button>
                      </li>
                      <li>
                        <button
                          className="w-full text-left px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 inline-flex items-center gap-2"
                          onClick={exportHTML}
                        >
                          <HtmlIcon fontSize="small" /> HTML
                        </button>
                      </li>
                    </ul>
                  </PopoverContent>
                </Popover>

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
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400 font-medium">
                        <ColumnsIcon fontSize="small" /> Drag to reorder ·
                        Toggle to hide
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetPreferences}
                        className="h-7 px-2 text-xs text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                        title="Reset all table preferences"
                      >
                        Reset
                      </Button>
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
                          transition={{
                            type: "spring",
                            stiffness: 600,
                            damping: 36,
                          }}
                          className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                        >
                          <div className="flex items-center gap-2">
                            <GripIcon
                              fontSize="small"
                              className="text-neutral-400"
                            />
                            <div className="text-sm">
                              {displayOptions[idx]?.title?.()}
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            className="h-4 w-4"
                            checked={!hiddenCols.includes(idx)}
                            onChange={() => {
                              const newHidden = hiddenCols.includes(idx)
                                ? hiddenCols.filter((c) => c !== idx)
                                : [...hiddenCols, idx];
                              updateHiddenCols(newHidden);
                            }}
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
          <div className="w-full overflow-x-auto overflow-y-hidden rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div id="smart-table-print">
              <table className="w-full min-w-[800px] text-sm">
                <thead>
                  <tr className="text-left">
                    {/* Selection header (only if hasBulk) */}
                    {hasBulk && (
                      <th className="w-10 px-3 py-4 bg-neutral-100 dark:bg-neutral-700 border-b border-neutral-200 dark:border-neutral-600">
                        {(() => {
                          const allOnPageSelected =
                            pageRows.length > 0 &&
                            pageRows.every((r) => selectedIds.has(getId(r)));
                          const someOnPageSelected = pageRows.some((r) =>
                            selectedIds.has(getId(r))
                          );
                          const headerChecked = allOnPageSelected
                            ? true
                            : someOnPageSelected
                            ? "indeterminate"
                            : false;

                          return (
                            <input
                              type="checkbox"
                              checked={headerChecked === true}
                              ref={(el) => {
                                if (el) {
                                  el.indeterminate =
                                    headerChecked === "indeterminate";
                                }
                              }}
                              className="h-5 w-5 rounded border border-neutral-300 text-neutral-900 focus:ring-neutral-500 dark:border-neutral-500 dark:bg-neutral-700"
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                setSelectedIds((prev) => {
                                  const next = new Set(prev);
                                  if (isChecked) {
                                    pageRows.forEach((r) => next.add(getId(r)));
                                  } else {
                                    pageRows.forEach((r) =>
                                      next.delete(getId(r))
                                    );
                                  }
                                  return next;
                                });
                              }}
                              aria-label="Select page rows"
                            />
                          );
                        })()}
                      </th>
                    )}

                    {visibleCols.map((i) => {
                      const active = sortKey === i;
                      return (
                        <th
                          key={i}
                          className={`whitespace-nowrap select-none px-3 py-4 bg-neutral-100 dark:bg-neutral-700 border-b-2 border-neutral-200 dark:border-neutral-600 ${
                            active ? "bg-neutral-200 dark:bg-neutral-600" : ""
                          }`}
                        >
                          <button
                            onClick={() => {
                              if (sortKey === i) {
                                const newDir =
                                  sortDir === "asc" ? "desc" : "asc";
                                updateSort(i, newDir);
                              } else {
                                updateSort(i, "asc");
                              }
                            }}
                            className="inline-flex items-center gap-2 font-bold text-sm text-neutral-900 dark:text-neutral-100 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors uppercase tracking-wide"
                            title="Sort"
                          >
                            {displayOptions[i]?.title?.()}
                            <span className="text-neutral-600 dark:text-neutral-400 ml-1">
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

                {/* Page-level animation only (prevents bottom overlap) */}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.tbody
                    key={`page-${page}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {pageRows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={visibleCols.length + (hasBulk ? 1 : 0)}
                          className="px-6 py-10 text-center text-neutral-500 dark:text-neutral-400"
                        >
                          No results match your filters.
                        </td>
                      </tr>
                    ) : (
                      pageRows.map((row) => {
                        const rowId = getId(row);
                        const isSelected = hasBulk && selectedIds.has(rowId);

                        return (
                          <tr
                            key={rowId}
                            className={`group relative border-b border-neutral-100 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors duration-150
                            ${
                              isSelected
                                ? "bg-neutral-100 dark:bg-neutral-800"
                                : ""
                            }
                          `}
                            onClick={() => onRowClick?.(row)}
                          >
                            {/* selection cell */}
                            {hasBulk && (
                              <td
                                className="px-3 py-3 cursor-default"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) =>
                                    toggleRowSelection(row, e.target.checked)
                                  }
                                  aria-label="Select row"
                                  className="h-5 w-5 rounded border border-neutral-300 text-neutral-900 focus:ring-neutral-500 dark:border-neutral-500 dark:bg-neutral-700"
                                />
                              </td>
                            )}

                            {visibleCols.map((i) => {
                              const cell = displayOptions[i];
                              const contentNode = cell?.content?.(row);
                              const tooltipNode = cell?.tooltip
                                ? cell.tooltip(row)
                                : null;

                              return (
                                <td key={i} className="px-3 py-3">
                                  {tooltipNode ? (
                                    <TooltipProvider delayDuration={150}>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <div
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            {contentNode}
                                          </div>
                                        </TooltipTrigger>
                                        <TooltipContent
                                          side="top"
                                          className={`max-w-xs rounded-xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-xl ${Z_TIP}`}
                                        >
                                          {tooltipNode}
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  ) : (
                                    <div onClick={(e) => e.stopPropagation()}>
                                      {contentNode}
                                    </div>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })
                    )}
                  </motion.tbody>
                </AnimatePresence>
              </table>
            </div>

            {/* Pagination */}
            <div className="border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 sm:px-6 py-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="text-sm text-neutral-600 dark:text-neutral-400 text-center lg:text-left lg:flex-1">
                  Showing{" "}
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">
                    {pageRows.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">
                    {sorted.length}
                  </span>{" "}
                  results
                  {hasBulk && selectedIds.size > 0 && (
                    <span className="ml-2 text-emerald-700 dark:text-emerald-400 font-medium">
                      · {selectedIds.size} selected
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-center gap-1 flex-wrap">
                  <button
                    className="px-3 py-2 text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-all duration-200 disabled:opacity-50"
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                  >
                    First
                  </button>
                  <button
                    className="px-3 py-2 text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors disabled:opacity-50"
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
                                ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-sm"
                                : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
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
                    className="px-3 py-2 text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors disabled:opacity-50"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </button>
                  <button
                    className="px-3 py-2 text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors disabled:opacity-50"
                    onClick={() => setPage(totalPages)}
                    disabled={page === totalPages}
                  >
                    Last
                  </button>
                </div>

                <div className="text-sm text-neutral-600 dark:text-neutral-400 text-center lg:text-right lg:flex-1">
                  Page{" "}
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">
                    {page}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-neutral-900 dark:text-neutral-100">
                    {totalPages}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MotionConfig>
      {isDrawerTypeFilter && (
        <CommonDrawer isOpen={filterOpen} onClose={() => setFilterOpen(false)}>
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
              transition={{
                type: "spring",
                stiffness: 520,
                damping: 38,
                mass: 0.7,
              }}
              style={{ transformOrigin: "50% -10px" }}
              className="will-change-transform"
            >
              <div className="px-3 pt-3">
                <div className="px-1 pb-2 text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400 font-medium">
                  Dynamic Filters
                </div>
                <Separator className="mb-3" />
              </div>

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
                      const value = (filterValues as any)[key];
                      const setVal = (v: any) => {
                        const newFilters = {
                          ...filterValues,
                          [key]: v,
                        };
                        updateFilterValues(newFilters);
                      };

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
                          selectOptions = Array.from(derived).map((u) => ({
                            label: u,
                            value: u,
                          }));
                        } else selectOptions = [];
                      }

                      return (
                        <motion.div
                          key={String(key)}
                          variants={{
                            hidden: { opacity: 0, y: 6 },
                            show: { opacity: 1, y: 0 },
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 420,
                            damping: 32,
                            mass: 0.6,
                          }}
                          className="rounded-xl border border-neutral-200 dark:border-neutral-600 p-3 bg-white/70 dark:bg-neutral-800/70"
                        >
                          <Label className="mb-2 block text-xs text-neutral-700 dark:text-neutral-300">
                            {conf.label ?? key}
                          </Label>

                          {"text" === conf.kind && (
                            <Input
                              value={value ?? ""}
                              onChange={(e) => setVal(e.target.value)}
                              placeholder="Type to filter…"
                              className="h-9"
                            />
                          )}

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
                                  className="h-24 w-full rounded-lg border border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 px-2 text-sm outline-none"
                                >
                                  {(selectOptions || []).map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <Select
                                  value={value ?? ANY_SENTINEL}
                                  onValueChange={(v) =>
                                    setVal(v === ANY_SENTINEL ? undefined : v)
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
                                    {(selectOptions || []).map((opt) => (
                                      <SelectItem
                                        key={opt.value}
                                        value={opt.value}
                                      >
                                        {opt.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            </>
                          )}

                          {"boolean" === conf.kind && (
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
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="true">True</SelectItem>
                                <SelectItem value="false">False</SelectItem>
                              </SelectContent>
                            </Select>
                          )}

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
                              <span className="text-neutral-400">—</span>
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

                          {"dateRange" === conf.kind && (
                            <DateRangeField value={value} onChange={setVal} />
                          )}

                          {"custom" === conf.kind && (
                            <div>{conf.editor(value, setVal)}</div>
                          )}
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </div>
              </div>

              <div className="sticky bottom-0 left-0 right-0 border-t border-neutral-200 dark:border-neutral-700 bg-white/90 dark:bg-neutral-800/90 backdrop-blur px-3 py-3 rounded-b-2xl">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-neutral-500"
                    onClick={() => {
                      updateFilterValues({});
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
        </CommonDrawer>
      )}
    </>
  );
}

/** Back-compat alias if you previously imported SmartAutoTable */
export { SmartCheckboxAutoTable as SmartAutoTable };
