'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  applyBrandingColors, 
  saveBrandingColors, 
  clearBrandingColors,
  type BrandingColors 
} from '@/lib/themeUtils';

// Material Design Icons
import PaletteIcon from "@mui/icons-material/Palette";
import SaveIcon from "@mui/icons-material/Save";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import FormatPaintIcon from "@mui/icons-material/FormatPaint";
import CheckIcon from "@mui/icons-material/Check";

// Default Fleet Stack black/white theme
const defaultColors: BrandingColors = {
  light: {
    primary: '#000000',
    secondary: '#ffffff',
    accent: '#333333',
    background: '#ffffff',
    foreground: '#000000',
    muted: '#666666',
    border: '#e5e5e5',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  dark: {
    primary: '#ffffff',
    secondary: '#000000',
    accent: '#d4d4d4',
    background: '#0a0a0a',
    foreground: '#ffffff',
    muted: '#a3a3a3',
    border: '#262626',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
  },
};

function SuperAdminBranding() {
  const [colors, setColors] = useState<BrandingColors>(defaultColors);
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>('light');
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Handle color change
  const handleColorChange = (theme: 'light' | 'dark', key: keyof BrandingColors['light'], value: string) => {
    // Validate hex color format
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (hexColorRegex.test(value)) {
      setColors(prev => ({
        ...prev,
        [theme]: {
          ...prev[theme],
          [key]: value
        }
      }));
      setHasChanges(true);
      setShowSuccessMessage(false);
    }
  };

  // Reset to defaults
  const handleReset = () => {
    setColors(defaultColors);
    setHasChanges(false);
    setShowSuccessMessage(false);
    
    // Apply default colors and clear storage
    applyBrandingColors(defaultColors);
    clearBrandingColors();
    
    // Show temporary success message
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  // Save changes
  const handleSave = async () => {
    setIsSaving(true);
    setShowSuccessMessage(false);
    
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/superadmin/branding', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(colors)
      // });
      // 
      // if (!response.ok) throw new Error('Failed to save');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save and apply colors
      saveBrandingColors(colors);
      
      setHasChanges(false);
      setShowSuccessMessage(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Error saving branding colors:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Load saved colors on mount
  React.useEffect(() => {
    const savedColors = localStorage.getItem('fleetstack_branding_colors');
    if (savedColors) {
      try {
        const parsed = JSON.parse(savedColors);
        setColors(parsed);
      } catch (error) {
        console.error('Error loading saved colors:', error);
      }
    }
  }, []);

  const currentTheme = colors[activeTheme];

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              Theme Customization
            </div>
            <CardTitle className="text-2xl tracking-tight dark:text-neutral-100">
              Branding & Colors
            </CardTitle>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Customize the color scheme for your Fleet Stack platform. Configure separate themes for light and dark modes.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {hasChanges && (
              <Badge variant="outline" className="rounded-full border-amber-500 text-amber-600 dark:border-amber-400 dark:text-amber-400">
                Unsaved Changes
              </Badge>
            )}
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={!hasChanges || isSaving}
              className="border-neutral-300 dark:border-neutral-600 dark:text-neutral-300"
            >
              <RestartAltIcon fontSize="small" className="mr-2" />
              Reset
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-neutral-100"
            >
              {isSaving ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <SaveIcon fontSize="small" className="mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Success Message */}
        {showSuccessMessage && (
          <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
            <CheckIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-900 dark:text-green-100">
              {hasChanges === false ? 'Your branding colors have been saved successfully!' : 'All colors have been reset to default Fleet Stack theme.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Theme Toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-neutral-100 dark:bg-neutral-700 grid place-items-center">
              <PaletteIcon className="text-neutral-600 dark:text-neutral-300" />
            </div>
            <div>
              <div className="font-semibold text-sm dark:text-neutral-100">Active Preview</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                Switch between light and dark theme preview
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={activeTheme === 'light' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTheme('light')}
              className={
                activeTheme === 'light'
                  ? 'bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black'
                  : 'border-neutral-300 dark:border-neutral-600 dark:text-neutral-300'
              }
            >
              <LightModeIcon fontSize="small" className="mr-2" />
              Light Mode
            </Button>
            <Button
              variant={activeTheme === 'dark' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTheme('dark')}
              className={
                activeTheme === 'dark'
                  ? 'bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black'
                  : 'border-neutral-300 dark:border-neutral-600 dark:text-neutral-300'
              }
            >
              <DarkModeIcon fontSize="small" className="mr-2" />
              Dark Mode
            </Button>
          </div>
        </div>
                {/* Live Preview */}
        <div className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center gap-2 mb-4">
            <ColorLensIcon className="text-neutral-600 dark:text-neutral-300" fontSize="small" />
            <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-900 dark:text-neutral-100">
              Live Preview - {activeTheme === 'light' ? 'Light Mode' : 'Dark Mode'}
            </h3>
          </div>
          
          <div 
            className="rounded-xl p-6 space-y-4"
            style={{
              backgroundColor: currentTheme.background,
              borderColor: currentTheme.border,
              borderWidth: '1px',
            }}
          >
            {/* Preview Header */}
            <div className="flex items-center justify-between">
              <h4 
                className="text-lg font-semibold" 
                style={{ color: currentTheme.foreground }}
              >
                Sample Dashboard
              </h4>
              <div className="flex gap-2">
                <span 
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: currentTheme.primary,
                    color: activeTheme === 'light' ? '#ffffff' : '#000000'
                  }}
                >
                  Primary
                </span>
                <span 
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: currentTheme.accent,
                    color: currentTheme.foreground
                  }}
                >
                  Accent
                </span>
              </div>
            </div>

            {/* Preview Content */}
            <div className="grid grid-cols-3 gap-3">
              <div 
                className="p-4 rounded-lg"
                style={{ 
                  backgroundColor: activeTheme === 'light' ? '#f5f5f5' : '#1a1a1a',
                  borderColor: currentTheme.border,
                  borderWidth: '1px'
                }}
              >
                <div style={{ color: currentTheme.muted }} className="text-xs mb-1">
                  Sample Card
                </div>
                <div style={{ color: currentTheme.foreground }} className="font-semibold">
                  Content
                </div>
              </div>
              <div 
                className="p-4 rounded-lg flex items-center justify-center"
                style={{ 
                  backgroundColor: currentTheme.success + '20',
                  borderColor: currentTheme.success,
                  borderWidth: '1px'
                }}
              >
                <CheckCircleIcon style={{ color: currentTheme.success }} />
              </div>
              <div 
                className="p-4 rounded-lg"
                style={{ 
                  backgroundColor: currentTheme.warning + '20',
                  borderColor: currentTheme.warning,
                  borderWidth: '1px'
                }}
              >
                <div style={{ color: currentTheme.warning }} className="text-sm font-medium">
                  Warning
                </div>
              </div>
            </div>

            {/* Preview Text */}
            <div className="space-y-2">
              <p style={{ color: currentTheme.foreground }} className="text-sm">
                This is a preview of how your theme will look with the selected colors.
              </p>
              <p style={{ color: currentTheme.muted }} className="text-sm">
                Muted text appears in secondary content areas.
              </p>
            </div>

            {/* Preview Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: currentTheme.primary,
                  color: activeTheme === 'light' ? '#ffffff' : '#000000',
                }}
              >
                Primary Button
              </button>
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: 'transparent',
                  color: currentTheme.foreground,
                  borderColor: currentTheme.border,
                  borderWidth: '1px',
                }}
              >
                Secondary Button
              </button>
            </div>
          </div>
        </div>

        {/* Color Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Light Theme Colors */}
          <div className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-700 dark:bg-neutral-800">
            <div className="flex items-center gap-2 mb-4">
              <LightModeIcon className="text-neutral-600 dark:text-neutral-300" fontSize="small" />
              <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-900 dark:text-neutral-100">
                Light Mode Colors
              </h3>
            </div>
            <div className="space-y-4">
              <ColorInput
                label="Primary Color"
                value={colors.light.primary}
                onChange={(value) => handleColorChange('light', 'primary', value)}
                description="Main brand color"
              />
              <ColorInput
                label="Secondary Color"
                value={colors.light.secondary}
                onChange={(value) => handleColorChange('light', 'secondary', value)}
                description="Secondary brand color"
              />
              <ColorInput
                label="Accent Color"
                value={colors.light.accent}
                onChange={(value) => handleColorChange('light', 'accent', value)}
                description="Accent highlights"
              />
              <ColorInput
                label="Background"
                value={colors.light.background}
                onChange={(value) => handleColorChange('light', 'background', value)}
                description="Main background color"
              />
              <ColorInput
                label="Foreground"
                value={colors.light.foreground}
                onChange={(value) => handleColorChange('light', 'foreground', value)}
                description="Main text color"
              />
              <ColorInput
                label="Muted"
                value={colors.light.muted}
                onChange={(value) => handleColorChange('light', 'muted', value)}
                description="Muted text and elements"
              />
              <ColorInput
                label="Border"
                value={colors.light.border}
                onChange={(value) => handleColorChange('light', 'border', value)}
                description="Border colors"
              />
              
              <Separator className="dark:bg-neutral-700" />
              
              <div className="text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                Status Colors
              </div>
              
              <ColorInput
                label="Success"
                value={colors.light.success}
                onChange={(value) => handleColorChange('light', 'success', value)}
                description="Success states"
              />
              <ColorInput
                label="Warning"
                value={colors.light.warning}
                onChange={(value) => handleColorChange('light', 'warning', value)}
                description="Warning states"
              />
              <ColorInput
                label="Error"
                value={colors.light.error}
                onChange={(value) => handleColorChange('light', 'error', value)}
                description="Error states"
              />
            </div>
          </div>

          {/* Dark Theme Colors */}
          <div className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-700 dark:bg-neutral-800">
            <div className="flex items-center gap-2 mb-4">
              <DarkModeIcon className="text-neutral-600 dark:text-neutral-300" fontSize="small" />
              <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-900 dark:text-neutral-100">
                Dark Mode Colors
              </h3>
            </div>
            <div className="space-y-4">
              <ColorInput
                label="Primary Color"
                value={colors.dark.primary}
                onChange={(value) => handleColorChange('dark', 'primary', value)}
                description="Main brand color"
              />
              <ColorInput
                label="Secondary Color"
                value={colors.dark.secondary}
                onChange={(value) => handleColorChange('dark', 'secondary', value)}
                description="Secondary brand color"
              />
              <ColorInput
                label="Accent Color"
                value={colors.dark.accent}
                onChange={(value) => handleColorChange('dark', 'accent', value)}
                description="Accent highlights"
              />
              <ColorInput
                label="Background"
                value={colors.dark.background}
                onChange={(value) => handleColorChange('dark', 'background', value)}
                description="Main background color"
              />
              <ColorInput
                label="Foreground"
                value={colors.dark.foreground}
                onChange={(value) => handleColorChange('dark', 'foreground', value)}
                description="Main text color"
              />
              <ColorInput
                label="Muted"
                value={colors.dark.muted}
                onChange={(value) => handleColorChange('dark', 'muted', value)}
                description="Muted text and elements"
              />
              <ColorInput
                label="Border"
                value={colors.dark.border}
                onChange={(value) => handleColorChange('dark', 'border', value)}
                description="Border colors"
              />
              
              <Separator className="dark:bg-neutral-700" />
              
              <div className="text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                Status Colors
              </div>
              
              <ColorInput
                label="Success"
                value={colors.dark.success}
                onChange={(value) => handleColorChange('dark', 'success', value)}
                description="Success states"
              />
              <ColorInput
                label="Warning"
                value={colors.dark.warning}
                onChange={(value) => handleColorChange('dark', 'warning', value)}
                description="Warning states"
              />
              <ColorInput
                label="Error"
                value={colors.dark.error}
                onChange={(value) => handleColorChange('dark', 'error', value)}
                description="Error states"
              />
            </div>
          </div>
        </div>



        {/* Info Box */}
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
          <div className="flex gap-3">
            <FormatPaintIcon className="text-blue-600 dark:text-blue-400 flex-shrink-0" fontSize="small" />
            <div className="space-y-1">
              <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Theme Customization Tips
              </div>
              <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                <p>• Default Fleet Stack theme uses black/white for professional appearance</p>
                <p>• Customize colors to match your brand identity</p>
                <p>• Ensure sufficient contrast for accessibility</p>
                <p>• Preview changes before saving</p>
                <p>• Changes apply system-wide for all users</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Reusable Color Input Component
function ColorInput({ 
  label, 
  value, 
  onChange, 
  description 
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void;
  description?: string;
}) {
  const [inputValue, setInputValue] = useState(value);
  const [isValid, setIsValid] = useState(true);

  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    
    // Validate hex color
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    const isValidColor = hexColorRegex.test(newValue);
    setIsValid(isValidColor);
    
    if (isValidColor) {
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium dark:text-neutral-300">{label}</Label>
        {description && (
          <span className="text-[10px] text-neutral-500 dark:text-neutral-400">{description}</span>
        )}
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="#000000"
            className={`pr-12 font-mono text-sm dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-100 ${
              !isValid ? 'border-red-500 dark:border-red-500' : ''
            }`}
          />
          <input
            type="color"
            value={isValid ? inputValue : value}
            onChange={(e) => handleInputChange(e.target.value)}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded cursor-pointer border border-neutral-200 dark:border-neutral-600"
          />
        </div>
      </div>
      {!isValid && (
        <p className="text-[10px] text-red-500 dark:text-red-400">
          Please enter a valid hex color (e.g., #000000)
        </p>
      )}
    </div>
  );
}

export default SuperAdminBranding;
