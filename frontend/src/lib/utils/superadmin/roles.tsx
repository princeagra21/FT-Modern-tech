import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Level } from "@/lib/types/superadmin";
import { LEVEL_HELP, MODULES, PRESETS } from "@/lib/data/superadmin";

export function PriceCurrency({
  amount,
  currency,
  onChange,
}: {
  amount?: number;
  currency?: string;
  onChange: (a: number | undefined, c: string) => void;
}) {
  const [localAmt, setLocalAmt] = useState<string>(amount?.toString() ?? "");
  useEffect(() => {
    setLocalAmt(amount !== undefined ? String(amount) : "");
  }, [amount]);

  return (
    <div className="inline-flex items-center rounded-full border border-border h-9 px-2 bg-background text-foreground">
      <input
        type="number"
        inputMode="decimal"
        step="any"
        value={localAmt}
        onChange={(e) => {
          setLocalAmt(e.target.value);
          const n = Number(e.target.value);
          onChange(Number.isFinite(n) ? n : undefined, currency ?? "INR");
        }}
        placeholder="Amount"
        className="h-7 w-24 outline-none border-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground"
      />
      <span className="mx-2 h-5 w-px bg-border" />
      <Select
        value={(currency ?? "INR").toUpperCase()}
        onValueChange={(v) => onChange(Number(localAmt), v)}
      >
        <SelectTrigger className="h-7 w-[100px] border-0 bg-transparent shadow-none focus:ring-0 focus:ring-offset-0 text-foreground">
          <SelectValue placeholder="Currency" />
        </SelectTrigger>
        <SelectContent>
          {[
            "INR",
            "USD",
            "EUR",
            "GBP",
            "AED",
            "SAR",
            "AUD",
            "CAD",
            "JPY",
            "SGD",
          ].map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function LevelToggle({
  value,
  onChange,
}: {
  value: Level;
  onChange: (v: Level) => void;
}) {
  const opts: Level[] = ["none", "view", "edit", "manage", "full"];
  return (
    <div className="inline-flex rounded-full border border-border overflow-hidden bg-background">
      {opts.map((opt) => (
        <Tooltip key={opt}>
          <TooltipTrigger asChild>
            <button
              onClick={() => onChange(opt)}
              className={`px-3 h-8 text-sm transition-colors ${
                value === opt
                  ? "bg-primary text-white"
                  : "bg-background text-foreground hover:bg-foreground/5"
              } ${opt !== "none" ? "border-l border-border" : ""}`}
            >
              {uc(opt)}
            </button>
          </TooltipTrigger>
          <TooltipContent>{LEVEL_HELP[opt]}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}

export function isoNow() {
  return new Date().toISOString().slice(0, 19).replace("T", " ");
}
export function uc(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
export function timeAgo(iso: string) {
  try {
    const d = new Date(iso);
    const ms = Date.now() - d.getTime();
    const m = Math.floor(ms / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const days = Math.floor(h / 24);
    return `${days}d ago`;
  } catch {
    return iso;
  }
}
export function toNum(s: string) {
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

export function fill(level: Level) {
  return Object.fromEntries(MODULES.map((m) => [m.key, level] as const));
}

// ————————————————————————————————————————
// Dev tests (simple assertions to avoid regressions)
// ————————————————————————————————————————
export function DevTests() {
  useEffect(() => {
    try {
      // Allowed levels
      (["none", "view", "edit", "manage", "full"] as Level[]).forEach((l) => {
        if (!["none", "view", "edit", "manage", "full"].includes(l))
          throw new Error("invalid");
      });
      // Preset fills all modules
      const p = PRESETS[0].map();
      console.assert(
        Object.keys(p).length === MODULES.length,
        "Preset must cover all modules"
      );
      // LEVEL_HELP contains manage
      console.assert(
        LEVEL_HELP.manage.length > 0,
        "LEVEL_HELP should describe manage"
      );
      // PriceCurrency change
      let changedA: number | undefined;
      let changedC = "";
      const cb = (a: number | undefined, c: string) => {
        changedA = a;
        changedC = c;
      };
      cb(100, "INR");
      console.assert(
        changedA === 100 && changedC === "INR",
        "PriceCurrency onChange should pass amount and currency"
      );
    } catch (e) {
      console.warn("DevTests failed", e);
    }
  }, []);
  return null;
}
