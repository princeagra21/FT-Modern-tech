"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface Company {
  name: string;
  website?: string;
  address?: string;
}

interface EditCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: Company;
  onSave: (updatedCompany: Company) => void;
}

export function EditCompanyDialog({
  open,
  onOpenChange,
  company,
  onSave,
}: EditCompanyDialogProps) {
  const [formData, setFormData] = useState(company);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) setFormData(company);
  }, [open, company]);

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Company</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium">Company Name</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter company name"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Website</label>
            <Input
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Address</label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Company address"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
