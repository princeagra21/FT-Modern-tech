import React from "react";
import {
  DisplayMap,
  SmartCheckboxAutoTable,
} from "../common/smartcheckboxautotable";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";

export type VehicleRow = {
  id: string;
  vehicleName: string;
  imei: string;
  vin: string;
  status: "Active" | "Inactive";
  lastUpdate: string; // "YYYY-MM-DD HH:mm"
  PrimaryExpiry: string; // "YYYY-MM-DD"
  SacendoryExpiry: string; // "YYYY-MM-DD"
  VehicleType: "Truck";
  DeviceType: "GT06";
  GMT: "+5:30";
};

export const VEHICLE_DATA: VehicleRow[] = [
  {
    id: "v101",
    vehicleName: "FS-LogiPrime-01",
    imei: "868683040192301",
    vin: "MA3EYD32S5C700001",
    status: "Active",
    lastUpdate: "2025-10-16 09:14",
    PrimaryExpiry: "2026-02-28",
    SacendoryExpiry: "2027-02-28",
    VehicleType: "Truck",
    DeviceType: "GT06",
    GMT: "+5:30",
  },
  {
    id: "v102",
    vehicleName: "CargoMax K2",
    imei: "355488120563742",
    vin: "MBHZZZ8P7GT200112",
    status: "Inactive",
    lastUpdate: "2025-10-16 07:52",
    PrimaryExpiry: "2026-11-30",
    SacendoryExpiry: "2027-11-30",
    VehicleType: "Truck",
    DeviceType: "GT06",
    GMT: "+5:30",
  },
  {
    id: "v103",
    vehicleName: "FS-HaulPro-7A",
    imei: "861234560987651",
    vin: "MALAB51CR9M300223",
    status: "Active",
    lastUpdate: "2025-10-16 18:03",
    PrimaryExpiry: "2027-01-15",
    SacendoryExpiry: "2028-01-15",
    VehicleType: "Truck",
    DeviceType: "GT06",
    GMT: "+5:30",
  },
  {
    id: "v104",
    vehicleName: "RoadRunner 18",
    imei: "864209873561234",
    vin: "MECZZZ8F6JC400347",
    status: "Active",
    lastUpdate: "2025-10-16 12:29",
    PrimaryExpiry: "2026-08-31",
    SacendoryExpiry: "2027-08-31",
    VehicleType: "Truck",
    DeviceType: "GT06",
    GMT: "+5:30",
  },
  {
    id: "v105",
    vehicleName: "Atlas T-900",
    imei: "862045317896420",
    vin: "MAT448123C5200456",
    status: "Inactive",
    lastUpdate: "2025-10-16 06:41",
    PrimaryExpiry: "2026-04-30",
    SacendoryExpiry: "2027-04-30",
    VehicleType: "Truck",
    DeviceType: "GT06",
    GMT: "+5:30",
  },
  {
    id: "v106",
    vehicleName: "FS-Carrier-X5",
    imei: "356789041235678",
    vin: "MMAJRKA10GF700589",
    status: "Active",
    lastUpdate: "2025-10-16 20:11",
    PrimaryExpiry: "2027-06-30",
    SacendoryExpiry: "2028-06-30",
    VehicleType: "Truck",
    DeviceType: "GT06",
    GMT: "+5:30",
  },
  {
    id: "v107",
    vehicleName: "TransGo 44",
    imei: "867450219998321",
    vin: "MZBZZZ7K2LH800612",
    status: "Inactive",
    lastUpdate: "2025-10-16 08:58",
    PrimaryExpiry: "2026-12-31",
    SacendoryExpiry: "2027-12-31",
    VehicleType: "Truck",
    DeviceType: "GT06",
    GMT: "+5:30",
  },
  {
    id: "v108",
    vehicleName: "SteelLine R3",
    imei: "354893210067451",
    vin: "MA1TA2AB0ND900734",
    status: "Active",
    lastUpdate: "2025-10-16 16:47",
    PrimaryExpiry: "2027-03-31",
    SacendoryExpiry: "2028-03-31",
    VehicleType: "Truck",
    DeviceType: "GT06",
    GMT: "+5:30",
  },
  {
    id: "v109",
    vehicleName: "FS-BharatHaul 12",
    imei: "869502341224679",
    vin: "MATSJ2AG2PC100845",
    status: "Active",
    lastUpdate: "2025-10-16 11:36",
    PrimaryExpiry: "2026-09-30",
    SacendoryExpiry: "2027-09-30",
    VehicleType: "Truck",
    DeviceType: "GT06",
    GMT: "+5:30",
  },
  {
    id: "v110",
    vehicleName: "LongRun Z1",
    imei: "861778905442310",
    vin: "MALCEMFBN2E001019",
    status: "Inactive",
    lastUpdate: "2025-10-16 05:22",
    PrimaryExpiry: "2027-10-31",
    SacendoryExpiry: "2028-10-31",
    VehicleType: "Truck",
    DeviceType: "GT06",
    GMT: "+5:30",
  },
  {
    id: "v111",
    vehicleName: "TrailKing 26",
    imei: "867901234565432",
    vin: "MAT626123D5301121",
    status: "Active",
    lastUpdate: "2025-10-16 21:02",
    PrimaryExpiry: "2026-05-31",
    SacendoryExpiry: "2027-05-31",
    VehicleType: "Truck",
    DeviceType: "GT06",
    GMT: "+5:30",
  },
  {
    id: "v112",
    vehicleName: "FS-Express-AX",
    imei: "352098761245678",
    vin: "MA3EYD32S5C700932",
    status: "Active",
    lastUpdate: "2025-10-16 10:13",
    PrimaryExpiry: "2027-02-15",
    SacendoryExpiry: "2028-02-15",
    VehicleType: "Truck",
    DeviceType: "GT06",
    GMT: "+5:30",
  },
  {
    id: "v113",
    vehicleName: "CargoJet V8",
    imei: "865431200987654",
    vin: "MBHZZZ8P7GT201245",
    status: "Inactive",
    lastUpdate: "2025-10-16 13:40",
    PrimaryExpiry: "2026-03-31",
    SacendoryExpiry: "2027-03-31",
    VehicleType: "Truck",
    DeviceType: "GT06",
    GMT: "+5:30",
  },
  {
    id: "v114",
    vehicleName: "FleetRider 5M",
    imei: "355002349912340",
    vin: "MALAB51CR9M302476",
    status: "Active",
    lastUpdate: "2025-10-16 17:25",
    PrimaryExpiry: "2027-09-15",
    SacendoryExpiry: "2028-09-15",
    VehicleType: "Truck",
    DeviceType: "GT06",
    GMT: "+5:30",
  },
  {
    id: "v115",
    vehicleName: "HaulStar 610",
    imei: "862900111567893",
    vin: "MECZZZ8F6JC401589",
    status: "Inactive",
    lastUpdate: "2025-10-16 04:18",
    PrimaryExpiry: "2026-07-31",
    SacendoryExpiry: "2027-07-31",
    VehicleType: "Truck",
    DeviceType: "GT06",
    GMT: "+5:30",
  },
  {
    id: "v116",
    vehicleName: "FS-RapidMove 3",
    imei: "861122334455667",
    vin: "MAT448123C5201997",
    status: "Active",
    lastUpdate: "2025-10-16 19:51",
    PrimaryExpiry: "2026-10-31",
    SacendoryExpiry: "2027-10-31",
    VehicleType: "Truck",
    DeviceType: "GT06",
    GMT: "+5:30",
  },
  {
    id: "v117",
    vehicleName: "TurboTrail Q5",
    imei: "868600777123456",
    vin: "MMAJRKA10GF700962",
    status: "Inactive",
    lastUpdate: "2025-10-16 06:06",
    PrimaryExpiry: "2027-08-31",
    SacendoryExpiry: "2028-08-31",
    VehicleType: "Truck",
    DeviceType: "GT06",
    GMT: "+5:30",
  },
  {
    id: "v118",
    vehicleName: "FS-HeavyLift 2D",
    imei: "356780009900112",
    vin: "MZBZZZ7K2LH801273",
    status: "Active",
    lastUpdate: "2025-10-16 15:37",
    PrimaryExpiry: "2026-06-30",
    SacendoryExpiry: "2027-06-30",
    VehicleType: "Truck",
    DeviceType: "GT06",
    GMT: "+5:30",
  },
  {
    id: "v119",
    vehicleName: "HighWayPro 77",
    imei: "865500220031457",
    vin: "MA1TA2AB0ND901534",
    status: "Active",
    lastUpdate: "2025-10-16 14:03",
    PrimaryExpiry: "2027-11-30",
    SacendoryExpiry: "2028-11-30",
    VehicleType: "Truck",
    DeviceType: "GT06",
    GMT: "+5:30",
  },
  {
    id: "v120",
    vehicleName: "FS-DeltaMover X",
    imei: "355800664422110",
    vin: "MATSJ2AG2PC101845",
    status: "Inactive",
    lastUpdate: "2025-10-16 05:59",
    PrimaryExpiry: "2026-09-15",
    SacendoryExpiry: "2027-09-15",
    VehicleType: "Truck",
    DeviceType: "GT06",
    GMT: "+5:30",
  },
];

