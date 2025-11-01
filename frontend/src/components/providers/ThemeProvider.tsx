'use client';

import { useDynamicTheme } from '@/lib/hooks/useDynamicTheme';
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('light');
  const [isHydrated, setIsHydrated] = useState(false);

  // 🪄 Use the dynamic theme hook
  const { theme: dynamicTheme, loading, updateTheme } = useDynamicTheme();

  // 🔁 Watch for theme mode change (light/dark) and update colors accordingly
  useEffect(() => {
    if (!isHydrated || !dynamicTheme) return;

    // Dummy theme color objects for both modes
    const lightTheme = {
      mode: 'light',
      colors: {
        '--primary': '#008000',
        '--secondary': '#ffffff',
        '--accent': '#333333',
        '--background': '#ffffff',
        '--foreground': '#000000',
        '--muted': '#666666',
        '--border': '#26bbed',
        '--success': '#22c55e',
        '--warning': '#f59e0b',
        '--error': '#ef4444',
      },
    };

    const darkTheme = {
      mode: 'dark',
      colors: {
        '--primary': '#ff4d4d',
        '--secondary': '#1a1a1a',
        '--accent': '#cccccc',
        '--background': '#121212',
        '--foreground': '#f9f9f9',
        '--muted': '#999999',
        '--border': '#333333',
        '--success': '#22c55e',
        '--warning': '#f59e0b',
        '--error': '#ef4444',
      },
    };

    // Apply correct theme colors
    if (theme === 'dark') updateTheme(darkTheme);
    else updateTheme(lightTheme);
  }, [theme, dynamicTheme, isHydrated]);

  // ✅ Simulate fetching initial theme (like from API)
  useEffect(() => {
    setTimeout(() => {
      setTheme('light'); // default or fetched value
      setIsHydrated(true);
    }, 500);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  if (!isHydrated || loading) return null;

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
