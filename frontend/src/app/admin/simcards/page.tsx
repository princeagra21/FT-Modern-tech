"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

// Components

// Types
import {
  SimCardRow,
  AddSimCardFormData,
  BulkUploadSimCardData,
  Provider,
} from "@/lib/types/simcards";
import { AddSimCardDialog } from "@/components/admin/AddSimCardDialog";
import { BulkUploadSimCardsDialog } from "@/components/admin/BulkUploadSimCardsDialog";
import { SimCardsTable } from "@/components/admin/SimCardsTable";

// Mock data - replace with actual API calls
const mockProviders: Provider[] = [
  { id: "1", name: "Vodafone" },
  { id: "2", name: "Airtel" },
  { id: "3", name: "Jio" },
  { id: "4", name: "BSNL" },
  { id: "5", name: "Vi" },
];

const mockSimCards: SimCardRow[] = [
  {
    SimNo: "1234567890",
    Provider: "Vodafone",
    IMSI: "123456789012345",
    ICCID: "89012345678901234567",
    Status: "active",
    CreatedAt: "2024-01-15T10:30:00Z",
  },
  {
    SimNo: "0987654321",
    Provider: "Airtel",
    IMSI: "987654321098765",
    ICCID: "89987654321098765432",
    Status: "inactive",
    CreatedAt: "2024-01-14T14:20:00Z",
  },
  {
    SimNo: "5555666677",
    Provider: "Jio",
    IMSI: undefined,
    ICCID: undefined,
    Status: "suspended",
    CreatedAt: "2024-01-13T09:15:00Z",
  },
];

function SimCardsPage() {
  const [simCards, setSimCards] = useState<SimCardRow[]>(mockSimCards);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddSimCard = async (data: AddSimCardFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const provider = mockProviders.find((p) => p.id === data.provider);
    const newSimCard: SimCardRow = {
      SimNo: data.simno,
      Provider: provider?.name || data.provider,
      IMSI: data.imsi,
      ICCID: data.iccid,
      Status: "active",
      CreatedAt: new Date().toISOString(),
    };

    setSimCards((prev) => [newSimCard, ...prev]);
  };

  const handleBulkUpload = async (data: BulkUploadSimCardData[]) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newSimCards: SimCardRow[] = data.map((item) => {
      const provider = mockProviders.find(
        (p) =>
          p.name.toLowerCase() === item.provider.toLowerCase() ||
          p.id === item.provider
      );

      return {
        SimNo: item.simno,
        Provider: provider?.name || item.provider,
        IMSI: item.imsi,
        ICCID: item.iccid,
        Status: "active",
        CreatedAt: new Date().toISOString(),
      };
    });

    setSimCards((prev) => [...newSimCards, ...prev]);
  };

  const handleSimCardAction = async (
    action: string,
    selectedSimCards: SimCardRow[]
  ) => {
    try {
      setIsLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const simNos = selectedSimCards.map((sim) => sim.SimNo);

      switch (action) {
        case "activate":
          setSimCards((prev) =>
            prev.map((sim) =>
              simNos.includes(sim.SimNo) ? { ...sim, Status: "active" } : sim
            )
          );
          toast.success(`Activated ${selectedSimCards.length} SIM card(s)`);
          break;

        case "suspend":
          setSimCards((prev) =>
            prev.map((sim) =>
              simNos.includes(sim.SimNo) ? { ...sim, Status: "suspended" } : sim
            )
          );
          toast.success(`Suspended ${selectedSimCards.length} SIM card(s)`);
          break;

        case "deactivate":
          setSimCards((prev) =>
            prev.map((sim) =>
              simNos.includes(sim.SimNo) ? { ...sim, Status: "inactive" } : sim
            )
          );
          toast.success(`Deactivated ${selectedSimCards.length} SIM card(s)`);
          break;

        case "delete":
          setSimCards((prev) =>
            prev.filter((sim) => !simNos.includes(sim.SimNo))
          );
          toast.success(`Deleted ${selectedSimCards.length} SIM card(s)`);
          break;

        default:
          toast.error("Unknown action");
      }
    } catch (error) {
      toast.error("Failed to perform action");
      console.error("SIM card action error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      // Simulate API call to refresh data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // In real implementation, you would fetch data from API here
      setSimCards([...mockSimCards]);
      toast.success("Data refreshed");
    } catch (error) {
      toast.error("Failed to refresh data");
      console.error("Refresh error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-6 pb-14 pt-8">
        {/* Top Bar */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">SIM Cards</h1>
            <p className="text-sm text-neutral-500">
              Manage and monitor SIM cards in your fleet
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <BulkUploadSimCardsDialog
              onSubmit={handleBulkUpload}
              providers={mockProviders}
            />
            <AddSimCardDialog
              onSubmit={handleAddSimCard}
              providers={mockProviders}
            />
          </div>
        </div>

        {/* SIM Cards Table */}
        <SimCardsTable
          simCards={simCards}
          onRefresh={handleRefresh}
          onSimCardAction={handleSimCardAction}
        />
      </div>
    </main>
  );
}

export default SimCardsPage;
