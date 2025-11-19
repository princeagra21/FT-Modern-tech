// components/ui/typography.tsx
import React, { FC, ReactNode } from "react";
import clsx from "clsx";

type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "p500"
  | "p600"
  | "p12m"
  | "p14m"
  | "p10Muted"
  | "p12Muted"
  | "body1"
  | "subtitle";

type TypographyColor = "foreground" | "muted";

interface TypographyProps {
  variant?: TypographyVariant;
  color?: TypographyColor;
  className?: string;
  children: ReactNode;
}

const variantClasses: Record<TypographyVariant, string> = {
  h1: "typo-h1 font-semibold",
  h2: "text-xl font-semibold",
  h3: "text-lg font-semibold",
  h4: "text-base font-medium",
  h5: "text-sm font-medium",
  h6: "text-xs font-medium",

  p: "text-sm font-normal leading-relaxed",
  p500: "text-sm font-medium",
  p600: "text-sm font-semibold",

  body1: "text-sm font-normal",
  subtitle: "text-xs font-normal text-muted",

  // 👇 newly added
  p12m: "text-[12px] font-medium",
  p14m: "text-[14px] font-medium",
  p10Muted: "text-[10px] text-muted",
  p12Muted: "text-[12px] text-muted",
};

const colorClasses: Record<TypographyColor, string> = {
  foreground: "text-foreground",
  muted: "text-muted",
};

export const Typography: FC<TypographyProps> = ({
  variant = "p",
  color = "foreground",
  children,
  className,
}) => {
  const Component = ["h1", "h2", "h3", "h4", "h5", "h6"].includes(variant)
    ? (variant as any)
    : "p";

  return (
    <Component
      className={clsx(variantClasses[variant], colorClasses[color], className)}
    >
      {children}
    </Component>
  );
};
