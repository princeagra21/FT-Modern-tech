import React from 'react'
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import { Label } from "@/components/ui/label";
import { Input } from '@/components/ui/input';
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

// Types
export type FirebaseConfig = {
  enabled: boolean;
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
};

export type ReverseGeocodingConfig = {
  enabled: boolean;
  provider: 'google' | 'here' | 'tomtom' | 'mapbox' | 'locationiq' | 'osm';
  providerActive: boolean;
  
  // Google Maps - Required fields only
  googleApiKey?: string;
  
  // HERE Maps - Required fields only
  hereApiKey?: string;
  
  // TomTom - Required fields only
  tomtomApiKey?: string;
  
  // Mapbox - Required fields only
  mapboxAccessToken?: string;
  
  // LocationIQ - Required fields only
  locationiqApiKey?: string;
  
  // OSM - Required fields only
  osmUserAgent?: string; // Required by OSM policy
};

export type SSOConfig = {
  enabled: boolean;
  googleClientId: string;
  googleClientSecret: string;
  redirectUri: string;
};

export type WhatsAppConfig = {
  enabled: boolean;
  provider: 'twilio' | 'whatsapp-business-api';
  providerActive: boolean; // Activate selected provider
  accountSid?: string; // Twilio
  authToken?: string; // Twilio
  phoneNumberId?: string; // WhatsApp Business API
  accessToken?: string; // WhatsApp Business API
};

export type OpenAIConfig = {
  enabled: boolean;
  apiKey: string;
  organizationId?: string;
  model: 'gpt-4' | 'gpt-4-turbo' | 'gpt-3.5-turbo';
  maxTokens: number;
};

export type APIConfigs = {
  firebase: FirebaseConfig;
  reverseGeocoding: ReverseGeocodingConfig;
  sso: SSOConfig;
  whatsapp: WhatsAppConfig;
  openai: OpenAIConfig;
  updatedAt: string;
};


// Mock initial data
const initialConfigs: APIConfigs = {
  firebase: {
    enabled: true,
    apiKey: "AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    authDomain: "fleetstack-project.firebaseapp.com",
    projectId: "fleetstack-project",
    storageBucket: "fleetstack-project.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890",
    measurementId: "G-XXXXXXXXXX",
  },
  reverseGeocoding: {
    enabled: true,
    provider: 'google',
    providerActive: true,
    googleApiKey: "AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    hereApiKey: "",
    tomtomApiKey: "",
    mapboxAccessToken: "",
    locationiqApiKey: "",
    osmUserAgent: "FleetStack/1.0",
  },
  sso: {
    enabled: true,
    googleClientId: "123456789012-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com",
    googleClientSecret: "GOCSPX-xxxxxxxxxxxxxxxxxxxx",
    redirectUri: "https://app.fleetstack.com/auth/google/callback",
  },
  whatsapp: {
    enabled: true,
    provider: 'twilio',
    providerActive: true,
    accountSid: "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    authToken: "your_auth_token_here",
    phoneNumberId: "",
    accessToken: "",
  },
  openai: {
    enabled: true,
    apiKey: "sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    organizationId: "org-xxxxxxxxxxxxxxxx",
    model: 'gpt-4-turbo',
    maxTokens: 2048,
  },
  updatedAt: "2025-10-18T09:15:00Z",
};

const OpenAiIntegration = () => {
    const [configs, setConfigs] = React.useState<APIConfigs>(initialConfigs);
      const [showOpenAIKey, setShowOpenAIKey] = React.useState(false);

       const updateOpenAI = (field: keyof OpenAIConfig, value: any) => {
          setConfigs(prev => ({
            ...prev,
            openai: { ...prev.openai, [field]: value }
          }));
        };

          const testConnection = (service: string) => {
    console.log(`Testing ${service} connection...`);
    alert(`Testing ${service} connection. Check console for results.`);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 dark:bg-foreground/5">
  <div className="flex items-center justify-between mb-4 ">
    <div className="flex items-center gap-2">
      <SmartToyRoundedIcon className="text-muted" fontSize="small" />
      <div className="text-sm font-medium  text-foreground">OpenAI Integration</div>
      {configs.openai.enabled && (
        <Badge className="bg-primary typo-p12n text-white">Active</Badge>
      )}
    </div>
    <Switch
      checked={configs.openai.enabled}
      onCheckedChange={(checked) => updateOpenAI('enabled', checked)}
    />
  </div>

  {configs.openai.enabled && (
    <>
      <Alert className="mb-4 border-border dark:bg-background">
        <InfoRoundedIcon className="h-4 w-4 text-foreground" />
        <AlertDescription className="typo-subtitle space-y-2">
          <div><strong>Setup Instructions:</strong></div>
          <ol className="list-decimal list-inside ml-2 space-y-1">
            <li>
              Go to{" "}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-foreground hover:text-primary"
              >
                OpenAI API Keys
              </a>
            </li>
            <li>Create new secret key (starts with sk-proj-...)</li>
            <li>
              Optional: Get Organization ID from{" "}
              <a
                href="https://platform.openai.com/account/organization"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-foreground hover:text-primary"
              >
                Settings
              </a>
            </li>
            <li>
              Set usage limits in{" "}
              <a
                href="https://platform.openai.com/account/billing/limits"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-foreground hover:text-primary"
              >
                Billing
              </a>
            </li>
          </ol>
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div>
          <Label htmlFor="openai-apiKey" className="text-sm text-foreground">
            API Key
          </Label>
          <div className="relative mt-1.5">
            <Input
              id="openai-apiKey"
              type={showOpenAIKey ? "text" : "password"}
              value={configs.openai.apiKey}
              onChange={(e) => updateOpenAI('apiKey', e.target.value)}
              className="rounded-lg pr-10 border-border bg-background text-foreground placeholder:text-muted"
              placeholder="sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            />
            <button
              type="button"
              onClick={() => setShowOpenAIKey(!showOpenAIKey)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted"
            >
              {showOpenAIKey ? (
                <VisibilityOffRoundedIcon fontSize="small" />
              ) : (
                <VisibilityRoundedIcon fontSize="small" />
              )}
            </button>
          </div>
        </div>

        <div>
          <Label htmlFor="openai-organizationId" className="text-sm text-foreground">
            Organization ID (Optional)
          </Label>
          <Input
            id="openai-organizationId"
            type="text"
            value={configs.openai.organizationId || ''}
            onChange={(e) => updateOpenAI('organizationId', e.target.value)}
            className="rounded-lg mt-1.5 border-border bg-background text-foreground placeholder:text-muted"
            placeholder="org-xxxxxxxxxxxxxxxx"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="openai-model" className="text-sm text-foreground">
              Model
            </Label>
            <Select
              value={configs.openai.model}
              onValueChange={(value: any) => updateOpenAI('model', value)}
            >
              <SelectTrigger className="rounded-lg mt-1.5 border-border bg-background text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo (Recommended)</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Cost-effective)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="openai-maxTokens" className="text-sm text-foreground">
              Max Tokens
            </Label>
            <Input
              id="openai-maxTokens"
              type="number"
              value={configs.openai.maxTokens}
              onChange={(e) => updateOpenAI('maxTokens', parseInt(e.target.value))}
              className="rounded-lg mt-1.5 border-border bg-background text-foreground"
              min="1"
              max="4096"
            />
            <p className="typo-subtitle mt-1">Range: 1–4096 tokens</p>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        className="rounded-lg mt-4 border-border text-foreground hover:bg-foreground/5"
        onClick={() => testConnection('OpenAI')}
      >
        <CheckCircleRoundedIcon fontSize="small" className="mr-2" />
        Test OpenAI Connection
      </Button>
    </>
  )}
</div>

  )
}

export default OpenAiIntegration