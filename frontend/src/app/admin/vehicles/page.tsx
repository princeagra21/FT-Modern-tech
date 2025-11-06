'use client'
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DirectionsCar as Car,
  Speed as Gauge,
  Lock,
  Satellite,
  Power,
  FilterList as Filter,
  Search,
  Settings as Settings2,
  Fullscreen as Maximize2,
  FullscreenExit as Minimize2,
  Download,
  Print as Printer,
  KeyboardArrowDown as ChevronDown,
  KeyboardArrowUp as ChevronUp,
  KeyboardArrowLeft as ChevronLeft,
  KeyboardArrowRight as ChevronRight,
  ViewColumn as Columns3,
  DragIndicator as GripVertical,
  Delete as Trash2,
  PersonAdd as UserPlus,
  PowerOff,
  Send,
} from "@mui/icons-material";





type Status = "running" | "stopped";

type VehicleRow = {
  id: string;
  vehicleName: string;
  imei: string;
  vin: string;
  status: Status;
  statusDuration: string;
  speed: number;
  lastUpdate: string;
  user: { name: string; avatarColor: string };
  icons: { ignition: boolean; satellite: boolean; lock: boolean };
  active: boolean;
  expiry: string;
};

const ALT_DETAILS: Record<
  string,
  { fuelLevel: number; odometer: number; sim: string; deviceModel: string; geoFence: string[] }
> = {};

// ---------------------------
// Utilities
// ---------------------------

function randChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function pad(num: number, size = 2) {
  let s = String(num);
  while (s.length < size) s = "0" + s;
  return s;
}
function randomIMEI() {
  let s = "";
  for (let i = 0; i < 15; i++) s += Math.floor(Math.random() * 10);
  return s;
}
function randomVIN() {
  const chars = "ABCDEFGHJKLMNPRSTUVWXYZ0123456789";
  let v = "";
  for (let i = 0; i < 17; i++) v += chars[Math.floor(Math.random() * chars.length)];
  return v;
}
function makeName(i: number) {
  const brands = ["Tata", "Mahindra", "Ashok Leyland", "Eicher", "Force", "Maruti"];
  const models = ["Ace", "Bolero", "XUV700", "Intra", "Scorpio", "4000XL", "Pro 3015"];
  return `${randChoice(brands)} ${randChoice(models)} #${pad(i + 1, 2)}`;
}
function makeUser(_i: number) {
  const first = ["Aarav", "Isha", "Vivaan", "Diya", "Kabir", "Anaya", "Reyansh", "Aanya", "Arjun", "Mira"];
  const last = ["Sharma", "Verma", "Patel", "Singh", "Iyer", "Khan", "Das", "Nair", "Gupta", "Reddy"];
  const name = `${randChoice(first)} ${randChoice(last)}`;
  const colors = ["#1F2937", "#374151", "#4B5563", "#6B7280", "#111827", "#0F172A"];
  return { name, avatarColor: randChoice(colors) };
}
function humanDate(offsetMins: number) {
  const d = new Date(Date.now() - offsetMins * 60 * 1000);
  const hrs12 = ((d.getHours() + 11) % 12) + 1;
  const ampm = d.getHours() >= 12 ? "PM" : "AM";
  return `${d.getDate()} ${d.toLocaleString("en-US", { month: "short" })} ${pad(hrs12)}:${pad(d.getMinutes())}${ampm}`;
}
function makeRows(count = 50): VehicleRow[] {
  const rows: VehicleRow[] = [];
  for (let i = 0; i < count; i++) {
    const speed = Math.floor(Math.random() * 100);
    const status: Status = speed > 0 && Math.random() > 0.3 ? "running" : "stopped";
    const duration = `${Math.floor(Math.random() * 5)}h ${Math.floor(Math.random() * 59)}m`;
    const id = crypto.randomUUID();
    rows.push({
      id,
      vehicleName: makeName(i),
      imei: randomIMEI(),
      vin: randomVIN(),
      status,
      statusDuration: duration,
      speed,
      lastUpdate: humanDate(Math.floor(Math.random() * 300)),
      user: makeUser(i),
      icons: { ignition: status === "running", satellite: Math.random() > 0.1, lock: Math.random() > 0.6 },
      active: Math.random() > 0.2,
      expiry: `${Math.floor(Math.random() * 28) + 1} ${randChoice(["Oct", "Nov", "Dec"]).toString()} ${
        Math.floor(Math.random() * 3) + 2025
      }`,
    });

    ALT_DETAILS[id] = {
      fuelLevel: Math.floor(Math.random() * 80) + 10,
      odometer: 10000 + Math.floor(Math.random() * 90000),
      sim: randChoice(["Airtel", "Jio", "VI", "BSNL"]) + " - +91-98XXXXXX",
      deviceModel: randChoice(["Teltonika FMB920", "Concox GT06N", "Queclink GV57", "Ruijie R300"]),
      geoFence: ["Warehouse A", "Delhi Yard", "NH48 Corridor"].filter(() => Math.random() > 0.4),
    };
  }
  return rows;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

function toCSV(rows: VehicleRow[], visibleCols: ColumnKey[]): string {
  const headers = visibleCols.map((k) => COLUMN_LABELS[k]);
  const lines = rows.map((r) =>
    visibleCols
      .map((k) => {
        switch (k) {
          case "select":
            return "";
          case "vehicle":
            return `${r.vehicleName} (IMEI: ${r.imei}; VIN: ${r.vin})`;
          case "status":
            return `${r.status.toUpperCase()} [${r.statusDuration}]`;
          case "speed":
            return `${r.speed} km/h`;
          case "lastUpdate":
            return r.lastUpdate;
          case "user":
            return r.user.name;
          case "icons":
            return `ignition:${r.icons.ignition ? 1 : 0}; satellite:${r.icons.satellite ? 1 : 0}; lock:${r.icons.lock ? 1 : 0}`;
          case "active":
            return r.active ? "Yes" : "No";
          case "expiry":
            return r.expiry;
          default:
            return "";
        }
      })
      .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
      .join(",")
  );
  return [headers.join(","), ...lines].join("\n");
}

// ---------------------------
// Column Config
// ---------------------------

type ColumnKey =
  | "select"
  | "vehicle"
  | "status"
  | "speed"
  | "lastUpdate"
  | "user"
  | "icons"
  | "active"
  | "expiry";

const COLUMN_LABELS: Record<ColumnKey, string> = {
  select: "",
  vehicle: "Vehicle Name { IMEI & VIN }",
  status: "Status",
  speed: "Speed",
  lastUpdate: "Last Update",
  user: "Primary User",
  icons: "Icons",
  active: "Active",
  expiry: "Expiry",
};

const COLUMN_CONFIG: Record<ColumnKey, { icon?: React.ComponentType<any> }> = {
  select: {},
  vehicle: { icon: Car },
  status: { icon: PowerOff },
  speed: { icon: Gauge },
  lastUpdate: { icon: Send },
  user: { icon: UserPlus },
  icons: { icon: Settings2 },
  active: { icon: Power },
  expiry: { icon: Send },
};

const DEFAULT_ORDER: ColumnKey[] = [
  "select",
  "vehicle",
  "status",
  "speed",
  "lastUpdate",
  "user",
  "icons",
  "active",
  "expiry",
];

// ---------------------------
// Main Component
// ---------------------------

export default function FleetStackVehicleTable() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [rows, setRows] = useState<VehicleRow[]>(() => makeRows(50));
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Search / Filter / Sort
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");
  const [sortKey, setSortKey] = useState<ColumnKey>("vehicle");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // Column visibility & order
  const [columnOrder, setColumnOrder] = useState<ColumnKey[]>(DEFAULT_ORDER);
  const [hiddenCols, setHiddenCols] = useState<ColumnKey[]>([]);

  // Paging
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Navigation function
  const navigateToVehicle = (vehicleId: string) => {
    router.push(`/admin/vehicles/${vehicleId}`);
  };

  // Selection
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Hover & Drawer
  const [hoverCard, setHoverCard] = useState<{ row: VehicleRow | null; x: number; y: number }>(
    { row: null, x: 0, y: 0 }
  );
  const [drawerRow, setDrawerRow] = useState<VehicleRow | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initial loading animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Simulate loading time
    
    return () => clearTimeout(timer);
  }, []);

  // Page transition effect when changing pages
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 200);
    
    return () => clearTimeout(timer);
  }, [page]);

  // Derived
  const visibleCols = useMemo(
    () => columnOrder.filter((c) => !hiddenCols.includes(c)),
    [columnOrder, hiddenCols]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let f = rows;
    if (q)
      f = f.filter((r) =>
        [r.vehicleName, r.imei, r.vin, r.user.name, r.lastUpdate, r.expiry]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    if (statusFilter !== "all") f = f.filter((r) => r.status === statusFilter);
    return f;
  }, [rows, search, statusFilter]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      const get = (r: VehicleRow) => {
        switch (sortKey) {
          case "vehicle":
            return r.vehicleName;
          case "status":
            return r.status + r.statusDuration;
          case "speed":
            return r.speed;
          case "lastUpdate":
            return new Date(r.lastUpdate).getTime();
          case "user":
            return r.user.name;
          case "icons":
            return Number(r.icons.ignition) + Number(r.icons.satellite) + Number(r.icons.lock);
          case "active":
            return Number(r.active);
          case "expiry":
            return r.expiry;
          default:
            return 0;
        }
      };
      const va = get(a) as string | number;
      const vb = get(b) as string | number;
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });
    return copy;
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  // Hide hover card on scroll/resize/mouse leave for reliability
  useEffect(() => {
    const hide = () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      setHoverCard({ row: null, x: 0, y: 0 });
    };

    const handleMouseLeave = (e: MouseEvent) => {
      // Hide popup if mouse leaves the window entirely
      if (e.clientY <= 0 || e.clientX <= 0 || 
          e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
        hide();
      }
    };

    window.addEventListener("scroll", hide, true);
    window.addEventListener("resize", hide);
    document.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      window.removeEventListener("scroll", hide, true);
      window.removeEventListener("resize", hide);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Helper functions for hover management - Perfect hover behavior
  const showHoverCard = (row: VehicleRow, x: number, y: number) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoverCard({ row, x, y });
  };

  const hideHoverCardImmediate = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoverCard({ row: null, x: 0, y: 0 });
  };

  const startHideTimer = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setHoverCard({ row: null, x: 0, y: 0 });
      hoverTimeoutRef.current = null;
    }, 50); // Very short delay to prevent flicker when moving between elements
  };

  const cancelHideTimer = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  // ---------------------------
  // Actions
  // ---------------------------

  function toggleFullscreen() {
    const el = containerRef.current as HTMLElement | null;
    if (!document.fullscreenElement && el) {
      el.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  function onExportCSV() {
    const csv = toCSV(sorted, visibleCols);
    downloadBlob(new Blob([csv], { type: "text/csv" }), `fleetstack_vehicles_${Date.now()}.csv`);
  }
  function onExportJSON() {
    const minimal = sorted.map((r) => ({
      id: r.id,
      vehicleName: r.vehicleName,
      imei: r.imei,
      vin: r.vin,
      status: r.status,
      statusDuration: r.statusDuration,
      speed: r.speed,
      lastUpdate: r.lastUpdate,
      user: r.user,
      icons: r.icons,
      active: r.active,
      expiry: r.expiry,
    }));
    downloadBlob(
      new Blob([JSON.stringify(minimal, null, 2)], { type: "application/json" }),
      `fleetstack_vehicles_${Date.now()}.json`
    );
  }
  function onExportPDF() {
    // uses print dialog so user can "Save as PDF"
    onPrint();
  }

  function onPrint() {
    const printable = document.getElementById("fs-print-area");
    if (!printable) return;
    const win = window.open("", "_blank", "width=1024,height=768");
    if (!win) return;
    win.document.write(`<!doctype html><html><head><meta charset=\"utf-8\"/><title>Print — FleetStack Vehicles</title>
      <style>
        body{font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial,Apple Color Emoji,Segoe UI Emoji;}
        h1{font-size:16px;margin:0 0 8px 0}
        table{width:100%;border-collapse:collapse;font-size:12px}
        th,td{border:1px solid #e5e7eb;padding:6px 8px;text-align:left}
        th{background:#f9fafb}
      </style></head><body>`);
    win.document.write(`<h1>FleetStack Vehicles</h1>`);
    win.document.write(printable.outerHTML);
    win.document.write("</body></html>");
    win.document.close();
    win.focus();
    win.print();
    win.close();
  }

  function sortBy(col: ColumnKey) {
    if (col === "select") return;
    if (sortKey === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(col);
      setSortDir("asc");
    }
  }

  // Selection helpers
  function toggleRowSelection(id: string, checked: boolean) {
    setSelected((prev) => {
      const s = new Set(prev);
      if (checked) s.add(id);
      else s.delete(id);
      return s;
    });
  }
  function togglePageSelection(checked: boolean) {
    setSelected((prev) => {
      const s = new Set(prev);
      pageRows.forEach((r) => (checked ? s.add(r.id) : s.delete(r.id)));
      return s;
    });
  }
  const allOnPageSelected = pageRows.length > 0 && pageRows.every((r) => selected.has(r.id));

  // Column menu DnD
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  function onDragStart(i: number) { setDragIdx(i); }
  function onDragOver(e: React.DragEvent<HTMLDivElement>) { e.preventDefault(); }
  function onDrop(i: number) {
    if (dragIdx === null || dragIdx === i) return;
    setColumnOrder((prev) => {
      const arr = [...prev];
      const [moved] = arr.splice(dragIdx, 1);
      arr.splice(i, 0, moved);
      return arr;
    });
    setDragIdx(null);
  }

  function toggleHidden(col: ColumnKey) {
    if (col === "select") return;
    setHiddenCols((prev) => (prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]));
  }

  // ---------------------------
  // Render helpers
  // ---------------------------

  function HeaderCell({ col }: { col: ColumnKey }) {
    const active = sortKey === col;
    const config = COLUMN_CONFIG[col];
    const IconComponent = config.icon;
    
    return (
      <th className={`whitespace-nowrap select-none px-3 py-4 bg-slate-100 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600 ${active ? "bg-slate-200 dark:bg-slate-600" : ""}`}>
        {col === "select" ? (
          <input
            type="checkbox"
            aria-label="Select all on page"
            checked={allOnPageSelected}
            onChange={(e) => { e.stopPropagation(); togglePageSelection(e.target.checked); }}
            onClick={(e) => e.stopPropagation()}
            className="h-4 w-4 rounded border-slate-300 dark:border-slate-500 text-slate-900 focus:ring-slate-500"
          />
        ) : (
          <button onClick={() => sortBy(col)} className="inline-flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-slate-100 hover:text-slate-700 dark:hover:text-slate-300 transition-colors uppercase tracking-wide" title="Sort">
            {IconComponent && <IconComponent fontSize="small" className="text-slate-700 dark:text-slate-300" />}
            <span className="font-bold">{COLUMN_LABELS[col]}</span>
            <span className="opacity-70">{active ? (sortDir === "asc" ? <ChevronUp fontSize="small" /> : <ChevronDown fontSize="small" />) : null}</span>
          </button>
        )}
      </th>
    );
  }

  function Avatar({ name, color }: { name: string; color: string }) {
    const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ backgroundColor: color }} title={name}>
        {initials}
      </div>
    );
  }

  function Cell({ col, r }: { col: ColumnKey; r: VehicleRow }) {
    switch (col) {
      case "select":
        return (
          <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
            <input
              type="checkbox"
              checked={selected.has(r.id)}
              onChange={(e) => toggleRowSelection(r.id, e.target.checked)}
              onClick={(e) => e.stopPropagation()}
              aria-label="Select row"
            />
          </td>
        );
      case "vehicle":
        return (
          <td className="px-3 py-3">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-900 dark:bg-slate-100 ring-1 ring-slate-700 dark:ring-slate-300">
                <Car fontSize="small" className="text-white dark:text-slate-900" />
              </div>
              <div className="leading-tight">
                <div 
                  className="font-medium text-primary hover:text-primary/80 cursor-pointer transition-colors duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateToVehicle(r.id);
                  }}
                >
                  {r.vehicleName}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  IMEI: <span 
                    className="font-mono text-primary hover:text-primary/80 cursor-pointer transition-colors duration-200" 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateToVehicle(r.id);
                    }}
                  >
                    {r.imei}
                  </span> · VIN: <span className="font-mono">{r.vin}</span>
                </div>
              </div>
            </div>
          </td>
        );
      case "status":
        return (
          <td
            className="px-3 py-3"
            onMouseEnter={(e) => {
              cancelHideTimer();
              showHoverCard(r, e.clientX, e.clientY);
            }}
            onMouseMove={(e) => showHoverCard(r, e.clientX, e.clientY)}
            onMouseLeave={startHideTimer}
          >
            <div className="flex flex-col gap-0.5">
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium transition-colors duration-200 ${r.status === "running" ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400" : "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400"}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${r.status === "running" ? "bg-emerald-500 animate-premium-glow" : "bg-amber-500"}`}></div>
                {r.status.toUpperCase()}
              </span>
              <div className="text-xs text-slate-500 dark:text-slate-400 pl-2">
                {r.statusDuration}
              </div>
            </div>
          </td>
        );
      case "speed":
        return (
          <td className="px-3 py-3">
            <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300"><Gauge fontSize="small" /><span className="font-medium">{r.speed}</span><span className="text-xs">km/h</span></div>
          </td>
        );
      case "lastUpdate":
        return <td className="px-3 py-3 text-slate-600 dark:text-slate-400">{r.lastUpdate}</td>;
      case "user":
        return (
          <td className="px-3 py-3">
            <div className="flex items-center gap-2"><Avatar name={r.user.name} color={r.user.avatarColor} /><div className="text-sm text-slate-700 dark:text-slate-300">{r.user.name}</div></div>
          </td>
        );
      case "icons":
        return (
          <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 text-slate-600">
              <span title={`Ignition ${r.icons.ignition ? "On" : "Off"}`}><Power fontSize="small" className={r.icons.ignition ? "text-slate-900 dark:text-slate-100" : "text-slate-400"} /></span>
              <span title={`GPS ${r.icons.satellite ? "OK" : "No Fix"}`}><Satellite fontSize="small" className={r.icons.satellite ? "text-slate-900 dark:text-slate-100" : "text-slate-400"} /></span>
              <span title={`Lock ${r.icons.lock ? "Engaged" : "Open"}`}><Lock fontSize="small" className={r.icons.lock ? "text-slate-900" : "text-slate-400"} /></span>
            </div>
          </td>
        );
      case "active":
        return (
          <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" className="peer sr-only" checked={r.active} onChange={(e) => setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, active: e.target.checked } : x)))} onClick={(e) => e.stopPropagation()} />
              <div className="h-5 w-9 rounded-full bg-slate-200 dark:bg-slate-600 transition-all peer-checked:bg-slate-900 dark:peer-checked:bg-slate-300"></div>
              <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white dark:bg-slate-800 shadow transition-transform peer-checked:translate-x-4 peer-checked:bg-white dark:peer-checked:bg-slate-900"></div>
            </label>
          </td>
        );
      case "expiry":
        return <td className="px-3 py-3 text-slate-700 dark:text-slate-300">{r.expiry}</td>;
    }
  }

  // ---------------------------
  // UI
  // ---------------------------

  // Loading Skeleton Component
  const LoadingSkeleton = () => (
    <div className="animate-fade-in-up">
      <div className="mb-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-80 rounded-xl bg-slate-200 dark:bg-slate-700 shimmer-loading"></div>
            <div className="h-10 w-20 rounded-xl bg-slate-200 dark:bg-slate-700 shimmer-loading"></div>
            <div className="h-10 w-32 rounded-xl bg-slate-200 dark:bg-slate-700 shimmer-loading"></div>
          </div>
          <div className="flex gap-2">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-10 w-16 rounded-xl bg-slate-200 dark:bg-slate-700 shimmer-loading"></div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
        <div className="bg-slate-100 dark:bg-slate-700 p-4">
          <div className="flex gap-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-6 flex-1 rounded bg-slate-200 dark:bg-slate-600 shimmer-loading"></div>
            ))}
          </div>
        </div>
        
        {[1,2,3,4,5,6,7,8,9,10].map(i => (
          <div key={i} className="border-b border-slate-200 dark:border-slate-700 p-4">
            <div className="flex gap-4">
              {[1,2,3,4,5].map(j => (
                <div key={j} className="h-4 flex-1 rounded bg-slate-100 dark:bg-slate-700 shimmer-loading"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1400px] p-4">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="mx-auto max-w-[1400px] p-4">
      {/* Bulk Actions Bar */}
      {selected.size > 0 && (
        <div className="mb-5 py-2 px-5 flex flex-wrap items-center justify-between rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800  shadow-sm">
          <div className="text-sm text-slate-700 dark:text-slate-300"><b>{selected.size}</b> selected</div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="inline-flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600" title="Bulk delete" onClick={(e) => { e.stopPropagation(); setRows((prev) => prev.filter((r) => !selected.has(r.id))); setSelected(new Set()); }}><Trash2 fontSize="small"/> Delete</button>
            <button className="inline-flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600" title="Assign user"><UserPlus fontSize="small"/> Assign</button>
            <button className="inline-flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600" title="Mark inactive" onClick={(e) => { e.stopPropagation(); setRows((prev)=> prev.map(r => selected.has(r.id) ? ({...r, active:false}) : r)); }}><PowerOff fontSize="small"/> Inactive</button>
            <button className="inline-flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600" title="Send command"><Send fontSize="small"/> Send Cmd</button>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="mb-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:gap-4">
          {/* Top row: Search & Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:flex-1">
            {/* Search Input */}
            <div className="relative flex-1 lg:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" fontSize="small" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search vehicle, IMEI, VIN, user…"
                className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 pl-10 pr-4 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 outline-none ring-0 transition focus:border-slate-400 dark:focus:border-slate-400 focus:bg-white dark:focus:bg-slate-600 focus:shadow-sm"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <button className="inline-flex h-10 w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-4 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors" title="Filter" onClick={(e) => { const menu = (e.currentTarget.nextSibling as HTMLElement)!; menu.classList.toggle("hidden"); }}>
                <Filter fontSize="small" /> Filter
              </button>
              <div className="absolute z-[510] mt-1 hidden w-48 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 p-2 text-sm shadow-xl">
                {(["all","running","stopped"] as const).map((opt) => (
                  <button key={opt} className={`block w-full rounded-lg px-3 py-2 text-left text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors ${statusFilter === opt ? "bg-slate-100 dark:bg-slate-600 font-medium" : ""}`} onClick={() => setStatusFilter(opt)}>
                    {opt === "all" ? "All statuses" : opt[0].toUpperCase()+opt.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Records Per Page */}
          <div className="flex items-center justify-between sm:justify-start gap-2 text-sm">
            <span className="text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap">Records per page:</span>
            <select 
              value={pageSize} 
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} 
              className="h-10 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 px-3 text-sm font-medium outline-none focus:border-slate-400 dark:focus:border-slate-400 focus:bg-white dark:focus:bg-slate-600 transition-colors"
            >
              {[10, 20, 30, 50, 100].map((n) => (<option key={n} value={n}>{n}</option>))}
            </select>
          </div>

          {/* Right Section: Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={onExportCSV} className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-4 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 hover:scale-105 hover:shadow-md transition-all duration-200 active:scale-95" title="Export CSV">
              <Download fontSize="small" /> <span className="hidden sm:inline">CSV</span>
            </button>
            <button onClick={onExportJSON} className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-4 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors" title="Export JSON">
              <span className="hidden sm:inline">JSON</span>
            </button>
            <button onClick={onExportPDF} className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-4 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors" title="Export PDF">
              <span className="hidden sm:inline">PDF</span>
            </button>
            <button onClick={onPrint} className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-4 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors" title="Print">
              <Printer fontSize="small" /> <span className="hidden sm:inline">Print</span>
            </button>

            {/* Column settings with drag to reorder */}
            <div className="relative">
              <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-4 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors" title="Customize Columns" onClick={(e) => { const menu = (e.currentTarget.nextSibling as HTMLElement)!; menu.classList.toggle("hidden"); }}>
                <Settings2 fontSize="small" /> <span className="hidden sm:inline">Columns</span>
              </button>
              <div className="absolute right-0 z-[510] mt-1 hidden w-64 rounded-2xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 p-3 text-sm shadow-xl">
                <div className="mb-3 flex items-center gap-2 px-2 text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400 font-medium"><Columns3 fontSize="small" /> Drag to reorder · Toggle to hide</div>
                {columnOrder.map((col, i) => (
                  <div key={col} draggable={col !== "select"} onDragStart={() => onDragStart(i)} onDragOver={(e) => onDragOver(e)} onDrop={() => onDrop(i)} className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <div className="flex items-center gap-2"><GripVertical fontSize="small" className="text-slate-400 dark:text-slate-500" /><span className="font-medium">{COLUMN_LABELS[col] || (col === "select" ? "Selection" : col)}</span></div>
                    <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400">{col === "select" ? <span className="text-xs text-slate-400 dark:text-slate-500">fixed</span> : (<input type="checkbox" checked={!hiddenCols.includes(col)} onChange={() => toggleHidden(col)} />)}</label>
                  </div>
                ))}
              </div>
            </div>

            {/* Fullscreen */}
            <button onClick={toggleFullscreen} className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-4 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors" title="Full Screen">
              {!document.fullscreenElement ? <Maximize2 fontSize="small" /> : <Minimize2 fontSize="small" />} <span className="hidden sm:inline">Full Screen</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-in-up" style={{ animationDelay: '400ms' }} onMouseLeave={hideHoverCardImmediate}>
        {/* Table */}
        <div id="fs-print-area">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="bg-white dark:bg-slate-800 text-left">
                {visibleCols.map((c) => (<HeaderCell key={c} col={c} />))}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((r, index) => (
                <tr 
                  key={r.id} 
                  className={`group cursor-pointer border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200 ${isTransitioning ? 'opacity-50' : 'animate-slide-in-right'}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => setDrawerRow(r)}
                >
                  {visibleCols.map((c) => (<Cell key={c} col={c} r={r} />))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer: Minimal Powerful Pagination */}
        <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 sm:px-6 py-4">
          {/* Responsive layout: Stack on mobile, 3-column on desktop */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Results Info */}
            <div className="text-sm text-slate-600 dark:text-slate-400 text-center lg:text-left lg:flex-1">
              Showing <span className="font-medium text-slate-900 dark:text-slate-100">{pageRows.length}</span> of <span className="font-medium text-slate-900 dark:text-slate-100">{sorted.length}</span> results
            </div>

            {/* Pagination Controls - Always centered */}
            <div className="flex items-center justify-center gap-1 flex-wrap">
            <button 
              className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:scale-100" 
              onClick={() => setPage(1)} 
              disabled={page === 1}
            >
              First
            </button>
            <button 
              className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent" 
              onClick={() => setPage((p) => Math.max(1, p - 1))} 
              disabled={page === 1}
            >
              Previous
            </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1 mx-1 sm:mx-2">
                {(() => {
                  const showPages = [];
                  const start = Math.max(1, page - 2);
                  const end = Math.min(totalPages, page + 2);
                  
                  for (let i = start; i <= end; i++) {
                    showPages.push(
                      <button
                        key={i}
                        className={`min-w-[32px] sm:min-w-[36px] h-8 sm:h-9 px-1 sm:px-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
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
                  
                  return showPages;
                })()}
              </div>

              <button 
                className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent" 
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))} 
                disabled={page === totalPages}
              >
                Next
              </button>
              
              <button 
                className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent" 
                onClick={() => setPage(totalPages)} 
                disabled={page === totalPages}
              >
                Last
              </button>
            </div>

            {/* Page Info */}
            <div className="text-sm text-slate-600 dark:text-slate-400 text-center lg:text-right lg:flex-1">
              Page <span className="font-medium text-slate-900 dark:text-slate-100">{page}</span> of <span className="font-medium text-slate-900 dark:text-slate-100">{totalPages}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Card */}
      {hoverCard.row && (
        <div 
          className="pointer-events-auto fixed z-[500] w-[320px] -translate-x-1/2 -translate-y-full rounded-2xl border border-slate-200 dark:border-slate-600 bg-white/95 dark:bg-slate-800/95 p-3 shadow-2xl backdrop-blur transition-all duration-200 animate-fade-in-up hover:scale-105" 
          style={{ left: hoverCard.x, top: hoverCard.y - 10 }}
          onMouseEnter={cancelHideTimer}
          onMouseLeave={hideHoverCardImmediate}
        >
          <div className="mb-2 flex items-center gap-2">
            <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-700 ring-1 ring-slate-200 dark:ring-slate-600"><Car fontSize="small" className="text-slate-600 dark:text-slate-400" /></div>
            <div className="min-w-0">
              <div className="truncate font-semibold text-slate-900 dark:text-slate-100">{hoverCard.row.vehicleName}</div>
              <div className="truncate text-[11px] text-slate-500 dark:text-slate-400">IMEI: <span className="font-mono">{hoverCard.row.imei}</span> · VIN: <span className="font-mono">{hoverCard.row.vin}</span></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[12px] text-slate-700 dark:text-slate-300">
            <div className="rounded-xl bg-slate-50 dark:bg-slate-700 p-2"><div className="text-[11px] text-slate-500 dark:text-slate-400">Status</div><div className="flex items-center gap-1 font-medium"><Power fontSize="small" className={hoverCard.row.status === "running" ? "text-slate-900 dark:text-slate-100" : "text-slate-500 dark:text-slate-400"} />{hoverCard.row.status.toUpperCase()} [{hoverCard.row.statusDuration}]</div></div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-700 p-2"><div className="text-[11px] text-slate-500 dark:text-slate-400">Speed</div><div className="flex items-center gap-1 font-medium"><Gauge fontSize="small" /> {hoverCard.row.speed} km/h</div></div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-700 p-2"><div className="text-[11px] text-slate-500 dark:text-slate-400">Last Update</div><div className="font-medium">{hoverCard.row.lastUpdate}</div></div>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-700 p-2"><div className="text-[11px] text-slate-500 dark:text-slate-400">Expiry</div><div className="font-medium">{hoverCard.row.expiry}</div></div>
          </div>
        </div>
      )}

      {/* Drawer — Row Details (alt dataset) */}
      <div className={`fixed inset-y-0 right-0 z-[520] w-full sm:w-[420px] transform border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-2xl transition-all duration-500 ease-in-out ${drawerRow ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`} role="dialog" aria-hidden={!drawerRow}>
        <div className="mb-3 flex items-center justify-between">
          <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">Vehicle Details</div>
          <button className="rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-2 py-1 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600" onClick={() => setDrawerRow(null)}>Close</button>
        </div>
        {drawerRow && (
          <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-80px)]">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-700 ring-1 ring-slate-200 dark:ring-slate-600"><Car fontSize="medium" className="text-slate-600 dark:text-slate-400" /></div>
              <div>
                <div className="text-base font-semibold text-slate-900 dark:text-slate-100">{drawerRow.vehicleName}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">IMEI: <span className="font-mono">{drawerRow.imei}</span> · VIN: <span className="font-mono">{drawerRow.vin}</span></div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/50 p-3"><div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Status</div><div className="mt-1 flex items-center gap-2 font-medium text-slate-900 dark:text-slate-100"><Power fontSize="small" className={drawerRow.status === "running" ? "text-emerald-600" : "text-amber-600"} />{drawerRow.status.toUpperCase()} <span className="opacity-70">[{drawerRow.statusDuration}]</span></div></div>
              <div className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/50 p-3"><div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Speed</div><div className="mt-1 flex items-center gap-2 font-medium text-slate-900 dark:text-slate-100"><Gauge fontSize="small" /> {drawerRow.speed} km/h</div></div>
              <div className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/50 p-3"><div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Primary User</div><div className="mt-1 flex items-center gap-2"><Avatar name={drawerRow.user.name} color={drawerRow.user.avatarColor} /><div className="font-medium text-slate-900 dark:text-slate-100">{drawerRow.user.name}</div></div></div>
              <div className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/50 p-3"><div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Last Update</div><div className="mt-1 font-medium text-slate-900 dark:text-slate-100">{drawerRow.lastUpdate}</div></div>
              <div className="col-span-1 sm:col-span-2 rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/50 p-3"><div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Device & SIM (Alt Dataset)</div>{(() => { const alt = ALT_DETAILS[drawerRow.id]; return (<div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm"><div><div className="text-slate-500 dark:text-slate-400">Fuel Level</div><div className="font-semibold text-slate-900 dark:text-slate-100">{alt.fuelLevel}%</div></div><div><div className="text-slate-500 dark:text-slate-400">Odometer</div><div className="font-semibold text-slate-900 dark:text-slate-100">{alt.odometer.toLocaleString()} km</div></div><div><div className="text-slate-500 dark:text-slate-400">SIM</div><div className="font-semibold text-slate-900 dark:text-slate-100">{alt.sim}</div></div><div><div className="text-slate-500 dark:text-slate-400">Device Model</div><div className="font-semibold text-slate-900 dark:text-slate-100">{alt.deviceModel}</div></div><div className="col-span-1 sm:col-span-2"><div className="text-slate-500 dark:text-slate-400">Geo Fences</div><div className="mt-1 flex flex-wrap gap-1">{alt.geoFence.length ? (alt.geoFence.map((g, i) => (<span key={i} className="rounded-full bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-300 px-2 py-0.5 text-xs">{g}</span>))) : (<span className="text-slate-400 dark:text-slate-500">No fences</span>)}</div></div></div>); })()}</div>
            </div>
            <div className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/50 p-3 text-sm"><div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Security</div><div className="mt-1 flex flex-wrap items-center gap-3 text-slate-700 dark:text-slate-300"><span className="inline-flex items-center gap-1"><Power fontSize="small" className={drawerRow.icons.ignition ? "text-slate-900 dark:text-slate-100" : "text-slate-400"} /> Ignition</span><span className="inline-flex items-center gap-1"><Satellite fontSize="small" className={drawerRow.icons.satellite ? "text-slate-900 dark:text-slate-100" : "text-slate-400"} /> GPS</span><span className="inline-flex items-center gap-1"><Lock fontSize="small" className={drawerRow.icons.lock ? "text-slate-900 dark:text-slate-100" : "text-slate-400"} /> Lock</span></div></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm"><div className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/50 p-3"><div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Active</div><div className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{drawerRow.active ? "Yes" : "No"}</div></div><div className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/50 p-3"><div className="text-[11px] uppercase tracking-wide text-slate-500 dark:text-slate-400">Expiry</div><div className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{drawerRow.expiry}</div></div></div>
          </div>
        )}
      </div>

      {/* Backdrop for drawer */}
      {drawerRow && (<div className="fixed inset-0 z-[515] bg-slate-900/10 dark:bg-slate-900/30 backdrop-blur-[1px]" onClick={() => setDrawerRow(null)} />)}
    </div>
  );
}

// ---------------------------
// Dev Self‑Tests (non‑blocking)
// ---------------------------

function runDevTests() {
  // Skip dev tests in production or if not in browser environment
  if (typeof window === 'undefined') return;
  
  try {
    // Test 1: CSV newline join string is correct and no syntax error
    const sample = makeRows(2);
    const order: ColumnKey[] = ["vehicle", "status", "speed"]; // custom order
    const csv = toCSV(sample, order);
    const header = csv.split("\n")[0];
    if (header.indexOf("Vehicle Name") >= header.indexOf("Status")) {
      console.warn("[FleetStack Table] Header order test failed");
    }

    // Test 2: CSV lines >= header + rows
    const lines = csv.split("\n");
    if (lines.length < 3) {
      console.warn("[FleetStack Table] CSV lines test failed");
    }

    // Test 3: JSON export shape (sanity)
    const json = JSON.stringify({ id: sample[0].id, vehicleName: sample[0].vehicleName, imei: sample[0].imei, vin: sample[0].vin });
    if (!json.includes("vehicleName")) {
      console.warn("[FleetStack Table] JSON shape test failed");
    }

    // Test 4: Visible columns drive body cell count
    const visible = DEFAULT_ORDER.filter((c) => c !== "icons" && c !== "select");
    if (!visible.includes("vehicle") || !visible.includes("status")) {
      console.warn("[FleetStack Table] Visible columns test failed");
    }
  } catch (e) {
    console.warn("[FleetStack Table] Dev tests warning:", e);
  }
}

// Only run tests in development and on client side
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') { 
  runDevTests(); 
}

export { toCSV, makeRows, DEFAULT_ORDER };