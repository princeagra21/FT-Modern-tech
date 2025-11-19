import React from 'react'

export default function HeaderWithoutInfo() {
  return (
    <header className="sticky top-0 z-[100] border-b border-slate-200 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 mt-3 px-3 py-3 [padding-top:env(safe-area-inset-top)]">
        <div className="flex min-w-0 items-center gap-2">
          <div className="grid h-8 w-8 place-content-center rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900">
            <span className="text-[13px] font-extrabold ">FS</span>
          </div>
          <span className="truncate font-semibold text-slate-800 dark:text-slate-100">Fleet Stack</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="h-9 w-20 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
        </div>
      </div>
    </header>
  )
}