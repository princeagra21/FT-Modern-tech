"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

export interface SMTPConfig {
  enabled: boolean;
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
  replyToEmail?: string;
}

const SuperAdminSMTPSettings = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const [smtpConfig, setSMTPConfig] = useState<SMTPConfig>({
    enabled: true,
    host: "",
    port: 587,
    secure: true,
    username: "",
    password: "",
    fromEmail: "",
    fromName: "FleetStack",
    replyToEmail: "",
  });

  const updateSMTP = (field: keyof SMTPConfig, value: any) => {
    setSMTPConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Saving SMTP Config:", smtpConfig);
      alert("SMTP Configuration saved successfully!");
    } catch (error) {
      console.error("Failed to save SMTP config:", error);
      alert("Failed to save configuration");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Testing SMTP connection with:", smtpConfig);
      alert("Test email sent successfully! Please check your inbox.");
    } catch (error) {
      console.error("Failed to test connection:", error);
      alert("Failed to send test email");
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <>
      <div className="space-y-6 p-6 bg-background text-foreground">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="typo-h2">
              SMTP Configuration
            </h2>
            <p className="text-sm text-muted mt-1">
              Configure your email server settings
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className=""
            >
              {isSaving ? (
                <>
                  <CheckCircleRoundedIcon className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <SaveRoundedIcon className="mr-2 h-4 w-4" />
                  Save Configuration
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleTestConnection}
              disabled={isTesting}
              className=""
            >
              {isTesting ? (
                <>
                  <SendRoundedIcon className="mr-2 h-4 w-4 animate-pulse" />
                  Sending Test Email...
                </>
              ) : (
                <>
                  <SendRoundedIcon className="mr-2 h-4 w-4" />
                  Send Test Email
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Enable SMTP */}
        <div className="flex items-center justify-between p-4 bg-background border border-border rounded-xl">
          <div className="flex-1">
            <div className="typo-p500>
              Enable SMTP Service
            </div>
            <div className="typo-subtitle mt-0.5">
              {smtpConfig.enabled
                ? "SMTP service is active and will send emails"
                : "SMTP service is disabled"}
            </div>
          </div>
          <Switch
            checked={smtpConfig.enabled}
            onCheckedChange={(checked) => updateSMTP("enabled", checked)}
          />
        </div>

        <Alert className="border-border bg-background">
          <InfoRoundedIcon className="h-4 w-4 text-foreground" />
          <AlertDescription className="typo-subtitle">
            <div className="font-semibold mb-1">Configure Your SMTP Server</div>
            <div>
              Enter your custom SMTP server details below to send system emails
              and notifications.
            </div>
          </AlertDescription>
        </Alert>

        {/* SMTP Server Configuration */}
        <div className="space-y-4">
          <div className="text-sm font-semibold text-foreground">
            SMTP Server Configuration
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label
                htmlFor="smtp-host"
                className="typo-p500
              >
                SMTP Host
              </Label>
              <Input
                id="smtp-host"
                type="text"
                value={smtpConfig.host}
                onChange={(e) => updateSMTP("host", e.target.value)}
                className="rounded-lg mt-1.5 border-border bg-background text-foreground placeholder:text-muted"
                placeholder="smtp.example.com"
              />
              <p className="typo-subtitle mt-1.5">
                The hostname of your SMTP server
              </p>
            </div>

            <div>
              <Label
                htmlFor="smtp-port"
                className="typo-p500
              >
                Port
              </Label>
              <Input
                id="smtp-port"
                type="number"
                value={smtpConfig.port}
                onChange={(e) => updateSMTP("port", parseInt(e.target.value))}
                className="rounded-lg mt-1.5 border-border bg-background text-foreground placeholder:text-muted"
                placeholder="587"
              />
              <p className="typo-subtitle mt-1.5">Common: 587, 465, 25</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-background border border-border rounded-xl">
            <div className="flex-1">
              <div className="typo-p500>
                Use TLS/SSL Encryption
              </div>
              <div className="typo-subtitle mt-0.5">
                {smtpConfig.secure
                  ? "Secure connection enabled (Recommended for ports 465 and 587)"
                  : "Unencrypted connection (Not recommended for production)"}
              </div>
            </div>
            <Switch
              checked={smtpConfig.secure}
              onCheckedChange={(checked) => updateSMTP("secure", checked)}
            />
          </div>

          <div>
            <Label
              htmlFor="smtp-username"
              className="typo-p500
            >
              Username / Email
            </Label>
            <Input
              id="smtp-username"
              type="text"
              value={smtpConfig.username}
              onChange={(e) => updateSMTP("username", e.target.value)}
              className="rounded-lg mt-1.5 border-border bg-background text-foreground placeholder:text-muted"
              placeholder="your-email@example.com"
            />
            <p className="typo-subtitle mt-1.5">
              SMTP authentication username (usually your email address)
            </p>
          </div>

          <div>
            <Label
              htmlFor="smtp-password"
              className="typo-p500
            >
              Password / App Password
            </Label>
            <div className="relative mt-1.5">
              <Input
                id="smtp-password"
                type={showPassword ? "text" : "password"}
                value={smtpConfig.password}
                onChange={(e) => updateSMTP("password", e.target.value)}
                className="rounded-lg pr-10 border-border bg-background text-foreground"
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted"
              >
                {showPassword ? (
                  <VisibilityOffRoundedIcon fontSize="small" />
                ) : (
                  <VisibilityRoundedIcon fontSize="small" />
                )}
              </button>
            </div>
            <p className="typo-subtitle mt-1.5">
              For Gmail/Google Workspace, use an{" "}
              <a
                href="https://support.google.com/accounts/answer/185833"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-primary"
              >
                App Password
              </a>
            </p>
          </div>
        </div>

        <Separator className="my-4 bg-border" />

        {/* Sender Information */}
        <div className="space-y-4">
          <div className="text-sm font-semibold text-foreground">
            Sender Information
          </div>

          <div>
            <Label
              htmlFor="from-email"
              className="typo-p500
            >
              From Email Address
            </Label>
            <Input
              id="from-email"
              type="email"
              value={smtpConfig.fromEmail}
              onChange={(e) => updateSMTP("fromEmail", e.target.value)}
              className="rounded-lg mt-1.5 border-border bg-background text-foreground placeholder:text-muted"
              placeholder="noreply@yourdomain.com"
            />
            <p className="typo-subtitle mt-1.5">
              This email address will appear as the sender for all system emails
            </p>
          </div>

          <div>
            <Label
              htmlFor="from-name"
              className="typo-p500
            >
              From Name
            </Label>
            <Input
              id="from-name"
              type="text"
              value={smtpConfig.fromName}
              onChange={(e) => updateSMTP("fromName", e.target.value)}
              className="rounded-lg mt-1.5 border-border bg-background text-foreground placeholder:text-muted"
              placeholder="FleetStack"
            />
            <p className="typo-subtitle mt-1.5">
              Display name that will appear alongside the email address
            </p>
          </div>

          <div>
            <Label
              htmlFor="reply-to-email"
              className="typo-p500
            >
              Reply-To Email (Optional)
            </Label>
            <Input
              id="reply-to-email"
              type="email"
              value={smtpConfig.replyToEmail || ""}
              onChange={(e) => updateSMTP("replyToEmail", e.target.value)}
              className="rounded-lg mt-1.5 border-border bg-background text-foreground placeholder:text-muted"
              placeholder="support@yourdomain.com"
            />
            <p className="typo-subtitle mt-1.5">
              Email address where replies should be sent (if different from
              sender)
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuperAdminSMTPSettings;
