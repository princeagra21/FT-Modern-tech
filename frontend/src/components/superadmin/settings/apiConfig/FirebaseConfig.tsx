import React from 'react'
import FireplaceRoundedIcon from "@mui/icons-material/FireplaceRounded";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import { Label } from "@/components/ui/label";
import { Input } from '@/components/ui/input';
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import { Button } from '@/components/ui/button';
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

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

  

const FirebaseConfigComponent = () => {
    const [configs, setConfigs] = React.useState<APIConfigs>(initialConfigs);
     const [showFirebaseKey, setShowFirebaseKey] = React.useState(false);

      const updateFirebase = (field: keyof FirebaseConfig, value: any) => {
        setConfigs(prev => ({
          ...prev,
          firebase: { ...prev.firebase, [field]: value }
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
      <FireplaceRoundedIcon className="text-muted" fontSize="small" />
      <div className="text-sm font-medium  text-foreground">
        Firebase Configuration
      </div>
      {configs.firebase.enabled && (
        <Badge className="bg-primary typo-p12n text-white">Active</Badge>
      )}
    </div>
    <Switch
      checked={configs.firebase.enabled}
      onCheckedChange={(checked) => updateFirebase('enabled', checked)}
    />
  </div>

  {configs.firebase.enabled && (
    <>
      <Alert className="mb-4 border-border dark:bg-background">
        <InfoRoundedIcon className="h-4 w-4 text-foreground" />
        <AlertDescription className="typo-subtitle">
          <strong>Setup Instructions:</strong> Go to{" "}
          <a
            href="https://console.firebase.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-foreground"
          >
            Firebase Console
          </a>{" "}
          → Project Settings → General → Your apps → SDK setup and configuration
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firebase-apiKey" className="text-sm text-foreground">
            API Key
          </Label>
          <div className="relative mt-1.5">
            <Input
              id="firebase-apiKey"
              type={showFirebaseKey ? "text" : "password"}
              value={configs.firebase.apiKey}
              onChange={(e) => updateFirebase("apiKey", e.target.value)}
              className="rounded-lg pr-10 border-border bg-background text-foreground"
            />
            <button
              type="button"
              onClick={() => setShowFirebaseKey(!showFirebaseKey)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white"
            >
              {showFirebaseKey ? (
                <VisibilityOffRoundedIcon fontSize="small" />
              ) : (
                <VisibilityRoundedIcon fontSize="small" />
              )}
            </button>
          </div>
        </div>

        <div>
          <Label htmlFor="firebase-authDomain" className="text-sm text-foreground">
            Auth Domain
          </Label>
          <Input
            id="firebase-authDomain"
            type="text"
            value={configs.firebase.authDomain}
            onChange={(e) => updateFirebase("authDomain", e.target.value)}
            className="rounded-lg mt-1.5 border-border bg-background text-foreground"
          />
        </div>

        <div>
          <Label htmlFor="firebase-projectId" className="text-sm text-foreground">
            Project ID
          </Label>
          <Input
            id="firebase-projectId"
            type="text"
            value={configs.firebase.projectId}
            onChange={(e) => updateFirebase("projectId", e.target.value)}
            className="rounded-lg mt-1.5 border-border bg-background text-foreground"
          />
        </div>

        <div>
          <Label htmlFor="firebase-storageBucket" className="text-sm text-foreground">
            Storage Bucket
          </Label>
          <Input
            id="firebase-storageBucket"
            type="text"
            value={configs.firebase.storageBucket}
            onChange={(e) => updateFirebase("storageBucket", e.target.value)}
            className="rounded-lg mt-1.5 border-border bg-background text-foreground"
          />
        </div>

        <div>
          <Label htmlFor="firebase-messagingSenderId" className="text-sm text-foreground">
            Messaging Sender ID
          </Label>
          <Input
            id="firebase-messagingSenderId"
            type="text"
            value={configs.firebase.messagingSenderId}
            onChange={(e) => updateFirebase("messagingSenderId", e.target.value)}
            className="rounded-lg mt-1.5 border-border bg-background text-foreground"
          />
        </div>

        <div>
          <Label htmlFor="firebase-appId" className="text-sm text-foreground">
            App ID
          </Label>
          <Input
            id="firebase-appId"
            type="text"
            value={configs.firebase.appId}
            onChange={(e) => updateFirebase("appId", e.target.value)}
            className="rounded-lg mt-1.5 border-border bg-background text-foreground"
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="firebase-measurementId" className="text-sm text-foreground">
            Measurement ID (Optional - for Analytics)
          </Label>
          <Input
            id="firebase-measurementId"
            type="text"
            value={configs.firebase.measurementId || ""}
            onChange={(e) => updateFirebase("measurementId", e.target.value)}
            className="rounded-lg mt-1.5 border-border bg-background text-foreground placeholder:text-white"
            placeholder="G-XXXXXXXXXX"
          />
        </div>
      </div>

      <Button
        variant="outline"
        className="rounded-lg mt-4 border-border text-foreground hover:bg-foreground/5"
        onClick={() => testConnection("Firebase")}
      >
        <CheckCircleRoundedIcon fontSize="small" className="mr-2" />
        Test Connection
      </Button>
    </>
  )}
</div>

  )
}

export default FirebaseConfigComponent