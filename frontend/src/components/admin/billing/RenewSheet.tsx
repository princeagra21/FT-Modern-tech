import { formatINR, PLANS } from "@/lib/data/admin";
import { useEffect, useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import {
  CreditCard,
  Receipt,
  Link as LinkIcon,
  VerifiedUser as BadgeCheck,
  Info,
} from "@mui/icons-material";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function RenewSheet({ open, onOpenChange, selection }: any) {
  const [mode, setMode] = useState<"keep" | "override">("keep"); // keep device plans or override with one plan
  const [planId, setPlanId] = useState<string>(PLANS[0].id);
  const [tenure, setTenure] = useState<number>(12);
  const [method, setMethod] = useState<string>("online");
  const [coTerm, setCoTerm] = useState(false); // align to one expiry date
  const [sendVia, setSendVia] = useState({
    email: true,
    sms: false,
    whatsapp: true,
  });
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) return;
    const first = selection.rows?.[0];
    if (first) {
      const matched = PLANS.find((p) => p.id === first.planId) || PLANS[0];
      setPlanId(matched.id);
      setTenure(matched.tenureMonths || 12);
    }
  }, [open]);

  const totals = useMemo(() => {
    const rows = selection.rows || [];
    if (mode === "keep") {
      const base = rows.reduce((a: number, r: any) => a + (r.price || 0), 0);
      const tax = Math.round(base * 0.18);
      return { base, tax, total: base + tax };
    }
    const unit = PLANS.find((p) => p.id === planId)?.price || 0;
    const prorated = Math.round(unit * (tenure / 12)) * rows.length;
    const tax = Math.round(prorated * 0.18);
    return { base: prorated, tax, total: prorated + tax };
  }, [selection.rows, mode, planId, tenure]);

  const link = useMemo(() => {
    const token = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `https://pay.fleetstackglobal.com/R/${token}`;
  }, [planId, tenure, selection.ids?.join(","), mode]);

  const count = selection.ids?.length || 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-2">
        <SheetHeader>
          <SheetTitle className="typo-h2">
            Renew{" "}
            {count > 1
              ? `${count} devices`
              : selection.rows?.[0]?.vehicle || "device"}
          </SheetTitle>
          <SheetDescription>
            Each device has its own plan. Choose whether to keep per‑device
            plans or override with one plan.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="space-y-3">
            <Label>Plan strategy</Label>
            <RadioGroup
              value={mode}
              onChange={(v: any) => setMode(v)}
              className="grid grid-cols-1 sm:grid-cols-2 gap-2"
            >
              <Label className={cn(mode === "keep")}>
                <RadioGroupItem value="keep" className="sr-only" /> Keep device
                plans
              </Label>
              <Label className={cn(mode === "override")}>
                <RadioGroupItem value="override" className="sr-only" /> Override
                with one plan
              </Label>
            </RadioGroup>
          </div>

          {mode === "override" && (
            <div className="grid grid-cols-1 gap-3">
              <Label>Plan</Label>
              <Select
                value={planId}
                onValueChange={(v) => {
                  setPlanId(v);
                  const t = PLANS.find((p) => p.id === v)?.tenureMonths || 12;
                  setTenure(t);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  {PLANS.filter((p) => p.id !== "custom").map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-3">
                <Label className="text-sm">Tenure (months)</Label>
                <Input
                  type="number"
                  min={1}
                  max={36}
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value || 1))}
                  className="w-28"
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Toggle checked={coTerm} onChange={setCoTerm} />
            <Label htmlFor="coterm">
              Align expiries to a single date (co‑term)
            </Label>
          </div>
          <p className="typo-destructive">
            Co‑term will prorate shorter/longer cycles so all selected devices
            share one renewal date.
          </p>

          <div className="rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-zinc-600">Amount</div>
              <div className="font-medium">{formatINR(totals.base)}</div>
            </div>
            <div className="flex items-center justify-between mt-1">
              <div className="text-sm text-zinc-600">GST (18%)</div>
              <div className="font-medium">{formatINR(totals.tax)}</div>
            </div>
            <SelectSeparator className="my-3" />
            <div className="flex items-center justify-between">
              <div className="text-sm text-zinc-800 font-medium">Total</div>
              <div className="text-lg font-semibold">
                {formatINR(totals.total)}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Collection method</Label>
            <RadioGroup
              value={method}
              onValueChange={setMethod}
              className="grid grid-cols-2 gap-2"
            >
              <Label className={cn(method === "online")}>
                <RadioGroupItem value="online" className="sr-only" />
                <CreditCard sx={{ fontSize: 16 }} /> Online link
              </Label>
              <Label className={cn(method === "manual")}>
                <RadioGroupItem value="manual" className="sr-only" />
                <Receipt sx={{ fontSize: 16 }} /> Manual receipt
              </Label>
            </RadioGroup>

            {method === "online" ? (
              <div className="rounded-xl border p-4">
                <div className="text-sm text-zinc-600">Payment link</div>
                <div className="mt-1 font-medium break-all flex items-center gap-2">
                  <LinkIcon sx={{ fontSize: 16 }} />
                  <a
                    className="underline"
                    href={link}
                    onClick={(e) => e.preventDefault()}
                  >
                    {link}
                  </a>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <Checkbox
                    id="email"
                    checked={sendVia.email}
                    onCheckedChange={(c) =>
                      setSendVia((s) => ({ ...s, email: !!c }))
                    }
                  />
                  <Label htmlFor="email" className="text-sm">
                    Email
                  </Label>
                  <Checkbox
                    id="sms"
                    checked={sendVia.sms}
                    onCheckedChange={(c) =>
                      setSendVia((s) => ({ ...s, sms: !!c }))
                    }
                  />
                  <Label htmlFor="sms" className="text-sm">
                    SMS
                  </Label>
                  <Checkbox
                    id="wa"
                    checked={sendVia.whatsapp}
                    onCheckedChange={(c) =>
                      setSendVia((s) => ({ ...s, whatsapp: !!c }))
                    }
                  />
                  <Label htmlFor="wa" className="text-sm">
                    WhatsApp
                  </Label>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label>Method</Label>
                  <Select defaultValue="UPI">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="Card">Card</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Bank">Bank Transfer</SelectItem>
                      <SelectItem value="Cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Reference #</Label>
                  <Input placeholder="Txn / Cheque / Ref" />
                </div>
                <div className="sm:col-span-2">
                  <Label>Note</Label>
                  <Textarea
                    placeholder="Optional note (visible in receipt)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="rounded-xl border p-4 bg-zinc-50">
            <div className="flex items-start gap-2">
              <Info sx={{ fontSize: 16 }} className="mt-0.5" />
              <p className="typo-subtitle">
                In production, this creates invoices per device (or one
                consolidated invoice), updates each device's term, and
                reconciles payment.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="gap-2">
            <BadgeCheck sx={{ fontSize: 16 }} /> Confirm &{" "}
            {method === "online" ? "Send Link" : "Mark as Paid"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
