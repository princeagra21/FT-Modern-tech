import React, { useMemo, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import SpeedIcon from "@mui/icons-material/Speed";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import MapIcon from "@mui/icons-material/Map";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import EmailIcon from "@mui/icons-material/Email";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import {
  MultiDateTimeRangePicker,
  DateTimeRangeValue,
  buildDefaultDateTimePresets,
} from "../common/multidatetimeselection";

type Attribute = {
  id: number;
  type: number;
  heartbeat: boolean;
  status: number;
  ignition: boolean;
  charge: boolean;
  blocked: boolean;
  batteryRaw?: number;
  batteryLevel?: number;
  rssi?: number;
  distance?: number;
  totalDistance?: number;
  motion?: boolean;
  hours?: number;
};

type LogRow = {
  srno: number;
  imei: string;
  speed: number;
  latitude: number;
  longitude: number;
  date: string;
  attribute: Attribute | string;
};

 // ---------- Seed (static manual data, no generators) ----------
 const EXAMPLE_ATTR: Attribute = {"id":19,"type":19,"heartbeat":true,"status":4,"ignition":false,"charge":true,"blocked":false,"batteryRaw":6,"batteryLevel":90,"rssi":4,"distance":0.0,"totalDistance":8994089.73,"motion":false,"hours":148980000};

 const LOGS: LogRow[] = [
  { srno: 1, imei: "358920108765431", speed: 62,  latitude: 28.6139, longitude: 77.209, date: "2025-10-17T08:02:15+05:30", attribute: { ...EXAMPLE_ATTR, ignition: true, rssi: 4 } },
  { srno: 2, imei: "358920108765432", speed: 58,  latitude: 28.6142, longitude: 77.2099, date: "2025-10-17T07:50:15+05:30", attribute: { ...EXAMPLE_ATTR, ignition: false, rssi: 3 } },
  { srno: 3, imei: "358920108765433", speed: 40,  latitude: 28.6151, longitude: 77.2108, date: "2025-10-17T07:38:15+05:30", attribute: { ...EXAMPLE_ATTR, ignition: true, rssi: 5, motion: true } },
  { srno: 4, imei: "358920108765434", speed: 0,   latitude: 28.616, longitude: 77.2121, date: "2025-10-16T22:02:15+05:30", attribute: { ...EXAMPLE_ATTR, ignition: false, motion: false } },
  { srno: 5, imei: "358920108765435", speed: 12,  latitude: 28.6172, longitude: 77.2135, date: "2025-10-16T18:15:00+05:30", attribute: { ...EXAMPLE_ATTR, ignition: true, batteryLevel: 88 } },
  { srno: 6, imei: "358920108765436", speed: 75,  latitude: 28.619, longitude: 77.214, date: "2025-10-15T14:30:45+05:30", attribute: { ...EXAMPLE_ATTR, ignition: true, rssi: 2 } },
  { srno: 7, imei: "358920108765437", speed: 33,  latitude: 28.6205, longitude: 77.2152, date: "2025-10-14T09:12:30+05:30", attribute: { ...EXAMPLE_ATTR, ignition: false, batteryLevel: 76 } },
  { srno: 8, imei: "358920108765438", speed: 0,   latitude: 28.6211, longitude: 77.2168, date: "2025-10-13T20:44:10+05:30", attribute: { ...EXAMPLE_ATTR, ignition: false, blocked: true } },
  { srno: 9, imei: "358920108765439", speed: 49,  latitude: 28.622, longitude: 77.218, date: "2025-10-12T11:27:00+05:30", attribute: { ...EXAMPLE_ATTR, ignition: true, distance: 0.4 } },
  { srno: 10, imei: "358920108765440", speed: 57, latitude: 28.6233, longitude: 77.2191, date: "2025-10-11T06:05:05+05:30", attribute: { ...EXAMPLE_ATTR, ignition: true, totalDistance: 8999999.73 } },
  { srno: 11, imei: "358920108765441", speed: 23, latitude: 28.6244, longitude: 77.2202, date: "2025-10-10T16:45:22+05:30", attribute: { ...EXAMPLE_ATTR, ignition: false, motion: true } },
  { srno: 12, imei: "358920108765442", speed: 0,  latitude: 28.6255, longitude: 77.222, date: "2025-10-09T08:08:08+05:30", attribute: { ...EXAMPLE_ATTR, heartbeat: true, ignition: false } },
 ];

// ---------- Utils ----------
 function cls(...xs:(string|false|undefined)[]): string { return xs.filter(Boolean).join(" "); }
 function toFixed(n:number,d=6): string { return Number(n).toFixed(d); }
 function isAttr(a:any): a is Attribute { return a && typeof a === "object" && "ignition" in a; }
 function copy(text:string): void { navigator.clipboard?.writeText(text); }
 function toCSV(rows: LogRow[]): string {
  const header = ["srno","imei","speed","speed2","latitude","longitude","date","attribute"].join(",");
  const body = rows
    .map((r) => {
      const attr = typeof r.attribute === "string" ? r.attribute : JSON.stringify(r.attribute);
      const safe = attr.replaceAll('"', '""');
      return [r.srno, r.imei, r.speed, r.latitude, r.longitude, r.date, `"${safe}"`].join(",");
    })
    .join("\n");
  return header + "\n" + body;
 }
function fmt(dt?: string): string {
  if (!dt) return "—";
  const d = new Date(dt);
  return Number.isNaN(d.getTime()) ? "Invalid" : d.toLocaleString();
}

export default function VehicleLogsPage() {
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1); const PAGE_SIZE = 20;

  // DateTime range using MultiDateTimeRangePicker
  const presets = buildDefaultDateTimePresets();
  const today = presets.find((p) => p.key === "today")?.compute?.() || { from: null, to: null };
  const [dateRange, setDateRange] = useState<DateTimeRangeValue>(today);

  function inRange(dateISO: string): boolean {
    if (!dateRange.from && !dateRange.to) return true;
    const t = Date.parse(dateISO);
    const s = dateRange.from ? dateRange.from.getTime() : -Infinity;
    const e = dateRange.to ? dateRange.to.getTime() : Infinity;
    return s <= t && t <= e;
  }

  const filtered = useMemo<LogRow[]>(() => {
    const q = query.trim().toLowerCase();
    return LOGS.filter((r) => {
      if (!inRange(r.date)) return false;
      if (!q) return true;
      const hay = [r.imei, r.speed, r.latitude, r.longitude, r.date, JSON.stringify(r.attribute)].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [dateRange, query]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pages);
  const slice = useMemo<LogRow[]>(() => filtered.slice((safePage - 1) * PAGE_SIZE, (safePage - 1) * PAGE_SIZE + PAGE_SIZE), [filtered, safePage]);

  const handleExport = () => {
    const csv = toCSV(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `logs_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleEmail = () => {
    const csv = toCSV(filtered);
    const subject = encodeURIComponent("Vehicle GPS Logs Export");
    const body = encodeURIComponent(
      `Please find the vehicle GPS logs data below:\n\n${filtered.length} records exported at ${new Date().toLocaleString()}\n\nData:\n${csv.slice(0, 1000)}${csv.length > 1000 ? "\n...(truncated for email preview)" : ""}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight dark:text-neutral-100">Vehicle Logs</h1>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Generate and filter vehicle GPS logs</p>
          </div>
          <div className="flex flex-col  gap-3">
                        <label className="text-sm font-medium mb-2 block dark:text-neutral-100">Date & Time Range</label>
            <MultiDateTimeRangePicker
              value={dateRange}
              onChange={setDateRange}
              presets={presets}
            />
          </div>
        </div>

        {/* Search and DateTime Range in one row */}
        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block dark:text-neutral-100">Search</label>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-300" style={{ fontSize: 18 }} />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by IMEI, coordinates, attributes..."
                className="pl-10 dark:text-neutral-100 dark:placeholder-neutral-400"
              />
            </div>
          </div>
          <div className="lg:flex-1 flex gap-2">
            <Button onClick={handleExport} variant="outline" className="gap-2 flex-1">
              <FileDownloadIcon style={{ fontSize: 16 }} />
              Export CSV ({filtered.length})
            </Button>
            <Button onClick={handleEmail} variant="outline" className="gap-2 flex-1">
              <EmailIcon style={{ fontSize: 16 }} />
              Email
            </Button>
          </div>
        </div>

        {/* Results counter */}
        <div className="mt-3 text-sm text-neutral-600 dark:text-neutral-200">
          Showing {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Table */}
            <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-xs">
            <thead>
              <tr className="border-b dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-[10px] font-medium text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
                <th className="sticky left-0 z-20 w-12 bg-neutral-50 dark:bg-neutral-900 px-2 py-2 text-left">Sr</th>
                <th className="w-32 px-2 py-2 text-left">IMEI</th>
                <th className="w-16 px-2 py-2 text-left">Speed</th>
                <th className="w-24 px-2 py-2 text-left">Lat</th>
                <th className="w-24 px-2 py-2 text-left">Lon</th>
                <th className="w-32 px-2 py-2 text-left">Date</th>
                <th className="w-auto min-w-96 px-2 py-2 text-left">Attributes</th>
                <th className="sticky right-0 z-20 w-28 bg-neutral-50 dark:bg-neutral-900 px-2 py-2 text-right">Actions</th>
              </tr>
            </thead>
                        <tbody>
              {slice.length === 0 ? (
                <tr><td colSpan={9} className="py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">No logs found</td></tr>
              ) : (
                slice.map((row, idx) => <Row key={idx} row={row} idx={idx + (safePage - 1) * PAGE_SIZE} />)
              )}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-6 text-center text-sm text-neutral-500 dark:text-neutral-400">No results. Adjust your date range or search.</div>
          )}
        </div>
        {/* Footer */}
        <div className="flex items-center justify-between border-t dark:border-neutral-700 p-3 text-xs text-neutral-600 dark:text-neutral-200">
          <div>Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(filtered.length, safePage * PAGE_SIZE)} of {filtered.length}</div>
          <div className="flex items-center gap-2">
            <button disabled={safePage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className={cls("rounded border px-2 py-1", safePage <= 1 ? "text-neutral-400 dark:text-neutral-500 border-neutral-200 dark:border-neutral-700" : "border-neutral-300 dark:border-neutral-600 dark:text-neutral-100")}>Prev</button>
            <div>Page {safePage} / {pages}</div>
            <button disabled={safePage >= pages} onClick={() => setPage((p) => Math.min(pages, p + 1))} className={cls("rounded border px-2 py-1", safePage >= pages ? "text-neutral-400 dark:text-neutral-500 border-neutral-200 dark:border-neutral-700" : "border-neutral-300 dark:border-neutral-600 dark:text-neutral-100")}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ row, idx }: { row: LogRow; idx: number }) {
  const [open, setOpen] = useState<boolean>(false);
  const attr: Attribute | null = isAttr(row.attribute) ? row.attribute : (() => { try { return JSON.parse(String(row.attribute)); } catch { return null; } })();
  const coord = `${toFixed(row.latitude, 6)},${toFixed(row.longitude, 6)}`;
  const mapHref = `https://maps.google.com/?q=${row.latitude},${row.longitude}`;

  return (
    <>
      <tr className="border-b dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
        <td className="px-2 py-2 align-top text-neutral-700 dark:text-neutral-300 sticky left-0 bg-white dark:bg-neutral-800 text-xs">{row.srno}</td>
        <td className="px-2 py-2 align-top font-mono bg-white dark:bg-neutral-800 dark:text-neutral-300 text-[11px]">{row.imei}</td>
        <td className="px-2 py-2 align-top dark:text-neutral-300 text-xs"><span className="inline-flex items-center gap-0.5"><SpeedIcon style={{ fontSize: 12 }} />{row.speed}</span></td>
       <td className="px-2 py-2 align-top font-mono dark:text-neutral-300 text-[11px]">{toFixed(row.latitude, 6)}</td>
        <td className="px-2 py-2 align-top font-mono dark:text-neutral-300 text-[11px]">{toFixed(row.longitude, 6)}</td>
        <td className="px-2 py-2 align-top font-mono text-[10px] dark:text-neutral-300">{fmt(row.date)}</td>
        <td className="px-2 py-2 align-top">
          {attr ? (
            <div className="flex flex-wrap gap-0.5 text-[10px] text-neutral-700 dark:text-neutral-300">
              <Badge variant={attr.ignition ? "default" : "secondary"} className={`text-[9px] px-1.5 py-0 h-4 ${attr.ignition ? "bg-black dark:bg-white text-white dark:text-black" : ""}`}>ign: <span className="ml-0.5 font-medium">{attr.ignition ? "on" : "off"}</span></Badge>
              <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4">hb: <span className="ml-0.5 font-medium">{String(attr.heartbeat)}</span></Badge>
              {attr.batteryLevel !== undefined && <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4">bat: <span className="ml-0.5 font-medium">{attr.batteryLevel}%</span></Badge>}
              {attr.rssi !== undefined && <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4">rssi: <span className="ml-0.5 font-medium">{attr.rssi}</span></Badge>}
              {attr.distance !== undefined && <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4">dist: <span className="ml-0.5 font-medium">{(attr.distance as any)?.toFixed ? (attr.distance as any).toFixed(1) : String(attr.distance)}</span></Badge>}
              {attr.totalDistance !== undefined && <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4">total: <span className="ml-0.5 font-medium">{(attr.totalDistance / 1000).toFixed(0)}km</span></Badge>}
              {attr.motion !== undefined && <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4">mot: <span className="ml-0.5 font-medium">{String(attr.motion)}</span></Badge>}
              {attr.hours !== undefined && <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4">hrs: <span className="ml-0.5 font-medium">{String(attr.hours)}</span></Badge>}
            </div>
          ) : (
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400">Invalid JSON</span>
          )}
        </td>
        <td className="px-2 py-2 align-top text-right sticky right-0 bg-white dark:bg-neutral-800">
          <div className="inline-flex items-center gap-0.5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" title="Copy" className="h-6 w-6">
                  <ContentCopyIcon style={{ fontSize: 12 }} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 dark:bg-neutral-800 dark:border-neutral-700 text-xs">
                <DropdownMenuItem onClick={() => copy(row.imei)} className="text-xs">Copy IMEI</DropdownMenuItem>
                <DropdownMenuItem onClick={() => copy(coord)} className="text-xs">Copy Lat,Lng</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => copy(JSON.stringify(row))} className="text-xs">Copy JSON</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button asChild variant="outline" size="icon" title="Open in Maps" className="h-6 w-6">
              <a href={mapHref} target="_blank" rel="noreferrer"><MapIcon style={{ fontSize: 12 }} /></a>
            </Button>
            <Button variant="outline" size="icon" title="Details" onClick={() => setOpen((v) => !v)} className="h-6 w-6">{open ? <ExpandLessIcon style={{ fontSize: 12 }} /> : <ExpandMoreIcon style={{ fontSize: 12 }} />}</Button>
          </div>
        </td>
      </tr>
      {open && (
        <tr className="border-b dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/50">
          <td colSpan={8} className="px-2 pb-3 pt-1">
            <div className="rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-800 p-2">
              <div className="text-[10px] text-neutral-600 dark:text-neutral-400 font-medium mb-1">Raw Attribute JSON</div>
              <pre className="max-h-48 overflow-auto rounded border border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-900 p-2 text-[10px] dark:text-neutral-200 font-mono leading-relaxed">{typeof row.attribute === "string" ? row.attribute : JSON.stringify(row.attribute, null, 2)}</pre>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
