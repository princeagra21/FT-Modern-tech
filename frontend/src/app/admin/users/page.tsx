"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import HomeIcon from "@mui/icons-material/Home";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import LoginIcon from "@mui/icons-material/Login";

import {
  SmartCheckboxAutoTable,
  type DisplayMap,
  type FilterConfigMap,
  type MultiSelectOption,
} from "@/components/common/smartcheckboxautotable";
import { Button } from "@/components/ui/button";
import AddUserDialog from "@/components/admin/AddUserDialog";
import BulkUploadUser from "@/components/admin/BulkUploadUser";

export type UserRow = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Supervisor" | "Technician" | "Support";
  department:
    | "Operations"
    | "Logistics"
    | "Fleet"
    | "Maintenance"
    | "Customer Care"
    | "IT"
    | "Sales"
    | "Helpdesk"
    | "Transport"
    | "Field Service";
  country: string;
  active: boolean;
  lastLogin: string;
  mobile?: string;
};

const USER_DATA: UserRow[] = [
  {
    id: "u001",
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    role: "Admin",
    department: "Operations",
    country: "India",
    active: true,
    lastLogin: "2025-10-12 09:34 AM",
    mobile: "+917676788888",
  },
  {
    id: "u003",
    name: "Carlos Rodriguez",
    email: "carlos.rodriguez@example.com",
    role: "Supervisor",
    department: "Fleet",
    country: "Mexico",
    active: false,
    lastLogin: "2025-09-30 10:44 AM",
    mobile: "+917676788888",
  },
  {
    id: "u002",
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    role: "Manager",
    department: "Logistics",
    country: "USA",
    active: true,
    lastLogin: "2025-10-14 06:12 PM",
    mobile: "+917676788888",
  },
  {
    id: "u007",
    name: "Ethan Brown",
    email: "ethan.brown@example.com",
    role: "Manager",
    department: "Sales",
    country: "UK",
    active: true,
    lastLogin: "2025-10-15 10:10 AM",
    mobile: "+917676788888",
  },
  {
    id: "u006",
    name: "Isabella Rossi",
    email: "isabella.rossi@example.com",
    role: "Admin",
    department: "IT",
    country: "Italy",
    active: true,
    lastLogin: "2025-10-14 08:46 AM",
    mobile: "+917676788888",
  },
  {
    id: "u005",
    name: "Liam Nguyen",
    email: "liam.nguyen@example.com",
    role: "Support",
    department: "Customer Care",
    country: "Vietnam",
    active: false,
    lastLogin: "2025-10-02 09:22 AM",
    mobile: "+917676788888",
  },
  {
    id: "u008",
    name: "Mia Chen",
    email: "mia.chen@example.com",
    role: "Support",
    department: "Helpdesk",
    country: "Singapore",
    active: false,
    lastLogin: "2025-09-28 05:05 PM",
    mobile: "+917676788888",
  },
  {
    id: "u009",
    name: "Noah Kim",
    email: "noah.kim@example.com",
    role: "Supervisor",
    department: "Transport",
    country: "South Korea",
    active: true,
    lastLogin: "2025-10-11 11:58 AM",
    mobile: "+917676788888",
  },
  {
    id: "u010",
    name: "Olivia Davis",
    email: "olivia.davis@example.com",
    role: "Technician",
    department: "Field Service",
    country: "Australia",
    active: true,
    lastLogin: "2025-10-14 03:41 PM",
    mobile: "+917676788888",
  },
  {
    id: "u011",
    name: "Sophia Patel",
    email: "sophia.patel@example.com",
    role: "Technician",
    department: "Maintenance",
    country: "India",
    active: true,
    lastLogin: "2025-10-12 02:57 PM",
    mobile: "+917676788888",
  },
  {
    id: "u012",
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    role: "Admin",
    department: "Operations",
    country: "India",
    active: true,
    lastLogin: "2025-10-12 09:34 AM",
    mobile: "+917676788888",
  },
  {
    id: "u013",
    name: "Carlos Rodriguez",
    email: "carlos.rodriguez@example.com",
    role: "Supervisor",
    department: "Fleet",
    country: "Mexico",
    active: false,
    mobile: "+917676788888",

    lastLogin: "2025-09-30 10:44 AM",
  },
  {
    id: "u014",
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    role: "Manager",
    department: "Logistics",
    country: "USA",
    active: true,
    mobile: "+917676788888",

    lastLogin: "2025-10-14 06:12 PM",
  },
  {
    id: "u015",
    name: "Ethan Brown",
    email: "ethan.brown@example.com",
    role: "Manager",
    department: "Sales",
    country: "UK",
    active: true,
    mobile: "+917676788888",

    lastLogin: "2025-10-15 10:10 AM",
  },
  {
    id: "u016",
    name: "Isabella Rossi",
    email: "isabella.rossi@example.com",
    role: "Admin",
    department: "IT",
    country: "Italy",
    active: true,
    mobile: "+917676788888",

    lastLogin: "2025-10-14 08:46 AM",
  },
  {
    id: "u017",
    name: "Liam Nguyen",
    email: "liam.nguyen@example.com",
    role: "Support",
    department: "Customer Care",
    country: "Vietnam",
    active: false,
    mobile: "+917676788888",

    lastLogin: "2025-10-02 09:22 AM",
  },
  {
    id: "u018",
    name: "Mia Chen",
    email: "mia.chen@example.com",
    role: "Support",
    department: "Helpdesk",
    country: "Singapore",
    active: false,
    mobile: "+917676788888",

    lastLogin: "2025-09-28 05:05 PM",
  },
  {
    id: "u019",
    name: "Noah Kim",
    email: "noah.kim@example.com",
    role: "Supervisor",
    department: "Transport",
    country: "South Korea",
    active: true,
    mobile: "+917676788888",

    lastLogin: "2025-10-11 11:58 AM",
  },
  {
    id: "u020",
    name: "Olivia Davis",
    email: "olivia.davis@example.com",
    role: "Technician",
    department: "Field Service",
    country: "Australia",
    active: true,
    mobile: "+917676788888",

    lastLogin: "2025-10-14 03:41 PM",
  },
  {
    id: "u021",
    name: "Sophia Patel",
    email: "sophia.patel@example.com",
    role: "Technician",
    department: "Maintenance",
    country: "India",
    active: true,
    mobile: "+917676788888",

    lastLogin: "2025-10-12 02:57 PM",
  },
];

