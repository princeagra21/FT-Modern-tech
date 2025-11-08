"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface AddAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => void;
}

const AddAdminDialog: React.FC<AddAdminDialogProps> = ({
  open,
  onOpenChange,
  onSave,
}) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobilePrefix: "+91",
    mobileNumber: "",
    username: "",
    password: "",
    companyName: "",
    address: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    credits: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add Admin</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter new admin details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <Input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <Input
            placeholder="Email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          <div className="flex gap-2">
            <Input
              placeholder="Prefix"
              value={form.mobilePrefix}
              onChange={(e) => handleChange("mobilePrefix", e.target.value)}
              className="w-24"
            />
            <Input
              placeholder="Mobile Number"
              value={form.mobileNumber}
              onChange={(e) => handleChange("mobileNumber", e.target.value)}
            />
          </div>
          <Input
            placeholder="Username"
            value={form.username}
            onChange={(e) => handleChange("username", e.target.value)}
          />
          <Input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
          <Input
            placeholder="Company Name"
            value={form.companyName}
            onChange={(e) => handleChange("companyName", e.target.value)}
          />
          <Textarea
            placeholder="Address"
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Country"
              value={form.country}
              onChange={(e) => handleChange("country", e.target.value)}
            />
            <Input
              placeholder="State"
              value={form.state}
              onChange={(e) => handleChange("state", e.target.value)}
            />
            <Input
              placeholder="City"
              value={form.city}
              onChange={(e) => handleChange("city", e.target.value)}
            />
            <Input
              placeholder="Pincode"
              value={form.pincode}
              onChange={(e) => handleChange("pincode", e.target.value)}
            />
          </div>
          <Input
            placeholder="Credits"
            value={form.credits}
            onChange={(e) => handleChange("credits", e.target.value)}
          />
        </div>

        <div className="flex justify-end pt-3">
          <Button onClick={handleSave}>Add Admin</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddAdminDialog;
