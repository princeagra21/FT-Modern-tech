import React, { useMemo, useState, useEffect } from "react";
import SendIcon from "@mui/icons-material/Send";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import ScatterPlotIcon from "@mui/icons-material/ScatterPlot";

/**
 * VEHICLE COMMAND — ULTRA SIMPLE UI (Monochrome)
 * One panel. No parameter inputs. Edit payload directly.
 *
 * Top bar: Target + Transport
 * Main: Command select -> Payload (editable) -> Send
 * Bottom: Result (server response) + Last 5 actions
 */

// --- Types
 type Transport = "SMS" | "GPRS";
 type CommandType =
   | "PING"
   | "IMMOBILIZE"
   | "MOBILIZE"
   | "HORN"
   | "SET_TIMEZONE"
   | "SET_GEOFENCE"
   | "REBOOT"
   | "CUSTOM";

 type CommandDefinition = {
  key: CommandType;
  label: string;
  icon: React.ReactNode;
  hint?: string;
  danger?: boolean;
  template: string; // prefilled payload template
  buildPayload: (args?: Record<string, any>) => string; // kept for tests & suggestions
 };

 // --- Device context (mock)
 const DEVICE = { vehicleNo: "DL01 AB 1287", imei: "358920108765431", protocol: "GT06" };

 // --- Catalog (tiny, essential)
 const COMMANDS: CommandDefinition[] = [
  { key: "PING", label: "Ping", icon: <GpsFixedIcon fontSize="small"/>, hint: "Request location", danger: false, template: "PING#", buildPayload: () => "PING#" },
  { key: "IMMOBILIZE", label: "Immobilize", icon: <LockOutlinedIcon fontSize="small"/>, hint: "Cut engine", danger: true, template: "DYD#", buildPayload: () => "DYD#" },
  { key: "MOBILIZE", label: "Mobilize", icon: <LockOpenOutlinedIcon fontSize="small"/>, hint: "Restore engine", danger: true, template: "HFYD#", buildPayload: () => "HFYD#" },
  { key: "HORN", label: "Horn", icon: <NotificationsNoneIcon fontSize="small"/>, hint: "Edit seconds in payload", danger: false, template: "HORN,1#", buildPayload: ({ seconds = 1 } = {}) => `HORN,${Number(seconds)||1}#` },
  { key: "SET_TIMEZONE", label: "Set Timezone", icon: <AccessTimeIcon fontSize="small"/>, hint: "Edit offset in payload", danger: false, template: "TIMEZONE,+05:30#", buildPayload: ({offset = "+05:30"} = {}) => `TIMEZONE,${offset}#` },
  { key: "SET_GEOFENCE", label: "Set Geofence", icon: <ScatterPlotIcon fontSize="small"/>, hint: "Edit lat,lon,radius in payload", danger: false, template: "GEOFENCE,28.6139,77.2090,500#", buildPayload: ({lat="28.6139",lon="77.2090",radius=500} = {}) => `GEOFENCE,${lat},${lon},${radius}#` },
  { key: "REBOOT", label: "Reboot Device", icon: <RestartAltIcon fontSize="small"/>, hint: "Restart device", danger: false, template: "REBOOT#", buildPayload: () => "REBOOT#" },
  { key: "CUSTOM", label: "Custom", icon: <RestartAltIcon fontSize="small"/>, hint: "Type raw payload", danger: false, template: "", buildPayload: ({raw=""} = {}) => String(raw).trim() },
 ];

 type HistoryItem = { id: string; ts: number; transport: Transport; command: CommandType; payload: string; status: "success" | "failed" };
 type ResponseCard = { ts: number; ok: boolean; code: number; message: string; echo: { imei: string; transport: Transport; command: CommandType; payload: string } } | null;

function copy(text: string) { navigator.clipboard?.writeText(text); }

