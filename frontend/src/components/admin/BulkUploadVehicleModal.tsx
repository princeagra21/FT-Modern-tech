"use client";

import { Close, UploadFile } from "@mui/icons-material";
import React from "react";
import { Button } from "../ui/button";

interface BulkUploadForm {
  plan: string;
  file: File | null;
}

interface BulkUploadVehicleModalProps {
  show: boolean;
  setShow: (value: boolean) => void;
  plans: string[];
  bulkUploadForm: BulkUploadForm;
  setBulkUploadForm: React.Dispatch<React.SetStateAction<BulkUploadForm>>;
  handleBulkUploadSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function BulkUploadVehicleModal({
  show,
  setShow,
  plans,
  bulkUploadForm,
  setBulkUploadForm,
  handleBulkUploadSubmit,
}: BulkUploadVehicleModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[520] flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setShow(false)}
      />

      {/* MODAL */}
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-background text-foreground p-6 shadow-2xl animate-fade-in-up">
        {/* TITLE BAR */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="typo-h2">Bulk Upload</h2>
          <div
            onClick={() => setShow(false)}
            className="rounded-lg p-1 text-muted hover:bg-muted/20 hover:text-foreground transition"
          >
            <Close fontSize="small" />
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleBulkUploadSubmit} className="space-y-4">
          {/* PLAN */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Select Plan
            </label>
            <select
              value={bulkUploadForm.plan}
              onChange={(e) =>
                setBulkUploadForm((p) => ({ ...p, plan: e.target.value }))
              }
              required
              className="w-full rounded-xl border border-border bg-muted px-3 py-2 text-sm outline-none focus:border-accent focus:bg-background"
            >
              <option value="">Select Plan</option>
              {plans.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* FILE UPLOAD */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Upload CSV File
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                id="bulk-upload-file"
                required
                className="hidden"
                onChange={(e) =>
                  setBulkUploadForm((prev) => ({
                    ...prev,
                    file: e.target.files?.[0] || null,
                  }))
                }
              />

              <label
                htmlFor="bulk-upload-file"
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border px-6 py-8 text-sm text-muted hover:border-accent hover:bg-background transition"
              >
                <UploadFile fontSize="large" />
                <div className="text-center">
                  <div className="font-medium">
                    {bulkUploadForm.file?.name || "Choose file or drag and drop"}
                  </div>
                  <div className="text-xs mt-1 opacity-70">
                    CSV, Excel files up to 10MB
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* CSV FORMAT INFO */}
          <div className="rounded-xl bg-accent/10 p-4 text-sm">
            <div className="font-medium mb-2 text-accent">
              Required CSV Format:
            </div>
            <div className="space-y-1 text-foreground opacity-80">
              <div>
                <strong>Columns:</strong> Username, Vehicle No., Vehicle Type,
                Device Type, IMEI, SIM
              </div>
              <div>
                <strong>Example:</strong>
              </div>
              <div className="font-mono text-xs bg-accent/20 p-2 rounded mt-2 break-words">
                Username,Vehicle No.,Vehicle Type,Device Type,IMEI,SIM<br />
                John Doe,MH01AB1234,Car,Teltonika FMB920,123456789012345,9876543210
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShow(false)}
              className="flex-1 rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-background hover:bg-secondary transition"
            >
              Upload Vehicles
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
