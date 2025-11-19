import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

// Icons (MUI)
import AddCardRoundedIcon from "@mui/icons-material/AddCardRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SummarizeRoundedIcon from "@mui/icons-material/SummarizeRounded";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DateRangeIcon from "@mui/icons-material/DateRange";
import SendEmailDialog from "../common/CommonEmail";
import { DateRange } from "react-day-picker";

// ——————————————————————————————————————————
// Types & Sample Data
// ——————————————————————————————————————————
export type CreditTxn = {
  id: string; // running number
  when: string; // ISO
  description: string; // message
  creditsChange: number; // + for assign, - for use/deduct
  balanceAfter: number; // resulting balance
  deviceRef?: string; // IMEI/Chassis/Reg (for use events)
  action: "add" | "use" | "deduct"; // explicit action
};

const TZ = "Asia/Kolkata";
function fmtDate(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    hour12: true,
    timeZone: TZ,
  }).format(d);
}

const BILL_TO = {
  name: "ans tracknology",
  addressLines: [
    "Kiran Kutir Cooperative Housing Society, Ajay Nagar Rd, Ajay Nagar,",
    "Kombad Pada, Gokul Nagar, - Mumbai",
    "Maharashtra - 421302",
  ],
};

const SAMPLE_TXNS: CreditTxn[] = [
  {
    id: "5000",
    when: "2023-10-19T10:57:00+05:30",
    description: "Credit Added By Super Admin",
    creditsChange: +8000,
    balanceAfter: 8000,
    action: "add",
  },
  {
    id: "4999",
    when: "2023-10-19T11:09:00+05:30",
    description:
      "1 credit is used to add new Device MH05DK7183 (358980100912667)",
    creditsChange: -1,
    balanceAfter: 7999,
    action: "use",
    deviceRef: "358980100912667",
  },
  {
    id: "4998",
    when: "2023-10-19T13:17:00+05:30",
    description:
      "1 credit is used to add new Device chasis no- 33174 (358980100919886)",
    creditsChange: -1,
    balanceAfter: 7998,
    action: "use",
    deviceRef: "358980100919886",
  },
  {
    id: "4997",
    when: "2023-10-19T13:25:00+05:30",
    description:
      "1 credit is used to add new Device CHASSIS NO 27004 (358980100868752)",
    creditsChange: -1,
    balanceAfter: 7997,
    action: "use",
    deviceRef: "358980100868752",
  },
  {
    id: "4996",
    when: "2023-10-20T14:32:00+05:30",
    description:
      "1 credit is used to add new Device CHASSIS NO 83986 (358980100918300)",
    creditsChange: -1,
    balanceAfter: 7996,
    action: "use",
    deviceRef: "358980100918300",
  },
];

// Derived summary
function deriveSummary(list: CreditTxn[]) {
  let assign = 0,
    deduct = 0,
    used = 0;
  for (const t of list) {
    if (t.action === "add") assign += t.creditsChange; // positive
    if (t.action === "deduct") deduct += Math.abs(t.creditsChange); // store as positive
    if (t.action === "use") used += Math.abs(t.creditsChange);
  }
  const currentBalance = list[0]?.balanceAfter ?? 0;
  return { assign, deduct, used, currentBalance };
}

