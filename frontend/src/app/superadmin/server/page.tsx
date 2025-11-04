"use client";
import React, { useEffect, useMemo, useState } from "react";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import RefreshIcon from "@mui/icons-material/Refresh";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import StorageIcon from "@mui/icons-material/Storage";
import MemoryIcon from "@mui/icons-material/Memory";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import WifiIcon from "@mui/icons-material/Wifi";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import BoltIcon from "@mui/icons-material/Bolt";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import SpeedIcon from "@mui/icons-material/Speed";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  MultiDateRangePicker,
  DateRangeValue,
} from "@/components/common/multidateselection";
import {
  FirebaseInfo,
  Health,
  Metrics,
  PgInfo,
  QueueInfo,
  RedisInfo,
  Service,
  SocketInfo,
} from "@/lib/types/superadmin";
import {
  apiClearCache,
  apiDeleteData,
  apiDiagnostics,
  apiFirebase,
  apiHealth,
  apiMetrics,
  apiPg,
  apiQueues,
  apiRedis,
  apiRestartServer,
  apiRestartService,
  apiServices,
  apiSocket,
  Card,
  cls,
  humanBytes,
  humanTime,
  KV,
  Metric,
  MiniCard,
} from "@/lib/utils/superadmin/server";
import StatusBadge from "@/components/common/StatusBadge";

