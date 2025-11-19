"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PersonIcon from "@mui/icons-material/Person";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BadgeIcon from "@mui/icons-material/Badge";
import PhoneIcon from "@mui/icons-material/Phone";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddIcon from "@mui/icons-material/Add";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import VerifiedIcon from "@mui/icons-material/Verified";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";


import {
  SmartCheckboxAutoTable,
  type DisplayMap,
  type FilterConfigMap,
  type MultiSelectOption,
} from "@/components/common/smartcheckboxautotable";

import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/common/StatusBadge";

// Driver data type
type DriverRow = {
  id: string;
  name: string;
  mobile_prefix: string;
  mobile: string;
  email: string;
  username: string;
  countryCode: string;
  stateCode: string;
  city: string;
  address: string;
  status: "active" | "inactive" | "suspended";
  createdAt: string;
  lastLogin?: string;
  totalTrips: number;
  rating: number;
};

// Mock data
const driverData: DriverRow[] = [
  {
    id: "1",
    name: "John Doe",
    mobile_prefix: "+91",
    mobile: "9876543210",
    email: "john.doe@example.com",
    username: "johndoe",
    countryCode: "IN",
    stateCode: "UP",
    city: "Lucknow",
    address: "123 MG Road",
    status: "active",
    createdAt: "2024-01-15",
    lastLogin: "2024-11-07",
    totalTrips: 145,
    rating: 4.8,
  },
  {
    id: "2",
    name: "Jane Smith",
    mobile_prefix: "+91",
    mobile: "9876543211",
    email: "jane.smith@example.com",
    username: "janesmith",
    countryCode: "IN",
    stateCode: "MH",
    city: "Mumbai",
    address: "456 Andheri East",
    status: "active",
    createdAt: "2024-02-20",
    lastLogin: "2024-11-06",
    totalTrips: 89,
    rating: 4.6,
  },
  {
    id: "3",
    name: "Michael Johnson",
    mobile_prefix: "+91",
    mobile: "9876543212",
    email: "michael.j@example.com",
    username: "mikejohnson",
    countryCode: "IN",
    stateCode: "KA",
    city: "Bangalore",
    address: "789 Koramangala",
    status: "inactive",
    createdAt: "2024-03-10",
    lastLogin: "2024-10-15",
    totalTrips: 67,
    rating: 4.3,
  },
];

