'use client';

import { DisplayMap, SmartCheckboxAutoTable, FilterConfigMap, MultiSelectOption } from '@/components/common/smartcheckboxautotable';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import React from 'react';
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import SpeedIcon from "@mui/icons-material/Speed";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VerifiedIcon from "@mui/icons-material/Verified";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { useRouter } from "next/navigation";





// Core unions
export type VehicleStatus = "running" | "stop" | "idle";

// Reusable nested refs
export interface PersonRef {
  name: string;
  email: string;
  mobilePrefix: string;  // e.g., "+91"
  mobile: string;        // digits only
  isEmailVerified: boolean;
  profileUrl: string;    // URL or path
  username: string;
}

export interface NamedType {
  name: string;          // e.g., "Truck", "Car" | "GT06", "FBM920"
}

/**
 * VehicleRow — normalized to camelCase keys.
 * For all date/time fields, use ISO-8601 strings, e.g. "2025-10-17T08:15:00+05:30".
 * Units:
 *  - speed: km/h (number)
 *  - engineHour: hours (number)
 *  - odometer: kilometers (number)
 *  - gmt: IANA offset string like "+05:30"
 */
export interface VehicleRow {
  id: string;
  vehicleNo: string;
  imei: string;
  vin: string;

  status: VehicleStatus;
  speed: number;

  vehicleType: NamedType;  // { name: "Truck" | "Car" | ... }
  deviceType: NamedType;   // { name: "GT06" | "FBM920" | ... }

  lastUpdate: string;      // ISO datetime
  primaryUser: PersonRef;
  addedBy: PersonRef;

  primaryExpiry: string;   // ISO date or datetime
  secondaryExpiry: string; // ISO date or datetime
  createdAt: string;       // ISO datetime

  ignition: boolean;
  engineHour: number;
  odometer: number;

  gmt: string;             // e.g., "+05:30"
  parking: boolean;
  isActive: boolean;
}




