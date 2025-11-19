"use client";

import React from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import VerifiedIcon from "@mui/icons-material/Verified";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PaymentIcon from "@mui/icons-material/Payment";
import BusinessIcon from "@mui/icons-material/Business";
import LanguageIcon from "@mui/icons-material/Language";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ScheduleIcon from "@mui/icons-material/Schedule";
import RefreshIcon from "@mui/icons-material/Refresh";



export type Transaction = {
  transactionId: string;
  status: "success" | "failed" | "pending";
  amount: number;
  currency: string;        // e.g. "INR"
  credits: number;
  gateway: string;         // e.g. "Razorpay"
  datetime: string;        // ISO string
  customer: {
    id: string;
    name: string;
    mobilePrefix: "+91";
    mobile: string;
    email: string;
    isVerifiedEmail: boolean;
    address: {
      address: string;
      countryCode: string; // e.g. "IN"
    };
    company?: {
      name: string;
      website?: string;
      // Any arbitrary string:string attributes
      attributes?: Record<string, string>;
    };
  };
};

// Single sample record
export const TRANSACTION: Transaction = {
  transactionId: "TXN-2025-10-21-0001",
  status: "success",
  amount: 2499,
  currency: "INR",
  credits: 250,
  gateway: "Razorpay",
  datetime: "2025-10-21T06:15:12Z",
  customer: {
    id: "CUST-IND-001",
    name: "Akash Kumar",
    mobilePrefix: "+91",
    mobile: "9876543210",
    email: "akash.kumar@example.com",
    isVerifiedEmail: true,
    address: {
      address: "A-12, Sector 62, Noida, Uttar Pradesh",
      countryCode: "IN",
    },
    company: {
      name: "TransLogix Pvt Ltd",
      website: "https://translogix.in",
      attributes: {
        linkedin: "https://linkedin.com/company/translogix",
        twitter: "https://x.com/translogix",
        supportEmail: "support@translogix.in",
        region: "APAC",
      },
    },
  },
};

interface TransactionDetailsDrawerProps {
  transaction: Transaction | null;
  open: boolean;
  onClose: () => void;
}

