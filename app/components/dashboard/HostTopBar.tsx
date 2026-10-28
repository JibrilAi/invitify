"use client";

import React from "react";
import {
  Sparkles,
  LayoutDashboard,
  Eye,
  Columns,
  LogOut,
  LogIn,
  Share2,
} from "lucide-react";

export type AppDisplayMode = "guest" | "dashboard" | "split";

interface HostTopBarProps {
  currentMode: AppDisplayMode;
  onModeChange: (mode: AppDisplayMode) => void;
  isAuthenticated: boolean;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenShare: () => void;
  coupleNames: string;
}

export default function HostTopBar({
  currentMode,
  onModeChange,
  isAuthenticated,
  onOpenLogin,
  onLogout,
  onOpenShare,
  coupleNames,
}: HostTopBarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10 px-2 sm:px-6 py-2 transition">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Brand / Mode Indicator */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-ovo text-xs sm:text-sm uppercase tracking-wider text-white font-bold hidden xs:inline">
              InvitiApp
            </span>
          </div>

          <div className="h-4 w-px bg-white/20 hidden sm:block" />

          {/* Mode Switcher Buttons */}
          <div className="flex items-center bg-white/10 p-0.5 sm:p-1 rounded-full border border-white/15">
            <button
              onClick={() => onModeChange("guest")}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold transition ${
                currentMode === "guest"
                  ? "bg-white text-black shadow-sm"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <Eye className="w-3.5 h-3.5 shrink-0" />
              <span>Guest</span>
            </button>

            <button
              onClick={() => {
                if (!isAuthenticated) {
                  onOpenLogin();
                } else {
                  onModeChange("dashboard");
                }
              }}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold transition ${
                currentMode === "dashboard"
                  ? "bg-amber-300 text-black shadow-sm font-bold"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />
              <span>Host Studio</span>
            </button>

            <button
              onClick={() => {
                if (!isAuthenticated) {
                  onOpenLogin();
                } else {
                  onModeChange("split");
                }
              }}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition ${
                currentMode === "split"
                  ? "bg-white text-black shadow-sm"
                  : "text-white/70 hover:text-white"
              }`}
              title="Split Screen: Edit in Dashboard on Left, Live Preview on Right"
            >
              <Columns className="w-3.5 h-3.5 shrink-0" />
              <span>Split Builder</span>
            </button>
          </div>
        </div>

        {/* Right Area: Couple info & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {isAuthenticated ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[11px]">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>Host: {coupleNames}</span>
              </span>

              <button
                onClick={onOpenShare}
                className="flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-white/10 hover:bg-white/20 text-white border border-white/20 transition"
                title="Generate Guest Invite Links"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-200" />
                <span className="hidden sm:inline">Invite Link</span>
              </button>

              <button
                onClick={onLogout}
                className="flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-white/5 hover:bg-red-500/20 hover:text-red-300 text-white/70 border border-white/10 transition"
                title="Log Out of Host Studio"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs font-semibold bg-amber-300 hover:bg-amber-200 text-black transition shadow-sm shrink-0"
            >
              <LogIn className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden xs:inline">Host Login</span>
              <span className="xs:hidden">Login</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
