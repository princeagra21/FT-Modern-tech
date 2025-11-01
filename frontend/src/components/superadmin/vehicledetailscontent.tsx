import React, { useMemo } from "react";
import { motion } from "framer-motion";
// Material Icons
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import SpeedIcon from "@mui/icons-material/Speed";
import TimelineIcon from "@mui/icons-material/Timeline";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PersonIcon from "@mui/icons-material/Person";
import VerifiedIcon from "@mui/icons-material/Verified";
import RouteIcon from "@mui/icons-material/Route";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import KeyIcon from "@mui/icons-material/Key";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";

// ---- Types ----
type Vehicledatatype = {
  id: string;
  vehicleNo: string;
  imei: string;
  vin: string;
  status: "running" | "idle" | "stop";
  speed: number;
  vehicleType: { name: string };
  deviceType: { name: string };
  lastUpdate: string; // ISO
  primaryUser: {
    name: string;
    email: string;
    mobilePrefix: string;
    mobile: string;
    isEmailVerified: boolean;
    profileUrl: string;
    username: string;
  };
  addedBy: {
    name: string;
    email: string;
    mobilePrefix: string;
    mobile: string;
    isEmailVerified: boolean;
    profileUrl: string;
    username: string;
  };
  primaryExpiry: string; // YYYY-MM-DD
  secondaryExpiry: string; // YYYY-MM-DD
  createdAt: string; // ISO
  ignition: boolean;
  engineHour: number;
  odometer: number;
  gmt: string;
  parking: boolean;
  isActive: boolean;
  vehicleMeta?: { [k: string]: any };
  coords?: { lat: number; lon: number };
  deviceAttributes?: Record<string, any>;
};

interface VehicleDetailsPreviewProps {
  data: Vehicledatatype;
}

// ---- Helpers ----
function timeAgo(iso: string) {
  const d = new Date(iso).getTime();
  const diff = Math.max(0, Date.now() - d);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
function daysLeft(dateStr: string) {
  const end = new Date(dateStr + "T00:00:00").getTime();
  const diff = end - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
function pctBetween(nowIso: string, endStr: string, startIso: string) {
  const now = new Date(nowIso).getTime();
  const start = new Date(startIso).getTime();
  const end = new Date(endStr + "T00:00:00").getTime();
  if (end <= start) return 100;
  const pct = ((now - start) / (end - start)) * 100;
  return Math.max(0, Math.min(100, Math.round(pct)));
}
function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
}
function copy(val: string) {
  navigator.clipboard?.writeText(val);
}

// ---- Atoms ----
const StatusBadge = ({ status }: { status: Vehicledatatype["status"] }) => {
  const map = {
    running: { label: "RUNNING", style: "bg-black text-white dark:bg-white dark:text-black" },
    idle: { label: "IDLE", style: "bg-white text-black border border-black dark:bg-neutral-800 dark:text-white dark:border-white" },
    stop: { label: "STOP", style: "bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white" },
  } as const;
  const s = map[status] ?? map.idle;
  return (
    <span className={`inline-flex items-center rounded-sm px-2 py-0.5 text-[10px] tracking-widest ${s.style}`}>
      {s.label}
    </span>
  );
};

const Dot = ({ on }: { on: boolean }) => (
  <span className={`inline-block h-2 w-2 rounded-full border border-black dark:border-white ${on ? "bg-black dark:bg-white" : "bg-white dark:bg-neutral-800"}`} />
);

const KV = ({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) => (
  <div className="flex items-start justify-between gap-4 py-2">
    <span className="text-xs text-neutral-500 dark:text-neutral-400">{label}</span>
    <span className={`text-sm dark:text-neutral-100 ${mono ? "font-mono" : ""}`}>{value}</span>
  </div>
);

const Pill = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => (
  <div className="flex items-center gap-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 shadow-sm">
    <div className="grid h-8 w-8 place-items-center rounded-lg border border-neutral-300 dark:border-neutral-600 dark:text-neutral-100">{icon}</div>
    <div className="leading-tight">
      <div className="text-[10px] tracking-widest text-neutral-500 dark:text-neutral-400">{label}</div>
      <div className="text-sm font-medium dark:text-neutral-100">{value}</div>
    </div>
  </div>
);

const SectionTitle = ({ icon, title, hint }: { icon: React.ReactNode; title: string; hint?: string }) => (
  <div className="mb-3 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="grid h-7 w-7 place-items-center rounded-md border border-neutral-300 dark:border-neutral-600 dark:text-neutral-100">{icon}</div>
      <h3 className="text-sm font-semibold dark:text-neutral-100">{title}</h3>
    </div>
    {hint ? <span className="text-xs text-neutral-400 dark:text-neutral-500">{hint}</span> : null}
  </div>
);

const Avatar = ({ src, alt, fallback }: { src: string; alt: string; fallback: string }) => (
  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border dark:border-neutral-600 bg-white dark:bg-neutral-700 text-sm font-semibold dark:text-neutral-100">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    {src ? <img src={src} alt={alt} className="h-full w-full object-cover" /> : fallback}
  </div>
);


// ---- Main (Vehicle-details focused) ----
export default function VehicleDetailsPreview({ data }: VehicleDetailsPreviewProps) {
  const v = data;
  const primaryDaysLeft = useMemo(() => daysLeft(v.primaryExpiry), [v.primaryExpiry]);
  const secondaryDaysLeft = useMemo(() => daysLeft(v.secondaryExpiry), [v.secondaryExpiry]);
  const progressPrimary = useMemo(() => pctBetween(v.lastUpdate, v.primaryExpiry, v.createdAt), [v]);
  const progressSecondary = useMemo(() => pctBetween(v.lastUpdate, v.secondaryExpiry, v.createdAt), [v]);

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6">
      {/* Sticky Summary Bar */}
      <div className="sticky top-0 z-10 -mx-4 mb-4 border-b border-neutral-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-800/70 px-4 py-3 backdrop-blur">
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 dark:text-neutral-100"><DirectionsCarIcon fontSize="small" /></div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold dark:text-neutral-100">{v.vehicleNo}</span>
                <StatusBadge status={v.status} />
                <span className="rounded-sm border border-black dark:border-white px-1.5 py-0.5 text-[10px] tracking-widest dark:text-neutral-100">{v.deviceType.name}</span>
                <span className="rounded-sm border border-black dark:border-white px-1.5 py-0.5 text-[10px] tracking-widest dark:text-neutral-100">{v.vehicleType.name}</span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                <span>Last: {timeAgo(v.lastUpdate)}</span>
                <span className="text-neutral-300 dark:text-neutral-600">•</span>
                <span><SpeedIcon style={{fontSize:12}}/> {v.speed} km/h</span>
                <span className="text-neutral-300 dark:text-neutral-600">•</span>
                <span>Ignition <Dot on={v.ignition} /></span>
                {v.coords && (<>
                  <span className="text-neutral-300 dark:text-neutral-600">•</span>
                  <span className="font-mono">{v.coords.lat.toFixed(4)}, {v.coords.lon.toFixed(4)}</span>
                </>)}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
             <button className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-xs dark:text-neutral-100"><DownloadOutlinedIcon style={{fontSize:16}}/> Download</button>
            <button className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-xs dark:text-neutral-100"><EmailOutlinedIcon style={{fontSize:16}}/> Email</button>
           
          </div>
        </div>
      </div>

      {/* Telemetry ribbon */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Pill icon={<SpeedIcon fontSize="small" />} label="SPEED" value={`${v.speed} km/h`} />
        <Pill icon={<PowerSettingsNewIcon fontSize="small" />} label="IGNITION" value={<Dot on={v.ignition} />} />
        <Pill icon={<TimelineIcon fontSize="small" />} label="ENGINE HOURS" value={`${v.engineHour.toFixed(1)} h`} />
        <Pill icon={<RouteIcon fontSize="small" />} label="ODOMETER" value={`${v.odometer.toLocaleString()} km`} />
      </div>

          {/* Identifiers & Quick Actions */}
      <div className="mt-6 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-4">
        <SectionTitle icon={<InfoOutlinedIcon fontSize="small"/>} title="Identifiers" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-900 p-3">
            <div className="text-xs text-neutral-500 dark:text-neutral-400">VIN</div>
            <div className="mt-1 flex items-center justify-between font-mono text-sm dark:text-neutral-100">{v.vin}
              <button onClick={() => copy(v.vin)} className="rounded border dark:border-neutral-600 px-1.5 py-0.5 text-[11px] dark:text-neutral-100"><ContentCopyIcon fontSize="inherit"/></button>
            </div>
          </div>
          <div className="rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-900 p-3">
            <div className="text-xs text-neutral-500 dark:text-neutral-400">IMEI</div>
            <div className="mt-1 flex items-center justify-between font-mono text-sm dark:text-neutral-100">{v.imei}
              <button onClick={() => copy(v.imei)} className="rounded border dark:border-neutral-600 px-1.5 py-0.5 text-[11px] dark:text-neutral-100"><ContentCopyIcon fontSize="inherit"/></button>
            </div>
          </div>
          <div className="rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-900 p-3">
            <div className="text-xs text-neutral-500 dark:text-neutral-400">Timezone</div>
            <div className="mt-1 text-sm dark:text-neutral-100">{v.gmt}</div>
          </div>
        </div>
      </div>

      {/* Vehicle Meta — Separated Attributes */}
      <div className="mt-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-4">
        <SectionTitle icon={<InfoOutlinedIcon fontSize="small"/>} title="Vehicle Meta" hint="Vehicle Attributes" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-900 p-3">
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Fuel Type</div>
            <div className="text-sm font-medium uppercase dark:text-neutral-100">
              {v.vehicleMeta?.fuelType ? String(v.vehicleMeta.fuelType) : "N/A"}
            </div>
          </div>
          <div className="rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-900 p-3">
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Axle Count</div>
            <div className="text-sm font-medium dark:text-neutral-100">
              {Number.isFinite(v.vehicleMeta?.axleCount) 
                ? `${v.vehicleMeta?.axleCount} ${v.vehicleMeta?.axleCount === 1 ? "Axle" : "Axles"}`
                : "—"}
            </div>
          </div>
          <div className="rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-900 p-3">
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">GPS Module</div>
            <div className="text-sm font-medium dark:text-neutral-100">
              {v.vehicleMeta?.gpsModule ? `v${v.vehicleMeta.gpsModule}` : "—"}
            </div>
          </div>
          <div className="rounded-lg border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-900 p-3">
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Custom Color</div>
            <div className="text-sm font-medium capitalize dark:text-neutral-100">
              {v.vehicleMeta?.customColor ? String(v.vehicleMeta.customColor).replace(/-/g, " ") : "—"}
            </div>
          </div>
        </div>
      </div>

      {/* Health & Power & Subscription */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-4">
          <SectionTitle icon={<GpsFixedIcon fontSize="small"/>} title="Signal & Fix" />
          <KV label="Satellites" value={<span className="font-mono">{v.deviceAttributes?.satellites ?? "—"}</span>} />
          <KV label="HDOP" value={<span className="font-mono">{v.deviceAttributes?.hdop ?? "—"}</span>} />
          <KV label="Fix" value={<Dot on={!!v.deviceAttributes?.fix} />} />
          <div className="mt-2 h-2 w-full overflow-hidden rounded bg-neutral-200 dark:bg-neutral-700">
            <motion.div className="h-full bg-black dark:bg-white" initial={{width:0}} animate={{width: `${Math.min(100, (v.deviceAttributes?.satellites ?? 0) * 8)}%`}} transition={{duration:0.6}} />
          </div>
        </div>
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-4">
          <SectionTitle icon={<ShieldOutlinedIcon fontSize="small"/>} title="Power & Battery" />
          <KV label="Battery (V)" value={<span className="font-mono">{v.deviceAttributes?.batteryVoltage ?? "—"}</span>} />
          <KV label="External (V)" value={<span className="font-mono">{v.deviceAttributes?.externalPower ?? "—"}</span>} />
          <KV label="Signal" value={<span className="capitalize">{String(v.deviceAttributes?.signal ?? "—")}</span>} />
          <div className="mt-2 h-2 w-full overflow-hidden rounded bg-neutral-200 dark:bg-neutral-700">
            <motion.div className="h-full bg-black dark:bg-white" initial={{width:0}} animate={{width: `${Math.min(100, (v.deviceAttributes?.batteryVoltage ?? 0) * 8)}%`}} transition={{duration:0.6}} />
          </div>
        </div>
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-4">
          <SectionTitle icon={<KeyIcon fontSize="small"/>} title="Subscription" />
          <div className="mb-2 flex items-center justify-between text-xs"><span className="text-neutral-500 dark:text-neutral-400">Primary</span><span className="font-mono dark:text-neutral-100">{v.primaryExpiry}</span></div>
          <div className="h-2 w-full overflow-hidden rounded bg-neutral-200 dark:bg-neutral-700"><motion.div className="h-full bg-black dark:bg-white" initial={{width:0}} animate={{width: `${progressPrimary}%`}} transition={{duration:0.6}}/></div>
          <div className="mt-2 text-xs text-neutral-600 dark:text-neutral-300">{primaryDaysLeft} days remaining</div>
          <div className="mt-4 mb-2 flex items-center justify-between text-xs"><span className="text-neutral-500 dark:text-neutral-400">Secondary</span><span className="font-mono dark:text-neutral-100">{v.secondaryExpiry}</span></div>
          <div className="h-2 w-full overflow-hidden rounded bg-neutral-200 dark:bg-neutral-700"><motion.div className="h-full bg-black dark:bg-white" initial={{width:0}} animate={{width: `${progressSecondary}%`}} transition={{duration:0.6, delay:0.1}}/></div>
          <div className="mt-2 text-xs text-neutral-600 dark:text-neutral-300">{secondaryDaysLeft} days remaining</div>
        </div>
      </div>

      {/* Ownership & Activity */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-[7fr_3fr] gap-4">
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-4">
          <SectionTitle icon={<PersonIcon fontSize="small"/>} title="People" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-600 p-3">
              <div className="mb-2 text-xs text-neutral-500 dark:text-neutral-400">Primary User</div>
              <div className="flex items-center gap-3">
                <Avatar src={v.primaryUser.profileUrl} alt={v.primaryUser.name} fallback={initials(v.primaryUser.name)} />
                <div className="min-w-0">
                  <div className="flex items-center gap-1"><div className="truncate text-sm font-medium dark:text-neutral-100">{v.primaryUser.name}</div>{v.primaryUser.isEmailVerified && <VerifiedIcon fontSize="small"/>}</div>
                  <div className="truncate text-xs text-neutral-500 dark:text-neutral-400">{v.primaryUser.email}</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">{v.primaryUser.mobilePrefix} {v.primaryUser.mobile} • @{v.primaryUser.username}</div>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-600 p-3">
              <div className="mb-2 text-xs text-neutral-500 dark:text-neutral-400">Added By</div>
              <div className="flex items-center gap-3">
                <Avatar src={v.addedBy.profileUrl} alt={v.addedBy.name} fallback={initials(v.addedBy.name)} />
                <div className="min-w-0">
                  <div className="flex items-center gap-1"><div className="truncate text-sm font-medium dark:text-neutral-100">{v.addedBy.name}</div>{v.addedBy.isEmailVerified && <VerifiedIcon fontSize="small"/>}</div>
                  <div className="truncate text-xs text-neutral-500 dark:text-neutral-400">{v.addedBy.email}</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">{v.addedBy.mobilePrefix} {v.addedBy.mobile} • @{v.addedBy.username}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-4">
          <SectionTitle icon={<ReceiptLongIcon fontSize="small"/>} title="Recent Events" />
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between"><span className="text-neutral-700 dark:text-neutral-200">Location ping</span><span className="text-xs text-neutral-500 dark:text-neutral-400">{timeAgo(v.lastUpdate)}</span></li>
            <li className="flex items-center justify-between"><span className="text-neutral-700 dark:text-neutral-200">Ignition {v.ignition ? "ON" : "OFF"}</span><span className="text-xs text-neutral-500 dark:text-neutral-400">~</span></li>
            <li className="flex items-center justify-between"><span className="text-neutral-700 dark:text-neutral-200">Speed updated</span><span className="text-xs text-neutral-500 dark:text-neutral-400">~</span></li>
          </ul>
        </div>
      </div>

  
    </div>
  );
}
