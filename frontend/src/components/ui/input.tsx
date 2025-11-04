import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base styles
        "h-9 w-full min-w-0 rounded-md  border px-3 py-1 mt-2 text-base md:text-sm outline-none shadow-xs transition-[color,box-shadow]",

        // Colors (using Tailwind theme variables)
        "bg-background text-foreground placeholder:text-muted border-border",
        "file:text-foreground file:bg-transparent file:border-0 file:h-7 file:text-sm file:font-medium",

        // Focus & validation states
        "focus:border-primary",
        "aria-invalid:border-error aria-invalid:ring-error/20 dark:aria-invalid:ring-error/40",

        // Disabled state
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
      {...props}
    />
  );
}

export { Input };
