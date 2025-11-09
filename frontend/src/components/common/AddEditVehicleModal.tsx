"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// ✅ Schema for validation
const vehicleSchema = z.object({
  user: z.string().optional(),
  vehicleNo: z.string().min(2, "Vehicle number is required"),
  imei: z.string().optional(),
  sim: z.string().optional(),
  plan: z.string().optional(),
  name: z.string().optional(),
  vin: z.string().optional(),
  plateNumber: z.string().optional(),
  timezone: z.string().optional(),
  deviceType: z.string().min(1, "Select a device type"),
  vehicleType: z.string().min(1, "Select a vehicle type"),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface VehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: VehicleFormData) => void;
  vehicle?: Partial<VehicleFormData> | null; // if present → edit mode
}

const deviceTypes = [
  { name: "FBM920" },
  { name: "GT06" },
  { name: "FM1200" },
  { name: "GV500" },
];

export const AddEditVehicleDialog: React.FC<VehicleDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  vehicle,
}) => {
  const isEdit = Boolean(vehicle);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: vehicle || {
      user: "",
      vehicleNo: "",
      imei: "",
      sim: "",
      plan: "",
      name: "",
      vin: "",
      plateNumber: "",
      timezone: "",
      deviceType: "",
      vehicleType: "",
    },
  });

  const handleFormSubmit = (data: VehicleFormData) => {
    onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Vehicle" : "Add Vehicle"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the details of this vehicle."
              : "Fill in the details to add a new vehicle."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
          {/* ADD MODE ONLY FIELDS */}
          {!isEdit && (
            <>
              {/* Select User */}
              <div className="space-y-2">
                <Label>Select User or Add</Label>
                <Input placeholder="Search user..." {...register("user")} />
              </div>

              {/* Vehicle No */}
              <div className="space-y-2">
                <Label>Vehicle No.</Label>
                <Input
                  placeholder="Enter vehicle number"
                  {...register("vehicleNo")}
                />
                {errors.vehicleNo && (
                  <p className="text-xs text-red-500">
                    {errors.vehicleNo.message}
                  </p>
                )}
              </div>

              {/* Search IMEI */}
              <div className="space-y-2">
                <Label>Search IMEI or Add</Label>
                <Input placeholder="Enter IMEI" {...register("imei")} />
              </div>

              {/* Search SIM */}
              <div className="space-y-2">
                <Label>Search SIM or Add</Label>
                <Input placeholder="Enter SIM number" {...register("sim")} />
              </div>

              {/* Plan */}
              <div className="space-y-2">
                <Label>Plan</Label>
                <Select onValueChange={(val) => setValue("plan", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* COMMON FIELDS (Edit or Add) */}
          {isEdit && (
            <>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input placeholder="Vehicle name" {...register("name")} />
              </div>

              <div className="space-y-2">
                <Label>VIN</Label>
                <Input placeholder="Enter VIN" {...register("vin")} />
              </div>

              <div className="space-y-2">
                <Label>Plate Number</Label>
                <Input
                  placeholder="Enter plate number"
                  {...register("plateNumber")}
                />
              </div>

              <div className="space-y-2">
                <Label>Timezone</Label>
                <Input
                  placeholder="e.g. Asia/Kolkata"
                  {...register("timezone")}
                />
              </div>
            </>
          )}

          {/* Device Type */}
          {/* Device Type */}
          <div className="space-y-2">
            <Label>Device Type</Label>
            <Select
              onValueChange={(val) => setValue("deviceType", val)}
              defaultValue={vehicle?.deviceType || ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select device type" />
              </SelectTrigger>
              <SelectContent>
                {deviceTypes.map((d) => (
                  <SelectItem key={d.name} value={d.name}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.deviceType && (
              <p className="text-xs text-red-500">
                {errors.deviceType.message}
              </p>
            )}
          </div>

          {/* Vehicle Type */}
          <div className="space-y-2">
            <Label>Vehicle Type</Label>
            <Select
              onValueChange={(val) => setValue("vehicleType", val)}
              defaultValue={vehicle?.vehicleType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select vehicle type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Truck">Truck</SelectItem>
                <SelectItem value="Car">Car</SelectItem>
                <SelectItem value="SUV">SUV</SelectItem>
                <SelectItem value="Van">Van</SelectItem>
                <SelectItem value="Bus">Bus</SelectItem>
              </SelectContent>
            </Select>
            {errors.vehicleType && (
              <p className="text-xs text-red-500">
                {errors.vehicleType.message}
              </p>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? "Save Changes" : "Add Vehicle"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
