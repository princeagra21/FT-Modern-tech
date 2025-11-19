import React, { useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Person as PersonIcon,
  PersonAdd as PersonAddIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  FileUpload as FileUploadIcon,
  OpenInNew as ExternalLinkIcon,
  Undo as UndoIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const ROLES = [
  "Admin",
  "User",
  "Sub-User",
  "Driver",
  "Manager",
  "Team",
] as const;
type UserRow = {
  Name: string;
  username: string;
  profile_url?: string | null;
  CompanyName?: string | null;
  Mobile_prefix?: string | null; // "+91"
  Mobile?: string | null;
  Email?: string | null;
  isEmail_verified: boolean;
  Vehicles: number;
  status: "active" | "pending" | "suspended" | "inactive";
  created_at: string; // ISO
  // Optional, mostly hidden
  role?: string | null;
  Country?: string | null;
  State?: string | null;
  City?: string | null;
  Address?: string | null;
  pincode?: string | null;
};
const SAMPLE: UserRow[] = Array.from({ length: 28 }).map((_, i) => ({
  Name: [
    "Aarav Sharma",
    "Priya Singh",
    "Rohan Gupta",
    "Isha Verma",
    "Arjun Mehta",
  ][i % 5],
  username: ["aarav", "priya", "rohan", "isha", "arjun"][i % 5] + i,
  profile_url: i % 4 === 0 ? `https://picsum.photos/seed/u${i}/96` : null,
  CompanyName: [
    "Quantum Logistics",
    "SkyFleet",
    "RoadStar",
    "UrbanMove",
    "Vector Wheels",
  ][i % 5],
  Mobile_prefix: "+91",
  Mobile: `98${(1_000_000 + i * 137) % 9_999_999}`,
  Email: `user${i}@fleetstack.dev`,
  isEmail_verified: i % 2 === 0,
  Vehicles: (i * 9) % 160,
  status: (["active", "pending", "suspended", "inactive"] as const)[i % 4],
  created_at: new Date(Date.now() - i * 86400000 * 1.7).toISOString(),
  role: i % 3 === 0 ? "Admin" : "User",
  Country: "India",
  State: ["Delhi", "Maharashtra", "Karnataka", "Gujarat"][i % 4],
  City: "New Delhi",
  Address: "—",
  pincode: "110001",
}));

const BulkUploadUser = ({ rows }: { rows?: UserRow[] }) => {
  const initialRows = useMemo(() => (rows?.length ? rows : SAMPLE), [rows]);

  const [data, setData] = useState<UserRow[]>(initialRows);
  const [openAdd, setOpenAdd] = useState(false);
  const [openImport, setOpenImport] = useState(false);

  return (
    <div className="">
      <Dialog open={openImport} onOpenChange={setOpenImport}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <FileUploadIcon fontSize="small" />
            Bulk Upload
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl bg-background border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileUploadIcon fontSize="small" />
              Bulk Upload Users
            </DialogTitle>
          </DialogHeader>
          <ImportWizard
            onCancel={() => setOpenImport(false)}
            onCommit={(role, users) => {
              const now = new Date().toISOString();
              const mapped: UserRow[] = users.map((u) => ({
                Name: u.Name,
                username: u.username,
                profile_url: null,
                CompanyName: null,
                Mobile_prefix: u.mobilePrefix ?? null,
                Mobile: u.mobileNumber ?? null,
                Email: u.email ?? null,
                isEmail_verified: false,
                Vehicles: 0,
                status: "active",
                created_at: now,
                role,
                Country: null,
                State: null,
                City: null,
                Address: null,
                pincode: null,
              }));
              setData((prev) => [...mapped, ...prev]);
              setOpenImport(false);
              //   toast({
              //     title: "Bulk import completed",
              //     description: `Successfully imported ${users.length} user(s)`,
              //     duration: 3000,
              //   });
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BulkUploadUser;

function ImportWizard({
  onCancel,
  onCommit,
}: {
  onCancel: () => void;
  onCommit: (
    role: string,
    users: Array<{
      Name: string;
      email?: string;
      mobilePrefix?: string;
      mobileNumber?: string;
      username: string;
      password: string;
    }>
  ) => void;
}) {
  const [step, setStep] = useState<"config" | "upload" | "review">("config");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<string>(ROLES[1]);
  const [text, setText] = useState("");
  const [fileErr, setFileErr] = useState("");
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const required = [
    "Name",
    "email",
    "mobilePrefix",
    "mobileNumber",
    "username",
    "password",
  ] as const;
  const fileRef = useRef<HTMLInputElement>(null);

  const validCount = rows.filter(
    (r) => r.Name && r.username && r.password
  ).length;

  // Generate sample CSV file
  const downloadSampleFile = () => {
    const sampleData = [
      required.join(","),
      "John Doe,john.doe@company.com,+91,9876543210,johndoe,password123",
      "Jane Smith,jane.smith@company.com,+91,9876543211,janesmith,password456",
      "Mike Johnson,mike.johnson@company.com,+1,5551234567,mikejohnson,password789",
    ];

    const blob = new Blob([sampleData.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_users_import.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  function parseAndSet(csv: string) {
    setLoading(true);
    setUploadProgress(0);

    // Simulate parsing progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev: number) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);
  }

  function handleFile(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => parseAndSet(String(reader.result || ""));
    reader.readAsText(file);
  }

  const handleCommit = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
      const validUsers = rows.filter(
        (r: Record<string, string>) => r.Name && r.username && r.password
      );
      onCommit(
        role,
        validUsers.map((r) => ({
          Name: r.Name,
          username: r.username,
          password: r.password,
          email: r.email,
          mobilePrefix: r.mobilePrefix,
          mobileNumber: r.mobileNumber,
        }))
      );
    } catch (error) {
      setFileErr("Failed to import users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[auto_1fr_auto] gap-6 h-[75vh]">
      {/* Stepper */}
      <div className="relative">
        <div className="flex items-center justify-between">
          {/* Step 1 - Config */}
          <div
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all duration-300",
              step === "config"
                ? "border-primary bg-primary/10 text-primary shadow-md scale-105"
                : "border-border bg-background text-muted-foreground"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
                step === "config"
                  ? "bg-primary text-white"
                  : "bg-foreground/5 text-foreground"
              )}
            >
              1
            </div>
            <div>
              <div className="font-medium text-foreground">Configure</div>
              <div className="typo-subtitle">
                Set role & download sample
              </div>
            </div>
          </div>

          {/* Connector */}
          <div className="w-16 h-1 bg-border rounded">
            <div
              className={cn(
                "h-full bg-primary rounded transition-all duration-500",
                ["upload", "review"].includes(step) ? "w-full" : "w-0"
              )}
            />
          </div>

          {/* Step 2 - Upload */}
          <div
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all duration-300",
              step === "upload"
                ? "border-primary bg-primary/10 text-primary shadow-md scale-105"
                : "border-border bg-background text-muted-foreground"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
                step === "upload"
                  ? "bg-primary text-primary-foreground"
                  : step === "review"
                  ? "bg-success text-success-foreground"
                  : "bg-foreground/5 text-foreground"
              )}
            >
              {step === "review" ? <CheckCircleIcon fontSize="small" /> : "2"}
            </div>
            <div>
              <div className="font-medium text-foreground">Upload</div>
              <div className="typo-subtitle">
                Import CSV file
              </div>
            </div>
          </div>

          {/* Connector */}
          <div className="w-16 h-1 bg-border rounded">
            <div
              className={cn(
                "h-full bg-primary rounded transition-all duration-500",
                step === "review" ? "w-full" : "w-0"
              )}
            />
          </div>

          {/* Step 3 - Review */}
          <div
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all duration-300",
              step === "review"
                ? "border-primary bg-primary/10 text-primary shadow-md scale-105"
                : "border-border bg-background text-muted-foreground"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
                step === "review"
                  ? "bg-primary text-primary-foreground"
                  : "bg-foreground/5 text-foreground"
              )}
            >
              3
            </div>
            <div>
              <div className="font-medium text-foreground">Review</div>
              <div className="typo-subtitle">
                Validate & import
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-0">
        {step === "config" && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <PersonAddIcon className="text-primary" fontSize="large" />
              </div>
              <div>
                <h3 className="typo-h2">
                  Bulk Import Users
                </h3>
                <p className="text-muted-foreground">
                  Import multiple users at once using a CSV file
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Role */}
              <div className="space-y-4">
                <Label className="text-lg font-medium text-foreground flex items-center gap-2">
                  <PersonIcon className="text-primary" />
                  User Role
                </Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="bg-background border-border focus:border-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  All imported users will be assigned this role
                </p>
              </div>

              {/* Sample File */}
              <div className="space-y-4">
                <Label className="text-lg font-medium text-foreground flex items-center gap-2">
                  <DownloadIcon className="text-accent" />
                  Sample File
                </Label>
                <Button
                  variant="outline"
                  onClick={downloadSampleFile}
                  className="w-full gap-2 h-12 border-2 border-dashed border-border hover:border-accent hover:bg-accent/10"
                >
                  <DownloadIcon fontSize="small" />
                  Download Sample CSV
                </Button>
                <p className="text-sm text-muted-foreground">
                  Download template with required columns and sample data
                </p>
              </div>
            </div>

            {/* Required Columns */}
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <h4 className="font-medium text-primary mb-2">
                Required Columns:
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-primary">
                {required.map((col, index) => (
                  <div key={col} className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary/20 rounded text-xs flex items-center justify-center font-medium">
                      {index + 1}
                    </div>
                    <span>{col}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* (upload + review blocks same structure, colors replaced accordingly) */}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-3">
          {step !== "config" && (
            <Button
              variant="outline"
              onClick={() => setStep(step === "review" ? "upload" : "config")}
              disabled={loading}
              className="gap-2"
            >
              <UndoIcon fontSize="small" />
              Back
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>

          {step === "config" && (
            <Button
              onClick={() => setStep("upload")}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Continue
              <ExternalLinkIcon fontSize="small" />
            </Button>
          )}

          {step === "review" && (
            <Button
              onClick={handleCommit}
              disabled={validCount === 0 || loading}
              className="gap-2 bg-success hover:bg-success/90 text-success-foreground"
            >
              {loading ? (
                <RefreshIcon fontSize="small" className="animate-spin" />
              ) : (
                <CheckCircleIcon fontSize="small" />
              )}
              {loading ? "Importing..." : `Import ${validCount} Users`}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
