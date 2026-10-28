"use client";

import React, { use, useState, useEffect } from "react";
import {
  InvitationConfig,
  useInvitationConfig,
  useHostAuth,
} from "@/lib/invitation-store";
import HostTopBar, { AppDisplayMode } from "../components/dashboard/HostTopBar";
import HostDashboard from "../components/dashboard/HostDashboard";
import HostLoginModal from "../components/dashboard/HostLoginModal";
import SplitBuilderView from "../components/SplitBuilderView";
import InvitiAppExperience from "../components/InvitiAppExperience";

type ParamsProps = {
  params: Promise<{ slug: string }>;
};

export default function GuestHome({ params }: ParamsProps) {
  const { slug } = use(params);
  const normalizedSlug = (slug || "").toLowerCase();
  const isDashboardSlug =
    normalizedSlug === "dashboard" ||
    normalizedSlug === "admin" ||
    normalizedSlug === "host";
  const isBuilderSlug =
    normalizedSlug === "builder" || normalizedSlug === "split";
  const isLoginSlug = normalizedSlug === "login";

  const name =
    isDashboardSlug || isBuilderSlug || isLoginSlug
      ? ""
      : slug?.startsWith("to%3A")
      ? decodeURIComponent(slug.slice(5))
      : slug?.startsWith("to:")
      ? decodeURIComponent(slug.slice(3))
      : decodeURIComponent(slug || "");

  const [config, setConfig] = useInvitationConfig();
  const [isAuthenticated, setIsAuthenticated] = useHostAuth();
  const [displayMode, setDisplayMode] = useState<AppDisplayMode>(
    isDashboardSlug ? "dashboard" : isBuilderSlug ? "split" : "guest"
  );
  const [showLoginModal, setShowLoginModal] = useState(isLoginSlug);

  useEffect(() => {
    if (isDashboardSlug || isBuilderSlug) {
      setIsAuthenticated(true);
    }
  }, [isDashboardSlug, isBuilderSlug, setIsAuthenticated]);

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
        onOpenShare={() => {
          if (!isAuthenticated) {
            setShowLoginModal(true);
          } else {
            setDisplayMode("dashboard");
          }
        }}
        coupleNames={config.coupleNames}
      />

      {displayMode === "guest" && (
        <div className="pt-12">
          <InvitiAppExperience config={config} initialGuestName={name} />
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
