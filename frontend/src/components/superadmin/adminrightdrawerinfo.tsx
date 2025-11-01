"use client";

import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import PersonIcon from "@mui/icons-material/Person";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import BusinessIcon from "@mui/icons-material/Business";
import LanguageIcon from "@mui/icons-material/Language";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";
import CloseIcon from "@mui/icons-material/Close";

// Types
interface Address {
  line1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  countryCode: string;
}

interface Company {
  name: string;
  logolight: string;
  logodark: string;
  website: string;
  socials: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    youtube?: string;
    github?: string;
    instagram?: string;
  };
}

interface SingleUnit {
  id: string;
  profileUrl: string;
  name: string;
  mobilePrefix: string;
  mobileNumber: string;
  email: string;
  isEmailVerified: boolean;
  username: string;
  address: Address;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
  status: string;
  vehiclesCount: number;
  credits: number;
  company: Company;
}

interface AdminRightDrawerInfoProps {
  userId?: string;
  isOpen: boolean;
  onClose: () => void;
}

// Sample data
const SINGLE_UNIT_SAMPLE: SingleUnit = {
  id: "234",
  profileUrl: "/uploads/users/u001.png",
  name: "Aarav Sharma",
  mobilePrefix: "+91",
  mobileNumber: "8987675654",
  email: "aarav.sharma@fleetstackglobal.com",
  isEmailVerified: true,
  username: "aarav.sharma",
  address: {
    line1: "42, Indus Tech Park",
    city: "Bengaluru",
    state: "Karnataka",
    postalCode: "560001",
    country: "India",
    countryCode: "IN",
  },
  createdAt: "2025-09-12T08:30:00Z",
  updatedAt: "2025-09-12T08:30:00Z",
  lastLogin: "2025-10-15T15:05:00Z",
  status: "active",
  vehiclesCount: 512,
  credits: 12000,
  company: {
    name: "Fleet Stack Global Pvt. Ltd.",
    logolight: "/brand/fleetstack-logo-light.svg",
    logodark: "/brand/fleetstack-logo-dark.svg",
    website: "https://fleetstackglobal.com",
    socials: {
      linkedin: "https://www.linkedin.com/company/fleetstackglobal",
      twitter: "https://twitter.com/fleetstack",
      facebook: "https://facebook.com/fleetstackglobal",
      youtube: "https://youtube.com/@fleetstack",
      github: "https://github.com/fleetstack",
      instagram: "https://instagram.com/fleetstack",
    },
  },
};

function AdminRightDrawerInfo({ userId, isOpen, onClose }: AdminRightDrawerInfoProps) {
  const [adminData, setAdminData] = useState<SingleUnit | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch admin data when userId changes
  useEffect(() => {
    if (userId && isOpen) {
      fetchAdminData(userId);
    }
  }, [userId, isOpen]);

  const fetchAdminData = async (id: string) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/admin/${id}`);
      // const data = await response.json();
      // setAdminData(data);
      
      // For now, use sample data
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      setAdminData(SINGLE_UNIT_SAMPLE);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin': return <LinkedInIcon fontSize="small" />;
      case 'twitter': return <TwitterIcon fontSize="small" />;
      case 'facebook': return <FacebookIcon fontSize="small" />;
      case 'youtube': return <YouTubeIcon fontSize="small" />;
      case 'github': return <GitHubIcon fontSize="small" />;
      case 'instagram': return <InstagramIcon fontSize="small" />;
      default: return <LanguageIcon fontSize="small" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]" onClick={onClose} />
      
      {/* Drawer - More compact and minimal */}
      <div className="ml-auto w-110 h-full bg-white dark:bg-neutral-900 shadow-2xl overflow-y-auto border-l border-neutral-200 dark:border-neutral-700 z-[9999] relative">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : adminData ? (
          <div className="p-7">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-200 dark:border-neutral-700">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Administrator Details</h2>
              <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 dark:hover:bg-neutral-800">
                <CloseIcon fontSize="small" className="dark:text-neutral-100" />
              </Button>
            </div>

            {/* Avatar & Basic Info */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-16 w-16 border border-neutral-200 dark:border-neutral-700">
                  <AvatarImage src={adminData.profileUrl} alt={adminData.name} />
                  <AvatarFallback className="bg-neutral-800 dark:bg-neutral-200 text-neutral-100 dark:text-neutral-800 text-lg font-semibold">
                    {adminData.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{adminData.name}</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">@{adminData.username}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={adminData.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                      {adminData.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Contact Information</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CallIcon fontSize="small" className="text-neutral-400 dark:text-neutral-500 w-4 h-4" />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">{adminData.mobilePrefix} {adminData.mobileNumber}</span>
                </div>
                <div className="flex items-center gap-3">
                  <EmailIcon fontSize="small" className="text-neutral-400 dark:text-neutral-500 w-4 h-4" />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">{adminData.email}</span>
                  {adminData.isEmailVerified && (
                    <VerifiedIcon fontSize="small" className="text-primary dark:text-neutral-400 w-4 h-4" />
                  )}
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Address</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`fi fi-${adminData.address.countryCode.toLowerCase()}`} style={{ fontSize: "16px" }} />
                  <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{adminData.address.country}</span>
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400 ml-6">
                  <p>{adminData.address.line1}</p>
                  <p>{adminData.address.city}, {adminData.address.state} {adminData.address.postalCode}</p>
                </div>
              </div>
            </div>

            {/* Activity & Statistics */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Activity & Statistics</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarTodayIcon fontSize="small" className="text-neutral-400 dark:text-neutral-500 w-4 h-4" />
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">Created</span>
                  </div>
                  <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {formatDate(adminData.createdAt)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AccessTimeIcon fontSize="small" className="text-neutral-400 dark:text-neutral-500 w-4 h-4" />
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">Last Login</span>
                  </div>
                  <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {formatDate(adminData.lastLogin)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DirectionsCarIcon fontSize="small" className="text-neutral-400 dark:text-neutral-500 w-4 h-4" />
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">Vehicles</span>
                  </div>
                  <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {adminData.vehiclesCount.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCardIcon fontSize="small" className="text-neutral-400 dark:text-neutral-500 w-4 h-4" />
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">Credits</span>
                  </div>
                  <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {adminData.credits.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Company</h4>
              <div className="space-y-3">
                {/* Company Logo & Name */}
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <img 
                      src={adminData.company.logolight}
                      alt={adminData.company.name}
                      className="h-8 w-auto object-contain dark:hidden"
                      onError={(e) => e.currentTarget.style.display = 'none'}
                    />
                    <img 
                      src={adminData.company.logodark}
                      alt={adminData.company.name}
                      className="h-8 w-auto object-contain hidden dark:block"
                      onError={(e) => e.currentTarget.style.display = 'none'}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{adminData.company.name}</p>
                  </div>
                </div>

                {/* Website */}
                {adminData.company.website && (
                  <div className="flex items-center gap-3">
                    <LanguageIcon fontSize="small" className="text-neutral-400 dark:text-neutral-500 w-4 h-4" />
                    <a 
                      href={adminData.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 underline"
                    >
                      {adminData.company.website.replace('https://', '')}
                    </a>
                  </div>
                )}

                {/* Social Links */}
                {Object.keys(adminData.company.socials).length > 0 && (
                  <div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">Social Links</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(adminData.company.socials).map(([platform, url]) => (
                        url && (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
                            title={platform.charAt(0).toUpperCase() + platform.slice(1)}
                          >
                            {getSocialIcon(platform)}
                          </a>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-500 dark:text-neutral-400">
            No data available
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminRightDrawerInfo;