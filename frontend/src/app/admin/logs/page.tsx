"use client";
import React, { use, useMemo, useState } from "react";
import {
  DirectionsCar,
  People,
  Person,
  Search,
  Close,
  BugReport,
  Warning,
  InfoOutlined,
  ChevronLeft,
  ChevronRight,
  ContentCopy,
  CheckCircle,
  PauseCircle,
  PlayCircle,
  Download,
  FilterList,
} from "@mui/icons-material";
import DetailSheet from "@/components/admin/logs/LogsDetailsSheet";
import { Toggle } from "@/components/ui/toggle";
import {
  DisplayMap,
  FilterConfigMap,
  MultiSelectOption,
  SmartCheckboxAutoTable,
} from "@/components/common/smartcheckboxautotable";
import { Button } from "@/components/ui/button";

const Card = ({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    className={
      "rounded-2xl border border-neutral-200 bg-white shadow-sm " + className
    }
  >
    {children}
  </div>
);

const Badge = ({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "ok" | "warn" | "err";
}) => {
  const tones: Record<string, string> = {
    default: "border-neutral-200 bg-neutral-50 text-neutral-700",
    ok: "border-neutral-200 bg-neutral-900 text-white",
    warn: "border-neutral-200 bg-neutral-100 text-neutral-800",
    err: "border-neutral-200 bg-neutral-200 text-neutral-900",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${tones[tone]}`}
    >
      {children}
    </span>
  );
};

// Popover / MultiSelect primitives
const Popover = ({
  open,
  onClose,
  anchorRight = false,
  children,
}: {
  open: boolean;
  onClose: () => void;
  anchorRight?: boolean;
  children: React.ReactNode;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute inset-0" />
      <div
        className={`absolute ${
          anchorRight ? "right-6" : "left-6"
        } top-40 z-50 w-[26rem] rounded-2xl border border-neutral-200 bg-white p-3 shadow-xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

// ————————————————————————————————————————————————
// Sample Data
// ————————————————————————————————————————————————
export type EntityType = "vehicle" | "user" | "driver";
export type Severity = "info" | "warning" | "error";
export type Channel = "system" | "in-app" | "email" | "sms";

interface LogRow {
  id: string;
  ts: string; // ISO
  entityType: EntityType;
  entityId: string;
  entityLabel: string;
  severity: Severity;
  channel: Channel;
  message: string;
  actor?: string; // who triggered
  meta?: Record<string, any>;
}

const now = Date.now();
const ago = (mins: number) => new Date(now - mins * 60 * 1000).toISOString();
const mk = (p: Partial<LogRow>): LogRow => ({
  id: cryptoRandomId(),
  ts: new Date().toISOString(),
  entityType: "vehicle",
  entityId: "V-000",
  entityLabel: "—",
  severity: "info",
  channel: "system",
  message: "",
  ...p,
});

function cryptoRandomId() {
  // Simple id without external deps
  return (
    Math.random().toString(36).slice(2, 10) +
    Math.random().toString(36).slice(2, 6)
  );
}

const SAMPLE_LOGS: LogRow[] = [
  mk({
    ts: ago(2),
    entityType: "vehicle",
    entityId: "GJ05KD8821",
    entityLabel: "Tata Ace",
    severity: "warning",
    channel: "system",
    message: "Geofence exit detected • Warehouse‑2",
    actor: "system",
    meta: { geofence: "Warehouse-2", lat: 22.53, lon: 73.23 },
  }),
  mk({
    ts: ago(5),
    entityType: "user",
    entityId: "USR-329",
    entityLabel: "Riya Verma",
    severity: "info",
    channel: "email",
    message: "Password reset email sent",
    actor: "riya@orbit.ai",
  }),
  mk({
    ts: ago(7),
    entityType: "driver",
    entityId: "DRV-110",
    entityLabel: "S. Khan",
    severity: "info",
    channel: "in-app",
    message: "Check‑in success",
    actor: "mobile-app",
  }),
  mk({
    ts: ago(9),
    entityType: "vehicle",
    entityId: "MH14CX1021",
    entityLabel: "Eicher 14T",
    severity: "error",
    channel: "system",
    message: "Device offline (48h)",
    meta: { lastSeenMins: 2880 },
  }),
  mk({
    ts: ago(10),
    entityType: "user",
    entityId: "USR-221",
    entityLabel: "Kabir Singh",
    severity: "warning",
    channel: "in-app",
    message: "Plan approaching limit: 95% usage",
  }),
  mk({
    ts: ago(13),
    entityType: "vehicle",
    entityId: "RJ27Z7402",
    entityLabel: "Leyland 1618",
    severity: "info",
    channel: "sms",
    message: "Overspeed end • Avg 62 km/h",
  }),
  mk({
    ts: ago(15),
    entityType: "vehicle",
    entityId: "DL09AB2613",
    entityLabel: "Scorpio N",
    severity: "info",
    channel: "system",
    message: "Ignition ON",
  }),
  mk({
    ts: ago(21),
    entityType: "driver",
    entityId: "DRV-231",
    entityLabel: "P. Mehta",
    severity: "warning",
    channel: "in-app",
    message: "Rest due: 6h continuous driving",
  }),
  mk({
    ts: ago(25),
    entityType: "user",
    entityId: "USR-118",
    entityLabel: "Meera Shah",
    severity: "error",
    channel: "email",
    message: "Email bounce (hard)",
  }),
  mk({
    ts: ago(26),
    entityType: "vehicle",
    entityId: "UP32FA4477",
    entityLabel: "Mahindra 4x4",
    severity: "info",
    channel: "system",
    message: "Location update",
    meta: { lat: 26.85, lon: 80.95 },
  }),
  mk({
    ts: ago(35),
    entityType: "vehicle",
    entityId: "KA03MP9090",
    entityLabel: "Bolero Pickup",
    severity: "warning",
    channel: "system",
    message: "Harsh braking detected",
    meta: { decel: -5.2 },
  }),
  mk({
    ts: ago(44),
    entityType: "user",
    entityId: "USR-553",
    entityLabel: "Aarav Bansal",
    severity: "info",
    channel: "in-app",
    message: "2FA enabled",
  }),
  mk({
    ts: ago(53),
    entityType: "driver",
    entityId: "DRV-110",
    entityLabel: "S. Khan",
    severity: "error",
    channel: "system",
    message: "Panic button pressed",
    meta: { durationSec: 4 },
  }),
  mk({
    ts: ago(60),
    entityType: "vehicle",
    entityId: "GJ05KD8821",
    entityLabel: "Tata Ace",
    severity: "info",
    channel: "system",
    message: "Ignition OFF",
  }),
  mk({
    ts: ago(61),
    entityType: "vehicle",
    entityId: "MH14CX1021",
    entityLabel: "Eicher 14T",
    severity: "info",
    channel: "system",
    message: "Device heartbeat",
  }),
  mk({
    ts: ago(65),
    entityType: "user",
    entityId: "USR-329",
    entityLabel: "Riya Verma",
    severity: "warning",
    channel: "in-app",
    message: "Multiple failed logins",
  }),
  mk({
    ts: ago(70),
    entityType: "driver",
    entityId: "DRV-231",
    entityLabel: "P. Mehta",
    severity: "info",
    channel: "system",
    message: "Shift started",
  }),
  mk({
    ts: ago(95),
    entityType: "vehicle",
    entityId: "RJ27Z7402",
    entityLabel: "Leyland 1618",
    severity: "error",
    channel: "system",
    message: "Tamper detected",
  }),
  mk({
    ts: ago(110),
    entityType: "user",
    entityId: "USR-118",
    entityLabel: "Meera Shah",
    severity: "info",
    channel: "email",
    message: "Welcome email opened",
  }),
  mk({
    ts: ago(130),
    entityType: "vehicle",
    entityId: "UP32FA4477",
    entityLabel: "Mahindra 4x4",
    severity: "warning",
    channel: "system",
    message: "Long idle: 25m",
  }),
];

// ————————————————————————————————————————————————
// Icons
// ————————————————————————————————————————————————
const entityIcon = (type: EntityType): React.ElementType => {
  switch (type) {
    case "vehicle":
      return DirectionsCar;
    case "user":
      return People;
    case "driver":
      return Person;
  }
};
const severityIcon = (sev: Severity): React.ElementType => {
  switch (sev) {
    case "error":
      return BugReport;
    case "warning":
      return Warning;
    default:
      return InfoOutlined;
  }
};

const severityTone = (sev: Severity): "default" | "ok" | "warn" | "err" =>
  sev === "error" ? "err" : sev === "warning" ? "warn" : "default";

// ————————————————————————————————————————————————
// Reusable MultiSelect
// ————————————————————————————————————————————————
interface Opt {
  key: string;
  label: string;
  sub?: string;
}
const MultiSelect = ({
  label,
  options,
  selected,
  setSelected,
  anchorRight = false,
}: {
  label: string;
  options: Opt[];
  selected: Set<string>;
  setSelected: (next: Set<string>) => void;
  anchorRight?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () =>
      options.filter((o) =>
        (o.label + " " + (o.sub ?? "")).toLowerCase().includes(q.toLowerCase())
      ),
    [options, q]
  );
  const allFilteredSelected =
    filtered.length > 0 && filtered.every((o) => selected.has(o.key));
  const toggle = (key: string, on?: boolean) => {
    const next = new Set(selected);
    const flag = typeof on === "boolean" ? on : !next.has(key);
    if (flag) next.add(key);
    else next.delete(key);
    setSelected(next);
  };

  return (
    <div className="relative">
      <Button variant="outline" onClick={() => setOpen(true)}>
        <FilterList className="h-4 w-4" /> {label}
        {selected.size > 0 && (
          <span className="ml-1 rounded-full bg-black px-1.5 py-0.5 text-[10px] text-white">
            {selected.size}
          </span>
        )}
      </Button>
      <Popover
        open={open}
        onClose={() => setOpen(false)}
        anchorRight={anchorRight}
      >
        <div className="mb-2 flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
          <Search className="h-4 w-4 text-neutral-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${label.toLowerCase()}`}
            className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
          />
          {q && (
            <button
              className="rounded-full p-1 hover:bg-neutral-200"
              onClick={() => setQ("")}
            >
              <Close className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="mb-2 flex items-center justify-between">
          <div className="typo-subtitle">
            {filtered.length} match(es)
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="px-2 py-1"
              onClick={() => setSelected(new Set())}
            >
              Clear
            </Button>
            <Button
              variant="outline"
              className="px-2 py-1"
              onClick={() =>
                filtered.forEach((o) => toggle(o.key, !allFilteredSelected))
              }
            >
              {allFilteredSelected ? "Unselect All" : "Select All"}
            </Button>
          </div>
        </div>
        <div className="max-h-72 overflow-auto rounded-xl border border-neutral-200">
          {filtered.map((o) => (
            <label
              key={o.key}
              className="flex cursor-pointer items-center gap-3 border-b border-neutral-100 px-3 py-2 last:border-b-0 hover:bg-neutral-50"
            >
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-neutral-300"
                checked={selected.has(o.key)}
                onChange={() => toggle(o.key)}
              />
              <div className="min-w-0">
                <div className="truncate text-sm font-medium leading-none">
                  {o.label}
                </div>
                {o.sub && (
                  <div className="truncate typo-subtitle">
                    {o.sub}
                  </div>
                )}
              </div>
            </label>
          ))}
        </div>
      </Popover>
    </div>
  );
};

// ————————————————————————————————————————————————
// Main Page
// ————————————————————————————————————————————————
export default function LogsPage() {
  // Scope (single entity class at a time)
  const [scope, setScope] = useState<EntityType>("vehicle");

  // Specific selectors
  const [selVehicles, setSelVehicles] = useState<Set<string>>(new Set()); // entityId
  const [selUsers, setSelUsers] = useState<Set<string>>(new Set()); // entityId
  const [selDrivers, setSelDrivers] = useState<Set<string>>(new Set()); // entityId

  // Filters
  const [sev, setSev] = useState<Set<Severity>>(new Set()); // empty = all
  const [channels, setChannels] = useState<Set<Channel>>(new Set()); // empty = all
  const [search, setSearch] = useState("");
  const [quickRange, setQuickRange] = useState<
    "1h" | "6h" | "24h" | "7d" | "30d" | "all"
  >("24h");
  const [fromTs, setFromTs] = useState<string>(""); // ISO local
  const [toTs, setToTs] = useState<string>("");
  const [live, setLive] = useState(true);
  const [paused, setPaused] = useState(false);

  // Table state
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Drawer state
  const [openId, setOpenId] = useState<string | null>(null);

  // Build option lists from logs
  const vehicleOpts: Opt[] = useMemo(() => {
    const map = new Map<string, string>();
    SAMPLE_LOGS.filter((l) => l.entityType === "vehicle").forEach((l) =>
      map.set(l.entityId, l.entityLabel)
    );
    return [...map.entries()].map(([key, label]) => ({ key, label }));
  }, []);
  const userOpts: Opt[] = useMemo(() => {
    const map = new Map<string, string>();
    SAMPLE_LOGS.filter((l) => l.entityType === "user").forEach((l) =>
      map.set(l.entityId, l.entityLabel)
    );
    return [...map.entries()].map(([key, label]) => ({ key, label }));
  }, []);
  const driverOpts: Opt[] = useMemo(() => {
    const map = new Map<string, string>();
    SAMPLE_LOGS.filter((l) => l.entityType === "driver").forEach((l) =>
      map.set(l.entityId, l.entityLabel)
    );
    return [...map.entries()].map(([key, label]) => ({ key, label }));
  }, []);

  const byQuickRangeMin = (r: typeof quickRange) => {
    const mins =
      r === "1h"
        ? 60
        : r === "6h"
        ? 360
        : r === "24h"
        ? 1440
        : r === "7d"
        ? 10080
        : r === "30d"
        ? 43200
        : Infinity;
    return isFinite(mins) ? Date.now() - mins * 60 * 1000 : 0;
  };

  const filtered = useMemo(() => {
    let minTs = 0,
      maxTs = Infinity;
    if (fromTs && toTs) {
      minTs = +new Date(fromTs);
      maxTs = +new Date(toTs);
    } else if (!fromTs && !toTs) {
      const qmin = byQuickRangeMin(quickRange);
      minTs = qmin || 0;
    } else if (fromTs && !toTs) {
      minTs = +new Date(fromTs);
    } else if (!fromTs && toTs) {
      maxTs = +new Date(toTs);
    }

    const scopeSet =
      scope === "vehicle"
        ? selVehicles
        : scope === "user"
        ? selUsers
        : selDrivers;

    return SAMPLE_LOGS.filter((l) => {
      // Scope: only one entity class visible
      if (l.entityType !== scope) return false;
      // ID selection for current scope
      if (scopeSet.size > 0 && !scopeSet.has(l.entityId)) return false;

      if (sev.size > 0 && !sev.has(l.severity)) return false;
      if (channels.size > 0 && !channels.has(l.channel)) return false;

      const t = +new Date(l.ts);
      if (t < minTs) return false;
      if (t > maxTs) return false;

      const q = search.trim().toLowerCase();
      if (
        q &&
        !`${l.entityId} ${l.entityLabel} ${l.message}`.toLowerCase().includes(q)
      )
        return false;
      return true;
    }).sort((a, b) => +new Date(b.ts) - +new Date(a.ts));
  }, [
    scope,
    selVehicles,
    selUsers,
    selDrivers,
    sev,
    channels,
    search,
    quickRange,
    fromTs,
    toTs,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paged = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const toggleAllVisible = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      const allSelected = paged.every((r) => next.has(r.id));
      paged.forEach((r) => (allSelected ? next.delete(r.id) : next.add(r.id)));
      return next;
    });
  };

  const copyJSON = async (row: LogRow) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(row, null, 2));
      alert("Copied JSON to clipboard");
    } catch {
      alert("Clipboard unavailable in this environment");
    }
  };

  const clearAll = () => {
    setSelVehicles(new Set());
    setSelUsers(new Set());
    setSelDrivers(new Set());
    setSev(new Set());
    setChannels(new Set());
    setSearch("");
    setQuickRange("24h");
    setFromTs("");
    setToTs("");
    setPage(1);
  };

  const ScopeButton = ({ t }: { t: EntityType }) => {
    const active = scope === t;
    const Icon =
      t === "vehicle" ? DirectionsCar : t === "user" ? People : Person;
    const label =
      t === "vehicle" ? "Vehicles" : t === "user" ? "Users" : "Drivers";
    return (
      <button
        onClick={() => {
          setScope(t);
          setPage(1);
        }}
        className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm ${
          active
            ? "border-primary bg-primary text-white"
            : "border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50"
        }`}
      >
        <Icon className="h-4 w-4" /> {label}
      </button>
    );
  };

  const displayOptions: DisplayMap<LogRow> = {
    0: {
      title: () => "Time",
      content: (r) => new Date(r.ts).toLocaleString(),
    },
    1: {
      title: () => "Entity",
      content: (r) => (
        <div className="flex items-center gap-2">
          {React.createElement(entityIcon(r.entityType), {
            className: "h-4 w-4",
          })}
          <div className="flex flex-col leading-tight">
            <span className="font-medium">{r.entityLabel}</span>
            <span className="typo-subtitle">{r.entityId}</span>
          </div>
        </div>
      ),
    },
    2: {
      title: () => "Message",
      content: (r) => r.message,
    },
    3: {
      title: () => "Severity",
      content: (r) => (
        <Badge tone={severityTone(r.severity)}>
          {React.createElement(severityIcon(r.severity), {
            className: "h-3 w-3",
          })}{" "}
          {r.severity}
        </Badge>
      ),
    },
    4: {
      title: () => "Channel",
      content: (r) => <Badge>{r.channel}</Badge>,
    },
    5: {
      title: () => "Actions",
      content: (r) => (
        <Button size="sm" variant="outline" onClick={() => setOpenId(r.id)}>
          View
        </Button>
      ),
    },
  };

  const filterConfig: FilterConfigMap<LogRow> = {
    // q: {
    //   kind: "text",
    //   label: "🔍 Search",
    //   customPredicate: (row, q) =>
    //     (row.entityLabel + row.entityId + row.message)
    //       .toLowerCase()
    //       .includes(String(q).toLowerCase()),
    // },
    // severity: {
    //   kind: "multi",
    //   label: "⚠ Severity",
    //   options: ["info", "warning", "error"].map((x) => ({
    //     label: x,
    //     value: x,
    //   })),
    //   predicate: (row, values) =>
    //     !values?.length || values.includes(row.severity),
    // },
    // channel: {
    //   kind: "multi",
    //   label: "📨 Channels",
    //   options: ["system", "in-app", "email", "sms"].map((x) => ({
    //     label: x,
    //     value: x,
    //   })),
    //   predicate: (row, values) =>
    //     !values?.length || values.includes(row.channel),
    // },
    ts: {
      kind: "dateRange",
      label: "⏱ Time",
      field: "ts",
    },
  };

  const bulkActions: MultiSelectOption<LogRow>[] = [
    {
      name: "Copy JSON",
      iconName: "content_copy",
      tooltip: "Copy selected rows as JSON",
      callback: (rows) =>
        navigator.clipboard.writeText(JSON.stringify(rows, null, 2)),
    },
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Header */}
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="typo-h1">Logs</h1>
            <p className="text-sm text-neutral-500">
              Vehicles • Users • Drivers
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-3 py-2">
              <span className="typo-subtitle">Live Tail</span>
              <Toggle checked={live} onChange={setLive} />
            </div>
            <Button variant="outline" onClick={() => setPaused((p) => !p)}>
              {paused ? (
                <PlayCircle className="h-4 w-4" />
              ) : (
                <PauseCircle className="h-4 w-4" />
              )}{" "}
              {paused ? "Resume" : "Pause"}
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4" /> Export JSON (UI)
            </Button>
          </div>
        </div>

        {/* Scope + Filters */}
        <Card className="mb-5">
          <div className="flex flex-wrap items-center gap-3 p-4">
            {/* Scope picker */}
            <ScopeButton t="vehicle" />
            <ScopeButton t="user" />
            <ScopeButton t="driver" />

            {/* Entity selector */}
            {scope === "vehicle" && (
              <MultiSelect
                label="Vehicles"
                options={vehicleOpts}
                selected={selVehicles}
                setSelected={setSelVehicles}
              />
            )}
            {scope === "user" && (
              <MultiSelect
                label="Users"
                options={userOpts}
                selected={selUsers}
                setSelected={setSelUsers}
              />
            )}
            {scope === "driver" && (
              <MultiSelect
                label="Drivers"
                options={driverOpts}
                selected={selDrivers}
                setSelected={setSelDrivers}
              />
            )}

            {/* Severity */}
            {(["info", "warning", "error"] as const).map((s) => {
              const active = sev.has(s);
              const Icon = severityIcon(s);
              return (
                <Button
                  key={s}
                  variant={active ? "default" : "outline"}
                  onClick={() =>
                    setSev((prev) => {
                      const n = new Set(prev);
                      n.has(s) ? n.delete(s) : n.add(s);
                      return n;
                    })
                  }
                  className="flex items-center gap-2 rounded-2xl text-xs"
                >
                  <Icon className="h-4 w-4" /> {s.toUpperCase()}
                </Button>
              );
            })}

            {/* Channels */}
            {(["system", "in-app", "email", "sms"] as const).map((c) => (
              <Button
                key={c}
                variant={channels.has(c) ? "default" : "outline"}
                onClick={() =>
                  setChannels((prev) => {
                    const n = new Set(prev);
                    n.has(c) ? n.delete(c) : n.add(c);
                    return n;
                  })
                }
              >
                {c.toUpperCase()}
              </Button>
            ))}
          </div>

          {/* Quick ranges */}
          <div className="flex flex-wrap items-center gap-3 border-t border-neutral-200 p-4">
            {(["1h", "6h", "24h", "7d", "30d", "all"] as const).map((r) => (
              <Button
                key={r}
                variant={quickRange === r && !fromTs && !toTs ? "default" : "outline"}
                onClick={() => {
                  setQuickRange(r);
                  setFromTs("");
                  setToTs("");
                }}
              >
                {r.toUpperCase()}
              </Button>
            ))}

            {/* Custom date range */}
            {/* <div className="flex items-center gap-2">
              <input
                type="datetime-local"
                value={fromTs}
                onChange={(e) => setFromTs(e.target.value)}
                className="rounded-xl border border-neutral-300 bg-white px-2 py-1 text-xs"
              />
              <span className="typo-subtitle">to</span>
              <input
                type="datetime-local"
                value={toTs}
                onChange={(e) => setToTs(e.target.value)}
                className="rounded-xl border border-neutral-300 bg-white px-2 py-1 text-xs"
              />
            </div> */}

            <div className="ml-auto flex items-center gap-2">
              <div className="typo-subtitle">
                {filtered.length} result(s)
              </div>
              <Button variant="outline" onClick={clearAll}>
                Reset
              </Button>
            </div>
          </div>
        </Card>

        {/* Table */}
        <SmartCheckboxAutoTable<LogRow>
          title="Logs"
          data={filtered}
          getRowId={(r) => r.id}
          displayOptions={displayOptions}
          filterConfig={filterConfig}
          multiSelectOptions={bulkActions}
          onRowClick={(row) => setOpenId(row.id)}
          showtoolbar={true}
          showtoolbarInput={true}
          showtoolbarFilter={true}
          showtoolbarRefreshbtn={true}
          showtoolbarRecords={true}
          showtoolbarExport={true}
          showtoolbarColumn={true}
          showtoolbarFullScreen={true}
        />
      </div>

      {/* Details Drawer */}
      {(() => {
        const row = SAMPLE_LOGS.find((x) => x.id === openId);
        if (!row) return null;

        const EIcon = entityIcon(row.entityType);
        const SIcon = severityIcon(row.severity);

        return (
          <DetailSheet
            open={!!openId}
            onOpenChange={() => setOpenId(null)}
            icon={EIcon}
            title={row.entityLabel}
            subTitle={`${row.entityType} • ${row.entityId}`}
            sections={[
              {
                title: "Overview",
                items: [
                  { label: "Time", value: new Date(row.ts).toLocaleString() },
                  {
                    label: "Severity",
                    value: (
                      <Badge tone={severityTone(row.severity)}>
                        <SIcon className="h-3.5 w-3.5" /> {row.severity}
                      </Badge>
                    ),
                  },
                  { label: "Channel", value: <Badge>{row.channel}</Badge> },
                  row.actor && { label: "Actor", value: row.actor },
                ].filter(Boolean) as any,
              },
              {
                title: "Message",
                content: row.message,
              },
            ]}
            rawJSON={row}
            onCopyJSON={() => copyJSON(row)}
          />
        );
      })()}
    </div>
  );
}
