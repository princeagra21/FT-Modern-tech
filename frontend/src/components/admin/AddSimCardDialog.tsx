"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Icons
import { Add as AddIcon } from "@mui/icons-material";

// Types
import { AddSimCardFormData, Provider } from "@/lib/types/simcards";

// Form validation schema
const addSimCardSchema = z.object({
  simno: z.string().min(1, "SIM number is required"),
  imsi: z.string().optional(),
  provider: z.string().min(1, "Please select a provider"),
  iccid: z.string().optional(),
});

interface AddSimCardDialogProps {
  onSubmit: (data: AddSimCardFormData) => Promise<void>;
  providers: Provider[];
}

export function AddSimCardDialog({
  onSubmit,
  providers,
}: AddSimCardDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddSimCardFormData>({
    resolver: zodResolver(addSimCardSchema),
    defaultValues: {
      simno: "",
      imsi: "",
      provider: "",
      iccid: "",
    },
  });

  const handleSubmit = async (data: AddSimCardFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      toast.success("SIM card added successfully!");
      form.reset();
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to add SIM card. Please try again.");
      console.error("Add SIM card error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <AddIcon className="w-4 h-4 mr-2" />
          Add SIM Card
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New SIM Card</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="simno"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SIM Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter SIM number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {providers.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imsi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IMSI (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter IMSI" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="iccid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ICCID (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter ICCID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add SIM Card"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
