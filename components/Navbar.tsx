"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Home,
  BookOpen,
  LogOut,
  Menu,
  X,
  Info,
  Mail,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout, openAuthModal, enrollments } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const linkClass = (active: boolean) =>
    `px-3 py-2 text-sm transition-colors inline-flex items-center gap-2 border-b-2 ${
      active
        ? "text-ink border-accent font-medium"
        : "text-ink-muted border-transparent hover:text-ink hover:border-border-strong"
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5" aria-label="EduVoxPro home">
          <Image
            src="/eduvoxpro-mark.svg"
            alt="EduVoxPro"
            width={36}
            height={36}
            className="w-9 h-9"
            priority
          />
          <div className="leading-tight">
            <span className="font-semibold text-base tracking-tight text-ink">
              EduVox<span className="text-accent">Pro</span>
            </span>
            <p className="text-[11px] text-ink-subtle hidden sm:block">Engineering certifications</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link href="/" className={linkClass(isActive("/"))}>
            <Home className="w-4 h-4" /> Home
          </Link>

          {user && (
            <Link href="/dashboard" className={linkClass(isActive("/dashboard"))}>
              <LayoutDashboard className="w-4 h-4" /> Dashboard
              {enrollments.length > 0 && (
                <span className="font-mono text-[11px] text-ink-subtle">({enrollments.length})</span>
              )}
            </Link>
          )}

          <Link href="/courses" className={linkClass(isActive("/courses"))}>
            <BookOpen className="w-4 h-4" /> Courses
          </Link>
          <Link href="/about" className={linkClass(isActive("/about"))}>
            <Info className="w-4 h-4" /> About
          </Link>
          <Link href="/contact" className={linkClass(isActive("/contact"))}>
            <Mail className="w-4 h-4" /> Contact
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 border border-border bg-surface-alt">
                <div className="w-6 h-6 border border-border-strong bg-surface flex items-center justify-center font-mono text-xs text-ink">
                  {user.fullName ? user.fullName[0].toUpperCase() : "U"}
                </div>
                <div className="text-left leading-tight">
                  <div className="text-xs font-medium text-ink truncate max-w-[120px]">
                    {user.fullName || "Engineer"}
                  </div>
                  <div className="text-[10px] text-ink-subtle font-mono truncate max-w-[120px]">
                    {user.email}
                  </div>
                </div>
              </div>
              <button
                onClick={() => logout()}
                title="Sign out"
                className="p-2 border border-border text-ink-muted hover:text-ink hover:border-border-strong transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal("login")}
                className="px-3 py-2 text-sm font-medium text-ink-muted hover:text-ink transition-colors"
              >
                Sign in
              </button>
              <button
                onClick={() => openAuthModal("signup")}
                className="px-4 py-2 text-sm font-semibold text-accent-contrast bg-accent hover:bg-accent-hover border border-accent transition-colors"
              >
                Get started
              </button>
            </div>
          )}
        </div>

        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 border border-border text-ink hover:border-border-strong"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-surface px-4 py-4 space-y-1">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm text-ink hover:bg-surface-alt">Home</Link>
          {user && <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm text-ink hover:bg-surface-alt">Dashboard</Link>}
          <Link href="/courses" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm text-ink hover:bg-surface-alt">Courses</Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm text-ink hover:bg-surface-alt">About</Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm text-ink hover:bg-surface-alt">Contact</Link>
          {user ? (
            <div className="pt-3 mt-2 border-t border-border flex items-center justify-between">
              <span className="text-xs text-ink-muted font-mono truncate">{user.email}</span>
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="text-xs text-ink font-medium px-2.5 py-1.5 border border-border hover:border-border-strong"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="pt-3 mt-2 border-t border-border flex gap-2">
              <button onClick={() => { openAuthModal("login"); setMobileMenuOpen(false); }} className="flex-1 py-2 text-sm border border-border text-ink hover:bg-surface-alt">Sign in</button>
              <button onClick={() => { openAuthModal("signup"); setMobileMenuOpen(false); }} className="flex-1 py-2 text-sm font-semibold bg-accent text-accent-contrast border border-accent">Get started</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};