// ——————————————————————————————————————————
// Minimal table primitives (Tailwind only)
// ——————————————————————————————————————————
function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700">
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm">{children}</table>
      </div>
    </div>
  );
}
function THead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="bg-neutral-50/80 dark:bg-neutral-800/80">
      <tr className="text-[12px] uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
        {children}
      </tr>
    </thead>
  );
}
function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th className={`px-4 py-3 whitespace-nowrap ${className}`}>{children}</th>
  );
}
function TBody({ children }: { children: React.ReactNode }) {
  return (
    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
      {children}
    </tbody>
  );
}
function Tr({ children }: { children: React.ReactNode }) {
  return (
    <tr className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/60">
      {children}
    </tr>
  );
}
function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-3 align-top ${className}`}>{children}</td>;
}

// ——————————————————————————————————————————
// Credit Dialog (Add / Deduct) — NO invoice fields
// ——————————————————————————————————————————
function CreditDialog({
  onCommit,
}: {
  onCommit: (payload: {
    mode: "add" | "deduct";
    credits: number;
    note?: string;
  }) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState<"add" | "deduct">("add");
  const [credits, setCredits] = React.useState<number>(1);
  const [note, setNote] = React.useState("");

  function submit() {
    if (!Number.isFinite(credits) || credits <= 0) return;
    onCommit({ mode, credits, note: note.trim() || undefined });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl bg-primary text-white hover:bg-primary/90">
          <AddCardRoundedIcon className="mr-2" fontSize="small" />
          Add/Deduct Credits
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px] rounded-2xl border border-border bg-background text-foreground">
        <DialogHeader>
          <DialogTitle className="text-foreground">Manage Credits</DialogTitle>
          <DialogDescription className="text-muted">
            One credit equals <strong>1 vehicle · 1 year</strong> of tracking
            service.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="add">Add Credits</TabsTrigger>
            <TabsTrigger value="deduct">Deduct Credits</TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="creditsAdd">Credits</Label>
                <Input
                  id="creditsAdd"
                  type="number"
                  min={1}
                  step={1}
                  value={credits}
                  onChange={(e) => setCredits(parseInt(e.target.value || "0"))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="noteAdd">Note (optional)</Label>
              <Textarea
                id="noteAdd"
                rows={3}
                placeholder="Why are we adding credits?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="deduct" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="creditsDed">Credits</Label>
                <Input
                  id="creditsDed"
                  type="number"
                  min={1}
                  step={1}
                  value={credits}
                  onChange={(e) => setCredits(parseInt(e.target.value || "0"))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="noteDed">Note (optional)</Label>
              <Textarea
                id="noteDed"
                rows={3}
                placeholder="Why are we deducting credits?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            variant="outline"
            className="rounded-xl border-border text-muted-foreground hover:bg-muted"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button className="rounded-xl" onClick={submit} variant="default">
            {mode === "add" ? "Add" : "Deduct"} Credits
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ——————————————————————————————————————————
// Page Component — with "Bill To" + Credit Summary panel (no invoice id)
// ——————————————————————————————————————————
export default function CreditHistoryPage() {
  const [txns, setTxns] = React.useState<CreditTxn[]>(SAMPLE_TXNS);
  const [query, setQuery] = React.useState("");
  const [openEmailDialog, setOpenEmailDialog] = React.useState(false);
  const [typeFilter, setTypeFilter] = React.useState<
    "all" | "add" | "use" | "deduct"
  >("all");
  const [dateFrom, setDateFrom] = React.useState<Date | undefined>();
  const [dateTo, setDateTo] = React.useState<Date | undefined>();

  const [dateRange, setDateRange] = React.useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [datePopoverOpen, setDatePopoverOpen] = React.useState(false);

  const summary = React.useMemo(() => deriveSummary(txns), [txns]);

  function addTxn(payload: {
    mode: "add" | "deduct";
    credits: number;
    note?: string;
  }) {
    const lastBal = txns[0]?.balanceAfter ?? 0;
    const change = payload.mode === "add" ? payload.credits : -payload.credits;
    const next: CreditTxn = {
      id: String(Number(txns[0]?.id ?? 5000) + 1),
      when: new Date().toISOString(),
      description:
        payload.mode === "add"
          ? `${payload.credits} credit${payload.credits > 1 ? "s" : ""} added${
              payload.note ? ` — ${payload.note}` : ""
            }`
          : `${payload.credits} credit${
              payload.credits > 1 ? "s" : ""
            } deducted${payload.note ? ` — ${payload.note}` : ""}`,
      creditsChange: change,
      balanceAfter: lastBal + change,
      action: payload.mode === "add" ? "add" : "deduct",
    };
    setTxns([next, ...txns]);
  }

  const filtered = txns.filter((t) => {
    const matchesType = typeFilter === "all" || t.action === typeFilter;

    // Date range filtering
    const txnDate = new Date(t.when);
    const matchesDateRange =
      (!dateFrom || txnDate >= dateFrom) && (!dateTo || txnDate <= dateTo);

    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      [t.description, t.id, t.deviceRef ?? ""].some((x) =>
        x.toLowerCase().includes(q)
      );

    return matchesType && matchesDateRange && matchesQuery;
  });

  const today = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
    timeZone: TZ,
  }).format(new Date());

  return (
    <>
      <TooltipProvider>
        <div className="min-h-[100vh] w-full bg-background text-foreground">
          {/* Header */}
          <div className="sticky top-0 z-30 border-b border-border bg-background/70 dark:bg-foreground/5 backdrop-blur-sm">
            <div className="mx-auto max-w-7xl px-4 md:px-6 py-3 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Billing
                </div>
                <h1 className="typo-h1">
                  Credit History
                </h1>
              </div>

              {/* Date Range Selector */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Popover
                    open={datePopoverOpen}
                    onOpenChange={setDatePopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="rounded-xl border-border text-left font-normal bg-background dark:bg-foreground/10 hover:bg-foreground/5 dark:hover:bg-foreground/20"
                      >
                        <CalendarMonthIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from
                          ? dateRange?.to
                            ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
                            : `From ${dateRange.from.toLocaleDateString()}`
                          : "Select date range"}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent
                      className="w-auto p-0 bg-background dark:bg-foreground/10 border border-border"
                      align="end"
                    >
                      <div className="flex">
                        <div className="p-3">
                          <div className="text-sm font-medium mb-2 text-foreground">
                            Select Date Range
                          </div>
                          <Calendar
                            mode="range"
                            selected={dateRange}
                            onSelect={(range: DateRange | undefined) => setDateRange(range ?? { from: undefined, to: undefined })}
                            // numberOfMonths={2}
                            initialFocus
                            required
                          />
                        </div>
                        {/* <div className="p-3 border-l border-border">
                          <div className="text-sm font-medium mb-2 text-foreground">
                            To Date
                          </div>
                          <Calendar
                            mode="single"
                            selected={dateTo}
                            onSelect={setDateTo}
                            disabled={(date) =>
                              dateFrom ? date < dateFrom : false
                            }
                          />
                        </div> */}
                      </div>
                      <div className="border-t border-border p-3 flex justify-between">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setDateFrom(undefined);
                              setDateTo(undefined);
                            }}
                          >
                            Clear
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const today = new Date();
                              const thirtyDaysAgo = new Date();
                              thirtyDaysAgo.setDate(today.getDate() - 30);
                              setDateFrom(thirtyDaysAgo);
                              setDateTo(today);
                            }}
                          >
                            Last 30 Days
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          className="bg-primary text-white hover:bg-primary/90"
                          onClick={() => setDatePopoverOpen(false)}
                        >
                          OK
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>

                  {(dateFrom || dateTo) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setDateFrom(undefined);
                        setDateTo(undefined);
                      }}
                      className="h-8 px-2 text-muted-foreground hover:bg-foreground/10"
                    >
                      ×
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Summary panel */}
          <div className="mx-auto max-w-7xl px-4 md:px-6 py-6">
            <Card className="rounded-2xl border border-border bg-background dark:bg-foreground/5">
              <CardContent className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Bill To */}
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      Bill To:
                    </div>
                    <div className="mt-2 font-semibold text-foreground">
                      {BILL_TO.name}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {BILL_TO.addressLines.map((l, i) => (
                        <div key={i}>{l}</div>
                      ))}
                    </div>
                  </div>
                  {/* Credit Summary */}
                  <div className="md:pl-10">
                    <div className="flex items-center justify-between">
                      <div className="typo-h2">
                        Today ( {today} )
                      </div>
                    </div>
                    <div className="mt-2 divide-y divide-border text-sm">
                      <div className="flex items-center justify-between py-2 text-muted-foreground">
                        <span>Assign Credit :</span>
                        <span>{summary.assign}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 text-muted-foreground">
                        <span>Deduct Credit :</span>
                        <span>{summary.deduct}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 text-muted-foreground">
                        <span>Used Credit :</span>
                        <span>-{summary.used}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 font-semibold text-foreground">
                        <span>Current Credit Balance :</span>
                        <span>{summary.currentBalance}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* History Table */}
          <div className="mx-auto max-w-7xl px-4 md:px-6 pb-10">
            <Card className="rounded-2xl border border-border bg-background dark:bg-foreground/5">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-4">
                  <div className="hidden md:flex items-center gap-2 border border-border rounded-xl px-3 py-2 dark:bg-foreground/10">
                    <SearchRoundedIcon
                      fontSize="small"
                      className="text-muted-foreground"
                    />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search description, id, device…"
                      className="bg-transparent outline-none text-sm w-[260px] text-foreground placeholder:text-muted-foreground"
                    />
                    <Separator
                      orientation="vertical"
                      className="h-4 bg-border"
                    />
                    {["all", "add", "deduct", "use"].map((type) => (
                      <Button
                        key={type}
                        variant="ghost"
                        className="rounded-lg px-2 text-muted-foreground hover:bg-foreground/10"
                        onClick={() =>
                          setTypeFilter(
                            type as "all" | "use" | "add" | "deduct"
                          )
                        }
                      >
                        {type === "add"
                          ? "Assign"
                          : type === "deduct"
                          ? "Deduct"
                          : type === "use"
                          ? "Used"
                          : "All"}
                      </Button>
                    ))}
                  </div>
                  <CreditDialog onCommit={addTxn} />
                </div>

                <div className="flex items-center justify-between">
                  <CardTitle className="text-base  text-foreground">
                    History
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      className="rounded-xl border-border text-foreground hover:bg-foreground/10"
                    >
                      <DownloadRoundedIcon className="mr-2" fontSize="small" />
                      Download
                    </Button>
                    <Button
                      onClick={() => setOpenEmailDialog(true)}
                      variant="outline"
                      className="rounded-xl border-border text-foreground hover:bg-foreground/10"
                    >
                      <EmailRoundedIcon className="mr-2" fontSize="small" />
                      Email
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <THead>
                    <Th>Date & Time</Th>
                    <Th>Description</Th>
                    <Th className="text-right">+ / −</Th>
                    <Th className="text-right">Balance</Th>
                    <Th>Action</Th>
                  </THead>
                  <TBody>
                    {filtered.map((t) => (
                      <Tr key={t.id}>
                        <Td className="whitespace-nowrap">{fmtDate(t.when)}</Td>
                        <Td>
                          <div className="font-medium text-foreground">
                            {t.description}
                          </div>
                          {t.deviceRef && (
                            <div className="typo-subtitle">
                              Device: {t.deviceRef}
                            </div>
                          )}
                        </Td>
                        <Td className="text-right">
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-[2px] text-xs ${
                              t.creditsChange > 0
                                ? "border-border bg-foreground/10"
                                : "border-border bg-foreground/5"
                            } text-foreground`}
                          >
                            {t.creditsChange > 0 ? "+" : "−"}
                            {Math.abs(t.creditsChange)}
                          </span>
                        </Td>
                        <Td className="text-right text-foreground">
                          {t.balanceAfter}
                        </Td>
                        <Td>
                          <Badge
                            variant="outline"
                            className="rounded-full border-border text-foreground text-[11px] capitalize"
                          >
                            {t.action}
                          </Badge>
                        </Td>
                      </Tr>
                    ))}
                  </TBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </TooltipProvider>
      <SendEmailDialog
        open={openEmailDialog}
        onOpenChange={() => setOpenEmailDialog(false)}
      />
    </>
  );
}

// ——————————————————————————————————————————
// Tests (we only add; don't change prior expectations)
// ——————————————————————————————————————————
(function tests() {
  console.assert(
    Array.isArray(SAMPLE_TXNS) && SAMPLE_TXNS.length > 0,
    "[TEST] sample txns present"
  );
  const s = deriveSummary(SAMPLE_TXNS);
  console.assert(
    typeof s.assign === "number" &&
      typeof s.deduct === "number" &&
      typeof s.used === "number" &&
      typeof s.currentBalance === "number",
    "[TEST] summary numbers"
  );
  console.assert(
    fmtDate("2023-10-19T10:57:00+05:30").length > 0,
    "[TEST] date formatter outputs"
  );
})();
