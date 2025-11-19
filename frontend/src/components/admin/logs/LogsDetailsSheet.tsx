"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { ElementType, ReactNode } from "react";

export interface DetailItem {
  label: string;
  value: ReactNode;
}

export interface DetailSection {
  title: string; // Section header
  items?: DetailItem[]; // key-value style list
  content?: ReactNode; // free body (message / description)
  fullWidth?: boolean; // span 2 columns
}

export interface DetailSheetProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  icon?: ElementType;
  title: string;
  subTitle?: string;
  sections: DetailSection[];
  rawJSON?: any;
  onCopyJSON?: () => void;
}

export default function DetailSheet({
  open,
  onOpenChange,
  icon: Icon,
  title,
  subTitle,
  sections,
  rawJSON,
  onCopyJSON,
}: DetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl overflow-y-auto bg-background text-foreground"
      >
        {/* HEADER */}
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3">
            {Icon && (
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border bg-muted border-border">
                <Icon className="h-5 w-5" />
              </span>
            )}
            <div className="text-left">
              <div className="font-semibold">{title}</div>
              {subTitle && <div className="typo-subtitle">{subTitle}</div>}
            </div>
          </SheetTitle>
          <SheetDescription />
        </SheetHeader>

        {/* SECTIONS */}
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {sections.map((sec, i) => (
            <div
              key={i}
              className={`rounded-lg border p-4 bg-background ${
                sec.fullWidth ? "md:col-span-2" : ""
              }`}
            >
              <div className="mb-2 typo-subtitle">{sec.title}</div>

              {/* Key-value rows */}
              {sec.items && sec.items.length > 0 && (
                <div className="space-y-2 text-sm">
                  {sec.items.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-2 break-all"
                    >
                      <span className="text-muted">{item.label}:</span>
                      {item.value}
                    </div>
                  ))}
                </div>
              )}

              {/* Free content block */}
              {sec.content && (
                <div className="text-sm leading-relaxed">{sec.content}</div>
              )}
            </div>
          ))}

          {/* JSON SECTION */}
          {rawJSON && (
            <div className="md:col-span-2 rounded-lg border bg-background p-4">
              <div className="mb-2 flex items-center justify-between typo-subtitle">
                <span>Raw JSON</span>
                {onCopyJSON && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onCopyJSON}
                    className="gap-2"
                  >
                    <ContentCopyIcon className="h-4 w-4" /> Copy
                  </Button>
                )}
              </div>
              <pre className="max-h-[45vh] overflow-auto rounded-md border bg-muted p-3 text-xs leading-relaxed">
                {JSON.stringify(rawJSON, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
