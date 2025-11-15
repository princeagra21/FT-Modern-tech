"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Add as AddIcon, Upload as UploadIcon } from "@mui/icons-material";
import CommonKpiStats from "@/components/common/CommonKpiStats";
import {
  AddDeviceFormData,
  BulkUploadDeviceData,
  DeviceRow,
  DeviceType,
  SIM,
} from "@/lib/types/devices";
import { DevicesTable } from "@/components/admin/DevicesTable";
import toast from "react-hot-toast";
import { AddDeviceDialog } from "@/components/admin/AddDeviceDialog";
import { BulkUploadDeviceDialog } from "@/components/admin/BulkUploadDevices";

const mockDevices: DeviceRow[] = [
  {
    IMEI: "123456789012345",
    DeviceType: "GPS Tracker",
    SIM: "+1234567890",
    SIMProvider: "Verizon",
    Status: "active",
    CreatedAt: "2024-01-15T10:30:00Z",
  },
  {
    IMEI: "234567890123456",
    DeviceType: "Vehicle Tracker",
    SIM: "+2345678901",
    SIMProvider: "AT&T",
    Status: "active",
    CreatedAt: "2024-01-16T14:45:00Z",
  },
  {
    IMEI: "345678901234567",
    DeviceType: "Asset Tracker",
    Status: "inactive",
    CreatedAt: "2024-01-17T09:15:00Z",
  },
  {
    IMEI: "456789012345678",
    DeviceType: "OBD Tracker",
    SIM: "+3456789012",
    SIMProvider: "T-Mobile",
    Status: "maintenance",
    CreatedAt: "2024-01-18T16:20:00Z",
  },
];

// ✅ Function to extract counts and return KPI data
const getDeviceKpiData = (devices: DeviceRow[]) => {
  const total = devices.length;
  const active = devices.filter((d) => d.Status === "active").length;
  const inactive = devices.filter((d) => d.Status === "inactive").length;
  const maintenance = devices.filter((d) => d.Status === "maintenance").length;

  return [
    { title: "Total Devices", value: total },
    { title: "Active Devices", value: active },
    { title: "Inactive Devices", value: inactive },
    { title: "In Maintenance", value: maintenance },
  ];
};

const mockDeviceTypes: DeviceType[] = [
  { id: "1", name: "GT06", manufacturer: "TechCorp", model: "GT-100" },
  { id: "2", name: "FMB920", manufacturer: "FleetTech", model: "VT-200" },
  { id: "3", name: "AT-300", manufacturer: "SecureTrack", model: "AT-300" },
  { id: "4", name: "OBD-400", manufacturer: "AutoMonitor", model: "OBD-400" },
];

const mockSIMs: SIM[] = [
  {
    id: "1",
    number: "+1234567890",
    provider: "Verizon",
    status: "active",
    imsi: "123456789012345",
    iccid: "12345678901234567890",
  },
  {
    id: "2",
    number: "+2345678901",
    provider: "AT&T",
    status: "active",
    imsi: "234567890123456",
    iccid: "23456789012345678901",
  },
  {
    id: "3",
    number: "+3456789012",
    provider: "T-Mobile",
    status: "active",
    imsi: "345678901234567",
    iccid: "34567890123456789012",
  },
  {
    id: "4",
    number: "+4567890123",
    provider: "Sprint",
    status: "inactive",
    imsi: "456789012345678",
    iccid: "45678901234567890123",
  },
];

function page() {
  const [isLoading, setIsLoading] = useState(false);
  const [devices, setDevices] = useState<DeviceRow[]>(mockDevices);
  const kpiData = getDeviceKpiData(mockDevices);
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>(mockDeviceTypes);
  const [sims, setSims] = useState<SIM[]>(mockSIMs);

  const fetchDevices = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setDevices(mockDevices);
    } catch (error) {
      toast.error("Failed to fetch devices");
      console.error("Fetch devices error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeviceAction = async (
    action: string,
    selectedDevices: DeviceRow[]
  ) => {
    try {
      const imeis = selectedDevices.map((device) => device.IMEI);

      switch (action) {
        case "activate":
          setDevices((prev) =>
            prev.map((device) =>
              imeis.includes(device.IMEI)
                ? { ...device, Status: "active" as const }
                : device
            )
          );
          toast.success(`Activated ${selectedDevices.length} device(s)`);
          break;

        case "deactivate":
          setDevices((prev) =>
            prev.map((device) =>
              imeis.includes(device.IMEI)
                ? { ...device, Status: "inactive" as const }
                : device
            )
          );
          toast.success(`Deactivated ${selectedDevices.length} device(s)`);
          break;

        case "maintenance":
          setDevices((prev) =>
            prev.map((device) =>
              imeis.includes(device.IMEI)
                ? { ...device, Status: "maintenance" as const }
                : device
            )
          );
          toast.success(
            `Set ${selectedDevices.length} device(s) to maintenance`
          );
          break;

        case "delete":
          setDevices((prev) =>
            prev.filter((device) => !imeis.includes(device.IMEI))
          );
          toast.success(`Deleted ${selectedDevices.length} device(s)`);
          break;

        default:
          console.warn(`Unknown action: ${action}`);
      }

      // In a real app, you would make an API call here
      // await api.updateDevices(imeis, { action });
    } catch (error) {
      toast.error(`Failed to ${action} devices`);
      console.error(`Device ${action} error:`, error);
    }
  };

  const handleAddNewSim = () => {
    toast.success("Add New SIM feature coming soon!");
    // In a real app, this would open a dialog to add a new SIM
  };

  const handleBulkUpload = async (data: BulkUploadDeviceData[]) => {
    try {
      const newDevices: DeviceRow[] = data.map((device) => ({
        IMEI: device.imei,
        DeviceType: device.deviceType,
        SIM: device.sim,
        SIMProvider: device.simProvider,
        Status: "active",
        CreatedAt: new Date().toISOString(),
      }));

      setDevices((prev) => [...newDevices, ...prev]);

      // In a real app, you would make an API call here
      // await api.bulkCreateDevices(data);
    } catch (error) {
      console.error("Bulk upload error:", error);
      throw error;
    }
  };

  const handleAddDevice = async (data: AddDeviceFormData) => {
    try {
      const deviceType = deviceTypes.find((dt) => dt.id === data.deviceTypeId);
      const sim = data.simId
        ? sims.find((s) => s.id === data.simId)
        : undefined;

      const newDevice: DeviceRow = {
        IMEI: data.imei,
        DeviceType: deviceType?.name || "Unknown",
        SIM: sim?.number,
        SIMProvider: sim?.provider,
        Status: "active",
        CreatedAt: new Date().toISOString(),
      };

      setDevices((prev) => [newDevice, ...prev]);

      // In a real app, you would make an API call here
      // await api.createDevice(data);
    } catch (error) {
      console.error("Add device error:", error);
      throw error;
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-6 pb-14 pt-8">
        {/* Top Bar */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Devices</h1>
            <p className="text-sm text-neutral-500">
              Manage and monitor your fleet devices
            </p>
          </div>
          <div className="flex items-center gap-3">
            <BulkUploadDeviceDialog
              onSubmit={handleBulkUpload}
              deviceTypes={deviceTypes}
            />
            <AddDeviceDialog
              onSubmit={handleAddDevice}
              deviceTypes={deviceTypes}
              sims={sims}
              onAddNewSim={handleAddNewSim}
            />
          </div>
        </div>

        <CommonKpiStats data={kpiData} />

        {/* Devices Table */}
        <div>
          <DevicesTable
            devices={mockDevices}
            onRefresh={fetchDevices}
            onDeviceAction={handleDeviceAction}
          />
        </div>
      </div>
    </main>
  );
}

export default page;
