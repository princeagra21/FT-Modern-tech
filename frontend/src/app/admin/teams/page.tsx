"use client";

import React, { useState } from "react";

import {
  DisplayMap,
  FilterConfigMap,
  SmartCheckboxAutoTable,
} from "@/components/common/smartcheckboxautotable";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import CallIcon from "@mui/icons-material/Call";
import ShieldIcon from "@mui/icons-material/Shield";
import VerifiedIcon from "@mui/icons-material/Verified";
import LockIcon from "@mui/icons-material/Lock";
import { useRouter } from "next/navigation";
import StatusBadge from "@/components/common/StatusBadge";
import Add from "@mui/icons-material/Add";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import SettingsIcon from "@mui/icons-material/Settings";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import RoleContent from "@/components/superadmin/administrators/roles/RolePreview";
import AddTeamDialog from "@/components/admin/AddTeamDialog";

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------

export interface TeamRow {
  id: string;
  name: string;
  username: string;
  email: string;
  mobile: string;
  role: string;
  status: "active" | "inactive" | "disabled";
  permissions: number;
}

// ------------------------------------------------------------------
// Mock Data
// ------------------------------------------------------------------

const teamData: TeamRow[] = [
  {
    id: "T001",
    name: "Kamal Admin",
    username: "kamal",
    email: "kamal@fleetstack.com",
    mobile: "+91 9898xxxxxx",
    role: "Admin",
    status: "active",
    permissions: 42,
  },
  {
    id: "T002",
    name: "Riya Ops",
    username: "riya.ops",
    email: "riya@fleetstack.com",
    mobile: "+91 9090xxxxxx",
    role: "Operator",
    status: "active",
    permissions: 25,
  },
  {
    id: "T003",
    name: "Aman Support",
    username: "aman",
    email: "aman@fleetstack.com",
    mobile: "+91 9797xxxxxx",
    role: "Support",
    status: "inactive",
    permissions: 10,
  },
];

// ------------------------------------------------------------------
// Display Options
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// Filter Config
// ------------------------------------------------------------------

export const teamFilterConfig: FilterConfigMap<TeamRow> = {
  name: {
    kind: "text",
    label: "Team Member Name",
    field: "name",
  },
  username: {
    kind: "text",
    label: "Username",
    field: "username",
  },
  email: {
    kind: "text",
    label: "Email",
    field: "email",
  },
  role: {
    kind: "select",
    label: "Role",
    field: "role",
    options: [
      { label: "Admin", value: "Admin" },
      { label: "Operator", value: "Operator" },
      { label: "Support", value: "Support" },
    ],
  },
  status: {
    kind: "select",
    label: "Status",
    field: "status",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
      { label: "Disabled", value: "disabled" },
    ],
  },
};

// ------------------------------------------------------------------
// Bulk Actions
// ------------------------------------------------------------------

export const teamBulkActions = [
  {
    id: "activate",
    name: "Activate Members",
    icon: <VerifiedIcon fontSize="small" />,
    tooltip: "Activate selected team members",
    callback: (rows: TeamRow[]) => {
      console.log(
        "Activating team members:",
        rows.map((r) => r.name)
      );
    },
  },
  {
    id: "deactivate",
    name: "Deactivate Members",
    icon: <PersonIcon fontSize="small" />,
    tooltip: "Deactivate selected team members",
    callback: (rows: TeamRow[]) => {
      console.log(
        "Deactivating team members:",
        rows.map((r) => r.name)
      );
    },
  },
  {
    id: "notify",
    name: "Send Notification",
    icon: <EmailIcon fontSize="small" />,
    tooltip: "Send email notification to selected team members",
    callback: (rows: TeamRow[]) => {
      console.log(
        "Sending emails to:",
        rows.map((r) => r.email)
      );
    },
  },
];

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------

export default function TeamsTable() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const teamDisplayOptions: DisplayMap<TeamRow> = {
    1: {
      title: () => (
        <div className="flex items-center gap-1.5 font-medium text-[10px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
          <PersonIcon
            style={{ fontSize: "14px" }}
            className="text-neutral-500 dark:text-neutral-400"
          />
          Member Info
        </div>
      ),
      content: (row) => {
        return (
          <div
            onClick={() => router.push(`/admin/teams/${row.id}`)}
            className="group"
          >
            <div className="flex gap-2 cursor-pointer py-1 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex-shrink-0">
                <PersonIcon style={{ fontSize: "16px" }} />
              </div>
              <div className="min-w-0">
                <div className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                  {row.name}
                </div>
                <div className="typo-subtitle">
                  @{row.username}
                </div>
              </div>
            </div>
          </div>
        );
      },
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
            <CallIcon
              style={{ fontSize: "12px" }}
              className="text-neutral-400"
            />
            {row.mobile}
          </div>
          <div className="flex items-center gap-1 typo-subtitle">
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
          <ShieldIcon
            style={{ fontSize: "14px" }}
            className="text-neutral-500 dark:text-neutral-400"
          />
          Role
        </div>
      ),
      content: (row) => (
        <div className="text-sm text-neutral-700 dark:text-neutral-300 capitalize">
          {row.role}
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
          <LockIcon
            style={{ fontSize: "14px" }}
            className="text-neutral-500 dark:text-neutral-400"
          />
          Permissions
        </div>
      ),
      content: (row) => (
        <div className="text-sm text-neutral-700 dark:text-neutral-300">
          {row.permissions} assigned
        </div>
      ),
    },
    6: {
      title: () => (
        <div className="flex items-center gap-1.5 font-medium text-[10px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
          Actions
        </div>
      ),
      content: (row) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertIcon fontSize="small" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => openPerms(row.id)}>
                <SettingsIcon className="mr-2 h-4 w-4" /> Permissions
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                <EditIcon className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                <DeleteIcon className="mr-2 h-4 w-4 text-red-500" /> Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  };
  const [permOpen, setPermOpen] = useState(false);

  const openPerms = (id: string) => {
    setPermOpen(true);
  };

  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  return (
    <>
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-7xl px-6 pb-14 pt-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h1 className="typo-h1">Teams</h1>
              <p className="text-sm text-neutral-500">
                Manage teammates and their permissions. Add members via the
                modal, fine‑tune via the drawer.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => setOpen(true)}>
                <Add className="h-4 w-4" /> Add Team
              </Button>
            </div>
          </div>
          <SmartCheckboxAutoTable<TeamRow>
            title="Teams Management"
            data={teamData}
            getRowId={(r) => r.id}
            displayOptions={teamDisplayOptions}
            filterConfig={teamFilterConfig}
            multiSelectOptions={teamBulkActions}
            onRowClick={(row) => {
              console.log("Row Clicked →", row.name);
              setSelectedTeamId(row.id);
            }}
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
          <Sheet open={permOpen} onOpenChange={setPermOpen}>
            <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="typo-h2 flex items-center gap-2">
                  <ShieldIcon /> Permissions
                </SheetTitle>
                <SheetDescription>
                  Assign the minimal access required. Use a preset, then tweak.
                </SheetDescription>
              </SheetHeader>

              <RoleContent />
            </SheetContent>
          </Sheet>
        </div>
      </main>
      <AddTeamDialog open={open} setOpen={setOpen} onSubmit={() => {}} />
    </>
  );
}
