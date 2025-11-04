"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Material Icons
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ShieldIcon from "@mui/icons-material/Shield";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SaveIcon from "@mui/icons-material/Save";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Level, Role } from "@/lib/types/superadmin";
import {
  DEMO_ROLES,
  LEVEL_HELP,
  MODULES,
  PRESET_HELP,
  PRESETS,
} from "@/lib/data/superadmin";
import {
  DevTests,
  fill,
  isoNow,
  LevelToggle,
  PriceCurrency,
  timeAgo,
  uc,
} from "@/lib/utils/superadmin/roles";
import StatusBadge from "@/components/common/StatusBadge";

// ————————————————————————————————————————
// Role Manager — SIMPLE, CLEAR, 5‑LEVEL MODEL
// Levels: None • View • Edit • Manage • Full
// Black & white only, production‑ready, no fixed header.
// ————————————————————————————————————————

export default function RoleManager() {
  const [roles, setRoles] = useState<Role[]>(DEMO_ROLES);
  const [selectedId, setSelectedId] = useState<string>(roles[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const selected = useMemo(
    () => roles.find((r) => r.id === selectedId) ?? null,
    [roles, selectedId]
  );
  const [draft, setDraft] = useState<Role | null>(
    selected ? { ...selected } : null
  );
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setDraft(selected ? { ...selected } : null);
    setDirty(false);
  }, [selectedId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return !q
      ? roles
      : roles.filter(
          (r) =>
            r.title.toLowerCase().includes(q) ||
            r.description?.toLowerCase().includes(q)
        );
  }, [roles, query]);

  const setLevel = (moduleKey: string, level: Level) => {
    if (!draft) return;
    const next: Role = {
      ...draft,
      permissions: { ...draft.permissions, [moduleKey]: level },
    };
    setDraft(next);
    setDirty(true);
  };

  const setAll = (level: Level) => {
    if (!draft) return;
    const next: Role = { ...draft, permissions: fill(level) };
    setDraft(next);
    setDirty(true);
  };

  const applyPreset = (key: string) => {
    if (!draft) return;
    const def = PRESETS.find((p) => p.key === key);
    if (!def) return;
    setDraft({ ...draft, permissions: def.map() });
    setDirty(true);
  };

  const save = () => {
    if (!draft) return;
    setRoles((prev) =>
      prev.map((r) =>
        r.id === draft.id
          ? {
              ...draft,
              audit: { updatedAt: isoNow(), updatedBy: "you@superadmin" },
            }
          : r
      )
    );
    setDirty(false);
  };

  const addRole = () => {
    const id = `r${Math.floor(Math.random() * 1e6)}`;
    const newRole: Role = {
      id,
      title: "New Role",
      description: "",
      isActive: true,
      permissions: fill("view"),
      price: 0,
      currency: "INR",
      audit: { updatedAt: isoNow(), updatedBy: "you@superadmin" },
    };
    setRoles((prev) => [newRole, ...prev]);
    setSelectedId(id);
  };

  const [confirm, setConfirm] = useState<{
    open: boolean;
    targetId?: string;
    title?: string;
  }>({ open: false });
  const removeRole = () => {
    if (!selected) return;
    setConfirm({ open: true, targetId: selected.id, title: selected.title });
  };
  const doDelete = () => {
    if (!confirm.targetId) return;
    setRoles((prev) => prev.filter((r) => r.id !== confirm.targetId));
    setConfirm({ open: false });
    const next = roles.find((r) => r.id !== confirm.targetId);
    setSelectedId(next?.id ?? "");
  };

  return (
    <TooltipProvider delayDuration={150}>
      <div className="h-full bg-background text-foreground">
        <div className="mx-auto max-w-7xl px-4 py-6 h-[calc(100dvh-170px)] min-h-0 flex flex-col overflow-hidden">
          <div className="grid grid-cols-12 gap-4 flex-1 min-h-0">
            {/* Left: Role list */}
            <div className="col-span-4 h-full min-h-0">
              <div className="rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col h-full">
                <div className="flex items-center justify-between  border-b border-border px-3 py-2 bg-foreground/5">
                  <div className="font-medium text-sm flex items-center gap-2">
                    <AdminPanelSettingsIcon className="h-5 w-5" /> Roles
                  </div>
                  <Button
                    
                    onClick={addRole}
                  >
                    <AddIcon className="mr-1 h-4 w-4" />
                    New
                  </Button>
                </div>
                <div className="p-3 border-b border-border">
                  <Input
                    placeholder="Search roles…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="border-border focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <ScrollArea className="flex-1 min-h-0">
                  <div>
                    {filtered.map((r) => (
                      <button
                        key={r.id}
                        onClick={() => setSelectedId(r.id)}
                        className={`w-full text-left px-3 py-3 border-b border-border hover:bg-foreground/5 hover:transition ${
                          selectedId === r.id ? "border-primary border" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="truncate font-medium">{r.title}</div>

                          <StatusBadge
                            status={r.isActive ? "Active" : "Inactive"}
                          />
                        </div>
                        {r.description ? (
                          <div className="text-xs text-muted truncate mt-0.5">
                            {r.description}
                          </div>
                        ) : null}
                        <div className="text-[11px] text-muted mt-1">
                          Updated {timeAgo(r.audit.updatedAt)} by{" "}
                          {r.audit.updatedBy}
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>

            {/* Right: SIMPLE Editor */}
            <div className="col-span-8 h-full min-h-0">
              <div className="rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col h-full">
                <div className=" border-b border-border px-4 py-3 flex items-center justify-between bg-foreground/5">
                  <div className="flex flex-wrap items-center gap-3 ">
                    <ShieldIcon className="h-5 w-5" />
                    <Input
                      value={draft?.title ?? ""}
                      onChange={(e) => {
                        if (!draft) return;
                        setDraft({ ...draft, title: e.target.value });
                        setDirty(true);
                      }}
                      placeholder="Role title"
                      className="h-9 w-[220px] border-border focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <PriceCurrency
                            amount={draft?.price}
                            currency={draft?.currency ?? "INR"}
                            onChange={(amt, cur) => {
                              if (!draft) return;
                              setDraft({ ...draft, price: amt, currency: cur });
                              setDirty(true);
                            }}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        Set a price for this role and choose the currency.
                      </TooltipContent>
                    </Tooltip>
                    <div className="hidden md:flex items-center gap-2 text-xs text-muted">
                      <InfoOutlinedIcon className="h-4 w-4" /> Levels: None /
                      View / Edit / Manage / Full
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      className=""
                      disabled={!dirty}
                      onClick={save}
                    >
                      <SaveIcon className="mr-1 h-4 w-4" />
                      Save
                    </Button>
                    <Button
                      variant="destructive"
                      className="border-border"
                      onClick={removeRole}
                    >
                      <DeleteOutlineIcon className="mr-1 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>

                {/* Presets */}
                <div className="px-4 py-3 border-b border-border">
                  <div className="text-xs uppercase tracking-wide text-muted mb-2">
                    Quick Presets
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {PRESETS.map((p) => (
                      <Tooltip key={p.key}>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            className="border-border"
                            onClick={() => applyPreset(p.key)}
                          >
                            <AutoAwesomeIcon className="mr-2 h-4 w-4" />
                            {p.label}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{PRESET_HELP[p.key]}</TooltipContent>
                      </Tooltip>
                    ))}
                    <div className="ml-auto flex items-center gap-2 text-xs">
                      <span>Set all:</span>
                      {(
                        ["none", "view", "edit", "manage", "full"] as Level[]
                      ).map((l) => (
                        <Tooltip key={l}>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              className="border-border h-8 px-3"
                              onClick={() => setAll(l)}
                            >
                              {uc(l)}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{LEVEL_HELP[l]}</TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Permissions Grid */}
                <div className="px-2 flex-1 min-h-0 flex flex-col">
                  <div className="grid grid-cols-12  border-y border-border text-xs font-semibold uppercase tracking-wider">
                    <div className="col-span-6 px-3 py-3">Module</div>
                    <div className="col-span-6 px-3 py-3">Access</div>
                  </div>
                  <ScrollArea className="flex-1 min-h-0">
                    <div>
                      {MODULES.map((m) => (
                        <div
                          key={m.key}
                          className="grid grid-cols-12 items-center border-b border-border"
                        >
                          <div className="col-span-6 px-3 py-3 font-medium">
                            {m.label}
                          </div>
                          <div className="col-span-6 px-3 py-2">
                            <LevelToggle
                              value={draft?.permissions[m.key] ?? "none"}
                              onChange={(v) => setLevel(m.key, v)}
                            />
                            <div className="text-[11px] text-muted mt-1">
                              Full ⟶ Manage ⟶ Edit ⟶ View ⟶ None
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Audit */}
                <div className="border-t border-border p-4 bg-background flex items-center justify-between">
                  <div className="text-sm text-muted">
                    Updated {selected?.audit.updatedAt} by{" "}
                    {selected?.audit.updatedBy}
                  </div>
                  <div className="text-xs text-muted">
                    Unsaved changes: {dirty ? "Yes" : "No"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm delete */}
        <Dialog
          open={confirm.open}
          onOpenChange={(o) => setConfirm((s) => ({ ...s, open: o }))}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete role?</DialogTitle>
              <DialogDescription>
                "{confirm.title}" will be removed. This cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                className="border-border"
                onClick={() => setConfirm({ open: false })}
              >
                Cancel
              </Button>
              <Button
                className="border border-border bg-background text-foreground hover:bg-primary/10"
                onClick={doDelete}
              >
                <DeleteOutlineIcon className="mr-1 h-4 w-4" /> Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <DevTests />
      </div>
    </TooltipProvider>
  );
}
