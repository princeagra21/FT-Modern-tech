import { useEffect, useState } from "react";
import { PLANS } from "@/lib/data/admin";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Schedule as Clock3 } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ExtendDialog({ open, onOpenChange, selection }: any) {
  const [months, setMonths] = useState(1);
  const [planId, setPlanId] = useState(PLANS[0].id);

  useEffect(() => {
    if (!open) return;
    const first = selection.rows?.[0];
    if (first) setPlanId(first.planId);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Extend license</DialogTitle>
          <DialogDescription>
            Push a device's expiry forward without taking payment.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label>Plan</Label>
            <Select value={planId} onValueChange={setPlanId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLANS.filter((p) => p.id !== "custom").map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Months to add</Label>
            <Input
              type="number"
              min={1}
              max={36}
              value={months}
              onChange={(e) => setMonths(Number(e.target.value || 1))}
            />
          </div>
          <div className="sm:col-span-2 typo-subtitle">
            This extends selected device(s) expiry. Use{" "}
            <span className="font-medium">Renew</span> to take payment.
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="gap-2">
            <Clock3 sx={{ fontSize: 16 }} /> Extend
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
