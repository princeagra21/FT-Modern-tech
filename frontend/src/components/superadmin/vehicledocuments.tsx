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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils"; // optional helper if you have it

// shadcn Select (ensure these exist in your project)
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Material Design Icons (MUI Icons)
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DescriptionIcon from "@mui/icons-material/Description";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import TagIcon from "@mui/icons-material/Tag";

// ---------------- Types ----------------

type FileKind = "pdf" | "image" | "doc" | "other"; // actual file type

const DOC_TYPE_OPTIONS = [
  "PAN Card",
  "Employment Contract",
  "NDA / Confidentiality Agreement",
  "Driver License",
  "Insurance Policy",
  "Company Registration",
  "Bank Statement",
  "Address Proof",
  "Other",
] as const;

export type DocumentItem = {
  id: string;
  name: string;
  fileKind: FileKind;
  size: number; // in bytes
  uploadedAt: Date;
  expiry?: Date | null;
  tags: string[];
  status: "valid" | "expiring" | "expired";
  version: number;
  url?: string; // Object URL for uploaded files (client-only)
  docType: typeof DOC_TYPE_OPTIONS[number]; // Business doc type
};

// ---------------- Utilities ----------------

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function daysUntil(date?: Date | null) {
  if (!date) return Infinity;
  const oneDay = 1000 * 60 * 60 * 24;
  const diff = date.getTime() - new Date().setHours(0, 0, 0, 0);
  return Math.floor(diff / oneDay);
}

function computeStatus(expiry?: Date | null): "valid" | "expiring" | "expired" {
  if (!expiry) return "valid";
  const left = daysUntil(expiry);
  if (left < 0) return "expired";
  if (left <= 30) return "expiring";
  return "valid";
}

