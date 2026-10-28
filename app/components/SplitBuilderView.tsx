"use client";

import React, { useState } from "react";
import { InvitationConfig, saveStoredConfig } from "@/lib/invitation-store";
import FeatureTogglesTab from "./dashboard/FeatureTogglesTab";
import ContentEditorTab from "./dashboard/ContentEditorTab";
import GuestManagerTab from "./dashboard/GuestManagerTab";
import ShareTab from "./dashboard/ShareTab";
import DesignTab from "./dashboard/DesignTab";
import InvitiAppExperience from "./InvitiAppExperience";
import {
  SlidersHorizontal,
  FileEdit,
  Users,
  Share2,
  Palette,
  Eye,
  Smartphone,
} from "lucide-react";

interface SplitBuilderViewProps {
  config: InvitationConfig;
  onConfigChange: (newConfig: InvitationConfig) => void;
  onViewGuestMode: () => void;
}

type TabType = "features" | "content" | "guests" | "share" | "design";

export default function SplitBuilderView({
  config,
  onConfigChange,
  onViewGuestMode,
}: SplitBuilderViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>("features");

  const handleUpdate = (updated: InvitationConfig) => {
    onConfigChange(updated);
    saveStoredConfig(updated);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-16">
      <div className="grid lg:grid-cols-12 min-h-[calc(100vh-4rem)]">
        {/* Left Panel: Studio Controls & Tabs */}
        <div className="lg:col-span-7 border-r border-white/10 p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-4rem)] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h2 className="font-ovo text-lg uppercase font-bold text-white">Live Split Studio</h2>
              </div>
              <p className="text-xs text-white/50">
                Changes on the left update the interactive phone preview on the right instantly.
              </p>
            </div>

            <button
              onClick={onViewGuestMode}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-black hover:bg-gray-200 transition flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Full View</span>
            </button>
          </div>

          {/* Subtabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-white/10">
            <button
              onClick={() => setActiveTab("features")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === "features" ? "bg-amber-300 text-black shadow-sm" : "text-white/60 hover:text-white"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Sections & Toggles</span>
            </button>
            <button
              onClick={() => setActiveTab("content")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === "content" ? "bg-amber-300 text-black shadow-sm" : "text-white/60 hover:text-white"
              }`}
            >
              <FileEdit className="w-3.5 h-3.5" />
              <span>Content</span>
            </button>
            <button
              onClick={() => setActiveTab("guests")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === "guests" ? "bg-amber-300 text-black shadow-sm" : "text-white/60 hover:text-white"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>RSVPs</span>
            </button>
            <button
              onClick={() => setActiveTab("share")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === "share" ? "bg-amber-300 text-black shadow-sm" : "text-white/60 hover:text-white"
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Links</span>
            </button>
            <button
              onClick={() => setActiveTab("design")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === "design" ? "bg-amber-300 text-black shadow-sm" : "text-white/60 hover:text-white"
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Themes</span>
            </button>
          </div>

          <div>
            {activeTab === "features" && <FeatureTogglesTab config={config} onChange={handleUpdate} />}
            {activeTab === "content" && <ContentEditorTab config={config} onChange={handleUpdate} />}
            {activeTab === "guests" && <GuestManagerTab />}
            {activeTab === "share" && <ShareTab config={config} />}
            {activeTab === "design" && <DesignTab config={config} onChange={handleUpdate} />}
          </div>
        </div>

        {/* Right Panel: Interactive Phone Simulator Preview */}
        <div className="lg:col-span-5 bg-neutral-950 p-6 flex flex-col items-center justify-start overflow-y-auto max-h-[calc(100vh-4rem)]">
          <div className="flex items-center gap-2 mb-3 text-xs text-white/50">
            <Smartphone className="w-3.5 h-3.5 text-amber-300" />
            <span>Interactive Mobile Preview (Live)</span>
          </div>

          {/* Smartphone Bezel */}
          <div className="relative w-full max-w-[380px] h-[780px] rounded-[42px] border-4 border-neutral-700 bg-black shadow-2xl shadow-black overflow-hidden flex flex-col ring-1 ring-white/10">
            {/* Top Phone Speaker notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 w-24 h-4 bg-neutral-900 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-neutral-950 border border-neutral-800" />
            </div>

            {/* Embedded Live Invitation */}
            <div className="w-full h-full overflow-y-auto pt-6 scrollbar-none">
              <InvitiAppExperience config={config} isCompactPreview={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
