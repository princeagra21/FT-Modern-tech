import React from 'react'
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Material Design Icons (MUI)
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import FireplaceRoundedIcon from "@mui/icons-material/FireplaceRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import LinkRoundedIcon from "@mui/icons-material/LinkRounded";
import ReverseCoding from './settings/apiConfig/ReverseCoding';
import SSOConfigComponent,  { SSOConfig } from './settings/apiConfig/SSOConfig';
import OpenAiIntegration from './settings/apiConfig/OpenAiIntegration';
import DocumentationLink from './settings/apiConfig/DocumentationLink';
import FirebaseConfigComponent, { FirebaseConfig } from './settings/apiConfig/FirebaseConfig';
import WhatsAppConfigComponent, { WhatsAppConfig } from './settings/apiConfig/FirebaseConfig';


// Types


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


function SuperAdminAPIConfig() {
  const [loading, setLoading] = React.useState(false);
  const [configs, setConfigs] = React.useState<APIConfigs>(initialConfigs);
  
  // Visibility states for sensitive fields
  const [showFirebaseKey, setShowFirebaseKey] = React.useState(false);
  const [showGeocodingKey, setShowGeocodingKey] = React.useState(false);
  const [showGoogleSecret, setShowGoogleSecret] = React.useState(false);
  const [showWhatsAppToken, setShowWhatsAppToken] = React.useState(false);
  const [showOpenAIKey, setShowOpenAIKey] = React.useState(false);

  // Update handlers
  const updateFirebase = (field: keyof FirebaseConfig, value: any) => {
    setConfigs(prev => ({
      ...prev,
      firebase: { ...prev.firebase, [field]: value }
    }));
  };

  const updateReverseGeocoding = (field: keyof ReverseGeocodingConfig, value: any) => {
    setConfigs(prev => ({
      ...prev,
      reverseGeocoding: { ...prev.reverseGeocoding, [field]: value }
    }));
  };

  const updateSSO = (field: keyof SSOConfig, value: any) => {
    setConfigs(prev => ({
      ...prev,
      sso: { ...prev.sso, [field]: value }
    }));
  };

  const updateWhatsApp = (field: keyof WhatsAppConfig, value: any) => {
    setConfigs(prev => ({
      ...prev,
      whatsapp: { ...prev.whatsapp, [field]: value }
    }));
  };

  const updateOpenAI = (field: keyof OpenAIConfig, value: any) => {
    setConfigs(prev => ({
      ...prev,
      openai: { ...prev.openai, [field]: value }
    }));
  };

  // Test connection handlers
  const testConnection = (service: string) => {
    console.log(`Testing ${service} connection...`);
    alert(`Testing ${service} connection. Check console for results.`);
  };

  // Save handler
  const handleSave = async () => {
    setLoading(true);
    console.log("Saving API configurations...", configs);
    
    // TODO: Implement API call to save configurations
    setTimeout(() => {
      setConfigs(prev => ({
        ...prev,
        updatedAt: new Date().toISOString(),
      }));
      setLoading(false);
      alert("API configurations saved successfully!");
    }, 1500);
  };

  if (loading) {
    return (
      <div className="p-8">
        <h2 className="typo-h1 mb-2 dark:text-neutral-100">Saving...</h2>
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-none">
     <CardHeader className="pb-2">
  <div className="flex items-start justify-between gap-4">
    <div>
      <div className="text-[11px] uppercase tracking-[0.2em] text-muted">
        API Configuration
      </div>
      <CardTitle className="typo-h1 tracking-tight text-foreground">
        Third-Party Integrations
      </CardTitle>
    </div>
    <div className="flex flex-wrap items-center gap-2">
      <Button
        className="rounded-xl bg-primary text-white "
        onClick={handleSave}
        disabled={loading}
      >
        <SaveRoundedIcon className="mr-2" fontSize="small" /> Save All Changes
      </Button>
    </div>
  </div>
</CardHeader>


      <CardContent className="pt-2 space-y-6">
        
        {/* Firebase Configuration */}
      <FirebaseConfigComponent/>

        <Separator className="dark:bg-muted" />

        {/* Reverse Geocoding Configuration */}
       <ReverseCoding/>

        <Separator className="dark:bg-muted" />

        {/* SSO (Google) Configuration */}
        <SSOConfigComponent/>

        <Separator className="dark:bg-muted" />

        {/* WhatsApp Configuration */}
        <WhatsAppConfigComponent/>

        <Separator className="dark:bg-muted" />

        {/* OpenAI Configuration */}
        <OpenAiIntegration/>

        {/* Documentation Links */}
        <DocumentationLink/>

        {/* Last Updated Info */}
        <div className="flex items-center justify-between text-xs text-muted  p-3  dark:bg-foreground/5 rounded-lg border border-border">
          <div>
            <span className="font-medium">Last Updated:</span> {new Date(configs.updatedAt).toLocaleString()}
          </div>
          <Badge variant="outline" className="text-xs border border-border text-white">
            <CheckCircleRoundedIcon fontSize="small" className="mr-1" />
            Configurations stored securely
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export default SuperAdminAPIConfig;
