"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// shadcn/ui components — adjust import paths to match your project setup
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils"; // optional helper if you have it

// shadcn Select (ensure these exist in your project)

import {
  SmartCheckboxAutoTable,
  type DisplayMap,
  type FilterConfigMap,
  type MultiSelectOption,
} from "@/components/common/smartcheckboxautotable";

// Material Design Icons (MUI Icons)
import UploadFileIcon from "@mui/icons-material/UploadFile";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";

import {
  DOC_TYPE_OPTIONS,
  DocumentItem,
  FileKind,
} from "@/lib/types/superadmin";
import {
  computeStatus,
  csvEscape,
  daysUntil,
  DEV_runCSVTests,
  FileKindIcon,
  formatBytes,
  formatDate,
  TagInput,
} from "@/lib/utils/superadmin/adminstrator";
import AddEditDialog from "./administrators/documents/AddEditDialog";

// ---------------- Main Component ----------------

export default function AdminDocumentsPage() {
  // 1. DISPLAY OPTIONS
  const displayOptions: DisplayMap<DocumentItem> = {
    0: {
      title: () => <span>Actions</span>,
      content: (row) => (
        <Popover>
          <PopoverTrigger asChild>
            <Button size="icon" variant="ghost">
              <MoreVertIcon fontSize="small" />
            </Button>
          </PopoverTrigger>

          <PopoverContent
            className="w-36 p-2 space-y-1"
            side="bottom"
            align="end"
          >
            <button
              onClick={() => openView(row)}
              className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm hover:bg-accent"
            >
              <VisibilityIcon fontSize="small" />
              <span>View</span>
            </button>

            <button
              onClick={() => openEditDialog(row)}
              className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm hover:bg-accent"
            >
              <EditIcon fontSize="small" />
              <span>Edit</span>
            </button>

            <button
              onClick={() => row}
              className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm hover:bg-accent"
            >
              <DownloadIcon fontSize="small" />
              <span>Download</span>
            </button>

            <button
              onClick={() => removeDoc(row.id)}
              className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm text-red-600 hover:bg-accent/70"
            >
              <DeleteOutlineIcon fontSize="small" />
              <span>Delete</span>
            </button>
          </PopoverContent>
        </Popover>
      ),
      // tooltip: () => "Quick actions",
    },
    1: {
      title: () => <span>File</span>,
      content: (row) => <FileKindIcon kind={row.fileKind} />,
    },
    2: {
      title: () => "Name",
      content: (row) => (
        <div>
          <span className="font-medium">{row.name}</span>
          <Badge variant="outline" className="ml-2">
            v{row.version}
          </Badge>
          <div className="typo-subtitle">{formatBytes(row.size)}</div>
        </div>
      ),
    },
    3: {
      title: () => "Type",
      content: (row) => <span>{row.docType}</span>,
    },
    4: {
      title: () => "Tags",
      content: (row) => (
        <div className="flex gap-1 flex-wrap">
          {row.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-neutral-300 px-2 py-0.5 text-xs text-neutral-700 dark:border-neutral-600 dark:text-neutral-300"
            >
              {tag}
            </span>
          ))}
        </div>
      ),
    },
    5: {
      title: () => "Uploaded",
      content: (row) => <span>{formatDate(row.uploadedAt)}</span>,
    },
    6: {
      title: () => "Expiry",
      content: (row) =>
        row.expiry ? <span>{formatDate(row.expiry)}</span> : <span>—</span>,
    },
    7: {
      title: () => "Status",
      content: (row) => {
        const left = daysUntil(row.expiry ?? undefined);
        if (row.status === "valid") {
          return (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2 py-1 typo-h6",
                "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-400"
              )}
            >
              <CheckCircleIcon fontSize="small" />
              Valid{Number.isFinite(left) ? ` · ${left}d` : ""}
            </span>
          );
        }
        if (row.status === "expiring") {
          return (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2 py-1 typo-h6",
                "border-amber-200 bg-amber-50 text-amber-800 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-400"
              )}
            >
              <WarningAmberIcon fontSize="small" />
              Expiring · {left}d
            </span>
          );
        }
        return (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border px-2 py-1 typo-h6",
              "border-red-200 bg-red-500 text-white dark:border-red-800 dark:bg-red-950 dark:text-red-400"
            )}
          >
            <WarningAmberIcon fontSize="small" />
            Expired
          </span>
        );
      },
    },
  };

  // 2. FILTER CONFIG
  const filterConfig: FilterConfigMap<DocumentItem> = {
    name: { kind: "text", label: "🔍 Search Name", field: "name" },
    docType: {
      kind: "custom",
      label: "📑 Document Type",
      editor: (value, setValue) => (
        <select
          value={value || ""}
          onChange={(e) => setValue(e.target.value)}
          className="border p-1 rounded"
        >
          <option value="">(Any)</option>
          {DOC_TYPE_OPTIONS.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      ),
      predicate: (row, value) => !value || row.docType === value,
    },
    status: {
      kind: "custom",
      label: "📊 Status",
      editor: (value, setValue) => (
        <select
          value={value || ""}
          onChange={(e) => setValue(e.target.value)}
          className="border p-1 rounded"
        >
          <option value="">(Any)</option>
          <option value="valid">Valid</option>
          <option value="expiring">Expiring</option>
          <option value="expired">Expired</option>
        </select>
      ),
      predicate: (row, value) => !value || row.status === value,
    },
    tags: {
      kind: "text",
      label: "🏷️ Search Tags",
      field: "tags",
      // predicate: (row, value) =>
      //   !value ||
      //   (row.tags &&
      //     row.tags.some((tag) =>
      //       tag.toLowerCase().includes(value.toLowerCase())
      //     )),
    },
    uploadedAt: {
      kind: "dateRange",
      label: "📅 Upload Date",
      field: "uploadedAt",
    },
    expiry: {
      kind: "dateRange",
      label: "⏳ Expiry Date",
      field: "expiry",
    },
  };

  // 3. BULK ACTIONS
  const bulkActions: MultiSelectOption<DocumentItem>[] = [
    {
      name: "🗑️ Delete Selected",
      iconName: "delete_outline",
      variant: "destructive",
      tooltip: "Delete all selected documents",
      callback: (rows, ids) => {
        setDocs((prev) => prev.filter((d) => !ids.has(d.id)));
      },
    },
    {
      name: "⬇️ Export as CSV",
      iconName: "download",
      variant: "outline",
      tooltip: "Export selected rows to CSV",
      callback: (rows) => {
        if (!rows.length) return;
        const headers = [
          "Name",
          "BusinessDocType",
          "FileKind",
          "Size",
          "UploadedAt",
          "Expiry",
          "Status",
          "Version",
          "Tags",
        ];
        const lines = [headers.join(",")];
        rows.forEach((d) => {
          const line = [
            d.name,
            d.docType,
            d.fileKind,
            d.size,
            d.uploadedAt.toISOString(),
            d.expiry ? d.expiry.toISOString() : "",
            d.status,
            d.version,
            d.tags.join(";"),
          ]
            .map(csvEscape)
            .join(",");
          lines.push(line);
        });
        const blob = new Blob([lines.join("\n")], {
          type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `admin-documents-${new Date()
          .toISOString()
          .slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      },
    },
    {
      name: "👁️ View First",
      iconName: "remove_red_eye",
      variant: "outline",
      tooltip: "View the first selected document",
      callback: (rows) => {
        if (rows.length) openView(rows[0]);
      },
    },
  ];

  // Seed data
  const [docs, setDocs] = useState<DocumentItem[]>(() => {
    const now = new Date();
    const in15 = new Date(now.getTime() + 15 * 86400000);
    const in45 = new Date(now.getTime() + 45 * 86400000);
    const twoAgo = new Date(now.getTime() - 2 * 86400000);
    return [
      {
        id: crypto.randomUUID(),
        name: "Company PAN Certificate.pdf",
        fileKind: "pdf",
        size: 348_576,
        uploadedAt: new Date(now.getTime() - 12 * 86400000),
        expiry: in45,
        tags: ["finance", "compliance"],
        status: "valid",
        version: 3,
        docType: "PAN Card",
      },
      {
        id: crypto.randomUUID(),
        name: "Driver Employment Contract – Aarav Sharma.pdf",
        fileKind: "pdf",
        size: 1_048_112,
        uploadedAt: new Date(now.getTime() - 3 * 86400000),
        expiry: in15,
        tags: ["hr", "driver"],
        status: "expiring",
        version: 1,
        docType: "Employment Contract",
      },
      {
        id: crypto.randomUUID(),
        name: "Vendor NDA (Traccar Integration).pdf",
        fileKind: "pdf",
        size: 812_990,
        uploadedAt: twoAgo,
        expiry: new Date(now.getTime() - 1 * 86400000),
        tags: ["legal", "nda"],
        status: "expired",
        version: 2,
        docType: "NDA / Confidentiality Agreement",
      },
      {
        id: crypto.randomUUID(),
        name: "Insurance Policy – HQ Servers.docx",
        fileKind: "doc",
        size: 532_480,
        uploadedAt: new Date(now.getTime() - 30 * 86400000),
        expiry: null,
        tags: ["ops", "infra"],
        status: "valid",
        version: 5,
        docType: "Insurance Policy",
      },
    ].map((d) => ({ ...d, status: computeStatus(d.expiry) })) as DocumentItem[];
  });

  const [query, setQuery] = useState("");
  const [fileKindFilter, setFileKindFilter] = useState<FileKind | "all">("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "valid" | "expiring" | "expired"
  >("all");
  const [docTypeFilter, setDocTypeFilter] = useState<
    "all" | DocumentItem["docType"]
  >("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

  // Upload / Edit / View dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [openViewer, setOpenViewer] = useState(false);
  const [viewerDoc, setViewerDoc] = useState<DocumentItem | null>(null);

  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formExpiry, setFormExpiry] = useState<Date | undefined>();
  const [formTags, setFormTags] = useState<string[]>([]);
  const [formFile, setFormFile] = useState<File | null>(null);
  const [formNotes, setFormNotes] = useState("");
  const [formDocType, setFormDocType] =
    useState<DocumentItem["docType"]>("PAN Card");

  const searchRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Ctrl/Cmd+K focuses search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMod = navigator.platform.includes("Mac") ? e.metaKey : e.ctrlKey;
      if (isMod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Derived collections
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = docs.filter((d) => {
      const matchesQuery =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.tags.join(" ").toLowerCase().includes(q) ||
        d.docType.toLowerCase().includes(q);
      const matchesFileKind =
        fileKindFilter === "all" || d.fileKind === fileKindFilter;
      const matchesStatus = statusFilter === "all" || d.status === statusFilter;
      const matchesDocType =
        docTypeFilter === "all" || d.docType === docTypeFilter;
      return matchesQuery && matchesFileKind && matchesStatus && matchesDocType;
    });
    // sort: Expiring soon first, then recent uploads
    list = list.sort((a, b) => {
      const da = a.expiry ? daysUntil(a.expiry) : Infinity;
      const db = b.expiry ? daysUntil(b.expiry) : Infinity;
      if (da !== db) return da - db; // sooner first
      return b.uploadedAt.getTime() - a.uploadedAt.getTime();
    });
    return list;
  }, [docs, query, fileKindFilter, statusFilter, docTypeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  // Storage usage (fake calculation from sizes)
  const storageUsed = useMemo(
    () => docs.reduce((acc, d) => acc + d.size, 0),
    [docs]
  );
  const storageQuota = 5 * 1024 * 1024 * 1024; // 5 GB for demo
  const storagePct = Math.min(
    100,
    Math.round((storageUsed / storageQuota) * 100)
  );

  // ---------- Handlers ----------
  function resetForm() {
    setEditingDocId(null);
    setFormName("");
    setFormExpiry(undefined);
    setFormTags([]);
    setFormFile(null);
    setFormNotes("");
    setFormDocType("PAN Card");
  }

  function openAddDialog() {
    resetForm();
    setOpenDialog(true);
  }

  function openEditDialog(doc: DocumentItem) {
    setEditingDocId(doc.id);
    setFormName(doc.name);
    setFormExpiry(doc.expiry ?? undefined);
    setFormTags(doc.tags);
    setFormFile(null);
    setFormNotes("");
    setFormDocType(doc.docType);
    setOpenDialog(true);
  }

  function openView(doc: DocumentItem) {
    setViewerDoc(doc);
    setOpenViewer(true);
  }

  function removeDoc(id: string) {
    setDocs((prev) => prev.filter((d) => d.id !== id));
    setSelectedIds((prev) => {
      const n = new Set(prev);
      n.delete(id);
      return n;
    });
  }

  function exportSelectedAsCSV() {
    if (!selectedIds.size) return;
    const rows = docs.filter((d) => selectedIds.has(d.id));
    const headers = [
      "Name",
      "BusinessDocType",
      "FileKind",
      "Size",
      "UploadedAt",
      "Expiry",
      "Status",
      "Version",
      "Tags",
    ];
    const lines = [headers.join(",")];
    for (const d of rows) {
      const line = [
        d.name,
        d.docType,
        d.fileKind,
        d.size,
        d.uploadedAt.toISOString(),
        d.expiry ? d.expiry.toISOString() : "",
        d.status,
        d.version,
        d.tags.join(";"),
      ]
        .map(csvEscape)
        .join(",");
      lines.push(line);
    }
    // FIX: Use "\n" not a broken multiline string
    const blob = new Blob([lines.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `admin-documents-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function toggleSelect(id: string, checked: boolean | "indeterminate") {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function toggleSelectAll(checked: boolean | "indeterminate") {
    if (checked) {
      setSelectedIds(new Set(pageData.map((d) => d.id)));
    } else {
      setSelectedIds(new Set());
    }
  }

  // -------------- Sub Components --------------

  const StatusBadge = ({
    status,
    expiry,
  }: {
    status: DocumentItem["status"];
    expiry?: Date | null;
  }) => {
    const left = daysUntil(expiry ?? undefined);
    const base =
      "inline-flex items-center gap-1 rounded-full border px-2 py-1 typo-h6 tracking-wide";
    if (status === "valid") {
      return (
        <span
          className={cn(
            base,
            "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-400"
          )}
        >
          <CheckCircleIcon
            fontSize="small"
            className="text-green-600 dark:text-green-500"
          />
          Valid{Number.isFinite(left) ? ` · ${left}d` : ""}
        </span>
      );
    }
    if (status === "expiring") {
      return (
        <span
          className={cn(
            base,
            "border-amber-200 bg-amber-50 text-amber-800 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-400"
          )}
        >
          <WarningAmberIcon
            fontSize="small"
            className="text-amber-600 dark:text-orange-500"
          />
          Expiring · {left}d
        </span>
      );
    }
    return (
      <span
        className={cn(
          base,
          "border-red-200 bg-red-500 text-white dark:border-red-800 dark:bg-red-950 dark:text-red-400"
        )}
      >
        <WarningAmberIcon fontSize="small" />
        Expired
      </span>
    );
  };

  // -------------- Render --------------

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-background"
          >
            <UploadFileIcon className="text-foreground" />
          </motion.div>
          <div>
            <h1 className="typo-h1">
              Admin Documents
            </h1>
            <p className="text-sm text-muted">
              Black & white. Pixel-perfect. View, add, track, and export admin
              documents.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={openAddDialog}
            className="rounded-xl bg-primary text-white"
          >
            <UploadFileIcon className="mr-2 h-5 w-5" /> New Document
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mb-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-4 dark:bg-foreground/5">
          <div className="text-sm text-muted">Total documents</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="typo-h1 font-semibold text-foreground">
              {docs.length}
            </span>
            <Badge
              variant="outline"
              className="rounded-full border-border typo-p12n"
            >
              v{docs.reduce((a, b) => a + b.version, 0)}
            </Badge>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 dark:bg-foreground/5">
          <div className="text-sm text-muted">Health Status</div>
          <div className="mt-2 flex flex-wrap gap-2 typo-p12n">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-1 text-success cursor-help">
                    <CheckCircleIcon fontSize="small" />{" "}
                    {docs.filter((d) => d.status === "valid").length}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">
                    <strong>Valid Documents:</strong>{" "}
                    {docs.filter((d) => d.status === "valid").length} documents
                    <br />
                    Documents that are current and not expiring within 30 days
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2 py-1 text-warning cursor-help">
                    <WarningAmberIcon fontSize="small" />{" "}
                    {docs.filter((d) => d.status === "expiring").length}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">
                    <strong>Expiring Soon:</strong>{" "}
                    {docs.filter((d) => d.status === "expiring").length}{" "}
                    documents
                    <br />
                    Documents that will expire within the next 30 days
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center gap-1 rounded-full bg-error/10 px-2 py-1 text-error cursor-help">
                    <WarningAmberIcon fontSize="small" />{" "}
                    {docs.filter((d) => d.status === "expired").length}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">
                    <strong>Expired:</strong>{" "}
                    {docs.filter((d) => d.status === "expired").length}{" "}
                    documents
                    <br />
                    Documents that have already passed their expiry date
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 sm:col-span-2 lg:col-span-1 dark:bg-foreground/5">
          <div className="flex items-center justify-between text-sm text-muted">
            <span>Storage used</span>
            <span className="font-medium">
              {formatBytes(storageUsed)} / {formatBytes(storageQuota)}
            </span>
          </div>
          <Progress value={storagePct} className="mt-3 h-2 bg-foreground/5" />
          <div className="mt-2 typo-subtitle">
            {storagePct.toFixed(1)}% used
          </div>
        </div>
      </div>

      {/* Bulk bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mb-3 flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          >
            <span>{selectedIds.size} selected</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="rounded-lg border-neutral-300 text-neutral-900 hover:bg-white dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-700"
                onClick={exportSelectedAsCSV}
              >
                <DownloadIcon className="mr-2" /> Export
              </Button>
              <Button
                variant="outline"
                className="rounded-lg border-neutral-300 text-neutral-900 hover:bg-white dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-700"
                onClick={() => selectedIds.forEach((id) => removeDoc(id))}
              >
                <DeleteOutlineIcon className="mr-2" /> Delete
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Documents Table */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-700">
        <div className="overflow-x-auto">
          <SmartCheckboxAutoTable<DocumentItem>
            title="Admin Documents"
            data={docs}
            getRowId={(row) => row.id}
            displayOptions={displayOptions}
            filterConfig={filterConfig}
            // multiSelectOptions={bulkActions}
            onRowClick={(row) => openView(row)}
            // onRefresh={() => {
            //   /* Implement refresh logic if using an API */
            // }}
            exportBrand={{
              name: "Fleet Stack",
              logoUrl: "/images/logo-light.png",
              addressLine1: "Self-Hosted GPS Software",
              addressLine2: "fleetstackglobal.com",
              footerNote: "We make it easiest — just deploy.",
            }}
          />
        </div>
      </div>

      {/* Add / Edit Dialog */}
      <AddEditDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        openViewer={openViewer}
        setOpenViewer={setOpenViewer}
        viewerDoc={viewerDoc}
        setViewerDoc={setViewerDoc}
        editingDocId={editingDocId}
        setEditingDocId={setEditingDocId}
        formName={formName}
        setFormName={setFormName}
        formExpiry={formExpiry}
        setFormExpiry={setFormExpiry}
        formTags={formTags}
        setFormTags={setFormTags}
        formFile={formFile}
        setFormFile={setFormFile}
        formNotes={formNotes}
        setFormNotes={setFormNotes}
        formDocType={formDocType}
        setFormDocType={setFormDocType}
        setDocs={setDocs}
        resetForm={resetForm} // optional
        openView={openView}
      />

      {/* Viewer Dialog */}
      <Dialog open={openViewer} onOpenChange={setOpenViewer}>
        <DialogContent className="sm:max-w-4xl dark:bg-neutral-900 dark:border-neutral-700">
          <DialogHeader>
            <DialogTitle className="text-neutral-900 flex items-center justify-between dark:text-neutral-100">
              <span>{viewerDoc?.name ?? "Preview"}</span>
              {viewerDoc?.url && (
                <Button
                  variant="outline"
                  className="rounded-lg border-neutral-300 text-neutral-900 hover:bg-white dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-700"
                  onClick={() => {
                    const a = document.createElement("a");
                    a.href = viewerDoc.url!;
                    a.download = viewerDoc.name;
                    a.click();
                  }}
                >
                  <DownloadIcon className="mr-2" /> Download
                </Button>
              )}
            </DialogTitle>
            <DialogDescription className="text-neutral-500 dark:text-neutral-400">
              Quick preview
            </DialogDescription>
          </DialogHeader>

          <div className="h-[70vh] w-full overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800">
            {viewerDoc?.url ? (
              viewerDoc.fileKind === "image" ? (
                <img
                  src={viewerDoc.url}
                  alt={viewerDoc.name}
                  className="h-full w-full object-contain"
                />
              ) : (
                // For pdf/doc/other — attempt to embed; pdfs display well
                <iframe
                  src={viewerDoc.url}
                  className="h-full w-full"
                  title="document preview"
                />
              )
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-neutral-500 dark:text-neutral-400">
                No preview available
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---------------- Tag Input ----------------

if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  try {
    DEV_runCSVTests();
  } catch (_) {}
}
