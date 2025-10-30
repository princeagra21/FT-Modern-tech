"use client";

import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";  //test-com 
// import Cookies from "js-cookie";  //test-com 
import { useTheme } from "@/components/providers/ThemeProvider";
import LoginAnimation from "@/components/auth/loginanimation";

const Authlayout = ({children}:{children:React.ReactNode}) => {
  // const [isLoading, setIsLoading] = useState(false);   //test-com 
  const { theme } = useTheme();
  // const router = useRouter();

  // useEffect(() => {    //test-com 
  //   const checkUserlogin = () => {
  //     const userToken = Cookies.get("utoken");
  //     const adminToken = Cookies.get("atoken");
  //     const superAdminToken = Cookies.get("stoken");

  //     if (userToken) {
  //       router.push("/user/dashboard");
  //     } else if (adminToken) {
  //       router.push("/admin/dashboard");
  //     } else if (superAdminToken) {
  //       router.push("/superadmin/dashboard");
  //     }
  //   };

  //   checkUserlogin();
  // }, []);

  return (
    <div className="min-h-dvh flex flex-col bg-white text-slate-900 dark:bg-neutral-950 dark:text-neutral-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-neutral-800 dark:bg-neutral-950/80">
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

          <nav className="hidden md:flex items-center gap-4 text-sm text-slate-600 dark:text-neutral-300">
            <a
              href="#"
              className="hover:text-slate-900 dark:hover:text-white transition"
            >
              Docs
            </a>
            <a
              href="#"
              className="hover:text-slate-900 dark:hover:text-white transition"
            >
              Rest API
            </a>
          </nav>
        </div>
      </header>

      {/* Main content area */}
      <main className="flex-1">
        <div className="mx-auto items-center justify-center   max-w-7xl  py-6 lg:py-8 grid gap-6 lg:grid-cols-12 min-h-full">
          {/* 7/5 split on large screens, hide 7 part on small screens */}
          <section className="hidden lg:block lg:col-span-7">
            <LoginAnimation />
          </section>

          <aside className="col-span-5 items-center">
            {children}
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/70 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-neutral-800 dark:bg-neutral-950/80">
        <div className="mx-auto max-w-7xl h-12 px-4 md:px-6 flex items-center justify-between text-xs text-slate-600 dark:text-neutral-400">
          <span>
            © {new Date().getFullYear()} Fleet Stack. All rights reserved.
          </span>
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="hover:text-slate-900 dark:hover:text-white transition"
            >
              Terms
            </a>
            <span aria-hidden>•</span>
            <a
              href="#"
              className="hover:text-slate-900 dark:hover:text-white transition"
            >
              Privacy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Authlayout;
