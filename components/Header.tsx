"use client";

import { useState, useEffect } from "react";
import {
  Trophy,
  Menu,
  X,
  Home,
  LayoutList,
  Medal,
  User,
  LogIn,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export function Header() {
  const { isAuthenticated, isLoading: isLoadingToken } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const loginUrl = `/login?callbackUrl=${encodeURIComponent(pathname || "/")}`;

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Handle ESC key to close menu
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/matches", label: "Matches", icon: LayoutList },
    { href: "/world-cup", label: "World Cup", icon: Trophy },
    // { href: "/leaderboard", label: "Leaderboard", icon: Medal },
    ...(isLoadingToken
      ? [{ href: "#", label: "Loading...", icon: null }]
      : isAuthenticated
      ? [{ href: "/profile", label: "Profile", icon: User }]
      : [{ href: loginUrl, label: "Login", icon: LogIn }]),
  ];

  return (
    <>
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
              <Image
                alt="logo"
                width={22}
                height={40}
                src={"/logo.png"}
              />
            <div className="leading-tight">
              <h1 className="text-sm font-bold text-foreground tracking-tight">
                Predict Ocean
              </h1>
              <p className="hidden sm:block text-[8px] uppercase font-semibold text-muted-foreground tracking-wider">
                Predict &amp; Discuss
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                    pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Toggle Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-accent text-foreground transition-colors"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay & Drawer */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity opacity-100 animate-fadeIn"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-over Drawer */}
          <div className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-card z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-out translate-x-0">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg text-foreground">Menu</span>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3">
              <ul className="space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground hover:bg-accent"
                        }`}
                      >
                        {Icon && (
                          <Icon
                            className={`h-5 w-5 ${
                              isActive
                                ? "text-primary-foreground"
                                : "text-muted-foreground"
                            }`}
                          />
                        )}
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Drawer Footer (Optional decorative or social links) */}
            <div className="p-5 border-t border-border bg-muted/20">
              <p className="text-xs text-center text-muted-foreground">
                &copy; {new Date().getFullYear()} FootballDebate
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
