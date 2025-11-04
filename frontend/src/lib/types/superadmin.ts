export type Company = { name: string };

export type AdminRow = {
  id: string;
  name: string;
  mobilePrefix: string;
  mobileNumber: string;
  email?: string;
  username: string;
  isEmailVerified: boolean;
  profileUrl?: string;
  vehicles?: number;
  credits: number;
  isActive: boolean;
  address: string;
  city: string;
  country: string;
  countryCode: string;
  createdAt: string; // "YYYY-MM-DD hh:mm AM/PM"
  lastLogin: string; // "" when unknown
  companies?: Company[];
};


export type FileKind = "pdf" | "image" | "doc" | "other"; // actual file type

export const DOC_TYPE_OPTIONS = [
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

// Types
 export type EventKind = "ADMIN_CREATED" | "USER_CREATED" | "VEHICLE_EXPIRY" | "VEHICLE_ADDED";
 export type CalendarEvent = {
  id: string;
  kind: EventKind;
  at: string; // ISO timestamp
  title: string;
  note?: string;
  meta?: Record<string, any>;
 };

 export type FilterState = Record<EventKind, boolean>;

export  type DayAgg = { total: number; ADMIN_CREATED: number; USER_CREATED: number; VEHICLE_EXPIRY: number; VEHICLE_ADDED: number };



// ---- Types ----
export type Health = { ok: boolean; uptimeSec: number; version: string; startedAt: string };
export type Metrics = { cpu: number; mem: number; disk: number; load1: number; load5: number; load15: number };
export type PgInfo = { dbName: string; sizeBytes: number; connections: number; deadTuples?: number };
export type RedisInfo = { connected: boolean; usedMemoryBytes: number; hitRate: number; keys: number };
export type SocketInfo = { clients: number; rooms: number; eventsPerSec: number };
export type QueueInfo = { name: string; waiting: number; active: number; delayed: number; failed: number; paused: boolean };
export type FirebaseInfo = { fcmReachable: boolean; lastPingISO: string };
export type Service = { id: string; name: string; status: "running"|"degraded"|"stopped"; sinceISO: string };