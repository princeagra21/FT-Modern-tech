"use client";

import React from "react";
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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PhoneInput } from "@/components/common/CommonPhoneInput";

// ✅ Zod Schema for Validation
const adminSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  mobilePrefix: z.string().optional(),
  mobileNumber: z
    .string()
    .min(7, "Enter a valid phone number")
    .max(15, "Enter a valid phone number"),
  addressLine: z.string().min(1, "Address is required"),
  countryCode: z.string().min(1, "Country code is required"),
  stateCode: z.string().min(1, "State code is required"),
  cityName: z.string().min(1, "City name is required"),
  pincode: z
    .string()
    .min(5, "Enter a valid pincode")
    .max(6, "Enter a valid pincode"),
});

type AdminFormData = z.infer<typeof adminSchema>;

interface EditAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: AdminFormData;
  onSave: (updated: AdminFormData) => void;
}

const EditAdminDialog: React.FC<EditAdminDialogProps> = ({
  open,
  onOpenChange,
  data,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema),
    defaultValues: data,
  });

  const onSubmit = (values: AdminFormData) => {
    onSave(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit Admin Profile</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update admin details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 py-2">
          {/* Name */}
          <div>
            <Input placeholder="Full Name" {...register("name")} />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <Input placeholder="Email" {...register("email")} />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Mobile Number */}
          <div>
            <PhoneInput
              value={data.mobileNumber}
              onChange={(val) => setValue("mobileNumber", val)}
            />
            {errors.mobileNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.mobileNumber.message}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <Textarea placeholder="Address Line" {...register("addressLine")} />
            {errors.addressLine && (
              <p className="text-red-500 text-sm mt-1">
                {errors.addressLine.message}
              </p>
            )}
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input placeholder="Country Code" {...register("countryCode")} />
              {errors.countryCode && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.countryCode.message}
                </p>
              )}
            </div>
            <div>
              <Input placeholder="State Code" {...register("stateCode")} />
              {errors.stateCode && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.stateCode.message}
                </p>
              )}
            </div>
            <div>
              <Input placeholder="City Name" {...register("cityName")} />
              {errors.cityName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.cityName.message}
                </p>
              )}
            </div>
            <div>
              <Input placeholder="Pincode" {...register("pincode")} />
              {errors.pincode && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.pincode.message}
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end pt-3">
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAdminDialog;
