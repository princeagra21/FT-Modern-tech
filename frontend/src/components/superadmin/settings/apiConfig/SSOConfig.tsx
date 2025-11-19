import React from 'react'
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import { Badge } from "@/components/ui/badge";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from '@/components/ui/input';
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import { Switch } from "@/components/ui/switch";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
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


const SSOConfigComponent = () => {
     const [configs, setConfigs] = React.useState<APIConfigs>(initialConfigs);
       const [showGoogleSecret, setShowGoogleSecret] = React.useState(false);

     const updateSSO = (field: keyof SSOConfig, value: any) => {
         setConfigs(prev => ({
           ...prev,
           sso: { ...prev.sso, [field]: value }
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
      <LoginRoundedIcon className="text-muted-foreground" fontSize="small" />
      <div className="text-sm font-medium  text-foreground">
        SSO - Google OAuth 2.0
      </div>
      {configs.sso.enabled && (
        <Badge className="bg-primary typo-p12n text-white">Active</Badge>
      )}
    </div>
    <Switch
      checked={configs.sso.enabled}
      onCheckedChange={(checked) => updateSSO("enabled", checked)}
    />
  </div>

  {configs.sso.enabled && (
    <>
      <Alert className="mb-4 border-border dark:bg-background">
        <InfoRoundedIcon className="h-4 w-4 text-foreground" />
        <AlertDescription className="typo-subtitle space-y-2">
          <div>
            <strong>Setup Instructions:</strong>
          </div>
          <ol className="list-decimal list-inside ml-2 space-y-1">
            <li>
              Go to{" "}
              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-foreground"
              >
                Google Cloud Console
              </a>
            </li>
            <li>Create OAuth 2.0 Client ID (Application type: Web application)</li>
            <li>
              Add authorized redirect URI:{" "}
              <code className="bg-background text-foreground px-1 py-0.5 rounded text-[10px]">
                {configs.sso.redirectUri}
              </code>
            </li>
            <li>Copy Client ID and Client Secret</li>
          </ol>
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div>
          <Label htmlFor="sso-clientId" className="text-sm text-foreground">
            Google Client ID
          </Label>
          <Input
            id="sso-clientId"
            type="text"
            value={configs.sso.googleClientId}
            onChange={(e) => updateSSO("googleClientId", e.target.value)}
            className="rounded-lg mt-1.5 border-border bg-background text-foreground placeholder:text-muted-foreground"
            placeholder="123456789012-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com"
          />
        </div>

        <div>
          <Label htmlFor="sso-clientSecret" className="text-sm text-foreground">
            Google Client Secret
          </Label>
          <div className="relative mt-1.5">
            <Input
              id="sso-clientSecret"
              type={showGoogleSecret ? "text" : "password"}
              value={configs.sso.googleClientSecret}
              onChange={(e) => updateSSO("googleClientSecret", e.target.value)}
              className="rounded-lg pr-10 border-border bg-background text-foreground placeholder:text-muted-foreground"
              placeholder="GOCSPX-xxxxxxxxxxxxxxxxxxxx"
            />
            <button
              type="button"
              onClick={() => setShowGoogleSecret(!showGoogleSecret)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showGoogleSecret ? (
                <VisibilityOffRoundedIcon fontSize="small" />
              ) : (
                <VisibilityRoundedIcon fontSize="small" />
              )}
            </button>
          </div>
        </div>

        <div>
          <Label htmlFor="sso-redirectUri" className="text-sm text-foreground">
            Redirect URI
          </Label>
          <div className="flex gap-2 mt-1.5">
            <Input
              id="sso-redirectUri"
              type="text"
              value={configs.sso.redirectUri}
              onChange={(e) => updateSSO("redirectUri", e.target.value)}
              className="rounded-lg border-border bg-background text-foreground placeholder:text-muted-foreground"
              placeholder="https://yourdomain.com/auth/google/callback"
            />
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg border-border text-foreground hover:bg-muted"
              onClick={() => navigator.clipboard.writeText(configs.sso.redirectUri)}
            >
              Copy
            </Button>
          </div>
          <p className="typo-subtitle mt-1">
            Add this URL to authorized redirect URIs in Google Console
          </p>
        </div>
      </div>

      <Button
        variant="outline"
        className="rounded-lg mt-4 border-border text-foreground hover:bg-foreground/5"
        onClick={() => testConnection("Google SSO")}
      >
        <CheckCircleRoundedIcon fontSize="small" className="mr-2" />
        Test SSO Connection
      </Button>
    </>
  )}
</div>

  )
}

export default SSOConfigComponent