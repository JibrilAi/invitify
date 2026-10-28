"use client";

import React, { useState, useEffect } from "react";
import {
  InvitationConfig,
  useInvitationConfig,
  useHostAuth,
} from "@/lib/invitation-store";
import HostTopBar, { AppDisplayMode } from "./components/dashboard/HostTopBar";
import HostDashboard from "./components/dashboard/HostDashboard";
import HostLoginModal from "./components/dashboard/HostLoginModal";
import SplitBuilderView from "./components/SplitBuilderView";
import InvitiAppExperience from "./components/InvitiAppExperience";
import { SlidersHorizontal, Sparkles } from "lucide-react";

export default function Home() {
  const [config, setConfig] = useInvitationConfig();
  const [isAuthenticated, setIsAuthenticated] = useHostAuth();

  const [guestNameFromUrl] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get("to") || "";
    }
    return "";
  });

  const [displayMode, setDisplayMode] = useState<AppDisplayMode>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const modeParam = params.get("mode");
      if (modeParam === "dashboard" || params.has("dashboard") || params.has("admin") || params.has("edit")) {
        return "dashboard";
      }
      if (modeParam === "builder" || modeParam === "split" || params.has("builder") || params.has("split")) {
        return "split";
      }
    }
    return "guest";
  });

  const [showLoginModal, setShowLoginModal] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).has("login");
    }
    return false;
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get("mode");
    if (
      modeParam === "dashboard" ||
      params.has("dashboard") ||
      params.has("admin") ||
      params.has("edit") ||
      modeParam === "builder" ||
      modeParam === "split" ||
      params.has("builder") ||
      params.has("split")
    ) {
      setIsAuthenticated(true);
    }
  }, [setIsAuthenticated]);


  const handleConfigChange = (newConfig: InvitationConfig) => {
    setConfig(newConfig);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setDisplayMode("guest");
  };

  const handleOpenHostStudio = () => {
    if (isAuthenticated) {
      setDisplayMode("dashboard");
    } else {
      setShowLoginModal(true);
    }
  };


  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top Floating Control Dock */}
      <HostTopBar
        currentMode={displayMode}
        onModeChange={(mode) => setDisplayMode(mode)}
        isAuthenticated={isAuthenticated}
        onOpenLogin={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        onOpenShare={() => {
          if (!isAuthenticated) {
            setShowLoginModal(true);
          } else {
            setDisplayMode("dashboard");
          }
        }}
        coupleNames={config.coupleNames}
      />

      {/* Main Mode View */}
      {displayMode === "guest" && (
        <div className="pt-12 relative">
          <InvitiAppExperience
            config={config}
            initialGuestName={guestNameFromUrl}
          />

          {/* Persistent Floating Quick Access Dock to Host Studio */}
          <div className="fixed bottom-6 right-4 sm:right-6 z-40 flex items-center gap-2">
            <button
              onClick={handleOpenHostStudio}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-linear-to-r from-amber-400 via-amber-300 to-amber-200 text-black font-bold text-xs shadow-[0_8px_25px_rgba(251,191,36,0.4)] hover:shadow-[0_12px_32px_rgba(251,191,36,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Open Host Studio to customize sections, edit texts, or remove features"
            >
              {isAuthenticated ? (
                <>
                  <SlidersHorizontal className="w-4 h-4 text-black shrink-0" />
                  <span>Host Studio (Edit Invite)</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black shrink-0" />
                  <span>Host Studio & Customizer</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {displayMode === "dashboard" && (
        <HostDashboard
          config={config}
          onConfigChange={handleConfigChange}
          onViewGuestMode={() => setDisplayMode("guest")}
        />
      )}

      {displayMode === "split" && (
        <SplitBuilderView
          config={config}
          onConfigChange={handleConfigChange}
          onViewGuestMode={() => setDisplayMode("guest")}
        />
      )}

      {/* Host Login Modal */}
      <HostLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => {
          setIsAuthenticated(true);
          setDisplayMode("dashboard");
        }}
      />
    </div>
  );
}
