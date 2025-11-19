'use client'
import { Notifications, Language, Menu, DarkMode, Search, Settings, LightMode, Person, Close } from '@mui/icons-material';
import React, { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui//button';
import { AvatarImage } from '@radix-ui/react-avatar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getStoredUser } from '@/services/common/storage';
import { STORAGE_KEYS } from '@/services/common/constants';
import { useTheme } from '@/components/providers/ThemeProvider';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';



// Define langs locally to avoid import issues
const langs = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "ru", name: "русский", flag: "🇷🇺" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
];

type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'USER';

interface TopHeaderProps {
    mobileOpen: boolean;
    setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
    role: UserRole;
}

function TopHeader({ mobileOpen, setMobileOpen, role }: TopHeaderProps) {
    const [lang, setLang] = useState(langs[0]);
    const [user, setUser] = useState<any>(null);
    const { theme, toggleTheme } = useTheme();

    const router = useRouter();

    // Helper function to get storage key based on role
    const getStorageKey = (userRole: UserRole) => {
        switch (userRole) {
            case 'SUPER_ADMIN':
                return STORAGE_KEYS.SUPER_ADMIN;
            case 'ADMIN':
                return STORAGE_KEYS.ADMIN;
            case 'USER':
                return STORAGE_KEYS.USER;
            default:
                return STORAGE_KEYS.USER;
        }
    };

    useEffect(() => {
        const storageKey = getStorageKey(role);
        const userData = getStoredUser(storageKey);
        setUser(userData);
    }, [role]);

    const Signout = () => {
        // Clear user data from localStorage based on role
        const storageKey = getStorageKey(role);
        localStorage.removeItem(storageKey);
        switch (role) {
            case 'SUPER_ADMIN':
                Cookies.remove("stoken", { path: "/" });
                break;
            case 'ADMIN':
                Cookies.remove("atoken", { path: "/" });
                break;
            case 'USER':
                Cookies.remove("utoken", { path: "/" });
                break;
            default:
                Cookies.remove("", { path: "/" });
                break;
        }
       
        router.push('/login');
    };


    return (
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 mt-3 px-3 py-3 [padding-top:env(safe-area-inset-top)]">
                {/* Left: Logo */}
                <div className="flex min-w-0 items-center gap-2">
                    {/* <div className="grid h-8 w-8 place-content-center rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                        <span className="text-[13px] font-extrabold ">FS</span>
                    </div>
                    <span className="truncate font-semibold text-slate-800 dark:text-slate-100">Fleet Stack</span> */}
                    <img src={theme === 'dark' ? "/images/logo-dark.png" : "/images/logo-light.png"} alt="Fleet Stack" className="h-8 w-auto"/>
                </div>

                {/* Desktop Search */}
                <div className="hidden flex-1 px-4 md:block md:max-w-md">
                    <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            placeholder="Search orders, customers, devices…"
                            className="h-9 w-full rounded-xl border-slate-200 bg-white pl-9 pr-10 text-sm shadow-sm placeholder:text-slate-400 focus-visible:ring-4 focus-visible:ring-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:placeholder:text-slate-500 dark:focus-visible:ring-slate-900/40"
                        />
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1 sm:gap-2">
                    {/* Language */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="h-9 rounded-xl gap-2 px-2 sm:px-3">
                                <Language className="h-4 w-4" />
                                <span className="hidden sm:inline">{lang.flag}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 z-[200]">
                            <DropdownMenuLabel>Language</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {langs.map((l) => (
                                <DropdownMenuItem key={l.code} onClick={() => setLang(l)}>
                                    <span className="mr-2">{l.flag}</span>
                                    {l.name}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Notifications */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="relative h-9 w-9 rounded-xl">
                                <Notifications className="h-4 w-4" />
                                <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-content-center rounded-full bg-rose-600 px-[3px] text-[10px] font-bold text-white">5</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 z-[200]">
                            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Server usage high ⚠️</DropdownMenuItem>
                            <DropdownMenuItem>2 new billing tickets 💳</DropdownMenuItem>
                            <DropdownMenuItem>3 devices inactive 📡</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Theme toggle */}
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-xl"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? <DarkMode className="h-4 w-4" /> : <LightMode className="h-4 w-4" />}
                    </Button>

                    {/* Profile */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 shadow-sm hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                                <Avatar className="h-8 w-8">
                                    {/* <AvatarImage  src="https://i.pravatar.cc/64?img=5" alt="Anna Adame" /> */}
                                    <AvatarImage  src={user?.profileurl && user.profileurl} alt="Anna Adame" />
                                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="hidden text-left leading-tight sm:block">
                                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user?.name || 'Loading...'}</div>
                                    <div className="text-[11px] text-slate-500">{user?.role || 'Loading...'}</div>
                                </div>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 z-[200]">
                            <DropdownMenuItem>
                                <Person className="mr-2 h-4 w-4" /> Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" /> Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={Signout}>Sign out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Hamburger (mobile only) */}
                    <button
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50 md:hidden dark:border-slate-800 dark:bg-slate-900"
                        onClick={(e) => {
                            e.stopPropagation();
                            setMobileOpen((v) => !v);
                        }}
                        aria-label="Open navigation"
                        aria-expanded={mobileOpen}
                    >
                        {mobileOpen ? <Close className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
        </div>
    )
}

export default TopHeader;
