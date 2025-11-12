"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Add as AddIcon, Upload as UploadIcon } from "@mui/icons-material";
import CommonKpiStats from "@/components/common/CommonKpiStats";
import { DeviceRow } from "@/lib/types/devices";
import { DevicesTable } from "@/components/admin/DevicesTable";
import toast from "react-hot-toast";


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
  const active = devices.filter(d => d.Status === "active").length;
  const inactive = devices.filter(d => d.Status === "inactive").length;
  const maintenance = devices.filter(d => d.Status === "maintenance").length;

  return [
    { title: "Total Devices", value: total },
    { title: "Active Devices", value: active},
    { title: "Inactive Devices", value: inactive},
    { title: "In Maintenance", value: maintenance},
  ];
};

function page() {
   const [isLoading, setIsLoading] = useState(false);
    const [devices, setDevices] = useState<DeviceRow[]>(mockDevices);
    const kpiData = getDeviceKpiData(mockDevices);
  
    const fetchDevices = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDevices(mockDevices);
      } catch (error) {
        toast.error('Failed to fetch devices');
        console.error('Fetch devices error:', error);
      } finally {
        setIsLoading(false);
      }
    };

   const handleDeviceAction = async (action: string, selectedDevices: DeviceRow[]) => {
    try {
      const imeis = selectedDevices.map(device => device.IMEI);
      
      switch (action) {
        case 'activate':
          setDevices(prev => 
            prev.map(device => 
              imeis.includes(device.IMEI) 
                ? { ...device, Status: 'active' as const }
                : device
            )
          );
          toast.success(`Activated ${selectedDevices.length} device(s)`);
          break;
          
        case 'deactivate':
          setDevices(prev => 
            prev.map(device => 
              imeis.includes(device.IMEI) 
                ? { ...device, Status: 'inactive' as const }
                : device
            )
          );
          toast.success(`Deactivated ${selectedDevices.length} device(s)`);
          break;
          
        case 'maintenance':
          setDevices(prev => 
            prev.map(device => 
              imeis.includes(device.IMEI) 
                ? { ...device, Status: 'maintenance' as const }
                : device
            )
          );
          toast.success(`Set ${selectedDevices.length} device(s) to maintenance`);
          break;
          
        case 'delete':
          setDevices(prev => 
            prev.filter(device => !imeis.includes(device.IMEI))
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

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-6 pb-14 pt-8">
        {/* Top Bar */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-sm text-neutral-500">
              Self‑hosted GPS Software • FleetStack
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button>
              <AddIcon className="w-4 h-4 mr-2" />
              Add Device
            </Button>
            <Button variant="outline">
              <UploadIcon className="w-4 h-4 mr-2" />
              Bulk Upload
            </Button>
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