// ---- Component ----
export default function ServerStatusPage() {
  const [health, setHealth] = useState<Health | null>(null);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [pg, setPg] = useState<PgInfo | null>(null);
  const [redis, setRedis] = useState<RedisInfo | null>(null);
  const [socket, setSocket] = useState<SocketInfo | null>(null);
  const [queues, setQueues] = useState<QueueInfo[]>([]);
  const [firebase, setFirebase] = useState<FirebaseInfo | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [banner, setBanner] = useState("");
  const [dateRange, setDateRange] = useState<DateRangeValue>({
    from: null,
    to: null,
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [h, m, pgI, rd, so, qu, fcm, svc] = await Promise.all([
        apiHealth(),
        apiMetrics(),
        apiPg(),
        apiRedis(),
        apiSocket(),
        apiQueues(),
        apiFirebase(),
        apiServices(),
      ]);
      if (!alive) return;
      setHealth(h);
      setMetrics(m);
      setPg(pgI);
      setRedis(rd);
      setSocket(so);
      setQueues(qu);
      setFirebase(fcm);
      setServices(svc);
    })();
    const t = setInterval(async () => {
      const [m2, so2] = await Promise.all([apiMetrics(), apiSocket()]);
      setMetrics(m2);
      setSocket(so2);
    }, 15_000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  const overall = useMemo(() => {
    const svcUp = services.every((s) => s.status !== "stopped");
    const anyDegraded = services.some((s) => s.status === "degraded");
    const depsOk =
      (redis?.connected ?? false) && (firebase?.fcmReachable ?? false);
    if (svcUp && depsOk && !anyDegraded) return "Operational";
    if (!svcUp) return "Down";
    return "Degraded";
  }, [services, redis, firebase]);

  return (
    <div className="mx-auto max-w-7xl p-4 md:p-6">
      {/* Top controls */}
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Server Status
          </h1>
          <p className="mt-1 text-[12px] text-muted">
            Monitor and manage server infrastructure
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-xl">
                <PowerSettingsNewIcon className="mr-2 h-4 w-4" />
                Server Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-64 bg-popover text-foreground border-border"
            >
              <DropdownMenuItem
                onClick={async () => {
                  setBanner("Clearing cache…");
                  const r = await apiClearCache();
                  setBanner(r.ok ? "Cache cleared" : "Failed to clear cache");
                }}
              >
                Clear Cache
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  setBanner("Restarting server…");
                  const r = await apiRestartServer();
                  setBanner(
                    r.ok ? "Server reboot triggered" : "Server restart failed"
                  );
                }}
              >
                Restart Server
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {services.map((s) => (
                <DropdownMenuItem
                  key={s.id}
                  onClick={async () => {
                    setBanner(`Restarting ${s.name}…`);
                    const r = await apiRestartService(s.id);
                    setBanner(
                      r.ok
                        ? `${s.name} restarted`
                        : `Failed to restart ${s.name}`
                    );
                  }}
                >
                  Restart {s.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            onClick={async () => {
              setBanner("Refreshing…");
              const [h, m, pgI, rd, so, qu, fcm, svc] = await Promise.all([
                apiHealth(),
                apiMetrics(),
                apiPg(),
                apiRedis(),
                apiSocket(),
                apiQueues(),
                apiFirebase(),
                apiServices(),
              ]);
              setHealth(h);
              setMetrics(m);
              setPg(pgI);
              setRedis(rd);
              setSocket(so);
              setQueues(qu);
              setFirebase(fcm);
              setServices(svc);
              setBanner("Data reloaded");
            }}
          >
            <RefreshIcon className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {banner && (
        <div className="mb-4 rounded-xl border border-neutral-300 bg-white p-3 text-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200">
          <InfoOutlinedIcon className="mr-2 align-[-2px]" />
          {banner}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        {/* LEFT: 9 cols with PG */}
        <div className="md:col-span-9 space-y-4">
          {/* Overview */}
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {overall === "Operational" && (
                  <CheckCircleIcon className="text-success" />
                )}
                {overall === "Degraded" && (
                  <ErrorOutlineIcon className="text-warning" />
                )}
                {overall === "Down" && (
                  <ErrorOutlineIcon className="text-error" />
                )}
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted">
                    Overall
                  </div>
                  <div className="text-xl font-semibold text-foreground">
                    {overall}
                  </div>
                </div>
              </div>
              <div className="text-right text-sm text-muted">
                <div>Uptime {health ? humanTime(health.uptimeSec) : "—"}</div>
                <div className="text-muted">
                  Started{" "}
                  {health ? new Date(health.startedAt).toLocaleString() : "—"}
                </div>
              </div>
            </div>

            <Separator className="my-3" />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Metric
                label="CPU"
                value={metrics?.cpu ?? 0}
                suffix="%"
                icon={<MemoryIcon />}
              />
              <Metric
                label="Memory"
                value={metrics?.mem ?? 0}
                suffix="%"
                icon={<SpeedIcon />}
              />
              <Metric
                label="Disk"
                value={metrics?.disk ?? 0}
                suffix="%"
                icon={<StorageIcon />}
              />
            </div>

            <div className="mt-3 text-xs text-muted">
              Load avg: {metrics?.load1 ?? "—"} / {metrics?.load5 ?? "—"} /{" "}
              {metrics?.load15 ?? "—"}
            </div>
          </Card>

          {/* PostgreSQL */}
          <Card>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StorageIcon className="text-foreground" />
                <div className="font-semibold text-foreground">PostgreSQL</div>
              </div>
              <Badge variant="secondary">{pg?.dbName ?? "—"}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm text-foreground">
              <KV label="Size" value={pg ? humanBytes(pg.sizeBytes) : "—"} />
              <KV label="Connections" value={pg?.connections ?? "—"} />
              {pg?.deadTuples !== undefined && (
                <KV
                  label="Dead tuples"
                  value={pg.deadTuples.toLocaleString()}
                />
              )}
            </div>

            <Separator className="my-3" />

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="border-border text-foreground hover:bg-primary hover:text-background"
                onClick={async () => {
                  setBanner("Refreshing PostgreSQL…");
                  const d = await apiPg();
                  setPg(d);
                  setBanner("PostgreSQL updated");
                }}
              >
                <RefreshIcon className="mr-2 h-4 w-4" />
                Refresh
              </Button>

              <Button
                variant="outline"
                className="border-border text-foreground hover:bg-primary hover:text-background"
                onClick={() => setBanner("Scheduled VACUUM ANALYZE")}
              >
                Vacuum
              </Button>

              <Button
                variant="outline"
                className="border-border text-foreground hover:bg-primary hover:text-background"
                onClick={async () => {
                  setBanner("Exporting diagnostics…");
                  const r = await apiDiagnostics();
                  setBanner(
                    r.ok
                      ? "Diagnostics export ready"
                      : "Diagnostics export failed"
                  );
                }}
              >
                <FileDownloadIcon className="mr-2 h-4 w-4" />
                Diagnostics
              </Button>
            </div>
          </Card>

          {/* Services */}
          <Card>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CloudDoneIcon className="text-foreground" />
                <div className="font-semibold text-foreground">Services</div>
              </div>
              <Badge variant="secondary">
                {services.filter((s) => s.status === "running").length}/
                {services.length} running
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <div
                  key={s.id}
                  className={cls(
                    "rounded-2xl border p-3 transition",
                    s.status === "running"
                      ? "border-border bg-background"
                      : "border-border/50 bg-foreground/10"
                  )}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="font-medium text-foreground">{s.name}</div>
                    <Badge
                      className={cls(
                        "capitalize",
                        s.status === "running"
                          ? "bg-success text-background"
                          : "bg-error text-background"
                      )}
                    >
                      {s.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted">
                    <div>since {new Date(s.sinceISO).toLocaleString()}</div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border text-foreground hover:bg-primary hover:text-background"
                      onClick={async () => {
                        setBanner(`Restarting ${s.name}…`);
                        const r = await apiRestartService(s.id);
                        setBanner(
                          r.ok
                            ? `${s.name} restarted`
                            : `Failed to restart ${s.name}`
                        );
                      }}
                    >
                      Restart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Realtime: Redis + Socket.io */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <div className="mb-2 flex items-center gap-2">
                <MemoryIcon className="text-foreground" />
                <div className="font-semibold text-foreground">Redis</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-foreground">
                <KV
                  label="State"
                  value={redis?.connected ? "connected" : "down"}
                />
                <KV
                  label="Used"
                  value={redis ? humanBytes(redis.usedMemoryBytes) : "—"}
                />
                <KV
                  label="Hit rate"
                  value={redis ? `${Math.round(redis.hitRate * 100)}%` : "—"}
                />
                <KV
                  label="Keys"
                  value={redis ? redis.keys.toLocaleString() : "—"}
                />
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border text-foreground hover:bg-primary hover:text-background"
                  onClick={async () => {
                    setBanner("Restarting Redis…");
                    const r = await apiRestartService("redis");
                    setBanner(
                      r.ok ? "Redis restarted" : "Redis restart failed"
                    );
                  }}
                >
                  Restart Redis
                </Button>
              </div>
            </Card>

            <Card>
              <div className="mb-2 flex items-center gap-2">
                <WifiIcon className="text-foreground" />
                <div className="font-semibold text-foreground">Socket.io</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm text-foreground">
                <KV
                  label="Clients"
                  value={socket ? socket.clients.toLocaleString() : "—"}
                />
                <KV
                  label="Rooms"
                  value={socket ? socket.rooms.toLocaleString() : "—"}
                />
                <KV
                  label="Events/sec"
                  value={socket ? socket.eventsPerSec.toLocaleString() : "—"}
                />
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border text-foreground hover:bg-primary hover:text-background"
                  onClick={async () => {
                    setBanner("Restarting WebSocket…");
                    const r = await apiRestartService("socket");
                    setBanner(
                      r.ok ? "WebSocket restarted" : "WebSocket restart failed"
                    );
                  }}
                >
                  Restart Socket
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* RIGHT: 3 cols sticky rail */}
        <div className="md:col-span-3">
          <div className="md:sticky md:top-6">
            <div className="flex flex-col gap-3 max-h-[82vh] overflow-auto pr-1 bg-pr">
              {/* BullMQ */}
              <MiniCard
                title="BullMQ"
                icon={<PlaylistAddCheckIcon className="text-foreground" />}
              >
                {queues.map((q) => (
                  <div
                    key={q.name}
                    className="mb-1 rounded border border-border bg-background p-2"
                  >
                    <div className="mb-1 flex items-center justify-between text-[12px]">
                      <span className="font-medium text-foreground">
                        {q.name}
                      </span>

                      <StatusBadge status={q.paused ? "paused" : "active"} />
                    </div>
                    <div className="grid grid-cols-4 gap-1 text-[11px] text-foreground">
                      <KV label="wait" value={q.waiting} />
                      <KV label="act" value={q.active} />
                      <KV label="delay" value={q.delayed} />
                      <KV label="fail" value={q.failed} />
                    </div>
                  </div>
                ))}
              </MiniCard>

              {/* Firebase */}
              <MiniCard
                title="Firebase"
                icon={<BoltIcon className="text-foreground" />}
              >
                <KV
                  label="FCM"
                  value={firebase?.fcmReachable ? "reachable" : "down"}
                />
                <KV
                  label="Last ping"
                  value={
                    firebase
                      ? new Date(firebase.lastPingISO).toLocaleString()
                      : "—"
                  }
                />
              </MiniCard>

              {/* Data Delete */}
              <MiniCard
                title="Delete Data (Logs)"
                icon={<DeleteOutlineIcon className="text-foreground" />}
              >
                <div className="text-[12px] text-muted mb-2">
                  Permanently delete GPS logs for a date range.
                </div>
                <MultiDateRangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  placeholder="Select date range"
                  numberOfMonths={2}
                />
                <div className="mt-3">
                  <Button
                    disabled={!dateRange.from || !dateRange.to}
                    className="w-full bg-primary text-background hover:bg-primary/90"
                    onClick={() => setConfirmOpen(true)}
                  >
                    Delete Selected Range
                  </Button>
                </div>
                <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-foreground">
                        Confirm deletion
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-muted">
                        This will permanently delete logs from{" "}
                        <b>{dateRange.from?.toLocaleDateString() || "—"}</b> to{" "}
                        <b>{dateRange.to?.toLocaleDateString() || "—"}</b>. This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-border text-foreground hover:bg-muted">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-error text-background hover:bg-error/90"
                        onClick={async () => {
                          setDeleting(true);
                          const r = await apiDeleteData(
                            dateRange.from?.toISOString(),
                            dateRange.to?.toISOString()
                          );
                          setDeleting(false);
                          setConfirmOpen(false);
                          setBanner(
                            `Deleted ${r.deleted.toLocaleString()} records`
                          );
                        }}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                {deleting && (
                  <div className="mt-2 text-xs text-muted">Deleting…</div>
                )}
              </MiniCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Building blocks ----
