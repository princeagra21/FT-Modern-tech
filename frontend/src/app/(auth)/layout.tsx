"use client";

import React from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import LoginAnimation from "@/components/auth/loginanimation";

const Authlayout = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();

  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl h-16 px-4 md:px-6 flex items-center justify-between">
          {/* Logo + Brand */}
          <div className="flex items-center gap-3">
            <img
              src={
                theme === "dark"
                  ? "/images/logo-dark.png"
                  : "/images/logo-light.png"
              }
              alt="Fleet Stack"
              className="h-8 w-auto"
            />
          </div>

          <nav className="hidden md:flex items-center gap-4 text-sm text-muted">
            <a href="#" className="transition hover:text-foreground">
              Docs
            </a>
            <a href="#" className="transition hover:text-foreground">
              Rest API
            </a>
          </nav>
        </div>
      </header>

      {/* Main content area */}
      <main className="flex-1 content-center">
        <div className="mx-auto items-center justify-center max-w-7xl py-6 lg:py-8 grid grid-cols-1  gap-6 lg:grid-cols-12 min-h-full">
          {/* Left section with animation */}
          <section className="hidden lg:block lg:col-span-7">
            <LoginAnimation />
          </section>

          {/* Right section with form */}
          <aside className="col-span-5 items-center w-full ">{children}</aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 text-muted">
        <div className="mx-auto max-w-7xl h-12 px-4 md:px-6 flex items-center justify-between text-xs">
          <span>© {new Date().getFullYear()} Fleet Stack. All rights reserved.</span>
          <div className="flex items-center gap-3">
            <a href="#" className="hover:text-foreground transition">
              Terms
            </a>
            <span aria-hidden>•</span>
            <a href="#" className="hover:text-foreground transition">
              Privacy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Authlayout;
