"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";

// ——————————————————————————————————————————
// Types
// ——————————————————————————————————————————
export interface NavItem {
  key: string;
  label: string;
  icon: React.ElementType;
  danger?: boolean;
}

export interface UserIdentity {
  name: string;
  username: string;
  profileUrl: string;
  isEmailVerified: boolean;
}

interface UserIdentityCardProps {
  user: UserIdentity;
}

interface NavigationMenuProps {
  navItems: NavItem[];
  activeKey: string;
  onNavChange: (key: string) => void;
}

interface SideNavProps {
  user: UserIdentity;
  navItems: NavItem[];
  activeKey: string;
  onNavChange: (key: string) => void;
}

// ——————————————————————————————————————————
// Menu Item
// ——————————————————————————————————————————
function MenuItem({
  active,
  label,
  Icon,
  danger,
  onClick,
}: {
  active?: boolean;
  label: string;
  Icon: React.ElementType;
  danger?: boolean;
  onClick: () => void;
}) {
  const IconEl = Icon as React.ElementType;

  return (
    <button
      onClick={onClick}
      className={[
        "group w-full flex items-center gap-3 rounded-xl px-4 py-3 transition-all border text-sm font-medium tracking-tight",
        danger
          ? "border-border/60 text-destructive"
          : `border-transparent ${!active ? "hover:bg-foreground/10" :  ""} `,
        active
          ? "bg-primary text-white "
          : "bg-card text-foreground hover:bg-error/10",
      ].join(" ")}
    >
      <IconEl
        className={active ? "text-primary-foreground" : "text-muted-foreground"}
        fontSize="small"
      />
      <span className="truncate">{label}</span>
      <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-xs text-muted-foreground">
        ↗
      </span>
    </button>
  );
}

// ——————————————————————————————————————————
// User Identity Card
// ——————————————————————————————————————————
export function UserIdentityCard({ user }: UserIdentityCardProps) {
  return (
    <Card className="rounded-2xl border border-border dark:bg-foreground/5 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border border-border">
            <AvatarImage src={user.profileUrl} alt={user.name} />
            <AvatarFallback className="bg-foreground/5 text-foreground font-medium">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold truncate text-foreground">
                {user.name}
              </span>
              {user.isEmailVerified && (
                <VerifiedRoundedIcon className="text-primary" fontSize="small" />
              )}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              @{user.username}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ——————————————————————————————————————————
// Navigation Menu
// ——————————————————————————————————————————
export function NavigationMenu({
  navItems,
  activeKey,
  onNavChange,
}: NavigationMenuProps) {
  const regularItems = navItems.filter((item) => !item.danger);
  const dangerItems = navItems.filter((item) => item.danger);

  return (
    <Card className="rounded-2xl border border-border dark:bg-foreground/5 shadow-sm ">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-foreground tracking-tight">
          Navigation
        </CardTitle>
      </CardHeader>

      <CardContent className="px-4 pt-0">
        <div className="space-y-2">
          {regularItems.map(({ key, label, icon: Icon }) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MenuItem
                active={activeKey === key}
                label={label}
                Icon={Icon}
                onClick={() => onNavChange(key)}
              />
            </motion.div>
          ))}

          {dangerItems.length > 0 && (
            <>
              <Separator className="my-4 bg-border" />
              {dangerItems.map(({ key, label, icon: Icon }) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <MenuItem
                    active={activeKey === key}
                    label={label}
                    Icon={Icon}
                    danger
                    onClick={() => onNavChange(key)}
                  />
                </motion.div>
              ))}
            </>
          )}
        </div>
      </CardContent>

    </Card>
  );
}

// ——————————————————————————————————————————
// Combined SideNav
// ——————————————————————————————————————————
export default function SideNav({
  user,
  navItems,
  activeKey,
  onNavChange,
}: SideNavProps) {
  return (
    <aside className="md:col-span-3 ">
      <div className="sticky top-[72px] space-y-6">
        <UserIdentityCard user={user} />
        <NavigationMenu
          navItems={navItems}
          activeKey={activeKey}
          onNavChange={onNavChange}
        />
      </div>
    </aside>
  );
}
