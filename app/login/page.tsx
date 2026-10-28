"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  KeyRound,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { loginHost, checkHostSession } from "@/lib/invitation-store";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"passcode" | "email">("passcode");
  const [passcode, setPasscode] = useState("");
  const [email, setEmail] = useState("admin@invitiapp.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // If already authenticated on backend, redirect straight to dashboard
  useEffect(() => {
    checkHostSession().then((isAuth) => {
      if (isAuth) {
        router.push("/dashboard");
      }
    });
  }, [router]);

  const handlePasscodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setError("Please enter a passcode");
      return;
    }
    setIsLoading(true);
    setError(null);

    const result = await loginHost({ passcode });
    setIsLoading(false);

    if (result.success) {
      setSuccess("Host authenticated successfully! Opening dashboard...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } else {
      setError(result.error || "Incorrect passcode. Try 'admin', '1234', or 'inviti'.");
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await loginHost({ email, password });
    setIsLoading(false);

    if (result.success) {
      setSuccess("Logged in successfully! Redirecting...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } else {
      setError(result.error || "Invalid email or password.");
    }
  };

  const handleQuickDemo = async () => {
    setIsLoading(true);
    setError(null);
    const result = await loginHost({ quickAccess: true });
    setIsLoading(false);
    if (result.success) {
      setSuccess("Instant Host Access granted! Opening dashboard...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 400);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 max-w-5xl mx-auto w-full flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-linear-to-tr from-amber-400 to-amber-200 flex items-center justify-center text-black font-serif font-bold text-sm shadow-md">
            I
          </div>
          <span className="font-ovo tracking-widest text-lg font-light text-amber-100/90 group-hover:text-amber-200 transition">
            INVITIAPP
          </span>
        </Link>

        <Link
          href="/"
          className="text-xs tracking-wider uppercase text-white/60 hover:text-white px-3 py-1.5 rounded-full border border-white/10 hover:border-white/30 transition flex items-center gap-1.5"
        >
          <span>View Guest Invite</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Login Card */}
      <main className="relative z-10 max-w-md w-full mx-auto my-auto py-8">
        <div className="rounded-3xl bg-neutral-900/90 backdrop-blur-xl border border-amber-200/20 p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Card Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/15 border border-amber-300/30 flex items-center justify-center text-amber-200 mx-auto shadow-inner">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-ovo text-2xl uppercase tracking-wider text-white">
              Host & Creator Login
            </h1>
            <p className="text-xs text-white/60 leading-relaxed font-legan">
              Access the live wedding studio to toggle features, edit schedules, manage RSVP guests, and customize designs.
            </p>
          </div>

          {/* 1-Click Demo Access */}
          <div className="p-4 rounded-2xl bg-linear-to-r from-amber-500/20 via-amber-400/10 to-transparent border border-amber-400/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-300" />
                Quick 1-Click Host Entry
              </span>
              <span className="text-[10px] bg-amber-400/30 text-amber-100 px-2 py-0.5 rounded-full font-mono font-medium">
                Instant
              </span>
            </div>
            <button
              type="button"
              onClick={handleQuickDemo}
              disabled={isLoading}
              className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-amber-300 hover:bg-amber-200 active:scale-98 text-black shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>Enter Host Studio (1-Click)</span>
            </button>
          </div>

          {/* Tab Selector */}
          <div className="flex rounded-xl bg-white/5 p-1 border border-white/10">
            <button
              type="button"
              onClick={() => {
                setAuthMode("passcode");
                setError(null);
              }}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition ${
                authMode === "passcode"
                  ? "bg-amber-400/20 text-amber-200 font-semibold"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Access Passcode
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode("email");
                setError(null);
              }}
              className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition ${
                authMode === "email"
                  ? "bg-amber-400/20 text-amber-200 font-semibold"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Email & Password
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Passcode Form */}
          {authMode === "passcode" && (
            <form onSubmit={handlePasscodeSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-white/70">
                    Host Passcode
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
                    <button
                      type="button"
                      onClick={() => setPasscode("inviti")}
                      className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-amber-200 font-mono text-[10px] transition"
                    >
                      inviti
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 border border-white/20 text-white transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{isLoading ? "Authenticating..." : "Log In with Passcode"}</span>
              </button>
            </form>
          )}

          {/* Email / Password Form */}
          {authMode === "email" && (
            <form onSubmit={handleEmailSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@invitiapp.com"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-amber-300 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-white/70">
                    Password
                  </label>
                  <span className="text-[10px] text-white/40">Demo: admin123</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="admin123"
                    className="w-full pl-9 pr-9 py-2.5 text-xs rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-amber-300 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 border border-white/20 text-white transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{isLoading ? "Signing In..." : "Sign In to Studio"}</span>
              </button>
            </form>
          )}

          {/* Quick links footer */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
            <Link href="/builder" className="hover:text-amber-200 transition">
              Live Split Builder →
            </Link>
            <Link href="/dashboard" className="hover:text-amber-200 transition">
              Direct Dashboard →
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-4 text-xs text-white/40">
        <p>InvitiApp Wedding Creator Platform • Full-Stack Backend Sync Active</p>
      </footer>
    </div>
  );
}