function formatDate(d: Date | undefined | null) {
  if (!d) return "—";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

// CSV helpers (fixes the unterminated string bug & ensures compliant quoting)
function csvEscape(v: unknown) {
  const s = String(v);
  // Escape double quotes by doubling them per RFC 4180
  const escaped = s.replace(/"/g, '""');
  return `"${escaped}"`;
}

// ---------------- Main Component ----------------

export default function VehicleDocumentsPage() {
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
  const [statusFilter, setStatusFilter] = useState<"all" | "valid" | "expiring" | "expired">("all");
  const [docTypeFilter, setDocTypeFilter] = useState<"all" | DocumentItem["docType"]>("all");
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
  const [formDocType, setFormDocType] = useState<DocumentItem["docType"]>("PAN Card");

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
      const matchesFileKind = fileKindFilter === "all" || d.fileKind === fileKindFilter;
      const matchesStatus = statusFilter === "all" || d.status === statusFilter;
      const matchesDocType = docTypeFilter === "all" || d.docType === docTypeFilter;
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
  const storageUsed = useMemo(() => docs.reduce((acc, d) => acc + d.size, 0), [docs]);
  const storageQuota = 5 * 1024 * 1024 * 1024; // 5 GB for demo
  const storagePct = Math.min(100, Math.round((storageUsed / storageQuota) * 100));

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

  function onDropFiles(files: FileList | null) {
    if (!files || !files.length) return;
    const f = files[0];
    setFormFile(f);
    if (!formName) setFormName(f.name);
  }

  function inferFileKind(file?: File | null): FileKind {
    if (!file) return "other";
    const mime = file.type;
    if (mime.includes("pdf")) return "pdf";
    if (mime.includes("image")) return "image";
    if (mime.includes("word") || file.name.endsWith(".docx")) return "doc";
    return "other";
  }

  function saveDoc() {
    if (!formName.trim()) return alert("Please provide a document name.");
    if (!formDocType) return alert("Please select a Document Type.");

    const base: Partial<DocumentItem> = {
      name: formName.trim(),
      expiry: formExpiry ?? null,
      tags: formTags,
      docType: formDocType,
    };

    if (editingDocId) {
      setDocs((prev) =>
        prev.map((d) => {
          if (d.id !== editingDocId) return d;
          let url = d.url;
          let size = d.size;
          let fileKind = d.fileKind;
          let version = d.version;
          if (formFile) {
            url = URL.createObjectURL(formFile);
            size = formFile.size;
            fileKind = inferFileKind(formFile);
            version = d.version + 1;
          }
          const expiry = base.expiry ?? null;
          return {
            ...d,
            name: base.name!,
            tags: base.tags!,
            url,
            size,
            fileKind,
            version,
            expiry,
            docType: base.docType!,
            status: computeStatus(expiry),
          };
        })
      );
    } else {
      if (!formFile) return alert("Please upload a file.");
      const fileKind = inferFileKind(formFile);
      const url = URL.createObjectURL(formFile);
      const expiry = base.expiry ?? null;
      const newDoc: DocumentItem = {
        id: crypto.randomUUID(),
        name: base.name!,
        tags: base.tags!,
        fileKind,
        size: formFile.size,
        uploadedAt: new Date(),
        expiry,
        status: computeStatus(expiry),
        version: 1,
        url,
        docType: base.docType!,
      };
      setDocs((prev) => [newDoc, ...prev]);
      
      // Show preview after upload
      setTimeout(() => {
        openView(newDoc);
      }, 100);
    }

    setOpenDialog(false);
    resetForm();
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
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
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

  const StatusBadge = ({ status, expiry }: { status: DocumentItem["status"]; expiry?: Date | null }) => {
    const left = daysUntil(expiry ?? undefined);
    const base = "inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium tracking-wide";
    if (status === "valid") {
      return (
        <span className={cn(base, "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-200")}>
          <CheckCircleIcon fontSize="small" className="text-green-600 dark:text-green-400"/> 
          Valid{Number.isFinite(left) ? ` · ${left}d` : ""}
        </span>
      );
    }
    if (status === "expiring") {
      return (
        <span className={cn(base, "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-200")}>
          <WarningAmberIcon fontSize="small" className="text-amber-600 dark:text-amber-400"/> 
          Expiring · {left}d
        </span>
      );
    }
    return (
      <span className={cn(base, "border-red-200 bg-red-500 text-white dark:border-red-800 dark:bg-red-900 dark:text-red-100")}>
        <WarningAmberIcon fontSize="small"/> 
        Expired
      </span>
    );
  };

  const FileKindIcon = ({ kind }: { kind: FileKind }) => {
    if (kind === "pdf") return <DescriptionIcon className="text-neutral-900 dark:text-neutral-100"/>;
    if (kind === "image") return <div className="h-5 w-5 rounded-sm border border-neutral-400 dark:border-neutral-600"/>;
    if (kind === "doc") return <DescriptionIcon className="text-neutral-700 dark:text-neutral-300"/>;
    return <DescriptionIcon className="text-neutral-500 dark:text-neutral-400"/>;
  };

  const DropZone = () => {
    const [hover, setHover] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const handleButtonClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      fileInputRef.current?.click();
    };

    const handleRemoveFile = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setFormFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    
    return (
      <div
        onDragOver={(e) => { e.preventDefault(); setHover(true); }}
        onDragLeave={() => setHover(false)}
        onDrop={(e) => { e.preventDefault(); setHover(false); onDropFiles(e.dataTransfer.files); }}
        className={cn(
          "group flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed p-8 text-center transition-all",
          hover ? "border-neutral-900 dark:border-neutral-100 bg-neutral-50 dark:bg-neutral-800" : "border-neutral-300 dark:border-neutral-600"
        )}
      >
        <CloudUploadIcon className="h-7 w-7 text-neutral-900 dark:text-neutral-100"/>
        <div className="text-sm text-neutral-800 dark:text-neutral-200">Drag & drop your file here</div>
        <div className="text-xs text-neutral-500 dark:text-neutral-400">PDF, Images, DOCX — up to 50 MB</div>
        
        {!formFile ? (
          <div className="mt-1 flex items-center justify-center">
            <button
              type="button"
              onClick={handleButtonClick}
              className="inline-flex items-center gap-2 rounded-full bg-neutral-900 dark:bg-white px-6 py-2.5 text-sm font-medium text-white dark:text-black transition-colors hover:bg-black dark:hover:bg-neutral-100"
            >
              <UploadFileIcon className="h-4 w-4" />
              Choose file
            </button>
          </div>
        ) : (
          <div className="mt-1 flex items-center justify-center">
            <div className="flex items-center gap-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-3 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-700">
                  <FileKindIcon kind={inferFileKind(formFile)} />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-neutral-800 dark:text-neutral-100 truncate max-w-[150px]">{formFile.name}</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">{formatBytes(formFile.size)}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-200 transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          onChange={(e) => onDropFiles(e.target.files)}
          className="hidden"
        />
      </div>
    );
  };

  // -------------- Render --------------

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex h-11 w-11 items-center justify-center rounded-2xl border border-neutral-200 dark:border-neutral-700 dark:text-neutral-100">
            <UploadFileIcon/>
          </motion.div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">Vehicle Documents</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Black & white. Pixel-perfect. View, add, track, and export vehicle documents.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={openAddDialog} className="rounded-xl bg-neutral-900 dark:bg-white px-4 py-2 text-white dark:text-black hover:bg-black dark:hover:bg-neutral-100">
            <UploadFileIcon className="mr-2 h-5 w-5"/> New Document
          </Button>

        </div>
      </div>

      {/* Quick Stats */}
      <div className="mb-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 p-4">
          <div className="text-sm text-neutral-500 dark:text-neutral-400">Total documents</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">{docs.length}</span>
            <Badge variant="outline" className="rounded-full border-neutral-300 dark:border-neutral-600 text-xs dark:text-neutral-100">v{docs.reduce((a,b)=>a+b.version,0)}</Badge>
          </div>
        </div>
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 p-4">
          <div className="text-sm text-neutral-500 dark:text-neutral-400">Health Status</div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs sm:text-sm">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center gap-1 text-green-700 dark:text-green-200 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full cursor-help">
                    <CheckCircleIcon fontSize="small"/> {docs.filter(d=>d.status==="valid").length}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">
                    <strong>Valid Documents:</strong> {docs.filter(d=>d.status==="valid").length} documents<br/>
                    Documents that are current and not expiring within 30 days
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-200 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded-full cursor-help">
                    <WarningAmberIcon fontSize="small"/> {docs.filter(d=>d.status==="expiring").length}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">
                    <strong>Expiring Soon:</strong> {docs.filter(d=>d.status==="expiring").length} documents<br/>
                    Documents that will expire within the next 30 days
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex items-center gap-1 text-red-700 dark:text-red-200 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded-full cursor-help">
                    <WarningAmberIcon fontSize="small"/> {docs.filter(d=>d.status==="expired").length}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">
                    <strong>Expired:</strong> {docs.filter(d=>d.status==="expired").length} documents<br/>
                    Documents that have already passed their expiry date
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 p-4 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400">
            <span>Storage used</span>
            <span className="text-neutral-900 dark:text-neutral-100 font-medium">{formatBytes(storageUsed)} / {formatBytes(storageQuota)}</span>
          </div>
          <Progress value={storagePct} className="mt-3 h-2 bg-neutral-100 dark:bg-neutral-700" />
          <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">{storagePct.toFixed(1)}% used</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full items-center gap-2 lg:w-auto">
          <div className="relative w-full lg:w-80 xl:w-96">
            <Input
              ref={searchRef}
              placeholder="Search by name, tags, or Document Type (Ctrl/Cmd+K)"
              value={query}
              onChange={(e)=>{setQuery(e.target.value); setPage(1);}}
              className="rounded-xl border-neutral-300 dark:border-neutral-600 pr-10 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus-visible:ring-neutral-900 dark:focus-visible:ring-neutral-100 dark:bg-neutral-800"
            />
            <SearchIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-700 dark:text-neutral-300"/>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="rounded-xl border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                <FilterListIcon className="mr-2"/> Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="z-[99999] w-96 rounded-2xl border-neutral-200 dark:border-neutral-700 p-4">
              <div className="space-y-4">
                <div>
                  <div className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">File Kind</div>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {["all","pdf","image","doc","other"].map((t)=> (
                      <button
                        key={t}
                        onClick={()=>{setFileKindFilter(t as any); setPage(1);}}
                        className={cn("rounded-full border px-3 py-1", t===fileKindFilter ? "border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white text-white dark:text-black" : "border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-700")}
                      >{t}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Status</div>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {["all","valid","expiring","expired"].map((s)=> (
                      <button
                        key={s}
                        onClick={()=>{setStatusFilter(s as any); setPage(1);}}
                        className={cn("rounded-full border px-3 py-1", s===statusFilter ? "border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white text-white dark:text-black" : "border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-700")}
                      >{s}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Document Type</div>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <button
                      onClick={()=> { setDocTypeFilter("all"); setPage(1); }}
                      className={cn("rounded-full border px-3 py-1", docTypeFilter === "all" ? "border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white text-white dark:text-black" : "border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-700")}
                    >All</button>
                    {DOC_TYPE_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        onClick={()=> { setDocTypeFilter(opt); setPage(1); }}
                        className={cn("rounded-full border px-3 py-1", docTypeFilter === opt ? "border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white text-white dark:text-black" : "border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-700")}
                      >{opt}</button>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-sm text-neutral-500 dark:text-neutral-400">Rows</span>
            <select
              value={perPage}
              onChange={(e)=>{setPerPage(parseInt(e.target.value)); setPage(1);}}
              className="rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-2 py-1 text-sm text-neutral-900 dark:text-neutral-100"
            >
              {[10,20,50].map(n=> (<option key={n} value={n}>{n}</option>))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={()=> setPage((p)=> Math.max(1, p-1))} className="rounded-lg border border-neutral-300 dark:border-neutral-600 px-2 py-1 text-sm text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-700">Prev</button>
            <span className="min-w-[80px] text-center text-sm text-neutral-700 dark:text-neutral-300">{page}/{totalPages}</span>
            <button onClick={()=> setPage((p)=> Math.min(totalPages, p+1))} className="rounded-lg border border-neutral-300 dark:border-neutral-600 px-2 py-1 text-sm text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-700">Next</button>
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
            className="mb-3 flex items-center justify-between rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-4 py-2 text-sm text-neutral-900 dark:text-neutral-100"
          >
            <span>{selectedIds.size} selected</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="rounded-lg border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 hover:bg-white dark:hover:bg-neutral-700" onClick={exportSelectedAsCSV}><DownloadIcon className="mr-2"/> Export</Button>
              <Button variant="outline" className="rounded-lg border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 hover:bg-white dark:hover:bg-neutral-700" onClick={()=> selectedIds.forEach((id)=> removeDoc(id))}><DeleteOutlineIcon className="mr-2"/> Delete</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Documents Table */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800">
        <div className="overflow-x-auto">
          <Table>
          <TableHeader>
            <TableRow className="hover:bg-white dark:hover:bg-neutral-800">
              <TableHead className="w-[80px] dark:text-neutral-300">Actions</TableHead>
              <TableHead className="w-[40px]"><Checkbox checked={pageData.length>0 && pageData.every(d=> selectedIds.has(d.id))} onCheckedChange={toggleSelectAll} aria-label="Select all"/></TableHead>
              <TableHead className="w-[28px] dark:text-neutral-300">File</TableHead>
              <TableHead className="dark:text-neutral-300">Name</TableHead>
              <TableHead className="dark:text-neutral-300">Document Type</TableHead>
              <TableHead className="hidden sm:table-cell dark:text-neutral-300">Tags</TableHead>
              <TableHead className="hidden md:table-cell dark:text-neutral-300">Uploaded</TableHead>
              <TableHead className="hidden lg:table-cell dark:text-neutral-300">Expiry</TableHead>
              <TableHead className="dark:text-neutral-300">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageData.map((d) => (
              <TableRow key={d.id} className="group/table-row dark:border-neutral-700 dark:hover:bg-neutral-800/50">
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 rounded-full p-0 hover:bg-neutral-100 dark:hover:bg-neutral-700"><MoreVertIcon/></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="z-[9999] min-w-52 border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700">
                      <DropdownMenuLabel className="dark:text-neutral-100">Quick actions</DropdownMenuLabel>
                      <DropdownMenuSeparator className="dark:bg-neutral-700"/>
                      <DropdownMenuItem onClick={() => openView(d)} className="dark:text-neutral-100 dark:hover:bg-neutral-700"><VisibilityIcon className="mr-2"/> View</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditDialog(d)} className="dark:text-neutral-100 dark:hover:bg-neutral-700"><EditIcon className="mr-2"/> Edit / New version</DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          if (d.url) {
                            const a = document.createElement("a");
                            a.href = d.url;
                            a.download = d.name;
                            a.click();
                          } else {
                            alert("No file available to download (seeded demo).");
                          }
                        }}
                        className="dark:text-neutral-100 dark:hover:bg-neutral-700"
                      >
                        <DownloadIcon className="mr-2"/> Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => removeDoc(d.id)} className="text-red-600 dark:text-red-400 dark:hover:bg-neutral-700"><DeleteOutlineIcon className="mr-2"/> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell><Checkbox checked={selectedIds.has(d.id)} onCheckedChange={(v)=> toggleSelect(d.id, v)} aria-label={`Select ${d.name}`}/></TableCell>
                <TableCell><div className="flex items-center justify-center"><FileKindIcon kind={d.fileKind}/></div></TableCell>
                <TableCell className="max-w-[320px]">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium text-neutral-900 dark:text-neutral-100">{d.name}</span>
                    <Badge variant="outline" className="rounded-full border-neutral-300 dark:border-neutral-600 text-[10px] dark:text-neutral-300">v{d.version}</Badge>
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">{formatBytes(d.size)}</div>
                </TableCell>
                <TableCell className="text-sm text-neutral-900 dark:text-neutral-100">{d.docType}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {d.tags.map((t) => (
                      <span key={t} className="rounded-full border border-neutral-300 dark:border-neutral-600 px-2 py-0.5 text-xs text-neutral-700 dark:text-neutral-300">{t}</span>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-neutral-900 dark:text-neutral-100">{formatDate(d.uploadedAt)}</TableCell>
                <TableCell className="hidden lg:table-cell text-sm text-neutral-900 dark:text-neutral-100">{formatDate(d.expiry ?? null)}</TableCell>
                <TableCell><StatusBadge status={d.status} expiry={d.expiry ?? null}/></TableCell>
              </TableRow>
            ))}

            {pageData.length === 0 && (
              <TableRow className="dark:border-neutral-700">
                <TableCell colSpan={9}>
                  <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800">
                      <UploadFileIcon className="dark:text-neutral-400"/>
                    </div>
                    <div className="text-lg font-medium text-neutral-900 dark:text-neutral-100">No documents match your filters</div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">Try adjusting search or filters — or add a new document.</div>
                    <div className="mt-2"><Button onClick={openAddDialog} className="rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-neutral-100">Add document</Button></div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </div>
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-neutral-900 dark:text-neutral-100">{editingDocId ? "Edit Document" : "Add Document"}</DialogTitle>
            <DialogDescription className="text-neutral-500 dark:text-neutral-400">Document Type, name, file, expiry, tags — clean and compliant.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-neutral-800 dark:text-neutral-200">Document Type</Label>
                <Select value={formDocType} onValueChange={(v)=> setFormDocType(v as DocumentItem["docType"]) }>
                  <SelectTrigger className="rounded-xl border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 dark:bg-neutral-800 focus-visible:ring-neutral-900 dark:focus-visible:ring-neutral-100">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="z-[99999] rounded-2xl border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800">
                    {DOC_TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="doc-name" className="text-neutral-800 dark:text-neutral-200">Name</Label>
                <div className="flex items-center gap-2">
                  <DriveFileRenameOutlineIcon className="text-neutral-700 dark:text-neutral-300"/>
                  <Input id="doc-name" value={formName} onChange={(e)=> setFormName(e.target.value)} placeholder="e.g., Insurance Policy 2025.pdf" className="rounded-xl border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 dark:bg-neutral-800 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus-visible:ring-neutral-900 dark:focus-visible:ring-neutral-100"/>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-neutral-800 dark:text-neutral-200">Expiry (optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start rounded-xl border-neutral-300 dark:border-neutral-600 text-left font-normal text-neutral-900 dark:text-neutral-100 dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      <CalendarMonthIcon className="mr-2"/>
                      {formExpiry ? formatDate(formExpiry) : <span className="text-neutral-400 dark:text-neutral-500">Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="z-[99999] w-auto rounded-2xl border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 p-0">
                    <Calendar mode="single" selected={formExpiry} onSelect={setFormExpiry} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="text-neutral-800 dark:text-neutral-200">Tags</Label>
                <TagInput value={formTags} onChange={setFormTags}/>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-neutral-800 dark:text-neutral-200">Upload</Label>
                <DropZone/>
              </div>

              <div className="space-y-2">
                <Label className="text-neutral-800 dark:text-neutral-200">Notes (optional)</Label>
                <Textarea value={formNotes} onChange={(e)=> setFormNotes(e.target.value)} placeholder="Any context for admins…" className="min-h-[88px] rounded-xl border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 dark:bg-neutral-800 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus-visible:ring-neutral-900 dark:focus-visible:ring-neutral-100"/>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={()=> { setOpenDialog(false); resetForm(); }} className="rounded-xl border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 hover:bg-white dark:hover:bg-neutral-700">Cancel</Button>
            <Button onClick={saveDoc} className="rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-neutral-100">{editingDocId ? "Save changes" : "Add document"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Viewer Dialog */}
      <Dialog open={openViewer} onOpenChange={setOpenViewer}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-neutral-900 dark:text-neutral-100 flex items-center justify-between">
              <span>{viewerDoc?.name ?? "Preview"}</span>
              {viewerDoc?.url && (
                <Button
                  variant="outline"
                  className="rounded-lg border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 hover:bg-white dark:hover:bg-neutral-700"
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = viewerDoc.url!;
                    a.download = viewerDoc.name;
                    a.click();
                  }}
                >
                  <DownloadIcon className="mr-2"/> Download
                </Button>
              )}
            </DialogTitle>
            <DialogDescription className="text-neutral-500 dark:text-neutral-400">Quick preview</DialogDescription>
          </DialogHeader>

          <div className="h-[70vh] w-full overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900">
            {viewerDoc?.url ? (
              viewerDoc.fileKind === "image" ? (
                <img src={viewerDoc.url} alt={viewerDoc.name} className="h-full w-full object-contain" />
              ) : (
                // For pdf/doc/other — attempt to embed; pdfs display well
                <iframe src={viewerDoc.url} className="h-full w-full" title="document preview"/>
              )
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-neutral-500 dark:text-neutral-400">No preview available</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---------------- Tag Input ----------------

function TagInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState("");
  function add(t: string) {
    const v = t.trim();
    if (!v) return;
    if (value.includes(v)) return;
    onChange([...value, v]);
  }
  function remove(t: string) {
    onChange(value.filter((x) => x !== t));
  }
  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      add(input);
      setInput("");
    } else if (e.key === "Backspace" && input === "" && value.length) {
      e.preventDefault();
      onChange(value.slice(0, -1));
    }
  }
  return (
    <div className="flex min-h-[44px] w-full flex-wrap items-center gap-2 rounded-xl border border-neutral-300 dark:border-neutral-600 dark:bg-neutral-800 px-3 py-2">
      {value.map((t) => (
        <span key={t} className="inline-flex items-center gap-1 rounded-full border border-neutral-300 dark:border-neutral-600 px-2 py-1 text-xs text-neutral-800 dark:text-neutral-300">
          <TagIcon fontSize="small"/>
          {t}
          <button onClick={() => remove(t)} className="ml-1 rounded-full px-1 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700">×</button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={value.length ? "Add tag and press Enter" : "e.g., compliance"}
        className="flex-1 bg-transparent text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none"
      />
    </div>
  );
}
