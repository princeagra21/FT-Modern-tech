"use client";
import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";

// Navigation item type
export interface NavItem {
  key: string;
  label: string;
  icon: React.ElementType;
  danger?: boolean;
}

// User type for identity display
export interface UserIdentity {
  name: string;
  username: string;
  profileUrl: string;
  isEmailVerified: boolean;
}

// Props for UserIdentityCard component
interface UserIdentityCardProps {
  user: UserIdentity;
}

// Props for NavigationMenu component
interface NavigationMenuProps {
  navItems: NavItem[];
  activeKey: string;
  onNavChange: (key: string) => void;
}

// Props for the combined SideNav component
interface SideNavProps {
  user: UserIdentity;
  navItems: NavItem[];
  activeKey: string;
  onNavChange: (key: string) => void;
}

// Individual menu item component
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
        "group w-full flex items-center gap-3 rounded-xl px-4 py-3 transition-all",
        danger
          ? "border border-neutral-200 dark:border-neutral-700"
          : "border border-transparent",
        active
          ? "bg-black dark:bg-white text-white dark:text-black"
          : "bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-black dark:text-white",
      ].join(" ")}
    >
      <IconEl
        className={
          active ? "text-white dark:text-black" : "text-black dark:text-white"
        }
        fontSize="small"
      />
      <span className="font-medium tracking-tight">{label}</span>
      <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-xs text-neutral-500 dark:text-neutral-400">
        ↗
      </span>
    </button>
  );
}

// User Identity Card component
export function UserIdentityCard({ user }: UserIdentityCardProps) {
  return (
    <Card className="rounded-2xl border-neutral-200 dark:border-neutral-700 shadow-sm dark:bg-neutral-800">
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border border-neutral-200 dark:border-neutral-700">
            <AvatarImage src={user.profileUrl} alt={user.name} />
            <AvatarFallback className="bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                {user.name}
              </span>
              {user.isEmailVerified && (
                <span className="inline-flex">
                  <VerifiedRoundedIcon
                    className="text-black dark:text-white"
                    fontSize="small"
                  />
                </span>
              )}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              @{user.username}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Navigation Menu component
export function NavigationMenu({
  navItems,
  activeKey,
  onNavChange,
}: NavigationMenuProps) {
  // Separate regular nav items from danger items
  const regularItems = navItems.filter((item) => !item.danger);
  const dangerItems = navItems.filter((item) => item.danger);

  return (
    <Card className="rounded-2xl border-neutral-200 dark:border-neutral-700 shadow-sm dark:bg-neutral-800">
      <CardHeader>
        <CardTitle className="text-base tracking-tight text-neutral-900 dark:text-neutral-100">
          Navigate
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Regular navigation items */}
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

          {/* Separator and danger items if they exist */}
          {dangerItems.length > 0 && (
            <>
              <Separator className="my-3" />
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

// Combined SideNav component (for backward compatibility)
export default function SideNav({
  user,
  navItems,
  activeKey,
  onNavChange,
}: SideNavProps) {
  return (
    <aside className="md:col-span-3">
      <div className="sticky top-[68px] space-y-6">
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
