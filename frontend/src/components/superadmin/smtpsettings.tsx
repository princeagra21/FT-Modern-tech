'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';

// Type Definitions
export interface SMTPConfig {
  enabled: boolean;
  
  // SMTP Server Configuration
  host: string;
  port: number;
  secure: boolean; // Use TLS/SSL
  username: string;
  password: string;
  
  // Sender Information
  fromEmail: string;
  fromName: string;
  replyToEmail?: string;
}

const SuperAdminSMTPSettings = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  // Initial SMTP Configuration
  const [smtpConfig, setSMTPConfig] = useState<SMTPConfig>({
    enabled: true,
    host: '',
    port: 587,
    secure: true,
    username: '',
    password: '',
    fromEmail: '',
    fromName: 'FleetStack',
    replyToEmail: '',
  });

  // Update SMTP Config
  const updateSMTP = (field: keyof SMTPConfig, value: any) => {
    setSMTPConfig(prev => ({ ...prev, [field]: value }));
  };

  // Save Configuration
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // API call to save SMTP configuration
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      console.log('Saving SMTP Config:', smtpConfig);
      alert('SMTP Configuration saved successfully!');
    } catch (error) {
      console.error('Failed to save SMTP config:', error);
      alert('Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  // Test Connection
  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      // API call to test SMTP connection
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      console.log('Testing SMTP connection with:', smtpConfig);
      alert('Test email sent successfully! Please check your inbox.');
    } catch (error) {
      console.error('Failed to test connection:', error);
      alert('Failed to send test email');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <>
      <div className="space-y-6 p-6">
        {/* Header Row - Heading and Action Buttons */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">SMTP Configuration</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Configure your email server settings</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-lg bg-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 text-white dark:text-black"
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
              className="rounded-lg dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-700"
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

        {/* Second Row - Enable/Disable SMTP */}
        <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl">
          <div className="flex-1">
            <div className="text-sm font-medium dark:text-neutral-100">Enable SMTP Service</div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {smtpConfig.enabled ? 'SMTP service is active and will send emails' : 'SMTP service is disabled'}
            </div>
          </div>
          <Switch
            checked={smtpConfig.enabled}
            onCheckedChange={(checked) => updateSMTP('enabled', checked)}
          />
        </div>

        <Alert className="border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900">
          <InfoRoundedIcon className="h-4 w-4 dark:text-neutral-100" />
          <AlertDescription className="text-xs dark:text-neutral-300">
            <div className="font-semibold mb-1">Configure Your SMTP Server</div>
            <div className="text-neutral-600 dark:text-neutral-400">Enter your custom SMTP server details below to send system emails and notifications.</div>
          </AlertDescription>
        </Alert>

        {/* SMTP Server Configuration */}
        <div className="space-y-4">
          <div className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">SMTP Server Configuration</div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="smtp-host" className="text-sm font-medium dark:text-neutral-200">SMTP Host</Label>
              <Input 
                id="smtp-host"
                type="text"
                value={smtpConfig.host}
                onChange={(e) => updateSMTP('host', e.target.value)}
                className="rounded-lg mt-1.5 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
                placeholder="smtp.example.com"
              />
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5">The hostname of your SMTP server</p>
            </div>

            <div>
              <Label htmlFor="smtp-port" className="text-sm font-medium dark:text-neutral-200">Port</Label>
              <Input 
                id="smtp-port"
                type="number"
                value={smtpConfig.port}
                onChange={(e) => updateSMTP('port', parseInt(e.target.value))}
                className="rounded-lg mt-1.5 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
                placeholder="587"
              />
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5">Common: 587, 465, 25</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl">
            <div className="flex-1">
              <div className="text-sm font-medium dark:text-neutral-100">Use TLS/SSL Encryption</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                {smtpConfig.secure ? 'Secure connection enabled (Recommended for ports 465 and 587)' : 'Unencrypted connection (Not recommended for production)'}
              </div>
            </div>
            <Switch
              checked={smtpConfig.secure}
              onCheckedChange={(checked) => updateSMTP('secure', checked)}
            />
          </div>

          <div>
            <Label htmlFor="smtp-username" className="text-sm font-medium dark:text-neutral-200">Username / Email</Label>
            <Input 
              id="smtp-username"
              type="text"
              value={smtpConfig.username}
              onChange={(e) => updateSMTP('username', e.target.value)}
              className="rounded-lg mt-1.5 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
              placeholder="your-email@example.com"
            />
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5">SMTP authentication username (usually your email address)</p>
          </div>

          <div>
            <Label htmlFor="smtp-password" className="text-sm font-medium dark:text-neutral-200">Password / App Password</Label>
            <div className="relative mt-1.5">
              <Input 
                id="smtp-password"
                type={showPassword ? "text" : "password"}
                value={smtpConfig.password}
                onChange={(e) => updateSMTP('password', e.target.value)}
                className="rounded-lg pr-10 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400"
              >
                {showPassword ? <VisibilityOffRoundedIcon fontSize="small" /> : <VisibilityRoundedIcon fontSize="small" />}
              </button>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5">
              For Gmail/Google Workspace, use an <a href="https://support.google.com/accounts/answer/185833" target="_blank" rel="noopener noreferrer" className="underline dark:text-neutral-100">App Password</a>
            </p>
          </div>
        </div>

        <Separator className="my-4 dark:bg-neutral-700" />

        {/* Sender Information */}
        <div className="space-y-4">
          <div className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Sender Information</div>
          
          <div>
            <Label htmlFor="from-email" className="text-sm font-medium dark:text-neutral-200">From Email Address</Label>
            <Input 
              id="from-email"
              type="email"
              value={smtpConfig.fromEmail}
              onChange={(e) => updateSMTP('fromEmail', e.target.value)}
              className="rounded-lg mt-1.5 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
              placeholder="noreply@yourdomain.com"
            />
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5">This email address will appear as the sender for all system emails</p>
          </div>

          <div>
            <Label htmlFor="from-name" className="text-sm font-medium dark:text-neutral-200">From Name</Label>
            <Input 
              id="from-name"
              type="text"
              value={smtpConfig.fromName}
              onChange={(e) => updateSMTP('fromName', e.target.value)}
              className="rounded-lg mt-1.5 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
              placeholder="FleetStack"
            />
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5">Display name that will appear alongside the email address</p>
          </div>

          <div>
            <Label htmlFor="reply-to-email" className="text-sm font-medium dark:text-neutral-200">Reply-To Email (Optional)</Label>
            <Input 
              id="reply-to-email"
              type="email"
              value={smtpConfig.replyToEmail || ''}
              onChange={(e) => updateSMTP('replyToEmail', e.target.value)}
              className="rounded-lg mt-1.5 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
              placeholder="support@yourdomain.com"
            />
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5">Email address where replies should be sent (if different from sender)</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuperAdminSMTPSettings;
