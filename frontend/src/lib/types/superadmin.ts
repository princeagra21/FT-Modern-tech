export type Company = { name: string };

export type AdminRow = {
  id: string;
  name: string;
  mobilePrefix: string;
  mobileNumber: string;
  email?: string;
  username: string;
  isEmailVerified: boolean;
  profileUrl?: string;
  vehicles?: number;
  credits: number;
  isActive: boolean;
  address: string;
  city: string;
  country: string;
  countryCode: string;
  createdAt: string; // "YYYY-MM-DD hh:mm AM/PM"
  lastLogin: string; // "" when unknown
  companies?: Company[];
};