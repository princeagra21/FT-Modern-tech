import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Method, Payment } from "@/lib/types/admin";
import {
  CUSTOMERS,
  formatINR,
  genId,
  PaymentVEHICLES,
  PLANS,
} from "@/lib/data/admin";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle as CheckCircle2 } from "@mui/icons-material";

export default function AddPaymentSheet({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAdd: (p: Omit<Payment, "id">) => void;
}) {
  const [customer, setCustomer] = useState(CUSTOMERS[0]);
  const [devIdx, setDevIdx] = useState(0);
  const [plan, setPlan] = useState(PLANS[0].id);
  const [method, setMethod] = useState<Method>("UPI");
  const [channel, setChannel] = useState<"Online" | "Manual">("Manual");
  const [amount, setAmount] = useState(1499);
  const [taxPct] = useState(18);
  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    // Link channel to method automatically
    setChannel(method === "Online" ? "Online" : "Manual");
  }, [method]);

  const tax = Math.round((amount * taxPct) / 100);
  const total = amount + tax;
  const nowISO = new Date().toISOString();

  const onSubmit = () => {
    const dev = PaymentVEHICLES[devIdx];
    if (!dev) return;
    onAdd({
      date: nowISO,
      customer,
      vehicle: dev.vehicle,
      imei: dev.imei,
      plan,
      channel,
      method,
      amount,
      tax,
      total,
      status: "Settled",
      reference:
        reference || (method === "Online" ? genId("RAZ") : genId("REF")),
      invoiceNo: genId("INV"),
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-4">
        <SheetHeader>
          <SheetTitle className="typo-h2">Add Payment</SheetTitle>
          <SheetDescription>
            Record a received payment for a device renewal.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>Customer</Label>
              <Select value={customer} onValueChange={setCustomer}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CUSTOMERS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Device</Label>
              <Select
                value={String(devIdx)}
                onValueChange={(v) => setDevIdx(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PaymentVEHICLES.map((d, idx) => (
                    <SelectItem key={d.imei} value={String(idx)}>
                      {d.vehicle} • IMEI {d.imei}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Plan</Label>
              <Select value={plan} onValueChange={setPlan}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLANS.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Method</Label>
              <Select
                value={method}
                onValueChange={(v) => setMethod(v as Method)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Bank">Bank Transfer</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Amount (excl. tax)</Label>
              <Input
                type="number"
                min={0}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value || 0))}
              />
            </div>
            <div>
              <Label>Reference #</Label>
              <Input
                placeholder="Txn / Cheque / Ref"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
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

          <div className="rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-zinc-600">Amount</div>
              <div className="font-medium">{formatINR(amount)}</div>
            </div>
            <div className="flex items-center justify-between mt-1">
              <div className="text-sm text-zinc-600">GST ({taxPct}%)</div>
              <div className="font-medium">{formatINR(tax)}</div>
            </div>
            <Separator className="my-3" />
            <div className="flex items-center justify-between">
              <div className="text-sm text-zinc-800 font-medium">Total</div>
              <div className="text-lg font-semibold">{formatINR(total)}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="gap-2" onClick={onSubmit}>
            <CheckCircle2 className="h-4 w-4" /> Save Payment
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
