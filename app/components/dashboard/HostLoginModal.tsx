"use client";

import React, { useState } from "react";
import { Lock, KeyRound, Sparkles, X, Check, AlertCircle } from "lucide-react";
import { loginHost } from "@/lib/invitation-store";

interface HostLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function HostLoginModal({ isOpen, onClose, onSuccess }: HostLoginModalProps) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;
    setError(null);
    setIsLoading(true);
    const result = await loginHost({ passcode });
    setIsLoading(false);
    if (result.success) {
      onSuccess();
      onClose();
    } else {
      setError(result.error || "Incorrect passcode. Try 'admin', '1234', or 'inviti'.");
    }
  };

  const handleQuickDemoLogin = async () => {
    setError(null);
    setIsLoading(true);
    const result = await loginHost({ quickAccess: true });
    setIsLoading(false);
    if (result.success) {
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-neutral-900 border border-amber-200/30 p-6 sm:p-8 shadow-2xl text-white space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-200">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-ovo text-xl uppercase tracking-wider text-white">Host & Creator Studio</h3>
              <p className="text-xs text-white/60">Log in to customize & remove features</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-white/80 leading-relaxed font-legan">
          Log in as the wedding couple to customize invitation details, toggle/remove sections, review RSVPs, and generate personalized guest links like Invitiapp.
        </p>

        {/* 1-Click Instant Access Banner */}
        <div className="p-3.5 rounded-2xl bg-linear-to-r from-amber-500/20 via-amber-400/10 to-transparent border border-amber-400/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-300" />
              Quick Instant Demo Access
            </span>
            <span className="text-[10px] bg-amber-400/30 text-amber-100 px-2 py-0.5 rounded-full font-mono">
              Ready
            </span>
          </div>
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-amber-300 hover:bg-amber-200 text-black shadow-md transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>Enter Host Studio (1-Click)</span>
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Standard Passcode Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-white/70">
                Host Access Code
              </label>
              <div className="flex items-center gap-1 text-[11px]">
                <span className="text-white/40">Presets:</span>
                <button
                  type="button"
                  onClick={() => setPasscode("admin")}
                  className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-amber-200 font-mono text-[10px] transition"
                >
                  admin
                </button>
                <button
                  type="button"
                  onClick={() => setPasscode("1234")}
                  className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-amber-200 font-mono text-[10px] transition"
                >
                  1234
                </button>
              </div>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter 'admin' or '1234'"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                autoFocus
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-amber-300 transition"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white border border-white/20 transition flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{isLoading ? "Verifying..." : "Login with Code"}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-white/60 hover:text-white bg-white/5 hover:bg-white/10 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
