"use client";

import React from "react";
import {
  FeatureFlags,
  InvitationConfig,
  toggleFeature,
} from "@/lib/invitation-store";
import {
  CheckSquare,
  Music,
  Heart,
  Calendar,
  Clock,
  Palette,
  Gift,
  Music2,
  MessageSquare,
  Users,
  BookOpen,
  Video,
  Smartphone,
  Sparkles,
  RotateCcw,
} from "lucide-react";

interface FeatureTogglesTabProps {
  config: InvitationConfig;
  onChange: (newConfig: InvitationConfig) => void;
}

interface FeatureItemMeta {
  key: keyof FeatureFlags;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: "Core" | "Interactive" | "Media & Aesthetics";
}

const FEATURE_ITEMS: FeatureItemMeta[] = [
  {
    key: "rsvp",
    title: "RSVP & Attendance Confirmation",
    description: "Allows guests to submit attendance (Yes/No) and party size, tracked in your dashboard.",
    icon: CheckSquare,
    category: "Core",
  },
  {
    key: "events",
    title: "Event Schedule & Maps",
    description: "Holy Matrimony and Wedding Reception timing, venues, Google Maps links, and ICS calendar button.",
    icon: Calendar,
    category: "Core",
  },
  {
    key: "countdown",
    title: "Live Countdown Clock",
    description: "Displays live ticking days, hours, minutes, and seconds remaining until the wedding.",
    icon: Clock,
    category: "Core",
  },
  {
    key: "coupleProfiles",
    title: "Bride & Groom Profiles",
    description: "Portraits, nicknames, personal bio statements, and Instagram links for both bride and groom.",
    icon: Users,
    category: "Core",
  },
  {
    key: "story",
    title: "Love Story & Milestones",
    description: "Timeline chapters detailing how you met, grew together, and the engagement proposal.",
    icon: Heart,
    category: "Media & Aesthetics",
  },
  {
    key: "music",
    title: "Background Music Player",
    description: "Floating play/pause wedding music audio player for romantic guest ambiance.",
    icon: Music,
    category: "Media & Aesthetics",
  },
  {
    key: "storiesMode",
    title: "Instagram Stories Mode",
    description: "Full-screen tap-through stories presentation format popular on modern smartphones.",
    icon: Smartphone,
    category: "Media & Aesthetics",
  },
  {
    key: "sacredVerse",
    title: "Sacred Verse / Scripture Quote",
    description: "Inspirational wedding bible verse or romantic quote card on the invitation.",
    icon: BookOpen,
    category: "Media & Aesthetics",
  },
  {
    key: "dressCode",
    title: "Dress Code & Color Palette",
    description: "Attire recommendations and interactive palette swatches for guests' outfits.",
    icon: Palette,
    category: "Interactive",
  },
  {
    key: "digitalEnvelope",
    title: "Digital Envelope & Bank Accounts",
    description: "Cashless wedding gift accounts (BCA, Mandiri, etc.) with 1-click copy & QR code.",
    icon: Gift,
    category: "Interactive",
  },
  {
    key: "songRequest",
    title: "DJ Reception Song Request",
    description: "Crowdsource party songs from guests for your DJ playlist during the wedding reception.",
    icon: Music2,
    category: "Interactive",
  },
  {
    key: "guestbook",
    title: "Guestbook & Wishes Board",
    description: "Public message board with congratulations, floating heart animation, and pagination.",
    icon: MessageSquare,
    category: "Interactive",
  },
  {
    key: "livestream",
    title: "Virtual Livestream Broadcast",
    description: "YouTube/Zoom link banner for remote family and international guests to join virtually.",
    icon: Video,
    category: "Interactive",
  },
];

export default function FeatureTogglesTab({ config, onChange }: FeatureTogglesTabProps) {
  const handleToggle = (key: keyof FeatureFlags) => {
    const updated = toggleFeature(config, key);
    onChange(updated);
  };

  const handleEnableAll = () => {
    const allEnabled: FeatureFlags = {
      rsvp: true,
      music: true,
      story: true,
      events: true,
      countdown: true,
      dressCode: true,
      digitalEnvelope: true,
      songRequest: true,
      guestbook: true,
      coupleProfiles: true,
      sacredVerse: true,
      livestream: true,
      storiesMode: true,
    };
    onChange({ ...config, features: allEnabled });
  };

  const handleMinimalist = () => {
    const minimal: FeatureFlags = {
      rsvp: true,
      music: false,
      story: false,
      events: true,
      countdown: true,
      dressCode: true,
      digitalEnvelope: false,
      songRequest: false,
      guestbook: true,
      coupleProfiles: true,
      sacredVerse: false,
      livestream: false,
      storiesMode: false,
    };
    onChange({ ...config, features: minimal });
  };

  const enabledCount = Object.values(config.features).filter(Boolean).length;
  const totalCount = Object.keys(config.features).length;

  return (
    <div className="space-y-6">
      {/* Header and Quick Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-neutral-900 border border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-ovo text-lg uppercase text-white">Invitation Sections & Features</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-semibold border border-amber-400/30">
              {enabledCount} of {totalCount} Active
            </span>
          </div>
          <p className="text-xs text-white/60 mt-1">
            Toggle switches below to immediately add or remove any section from your guest invitation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleEnableAll}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Enable All</span>
          </button>
          <button
            onClick={handleMinimalist}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/15 text-white/80 border border-white/10 transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Minimalist Preset</span>
          </button>
        </div>
      </div>

      {/* Grid of Toggle Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURE_ITEMS.map((item) => {
          const isEnabled = config.features[item.key];
          const Icon = item.icon;

          return (
            <div
              key={item.key}
              className={`p-4 rounded-2xl border transition duration-200 flex flex-col justify-between ${
                isEnabled
                  ? "bg-neutral-900/90 border-amber-400/40 shadow-md shadow-amber-950/20"
                  : "bg-neutral-950/60 border-white/10 opacity-70"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isEnabled
                          ? "bg-amber-400/15 text-amber-300 border border-amber-400/30"
                          : "bg-white/5 text-white/40 border border-white/10"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white leading-tight">{item.title}</h4>
                      <span className="text-[10px] uppercase tracking-wider text-white/40">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Accessible iOS / InvitiApp style Toggle Switch */}
                  <button
                    role="switch"
                    aria-checked={isEnabled}
                    aria-label={`Toggle ${item.title}`}
                    onClick={() => handleToggle(item.key)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isEnabled ? "bg-emerald-500" : "bg-neutral-700"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        isEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <p className="text-[11px] text-white/60 leading-relaxed font-legan mt-2">
                  {item.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px]">
                <span className={isEnabled ? "text-emerald-400 font-semibold" : "text-white/40"}>
                  {isEnabled ? "Visible on Invitation" : "Removed / Hidden"}
                </span>
                <span className="text-white/40 text-[10px]">
                  {isEnabled ? "Live" : "Inactive"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
