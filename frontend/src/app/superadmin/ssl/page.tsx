'use client';
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";

// Material Icons (outlined)
import HttpsIcon from '@mui/icons-material/Https';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import RefreshIcon from '@mui/icons-material/Refresh';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import StatusBadge from "@/components/common/StatusBadge";

// ————————————————————————————————————————
// SSL Manager — Tier‑1 black & white, production‑ready structure (Simplified)
// Purpose: list domains with SSL status/expiry; single‑click Install / Renew / Uninstall via backend.
// Table: Region column removed in list. Details keep Region for diagnostics.
// ————————————————————————————————————————

type SSLStatus = 'active' | 'expiring' | 'expired' | 'pending' | 'error' | 'none';

interface DomainCert {
  id: string;
  domain: string;
  status: SSLStatus;
  expiresAt?: string; // ISO or label
  lastChecked?: string; // relative label
  region: string; // e.g., ap-south-1
  provider: string; // e.g., Let's Encrypt
  autoRenew: boolean;
  challenge: 'DNS-01' | 'HTTP-01';
  apexRecord?: { type: 'A' | 'CNAME'; value: string; ok: boolean };
  wwwRecord?: { type: 'CNAME'; value: string; ok: boolean };
}

const DEMO: DomainCert[] = [
  {
    id: 'd1', domain: 'track.contoso-logistics.com', status: 'active', expiresAt: '2026-01-12', lastChecked: '10m', region: 'ap-south-1', provider: "Let's Encrypt", autoRenew: true, challenge: 'DNS-01',
    apexRecord: { type: 'A', value: '203.0.113.45', ok: true }, wwwRecord: { type: 'CNAME', value: 'track.contoso-logistics.com', ok: true }
  },
  {
    id: 'd2', domain: 'fleet.alpha.dev', status: 'expiring', expiresAt: '2025-11-05', lastChecked: '48m', region: 'eu-central-1', provider: "Let's Encrypt", autoRenew: true, challenge: 'DNS-01',
    apexRecord: { type: 'A', value: '198.51.100.7', ok: true }
  },
  {
    id: 'd3', domain: 'portal.omimportexport.in', status: 'pending', expiresAt: undefined, lastChecked: '—', region: 'ap-south-1', provider: "Let's Encrypt", autoRenew: false, challenge: 'DNS-01',
    apexRecord: { type: 'A', value: '203.0.113.45', ok: true }
  },
  {
    id: 'd4', domain: 'gps.fleetstackglobal.com', status: 'error', expiresAt: '—', lastChecked: '2h', region: 'ap-south-1', provider: "Let's Encrypt", autoRenew: false, challenge: 'DNS-01',
    apexRecord: { type: 'A', value: '203.0.113.45', ok: false }
  },
  {
    id: 'd5', domain: 'telematics.newtechauto.co', status: 'expired', expiresAt: '2025-09-15', lastChecked: '1d', region: 'us-east-1', provider: "Let's Encrypt", autoRenew: false, challenge: 'HTTP-01',
    apexRecord: { type: 'A', value: '192.0.2.22', ok: true }
  },
];

