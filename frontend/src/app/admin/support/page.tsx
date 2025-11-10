"use client"
import React, { useMemo, useRef, useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Material Icons
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import NotesIcon from '@mui/icons-material/Notes';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import StatusBadge from "@/components/common/StatusBadge";

// ————————————————————————————————————————————————————————————
// Single‑page (split view) Support Utility — Production‑ready UI (Headerless)
// Left: Ticket list (single column item shows { Title, TicketID, Name })
// Right: Ticket detail with tabs (Conversation / Internal Notes), status control, reply/notes composers
// Extras: Status chips, paging, New Ticket dialog, AI draft, **resizable panes in the SAME ROW**
// ————————————————————————————————————————————————————————————

type Status = 'open' | 'in_process' | 'answered' | 'hold' | 'closed';

type Ticket = {
  id: string;        // e.g., "FS-1042"
  title: string;     // e.g., "Device not reporting"
  name: string;      // requester/customer name
  preview?: string;  // optional single-line preview
  updatedAt: string; // relative label
  createdAt: string; // ISO or label
  status: Status;
};

type Message = {
  id: string;
  ticketId: string;
  author: 'agent' | 'requester';
  name: string; // display name for bubble header
  body: string;
  createdAt: string; // time label
  isPublic?: boolean;
};

const DEMO_TICKETS: Ticket[] = [
  { id: 'FS-1046', title: 'API key not working after rotation', name: 'Priya Sharma', preview: 'Regenerated key still 401…', updatedAt: '10m', createdAt: 'Today 10:05', status: 'in_process' },
  { id: 'FS-1045', title: 'Unable to add new device (IMEI blocked?)', name: 'Rahul Verma', preview: 'Adding GT06 shows validation error…', updatedAt: '25m', createdAt: 'Today 09:40', status: 'open' },
  { id: 'FS-1044', title: 'Billing GST invoice copy', name: 'Anita Desai', preview: 'Need last month invoice in PDF…', updatedAt: '1h', createdAt: 'Today 09:00', status: 'answered' },
  { id: 'FS-1043', title: 'Geofence alert delay ~3 mins', name: 'Zhang Wei', preview: 'Alerts arriving late vs live map…', updatedAt: '3h', createdAt: 'Today 07:10', status: 'hold' },
  { id: 'FS-1042', title: 'Device not reporting since midnight', name: 'Alice Johnson', preview: 'Last ping 00:02 IST. Please check…', updatedAt: '5h', createdAt: 'Today 05:05', status: 'open' },
  { id: 'FS-1041', title: 'SFTP export setup', name: 'Contoso Ops', preview: 'Need daily CSV at 02:00 IST…', updatedAt: '1d', createdAt: 'Yesterday', status: 'closed' },
  { id: 'FS-1040', title: 'Can’t reset password (SSO)', name: 'Akshay Kumar', preview: 'SSO splash loops back…', updatedAt: '2d', createdAt: '2 days ago', status: 'answered' },
  { id: 'FS-1039', title: 'Webhook 500 at /events', name: 'Olivia Martin', preview: 'Stack trace shows timeout…', updatedAt: '3d', createdAt: '3 days ago', status: 'in_process' },
];

const DEMO_MESSAGES: Message[] = [
  { id: 'm1', ticketId: 'FS-1042', author: 'requester', name: 'Alice Johnson', body: 'Hi team, my device stopped reporting after midnight. Could you check if server side is fine?', createdAt: '10:12', isPublic: true },
  { id: 'm2', ticketId: 'FS-1042', author: 'agent', name: 'You', body: 'Thanks, Alice. We are checking logs from 00:00–00:10 IST. Will update shortly.', createdAt: '10:18', isPublic: true },
  { id: 'm3', ticketId: 'FS-1042', author: 'requester', name: 'Alice Johnson', body: 'Sharing IMEI: 8629•••732. No wiring changes on our side.', createdAt: '10:25', isPublic: true },
  { id: 'm4', ticketId: 'FS-1042', author: 'agent', name: 'You', body: 'Internal note: suspect SIM APN issue on last carrier hop. Cross‑check tower.', createdAt: '10:27', isPublic: false },
];

const CUSTOMERS = [
  { id: 'c1', name: 'Priya Sharma', email: 'priya@acme.com' },
  { id: 'c2', name: 'Rahul Verma', email: 'rahul@fleetco.io' },
  { id: 'c3', name: 'Anita Desai', email: 'anita@contoso.com' },
  { id: 'c4', name: 'Alice Johnson', email: 'alice@alpha.dev' },
  { id: 'c5', name: 'Zhang Wei', email: 'zwei@logistics.cn' },
];

export default function SupportSplitView() {
  const [tickets, setTickets] = useState<Ticket[]>(DEMO_TICKETS);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string>(tickets[0]?.id ?? "");
  const [draft, setDraft] = useState("");
  const [noteDraft, setNoteDraft] = useState("");
  const [isNewOpen, setIsNewOpen] = useState(false);

  // New Ticket form
  const [newCustomer, setNewCustomer] = useState<{id: string; name: string; email: string} | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  // Paging
  const PAGE_SIZE = 6;
  const [page, setPage] = useState(1);

  // Search focus shortcut
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && !/input|textarea|select/i.test((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Resizable panes (same row)
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftWidth, setLeftWidth] = useState(360);
  const [dragging, setDragging] = useState(false);
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!dragging) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const min = 260;
      const max = Math.min(560, rect.width - 320); // ensure right pane stays usable
      let next = e.clientX - rect.left; // width from container left
      next = Math.max(min, Math.min(max, next));
      setLeftWidth(next);
      e.preventDefault();
    };
    const up = () => setDragging(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
  }, [dragging]);

  // Derived sets
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tickets.filter(t => {
      const matchesQ = !q || t.title.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.name.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      return matchesQ && matchesStatus;
    });
  }, [tickets, query, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const clampedPage = Math.min(page, totalPages);
  useEffect(()=>{ if (page>totalPages) setPage(totalPages); }, [totalPages, page]);
  const pageSlice = useMemo(() => {
    const start = (clampedPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, clampedPage]);

  const active = useMemo(() => tickets.find(t => t.id === selectedId) ?? pageSlice[0] ?? filtered[0], [selectedId, pageSlice, filtered, tickets]);
  const threadPublic = useMemo(() => DEMO_MESSAGES.filter(m => m.ticketId === (active?.id ?? '') && m.isPublic !== false), [active]);
  const threadInternal = useMemo(() => DEMO_MESSAGES.filter(m => m.ticketId === (active?.id ?? '') && m.isPublic === false), [active]);

  // Helpers
  const statusLabel = (s: Status) => ({ open: 'Open', in_process: 'In Process', answered: 'Answered', hold: 'Hold', closed: 'Closed' }[s]);
//   const StatusBadge = ({ s }: { s: Status }) => (
//     <Badge variant="outline" className="border-black/20 text-[11px] font-medium uppercase tracking-wide">
//       {statusLabel(s)}
//     </Badge>
//   );
  const changeStatus = (id: string, s: Status) => setTickets(ts => ts.map(t => t.id === id ? { ...t, status: s } : t));

  const addNewTicket = () => {
    if (!newCustomer || !newTitle.trim()) return;
    const newT: Ticket = {
      id: `FS-${Math.floor(Math.random()*9000 + 1100)}`,
      title: newTitle.trim(),
      name: newCustomer.name,
      preview: newDesc.trim().slice(0, 80),
      updatedAt: 'just now',
      createdAt: 'Now',
      status: 'open',
    };
    setTickets([newT, ...tickets]);
    setSelectedId(newT.id);
    setIsNewOpen(false);
    setNewCustomer(null); setNewTitle(''); setNewDesc('');
  };

  const generateAiDraft = () => {
    const suggestion = `Hi ${active?.name?.split(' ')[0]||'there'}, we reviewed your ticket (${active?.id}). ` +
      `Initial checks show no server‑side errors. Please confirm device power, SIM/APN, and last known location. ` +
      `If the issue persists, we can run a remote diagnostic.

— Fleet Stack Support`;
    setDraft(prev => prev?.trim() ? prev : suggestion);
  };

  return (
    <div className="h-full bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-4 h-full min-h-0 flex flex-col">
        {/* Controls row above the split (headerless) */}
        <div className="mb-4 grid grid-cols-1 md:grid-cols-12 gap-3">
  <div className="md:col-span-4 flex items-center gap-2">
    <div className="relative w-full">
      <SearchIcon className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
      <Input
        ref={searchRef}
        value={query}
        onChange={e => {
          setQuery(e.target.value);
          setPage(1);
        }}
        placeholder="Search by title, ticket id, name… ( / )"
        className="pl-9 border-border text-foreground bg-background focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  </div>

  <div className="md:col-span-8 flex items-center justify-between gap-2">
    {/* Status chip filters */}
    <div className="flex flex-wrap items-center gap-2">
      {(['all', 'open', 'in_process', 'answered', 'hold', 'closed'] as (Status | 'all')[]).map((s) => (
        <Button
          key={s}
          variant={statusFilter === s ? 'default' : 'outline'}
          onClick={() => {
            setStatusFilter(s);
            setPage(1);
          }}
          className={
            statusFilter === s
              ? 'bg-primary text-background'
              : 'border-border text-foreground bg-background hover:bg-foreground/5'
          }
        >
          {s === 'all' ? 'All' : statusLabel(s as Status)}
        </Button>
      ))}
    </div>

    <div className="ml-auto">
      <Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
        <DialogTrigger asChild>
          <Button className="border border-border bg-background hover:bg-foreground/5 text-foreground">
            <AddIcon className="mr-2 h-5 w-5" /> New Ticket
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-lg bg-background text-foreground">
          <DialogHeader>
            <DialogTitle>Create Support Ticket</DialogTitle>
            <DialogDescription className="text-muted">
              Open a ticket on behalf of a customer.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            {/* Customer combobox */}
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">Customer</label>
              <CustomerCombobox value={newCustomer} onChange={setNewCustomer} />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">Title</label>
              <Input
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="Short summary"
                className="border-border bg-background text-foreground"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <Textarea
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                placeholder="Describe the issue…"
                className="min-h-[120px] border-border bg-background text-foreground"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              className="border-border text-foreground"
              onClick={() => setIsNewOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="border border-border bg-background hover:bg-foreground/5 text-foreground"
              onClick={addNewTicket}
            >
              <AddIcon className="mr-2 h-5 w-5" /> Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </div>
</div>


        {/* SAME ROW Split View with resizable panes (Flex) */}
 <div ref={containerRef} className="flex items-stretch gap-2 flex-1 min-h-0">
  {/* Left Pane: Ticket List */}
  <div
    style={{ width: leftWidth }}
    className="rounded-2xl pb-3 border border-border shadow-sm overflow-hidden dark:bg-foreground/5"
  >
    <div className="flex items-center justify-between px-4 py-3 bg-background border-b border-border bg-foreground/10">
      <div className="text-sm font-medium uppercase tracking-wider text-foreground">Inbox</div>
      <div className="text-xs text-muted">{filtered.length} tickets</div>
    </div>

    <div className="h-[calc(100%-92px">
      <ScrollArea className="h-full">
        <ul className="divide-y divide-border">
          {pageSlice.map((t) => {
            const selected = t.id === active?.id;
            return (
              <li key={t.id}>
                <button
                  onClick={() => setSelectedId(t.id)}
                  className={[
                    "block w-full text-left px-4 py-3 transition",
                    selected
                      ? "border border-primary text-white"
                      : "hover:bg-foreground/5",
                  ].join(" ")}
                  aria-current={selected ? "true" : undefined}
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="truncate font-medium leading-tight text-foreground">{t.title}</div>
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <div className="min-w-0 truncate text-muted">
                        {t.id} • {t.name}
                      </div>
                      <div className="shrink-0">
                        <StatusBadge status={t.status} />
                        
                      </div>
                    </div>
                    {t.preview && (
                      <div className="text-sm text-muted line-clamp-1">{t.preview}</div>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </ScrollArea>
    </div>

    {/* Pagination */}
    <div className="px-4 py-3 border-t border-border bg-background flex items-center justify-between text-sm text-foreground">
      <div>Page {clampedPage} / {totalPages}</div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="border-border text-foreground"
          disabled={clampedPage <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </Button>
        <Button
          variant="outline"
          className="border-border text-foreground"
          disabled={clampedPage >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </Button>
      </div>
    </div>
  </div>

  {/* Drag Handle */}
  <div
    className="hidden md:block w-[6px] h-full cursor-col-resize bg-muted hover:bg-border rounded select-none"
    onMouseDown={() => setDragging(true)}
    title="Drag to resize"
    aria-label="Resize"
  />

  {/* Right Pane: Ticket Detail */}
  <div className="flex-1 rounded-2xl border border-border shadow-sm overflow-hidden">
    {active ? (
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-background border-b border-border">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm uppercase tracking-wider text-muted">{active.id}</div>
              <h2 className="mt-1 text-xl font-semibold leading-snug text-foreground">{active.title}</h2>
              <div className="mt-1 flex items-center flex-wrap gap-2 text-sm text-foreground">
                <PersonOutlineIcon fontSize="small" />
                <span>{active.name}</span>
                <span className="text-border">•</span>
                <span>Created: {active.createdAt}</span>
                <span className="text-border">•</span>
                <span>Updated: {active.updatedAt}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={active.status}
                onValueChange={(v) => changeStatus(active.id, v as Status)}
              >
                <SelectTrigger className="w-[170px] border-border text-foreground">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_process">In Process</SelectItem>
                  <SelectItem value="answered">Answered</SelectItem>
                  <SelectItem value="hold">Hold</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Details Bar */}
        <div className="px-5 py-3 bg-background border-b border-border flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted">Status:</span>
          <StatusBadge status={active.status} />
          <span className="text-border">•</span>
          <span className="text-muted">Ticket owner:</span>
          <span className="font-medium text-foreground">{active.name}</span>
        </div>

        {/* Tabs */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Tabs defaultValue="conversation" className="flex-1 flex flex-col overflow-hidden">
            <div className="px-5 pt-3 bg-background border-b border-border">
              <TabsList className="bg-background border border-border rounded-xl">
                <TabsTrigger
                  value="conversation"
                  className="data-[state=active]:bg-primary data-[state=active]:text-background rounded-lg px-4 py-2"
                >
                  Conversation
                </TabsTrigger>
                <TabsTrigger
                  value="internal"
                  className="data-[state=active]:bg-primary data-[state=active]:text-background rounded-lg px-4 py-2"
                >
                  Internal Notes
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Conversation Tab */}
            <TabsContent value="conversation" className="flex-1 flex flex-col overflow-hidden m-0">
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="px-5 py-5 space-y-4">
                    {threadPublic.map((msg) => (
                      <div key={msg.id} className="group">
                        <div className="text-xs text-muted mb-1">
                          {msg.name} • {msg.createdAt}
                        </div>
                        <div
                          className={[
                            "rounded-xl border border-border px-4 py-3",
                            msg.author === "agent"
                              ? "bg-background"
                              : "bg-background",
                          ].join(" ")}
                        >
                          <p className="text-[15px] leading-relaxed whitespace-pre-wrap text-foreground">
                            {msg.body}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              <Separator />
              <div className="px-5 py-4 bg-background">
                <div className="flex items-start gap-3">
                  <NotesIcon className="mt-1" />
                  <div className="flex-1">
                    <Textarea
                      placeholder="Write a reply… (Shift+Enter for newline)"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      className="min-h-[112px] resize-y border-border focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs text-muted">Public reply</div>
                      <div className="flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={generateAiDraft}
                              variant="outline"
                              className="border-border text-foreground"
                            >
                              <AutoAwesomeIcon className="mr-2 h-5 w-5" /> Generate answer by AI
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Prefills a suggested reply draft.</TooltipContent>
                        </Tooltip>
                        <Button className="border border-border bg-background hover:bg-foreground/5 text-foreground">
                          <SendIcon className="mr-2 h-5 w-5" /> Send
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Internal Notes Tab */}
            <TabsContent value="internal" className="flex-1 flex flex-col overflow-hidden m-0">
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="px-5 py-5 space-y-4">
                    {threadInternal.length === 0 && (
                      <div className="text-sm text-muted">No internal notes yet.</div>
                    )}
                    {threadInternal.map((msg) => (
                      <div key={msg.id} className="group">
                        <div className="text-xs text-muted mb-1">
                          {msg.name} • {msg.createdAt} (internal)
                        </div>
                        <div className="rounded-xl border border-border px-4 py-3 bg-background">
                          <p className="text-[15px] leading-relaxed whitespace-pre-wrap text-foreground">
                            {msg.body}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              <Separator />
              <div className="px-5 py-4 bg-background">
                <div className="flex items-start gap-3">
                  <NotesIcon className="mt-1" />
                  <div className="flex-1">
                    <Textarea
                      placeholder="Add a private internal note…"
                      value={noteDraft}
                      onChange={(e) => setNoteDraft(e.target.value)}
                      className="min-h-[100px] resize-y border-border focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <div className="mt-3 flex items-center justify-end gap-2">
                      <Button
                        onClick={() => setNoteDraft("")}
                        variant="outline"
                        className="border-border text-foreground"
                      >
                        Clear
                      </Button>
                      <Button className="border border-border bg-background hover:bg-foreground/5 text-foreground">
                        <SendIcon className="mr-2 h-5 w-5" /> Add note
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    ) : (
      <div className="h-full grid place-items-center text-muted border border-dashed border-border rounded-2xl p-12">
        <div className="max-w-sm text-center">
          <div className="text-lg font-medium text-foreground">Select a ticket</div>
          <p className="mt-1 text-sm text-muted">Choose an item from the left list to view details.</p>
        </div>
      </div>
    )}
  </div>
</div>



      </div>
    </div>
  );
}

// ————————————————————————————————————————————————————————————
// Customer Combobox (shadcn Popover + Command)
// ————————————————————————————————————————————————————————————

function CustomerCombobox({
  value,
  onChange,
}: {
  value: { id: string; name: string; email: string } | null;
  onChange: (v: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const display = value ? `${value.name} — ${value.email}` : "Select customer";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between border-border"
        >
          <span className="truncate text-left">{display}</span>
          <span className="ml-2 text-muted">▾</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-[--radix-popover-trigger-width] bg-background border border-border">
        <Command>
          <CommandInput placeholder="Search customers…" className="text-foreground bg-background" />
          <CommandEmpty className="text-muted">No customers found.</CommandEmpty>
          <CommandGroup>
            {CUSTOMERS.map((c) => (
              <CommandItem
                key={c.id}
                value={c.name}
                onSelect={() => {
                  onChange(c);
                  setOpen(false);
                }}
              >
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">{c.name}</span>
                  <span className="text-xs text-muted">{c.email}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}


