"use client";

import React, { useState, useEffect } from "react";
import {
  InvitationConfig,
  useInvitationConfig,
  useHostAuth,
} from "@/lib/invitation-store";
import SplitBuilderView from "../components/SplitBuilderView";
import HostDashboard from "../components/dashboard/HostDashboard";
import HostTopBar, { AppDisplayMode } from "../components/dashboard/HostTopBar";
import InvitiAppExperience from "../components/InvitiAppExperience";
import HostLoginModal from "../components/dashboard/HostLoginModal";

export default function BuilderPage() {
  const [config, setConfig] = useInvitationConfig();
  const [isAuthenticated, setIsAuthenticated] = useHostAuth();
  const [displayMode, setDisplayMode] = useState<AppDisplayMode>("split");
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    setIsAuthenticated(true);
  }, [setIsAuthenticated]);

  const handleConfigChange = (newConfig: InvitationConfig) => {
    setConfig(newConfig);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setDisplayMode("guest");
  };


  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <HostTopBar
        currentMode={displayMode}
        onModeChange={(mode) => setDisplayMode(mode)}
        isAuthenticated={isAuthenticated}
        onOpenLogin={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        onOpenShare={() => setDisplayMode("dashboard")}
        coupleNames={config.coupleNames}
      />

      {displayMode === "split" && (
        <SplitBuilderView
          config={config}
          onConfigChange={handleConfigChange}
          onViewGuestMode={() => setDisplayMode("guest")}
        />
      )}

      {displayMode === "dashboard" && (
        <HostDashboard
          config={config}
          onConfigChange={handleConfigChange}
          onViewGuestMode={() => setDisplayMode("guest")}
        />
      )}

      {displayMode === "guest" && (
        <div className="pt-12">
          <InvitiAppExperience config={config} />
        </div>
      )}

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
