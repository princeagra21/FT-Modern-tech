'use client';

import React from 'react';
import { SmartCheckboxAutoTable, DisplayMap, MultiSelectOption } from '@/components/common/smartcheckboxautotable';
import { SimCardRow } from '@/lib/types/simcards';
import { Badge } from '@/components/ui/badge';

interface SimCardsTableProps {
  simCards: SimCardRow[];
  onRefresh?: () => Promise<void>;
  onSimCardAction?: (action: string, simCards: SimCardRow[]) => void;
}

export function SimCardsTable({ simCards, onRefresh, onSimCardAction }: SimCardsTableProps) {
  
  const displayOptions: DisplayMap<SimCardRow> = {
    0: {
      title: () => <div className="font-semibold">SIM Number</div>,
      content: (row: SimCardRow) => (
        <div className="font-mono text-sm">
          {row.SimNo}
        </div>
      ),
    },
    1: {
      title: () => <div className="font-semibold">Provider</div>,
      content: (row: SimCardRow) => (
        <div className="font-medium">
          {row.Provider}
        </div>
      ),
    },
    2: {
      title: () => <div className="font-semibold">IMSI</div>,
      content: (row: SimCardRow) => (
        <div>
          {row.IMSI ? (
            <div className="font-mono text-sm">
              {row.IMSI}
            </div>
          ) : (
            <span className="text-gray-400 italic">-</span>
          )}
        </div>
      ),
    },
    3: {
      title: () => <div className="font-semibold">ICCID</div>,
      content: (row: SimCardRow) => (
        <div>
          {row.ICCID ? (
            <div className="font-mono text-sm">
              {row.ICCID}
            </div>
          ) : (
            <span className="text-gray-400 italic">-</span>
          )}
        </div>
      ),
    },
    4: {
      title: () => <div className="font-semibold">Status</div>,
      content: (row: SimCardRow) => {
        const statusColors = {
          active: "bg-green-100 text-green-800",
          inactive: "bg-gray-100 text-gray-800", 
          suspended: "bg-yellow-100 text-yellow-800"
        };
        
        return (
          <Badge 
            className={`${statusColors[row.Status]} border-0`}
            variant="secondary"
          >
            {row.Status.charAt(0).toUpperCase() + row.Status.slice(1)}
          </Badge>
        );
      },
    },
    5: {
      title: () => <div className="font-semibold">Created</div>,
      content: (row: SimCardRow) => (
        <div className="text-sm text-gray-600">
          {new Date(row.CreatedAt).toLocaleDateString()}
        </div>
      ),
    },
  };

  const multiSelectOptions: MultiSelectOption<SimCardRow>[] = [
    {
      name: "Activate SIM Cards",
      callback: async (selectedRows) => {
        if (onSimCardAction) {
          onSimCardAction('activate', selectedRows);
        }
      },
      variant: "default",
      iconName: "power_settings_new",
      tooltip: "Activate selected SIM cards"
    },
    {
      name: "Suspend SIM Cards",
      callback: async (selectedRows) => {
        if (onSimCardAction) {
          onSimCardAction('suspend', selectedRows);
        }
      },
      variant: "secondary",
      iconName: "pause_circle",
      tooltip: "Suspend selected SIM cards"
    },
    {
      name: "Deactivate SIM Cards",
      callback: async (selectedRows) => {
        if (onSimCardAction) {
          onSimCardAction('deactivate', selectedRows);
        }
      },
      variant: "destructive",
      iconName: "power_settings_new",
      tooltip: "Deactivate selected SIM cards"
    },
    {
      name: "Delete SIM Cards",
      callback: async (selectedRows) => {
        if (onSimCardAction) {
          onSimCardAction('delete', selectedRows);
        }
      },
      variant: "destructive",
      iconName: "delete",
      tooltip: "Delete selected SIM cards"
    }
  ];

  return (
    <div className="space-y-4">
      <SmartCheckboxAutoTable
        data={simCards}
        displayOptions={displayOptions}
        multiSelectOptions={multiSelectOptions}
        onRefresh={onRefresh}
        title="SIM Cards"
      />
    </div>
  );
}