function TransactionDetailsDrawer({ transaction, open, onClose }: TransactionDetailsDrawerProps) {
  if (!open || !transaction) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  const getStatusConfig = (status: Transaction['status']) => {
    const configs = {
      success: { 
        label: 'Success', 
        icon: CheckCircleIcon
      },
      failed: { 
        label: 'Failed', 
        icon: CancelIcon
      },
      pending: { 
        label: 'Pending', 
        icon: ScheduleIcon
      },
    };
    return configs[status] || configs.pending;
  };

  const statusConfig = getStatusConfig(transaction.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="fixed inset-0 z-[9999] flex">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]" onClick={onClose} />
      
      {/* Drawer */}
      <div className="ml-auto w-110 h-full bg-white dark:bg-neutral-900 shadow-2xl overflow-y-auto border-l border-neutral-200 dark:border-neutral-700 z-[9999] relative">
        <div className="p-7">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-200 dark:border-neutral-700">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Transaction Details</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 dark:hover:bg-neutral-800">
              <CloseIcon fontSize="small" className="dark:text-neutral-100" />
            </Button>
          </div>

          {/* Transaction ID & Status */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <ReceiptIcon className="text-neutral-400 dark:text-neutral-500" />
              <div className="flex-1">
                <p className="typo-subtitle">Transaction ID</p>
                <p className="text-sm font-semibold font-mono text-neutral-900 dark:text-neutral-100">{transaction.transactionId}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span 
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md typo-h6
                  ${transaction.status === 'success' 
                    ? 'bg-black text-white dark:bg-green-500/10 dark:text-green-500 dark:border dark:border-green-500' 
                    : transaction.status === 'failed'
                    ? 'bg-red-500 text-white dark:bg-red-500/10 dark:text-red-500 dark:border dark:border-red-500'
                    : 'bg-gray-100 text-gray-600 border border-gray-400 dark:bg-amber-500/10 dark:text-amber-500 dark:border-amber-500'
                  }`}
              >
                <StatusIcon style={{ fontSize: '14px' }} />
                {statusConfig.label}
              </span>
            </div>
          </div>

          {/* Customer Information */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Customer Information</h4>
            
            {/* Customer Avatar & Name */}
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-14 w-14 border border-neutral-200 dark:border-neutral-700">
                <AvatarFallback className="bg-neutral-800 dark:bg-neutral-200 text-neutral-100 dark:text-neutral-800 text-base font-semibold">
                  {getInitials(transaction.customer.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <Link 
                  href={`/superadmin/administrators/${transaction.customer.id}`}
                  className="text-base font-semibold text-neutral-900 dark:text-neutral-100 hover:underline"
                >
                  {transaction.customer.name}
                </Link>
                <p className="typo-subtitle">ID: {transaction.customer.id}</p>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CallIcon fontSize="small" className="text-neutral-400 dark:text-neutral-500 w-4 h-4" />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  {transaction.customer.mobilePrefix} {transaction.customer.mobile}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <EmailIcon fontSize="small" className="text-neutral-400 dark:text-neutral-500 w-4 h-4" />
                <span className="text-sm text-neutral-700 dark:text-neutral-300">{transaction.customer.email}</span>
                {transaction.customer.isVerifiedEmail && (
                  <VerifiedIcon fontSize="small" className="text-neutral-400 dark:text-neutral-400 w-4 h-4" />
                )}
              </div>
              <div className="flex items-start gap-3">
                <LocationOnIcon fontSize="small" className="text-neutral-400 dark:text-neutral-500 w-4 h-4 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start gap-2">
                    <span className="typo-subtitle min-w-[60px]">Address</span>
                    <span className="text-sm text-neutral-700 dark:text-neutral-300 break-words flex-1">
                      {transaction.customer.address.address}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="typo-subtitle min-w-[60px]">Country</span>
                    <span className="text-sm text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                      <span className={`fi fi-${transaction.customer.address.countryCode.toLowerCase()}`} style={{ fontSize: "14px" }} />
                      {transaction.customer.address.countryCode}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Company Information */}
          {transaction.customer.company && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Company</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <BusinessIcon fontSize="small" className="text-neutral-400 dark:text-neutral-500 w-4 h-4" />
                  <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{transaction.customer.company.name}</span>
                </div>
                
                {transaction.customer.company.website && (
                  <div className="flex items-center gap-3">
                    <LanguageIcon fontSize="small" className="text-neutral-400 dark:text-neutral-500 w-4 h-4" />
                    <a 
                      href={transaction.customer.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 underline"
                    >
                      {transaction.customer.company.website.replace('https://', '')}
                    </a>
                  </div>
                )}

                {/* Social Links */}
                {transaction.customer.company.attributes && Object.keys(transaction.customer.company.attributes).filter(k => ['linkedin', 'facebook', 'twitter'].includes(k)).length > 0 && (
                  <div>
                    <p className="typo-subtitle mb-2">Social Links</p>
                    <div className="flex flex-wrap gap-2">
                      {transaction.customer.company.attributes.linkedin && (
                        <a
                          href={transaction.customer.company.attributes.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
                        >
                          <LinkedInIcon fontSize="small" />
                        </a>
                      )}
                      {transaction.customer.company.attributes.facebook && (
                        <a
                          href={transaction.customer.company.attributes.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
                        >
                          <FacebookIcon fontSize="small" />
                        </a>
                      )}
                      {transaction.customer.company.attributes.twitter && (
                        <a
                          href={transaction.customer.company.attributes.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
                        >
                          <TwitterIcon fontSize="small" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payment Details */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Payment Details</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PaymentIcon fontSize="small" className="text-neutral-400 dark:text-neutral-500 w-4 h-4" />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">Amount</span>
                </div>
                <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  {transaction.currency} {transaction.amount.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCardIcon fontSize="small" className="text-neutral-400 dark:text-neutral-500 w-4 h-4" />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">Credits</span>
                </div>
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {transaction.credits.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AccountBalanceIcon fontSize="small" className="text-neutral-400 dark:text-neutral-500 w-4 h-4" />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">Gateway</span>
                </div>
                <Badge variant="outline" className="text-xs border-neutral-300 dark:border-neutral-600">
                  {transaction.gateway}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarTodayIcon fontSize="small" className="text-neutral-400 dark:text-neutral-500 w-4 h-4" />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">Date & Time</span>
                </div>
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {formatDate(transaction.datetime)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionDetailsDrawer;