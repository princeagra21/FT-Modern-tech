import React from 'react'
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Input } from '@/components/ui/input';
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import { Button } from "@/components/ui/button";
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

const WhatsAppConfigComponent = () => {
    const [configs, setConfigs] = React.useState<APIConfigs>(initialConfigs);
      const [showWhatsAppToken, setShowWhatsAppToken] = React.useState(false);

     const updateWhatsApp = (field: keyof WhatsAppConfig, value: any) => {
        setConfigs(prev => ({
          ...prev,
          whatsapp: { ...prev.whatsapp, [field]: value }
        }));
      };

       const testConnection = (service: string) => {
    console.log(`Testing ${service} connection...`);
    alert(`Testing ${service} connection. Check console for results.`);
  };

     
  return (
     <div className="rounded-2xl border border-border bg-card p-5 dark:bg-foreground/5">
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      <WhatsAppIcon className="text-muted" fontSize="small" />
      <div className="text-sm font-medium  text-foreground">
        WhatsApp Messaging
      </div>
      {configs.whatsapp.enabled && (
        <Badge className="bg-primary typo-p12n text-white">Active</Badge>
      )}
    </div>
    <Switch
      checked={configs.whatsapp.enabled}
      onCheckedChange={(checked) => updateWhatsApp("enabled", checked)}
    />
  </div>

  {configs.whatsapp.enabled && (
    <>
      <Alert className="mb-4 border-border dark:bg-background">
        <InfoRoundedIcon className="h-4 w-4 text-foreground" />
        <AlertDescription className="typo-subtitle">
          <div className="font-semibold mb-1">
            Configure Your WhatsApp Provider
          </div>
          <div>
            Select a provider, enter credentials, and activate it to start
            sending WhatsApp messages.
          </div>
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {/* Provider Selection Dropdown */}
        <div>
          <Label
            htmlFor="whatsapp-provider"
            className="typo-p500
          >
            Select Provider
          </Label>
          <Select
            value={configs.whatsapp.provider}
            onValueChange={(value: any) => updateWhatsApp("provider", value)}
          >
            <SelectTrigger className="rounded-lg mt-1.5 border-border bg-card text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border text-popover-foreground">
              <SelectItem value="twilio">Twilio</SelectItem>
              <SelectItem value="whatsapp-business-api">
                WhatsApp Business API (Meta)
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="typo-subtitle mt-1.5">
            Selected:{" "}
            <strong className="text-foreground">
              {configs.whatsapp.provider === "twilio"
                ? "Twilio"
                : "WhatsApp Business API (Meta)"}
            </strong>
          </p>
        </div>

        {/* Activate Provider Toggle */}
        <div className="p-4 dark:bg-background border border-border rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="typo-p500>
                Activate Provider
              </div>
              <div className="typo-subtitle mt-0.5">
                {configs.whatsapp.providerActive
                  ? `${
                      configs.whatsapp.provider === "twilio"
                        ? "Twilio"
                        : "WhatsApp Business API"
                    } is currently active and in use`
                  : "Activate this provider to start sending WhatsApp messages"}
              </div>
            </div>
            <Switch
              checked={configs.whatsapp.providerActive}
              onCheckedChange={(checked) =>
                updateWhatsApp("providerActive", checked)
              }
            />
          </div>
          {configs.whatsapp.providerActive && (
            <div className="mt-3 flex items-center gap-2 text-xs">
              <Badge className="bg-primary text-white">
                ACTIVE
              </Badge>
              <span className="text-muted">
                This provider is now handling all WhatsApp messaging
              </span>
            </div>
          )}
        </div>

        {/* Provider Setup Links */}
        <div className="p-3 dark:bg-background border border-border rounded-lg">
          <div className="typo-h6 mb-2 text-foreground">
            Provider Documentation & Setup
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <a
              href="https://www.twilio.com/console"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-foreground underline-offset-2 hover:underline"
            >
              → Twilio Console
            </a>
            <a
              href="https://business.facebook.com/wa/manage/home"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-foreground underline-offset-2 hover:underline"
            >
              → Meta Business Manager
            </a>
          </div>
        </div>
      </div>

      <Separator className="my-4 bg-border" />

      <div className="space-y-4">
        {/* Twilio Fields */}
        {configs.whatsapp.provider === "twilio" && (
          <>
            <div>
              <Label
                htmlFor="whatsapp-accountSid"
                className="text-sm text-foreground"
              >
                Account SID
              </Label>
              <Input
                id="whatsapp-accountSid"
                type="text"
                value={configs.whatsapp.accountSid || ""}
                onChange={(e) => updateWhatsApp("accountSid", e.target.value)}
                className="rounded-lg mt-1.5 border-border  text-foreground placeholder:text-muted"
                placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              />
            </div>

            <div>
              <Label
                htmlFor="whatsapp-authToken"
                className="text-sm text-foreground"
              >
                Auth Token
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="whatsapp-authToken"
                  type={showWhatsAppToken ? "text" : "password"}
                  value={configs.whatsapp.authToken || ""}
                  onChange={(e) => updateWhatsApp("authToken", e.target.value)}
                  className="rounded-lg pr-10 border-border  text-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowWhatsAppToken(!showWhatsAppToken)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted"
                >
                  {showWhatsAppToken ? (
                    <VisibilityOffRoundedIcon fontSize="small" />
                  ) : (
                    <VisibilityRoundedIcon fontSize="small" />
                  )}
                </button>
              </div>
            </div>
          </>
        )}

        {/* WhatsApp Business API Fields */}
        {configs.whatsapp.provider === "whatsapp-business-api" && (
          <>
            <div>
              <Label
                htmlFor="whatsapp-phoneNumberId"
                className="text-sm text-foreground"
              >
                Phone Number ID
              </Label>
              <Input
                id="whatsapp-phoneNumberId"
                type="text"
                value={configs.whatsapp.phoneNumberId || ""}
                onChange={(e) =>
                  updateWhatsApp("phoneNumberId", e.target.value)
                }
                className="rounded-lg mt-1.5 border-border bg-card text-foreground placeholder:text-muted"
                placeholder="123456789012345"
              />
            </div>

            <div>
              <Label
                htmlFor="whatsapp-accessToken"
                className="text-sm text-foreground"
              >
                Access Token
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="whatsapp-accessToken"
                  type={showWhatsAppToken ? "text" : "password"}
                  value={configs.whatsapp.accessToken || ""}
                  onChange={(e) =>
                    updateWhatsApp("accessToken", e.target.value)
                  }
                  className="rounded-lg pr-10 border-border bg-card text-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowWhatsAppToken(!showWhatsAppToken)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted"
                >
                  {showWhatsAppToken ? (
                    <VisibilityOffRoundedIcon fontSize="small" />
                  ) : (
                    <VisibilityRoundedIcon fontSize="small" />
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <Button
        variant="outline"
        className="rounded-lg mt-4 border-border text-foreground hover:dark:bg-foreground/5"
        onClick={() => testConnection("WhatsApp")}
      >
        <CheckCircleRoundedIcon fontSize="small" className="mr-2" />
        Test WhatsApp Connection
      </Button>
    </>
  )}
</div>

  )
}

export default WhatsAppConfigComponent