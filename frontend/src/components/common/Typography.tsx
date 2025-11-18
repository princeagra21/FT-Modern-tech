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
  h1: "text-5xl font-bold",
  h2: "text-4xl font-semibold",
  h3: "text-3xl font-semibold",
  h4: "text-2xl font-medium",
  h5: "text-xl font-medium",
  h6: "text-lg font-medium",
  p: "text-base font-normal leading-relaxed",
  body1: "text-base font-normal",
  subtitle: "text-sm font-normal",
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
      className={clsx(
        variantClasses[variant],
        colorClasses[color],
        className
      )}
    >
      {children}
    </Component>
  );
};
