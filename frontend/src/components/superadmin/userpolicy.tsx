"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Material Design Icons
import DescriptionIcon from "@mui/icons-material/Description";
import SaveIcon from "@mui/icons-material/Save";
import RestoreIcon from "@mui/icons-material/Restore";

// ---------------- Types & Constants ----------------

type PolicyType = "terms" | "privacy" | "cookie" | "refund";

interface PolicySettings {
  type: PolicyType;
  enabled: boolean;
  requiresAcceptance: boolean;
  content: string;
}

const POLICY_OPTIONS = [
  { value: "terms" as PolicyType, label: "Terms of Service" },
  { value: "privacy" as PolicyType, label: "Privacy Policy" },
  { value: "cookie" as PolicyType, label: "Cookie Policy" },
  { value: "refund" as PolicyType, label: "Refund Policy" },
];

const DEFAULT_TEMPLATES: Record<PolicyType, string> = {
  terms: `Terms of Service

Last Updated: [DATE]

1. Acceptance of Terms
By accessing and using this service, you accept and agree to be bound by these terms.

2. Use License
Permission is granted to access the service for personal, non-commercial use only.

3. User Obligations
- Provide accurate information
- Maintain account security
- Comply with all applicable laws
- Respect intellectual property rights

4. Service Modifications
We reserve the right to modify or discontinue the service at any time.

5. Limitation of Liability
We are not liable for any damages arising from the use of our service.

6. Contact
For questions, contact us at legal@example.com`,

  privacy: `Privacy Policy

Last Updated: [DATE]

1. Information We Collect
- Account information (name, email, password)
- Profile information
- Usage data and analytics
- Payment information (processed securely)

2. How We Use Your Information
- To provide and maintain our service
- To notify you about changes to our service
- To provide customer support
- To gather analysis or valuable information to improve our service

3. Data Security
We implement appropriate security measures to protect your personal information.

4. Your Rights
You have the right to:
- Access your personal data
- Correct inaccurate data
- Request deletion of your data
- Object to data processing

5. Contact Us
If you have questions about this Privacy Policy, contact us at privacy@example.com`,

  cookie: `Cookie Policy

Last Updated: [DATE]

1. What Are Cookies
Cookies are small text files that are placed on your device to help us provide a better service.

2. How We Use Cookies
We use cookies for:
- Essential Cookies: Required for the website to function
- Analytics Cookies: Help us understand how visitors use our site
- Preference Cookies: Remember your preferences and settings

3. Managing Cookies
You can control cookies through your browser settings. However, disabling cookies may affect functionality.

4. Third-Party Cookies
We may use third-party services like Google Analytics that set their own cookies.

5. Contact
For questions about our use of cookies, contact us at privacy@example.com`,

  refund: `Refund Policy

Last Updated: [DATE]

1. Overview
We want you to be satisfied with our service. This policy explains our refund procedures.

2. Eligibility for Refunds
Refunds may be requested within 30 days of purchase if:
- The service was not as described
- Technical issues prevented use
- Unauthorized charges occurred

3. Non-Refundable Items
- Services already consumed or used
- Promotional or discounted items (unless required by law)
- Digital products after download

4. How to Request a Refund
1. Contact our support team at support@example.com
2. Provide your order number and reason for refund
3. Allow 3-5 business days for review
4. If approved, refunds are processed within 10 business days

5. Subscription Cancellations
- Cancel anytime before the next billing cycle
- No refunds for partial months
- Access continues until the end of the paid period

6. Contact
Questions about refunds? Contact us at billing@example.com`,
};

// ---------------- Persistence ----------------

const LS_KEY = "user-policy-settings-v1";

function loadSettings(): Record<PolicyType, PolicySettings> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return initializeDefaults();
    return JSON.parse(raw);
  } catch {
    return initializeDefaults();
  }
}

function initializeDefaults(): Record<PolicyType, PolicySettings> {
  const defaults: Record<PolicyType, PolicySettings> = {} as any;

  POLICY_OPTIONS.forEach((option) => {
    defaults[option.value] = {
      type: option.value,
      enabled: false,
      requiresAcceptance: true,
      content: DEFAULT_TEMPLATES[option.value],
    };
  });

  return defaults;
}

function saveSettings(settings: Record<PolicyType, PolicySettings>) {
  localStorage.setItem(LS_KEY, JSON.stringify(settings));
}

// ---------------- Helper Functions ----------------

function getWordCount(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

// ---------------- Component ----------------

export default function UserPolicyManagement() {
  const [settings, setSettings] = useState<Record<PolicyType, PolicySettings>>(
    () => loadSettings()
  );
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyType>("terms");

  // Load settings on mount
  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  // Update a specific policy setting
  const updateSetting = (
    policyType: PolicyType,
    updates: Partial<PolicySettings>
  ) => {
    setSettings((prev) => ({
      ...prev,
      [policyType]: { ...prev[policyType], ...updates },
    }));
  };

  // Reset policy to template
  const handleResetToTemplate = (policyType: PolicyType) => {
    updateSetting(policyType, {
      content: DEFAULT_TEMPLATES[policyType],
    });
  };

  // Save all to localStorage
  const handleSaveAll = () => {
    saveSettings(settings);
  };

  // Reset all
  const handleResetAll = () => {
    const defaults = initializeDefaults();
    setSettings(defaults);
    saveSettings(defaults);
  };

  const currentPolicy = settings[selectedPolicy];
  const activePolicies = Object.values(settings).filter(
    (p) => p.enabled
  ).length;
  const totalPolicies = POLICY_OPTIONS.length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-forefround/5"
          >
            <DescriptionIcon className="text-foreground" />
          </motion.div>
          <div>
            <h1 className="typo-h1">
              User Policy Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Create and manage legal agreements for your users
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleResetAll}
          >
            <RestoreIcon className="mr-2 h-4 w-4" /> Reset All
          </Button>

          <Button
            onClick={handleSaveAll}
          >
            <SaveIcon className="mr-2 h-4 w-4" /> Save All
          </Button>
        </div>
      </div>

      {/* Policy Selector */}
      <Card className="mb-6 rounded-2xl border border-border bg-card p-5">
        <Label className="text-sm font-medium text-foreground mb-2 block">
          Select Policy to Edit
        </Label>
        <Select
          value={selectedPolicy}
          onValueChange={(value) => setSelectedPolicy(value as PolicyType)}
        >
          <SelectTrigger className="rounded-xl border-border bg-background text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border">
            {POLICY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
                {settings[option.value].enabled && " (Active)"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      {/* Policy Editor Card */}
      <motion.div
        key={selectedPolicy}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-1">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {POLICY_OPTIONS.find((p) => p.value === selectedPolicy)?.label}
            </h3>
            <p className="text-sm text-muted-foreground">
              Configure the policy content and settings
            </p>
          </div>

          <Separator className="mb-1 bg-border" />

          {/* Content Editor */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium text-foreground">
                Policy Content
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {getWordCount(currentPolicy.content)} words
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleResetToTemplate(selectedPolicy)}
                  className="rounded-lg border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <RestoreIcon className="mr-1 h-3 w-3" /> Reset to Template
                </Button>
              </div>
            </div>

            <textarea
              value={currentPolicy.content}
              onChange={(e) =>
                updateSetting(selectedPolicy, { content: e.target.value })
              }
              className="w-full h-[400px] rounded-xl border border-border bg-background p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="Enter your policy content here..."
            />

            <div className="mt-2 text-xs text-muted-foreground">
              Plain text format. Updates will be reflected immediately for
              users.
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
