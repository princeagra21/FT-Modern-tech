import { CalendarEvent, DayAgg, EventKind } from "@/lib/types/superadmin";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import NewReleasesIcon from "@mui/icons-material/NewReleases";

export function startOfMonth(d: Date) {
  const x = new Date(d);
  x.setDate(1);
  x.setHours(0, 0, 0, 0);
  return x;
}
export function endOfMonth(d: Date) {
  const x = new Date(d);
  x.setMonth(x.getMonth() + 1, 0);
  x.setHours(23, 59, 59, 999);
  return x;
}
export function startOfWeek(d: Date) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // Monday=0
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
}
export function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
export function fmtMonthLabel(d: Date) {
  return d.toLocaleString(undefined, { month: "long", year: "numeric" });
}
export function fmtDay(d: Date) {
  return d.getDate();
}
export function toDate(iso: string) {
  return new Date(iso);
}

export function emptyAgg(): DayAgg {
  return {
    total: 0,
    ADMIN_CREATED: 0,
    USER_CREATED: 0,
    VEHICLE_EXPIRY: 0,
    VEHICLE_ADDED: 0,
  };
}
export function aggMonth(events: CalendarEvent[]): Map<string, DayAgg> {
  const m = new Map<string, DayAgg>();
  for (const ev of events) {
    const key = ev.at.slice(0, 10);
    const a = m.get(key) || emptyAgg();
    a.total += 1;
    (a as any)[ev.kind] += 1;
    m.set(key, a);
  }
  return m;
}
export function densityClass(total: number, max: number) {
  // 5 bucket grayscale density (no color): 0, 1–4, 5–9, 10–19, 20+
  if (total === 0) return "bg-white dark:bg-neutral-800";
  const r = max || total;
  const pct = total / Math.max(1, r);
  if (total >= 20 || pct > 0.8) return "bg-neutral-300 dark:bg-neutral-500"; // darkest allowed
  if (total >= 10 || pct > 0.5) return "bg-neutral-200 dark:bg-neutral-600";
  if (total >= 5 || pct > 0.25) return "bg-neutral-100 dark:bg-neutral-700";
  return "bg-neutral-50 dark:bg-neutral-750";
}

export function kindIcon(k: EventKind) {
  const size = { fontSize: 14 } as const;
  if (k === "ADMIN_CREATED") return <AdminPanelSettingsIcon style={size} />;
  if (k === "USER_CREATED") return <PersonAddAltIcon style={size} />;
  if (k === "VEHICLE_EXPIRY") return <NewReleasesIcon style={size} />;
  return <DirectionsCarFilledIcon style={size} />; // VEHICLE_ADDED
}

export function kindLabel(k: EventKind) {
  return k === "ADMIN_CREATED"
    ? "Admin Created"
    : k === "USER_CREATED"
    ? "User Created"
    : k === "VEHICLE_EXPIRY"
    ? "Vehicle Expiry"
    : "Vehicle Added";
}

export function dotClass(k: EventKind) {
  // Monochrome variants by border/neutral shades
  return k === "ADMIN_CREATED"
    ? "bg-black dark:bg-white"
    : k === "USER_CREATED"
    ? "bg-neutral-700 dark:bg-neutral-300"
    : k === "VEHICLE_EXPIRY"
    ? "border border-black dark:border-white"
    : "bg-neutral-400 dark:bg-neutral-500"; // VEHICLE_ADDED
}