export default function DriversPage() {
  const router = useRouter();
  const [openAddDriver, setOpenAddDriver] = useState(false);
  const [openBulkUpload, setOpenBulkUpload] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);

  // Display configuration for the table
  const displayOptions: DisplayMap<DriverRow> = {
    1: {
      title: () => (
        <div className="flex items-center gap-1.5 font-medium text-[10px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
          <PersonIcon
            style={{ fontSize: "14px" }}
            className="text-neutral-500 dark:text-neutral-400"
          />
          Driver Info
        </div>
      ),
      content: (row) => (
        <div onClick={() => router.push(`/admin/drivers/${row.id}`)} className="group">
          <div className="flex gap-2 cursor-pointer py-1 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex-shrink-0">
              <PersonIcon style={{ fontSize: "16px" }} />
            </div>
            <div className="min-w-0">
              <div className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                {row.name}
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                @{row.username}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    2: {
      title: () => (
        <div className="flex items-center gap-1.5 font-medium text-[10px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
          <CallIcon
            style={{ fontSize: "14px" }}
            className="text-neutral-500 dark:text-neutral-400"
          />
          Contact
        </div>
      ),
      content: (row) => (
        <div className="space-y-0.5">
          <div className="flex items-center gap-1 text-sm text-neutral-700 dark:text-neutral-300">
            <PhoneIcon
              style={{ fontSize: "12px" }}
              className="text-neutral-400"
            />
            {row.mobile_prefix} {row.mobile}
          </div>
          <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
            <EmailIcon
              style={{ fontSize: "12px" }}
              className="text-neutral-400"
            />
            {row.email}
          </div>
        </div>
      ),
    },
    3: {
      title: () => (
        <div className="flex items-center gap-1.5 font-medium text-[10px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
          <LocationOnIcon
            style={{ fontSize: "14px" }}
            className="text-neutral-500 dark:text-neutral-400"
          />
          Location
        </div>
      ),
      content: (row) => (
        <div className="space-y-0.5">
          <div className="text-sm text-neutral-700 dark:text-neutral-300">
            {row.city}, {row.stateCode}
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {row.countryCode}
          </div>
        </div>
      ),
    },
    4: {
      title: () => (
        <div className="flex items-center gap-1.5 font-medium text-[10px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
          <VerifiedIcon
            style={{ fontSize: "14px" }}
            className="text-neutral-500 dark:text-neutral-400"
          />
          Status
        </div>
      ),
      content: (row) => <StatusBadge status={row.status} />,
    },
    5: {
      title: () => (
        <div className="flex items-center gap-1.5 font-medium text-[10px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
          <DirectionsCarIcon
            style={{ fontSize: "14px" }}
            className="text-neutral-500 dark:text-neutral-400"
          />
          Performance
        </div>
      ),
      content: (row) => (
        <div className="space-y-0.5">
          <div className="text-sm text-neutral-700 dark:text-neutral-300">
            {row.totalTrips} trips
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            ⭐ {row.rating}/5
          </div>
        </div>
      ),
    },
  };

  // Filter configuration
  const filterConfig: FilterConfigMap<DriverRow> = {
    name: { kind: "text", label: "Driver Name", field: "name" },
    mobile: { kind: "text", label: "Mobile", field: "mobile" },
    email: { kind: "text", label: "Email", field: "email" },
    status: {
      kind: "select",
      label: "Status",
      field: "status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Suspended", value: "suspended" },
      ],
    },
    city: { kind: "text", label: "City", field: "city" },
    rating: { kind: "numberRange", label: "Rating", field: "rating" },
  };

  // Bulk action options
  const bulkActions: MultiSelectOption<DriverRow>[] = [
    {
      id: "activate",
      name: "Activate Drivers",
      icon: <VerifiedIcon fontSize="small" />,
      tooltip: "Activate selected drivers",
      callback: (rows) => {
        console.log(
          "Activating drivers",
          rows.map((r) => r.name)
        );
      },
    },
    {
      id: "deactivate",
      name: "Deactivate Drivers",
      icon: <PersonIcon fontSize="small" />,
      tooltip: "Deactivate selected drivers",
      callback: (rows) => {
        console.log(
          "Deactivating drivers",
          rows.map((r) => r.name)
        );
      },
    },
    {
      id: "email",
      name: "Send Notification",
      icon: <EmailIcon fontSize="small" />,
      tooltip: "Send notification email to selected drivers",
      callback: (rows) => {
        console.log(
          "Bulk email",
          rows.map((r) => r.email)
        );
      },
    },
  ];

  const handleRefresh = () => {
    console.log("Refreshing drivers data...");
    // Implement refresh logic here
  };

  return (
    <>
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-7xl px-6 pb-14 pt-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="typo-h1">
                Drivers
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Manage your fleet drivers efficiently
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={openAddDriver} onOpenChange={setOpenAddDriver}>
                <DialogTrigger asChild>
                  <Button>
                    <AddIcon fontSize="small" />
                    Add Driver
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Driver</DialogTitle>
                    <DialogDescription>
                      Add a new driver to your fleet with all required
                      information.
                    </DialogDescription>
                  </DialogHeader>
                  <AddDriverForm
                    onSubmit={(data) => {
                      console.log("Adding driver:", data);
                      setOpenAddDriver(false);
                      // Implement add driver logic here
                    }}
                    onCancel={() => setOpenAddDriver(false)}
                  />
                </DialogContent>
              </Dialog>

              <Dialog open={openBulkUpload} onOpenChange={setOpenBulkUpload}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <FileUploadIcon fontSize="small" />
                    Bulk Upload
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Bulk Upload Drivers</DialogTitle>
                    <DialogDescription>
                      Upload multiple drivers at once using CSV file or manual
                      entry.
                    </DialogDescription>
                  </DialogHeader>
                  <BulkUploadDrivers
                    onSubmit={(data) => {
                      console.log("Bulk uploading drivers:", data);
                      setOpenBulkUpload(false);
                      // Implement bulk upload logic here
                    }}
                    onCancel={() => setOpenBulkUpload(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <SmartCheckboxAutoTable<DriverRow>
            title="Driver Management"
            data={driverData}
            getRowId={(r) => r.id}
            displayOptions={displayOptions}
            filterConfig={filterConfig}
            multiSelectOptions={bulkActions}
            onRowClick={(row) => {
              console.log("Row Clicked →", row.name);
              setSelectedDriverId(row.id);
              // Navigate to driver details or open drawer
            }}
            // onRefresh={handleRefresh}
            exportBrand={{
              name: "Fleet Stack",
              logoUrl: "/images/logo-light.png",
              addressLine1: "Self-Hosted GPS Software",
              addressLine2: "fleetstackglobal.com",
              footerNote: "We make it easiest — just deploy.",
            }}
            showtoolbar={true}
            showtoolbarInput={true}
            showtoolbarFilter={true}
            showtoolbarRefreshbtn={true}
            showtoolbarRecords={true}
            showtoolbarExport={true}
            showtoolbarColumn={true}
            showtoolbarFullScreen={true}
          />
        </div>
      </main>
    </>
  );
}

// Add Driver Form Component
function AddDriverForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: {
    name: string;
    mobile_prefix: string;
    mobile: string;
    email: string;
    username: string;
    password: string;
    countryCode: string;
    stateCode: string;
    city: string;
    address: string;
  }) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    mobile_prefix: "+91",
    mobile: "",
    email: "",
    username: "",
    password: "",
    countryCode: "IN",
    stateCode: "UP",
    city: "Lucknow",
    address: "123 MG Road",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
    if (!/^\d{10}$/.test(formData.mobile))
      newErrors.mobile = "Mobile number must be 10 digits";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (formData.username.length < 3)
      newErrors.username = "Username must be at least 3 characters";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      onSubmit(formData);
    } catch (error) {
      setErrors({ form: "Failed to add driver. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="grid grid-rows-[1fr_auto] gap-6 max-h-[75vh]"
      onSubmit={handleSubmit}
    >
      <ScrollArea className="pr-4">
        <div className="space-y-6">
          {/* Error Banner */}
          {errors.form && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <div className="text-red-600 text-sm">{errors.form}</div>
            </div>
          )}

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Enter full name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="Enter email address"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mobile_prefix">Mobile Prefix *</Label>
                <Select
                  value={formData.mobile_prefix}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, mobile_prefix: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+91">+91 (India)</SelectItem>
                    <SelectItem value="+1">+1 (US/Canada)</SelectItem>
                    <SelectItem value="+44">+44 (UK)</SelectItem>
                    <SelectItem value="+61">+61 (Australia)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="mobile">Mobile Number *</Label>
                <Input
                  id="mobile"
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      mobile: e.target.value.replace(/\D/g, ""),
                    }))
                  }
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                  className={errors.mobile ? "border-red-500" : ""}
                />
                {errors.mobile && (
                  <p className="text-xs text-red-500">{errors.mobile}</p>
                )}
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
              Account Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      username: e.target.value.toLowerCase().replace(/\s/g, ""),
                    }))
                  }
                  placeholder="Enter username"
                  className={errors.username ? "border-red-500" : ""}
                />
                {errors.username && (
                  <p className="text-xs text-red-500">{errors.username}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  placeholder="Enter password"
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password}</p>
                )}
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
              Location Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="countryCode">Country Code *</Label>
                <Select
                  value={formData.countryCode}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, countryCode: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN">IN (India)</SelectItem>
                    <SelectItem value="US">US (United States)</SelectItem>
                    <SelectItem value="UK">UK (United Kingdom)</SelectItem>
                    <SelectItem value="AU">AU (Australia)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stateCode">State Code *</Label>
                <Input
                  id="stateCode"
                  value={formData.stateCode}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      stateCode: e.target.value.toUpperCase(),
                    }))
                  }
                  placeholder="e.g., UP, MH, KA"
                  maxLength={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, city: e.target.value }))
                  }
                  placeholder="Enter city name"
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && (
                  <p className="text-xs text-red-500">{errors.city}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, address: e.target.value }))
                }
                placeholder="Enter full address"
                className={errors.address ? "border-red-500" : ""}
                rows={3}
              />
              {errors.address && (
                <p className="text-xs text-red-500">{errors.address}</p>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Driver"}
        </Button>
      </DialogFooter>
    </form>
  );
}

