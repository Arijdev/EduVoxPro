"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Terminal,
  Award,
  LayoutDashboard,
  Home,
  BookOpen,
  LogOut,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout, openAuthModal, certificates, enrollments } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-xl transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo: EduVortexPro */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-indigo via-accent-cyan to-accent-emerald p-[1.5px] shadow-md shadow-accent-indigo/20 group-hover:shadow-accent-indigo/30 transition-all duration-300">
            <div className="w-full h-full bg-white rounded-xl flex items-center justify-center">
              <Terminal className="w-5 h-5 text-accent-indigo group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tight text-slate-900">
                EduVortex<span className="text-accent-indigo">Pro</span>
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border border-indigo-200 bg-indigo-50 text-accent-indigo font-bold tracking-wider">
                V3.0
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">Deep Technical Mastery & Free Certs</p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 font-medium text-sm">
          <Link
            href="/"
            className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              isActive("/")
                ? "text-accent-indigo bg-indigo-50 border border-indigo-200 font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Home className="w-4 h-4" />
            Home
          </Link>

          {user && (
            <Link
              href="/dashboard"
              className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                isActive("/dashboard")
                  ? "text-accent-indigo bg-indigo-50 border border-indigo-200 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
              {enrollments.length > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-indigo-100 text-accent-indigo font-mono font-bold">
                  {enrollments.length}
                </span>
              )}
            </Link>
          )}

          <Link
            href="/about"
            className="px-3.5 py-2 rounded-lg transition-colors flex items-center gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            <Sparkles className="w-4 h-4" />
            About
          </Link>

          <Link
            href="/courses"
            className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              isActive("/courses")
                ? "text-accent-indigo bg-indigo-50 border border-indigo-200 font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Courses
          </Link>

          <Link
            href="/contact"
            className="px-3.5 py-2 rounded-lg transition-colors flex items-center gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            <Terminal className="w-4 h-4" />
            Contact
          </Link>

          {certificates.length > 0 && user && (
            <Link
              href={`/certificate/${certificates[0].id}`}
              className="px-3.5 py-2 rounded-lg transition-colors flex items-center gap-2 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50"
            >
              <Award className="w-4 h-4 text-accent-emerald" />
              Latest Cert
            </Link>
          )}
        </nav>

        {/* User / Auth CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-accent-indigo to-accent-cyan flex items-center justify-center font-bold text-xs text-white">
                  {user.fullName ? user.fullName[0].toUpperCase() : "U"}
                </div>
                <div className="text-left text-xs">
                  <div className="font-semibold text-slate-800 truncate max-w-[120px]">
                    {user.fullName || "Master Engineer"}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {user.email?.split("@")[0] || "user"}
                  </div>
                </div>
              </div>
              <button
                onClick={() => logout()}
                title="Sign Out"
                className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal("login")}
                className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuthModal("signup")}
                className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-accent-indigo to-indigo-600 hover:from-indigo-500 hover:to-indigo-700 rounded-lg shadow-md shadow-accent-indigo/25 transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Enroll & Certify
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 py-4 space-y-3 shadow-lg">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-accent-indigo bg-indigo-50 font-medium"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Link>

          {user && (
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-accent-indigo bg-indigo-50 font-medium"
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Student Dashboard
            </Link>
          )}

          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium"
          >
            About
          </Link>

          <Link
            href="/courses"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium"
          >
            Courses
          </Link>

          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 font-medium"
          >
            Contact
          </Link>

          {user ? (
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="text-sm text-slate-700">{user.email}</span>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-red-600 font-medium px-2 py-1 bg-red-50 rounded border border-red-200"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-200 flex gap-2">
              <button
                onClick={() => {
                  openAuthModal("login");
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 text-sm text-center font-medium bg-slate-100 rounded-lg text-slate-800"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  openAuthModal("signup");
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 text-sm text-center font-bold bg-accent-indigo text-white rounded-lg shadow"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
