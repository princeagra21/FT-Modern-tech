import React from "react";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import { Button } from "@/components/ui/button";
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
  provider: "google" | "here" | "tomtom" | "mapbox" | "locationiq" | "osm";
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
  provider: "twilio" | "whatsapp-business-api";
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
  model: "gpt-4" | "gpt-4-turbo" | "gpt-3.5-turbo";
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
    provider: "google",
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
    googleClientId:
      "123456789012-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com",
    googleClientSecret: "GOCSPX-xxxxxxxxxxxxxxxxxxxx",
    redirectUri: "https://app.fleetstack.com/auth/google/callback",
  },
  whatsapp: {
    enabled: true,
    provider: "twilio",
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
    model: "gpt-4-turbo",
    maxTokens: 2048,
  },
  updatedAt: "2025-10-18T09:15:00Z",
};

const ReverseCoding = () => {
  const [configs, setConfigs] = React.useState<APIConfigs>(initialConfigs);
  const [showGeocodingKey, setShowGeocodingKey] = React.useState(false);

  const updateReverseGeocoding = (
    field: keyof ReverseGeocodingConfig,
    value: any
  ) => {
    setConfigs((prev) => ({
      ...prev,
      reverseGeocoding: { ...prev.reverseGeocoding, [field]: value },
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
          <LocationOnRoundedIcon className="text-muted" fontSize="small" />
          <div className="text-sm font-medium  text-foreground">
            Reverse Geocoding Service
          </div>
          {configs.reverseGeocoding.enabled && (
            <Badge className="bg-primary typo-p12n text-white">Active</Badge>
          )}
        </div>
        <Switch
          checked={configs.reverseGeocoding.enabled}
          onCheckedChange={(checked) =>
            updateReverseGeocoding("enabled", checked)
          }
        />
      </div>

      {configs.reverseGeocoding.enabled && (
        <>
          <Alert className="mb-4 border-border dark:bg-background ">
            <InfoRoundedIcon className="h-4 w-4 text-muted" />
            <AlertDescription className="typo-subtitle">
              <div className="font-semibold mb-1">
                Configure Your Geocoding Provider
              </div>
              <div>
                Select a provider, enter credentials, and activate it to start
                using reverse geocoding services.
              </div>
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            {/* Provider Selection Dropdown */}
            <div>
              <Label
                htmlFor="geocoding-provider"
                className="typo-p500
              >
                Select Provider
              </Label>
              <Select
                value={configs.reverseGeocoding.provider}
                onValueChange={(value: any) =>
                  updateReverseGeocoding("provider", value)
                }
              >
                <SelectTrigger className="rounded-lg mt-1.5 border-border bg-background text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border text-foreground">
                  <SelectItem value="google">
                    Google Maps (Paid - $5/1000 req)
                  </SelectItem>
                  <SelectItem value="here">
                    HERE Maps (Free - 250k/month)
                  </SelectItem>
                  <SelectItem value="tomtom">
                    TomTom (Free - 2500/day)
                  </SelectItem>
                  <SelectItem value="mapbox">
                    Mapbox (Free - 100k/month)
                  </SelectItem>
                  <SelectItem value="locationiq">
                    LocationIQ (Free - 5000/day)
                  </SelectItem>
                  <SelectItem value="osm">
                    OSM Nominatim (Free - No key)
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="typo-subtitle mt-1.5">
                Selected:{" "}
                <strong className="text-foreground">
                  {configs.reverseGeocoding.provider === "google"
                    ? "Google Maps"
                    : configs.reverseGeocoding.provider === "here"
                    ? "HERE Maps"
                    : configs.reverseGeocoding.provider === "tomtom"
                    ? "TomTom"
                    : configs.reverseGeocoding.provider === "mapbox"
                    ? "Mapbox"
                    : configs.reverseGeocoding.provider === "locationiq"
                    ? "LocationIQ"
                    : "OSM Nominatim"}
                </strong>
              </p>
            </div>

            {/* Activate Provider Toggle */}
            <div className="p-4  border border-border rounded-xl dark:bg-background">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="typo-p500>
                    Activate Provider
                  </div>
                  <div className="typo-subtitle mt-0.5">
                    {configs.reverseGeocoding.providerActive
                      ? `${configs.reverseGeocoding.provider} is currently active and in use`
                      : "Activate this provider to start using it for reverse geocoding"}
                  </div>
                </div>
                <Switch
                  checked={configs.reverseGeocoding.providerActive}
                  onCheckedChange={(checked) =>
                    updateReverseGeocoding("providerActive", checked)
                  }
                />
              </div>
              {configs.reverseGeocoding.providerActive && (
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <Badge className="bg-primary text-white">ACTIVE</Badge>
                  <span className="text-muted">
                    This provider is now handling all reverse geocoding requests
                  </span>
                </div>
              )}
            </div>

            {/* Provider Setup Links */}
            <div className="p-3  border border-border rounded-lg dark:bg-background">
              <div className="typo-h6 mb-2 text-foreground">
                Provider Documentation & Setup
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                {[
                  [
                    "https://console.cloud.google.com/apis/credentials",
                    "→ Google Console",
                  ],
                  ["https://developer.here.com/sign-up", "→ HERE Developer"],
                  [
                    "https://developer.tomtom.com/user/register",
                    "→ TomTom Register",
                  ],
                  [
                    "https://account.mapbox.com/access-tokens",
                    "→ Mapbox Tokens",
                  ],
                  ["https://locationiq.com/register", "→ LocationIQ Register"],
                  [
                    "https://nominatim.org/release-docs/develop/api/Reverse/",
                    "→ OSM Docs",
                  ],
                ].map(([url, label]) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-foreground underline-offset-2 hover:underline"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <Separator className="my-4 bg-border" />

          {configs.reverseGeocoding.provider === "google" && (
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="google-apiKey"
                  className="typo-p500
                >
                  Google API Key
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="google-apiKey"
                    type={showGeocodingKey ? "text" : "password"}
                    value={configs.reverseGeocoding.googleApiKey || ""}
                    onChange={(e) =>
                      updateReverseGeocoding("googleApiKey", e.target.value)
                    }
                    className="rounded-lg pr-10 border-border bg-background text-foreground placeholder:text-muted"
                    placeholder="AIzaSy..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowGeocodingKey(!showGeocodingKey)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted"
                  >
                    {showGeocodingKey ? (
                      <VisibilityOffRoundedIcon fontSize="small" />
                    ) : (
                      <VisibilityRoundedIcon fontSize="small" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* HERE Maps Configuration */}
          {configs.reverseGeocoding.provider === "here" && (
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="here-apiKey"
                  className="typo-p500
                >
                  HERE API Key
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="here-apiKey"
                    type={showGeocodingKey ? "text" : "password"}
                    value={configs.reverseGeocoding.hereApiKey || ""}
                    onChange={(e) =>
                      updateReverseGeocoding("hereApiKey", e.target.value)
                    }
                    className="rounded-lg pr-10 border-border bg-background text-foreground placeholder:text-muted"
                    placeholder="YOUR-HERE-API-KEY"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGeocodingKey(!showGeocodingKey)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted"
                  >
                    {showGeocodingKey ? (
                      <VisibilityOffRoundedIcon fontSize="small" />
                    ) : (
                      <VisibilityRoundedIcon fontSize="small" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TomTom Configuration */}
          {configs.reverseGeocoding.provider === "tomtom" && (
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="tomtom-apiKey"
                  className="typo-p500
                >
                  TomTom API Key
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="tomtom-apiKey"
                    type={showGeocodingKey ? "text" : "password"}
                    value={configs.reverseGeocoding.tomtomApiKey || ""}
                    onChange={(e) =>
                      updateReverseGeocoding("tomtomApiKey", e.target.value)
                    }
                    className="rounded-lg pr-10 border-border bg-background text-foreground placeholder:text-muted"
                    placeholder="YOUR-TOMTOM-API-KEY"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGeocodingKey(!showGeocodingKey)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted"
                  >
                    {showGeocodingKey ? (
                      <VisibilityOffRoundedIcon fontSize="small" />
                    ) : (
                      <VisibilityRoundedIcon fontSize="small" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mapbox Configuration */}
          {configs.reverseGeocoding.provider === "mapbox" && (
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="mapbox-accessToken"
                  className="typo-p500
                >
                  Mapbox Access Token
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="mapbox-accessToken"
                    type={showGeocodingKey ? "text" : "password"}
                    value={configs.reverseGeocoding.mapboxAccessToken || ""}
                    onChange={(e) =>
                      updateReverseGeocoding(
                        "mapboxAccessToken",
                        e.target.value
                      )
                    }
                    className="rounded-lg pr-10 border-border bg-background text-foreground placeholder:text-muted"
                    placeholder="pk.eyJ1..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowGeocodingKey(!showGeocodingKey)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted"
                  >
                    {showGeocodingKey ? (
                      <VisibilityOffRoundedIcon fontSize="small" />
                    ) : (
                      <VisibilityRoundedIcon fontSize="small" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* LocationIQ Configuration */}
          {configs.reverseGeocoding.provider === "locationiq" && (
            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="locationiq-apiKey"
                  className="typo-p500
                >
                  LocationIQ API Key
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="locationiq-apiKey"
                    type={showGeocodingKey ? "text" : "password"}
                    value={configs.reverseGeocoding.locationiqApiKey || ""}
                    onChange={(e) =>
                      updateReverseGeocoding("locationiqApiKey", e.target.value)
                    }
                    className="rounded-lg pr-10 border-border bg-background text-foreground placeholder:text-muted"
                    placeholder="pk.abc123..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowGeocodingKey(!showGeocodingKey)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted"
                  >
                    {showGeocodingKey ? (
                      <VisibilityOffRoundedIcon fontSize="small" />
                    ) : (
                      <VisibilityRoundedIcon fontSize="small" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* OSM Configuration */}
          {configs.reverseGeocoding.provider === "osm" && (
            <div className="space-y-4">
              <Alert className="border-border bg-background">
                <InfoRoundedIcon className="h-4 w-4 text-foreground" />
                <AlertDescription className="typo-p12n">
                  <div className="font-semibold mb-1">
                    OpenStreetMap Nominatim - Free Service
                  </div>
                  <div>No API key required. Only User-Agent string needed.</div>
                </AlertDescription>
              </Alert>
              <div>
                <Label
                  htmlFor="osm-userAgent"
                  className="typo-p500
                >
                  User Agent String
                </Label>
                <Input
                  id="osm-userAgent"
                  type="text"
                  value={configs.reverseGeocoding.osmUserAgent || ""}
                  onChange={(e) =>
                    updateReverseGeocoding("osmUserAgent", e.target.value)
                  }
                  className="rounded-lg mt-1.5 border-border bg-background text-foreground placeholder:text-muted"
                  placeholder="YourApp/1.0"
                />
                <p className="typo-subtitle mt-1">
                  Required by OSM usage policy
                </p>
              </div>
            </div>
          )}

          {/* Separator */}
          <Separator className="my-4 bg-border" />

          {/* API Endpoint Alerts (Example: Google) */}
          {configs.reverseGeocoding.provider === "google" && (
            <Alert className="border-border bg-background">
              <InfoRoundedIcon className="h-4 w-4 text-foreground" />
              <AlertDescription className="typo-p12n">
                <div className="font-semibold mb-1">
                  Google Maps Geocoding API Endpoint
                </div>
                <code className="bg-background text-foreground px-2 py-1 rounded text-[10px] block">
                  https://maps.googleapis.com/maps/api/geocode/json?latlng=LAT,LNG&key=API_KEY
                </code>
              </AlertDescription>
            </Alert>
          )}

          {/* Example Test Button */}
          <Button
            variant="outline"
            className="rounded-lg mt-4 border-border text-foreground hover:"
            onClick={() => testConnection("Reverse Geocoding")}
          >
            <CheckCircleRoundedIcon fontSize="small" className="mr-2" />
            Test Geocoding
          </Button>
        </>
      )}
    </div>
  );
};

export default ReverseCoding;
