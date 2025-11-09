"use client";

import React from "react";
import { useTheme } from "@/components/providers/ThemeProvider";
import LoginAnimation from "@/components/auth/loginanimation";
import LoginForm from "@/components/auth/loginform";

const LoginPage = () => {
  const { theme } = useTheme();

  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground">

      {/* Main content area */}
      <main className="flex-1 content-center">
        <div className="mx-auto items-center justify-center max-w-7xl py-6 lg:py-8 grid grid-cols-1  gap-6 lg:grid-cols-12 min-h-full">
          {/* Left section with animation */}
          <section className="hidden lg:block lg:col-span-7">
            <LoginAnimation />
          </section>

          {/* Right section with form */}
          <aside className="col-span-5 items-center w-full "><LoginForm/></aside>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