// --- Main (single card)
export default function VehicleSendCommand() {
  const [transport, setTransport] = useState<Transport>("SMS");
  const [cmd, setCmd] = useState<CommandType>("PING");
  const def = useMemo(() => COMMANDS.find(c => c.key === cmd)!, [cmd]);

  // EDITABLE PAYLOAD ONLY
  const [payload, setPayload] = useState<string>(def.template);
  useEffect(() => { setPayload(def.template); }, [def]);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [confirm, setConfirm] = useState(true);
  const [response, setResponse] = useState<ResponseCard>(null);

  function validate(): string[] {
    const errs: string[] = [];
    if (!payload || !payload.trim()) errs.push("Payload cannot be empty");
    return errs;
  }

  // Simulated server call — replace with real API
  async function sendToServer(body: { imei: string; transport: Transport; command: CommandType; payload: string }): Promise<ResponseCard> {
    await new Promise(r => setTimeout(r, 500));
    const ok = Math.random() > 0.06;
    return { ts: Date.now(), ok, code: ok ? 200 : 504, message: ok ? "ACK received" : "Gateway timeout", echo: body };
  }

  async function send() {
    const errs = validate();
    if (errs.length) { alert(errs.join("\n")); return; }
    if ((def.danger || confirm) && !window.confirm(`Send ${def.label} to ${DEVICE.vehicleNo}?`)) return;

    const body = { imei: DEVICE.imei, transport, command: cmd, payload };
    const res = await sendToServer(body);
    setResponse(res);

    setHistory(h => [{ id: Math.random().toString(36).slice(2), ts: Date.now(), transport, command: cmd, payload, status: res?.ok ? "success" as const : "failed" as const }, ...h].slice(0,5));
  }

  const requestJson = useMemo(() => ({ imei: DEVICE.imei, transport, command: cmd, payload }), [transport, cmd, payload]);

  return (
    <div className="p-4 md:p-6">
      {/* Top bar */}
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight dark:text-neutral-100">Send Command</h1>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{DEVICE.vehicleNo} • IMEI <span className="font-mono">{DEVICE.imei}</span> • {DEVICE.protocol}</p>
        </div>
        <select className="rounded-lg border border-neutral-300 bg-white px-2 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100" value={transport} onChange={e => setTransport(e.target.value as Transport)}>
          <option>SMS</option>
          <option>GPRS</option>
        </select>
      </div>

      {/* 6:4 Layout */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-10">
        {/* Left (6) — Utilities */}
        <div className="lg:col-span-6 space-y-4">
          {/* Command & Payload card */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
            {/* 1. Command */}
            <label className="text-sm">
              <div className="mb-1 text-xs text-neutral-500 dark:text-neutral-400">Command</div>
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-md border border-neutral-300 dark:border-neutral-600 dark:text-neutral-300">{def.icon}</span>
                <select className="w-full rounded-lg border border-neutral-300 bg-white px-2 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100" value={cmd} onChange={e => setCmd(e.target.value as CommandType)}>
                  {COMMANDS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                </select>
              </div>
            </label>
            {def.hint && <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{def.hint}</div>}
            {def.danger && <div className="mt-2 inline-flex items-center gap-1 rounded-sm border border-black px-1.5 py-0.5 text-[10px] dark:border-white dark:text-white">DANGER</div>}

            {/* 2. Payload (editable only) */}
            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="rounded-sm bg-black px-2 py-0.5 text-white dark:bg-white dark:text-black">Payload</span>
                <button className="inline-flex items-center gap-1 rounded border border-neutral-300 bg-white px-2 py-0.5 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-200" onClick={() => copy(payload)} disabled={!payload}><ContentCopyIcon style={{fontSize:14}}/>Copy</button>
              </div>
              <textarea className="h-28 w-full resize-none rounded-lg border border-neutral-300 bg-neutral-50 p-3 font-mono text-sm dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100" value={payload} onChange={e => setPayload(e.target.value)} placeholder="Type exact payload to send…" />
              <details className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
                <summary className="cursor-pointer select-none">Request JSON</summary>
                <pre className="mt-2 max-h-32 overflow-auto rounded-lg border border-neutral-200 bg-neutral-50 p-2 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-200">{JSON.stringify(requestJson, null, 2)}</pre>
              </details>
            </div>

            {/* 3. Send */}
            <div className="mt-4 flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs dark:text-neutral-200"><input type="checkbox" className="h-4 w-4" checked={confirm} onChange={e => setConfirm(e.target.checked)} /> Confirm before send</label>
              <button onClick={send} disabled={validate().length>0} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs ${validate().length?"cursor-not-allowed border border-neutral-300 text-neutral-400 dark:border-neutral-600":"bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"}`}>
                <SendIcon style={{fontSize:16}}/>
                <span>Send</span>
              </button>
            </div>
          </div>

          {/* Recent (left column) */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
            <div className="mb-2 text-sm font-semibold dark:text-neutral-100">Recent</div>
            {history.length === 0 ? (
              <div className="rounded-lg border border-neutral-200 bg-white p-3 text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400">No commands yet.</div>
            ) : (
              <ul className="space-y-2 text-sm">
                {history.map(h => (
                  <li key={h.id} className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-900">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-sm border border-black px-1.5 py-0.5 text-[10px] dark:border-white dark:text-white">{h.transport}</span>
                        <span className="dark:text-neutral-100">{COMMANDS.find(c=>c.key===h.command)?.label}</span>
                        <span className={`rounded-sm px-1.5 py-0.5 text-[10px] ${h.status==="success"?"bg-black text-white dark:bg-white dark:text-black":"border border-black dark:border-white dark:text-white"}`}>{h.status.toUpperCase()}</span>
                      </div>
                      <div className="mt-1 truncate font-mono text-xs text-neutral-500 dark:text-neutral-400">{h.payload}</div>
                    </div>
                    <div className="ml-2 w-24 shrink-0 text-right text-[10px] text-neutral-500 dark:text-neutral-400">{new Date(h.ts).toLocaleTimeString()}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right (4) — Result panel */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-4 rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
            <div className="mb-2 text-sm font-semibold dark:text-neutral-100">Server Response</div>
            {!response ? (
              <div className="rounded-lg border border-neutral-200 bg-white p-3 text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400">No response yet.</div>
            ) : (
              <div className="grid gap-2 text-sm dark:text-neutral-200">
                <div className="flex items-center justify-between"><span>Status</span><span className={`rounded-sm px-1.5 py-0.5 text-[10px] ${response.ok?"bg-black text-white dark:bg-white dark:text-black":"border border-black dark:border-white dark:text-white"}`}>{response.ok?"SUCCESS":"FAILED"}</span></div>
                <div className="flex items-center justify-between"><span>HTTP Code</span><span className="font-mono">{response.code}</span></div>
                <div className="flex items-center justify-between"><span>Message</span><span>{response.message}</span></div>
                <details className="text-xs text-neutral-600 dark:text-neutral-400">
                  <summary className="cursor-pointer select-none">Echo</summary>
                  <pre className="mt-2 max-h-40 overflow-auto rounded-lg border border-neutral-200 bg-neutral-50 p-2 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-200">{JSON.stringify(response.echo, null, 2)}</pre>
                </details>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Runtime tests (kept + added) */}
     
    </div>
  );
}