function AdminVehiclesList() {
  // Helper function to calculate expiry details
  const calculateExpiry = (expiryStr: string) => {
    const expiryDate = new Date(expiryStr);
    const today = new Date();
    const daysUntilExpiry = Math.floor(
      (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
    const isExpired = daysUntilExpiry < 0;
    return { daysUntilExpiry, isExpiringSoon, isExpired };
  };

  // Minimal tooltip component for complete vehicle information
  const VehicleTooltip = (row: VehicleRow) => {
    const primary = calculateExpiry(row.PrimaryExpiry);
    const secondary = calculateExpiry(row.SacendoryExpiry);
    const [date, time] = row.lastUpdate.split(" ");

    return (
      <div className="p-3 max-w-xs">
        {/* Header Section */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bw-gradient-primary rounded-lg flex items-center justify-center bw-text-primary-fg typo-h6">
            {row.vehicleName
              .split(" ")
              .slice(0, 2)
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </div>
          <div>
            <div className="font-semibold bw-text-primary dark:text-neutral-100">
              {row.vehicleName}
            </div>
            <div className="typo-subtitle dark:text-neutral-400">
              {row.VehicleType} • {row.status}
            </div>
          </div>
        </div>

        {/* Device Information */}
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 bw-text-muted dark:text-neutral-400 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <span className="bw-text-primary dark:text-neutral-200 font-mono">
              {row.imei}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 bw-text-muted dark:text-neutral-400 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <span className="bw-text-primary dark:text-neutral-200 font-mono">
              {row.vin}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 bw-text-muted dark:text-neutral-400 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
              />
            </svg>
            <span className="bw-text-primary dark:text-neutral-200">
              {row.DeviceType}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 bw-text-muted dark:text-neutral-400 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="bw-text-primary dark:text-neutral-200">
              {row.GMT}
            </span>
          </div>
        </div>

        {/* License Information */}
        <div className="mt-2 pt-2 border-t bw-border dark:border-neutral-700">
          <div className="flex justify-between text-xs">
            <span className="bw-text-muted dark:text-neutral-400">
              Primary License:
            </span>
            <span className="font-medium bw-text-primary dark:text-neutral-200">
              {row.PrimaryExpiry}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="bw-text-muted dark:text-neutral-400">
              Secondary License:
            </span>
            <span className="font-medium bw-text-primary dark:text-neutral-200">
              {row.SacendoryExpiry}
            </span>
          </div>
        </div>

        {/* Last Activity */}
        <div className="mt-2 pt-2 border-t bw-border dark:border-neutral-700">
          <div className="flex items-center gap-1 typo-subtitle dark:text-neutral-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              Last: {date} at {time}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // -------- table columns (CONDENSED & ORGANIZED) --------
  const displayOptions: DisplayMap<VehicleRow> = {
    // Column 1: Vehicle Info (Name + Type + Status) - WITH PREMIUM TOOLTIP
    0: {
      title: () => (
        <div className="font-bold tracking-wide uppercase typo-subtitle dark:text-neutral-400">
          Vehicle Information
        </div>
      ),
      content: (row) => (
        <div className="flex items-center gap-3 min-w-[240px]">
          {/* Icon Badge */}
          <div className="flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center bw-bg-secondary bw-text-secondary-fg dark:bg-neutral-700 dark:text-neutral-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
              />
            </svg>
          </div>

          {/* Vehicle Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <div className="font-semibold bw-text-primary dark:text-neutral-100 truncate">
                {row.vehicleName}
              </div>
              <div className="h-2 w-2 rounded-full flex-shrink-0 bw-bg-muted dark:bg-neutral-600" />
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="bw-text-muted dark:text-neutral-400">
                {row.VehicleType}
              </span>
              <span className="bw-text-muted dark:text-neutral-500">•</span>
              <span className="font-medium bw-text-primary dark:text-neutral-300">
                {row.status}
              </span>
            </div>
          </div>
        </div>
      ),
      tooltip: VehicleTooltip,
    },

    // Column 2: Device Details (IMEI + VIN + Device Type)
    1: {
      title: () => (
        <div className="font-bold tracking-wide uppercase typo-subtitle dark:text-neutral-400">
          Device Details
        </div>
      ),
      content: (row) => (
        <div className="space-y-1.5 min-w-[200px]">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 bw-text-muted dark:text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <span className="font-mono text-xs bw-text-primary dark:text-neutral-200">
              {row.imei}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 bw-text-muted dark:text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <span className="font-mono typo-subtitle dark:text-neutral-400">
              {row.vin}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-2 py-0.5 rounded-md bw-bg-secondary bw-text-primary dark:bg-neutral-700 dark:text-neutral-300 typo-h6">
              {row.DeviceType}
            </div>
          </div>
        </div>
      ),
    },

    // Column 3: Activity (Last Update + Timezone)
    2: {
      title: () => (
        <div className="font-bold tracking-wide uppercase typo-subtitle dark:text-neutral-400">
          Activity
        </div>
      ),
      content: (row) => {
        const [date, time] = row.lastUpdate.split(" ");
        return (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 bw-text-muted dark:text-neutral-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-sm bw-text-primary dark:text-neutral-200">
                {date}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="typo-subtitle dark:text-neutral-400">
                {time}
              </span>
              <span className="bw-text-muted dark:text-neutral-500">•</span>
              <span className="font-mono typo-subtitle dark:text-neutral-400">
                {row.GMT}
              </span>
            </div>
          </div>
        );
      },
    },

    // Column 4: License Status (Both Expiries Combined)
    3: {
      title: () => (
        <div className="font-bold tracking-wide uppercase typo-subtitle dark:text-neutral-400">
          License Status
        </div>
      ),
      content: (row) => {
        const primary = calculateExpiry(row.PrimaryExpiry);
        const secondary = calculateExpiry(row.SacendoryExpiry);

        const getStatusIcon = (status: {
          isExpired: boolean;
          isExpiringSoon: boolean;
          daysUntilExpiry: number;
        }) => {
          if (status.isExpired) return "✕";
          if (status.isExpiringSoon) return "!";
          return "✓";
        };

        return (
          <div className="space-y-2 min-w-[180px]">
            {/* Primary License */}
            <div className="px-3 py-2 rounded-lg border bw-border dark:border-neutral-700 bw-bg-secondary dark:bg-neutral-800">
              <div className="flex items-center justify-between mb-1">
                <span className="typo-h6 bw-text-muted dark:text-neutral-400">
                  Primary
                </span>
                <span className="text-sm bw-text-primary dark:text-neutral-300">
                  {getStatusIcon(primary)}
                </span>
              </div>
              <div className="typo-h6 bw-text-primary dark:text-neutral-200">
                {row.PrimaryExpiry}
              </div>
              {(primary.isExpired || primary.isExpiringSoon) && (
                <div className="typo-h6 mt-1 bw-text-muted dark:text-neutral-400">
                  {primary.isExpired
                    ? "Expired"
                    : `${primary.daysUntilExpiry}d left`}
                </div>
              )}
            </div>

            {/* Secondary License */}
            <div className="px-3 py-2 rounded-lg border bw-border dark:border-neutral-700 bw-bg-secondary dark:bg-neutral-800">
              <div className="flex items-center justify-between mb-1">
                <span className="typo-h6 bw-text-muted dark:text-neutral-400">
                  Secondary
                </span>
                <span className="text-sm bw-text-primary dark:text-neutral-300">
                  {getStatusIcon(secondary)}
                </span>
              </div>
              <div className="typo-h6 bw-text-primary dark:text-neutral-200">
                {row.SacendoryExpiry}
              </div>
              {(secondary.isExpired || secondary.isExpiringSoon) && (
                <div className="typo-h6 mt-1 bw-text-muted dark:text-neutral-400">
                  {secondary.isExpired
                    ? "Expired"
                    : `${secondary.daysUntilExpiry}d left`}
                </div>
              )}
            </div>
          </div>
        );
      },
    },
  };

  // -------- filters (streamlined) --------
  const filterConfig = {
    status: {
      kind: "select" as const,
      label: "⚡ Status",
      field: "status",
      options: [
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
      ],
    },

    deviceType: {
      kind: "select" as const,
      label: "📡 Device Type",
      field: "DeviceType",
      derive: true,
    },
    lastUpdate: {
      kind: "dateRange" as const,
      label: "🕐 Last Activity",
      field: "lastUpdate",
    },
    primaryExpiry: {
      kind: "dateRange" as const,
      label: "🎫 Primary License",
      field: "PrimaryExpiry",
    },
    secondaryExpiry: {
      kind: "dateRange" as const,
      label: "🎫 Secondary License",
      field: "SacendoryExpiry",
    },
  };

  // -------- bulk actions --------
  const bulkActions = [
    {
      name: "Activate",
      iconName: "toggle_on",
      variant: "default" as const,
      tooltip: "Activate selected vehicles",
      callback: async (
        selectedRows: VehicleRow[],
        selectedIds: Set<string>
      ) => {
        console.log("Activating vehicles:", selectedIds);
        // Add your activation logic here
        alert(`Activating ${selectedRows.length} vehicle(s)`);
      },
    },
    {
      name: "Deactivate",
      iconName: "toggle_off",
      variant: "outline" as const,
      tooltip: "Deactivate selected vehicles",
      callback: async (
        selectedRows: VehicleRow[],
        selectedIds: Set<string>
      ) => {
        console.log("Deactivating vehicles:", selectedIds);
        // Add your deactivation logic here
        alert(`Deactivating ${selectedRows.length} vehicle(s)`);
      },
    },
    {
      name: "Export Selected",
      iconName: "download",
      variant: "outline" as const,
      tooltip: "Export selected vehicles data",
      callback: async (selectedRows: VehicleRow[]) => {
        console.log("Exporting vehicles:", selectedRows);
        // Add your export logic here
        alert(`Exporting ${selectedRows.length} vehicle(s)`);
      },
    },
    {
      name: "Delete",
      iconName: "delete",
      variant: "destructive" as const,
      tooltip: "Delete selected vehicles",
      callback: async (
        selectedRows: VehicleRow[],
        selectedIds: Set<string>
      ) => {
        if (
          confirm(
            `Are you sure you want to delete ${selectedRows.length} vehicle(s)?`
          )
        ) {
          console.log("Deleting vehicles:", selectedIds);
          // Add your delete logic here
          alert(`Deleted ${selectedRows.length} vehicle(s)`);
        }
      },
    },
  ];

  // -------- refresh handler --------
  const handleRefresh = async () => {
    console.log("Refreshing vehicle data...");
    // Add your refresh logic here
    // Example: await fetchVehicles();
    return Promise.resolve();
  };

  return (
    <>
      <div className="w-full max-w-full overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-30 border-b border-border bg-card/70 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 md:px-6 py-3 flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted">
                Vehicles
              </div>
              <h1 className="typo-h1">
                Vehicles List
              </h1>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-8">
          {/* KPI Cards */}
          <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Vehicles */}
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border ">
                  <DirectionsCarIcon />
                </div>
                <div className="text-sm font-medium text-foreground">
                  Total Vehicles
                </div>
              </div>
              <div className="mb-1 typo-h1 font-semibold text-foreground">
                1,200
              </div>
              <div className="typo-subtitle">currently tracked</div>
            </div>

            {/* Moving */}
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border">
                  <SignalCellularAltIcon />
                </div>
                <div className="text-sm font-medium text-foreground">
                  Moving
                </div>
              </div>
              <div className="mb-1 typo-h1 font-semibold text-foreground">
                432
              </div>
              <div className="mt-2 inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-xs text-white">
                ▲ 3.8%
              </div>
            </div>

            {/* Idle */}
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border ">
                  <SignalCellularAltIcon />
                </div>
                <div className="text-sm font-medium text-foreground">Idle</div>
              </div>
              <div className="mb-1 typo-h1 font-semibold text-foreground">
                215
              </div>
              <div className="mt-2 inline-flex items-center rounded-full bg-foreground/5 px-2 py-0.5 typo-p12n">
                ▼ 1.2%
              </div>
            </div>

            {/* Stopped */}
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border ">
                  <SignalCellularAltIcon  />
                </div>
                <div className="text-sm font-medium text-foreground">
                  Stopped
                </div>
              </div>
              <div className="mb-1 typo-h1 font-semibold text-foreground">
                190
              </div>
              <div className="mt-2 inline-flex items-center rounded-full bg-foreground/5 px-2 py-0.5 typo-p12n">
                ▼ 0.6%
              </div>
            </div>
          </div>
        </div>

        <SmartCheckboxAutoTable<VehicleRow>
          title="Vehicle Management"
          data={VEHICLE_DATA}
          getRowId={(r) => r.id}
          displayOptions={displayOptions}
          filterConfig={filterConfig}
          multiSelectOptions={bulkActions}
          onRowClick={(row) => {
            console.log("Row Clicked →", row.id);
            // setSelectedVehicleId(row.id);
            // setDrawerOpen(true);
          }}
          onRefresh={handleRefresh}
          exportBrand={{
            name: "Fleet Stack",
            logoUrl: "/images/logo-light.png",
            addressLine1: "Self-Hosted GPS Software",
            addressLine2: "fleetstackglobal.com",
            footerNote: "We make it easiest — just deploy.",
          }}
        />
      </div>
    </>
  );
}

export default AdminVehiclesList;

function KpiCard({
  icon,
  title,
  value,
  delta,
  hint,
}: {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  delta?: number;
  hint?: string;
}) {
  const isUp = typeof delta === "number" && delta >= 0;
  const hasDelta = typeof delta === "number";
  return (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-700">
          {icon}
        </div>
        <div className="text-sm font-medium text-neutral-900 dark:text-neutral-200">
          {title}
        </div>
      </div>
      <div className="mb-1 typo-h1 font-semibold text-neutral-900 dark:text-neutral-100">
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>
      {hint && (
        <div className="typo-subtitle">
          {hint}
        </div>
      )}
      {hasDelta && (
        <div
          className={classNames(
            "mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs",
            isUp
              ? "bg-neutral-900 dark:bg-white text-white dark:text-black"
              : "bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-300"
          )}
        >
          {isUp ? "▲" : "▼"} {Math.abs(delta!).toFixed(1)}%
        </div>
      )}
    </div>
  );
}

function classNames(...cx: Array<string | false | undefined>) {
  return cx.filter(Boolean).join(" ");
}
