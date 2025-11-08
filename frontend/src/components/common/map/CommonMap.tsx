"use client";
import { useEffect, useRef, useState } from "react";
import { Search, Home, Menu, ZoomIn, ZoomOut, Fullscreen, FullscreenExit } from "@mui/icons-material";
import { IconButton, Paper, InputBase, List, ListItem, ListItemText, Divider } from "@mui/material";
import { useTheme } from "@/components/providers/ThemeProvider";

interface SearchHistoryItem {
  query: string;
  timestamp: Date;
}

export default function FleetStackLeafletMap() {
  const mapEl = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Load search history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("mapSearchHistory");
    if (stored) {
      setSearchHistory(JSON.parse(stored));
    }
  }, []);

  // Save search history to localStorage
  const saveSearchHistory = (query: string) => {
    const newItem: SearchHistoryItem = {
      query,
      timestamp: new Date(),
    };
    const updatedHistory = [newItem, ...searchHistory.filter(item => item.query !== query)].slice(0, 5);
    setSearchHistory(updatedHistory);
    localStorage.setItem("mapSearchHistory", JSON.stringify(updatedHistory));
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      saveSearchHistory(searchQuery.trim());
      setShowSearchHistory(false);
      // Here you would implement actual search functionality
      console.log("Searching for:", searchQuery);
    }
  };

  const handleHistoryClick = (query: string) => {
    setSearchQuery(query);
    setShowSearchHistory(false);
    handleSearch();
  };

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      mapEl.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (!mapEl.current) return;

    // Ensure Leaflet CSS once
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
      link.crossOrigin = "";
      document.head.appendChild(link);
    }

    const ensureLeaflet = () =>
      new Promise<void>((resolve) => {
        const w: any = window;
        if (w.L?.map) return resolve();
        const existing = document.getElementById("leaflet-js") as HTMLScriptElement | null;
        if (existing) {
          existing.addEventListener("load", () => resolve(), { once: true });
          return;
        }
        const s = document.createElement("script");
        s.id = "leaflet-js";
        s.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        s.async = true;
        s.onload = () => resolve();
        document.body.appendChild(s);
      });

    let disposed = false;

    ensureLeaflet().then(() => {
      if (disposed) return;
      const L = (window as any).L;
      mapRef.current = L.map(mapEl.current!, {
        center: [20, 78], // India-ish
        zoom: 5,
        zoomControl: false, // We'll use custom controls
        preferCanvas: true,
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapRef.current);
    });

    return () => {
      disposed = true;
      if (mapRef.current) mapRef.current.remove();
    };
  }, []);

  const isDark = theme === "dark";
  const backgroundColor = isDark ? "#121212" : "#ffffff";
  const textColor = isDark ? "#f9f9f9" : "#000000";
  const borderColor = isDark ? "#333333" : "#e5e5e5";

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      {/* Map Container */}
      <div ref={mapEl} style={{ position: "absolute", inset: 0 }} />
      
      {/* Top Left Search Bar */}
      <div style={{ 
        position: "absolute", 
        top: 150, 
        left: 16, 
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        gap: 8
      }}>
        <IconButton
          sx={{
            backgroundColor,
            color: textColor,
            border: `1px solid ${borderColor}`,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            "&:hover": { backgroundColor: isDark ? "#1a1a1a" : "#f5f5f5" }
          }}
          size="medium"
        >
          <Menu />
        </IconButton>
        
        <Paper
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: 400,
            backgroundColor,
            border: `1px solid ${borderColor}`,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            position: "relative"
          }}
        >
          <IconButton
            sx={{ p: "10px", color: textColor }}
            aria-label="home"
            onClick={() => {
              if (mapRef.current) {
                mapRef.current.setView([20, 78], 5);
              }
            }}
          >
            <Home />
          </IconButton>
          
          <InputBase
            sx={{ ml: 1, flex: 1, color: textColor }}
            placeholder="Search locations..."
            inputProps={{ 'aria-label': 'search locations' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSearchHistory(true)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          
          <IconButton
            sx={{ p: "10px", color: textColor }}
            aria-label="search"
            onClick={handleSearch}
          >
            <Search />
          </IconButton>
          
          {/* Search History Dropdown */}
          {showSearchHistory && searchHistory.length > 0 && (
            <Paper
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                mt: 1,
                backgroundColor,
                border: `1px solid ${borderColor}`,
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                zIndex: 1001,
                maxHeight: 200,
                overflow: 'auto'
              }}
            >
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Recent Searches" 
                    primaryTypographyProps={{ 
                      fontSize: '12px', 
                      color: isDark ? '#999999' : '#666666' 
                    }}
                  />
                </ListItem>
                <Divider />
                {searchHistory.map((item, index) => (
                  <ListItem
                    key={index}
                    button
                    onClick={() => handleHistoryClick(item.query)}
                    sx={{
                      "&:hover": { backgroundColor: isDark ? "#1a1a1a" : "#f5f5f5" }
                    }}
                  >
                    <ListItemText
                      primary={item.query}
                      primaryTypographyProps={{ fontSize: '14px', color: textColor }}
                      secondary={item.timestamp.toLocaleDateString()}
                      secondaryTypographyProps={{ fontSize: '11px', color: isDark ? '#999999' : '#666666' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Paper>
      </div>
      
      {/* Bottom Right Controls */}
      <div style={{ 
        position: "absolute", 
        bottom: 16, 
        right: 16, 
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: 8
      }}>
        <IconButton
          sx={{
            backgroundColor,
            color: textColor,
            border: `1px solid ${borderColor}`,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            "&:hover": { backgroundColor: isDark ? "#1a1a1a" : "#f5f5f5" }
          }}
          size="medium"
          onClick={handleZoomIn}
        >
          <ZoomIn />
        </IconButton>
        
        <IconButton
          sx={{
            backgroundColor,
            color: textColor,
            border: `1px solid ${borderColor}`,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            "&:hover": { backgroundColor: isDark ? "#1a1a1a" : "#f5f5f5" }
          }}
          size="medium"
          onClick={handleZoomOut}
        >
          <ZoomOut />
        </IconButton>
        
        <IconButton
          sx={{
            backgroundColor,
            color: textColor,
            border: `1px solid ${borderColor}`,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            "&:hover": { backgroundColor: isDark ? "#1a1a1a" : "#f5f5f5" }
          }}
          size="medium"
          onClick={handleFullscreen}
        >
          {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
        </IconButton>
      </div>
      
      {/* Click outside handler for search history */}
      {showSearchHistory && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => setShowSearchHistory(false)}
        />
      )}
    </div>
  );
}