export default function Page() {
  const [addUserOpen, setAddUserOpen] = useState(false);
  const router = useRouter();

  const displayOptions: DisplayMap<UserRow> = {
    0: {
      title: () => (
        <div className="flex items-center gap-1 font-semibold tracking-wide uppercase text-xs">
          <HomeIcon fontSize="small" /> Name
        </div>
      ),
      content: (row) => (
        <div
          className="text-sm cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/admin/users/${row.id}`);
          }}
        >
          <p className="font-semibold text-slate-900 dark:text-slate-100">
            {row.name}
          </p>
          <p className=" text-xs text-slate-500 dark:text-slate-400">
            {row.role} · {row.country}
          </p>
        </div>
      ),
      tooltip: (row) => (
        <div className="text-[12px] leading-snug">
          <div className="font-semibold">{row.name}</div>
          <div className="text-slate-500">
            {row.role} · {row.department}
          </div>
          <div className="mt-1 text-slate-400">Last login: {row.lastLogin}</div>
        </div>
      ),
    },
    1: {
      title: () => <>Contact</>,
      content: (row) => (
        <div className="flex flex-col">
          <a
            href={`mailto:${row.email}`}
            className="text-primary hover:text-primary/80 underline underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {row.email}
          </a>
          {row.mobile && (
            <a
              href={`tel:${row.mobile}`}
              className="text-muted hover:text-primary/80 underline underline-offset-2"
              onClick={(e) => e.stopPropagation()}
            >
              {row.mobile}
            </a>
          )}
        </div>
      ),
    },

    2: {
      title: () => <>Status</>,
      content: (row) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
            row.active
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {row.active ? "Active" : "Inactive"}
        </span>
      ),
    },
    3: {
      title: () => <>Last Login</>,
      content: (row) => (
        <span className="text-xs text-slate-600 dark:text-slate-400">
          {row.lastLogin}
        </span>
      ),
    },
    4: {
      title: () => <>Department</>,
      content: (row) => <span className="text-sm">{row.department}</span>,
    },
    5: {
      title: () => <>ID</>,
      content: (row) => <span className="text-sm">{row.id}</span>,
    },
    6: {
      title: () => <>Country</>,
      content: (row) => <span className="text-sm">{row.country}</span>,
    },
    7: {
      title: () => <>Role</>,
      content: (row) => <span className="text-sm">{row.role}</span>,
    },
    8: {
      title: () => <>Action</>,
      content: () => (
        <div className="py-0.5">
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-3 text-[11px] font-medium border-border hover:bg-primary hover:text-background transition-colors"
          >
            <LoginIcon style={{ fontSize: "13px" }} className="mr-1" />
            Login
          </Button>
        </div>
      ),
    },
  };

  const filterConfig: FilterConfigMap<UserRow> = {
    1: { kind: "text", label: "Email contains", field: "email" },
    _role: { kind: "select", label: "Role", field: "role", derive: true },
    _active: {
      kind: "boolean",
      label: "Active",
      field: "active",
      tristate: true,
    },
    3: { kind: "dateRange", label: "Last login range", field: "lastLogin" },
    4: {
      kind: "select",
      label: "Department",
      field: "department",
      derive: true,
    },
  };

  const bulkActions: MultiSelectOption<UserRow>[] = [
    {
      name: "Delete",
      iconName: "delete_outline",
      // outline is default; optional:
      variant: "outline",
      callback: (rows, ids) =>
        console.log(
          "Bulk delete",
          rows.map((r) => r.id),
          ids
        ),
    },
    {
      name: "Deactivate",
      iconName: "Settings",
      callback: (rows) =>
        console.log(
          "Bulk deactivate",
          rows.map((r) => r.id)
        ),
    },
    {
      name: "Activate",
      iconName: "toggle_on",
      callback: (rows) =>
        console.log(
          "Bulk activate",
          rows.map((r) => r.id)
        ),
    },
  ];

  return (
    <>
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-7xl px-6 pb-14 pt-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h1 className="typo-h1">
                User Management
              </h1>
              {/* <p className="text-sm text-neutral-500">
                Self‑hosted GPS Software • FleetStack
              </p> */}
            </div>
            <div className="flex items-center gap-3">
              <BulkUploadUser />
              <Button onClick={() => setAddUserOpen(true)}>
                <PersonAddIcon fontSize="small" />
                Add User
              </Button>
            </div>
          </div>
          <SmartCheckboxAutoTable<UserRow>
            title="User Management"
            data={USER_DATA}
            getRowId={(r) => r.id}
            displayOptions={displayOptions}
            filterConfig={filterConfig}
            multiSelectOptions={bulkActions}
            onRowClick={(row) => console.log("Row Clicked →", row.name)}
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
      <AddUserDialog
        open={addUserOpen}
        onOpenChange={setAddUserOpen}
        onSave={console.log}
      />
    </>
  );
}
