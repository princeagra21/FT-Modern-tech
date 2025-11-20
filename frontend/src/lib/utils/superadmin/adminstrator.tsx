import { useState } from "react";
import TagIcon from "@mui/icons-material/Tag";
import { FileKind } from "@/lib/types/superadmin";
import DescriptionIcon from "@mui/icons-material/Description";


export function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function daysUntil(date?: Date | null) {
  if (!date) return Infinity;
  const oneDay = 1000 * 60 * 60 * 24;
  const diff = date.getTime() - new Date().setHours(0, 0, 0, 0);
  return Math.floor(diff / oneDay);
}

export function computeStatus(expiry?: Date | null): "valid" | "expiring" | "expired" {
  if (!expiry) return "valid";
  const left = daysUntil(expiry);
  if (left < 0) return "expired";
  if (left <= 30) return "expiring";
  return "valid";
}

export function formatDate(d: Date | undefined | null) {
  if (!d) return "—";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

// CSV helpers (fixes the unterminated string bug & ensures compliant quoting)
export function csvEscape(v: unknown) {
  const s = String(v);
  // Escape double quotes by doubling them per RFC 4180
  const escaped = s.replace(/"/g, '""');
  return `"${escaped}"`;
}


export function TagInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
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
    <div className="flex min-h-[44px] w-full flex-wrap items-center gap-2 rounded-xl border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800">
      {value.map((t) => (
        <span key={t} className="inline-flex items-center gap-1 rounded-full border border-neutral-300 px-2 py-1 text-xs ">
          <TagIcon fontSize="small"/>
          {t}
          <button onClick={() => remove(t)} className="ml-1 rounded-full px-1 text-neutral-500 hover:bg-neutral-100  dark:hover:bg-neutral-700">×</button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={value.length ? "Add tag and press Enter" : "e.g., compliance"}
        className="flex-1 bg-transparent typo-p text-neutral-900 placeholder:text-muted focus:outline-none"
      />
    </div>
  );
}

// ---------------- Dev Self-Tests (non-intrusive) ----------------
// These run only in development and help catch CSV issues quickly.
export function DEV_runCSVTests() {
  const a = csvEscape('simple');
  const b = csvEscape('a,b');
  const c = csvEscape('"quoted"');
  const d = csvEscape('multi\nline');
  console.assert(a === '"simple"', 'csvEscape simple');
  console.assert(b === '"a,b"', 'csvEscape comma');
  console.assert(c === '"""quoted"""', 'csvEscape double-quotes');
  console.assert(d === '"multi\nline"', 'csvEscape newline');
}


  export const FileKindIcon = ({ kind }: { kind: FileKind }) => {
    if (kind === "pdf")
      return (
        <DescriptionIcon className="" />
      );
    if (kind === "image")
      return (
        <div className="h-5 w-5 rounded-sm border border-neutral-400 dark:border-neutral-600" />
      );
    if (kind === "doc")
      return (
        <DescriptionIcon className="text-neutral-700 " />
      );
    return (
      <DescriptionIcon className="text-neutral-500 " />
    );
  };