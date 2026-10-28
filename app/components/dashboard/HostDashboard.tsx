"use client";

import React, { useState } from "react";
import { InvitationConfig, saveStoredConfig } from "@/lib/invitation-store";
import FeatureTogglesTab from "./FeatureTogglesTab";
import ContentEditorTab from "./ContentEditorTab";
import GuestManagerTab from "./GuestManagerTab";
import ShareTab from "./ShareTab";
import DesignTab from "./DesignTab";
import {
  SlidersHorizontal,
  FileEdit,
  Users,
  Share2,
  Palette,
  Eye,
} from "lucide-react";

interface HostDashboardProps {
  config: InvitationConfig;
  onConfigChange: (newConfig: InvitationConfig) => void;
  onViewGuestMode: () => void;
}

type DashboardTab = "features" | "content" | "guests" | "share" | "design";

export default function HostDashboard({
  config,
  onConfigChange,
  onViewGuestMode,
}: HostDashboardProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("features");

  const handleUpdate = (updated: InvitationConfig) => {
    onConfigChange(updated);
    saveStoredConfig(updated);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white pt-20 pb-24 px-3 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Dashboard Hero Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-linear-to-r from-neutral-900 via-neutral-900 to-neutral-800 border border-white/10 shadow-2xl">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-300/30 text-amber-200 text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Invitation Creator Studio</span>
            </div>
            <h1 className="font-ovo text-2xl sm:text-3xl uppercase tracking-wider text-white">
              {config.coupleNames} Wedding Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-white/60 mt-1 font-legan">
              Manage features, customize texts and event schedules, review RSVPs, and share personalized invitations.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onViewGuestMode}
              className="px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white text-black hover:bg-gray-200 transition shadow-lg flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>Preview as Guest</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-white/10 scrollbar-none">
          <button
            onClick={() => setActiveTab("features")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === "features"
                ? "bg-amber-300 text-black shadow-md"
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Feature Toggles & Sections</span>
          </button>

          <button
            onClick={() => setActiveTab("content")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === "content"
                ? "bg-amber-300 text-black shadow-md"
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`}
          >
            <FileEdit className="w-4 h-4" />
            <span>Content & Details Editor</span>
          </button>

          <button
            onClick={() => setActiveTab("guests")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === "guests"
                ? "bg-amber-300 text-black shadow-md"
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>RSVP & Guest Manager</span>
          </button>

          <button
            onClick={() => setActiveTab("share")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === "share"
                ? "bg-amber-300 text-black shadow-md"
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Personalized Links</span>
          </button>

          <button
            onClick={() => setActiveTab("design")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === "design"
                ? "bg-amber-300 text-black shadow-md"
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Themes & Visuals</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="pt-2">
          {activeTab === "features" && (
            <FeatureTogglesTab config={config} onChange={handleUpdate} />
          )}
          {activeTab === "content" && (
            <ContentEditorTab config={config} onChange={handleUpdate} />
          )}
          {activeTab === "guests" && <GuestManagerTab />}
          {activeTab === "share" && <ShareTab config={config} />}
          {activeTab === "design" && (
            <DesignTab config={config} onChange={handleUpdate} />
          )}
        </div>
      </div>
    </div>
  );
}
