"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import AddIcon from "@mui/icons-material/Add";
import EyeIcon from "@mui/icons-material/Visibility";
import EyeOffIcon from "@mui/icons-material/VisibilityOff";

import { useState } from "react";
import RoleContent from "../superadmin/administrators/roles/RolePreview";

interface AddTeamDialogProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  onSubmit: (data: {
    name: string;
    mobile: string;
    email: string;
    username: string;
    password: string;
    roles: any; // from RoleContent component
  }) => void;
}

export default function AddTeamDialog({
  open,
  setOpen,
  onSubmit,
}: AddTeamDialogProps) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const [roles, setRoles] = useState<any>(null); // will update via RoleContent

  const resetForm = () => {
    setName("");
    setMobile("");
    setEmail("");
    setUsername("");
    setPassword("");
    setShowPwd(false);
    setRoles(null);
  };

  const handleSave = () => {
    onSubmit({ name, mobile, email, username, password, roles });
    setOpen(false);
    resetForm();
  };

  const canSave =
    name.trim() &&
    mobile.trim() &&
    email.trim() &&
    username.trim() &&
    password.trim();

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) resetForm();
      }}
    >
      <DialogContent className="sm:max-w-4xl bg-background text-foreground border border-border rounded-2xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="typo-h2">
            Add Team Member
          </DialogTitle>
          <DialogDescription className="text-muted">
            Enter details and assign permissions in one step.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-10 gap-5 max-h-[80vh] overflow-y-auto">
          {/* Left — Inputs */}
          <div className="md:col-span-4 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div>
                <Label>Mobile</Label>
                <Input
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <Label>Username</Label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <Label>Password</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-2"
                    onClick={() => setShowPwd((v) => !v)}
                  >
                    {showPwd ? <EyeOffIcon /> : <EyeIcon />}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-2"
                    onClick={() => setPassword(genPassword(12))}
                  >
                    Generate
                  </Button>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>

              <Button
                disabled={!canSave}
                onClick={handleSave}
                className="gap-2 bg-primary text-background hover:bg-secondary"
              >
                <AddIcon /> Save Member
              </Button>
            </div>
          </div>

          {/* Right — Role Module */}
          <div className="md:col-span-6">
            <RoleContent />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Utility for generating password
function genPassword(n: number) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";
  return Array.from(
    { length: n },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}