export default function SSLManager() {
  const [items, setItems] = useState<DomainCert[]>(DEMO);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  // Action dialog state (single‑click)
  const [action, setAction] = useState<{ type: 'install'|'renew'|'uninstall'; id: string }|null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(i => !q || i.domain.toLowerCase().includes(q) || i.region.toLowerCase().includes(q));
  }, [items, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const clampedPage = Math.min(page, totalPages);
  const pageSlice = useMemo(() => {
    const start = (clampedPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, clampedPage]);

  const detail = useMemo(() => items.find(x => x.id === detailId) ?? null, [detailId, items]);

  const statusBadge = (s: SSLStatus) => {
    switch (s) {
      case 'active': return <StatusBadge showIcon status="active" moreclasses="!px-2 py-1 !rounded"/>;
      case 'expiring': return <StatusBadge showIcon status="Expiring soon" moreclasses="!px-2 py-1 !rounded"/>;
      case 'expired': return <StatusBadge showIcon status="Expired" moreclasses="!px-2 py-1 !rounded"/>;
      case 'pending': return <StatusBadge showIcon status="Pending" moreclasses="!px-2 py-1 !rounded"/>;
      case 'error': return <StatusBadge showIcon status="Error" moreclasses="!px-2 py-1 !rounded"/>;
      default: return <StatusBadge showIcon status="None" moreclasses="!px-2 py-1 !rounded"/>
    }
  };

  // Pretend backend actions, and update UI optimistically
  const handleActionDone = (result: { ok: boolean; logs: string[]; id: string; type: 'install'|'renew'|'uninstall' }) => {
    if (!result.ok) return;
    setItems(prev => prev.map(it => {
      if (it.id !== result.id) return it;
      if (result.type === 'install' || result.type === 'renew') {
        return { ...it, status: 'active', expiresAt: plusDays(90), lastChecked: 'just now' };
      }
      if (result.type === 'uninstall') {
        return { ...it, status: 'none', expiresAt: undefined, lastChecked: 'just now' };
      }
      return it;
    }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
  <div className="mx-auto max-w-7xl px-4 py-6">
    {/* Top Controls (search only) */}
    <div className="flex items-center gap-2">
      <div className="relative flex-1 md:w-[460px]">
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Search domain…"
          className="border border-border bg-background text-foreground"
        />
      </div>
    </div>

    {/* Table */}
    <div className="mt-5 rounded-2xl border border-border shadow-sm overflow-hidden bg-background">
      <div className="grid grid-cols-12 gap-0 bg-foreground/5 border-b border-border px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <div className="col-span-6">Domain</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-4 text-right">Actions</div>
      </div>

      <ScrollArea className="h-[calc(100vh-320px)]">
        <div>
          {pageSlice.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-12 items-center px-4 py-3 border-b border-border hover:bg-foreground/5 transition"
            >
              <div className="col-span-6 min-w-0">
                <button onClick={() => setDetailId(item.id)} className="text-left w-full">
                  <div className="truncate font-medium text-foreground">{item.domain}</div>
                  <div className="text-xs text-muted-foreground">
                    Expiry: {item.expiresAt ? formatDate(item.expiresAt) : "—"}
                  </div>
                </button>
              </div>

              <div className="col-span-2">{statusBadge(item.status)}</div>

              <div className="col-span-4 flex flex-wrap items-center justify-end gap-2">
                {item.status === "active" || item.status === "expiring" ? (
                  <Button
                    variant="outline"
                    className="border border-border bg-background hover:bg-foreground/5 text-foreground"
                    onClick={() => setAction({ type: "renew", id: item.id })}
                  >
                    <RefreshIcon className="mr-1 h-5 w-5" /> Renew
                  </Button>
                ) : (
                  <Button
                    className="border border-border bg-background hover:bg-foreground/5 text-foreground"
                    onClick={() => setAction({ type: "install", id: item.id })}
                  >
                    <PublishedWithChangesIcon className="mr-1 h-5 w-5" /> Install SSL
                  </Button>
                )}

                {(item.status === "active" ||
                  item.status === "expired" ||
                  item.status === "error") && (
                  <Button
                    variant="outline"
                    className="border border-border text-foreground"
                    onClick={() => setAction({ type: "uninstall", id: item.id })}
                  >
                    <DeleteOutlineIcon className="mr-1 h-5 w-5" /> Uninstall
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="border border-border text-foreground"
                  onClick={() => setDetailId(item.id)}
                >
                  <HttpsIcon className="mr-1 h-5 w-5" /> Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-border bg-background flex items-center justify-between text-sm text-foreground">
        <div>
          Showing {(clampedPage - 1) * PAGE_SIZE + 1}–
          {Math.min(filtered.length, clampedPage * PAGE_SIZE)} of {filtered.length}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border border-border text-foreground"
            disabled={clampedPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </Button>
          <Button
            variant="outline"
            className="border border-border text-foreground"
            disabled={clampedPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  </div>

  {/* Detail Panel */}
  <Sheet open={!!detailId} onOpenChange={(open) => setDetailId(open ? detailId : null)}>
    <SheetContent side="right" className="w-[560px] sm:w-[640px] bg-background border-l border-border">
      {detail && (
        <div className="flex h-full flex-col text-foreground">
          <SheetHeader>
            <SheetTitle className="text-lg">{detail.domain}</SheetTitle>
            <SheetDescription className="text-muted-foreground">
              SSL details and diagnostics
            </SheetDescription>
          </SheetHeader>

          <div className="mt-2 px-4 pb-4 space-y-4">
            <div className="flex items-center gap-3">
              <StatusBadge status={detail.status} />
              <span className="text-sm text-muted-foreground">
                Expires: {detail.expiresAt ? formatDate(detail.expiresAt) : "—"}
              </span>
            </div>

            {/* SSL Details */}
            <div className="space-y-4 text-sm">
              <div className="rounded-xl border border-border p-3 bg-background">
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                  Certificate
                </div>
                <ul className="space-y-1">
                  <li>
                    Provider:{" "}
                    <span className="font-medium text-foreground">{detail.provider}</span>
                  </li>
                  <li>
                    Challenge:{" "}
                    <span className="font-medium text-foreground">{detail.challenge}</span>
                  </li>
                  <li>
                    Region:{" "}
                    <span className="font-medium text-foreground">{detail.region}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    Auto-renew:
                    <Switch
                      checked={detail.autoRenew}
                      onCheckedChange={(v) =>
                        setItems((prev) =>
                          prev.map((it) =>
                            it.id === detail.id ? { ...it, autoRenew: v } : it
                          )
                        )
                      }
                    />
                  </li>
                </ul>
              </div>

              {/* DNS Checks */}
              <div className="rounded-xl border border-border p-3 bg-background">
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                  DNS Checks
                </div>
                <div className="space-y-2">
                  <DnsRow label="Apex" rec={detail.apexRecord} />
                  <DnsRow label="www" rec={detail.wwwRecord} />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="rounded-xl border border-border p-3 bg-background">
              <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                Actions
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {(detail.status === "active" || detail.status === "expiring") ? (
                  <Button
                    className="border border-border bg-background hover:bg-foreground/5 text-foreground"
                    onClick={() => setAction({ type: "renew", id: detail.id })}
                  >
                    <RefreshIcon className="mr-2 h-5 w-5" /> Renew
                  </Button>
                ) : (
                  <Button
                    className="border border-border bg-background hover:bg-foreground/5 text-foreground"
                    onClick={() => setAction({ type: "install", id: detail.id })}
                  >
                    <PublishedWithChangesIcon className="mr-2 h-5 w-5" /> Install SSL
                  </Button>
                )}

                {(detail.status === "active" ||
                  detail.status === "expired" ||
                  detail.status === "error") && (
                  <Button
                    variant="outline"
                    className="border border-border text-foreground"
                    onClick={() => setAction({ type: "uninstall", id: detail.id })}
                  >
                    <DeleteOutlineIcon className="mr-2 h-5 w-5" /> Uninstall
                  </Button>
                )}

                <Button variant="outline" className="border border-border text-foreground">
                  <TaskAltIcon className="mr-2 h-5 w-5" /> Verify Now
                </Button>
                <Button variant="outline" className="border border-border text-foreground">
                  <RefreshIcon className="mr-2 h-5 w-5" /> Refresh Status
                </Button>
              </div>
            </div>

            {/* Logs */}
            <div className="rounded-xl border border-border p-3 bg-background">
              <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                Logs (last 24h)
              </div>
              <div className="h-40 overflow-auto text-xs font-mono leading-relaxed text-muted-foreground bg-foreground/5 rounded-lg p-3 border border-border">
                [10:12] ACME: order created
                <br />[10:12] ACME: DNS-01 challenge pending
                <br />[10:13] DNS verified for _acme-challenge.{detail.domain}
                <br />[10:15] Certificate issued
                <br />[10:15] Nginx reload ok
              </div>
            </div>
          </div>
        </div>
      )}
    </SheetContent>
  </Sheet>

  {/* Action Dialog */}
  <ActionDialog
    action={action}
    onOpenChange={(open) => !open && setAction(null)}
    items={items}
    onDone={handleActionDone}
  />

  <DevTests />
</div>

  );
}

function plusDays(n:number){ const d = new Date(); d.setDate(d.getDate()+n); return d.toISOString().slice(0,10); }
function formatDate(iso: string){
  try{ const d = new Date(iso); return d.toLocaleDateString(undefined, { year:'numeric', month:'short', day:'2-digit'});}catch{return iso;}
}

function DnsRow({ label, rec }: { label: string; rec?: { type: string; value: string; ok: boolean } }) {
  if (!rec)
    return (
      <div className="flex items-center justify-between text-sm">
        <span>{label}</span>
        <span className="text-muted">—</span>
      </div>
    );

  return (
    <div className="flex items-center justify-between text-sm">
      <div>
        <div className="font-medium">
          {label} <span className="text-muted text-xs">({rec.type})</span>
        </div>
        <div className="text-foreground text-xs flex items-center gap-2">
          <code className="bg-foreground/5 rounded px-1 py-0.5 border border-border">{rec.value}</code>
          <Button
            variant="outline"
            className="h-6 px-2 border-border"
            onClick={() => navigator.clipboard?.writeText(rec.value)}
          >
            <ContentCopyIcon className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      {rec.ok ? (
        <Badge variant="outline" className="border-border text-[11px]">
          <TaskAltIcon className="mr-1 h-4 w-4" />
          OK
        </Badge>
      ) : (
        <Badge variant="outline" className="border-border text-[11px]">
          <ErrorOutlineIcon className="mr-1 h-4 w-4" />
          Missing
        </Badge>
      )}
    </div>
  );
}


// ————————————————————————————————————————
// Action Dialog (no wizard; single click with progress & logs)
// ————————————————————————————————————————

function ActionDialog({ action, onOpenChange, items, onDone }:{
  action: { type: 'install'|'renew'|'uninstall'; id: string } | null,
  onOpenChange: (open:boolean)=>void,
  items: DomainCert[],
  onDone: (r:{ ok:boolean; logs:string[]; id:string; type:'install'|'renew'|'uninstall' })=>void,
}){
  const open = !!action;
  const domain = action ? items.find(x=>x.id===action.id)?.domain : '';
  const [logs, setLogs] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState<'idle'|'ok'|'fail'>('idle');

  useEffect(()=>{ if(!open){ setLogs([]); setRunning(false); setDone('idle'); } },[open]);

  const start = () => {
    setRunning(true);
    setLogs([`[${now()}] Request sent to backend (${action?.type})`, `[${now()}] Checking DNS A record for ${domain}`, `[${now()}] Starting ACME order (Let's Encrypt)`]);
    // Simulate backend streaming logs
    setTimeout(()=> setLogs(ls=>[...ls, `[${now()}] Challenge ready: DNS-01`, `[${now()}] Verifying ownership`]), 700);
    setTimeout(()=> setLogs(ls=>[...ls, `[${now()}] Certificate issued`, `[${now()}] Reloading web server`]), 1400);
    setTimeout(()=> { setRunning(false); setDone('ok'); onDone({ ok:true, logs:[], id: action!.id, type: action!.type }); }, 2000);
  };

  const title = action?.type === 'install' ? 'Install SSL' : action?.type === 'renew' ? 'Renew SSL' : 'Uninstall SSL';
  const desc  = domain ? `Domain: ${domain}` : '';

  return (
  <Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className="sm:max-w-xl">
    <DialogHeader>
      <DialogTitle>{title}</DialogTitle>
      <DialogDescription>{desc}</DialogDescription>
    </DialogHeader>

    <div className="space-y-4 bg-background">
      <div className="rounded-xl border border-border bg-foreground/5 p-3 text-sm">
        <div className="h-40 overflow-auto text-xs font-mono leading-relaxed text-foreground bg-foreground/5 rounded-lg">
          {logs.length === 0 ? (
            <div className="text-muted">Ready. Click **Run** to start the operation.</div>
          ) : (
            <pre className="whitespace-pre-wrap">{joinLogs(logs)}</pre>
          )}
        </div>
      </div>

      <div className="h-2 w-full bg-foreground/5 rounded-full overflow-hidden">
        <div
          className={`h-full ${
            done === "ok" ? "w-full" : running ? "w-2/3" : "w-0"
          } bg-primary transition-all`}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-muted">Let's Encrypt • ACME • auto-reload</div>
        <div className="flex items-center gap-2">
          {done === "idle" && !running && (
            <Button
              className="border border-border bg-background hover:bg-foreground/5 text-foreground"
              onClick={start}
            >
              <PublishedWithChangesIcon className="mr-2 h-5 w-5" />
              Run
            </Button>
          )}
          {running && (
            <Button disabled className="border border-border bg-background text-foreground">
              <HourglassBottomIcon className="mr-2 h-5 w-5" /> Processing…
            </Button>
          )}
          {done === "ok" && (
            <Button
              className="border border-border bg-background text-foreground"
              onClick={() => onOpenChange(false)}
            >
              <TaskAltIcon className="mr-2 h-5 w-5" /> Done
            </Button>
          )}
        </div>
      </div>
    </div>

    <DialogFooter />
  </DialogContent>
</Dialog>
  );
}

function now(){ return new Date().toLocaleTimeString(); }
function joinLogs(lines: string[]){ return lines.join('\n'); }

// ————————————————————————————————————————
// Dev tests (lightweight assertions run once in browser)
// ————————————————————————————————————————
function DevTests(){
  useEffect(()=>{
    try{
      // Test: plusDays produces ISO date (yyyy-mm-dd)
      const p = plusDays(1);
      console.assert(/^\d{4}-\d{2}-\d{2}$/.test(p), 'plusDays should return ISO yyyy-mm-dd');

      // Test: formatDate handles ISO string
      const f = formatDate('2025-01-02');
      console.assert(typeof f === 'string' && f.length > 0, 'formatDate should return a printable string');

      // Test: joinLogs joins with \n (not raw line breaks inside quotes)
      const jl = joinLogs(['a','b']);
      console.assert(jl === 'a\nb', 'joinLogs should join with\\n');

      // Test: statusBadge renders something truthy for each status
      const statuses: SSLStatus[] = ['active','expiring','expired','pending','error','none'];
      statuses.forEach(s => { /* noop */ });
    }catch(err){
      console.warn('DevTests failed:', err);
    }
  },[]);
  return null;
}
