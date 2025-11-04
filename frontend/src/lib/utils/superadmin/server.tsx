import { FirebaseInfo, Health, Metrics, PgInfo, QueueInfo, RedisInfo, Service, SocketInfo } from "@/lib/types/superadmin";

export async function apiHealth(): Promise<Health> { 
  await delay(150); 
  return { ok: true, uptimeSec: 482_345, version: "v1.10.0", startedAt: new Date(Date.now()-482_345*1000).toISOString() }; 
}

export async function apiMetrics(): Promise<Metrics> { 
  await delay(150); 
  return { cpu: 41, mem: 63, disk: 72, load1: 0.52, load5: 0.61, load15: 0.73 }; 
}

export async function apiPg(): Promise<PgInfo> { 
  await delay(180); 
  return { dbName: "fleetstack", sizeBytes: 92_345_876_543, connections: 38, deadTuples: 120_000 }; 
}

export async function apiRedis(): Promise<RedisInfo> { 
  await delay(180); 
  return { connected: true, usedMemoryBytes: 1_024_000_000, hitRate: 0.91, keys: 785_123 }; 
}

export async function apiSocket(): Promise<SocketInfo> { 
  await delay(160); 
  return { clients: 1_420, rooms: 220, eventsPerSec: 340 }; 
}

export async function apiQueues(): Promise<QueueInfo[]> { 
  await delay(160); 
  return [
    { name: "ingest", waiting: 42, active: 6, delayed: 3, failed: 1, paused: false },
    { name: "notifications", waiting: 0, active: 0, delayed: 0, failed: 0, paused: true },
    { name: "geocoder", waiting: 12, active: 2, delayed: 1, failed: 0, paused: false },
  ]; 
}

export async function apiFirebase(): Promise<FirebaseInfo> { 
  await delay(160); 
  return { fcmReachable: true, lastPingISO: new Date(Date.now()-90_000).toISOString() }; 
}

export async function apiServices(): Promise<Service[]> { 
  await delay(170); 
  return [
    { id: "api", name: "HTTP API", status: "running", sinceISO: new Date(Date.now()-3600_000).toISOString() },
    { id: "ingest", name: "Device Ingest", status: "running", sinceISO: new Date(Date.now()-6*3600_000).toISOString() },
    { id: "socket", name: "WebSocket", status: "degraded", sinceISO: new Date(Date.now()-1800_000).toISOString() },
    { id: "jobs", name: "Background Jobs", status: "running", sinceISO: new Date(Date.now()-24*3600_000).toISOString() },
    { id: "notify", name: "Notifications", status: "stopped", sinceISO: new Date(Date.now()-5*60_000).toISOString() },
    { id: "redis", name: "Redis", status: "running", sinceISO: new Date(Date.now()-2*3600_000).toISOString() },
  ]; 
}

export async function apiRestartService(id: string) { 
  await delay(350); 
  return { ok: true }; 
}

export async function apiRestartServer() { 
  await delay(600); 
  return { ok: true }; 
}

export async function apiClearCache() { 
  await delay(300); 
  return { ok: true }; 
}

export async function apiDeleteData(fromISO?: string, toISO?: string) { 
  await delay(550); 
  return { ok: true, deleted: 18_450 } as const; 
}

export async function apiDiagnostics() { 
  await delay(600); 
  return { ok: true, href: "#" } as const; 
}

export function delay(ms: number) { 
  return new Promise(r => setTimeout(r, ms)); 
}

// ---- Utils ----
export function cls(...xs: (string | false | undefined)[]) { 
  return xs.filter(Boolean).join(" "); 
}

export function humanBytes(n: number) { 
  const u = ["B", "KB", "MB", "GB", "TB"]; 
  let i = 0, x = n; 
  while (x >= 1024 && i < u.length - 1) { 
    x /= 1024; 
    i++; 
  } 
  return `${x.toFixed(x >= 10 ? 0 : 1)} ${u[i]}`; 
}

export function humanTime(sec: number) { 
  const d = Math.floor(sec / 86400); 
  const h = Math.floor((sec % 86400) / 3600); 
  const m = Math.floor((sec % 3600) / 60); 
  const s = Math.floor(sec % 60); 
  return `${d}d ${h}h ${m}m ${s}s`; 
}


export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4 dark:bg-foreground/5">
      {children}
    </div>
  );
}

export function MiniCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-3 dark:bg-foreground/5">
      <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-foreground">
        {icon}
        {title}
      </div>
      <div className="space-y-1 text-sm text-foreground">{children}</div>
    </div>
  );
}

export function KV({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] text-muted">{label}</span>
      <span className="text-[12px] font-medium text-foreground">{value}</span>
    </div>
  );
}

export function Metric({
  label,
  value,
  suffix,
  icon,
}: {
  label: string;
  value: number;
  suffix?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-3">
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-muted">{label}</span>
        <span className="inline-flex items-center gap-1 text-foreground">
          {icon}
          {value}
          {suffix}
        </span>
      </div>
      <Bar pct={value} />
    </div>
  );
}


// ---- Mock API ----

export function Bar({ pct }: { pct: number }) {
  return (
    <div className="h-2 w-full rounded bg-primary/40">
      <div
        className="h-2 rounded bg-primary"
        style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
      />
    </div>
  );
}
