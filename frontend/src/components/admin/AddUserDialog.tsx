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
import { PhoneInput } from "../common/CommonPhoneInput";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import AddressSelector from "../common/AddressSelector";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => void;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({
  open,
  onOpenChange,
  onSave,
}) => {
  const [form, setForm] = useState({
    role: "",
    name: "",
    email: "",
    mobilePrefix: "+91",
    mobileNumber: "",
    username: "",
    password: "",
    companyName: "",
    address: "",
    countryCode: "IN",
    stateCode: "UP",
    city: "",
    pincode: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(form);
    onOpenChange(false);
  };
  const ROLES = [
    "Admin",
    "User",
    "Sub-User",
    "Driver",
    "Manager",
    "Team",
  ] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add User</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enter new user details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <Select
            value={form.role}
            onValueChange={(val) => handleChange("role", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <PhoneInput
            value={form.mobileNumber}
            onChange={(val) => {
              handleChange("mobileNumber", val);
            }}
          />
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
          {/* <div className="grid  gap-2"> */}
          <AddressSelector
            onChange={({ countryCode, stateCode, city }) => {
              handleChange("countryCode", countryCode);
              handleChange("stateCode", stateCode);
              handleChange("city", city);
            }}
          />{" "}
          {/* </div> */}
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Pincode"
              value={form.pincode}
              onChange={(e) => handleChange("pincode", e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <Button onClick={handleSave}>Add User</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
