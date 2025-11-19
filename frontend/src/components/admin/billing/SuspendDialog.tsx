import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";
import { Block as ShieldOff } from "@mui/icons-material";

export default function SuspendDialog({ open, onOpenChange, selection }: any) {
  const [reason, setReason] = useState("Non‑payment");
  const [notify, setNotify] = useState(true);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Suspend access</DialogTitle>
          <DialogDescription>
            Temporarily disable tracking access and API per device.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Reason</Label>
            <Input value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <Toggle checked={notify} onChange={setNotify} />
            <Label htmlFor="notify">Notify customer</Label>
          </div>
          <div className="rounded-xl border p-3 typo-subtitle bg-zinc-50">
            Suspended devices will stop data access until renewed. You can
            unsuspend after payment.
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" className="gap-2">
            <ShieldOff sx={{ fontSize: 16 }} /> Suspend
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
