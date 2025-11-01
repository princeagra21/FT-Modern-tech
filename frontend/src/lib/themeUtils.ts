/**
 * Theme Utilities for Fleet Stack Branding
 * Handles loading and applying custom color themes
 */

export type BrandingColors = {
  light: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  dark: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
};

/**
 * Convert hex color to OKLCH color space
 * Note: This is a simplified conversion. For production, consider using a library like 'culori'
 */
export function hexToOklch(hex: string): string {
  // Remove # if present
  const cleanHex = hex.replace('#', '');
  
  // Convert hex to RGB (0-1 range)
  const r = parseInt(cleanHex.slice(0, 2), 16) / 255;
  const g = parseInt(cleanHex.slice(2, 4), 16) / 255;
  const b = parseInt(cleanHex.slice(4, 6), 16) / 255;
  
  // Convert to linear RGB
  const toLinear = (c: number) => {
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  
  const rLinear = toLinear(r);
  const gLinear = toLinear(g);
  const bLinear = toLinear(b);
  
  // Calculate relative luminance (simplified lightness)
  const lightness = rLinear * 0.2126 + gLinear * 0.7152 + bLinear * 0.0722;
  
  // For now, return with 0 chroma and hue (grayscale approximation)
  // In production, implement full OKLCH conversion
  return `oklch(${lightness.toFixed(3)} 0 0)`;
}

/**
 * Apply branding colors to CSS variables
 */
export function applyBrandingColors(colors: BrandingColors): void {
  const root = document.documentElement;
  
  // Apply light theme colors
  Object.entries(colors.light).forEach(([key, value]) => {
    // Set custom color variables
    root.style.setProperty(`--color-${key}`, value);
    
    // Map to Tailwind variables for immediate effect
    const mapping: Record<string, string> = {
      primary: '--primary',
      secondary: '--secondary',
      background: '--background',
      foreground: '--foreground',
      muted: '--muted',
      border: '--border',
      accent: '--accent',
    };
    
    if (mapping[key]) {
      root.style.setProperty(mapping[key], hexToOklch(value));
    }
  });
  
  // Apply dark theme colors to CSS variables
  // Note: Dark mode uses a .dark class, so these will be applied when dark mode is active
  Object.entries(colors.dark).forEach(([key, value]) => {
    root.style.setProperty(`--color-dark-${key}`, value);
  });
}

/**
 * Load branding colors from localStorage and apply them
 */
export function loadBrandingColors(): BrandingColors | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const savedColors = localStorage.getItem('fleetstack_branding_colors');
    if (savedColors) {
      const colors: BrandingColors = JSON.parse(savedColors);
      applyBrandingColors(colors);
      return colors;
    }
  } catch (error) {
    console.error('Error loading branding colors:', error);
  }
  
  return null;
}

/**
 * Save branding colors to localStorage
 */
export function saveBrandingColors(colors: BrandingColors): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('fleetstack_branding_colors', JSON.stringify(colors));
    applyBrandingColors(colors);
  } catch (error) {
    console.error('Error saving branding colors:', error);
  }
}

/**
 * Clear branding colors from localStorage
 */
export function clearBrandingColors(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem('fleetstack_branding_colors');
  } catch (error) {
    console.error('Error clearing branding colors:', error);
  }
}

/**
 * Initialize theme on app load
 * Call this in your root layout or app component
 */
export function initializeBrandingTheme(): void {
  if (typeof window === 'undefined') return;
  
  // Load and apply saved colors on page load
  loadBrandingColors();
}
