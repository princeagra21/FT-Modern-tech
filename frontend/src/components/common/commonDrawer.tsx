"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import CloseIcon from "@mui/icons-material/Close";

interface CommonDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const CommonDrawer: React.FC<CommonDrawerProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-foreground/40 z-[9998]"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="ml-auto w-110 h-full bg-background text-foreground border-l border-border shadow-2xl overflow-y-auto z-[9999] relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 px-7 py-4 border-b border-border">
          {title && (
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-muted rounded-md"
          >
            <CloseIcon fontSize="small" className="text-foreground" />
          </Button>
        </div>

        {/* Drawer Content */}
        <div className="px-7 pb-6">{children}</div>
      </div>
    </div>
  );
};

export default CommonDrawer;
