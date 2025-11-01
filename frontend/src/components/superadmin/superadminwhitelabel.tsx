import React from 'react'
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Material Design Icons (MUI)
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import DnsRoundedIcon from "@mui/icons-material/DnsRounded";


export type WhiteLabelSettings = {
  baseURL: string;
  favicon: string | null;
  darkLogo: string | null;
  lightLogo: string | null;
  serverIP: string;
  updatedAt: string;
};

// Mock data
const initialSettings: WhiteLabelSettings = {
  baseURL: "app.fleetstack.com",
  favicon: "/brand/favicon.ico",
  darkLogo: "/brand/fleetstack-logo-dark.svg",
  lightLogo: "/brand/fleetstack-logo-light.svg",
  serverIP: "192.168.1.100",
  updatedAt: "2025-10-18T09:15:00Z",
};


function SuperAdminWhiteLabel() {
  const [loading, setLoading] = React.useState(false);
  const [settings, setSettings] = React.useState<WhiteLabelSettings>(initialSettings);
  const [baseURL, setBaseURL] = React.useState(initialSettings.baseURL);
  const [showDNSInfo, setShowDNSInfo] = React.useState(false);
  const [hasBaseURLChanged, setHasBaseURLChanged] = React.useState(false);
  
  // File states
  const [faviconFile, setFaviconFile] = React.useState<File | null>(null);
  const [darkLogoFile, setDarkLogoFile] = React.useState<File | null>(null);
  const [lightLogoFile, setLightLogoFile] = React.useState<File | null>(null);

  // Preview URLs
  const [faviconPreview, setFaviconPreview] = React.useState(settings.favicon);
  const [darkLogoPreview, setDarkLogoPreview] = React.useState(settings.darkLogo);
  const [lightLogoPreview, setLightLogoPreview] = React.useState(settings.lightLogo);

  // Handle BaseURL change
  const handleBaseURLChange = (value: string) => {
    setBaseURL(value);
    setHasBaseURLChanged(value !== settings.baseURL);
    if (value !== settings.baseURL && value.trim() !== "") {
      setShowDNSInfo(true);
    } else {
      setShowDNSInfo(false);
    }
  };

  // Handle file uploads
  const handleFileUpload = (
    file: File | null, 
    type: 'favicon' | 'darkLogo' | 'lightLogo'
  ) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const preview = reader.result as string;
      
      switch (type) {
        case 'favicon':
          setFaviconFile(file);
          setFaviconPreview(preview);
          break;
        case 'darkLogo':
          setDarkLogoFile(file);
          setDarkLogoPreview(preview);
          break;
        case 'lightLogo':
          setLightLogoFile(file);
          setLightLogoPreview(preview);
          break;
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle remove file
  const handleRemoveFile = (type: 'favicon' | 'darkLogo' | 'lightLogo') => {
    switch (type) {
      case 'favicon':
        setFaviconFile(null);
        setFaviconPreview(null);
        break;
      case 'darkLogo':
        setDarkLogoFile(null);
        setDarkLogoPreview(null);
        break;
      case 'lightLogo':
        setLightLogoFile(null);
        setLightLogoPreview(null);
        break;
    }
  };

  // Handle save
  const handleSave = async () => {
    setLoading(true);
    console.log("Saving white label settings...", {
      baseURL,
      faviconFile,
      darkLogoFile,
      lightLogoFile,
    });
    
    // TODO: Implement API call to save settings
    // Simulate API call
    setTimeout(() => {
      setSettings({
        ...settings,
        baseURL,
        favicon: faviconPreview,
        darkLogo: darkLogoPreview,
        lightLogo: lightLogoPreview,
        updatedAt: new Date().toISOString(),
      });
      setHasBaseURLChanged(false);
      setLoading(false);
      alert("Settings saved successfully!");
    }, 1500);
  };

  if (loading) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold tracking-tight mb-2 dark:text-neutral-100">Saving...</h2>
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">White Label</div>
            <CardTitle className="text-2xl tracking-tight dark:text-neutral-100">Branding Settings</CardTitle>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button 
              className="rounded-xl bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-neutral-100"
              onClick={handleSave}
              disabled={loading}
            >
              <SaveRoundedIcon className="mr-2" fontSize="small" /> Save Changes
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        {/* Base URL Section */}
     <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 p-5">
          <div className="flex items-center gap-2 mb-4">
            <LanguageRoundedIcon className="text-neutral-500 dark:text-neutral-400" fontSize="small" />
            <div className="text-sm font-medium tracking-tight dark:text-neutral-100">Base URL Configuration</div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="baseURL" className="text-sm font-medium dark:text-neutral-200">Base URL</Label>
              <Input 
                id="baseURL"
                type="text"
                value={baseURL}
                onChange={(e) => handleBaseURLChange(e.target.value)}
                placeholder="app.example.com"
                className="mt-1.5 rounded-lg dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
              />
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5">
                Enter your custom domain without http:// or https://
              </p>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
              <DnsRoundedIcon className="text-neutral-500 dark:text-neutral-400 mt-0.5" fontSize="small" />
              <div className="flex-1">
                <div className="text-sm font-medium mb-1 dark:text-neutral-100">Server Information</div>
                <div className="text-xs text-neutral-600 dark:text-neutral-300 space-y-1">
                  <div><span className="font-medium">Server IP:</span> <code className="bg-white dark:bg-neutral-800 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-600 dark:text-neutral-100">{settings.serverIP}</code></div>
                  <div className="text-neutral-500 dark:text-neutral-400">Use this IP address for DNS configuration</div>
                </div>
              </div>
            </div>

            {/* DNS Configuration Alert */}
            {showDNSInfo && (
              <Alert className="border-black dark:border-white bg-neutral-50 dark:bg-neutral-800">
                <InfoRoundedIcon className="h-4 w-4 dark:text-neutral-100" />
                <AlertDescription>
                  <div className="text-sm dark:text-neutral-100">
                    <div className="font-semibold mb-2 dark:text-neutral-100">DNS Configuration Required</div>
                    <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-300">
                      <p>To use your custom domain, please update the DNS records at your domain registry control panel:</p>
                      <ol className="list-decimal list-inside space-y-1 ml-2">
                        <li>Login to your domain registrar (GoDaddy, Namecheap, etc.)</li>
                        <li>Navigate to DNS Management / DNS Settings</li>
                        <li>Add or update an <strong>A Record</strong>:</li>
                      </ol>
                      <div className="bg-white dark:bg-neutral-900 p-3 rounded border border-neutral-200 dark:border-neutral-700 font-mono text-xs space-y-1 mt-2">
                        <div><span className="text-neutral-500 dark:text-neutral-400">Type:</span> <strong className="dark:text-neutral-100">A</strong></div>
                        <div><span className="text-neutral-500 dark:text-neutral-400">Host:</span> <strong className="dark:text-neutral-100">@</strong> (or subdomain name)</div>
                        <div><span className="text-neutral-500 dark:text-neutral-400">Value:</span> <strong className="dark:text-neutral-100">{settings.serverIP}</strong></div>
                        <div><span className="text-neutral-500 dark:text-neutral-400">TTL:</span> <strong className="dark:text-neutral-100">3600</strong> (or default)</div>
                      </div>
                      <p className="mt-2 text-neutral-500 dark:text-neutral-400">
                        <strong>Note:</strong> DNS changes may take 24-48 hours to propagate globally.
                      </p>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        <Separator className="my-6 dark:bg-neutral-700" />

        {/* Branding Assets Section */}
        <div className="space-y-6">
          {/* Favicon Upload */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 p-5">
            <div className="flex items-center gap-2 mb-4">
              <ImageRoundedIcon className="text-neutral-500 dark:text-neutral-400" fontSize="small" />
              <div className="text-sm font-medium tracking-tight dark:text-neutral-100">Favicon</div>
              <Badge variant="outline" className="text-xs dark:border-neutral-600 dark:text-neutral-300">16x16 or 32x32 px</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium mb-2 block dark:text-neutral-200">Upload Favicon</Label>
                <div className="border-2 border-dashed border-neutral-200 dark:border-neutral-600 rounded-lg p-6 text-center hover:border-neutral-300 dark:hover:border-neutral-500 transition-colors">
                  <input
                    type="file"
                    accept="image/x-icon,image/png"
                    onChange={(e) => handleFileUpload(e.target.files?.[0] || null, 'favicon')}
                    className="hidden"
                    id="favicon-upload"
                  />
                  <label htmlFor="favicon-upload" className="cursor-pointer">
                    <CloudUploadRoundedIcon className="mx-auto text-neutral-400 mb-2" fontSize="large" />
                    <div className="text-sm font-medium dark:text-neutral-100">Click to upload</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">ICO, PNG (max 2MB)</div>
                  </label>
                </div>
                {faviconFile && (
                  <div className="mt-3 text-xs text-neutral-600 dark:text-neutral-300">
                    <CheckCircleRoundedIcon className="text-green-600 dark:text-green-400 mr-1" fontSize="small" />
                    {faviconFile.name}
                  </div>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block dark:text-neutral-200">Preview</Label>
                <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 bg-neutral-50 dark:bg-neutral-900 flex flex-col items-center justify-center min-h-[140px]">
                  {faviconPreview ? (
                    <>
                      <img src={faviconPreview} alt="Favicon" className="h-8 w-8 object-contain mb-3" />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-lg dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-700"
                        onClick={() => handleRemoveFile('favicon')}
                      >
                        <DeleteRoundedIcon fontSize="small" className="mr-1" />
                        Remove
                      </Button>
                    </>
                  ) : (
                    <div className="text-sm text-neutral-400">No favicon uploaded</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Dark Logo Upload */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 p-5">
            <div className="flex items-center gap-2 mb-4">
              <ImageRoundedIcon className="text-neutral-500 dark:text-neutral-400" fontSize="small" />
              <div className="text-sm font-medium tracking-tight dark:text-neutral-100">Dark Logo</div>
              <Badge variant="outline" className="text-xs dark:border-neutral-600 dark:text-neutral-300">For light backgrounds</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium mb-2 block dark:text-neutral-200">Upload Dark Logo</Label>
                <div className="border-2 border-dashed border-neutral-200 dark:border-neutral-600 rounded-lg p-6 text-center hover:border-neutral-300 dark:hover:border-neutral-500 transition-colors">
                  <input
                    type="file"
                    accept="image/svg+xml,image/png,image/jpeg"
                    onChange={(e) => handleFileUpload(e.target.files?.[0] || null, 'darkLogo')}
                    className="hidden"
                    id="dark-logo-upload"
                  />
                  <label htmlFor="dark-logo-upload" className="cursor-pointer">
                    <CloudUploadRoundedIcon className="mx-auto text-neutral-400 mb-2" fontSize="large" />
                    <div className="text-sm font-medium dark:text-neutral-100">Click to upload</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">SVG, PNG, JPG (max 5MB)</div>
                  </label>
                </div>
                {darkLogoFile && (
                  <div className="mt-3 text-xs text-neutral-600 dark:text-neutral-300">
                    <CheckCircleRoundedIcon className="text-green-600 dark:text-green-400 mr-1" fontSize="small" />
                    {darkLogoFile.name}
                  </div>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block dark:text-neutral-200">Preview</Label>
                <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 bg-white dark:bg-neutral-50 flex flex-col items-center justify-center min-h-[140px]">
                  {darkLogoPreview ? (
                    <>
                      <img src={darkLogoPreview} alt="Dark Logo" className="h-12 max-w-[200px] object-contain mb-3" />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-lg dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-700"
                        onClick={() => handleRemoveFile('darkLogo')}
                      >
                        <DeleteRoundedIcon fontSize="small" className="mr-1" />
                        Remove
                      </Button>
                    </>
                  ) : (
                    <div className="text-sm text-neutral-400">No dark logo uploaded</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Light Logo Upload */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 p-5">
            <div className="flex items-center gap-2 mb-4">
              <ImageRoundedIcon className="text-neutral-500 dark:text-neutral-400" fontSize="small" />
              <div className="text-sm font-medium tracking-tight dark:text-neutral-100">Light Logo</div>
              <Badge variant="outline" className="text-xs dark:border-neutral-600 dark:text-neutral-300">For dark backgrounds</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium mb-2 block dark:text-neutral-200">Upload Light Logo</Label>
                <div className="border-2 border-dashed border-neutral-200 dark:border-neutral-600 rounded-lg p-6 text-center hover:border-neutral-300 dark:hover:border-neutral-500 transition-colors">
                  <input
                    type="file"
                    accept="image/svg+xml,image/png,image/jpeg"
                    onChange={(e) => handleFileUpload(e.target.files?.[0] || null, 'lightLogo')}
                    className="hidden"
                    id="light-logo-upload"
                  />
                  <label htmlFor="light-logo-upload" className="cursor-pointer">
                    <CloudUploadRoundedIcon className="mx-auto text-neutral-400 mb-2" fontSize="large" />
                    <div className="text-sm font-medium dark:text-neutral-100">Click to upload</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">SVG, PNG, JPG (max 5MB)</div>
                  </label>
                </div>
                {lightLogoFile && (
                  <div className="mt-3 text-xs text-neutral-600 dark:text-neutral-300">
                    <CheckCircleRoundedIcon className="text-green-600 dark:text-green-400 mr-1" fontSize="small" />
                    {lightLogoFile.name}
                  </div>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block dark:text-neutral-200">Preview</Label>
                <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 bg-neutral-900 flex flex-col items-center justify-center min-h-[140px]">
                  {lightLogoPreview ? (
                    <>
                      <img src={lightLogoPreview} alt="Light Logo" className="h-12 max-w-[200px] object-contain mb-3" />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-lg bg-white dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                        onClick={() => handleRemoveFile('lightLogo')}
                      >
                        <DeleteRoundedIcon fontSize="small" className="mr-1" />
                        Remove
                      </Button>
                    </>
                  ) : (
                    <div className="text-sm text-neutral-400">No light logo uploaded</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Last Updated Info */}
        <div className="mt-6 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg dark:border dark:border-neutral-700">
          <div>
            <span className="font-medium">Last Updated:</span> {new Date(settings.updatedAt).toLocaleString()}
          </div>
          <Badge variant="outline" className="text-xs dark:border-neutral-600 dark:text-neutral-300">
            <CheckCircleRoundedIcon fontSize="small" className="mr-1" />
            All changes saved
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export default SuperAdminWhiteLabel;