// Bulk Upload Component
function BulkUploadDrivers({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: any[]) => void;
  onCancel: () => void;
}) {
  const [csvText, setCsvText] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const sampleCsv = `name,mobile_prefix,mobile,email,username,password,countrycode
John Doe,+91,9876543210,john@example.com,johndoe,password123,IN
Jane Smith,+91,9876543211,jane@example.com,janesmith,password456,IN`;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setCsvText(text);
        parseCSV(text);
      };
      reader.readAsText(file);
    }
  };

  const parseCSV = (text: string) => {
    try {
      const lines = text.trim().split("\n");
      const headers = lines[0].split(",").map((h) => h.trim());
      const requiredHeaders = [
        "name",
        "mobile_prefix",
        "mobile",
        "email",
        "username",
        "password",
        "countrycode",
      ];

      const missingHeaders = requiredHeaders.filter(
        (h) => !headers.includes(h)
      );
      if (missingHeaders.length > 0) {
        setErrors([`Missing required columns: ${missingHeaders.join(", ")}`]);
        return;
      }

      const data = lines.slice(1).map((line, index) => {
        const values = line.split(",").map((v) => v.trim());
        const row: any = {};
        headers.forEach((header, i) => {
          row[header] = values[i] || "";
        });
        row.rowIndex = index + 2; // +2 because we start from line 2 (after header)
        return row;
      });

      // Validate data
      const validationErrors: string[] = [];
      data.forEach((row, index) => {
        if (!row.name)
          validationErrors.push(`Row ${row.rowIndex}: Name is required`);
        if (!row.mobile || !/^\d{10}$/.test(row.mobile))
          validationErrors.push(
            `Row ${row.rowIndex}: Valid 10-digit mobile required`
          );
        if (!row.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email))
          validationErrors.push(`Row ${row.rowIndex}: Valid email required`);
        if (!row.username)
          validationErrors.push(`Row ${row.rowIndex}: Username is required`);
        if (!row.password || row.password.length < 6)
          validationErrors.push(
            `Row ${row.rowIndex}: Password must be at least 6 characters`
          );
      });

      if (validationErrors.length > 0) {
        setErrors(validationErrors.slice(0, 10)); // Show only first 10 errors
      } else {
        setErrors([]);
      }

      setParsedData(data);
    } catch (error) {
      setErrors(["Invalid CSV format. Please check your file."]);
    }
  };

  const handleTextChange = (text: string) => {
    setCsvText(text);
    if (text.trim()) {
      parseCSV(text);
    } else {
      setParsedData([]);
      setErrors([]);
    }
  };

  const handleSubmit = () => {
    if (parsedData.length > 0 && errors.length === 0) {
      onSubmit(parsedData);
    }
  };

  return (
    <div className="space-y-6 max-h-[75vh] overflow-y-auto">
      {/* File Upload Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
            Upload CSV File
          </h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="text-center space-y-3">
              <FileUploadIcon
                className="mx-auto text-gray-400"
                fontSize="large"
              />
              <div>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2"
                >
                  <FileUploadIcon fontSize="small" />
                  Choose CSV File
                </Button>
                <p className="text-sm text-gray-600 mt-2">
                  Or drag and drop your CSV file here
                </p>
              </div>
              {uploadFile && (
                <p className="text-sm text-green-600">
                  Selected: {uploadFile.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Manual CSV Input */}
        <div>
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
            Or Paste CSV Content
          </h3>
          <Textarea
            value={csvText}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Paste your CSV content here..."
            className="h-40 bg-white font-mono text-sm"
          />

          {/* Sample CSV */}
          <div className="mt-2">
            <details className="text-sm">
              <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                View sample CSV format
              </summary>
              <pre className="mt-2 p-3 bg-gray-50 rounded border text-xs overflow-x-auto">
                {sampleCsv}
              </pre>
            </details>
          </div>
        </div>
      </div>

      {/* Errors Display */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-red-800 font-medium mb-2">Validation Errors:</h4>
          <ul className="text-red-700 text-sm space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Parsed Data Preview */}
      {parsedData.length > 0 && errors.length === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="text-green-800 font-medium mb-2">
            ✅ Ready to import {parsedData.length} drivers
          </h4>
          <div className="text-sm text-green-700">
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <strong>Sample entries:</strong>
                <ul className="mt-1">
                  {parsedData.slice(0, 3).map((row, index) => (
                    <li key={index}>
                      • {row.name} ({row.email})
                    </li>
                  ))}
                  {parsedData.length > 3 && (
                    <li>... and {parsedData.length - 3} more</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={parsedData.length === 0 || errors.length > 0}
          className="bg-green-600 hover:bg-green-700"
        >
          Import {parsedData.length} Drivers
        </Button>
      </DialogFooter>
    </div>
  );
}