export const VEHICLE_DATA: VehicleRow[] = [
  {
    id: "v-0001",
    vehicleNo: "DL01 AB 1287",
    imei: "358920108765431",
    vin: "MA1TA2C43J5K78901",
    status: "running",
    speed: 62,
    vehicleType: { name: "Truck" },
    deviceType: { name: "GT06" },
    lastUpdate: "2025-10-17T08:02:15+05:30",
    primaryUser: {
      name: "Akash Kumar",
      email: "akash.kumar@example.com",
      mobilePrefix: "+91",
      mobile: "9810012345",
      isEmailVerified: true,
      profileUrl: "/uploads/users/akash.png",
      username: "akash.k"
    },
    addedBy: {
      name: "Vinod Singh",
      email: "vinod.singh@example.com",
      mobilePrefix: "+91",
      mobile: "9899011122",
      isEmailVerified: true,
      profileUrl: "/uploads/users/vinod.png",
      username: "vinod.s"
    },
    primaryExpiry: "2026-08-31",
    secondaryExpiry: "2026-12-31",
    createdAt: "2024-11-03T10:22:40+05:30",
    ignition: true,
    engineHour: 1820.5,
    odometer: 148520.7,
    gmt: "+05:30",
    parking: false,
    isActive: true
  },
  {
    id: "v-0002",
    vehicleNo: "MH12 CD 9042",
    imei: "352094560123789",
    vin: "MH4KS2B47L9F34567",
    status: "stop",
    speed: 0,
    vehicleType: { name: "Car" },
    deviceType: { name: "FBM920" },
    lastUpdate: "2025-10-17T07:55:02+05:30",
    primaryUser: {
      name: "Riya Sharma",
      email: "riya.sharma@example.com",
      mobilePrefix: "+91",
      mobile: "9820098765",
      isEmailVerified: true,
      profileUrl: "/uploads/users/riya.png",
      username: "riya.s"
    },
    addedBy: {
      name: "Vinod Singh",
      email: "vinod.singh@example.com",
      mobilePrefix: "+91",
      mobile: "9899011122",
      isEmailVerified: true,
      profileUrl: "/uploads/users/vinod.png",
      username: "vinod.s"
    },
    primaryExpiry: "2026-07-15",
    secondaryExpiry: "2026-10-15",
    createdAt: "2025-01-12T14:05:10+05:30",
    ignition: false,
    engineHour: 760.2,
    odometer: 38540.1,
    gmt: "+05:30",
    parking: true,
    isActive: true
  },
  {
    id: "v-0003",
    vehicleNo: "GJ05 EF 4421",
    imei: "863451029874561",
    vin: "MA3EXXMR200123456",
    status: "idle",
    speed: 3,
    vehicleType: { name: "Pickup" },
    deviceType: { name: "GT06" },
    lastUpdate: "2025-10-17T08:06:29+05:30",
    primaryUser: {
      name: "Mohit Verma",
      email: "mohit.verma@example.com",
      mobilePrefix: "+91",
      mobile: "9876543201",
      isEmailVerified: false,
      profileUrl: "/uploads/users/mohit.png",
      username: "mohit.v"
    },
    addedBy: {
      name: "Seema Gupta",
      email: "seema.gupta@example.com",
      mobilePrefix: "+91",
      mobile: "9818899001",
      isEmailVerified: true,
      profileUrl: "/uploads/users/seema.png",
      username: "seema.g"
    },
    primaryExpiry: "2026-05-30",
    secondaryExpiry: "2026-09-30",
    createdAt: "2024-09-20T09:40:33+05:30",
    ignition: true,
    engineHour: 1120.8,
    odometer: 90512.9,
    gmt: "+05:30",
    parking: false,
    isActive: true
  },
  {
    id: "v-0004",
    vehicleNo: "KA03 GH 7788",
    imei: "354789120345678",
    vin: "MBJZZZ6RZLU012345",
    status: "running",
    speed: 48,
    vehicleType: { name: "Bus" },
    deviceType: { name: "FBM920" },
    lastUpdate: "2025-10-17T07:59:45+05:30",
    primaryUser: {
      name: "Ananya Iyer",
      email: "ananya.iyer@example.com",
      mobilePrefix: "+91",
      mobile: "9845099900",
      isEmailVerified: true,
      profileUrl: "/uploads/users/ananya.png",
      username: "ananya.i"
    },
    addedBy: {
      name: "Vinod Singh",
      email: "vinod.singh@example.com",
      mobilePrefix: "+91",
      mobile: "9899011122",
      isEmailVerified: true,
      profileUrl: "/uploads/users/vinod.png",
      username: "vinod.s"
    },
    primaryExpiry: "2027-01-10",
    secondaryExpiry: "2027-04-10",
    createdAt: "2025-03-07T16:10:12+05:30",
    ignition: true,
    engineHour: 2215.3,
    odometer: 189210.4,
    gmt: "+05:30",
    parking: false,
    isActive: true
  },
  {
    id: "v-0005",
    vehicleNo: "UP14 JK 5501",
    imei: "861234598765432",
    vin: "MALAN51CLHM123456",
    status: "stop",
    speed: 0,
    vehicleType: { name: "Truck" },
    deviceType: { name: "GT06" },
    lastUpdate: "2025-10-17T08:09:18+05:30",
    primaryUser: {
      name: "Pooja Mishra",
      email: "pooja.mishra@example.com",
      mobilePrefix: "+91",
      mobile: "9935012345",
      isEmailVerified: true,
      profileUrl: "/uploads/users/pooja.png",
      username: "pooja.m"
    },
    addedBy: {
      name: "Seema Gupta",
      email: "seema.gupta@example.com",
      mobilePrefix: "+91",
      mobile: "9818899001",
      isEmailVerified: true,
      profileUrl: "/uploads/users/seema.png",
      username: "seema.g"
    },
    primaryExpiry: "2026-11-01",
    secondaryExpiry: "2027-02-01",
    createdAt: "2024-12-22T11:55:00+05:30",
    ignition: false,
    engineHour: 540.0,
    odometer: 42110.3,
    gmt: "+05:30",
    parking: true,
    isActive: false
  },
  {
    id: "v-0006",
    vehicleNo: "RJ14 LM 2299",
    imei: "357894561203478",
    vin: "MA6FP8AM1JT234567",
    status: "idle",
    speed: 2,
    vehicleType: { name: "SUV" },
    deviceType: { name: "FBM920" },
    lastUpdate: "2025-10-17T08:11:51+05:30",
    primaryUser: {
      name: "Sandeep Jain",
      email: "sandeep.jain@example.com",
      mobilePrefix: "+91",
      mobile: "9929012345",
      isEmailVerified: true,
      profileUrl: "/uploads/users/sandeep.png",
      username: "sandeep.j"
    },
    addedBy: {
      name: "Aarti Mehta",
      email: "aarti.mehta@example.com",
      mobilePrefix: "+91",
      mobile: "9811102233",
      isEmailVerified: true,
      profileUrl: "/uploads/users/aarti.png",
      username: "aarti.m"
    },
    primaryExpiry: "2026-06-20",
    secondaryExpiry: "2026-09-20",
    createdAt: "2025-02-01T08:10:45+05:30",
    ignition: true,
    engineHour: 895.7,
    odometer: 61500.0,
    gmt: "+05:30",
    parking: false,
    isActive: true
  },
  {
    id: "v-0007",
    vehicleNo: "TN09 NP 6611",
    imei: "861205479012346",
    vin: "MCAUA8EV0NA123456",
    status: "running",
    speed: 71,
    vehicleType: { name: "Van" },
    deviceType: { name: "GT06" },
    lastUpdate: "2025-10-17T07:50:40+05:30",
    primaryUser: {
      name: "Harish K",
      email: "harish.k@example.com",
      mobilePrefix: "+91",
      mobile: "9952098765",
      isEmailVerified: false,
      profileUrl: "/uploads/users/harish.png",
      username: "harish.k"
    },
    addedBy: {
      name: "Seema Gupta",
      email: "seema.gupta@example.com",
      mobilePrefix: "+91",
      mobile: "9818899001",
      isEmailVerified: true,
      profileUrl: "/uploads/users/seema.png",
      username: "seema.g"
    },
    primaryExpiry: "2027-03-05",
    secondaryExpiry: "2027-06-05",
    createdAt: "2025-04-11T12:00:00+05:30",
    ignition: true,
    engineHour: 310.4,
    odometer: 22400.9,
    gmt: "+05:30",
    parking: false,
    isActive: true
  },
  {
    id: "v-0008",
    vehicleNo: "WB20 QR 3310",
    imei: "352099887654321",
    vin: "MC2HN4820KT789012",
    status: "stop",
    speed: 0,
    vehicleType: { name: "Car" },
    deviceType: { name: "FBM920" },
    lastUpdate: "2025-10-17T08:04:05+05:30",
    primaryUser: {
      name: "Aditi Sen",
      email: "aditi.sen@example.com",
      mobilePrefix: "+91",
      mobile: "9804091122",
      isEmailVerified: true,
      profileUrl: "/uploads/users/aditi.png",
      username: "aditi.s"
    },
    addedBy: {
      name: "Vinod Singh",
      email: "vinod.singh@example.com",
      mobilePrefix: "+91",
      mobile: "9899011122",
      isEmailVerified: true,
      profileUrl: "/uploads/users/vinod.png",
      username: "vinod.s"
    },
    primaryExpiry: "2026-12-20",
    secondaryExpiry: "2027-03-20",
    createdAt: "2024-10-05T18:45:59+05:30",
    ignition: false,
    engineHour: 435.2,
    odometer: 33010.5,
    gmt: "+05:30",
    parking: true,
    isActive: true
  },
  {
    id: "v-0009",
    vehicleNo: "CH01 ST 9090",
    imei: "354120987650123",
    vin: "MEXXX12345K789012",
    status: "idle",
    speed: 1,
    vehicleType: { name: "Truck" },
    deviceType: { name: "GT06" },
    lastUpdate: "2025-10-17T08:10:33+05:30",
    primaryUser: {
      name: "Karan Batra",
      email: "karan.batra@example.com",
      mobilePrefix: "+91",
      mobile: "9817012345",
      isEmailVerified: true,
      profileUrl: "/uploads/users/karan.png",
      username: "karan.b"
    },
    addedBy: {
      name: "Aarti Mehta",
      email: "aarti.mehta@example.com",
      mobilePrefix: "+91",
      mobile: "9811102233",
      isEmailVerified: true,
      profileUrl: "/uploads/users/aarti.png",
      username: "aarti.m"
    },
    primaryExpiry: "2026-04-12",
    secondaryExpiry: "2026-08-12",
    createdAt: "2025-05-14T09:14:22+05:30",
    ignition: true,
    engineHour: 1502.1,
    odometer: 120450.4,
    gmt: "+05:30",
    parking: false,
    isActive: true
  },
  {
    id: "v-0010",
    vehicleNo: "JK10 UV 1203",
    imei: "861309875421076",
    vin: "MK4ZZZ8KZFY123456",
    status: "running",
    speed: 55,
    vehicleType: { name: "SUV" },
    deviceType: { name: "FBM920" },
    lastUpdate: "2025-10-17T08:12:10+05:30",
    primaryUser: {
      name: "Zara Khan",
      email: "zara.khan@example.com",
      mobilePrefix: "+91",
      mobile: "9797012345",
      isEmailVerified: false,
      profileUrl: "/uploads/users/zara.png",
      username: "zara.k"
    },
    addedBy: {
      name: "Seema Gupta",
      email: "seema.gupta@example.com",
      mobilePrefix: "+91",
      mobile: "9818899001",
      isEmailVerified: true,
      profileUrl: "/uploads/users/seema.png",
      username: "seema.g"
    },
    primaryExpiry: "2027-02-28",
    secondaryExpiry: "2027-05-31",
    createdAt: "2025-06-01T13:30:00+05:30",
    ignition: true,
    engineHour: 245.9,
    odometer: 18410.8,
    gmt: "+05:30",
    parking: false,
    isActive: true
  },
  {
    id: "v-0011",
    vehicleNo: "PB08 WX 7780",
    imei: "352198760054321",
    vin: "MA1YN2AB0LC123456",
    status: "stop",
    speed: 0,
    vehicleType: { name: "Tractor" },
    deviceType: { name: "GT06" },
    lastUpdate: "2025-10-17T07:42:55+05:30",
    primaryUser: {
      name: "Gurpreet Singh",
      email: "gurpreet.singh@example.com",
      mobilePrefix: "+91",
      mobile: "9876001122",
      isEmailVerified: true,
      profileUrl: "/uploads/users/gurpreet.png",
      username: "gurpreet.s"
    },
    addedBy: {
      name: "Vinod Singh",
      email: "vinod.singh@example.com",
      mobilePrefix: "+91",
      mobile: "9899011122",
      isEmailVerified: true,
      profileUrl: "/uploads/users/vinod.png",
      username: "vinod.s"
    },
    primaryExpiry: "2026-03-19",
    secondaryExpiry: "2026-06-19",
    createdAt: "2024-08-19T10:05:05+05:30",
    ignition: false,
    engineHour: 129.3,
    odometer: 9120.4,
    gmt: "+05:30",
    parking: true,
    isActive: true
  },
  {
    id: "v-0012",
    vehicleNo: "HR26 YZ 1122",
    imei: "863459012345678",
    vin: "MCAUA8EVMRA456789",
    status: "idle",
    speed: 4,
    vehicleType: { name: "Car" },
    deviceType: { name: "FBM920" },
    lastUpdate: "2025-10-17T08:08:08+05:30",
    primaryUser: {
      name: "Neha Arora",
      email: "neha.arora@example.com",
      mobilePrefix: "+91",
      mobile: "9810003344",
      isEmailVerified: true,
      profileUrl: "/uploads/users/neha.png",
      username: "neha.a"
    },
    addedBy: {
      name: "Aarti Mehta",
      email: "aarti.mehta@example.com",
      mobilePrefix: "+91",
      mobile: "9811102233",
      isEmailVerified: true,
      profileUrl: "/uploads/users/aarti.png",
      username: "aarti.m"
    },
    primaryExpiry: "2026-10-01",
    secondaryExpiry: "2027-01-01",
    createdAt: "2025-06-25T17:22:11+05:30",
    ignition: true,
    engineHour: 560.0,
    odometer: 41220.0,
    gmt: "+05:30",
    parking: false,
    isActive: true
  },
  {
    id: "v-0013",
    vehicleNo: "BR01 AA 3344",
    imei: "352045678901234",
    vin: "MALAC51RLJM765432",
    status: "running",
    speed: 64,
    vehicleType: { name: "Truck" },
    deviceType: { name: "GT06" },
    lastUpdate: "2025-10-17T07:57:37+05:30",
    primaryUser: {
      name: "Rahul Raj",
      email: "rahul.raj@example.com",
      mobilePrefix: "+91",
      mobile: "9304012345",
      isEmailVerified: false,
      profileUrl: "/uploads/users/rahul.png",
      username: "rahul.r"
    },
    addedBy: {
      name: "Seema Gupta",
      email: "seema.gupta@example.com",
      mobilePrefix: "+91",
      mobile: "9818899001",
      isEmailVerified: true,
      profileUrl: "/uploads/users/seema.png",
      username: "seema.g"
    },
    primaryExpiry: "2027-04-14",
    secondaryExpiry: "2027-07-14",
    createdAt: "2025-07-10T08:18:45+05:30",
    ignition: true,
    engineHour: 980.6,
    odometer: 74550.2,
    gmt: "+05:30",
    parking: false,
    isActive: true
  },
  {
    id: "v-0014",
    vehicleNo: "CG04 BB 5566",
    imei: "861234507894561",
    vin: "MA1PB2AB5KT345678",
    status: "stop",
    speed: 0,
    vehicleType: { name: "Bus" },
    deviceType: { name: "FBM920" },
    lastUpdate: "2025-10-17T07:44:12+05:30",
    primaryUser: {
      name: "Tanvi Rao",
      email: "tanvi.rao@example.com",
      mobilePrefix: "+91",
      mobile: "9822102233",
      isEmailVerified: true,
      profileUrl: "/uploads/users/tanvi.png",
      username: "tanvi.r"
    },
    addedBy: {
      name: "Vinod Singh",
      email: "vinod.singh@example.com",
      mobilePrefix: "+91",
      mobile: "9899011122",
      isEmailVerified: true,
      profileUrl: "/uploads/users/vinod.png",
      username: "vinod.s"
    },
    primaryExpiry: "2026-09-09",
    secondaryExpiry: "2026-12-09",
    createdAt: "2025-08-02T15:00:00+05:30",
    ignition: false,
    engineHour: 1770.3,
    odometer: 154330.6,
    gmt: "+05:30",
    parking: true,
    isActive: true
  },
  {
    id: "v-0015",
    vehicleNo: "OD02 CC 7789",
    imei: "354321098765432",
    vin: "MB1ZZZ7NZFY654321",
    status: "idle",
    speed: 5,
    vehicleType: { name: "Pickup" },
    deviceType: { name: "GT06" },
    lastUpdate: "2025-10-17T08:05:41+05:30",
    primaryUser: {
      name: "Arjun Sahu",
      email: "arjun.sahu@example.com",
      mobilePrefix: "+91",
      mobile: "9777012345",
      isEmailVerified: true,
      profileUrl: "/uploads/users/arjun.png",
      username: "arjun.s"
    },
    addedBy: {
      name: "Aarti Mehta",
      email: "aarti.mehta@example.com",
      mobilePrefix: "+91",
      mobile: "9811102233",
      isEmailVerified: true,
      profileUrl: "/uploads/users/aarti.png",
      username: "aarti.m"
    },
    primaryExpiry: "2026-02-18",
    secondaryExpiry: "2026-06-18",
    createdAt: "2025-07-28T19:12:55+05:30",
    ignition: true,
    engineHour: 310.2,
    odometer: 20540.0,
    gmt: "+05:30",
    parking: false,
    isActive: false
  },
  {
    id: "v-0016",
    vehicleNo: "AS01 DD 9900",
    imei: "863401298765432",
    vin: "MA1FL2AB2NT987654",
    status: "running",
    speed: 80,
    vehicleType: { name: "Truck" },
    deviceType: { name: "FBM920" },
    lastUpdate: "2025-10-17T08:00:59+05:30",
    primaryUser: {
      name: "Imran Ali",
      email: "imran.ali@example.com",
      mobilePrefix: "+91",
      mobile: "9864012345",
      isEmailVerified: true,
      profileUrl: "/uploads/users/imran.png",
      username: "imran.a"
    },
    addedBy: {
      name: "Seema Gupta",
      email: "seema.gupta@example.com",
      mobilePrefix: "+91",
      mobile: "9818899001",
      isEmailVerified: true,
      profileUrl: "/uploads/users/seema.png",
      username: "seema.g"
    },
    primaryExpiry: "2027-06-25",
    secondaryExpiry: "2027-09-25",
    createdAt: "2025-09-03T09:30:10+05:30",
    ignition: true,
    engineHour: 154.7,
    odometer: 10120.3,
    gmt: "+05:30",
    parking: false,
    isActive: true
  },
  {
    id: "v-0017",
    vehicleNo: "KL07 EE 1230",
    imei: "352067890123456",
    vin: "MCAUA8EV0PA345678",
    status: "stop",
    speed: 0,
    vehicleType: { name: "Car" },
    deviceType: { name: "GT06" },
    lastUpdate: "2025-10-17T07:46:45+05:30",
    primaryUser: {
      name: "Vivek Menon",
      email: "vivek.menon@example.com",
      mobilePrefix: "+91",
      mobile: "9847011223",
      isEmailVerified: true,
      profileUrl: "/uploads/users/vivek.png",
      username: "vivek.m"
    },
    addedBy: {
      name: "Vinod Singh",
      email: "vinod.singh@example.com",
      mobilePrefix: "+91",
      mobile: "9899011122",
      isEmailVerified: true,
      profileUrl: "/uploads/users/vinod.png",
      username: "vinod.s"
    },
    primaryExpiry: "2026-01-12",
    secondaryExpiry: "2026-04-12",
    createdAt: "2025-09-21T11:11:11+05:30",
    ignition: false,
    engineHour: 88.0,
    odometer: 6540.2,
    gmt: "+05:30",
    parking: true,
    isActive: true
  },
  {
    id: "v-0018",
    vehicleNo: "MP09 FF 4420",
    imei: "861209876543210",
    vin: "MA1TA2C45NT654321",
    status: "idle",
    speed: 2,
    vehicleType: { name: "Van" },
    deviceType: { name: "FBM920" },
    lastUpdate: "2025-10-17T08:03:33+05:30",
    primaryUser: {
      name: "Sonal Jain",
      email: "sonal.jain@example.com",
      mobilePrefix: "+91",
      mobile: "9826098765",
      isEmailVerified: true,
      profileUrl: "/uploads/users/sonal.png",
      username: "sonal.j"
    },
    addedBy: {
      name: "Aarti Mehta",
      email: "aarti.mehta@example.com",
      mobilePrefix: "+91",
      mobile: "9811102233",
      isEmailVerified: true,
      profileUrl: "/uploads/users/aarti.png",
      username: "aarti.m"
    },
    primaryExpiry: "2026-08-08",
    secondaryExpiry: "2026-11-08",
    createdAt: "2025-10-01T10:00:00+05:30",
    ignition: true,
    engineHour: 45.6,
    odometer: 3200.0,
    gmt: "+05:30",
    parking: false,
    isActive: true
  },
  {
    id: "v-0019",
    vehicleNo: "TS11 GG 7711",
    imei: "354000987612345",
    vin: "MBJZZZ6RZMY987654",
    status: "running",
    speed: 67,
    vehicleType: { name: "Truck" },
    deviceType: { name: "GT06" },
    lastUpdate: "2025-10-17T07:53:20+05:30",
    primaryUser: {
      name: "Prathik Reddy",
      email: "prathik.reddy@example.com",
      mobilePrefix: "+91",
      mobile: "9849012345",
      isEmailVerified: false,
      profileUrl: "/uploads/users/prathik.png",
      username: "prathik.r"
    },
    addedBy: {
      name: "Seema Gupta",
      email: "seema.gupta@example.com",
      mobilePrefix: "+91",
      mobile: "9818899001",
      isEmailVerified: true,
      profileUrl: "/uploads/users/seema.png",
      username: "seema.g"
    },
    primaryExpiry: "2027-08-01",
    secondaryExpiry: "2027-11-01",
    createdAt: "2025-10-10T12:45:30+05:30",
    ignition: true,
    engineHour: 22.4,
    odometer: 1500.9,
    gmt: "+05:30",
    parking: false,
    isActive: true
  },
  {
    id: "v-0020",
    vehicleNo: "UK07 HH 9909",
    imei: "863450987601234",
    vin: "MA1TN2AB3PT123987",
    status: "stop",
    speed: 0,
    vehicleType: { name: "SUV" },
    deviceType: { name: "FBM920" },
    lastUpdate: "2025-10-17T08:07:22+05:30",
    primaryUser: {
      name: "Divya Joshi",
      email: "divya.joshi@example.com",
      mobilePrefix: "+91",
      mobile: "9897098765",
      isEmailVerified: true,
      profileUrl: "/uploads/users/divya.png",
      username: "divya.j"
    },
    addedBy: {
      name: "Vinod Singh",
      email: "vinod.singh@example.com",
      mobilePrefix: "+91",
      mobile: "9899011122",
      isEmailVerified: true,
      profileUrl: "/uploads/users/vinod.png",
      username: "vinod.s"
    },
    primaryExpiry: "2026-12-31",
    secondaryExpiry: "2027-03-31",
    createdAt: "2025-10-15T09:09:09+05:30",
    ignition: false,
    engineHour: 10.1,
    odometer: 820.5,
    gmt: "+05:30",
    parking: true,
    isActive: true
  }
];




   // Minimal tooltip component for complete vehicle information
  




function page() {

   const router = useRouter();
  // Helper function to calculate expiry status
  const calculateExpiry = (expiryStr: string) => {
    const expiryDate = new Date(expiryStr);
    const today = new Date();
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
    const isExpired = daysUntilExpiry < 0;
    return { daysUntilExpiry, isExpiringSoon, isExpired };
  };

  // Format ISO datetime to readable format
  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    const dateStr = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
    return { date: dateStr, time: timeStr };
  };

  // Tooltip component for vehicle details
  const VehicleTooltip = (row: VehicleRow) => {
    const { date, time } = formatDateTime(row.lastUpdate);
    
    return (
      <div className="p-2 max-w-xs">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-700 dark:text-neutral-300 font-medium text-[10px]">
            {row.vehicleNo.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-[12px] text-neutral-900 dark:text-neutral-100">{row.vehicleNo}</div>
            <div className="text-[9px] text-neutral-500 dark:text-neutral-400">{row.vehicleType.name} • {row.status}</div>
          </div>
        </div>

        {/* Device Info */}
        <div className="space-y-1 text-[11px]">
          <div className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-neutral-400 dark:text-neutral-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="text-neutral-700 dark:text-neutral-300 font-mono">{row.imei}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-neutral-400 dark:text-neutral-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span className="text-neutral-700 dark:text-neutral-300 font-mono">{row.vin}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-neutral-400 dark:text-neutral-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
            <span className="text-neutral-700 dark:text-neutral-300">{row.deviceType.name}</span>
          </div>
        </div>

        {/* Engine & Odometer */}
        <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex justify-between text-[10px]">
            <span className="text-neutral-500 dark:text-neutral-400">Engine Hours:</span>
            <span className="font-medium text-neutral-900 dark:text-neutral-100">{row.engineHour.toFixed(1)} hrs</span>
          </div>
          <div className="flex justify-between text-[10px] mt-1">
            <span className="text-neutral-500 dark:text-neutral-400">Odometer:</span>
            <span className="font-medium text-neutral-900 dark:text-neutral-100">{row.odometer.toLocaleString()} km</span>
          </div>
        </div>

        {/* Last Update */}
        <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-1 text-[10px] text-neutral-500 dark:text-neutral-400">
            <AccessTimeIcon style={{ fontSize: "9px" }} />
            <span>Last: {date} at {time}</span>
          </div>
        </div>
      </div>
    );
  };

  // User Tooltip
  const UserTooltip = (user: PersonRef) => {
    return (
      <div className="p-3 max-w-xs">
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user.profileUrl} alt={user.name} />
            <AvatarFallback className="bw-gradient-primary bw-text-primary-fg text-xs font-semibold">
              {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold bw-text-primary">{user.name}</div>
            <div className="text-xs bw-text-muted">@{user.username}</div>
          </div>
        </div>

        <div className="space-y-1 text-[11px]">
          <div className="flex items-center gap-1.5">
            <EmailIcon style={{ fontSize: "11px" }} className="text-neutral-400 dark:text-neutral-500" />
            <span className="text-neutral-700 dark:text-neutral-300 truncate">{user.email}</span>
            {user.isEmailVerified && (
              <VerifiedIcon style={{ fontSize: "10px" }} className="text-blue-500 dark:text-blue-400 flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <PhoneIcon style={{ fontSize: "11px" }} className="text-neutral-400 dark:text-neutral-500" />
            <span className="text-neutral-700 dark:text-neutral-300 font-mono">
              {user.mobilePrefix} {user.mobile}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // -------- Filters Configuration --------
  const filterConfig: FilterConfigMap<VehicleRow> = {

    status: {
      kind: "custom",
      label: "⚡ Status",
      editor: (value, setValue) => {
        const [isOpen, setIsOpen] = React.useState(false);
        const [searchQuery, setSearchQuery] = React.useState("");
        const statuses = Array.from(new Set(VEHICLE_DATA.map(v => v.status))).sort();
        const filteredStatuses = statuses.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
        
        return (
          <div className="relative">
            <button
              type="button"
              onClick={() => { setIsOpen(!isOpen); setSearchQuery(""); }}
              className="w-full h-8 rounded-md border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-2.5 text-[11px] outline-none flex items-center justify-between text-left hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors"
            >
              <span className={value ? "capitalize text-neutral-900 dark:text-neutral-100" : "text-neutral-500 dark:text-neutral-400"}>
                {value ? value : "(Any Status)"}
              </span>
              <svg className="w-3 h-3 text-neutral-400 dark:text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md shadow-lg max-h-80 overflow-hidden">
                <div className="p-1.5 border-b border-neutral-200 dark:border-neutral-700">
                  <input
                    type="text"
                    placeholder="Search status..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-8 pl-8 pr-3 rounded-md border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm outline-none"
                    autoFocus
                  />
                  <svg className="absolute left-4 top-4 w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="max-h-52 overflow-y-auto">
                  <div className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer text-sm" onClick={() => { setValue(undefined); setIsOpen(false); }}>
                    <span className="text-slate-500">(Any Status)</span>
                  </div>
                  {filteredStatuses.map((s) => (
                    <div key={s} className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer text-sm capitalize" onClick={() => { setValue(s); setIsOpen(false); }}>
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
          </div>
        );
      },
      predicate: (row, value) => !value || row.status === value,
    },

    vehicleType: {
      kind: "custom",
      label: "🚚 Vehicle Type",
      editor: (value, setValue) => {
        const [isOpen, setIsOpen] = React.useState(false);
        const [searchQuery, setSearchQuery] = React.useState("");
        const types = Array.from(new Set(VEHICLE_DATA.map(v => v.vehicleType.name))).sort();
        const filteredTypes = types.filter(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        
        return (
          <div className="relative">
            <button
              type="button"
              onClick={() => { setIsOpen(!isOpen); setSearchQuery(""); }}
              className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 text-sm outline-none flex items-center justify-between text-left"
            >
              <span className={value ? "" : "text-slate-500"}>
                {value || "(Any Type)"}
              </span>
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg max-h-80 overflow-hidden">
                <div className="p-2 border-b border-slate-200 dark:border-slate-600">
                  <input
                    type="text"
                    placeholder="Search vehicle types..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-8 pl-8 pr-3 rounded-md border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm outline-none"
                    autoFocus
                  />
                  <svg className="absolute left-4 top-4 w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="max-h-52 overflow-y-auto">
                  <div className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer text-sm" onClick={() => { setValue(undefined); setIsOpen(false); }}>
                    <span className="text-slate-500">(Any Type)</span>
                  </div>
                  {filteredTypes.map((t) => (
                    <div key={t} className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer text-sm" onClick={() => { setValue(t); setIsOpen(false); }}>
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
          </div>
        );
      },
      predicate: (row, value) => !value || row.vehicleType.name === value,
    },

    deviceType: {
      kind: "custom",
      label: "📡 Device Type",
      editor: (value, setValue) => {
        const [isOpen, setIsOpen] = React.useState(false);
        const [searchQuery, setSearchQuery] = React.useState("");
        const devices = Array.from(new Set(VEHICLE_DATA.map(v => v.deviceType.name))).sort();
        const filteredDevices = devices.filter(d => d.toLowerCase().includes(searchQuery.toLowerCase()));
        
        return (
          <div className="relative">
            <button
              type="button"
              onClick={() => { setIsOpen(!isOpen); setSearchQuery(""); }}
              className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 text-sm outline-none flex items-center justify-between text-left"
            >
              <span className={value ? "" : "text-slate-500"}>
                {value || "(Any Device)"}
              </span>
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg max-h-80 overflow-hidden">
                <div className="p-2 border-b border-slate-200 dark:border-slate-600">
                  <input
                    type="text"
                    placeholder="Search device types..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-8 pl-8 pr-3 rounded-md border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm outline-none"
                    autoFocus
                  />
                  <svg className="absolute left-4 top-4 w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="max-h-52 overflow-y-auto">
                  <div className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer text-sm" onClick={() => { setValue(undefined); setIsOpen(false); }}>
                    <span className="text-slate-500">(Any Device)</span>
                  </div>
                  {filteredDevices.map((d) => (
                    <div key={d} className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer text-sm" onClick={() => { setValue(d); setIsOpen(false); }}>
                      {d}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
          </div>
        );
      },
      predicate: (row, value) => !value || row.deviceType.name === value,
    },

    addedBy: {
      kind: "custom",
      label: "👥 Added By",
      editor: (value, setValue) => {
        const [isOpen, setIsOpen] = React.useState(false);
        const [searchQuery, setSearchQuery] = React.useState("");
        const users = Array.from(new Set(VEHICLE_DATA.map(v => v.addedBy.name))).sort();
        const filteredUsers = users.filter(u => u.toLowerCase().includes(searchQuery.toLowerCase()));
        
        return (
          <div className="relative">
            <button
              type="button"
              onClick={() => { setIsOpen(!isOpen); setSearchQuery(""); }}
              className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 px-3 text-sm outline-none flex items-center justify-between text-left"
            >
              <span className={value ? "truncate" : "text-slate-500"}>
                {value || "(Any User)"}
              </span>
              <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg max-h-80 overflow-hidden">
                <div className="p-2 border-b border-slate-200 dark:border-slate-600">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-8 pl-8 pr-3 rounded-md border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm outline-none"
                    autoFocus
                  />
                  <svg className="absolute left-4 top-4 w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="max-h-52 overflow-y-auto">
                  <div className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer text-sm" onClick={() => { setValue(undefined); setIsOpen(false); }}>
                    <span className="text-slate-500">(Any User)</span>
                  </div>
                  {filteredUsers.map((u) => (
                    <div key={u} className="px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer text-sm truncate" onClick={() => { setValue(u); setIsOpen(false); }}>
                      {u}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
          </div>
        );
      },
      predicate: (row, value) => !value || row.addedBy.name === value,
    },

    speed: {
      kind: "numberRange",
      label: "⚡ Speed (km/h)",
      field: "speed",
    },
    ignition: {
      kind: "boolean",
      label: "🔑 Ignition",
      field: "ignition",
    },
    isActive: {
      kind: "boolean",
      label: "✅ Account Status",
      field: "isActive",
    },
    lastUpdate: {
      kind: "dateRange",
      label: "📅 Last Activity",
      field: "lastUpdate",
    },
    primaryExpiry: {
      kind: "dateRange",
      label: "🎫 Primary License",
      field: "primaryExpiry",
    },
    secondaryExpiry: {
      kind: "dateRange",
      label: "🎫 Secondary License",
      field: "secondaryExpiry",
    },
    createdAt: {
      kind: "dateRange",
      label: "📆 Created Date",
      field: "createdAt",
    },
    parking: {
      kind: "boolean",
      label: "🅿️ Parking",
      field: "parking",
    },

  };

  // -------- Bulk Actions --------
  const bulkActions: MultiSelectOption<VehicleRow>[] = [
    {
      name: "Activate",
      iconName: "toggle_on",
      variant: "default",
      callback: async (selectedRows, selectedIds) => {
        console.log("Activating vehicles:", selectedIds);
        // API call to activate selected vehicles
      },
      tooltip: "Activate selected vehicles",
    },
    {
      name: "Deactivate",
      iconName: "toggle_off",
      variant: "secondary",
      callback: async (selectedRows, selectedIds) => {
        console.log("Deactivating vehicles:", selectedIds);
        // API call to deactivate selected vehicles
      },
      tooltip: "Deactivate selected vehicles",
    },
    {
      name: "Export Selected",
      iconName: "download",
      variant: "outline",
      callback: async (selectedRows) => {
        console.log("Exporting vehicles:", selectedRows);
        // Export selected vehicles
      },
      tooltip: "Export selected vehicles data",
    },
    {
      name: "Delete",
      iconName: "delete",
      variant: "destructive",
      callback: async (selectedRows, selectedIds) => {
        if (confirm(`Are you sure you want to delete ${selectedIds.size} vehicle(s)?`)) {
          console.log("Deleting vehicles:", selectedIds);
          // API call to delete selected vehicles
        }
      },
      tooltip: "Delete selected vehicles",
    },
  ];

  // -------- table columns (CONDENSED & ORGANIZED) --------
  const displayOptions: DisplayMap<VehicleRow> = {
    // Column 0: Vehicle Information with icon
    0: {
      title: () => (
        <div className="flex items-center gap-1.5 font-medium text-[10px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
          <DirectionsCarIcon style={{ fontSize: "14px" }} />
          Vehicle
        </div>
      ),
      content: (row) => (
        <div className="flex items-center gap-2 min-w-[200px]">
          {/* Icon Badge */}
          <div className="flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300">
            <DirectionsCarIcon style={{ fontSize: "16px" }} />
          </div>
          
          {/* Vehicle Details */}
          <div className="flex-1 min-w-0">
            <div className="font-medium text-[13px] text-neutral-900 dark:text-neutral-100 truncate">
              {row.vehicleNo}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              <span>{row.vehicleType.name}</span>
              <span>•</span>
              <span className="font-mono truncate">{row.imei}</span>
            </div>
          </div>
        </div>
      ),
      tooltip: VehicleTooltip,
    },

    // Column 1: Status & Speed
    1: {
      title: () => (
        <div className="flex items-center gap-1.5 font-medium text-[10px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
          <SpeedIcon style={{ fontSize: "14px" }} />
          Status
        </div>
      ),
      content: (row) => (
        <div className="space-y-1 min-w-[140px]">
          {/* Status Badge */}
          <div className="inline-flex">
            <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
              row.status === "running" 
                ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800" 
                : row.status === "stop"
                ? "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
                : "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
            }`}>
              {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
            </span>
          </div>
          
          {/* Speed & Ignition */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <SpeedIcon style={{ fontSize: "12px" }} className="text-neutral-400 dark:text-neutral-500" />
              <span className="text-[21px] font-semibold text-neutral-900 dark:text-neutral-100 leading-none">{row.speed}</span>
              <span className="text-[8px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">km/h</span>
            </div>
            <div className="flex items-center gap-0.5 ml-1">
              <PowerSettingsNewIcon 
                style={{ fontSize: "12px" }} 
                className={row.ignition ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"} 
              />
              <span className="text-[9px] text-neutral-500 dark:text-neutral-400 font-medium">
                {row.ignition ? "ON" : "OFF"}
              </span>
            </div>
          </div>
        </div>
      ),
    },

    // Column 2: Primary User
    2: {
      title: () => (
        <div className="flex items-center gap-1.5 font-medium text-[10px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
          Primary User
        </div>
      ),
      content: (row) => (
        <div className="flex items-center gap-1.5 min-w-[140px]">
          <Avatar className="w-7 h-7 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <AvatarImage src={row.primaryUser.profileUrl} alt={row.primaryUser.name} />
            <AvatarFallback className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[10px] font-medium">
              {row.primaryUser.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-[12px] text-neutral-900 dark:text-neutral-100 truncate">
              {row.primaryUser.name}
            </div>
            <div className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">@{row.primaryUser.username}</div>
          </div>
        </div>
      ),
      tooltip: (row) => UserTooltip(row.primaryUser),
    },

    // Column 3: Added By
    3: {
      title: () => (
        <div className="flex items-center gap-1.5 font-medium text-[10px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
          Added By
        </div>
      ),
      content: (row) => (
        <div className="flex items-center gap-1.5 min-w-[140px]">
          <Avatar className="w-7 h-7 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <AvatarImage src={row.addedBy.profileUrl} alt={row.addedBy.name} />
            <AvatarFallback className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[10px] font-medium">
              {row.addedBy.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-[12px] text-neutral-900 dark:text-neutral-100 truncate">
              {row.addedBy.name}
            </div>
            <div className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">@{row.addedBy.username}</div>
          </div>
        </div>
      ),
      tooltip: (row) => UserTooltip(row.addedBy),
    },

    // Column 4: Last Activity
    4: {
      title: () => (
        <div className="flex items-center gap-1.5 font-medium text-[10px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
          <AccessTimeIcon style={{ fontSize: "14px" }} />
          Last Activity
        </div>
      ),
      content: (row) => {
        const { date, time } = formatDateTime(row.lastUpdate);
        return (
          <div className="min-w-[110px]">
            <div className="flex items-center gap-1">
              <AccessTimeIcon style={{ fontSize: "12px" }} className="text-neutral-400 dark:text-neutral-500" />
              <span className="text-[12px] font-medium text-neutral-900 dark:text-neutral-100">{date}</span>
            </div>
            <div className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">{time}</div>
          </div>
        );
      },
    },

    // Column 5: License Status
    5: {
      title: () => (
        <div className="flex items-center gap-1.5 font-medium text-[10px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
          License
        </div>
      ),
      content: (row) => {
        const primary = calculateExpiry(row.primaryExpiry);
        const secondary = calculateExpiry(row.secondaryExpiry);

        const getStatusIcon = (status: { isExpired: boolean; isExpiringSoon: boolean }) => {
          if (status.isExpired) return "✕";
          if (status.isExpiringSoon) return "!";
          return "✓";
        };

        return (
          <div className="space-y-1 min-w-[130px]">
            {/* Primary */}
            <div className="flex items-center justify-between px-1.5 py-0.5 rounded bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-neutral-500 dark:text-neutral-400">Pri</span>
                <span className="text-[10px] font-mono text-neutral-900 dark:text-neutral-100">{row.primaryExpiry}</span>
              </div>
              <span className="text-[10px] text-neutral-700 dark:text-neutral-300">{getStatusIcon(primary)}</span>
            </div>

            {/* Secondary */}
            <div className="flex items-center justify-between px-1.5 py-0.5 rounded bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-neutral-500 dark:text-neutral-400">Sec</span>
                <span className="text-[10px] font-mono text-neutral-900 dark:text-neutral-100">{row.secondaryExpiry}</span>
              </div>
              <span className="text-[10px] text-neutral-700 dark:text-neutral-300">{getStatusIcon(secondary)}</span>
            </div>
          </div>
        );
      },
    },

    // Column 6: Created At
    6: {
      title: () => (
        <div className="flex items-center gap-1.5 font-medium text-[10px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
          Created At
        </div>
      ),
      content: (row) => {
        const { date, time } = formatDateTime(row.createdAt);
        return (
          <div className="min-w-[110px]">
            <div className="text-[12px] font-medium text-neutral-900 dark:text-neutral-100">{date}</div>
            <div className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">{time}</div>
          </div>
        );
      },
    },

    // Column 7: Active Status with Toggle
    7: {
      title: () => (
        <div className="flex items-center gap-1.5 font-medium text-[10px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
          Account
        </div>
      ),
      content: (row) => (
        <div className="min-w-[90px]">
          <div className="flex items-center gap-1.5">
            <Switch 
              checked={row.isActive}
              onCheckedChange={(checked) => {
                console.log(`Toggle vehicle ${row.id} to ${checked ? 'active' : 'inactive'}`);
                // Handle toggle logic here
              }}
            />
            <span className="text-[11px] text-neutral-900 dark:text-neutral-100 font-medium">
              {row.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      ),
    },
  };

  return (
   <>
         <SmartCheckboxAutoTable<VehicleRow>
           title="Vehicle Management"
           data={VEHICLE_DATA}
           getRowId={(r) => r.id}
           displayOptions={displayOptions}
           filterConfig={filterConfig}
           multiSelectOptions={bulkActions}
           onRowClick={(row) => {
             console.log("Row Clicked →", row.id);
             router.push("/superadmin/vehicles/" + row.id);
           }}
           exportBrand={{
             name: "Fleet Stack",
             logoUrl: "/images/logo-light.png",
             addressLine1: "Self-Hosted GPS Software",
             addressLine2: "fleetstackglobal.com",
             footerNote: "We make it easiest — just deploy.",
           }}
         />
   </>
  )
}


export default page