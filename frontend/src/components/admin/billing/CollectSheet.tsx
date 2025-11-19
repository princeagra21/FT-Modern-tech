import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Receipt } from "@mui/icons-material";

export default function CollectSheet({ open, onOpenChange, selection }: any) {
  const [method, setMethod] = useState("UPI");
  const [ref, setRef] = useState("");
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (!open) return;
    const sum =
      selection.rows?.reduce((a: number, r: any) => a + (r.price || 0), 0) || 0;
    setAmount(sum);
    setRef("");
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-2">
        <SheetHeader>
          <SheetTitle>Collect payment</SheetTitle>
          <SheetDescription>
            Record an offline/manual payment across selected devices.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-1 gap-2">
            <Label>Amount</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value || 0))}
            />
          </div>
          <div>
            <Label>Method</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UPI">UPI</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Bank">Bank Transfer</SelectItem>
                <SelectItem value="Cheque">Cheque</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Reference #</Label>
            <Input
              placeholder="Txn / Cheque / Ref"
              value={ref}
              onChange={(e) => setRef(e.target.value)}
            />
          </div>
          <div className="rounded-xl border p-4 bg-zinc-50 typo-subtitle">
            Attach receipts per device and allocate splits in the full flow.
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="gap-2">
            <Receipt sx={{ fontSize: 16 }} /> Save payment
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
