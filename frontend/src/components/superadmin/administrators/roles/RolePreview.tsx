"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import { DEMO_ROLES, MODULES } from "@/lib/data/superadmin";
import { LevelToggle } from "@/lib/utils/superadmin/roles";
import { Role } from "@/lib/types/superadmin";

type Level = "none" | "view" | "edit" | "manage" | "full";

export default function RoleContent() {
  const [roles, setRoles] = useState<Role[]>(DEMO_ROLES);
  const [selectedId, setSelectedId] = useState<string>(roles[0]?.id ?? "");
  const selected = useMemo(
    () => roles.find((r) => r.id === selectedId) ?? null,
    [roles, selectedId]
  );
  const [draft, setDraft] = useState<Role | null>(
    selected ? { ...selected } : null
  );

  useEffect(() => {
    setDraft(selected ? { ...selected } : null);
  }, [selectedId]);

  const setLevel = (moduleKey: string, level: Level) => {
    if (!draft) return;
    const next: Role = {
      ...draft,
      permissions: { ...draft.permissions, [moduleKey]: level },
    };
    setDraft(next);
  };

  return (
    <div className="h-full bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-4 py-6 flex flex-col gap-6">
        {/* Role Selector */}
        <div className="w-full border border-border rounded-2xl p-4 bg-card">
          <h2 className="text-lg font-semibold mb-3 text-foreground">
            Select Role
          </h2>
          <Select value={selectedId} onValueChange={(v) => setSelectedId(v)}>
            <SelectTrigger className="w-full border border-border bg-background text-foreground">
              <SelectValue placeholder="Choose role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Role Preview */}
        <div className="w-full border border-border rounded-2xl bg-card p-4">
          {draft ? (
            <>
              <div className="border-b border-border pb-3 mb-4">
                <h2 className="typo-h1 font-bold text-foreground">
                  {draft.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Permissions overview for this role
                </p>
              </div>

              <div className="flex-1 flex flex-col">
                <div className="grid grid-cols-12 border-y border-border typo-h6 uppercase tracking-wider">
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
                            value={draft.permissions[m.key] ?? "none"}
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
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <SecurityRoundedIcon fontSize="large" />
              <p className="mt-2 text-sm">
                Select a role to preview its permissions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
