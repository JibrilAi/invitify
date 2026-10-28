"use client";

import React from "react";
import { InvitationConfig, resetConfig } from "@/lib/invitation-store";
import { Check, RotateCcw } from "lucide-react";

interface DesignTabProps {
  config: InvitationConfig;
  onChange: (newConfig: InvitationConfig) => void;
}

interface ThemeOption {
  id: "midnight" | "terracotta" | "botanical" | "champagne";
  name: string;
  subtitle: string;
  primary: string;
  accent: string;
  bg: string;
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "midnight",
    name: "Midnight Noir",
    subtitle: "Classic Black & Gold Opulence",
    primary: "#0a0a0a",
    accent: "#fde68a",
    bg: "#171717",
  },
  {
    id: "terracotta",
    name: "Terracotta Blush",
    subtitle: "Warm Earthy Romance & Rose",
    primary: "#181110",
    accent: "#e28771",
    bg: "#241a18",
  },
  {
    id: "botanical",
    name: "Botanical Sage",
    subtitle: "Lush Evergreen & Forest Meadow",
    primary: "#0d1410",
    accent: "#87bba2",
    bg: "#142119",
  },
  {
    id: "champagne",
    name: "Champagne Gold",
    subtitle: "Warm Ivory, Linen & Bronze",
    primary: "#161413",
    accent: "#d8bb8e",
    bg: "#221e1a",
  },
];

export default function DesignTab({ config, onChange }: DesignTabProps) {
  const handleSelectTheme = (themeId: "midnight" | "terracotta" | "botanical" | "champagne") => {
    onChange({ ...config, theme: themeId });
  };

  const handleResetDefaults = () => {
    if (confirm("Reset all invitation settings, features, and texts to default template?")) {
      const reset = resetConfig();
      onChange(reset);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-neutral-900 border border-white/10 space-y-2">
        <h3 className="font-ovo text-lg uppercase text-white">Visual Design & Theme Palette</h3>
        <p className="text-xs text-white/60">
          Select an aesthetic styling preset for your digital invitation. All buttons, typography highlights, and backgrounds update in real time.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {THEME_OPTIONS.map((theme) => {
          const isSelected = config.theme === theme.id;
          return (
            <div
              key={theme.id}
              onClick={() => handleSelectTheme(theme.id)}
              className={`p-5 rounded-2xl border cursor-pointer transition duration-200 relative ${
                isSelected
                  ? "bg-neutral-900 border-amber-300 ring-1 ring-amber-300 shadow-xl"
                  : "bg-neutral-950/70 border-white/10 hover:border-white/30"
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-amber-300 text-black flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl border border-white/20 flex items-center justify-center shadow-inner"
                  style={{ backgroundColor: theme.primary }}
                >
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: theme.accent }}
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-ovo">{theme.name}</h4>
                  <p className="text-[11px] text-white/50">{theme.subtitle}</p>
                </div>
              </div>

              {/* Mini Preview Swatches */}
              <div className="flex items-center gap-2 pt-2">
                <div
                  className="flex-1 h-3 rounded-full border border-white/10"
                  style={{ backgroundColor: theme.primary }}
                />
                <div
                  className="flex-1 h-3 rounded-full border border-white/10"
                  style={{ backgroundColor: theme.bg }}
                />
                <div
                  className="flex-1 h-3 rounded-full border border-white/10"
                  style={{ backgroundColor: theme.accent }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-6 border-t border-white/10 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-white">Reset to Default Template</h4>
          <p className="text-[11px] text-white/50">
            Revert all edits, re-enable standard features, and reload initial demo data.
          </p>
        </div>
        <button
          onClick={handleResetDefaults}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-950/60 hover:bg-red-900/80 text-red-200 border border-red-500/30 transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Settings</span>
        </button>
      </div>
    </div>
  );
}
