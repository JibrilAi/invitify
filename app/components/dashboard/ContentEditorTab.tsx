"use client";

import React, { useState } from "react";
import {
  InvitationConfig,
  MilestoneItem,
  BankAccountItem,
} from "@/lib/invitation-store";
import {
  Users,
  Calendar,
  Heart,
  Gift,
  Palette,
  BookOpen,
  Plus,
  Trash2,
  Check,
} from "lucide-react";

interface ContentEditorTabProps {
  config: InvitationConfig;
  onChange: (newConfig: InvitationConfig) => void;
}

type SubSection = "couple" | "schedule" | "story" | "gifts" | "dresscode" | "verse";

const PHOTO_OPTIONS = [
  { label: "Classic Portrait (foto_3.jpg)", value: "/foto_3.jpg" },
  { label: "Romantic Bride (foto_1.jpg)", value: "/foto_1.jpg" },
  { label: "Together Evening (foto_2.jpg)", value: "/foto_2.jpg" },
  { label: "Sunset Embrace (foto_4.jpg)", value: "/foto_4.jpg" },
  { label: "Editorial Slide 1 (slide_1.jpg)", value: "/slide_1.jpg" },
  { label: "Editorial Slide 2 (slide_2.jpg)", value: "/slide_2.jpg" },
];

export default function ContentEditorTab({ config, onChange }: ContentEditorTabProps) {
  const [activeSub, setActiveSub] = useState<SubSection>("couple");
  const [saveToast, setSaveToast] = useState(false);

  const notifyChange = (updated: InvitationConfig) => {
    onChange(updated);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  // Sub-handlers for Milestones
  const handleAddMilestone = () => {
    const newItem: MilestoneItem = {
      id: `story-${Date.now()}`,
      year: "New Milestone",
      title: "Our Special Moment",
      content: "Write a heartwarming memory of this chapter here...",
    };
    notifyChange({
      ...config,
      story: {
        ...config.story,
        items: [...config.story.items, newItem],
      },
    });
  };

  const handleUpdateMilestone = (index: number, field: keyof MilestoneItem, value: string) => {
    const copy = [...config.story.items];
    copy[index] = { ...copy[index], [field]: value };
    notifyChange({
      ...config,
      story: { ...config.story, items: copy },
    });
  };

  const handleDeleteMilestone = (index: number) => {
    const copy = config.story.items.filter((_, idx) => idx !== index);
    notifyChange({
      ...config,
      story: { ...config.story, items: copy },
    });
  };

  // Sub-handlers for Bank Accounts
  const handleAddAccount = () => {
    const newAcc: BankAccountItem = {
      id: `acc-${Date.now()}`,
      bankName: "BANK BCA",
      accountNumber: "0000-0000-00",
      accountHolder: config.coupleNames,
    };
    notifyChange({
      ...config,
      digitalEnvelope: {
        ...config.digitalEnvelope,
        accounts: [...config.digitalEnvelope.accounts, newAcc],
      },
    });
  };

  const handleUpdateAccount = (index: number, field: keyof BankAccountItem, value: string) => {
    const copy = [...config.digitalEnvelope.accounts];
    copy[index] = { ...copy[index], [field]: value };
    notifyChange({
      ...config,
      digitalEnvelope: { ...config.digitalEnvelope, accounts: copy },
    });
  };

  const handleDeleteAccount = (index: number) => {
    const copy = config.digitalEnvelope.accounts.filter((_, idx) => idx !== index);
    notifyChange({
      ...config,
      digitalEnvelope: { ...config.digitalEnvelope, accounts: copy },
    });
  };

  return (
    <div className="space-y-6">
      {/* Sub Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-neutral-900 border border-white/10">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveSub("couple")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              activeSub === "couple" ? "bg-white text-black shadow-sm" : "text-white/70 hover:text-white"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Couple Profile</span>
          </button>

          <button
            onClick={() => setActiveSub("schedule")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              activeSub === "schedule" ? "bg-white text-black shadow-sm" : "text-white/70 hover:text-white"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Date & Venues</span>
          </button>

          <button
            onClick={() => setActiveSub("story")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              activeSub === "story" ? "bg-white text-black shadow-sm" : "text-white/70 hover:text-white"
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Love Story</span>
          </button>

          <button
            onClick={() => setActiveSub("gifts")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              activeSub === "gifts" ? "bg-white text-black shadow-sm" : "text-white/70 hover:text-white"
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Bank & Gifts</span>
          </button>

          <button
            onClick={() => setActiveSub("dresscode")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              activeSub === "dresscode" ? "bg-white text-black shadow-sm" : "text-white/70 hover:text-white"
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Dress Code</span>
          </button>

          <button
            onClick={() => setActiveSub("verse")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
              activeSub === "verse" ? "bg-white text-black shadow-sm" : "text-white/70 hover:text-white"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Sacred Verse</span>
          </button>
        </div>

        {saveToast && (
          <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs animate-fadeIn">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Saved & Synced!</span>
          </div>
        )}
      </div>

      {/* SECTION 1: COUPLE PROFILE */}
      {activeSub === "couple" && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-neutral-900 border border-white/10 space-y-4">
            <h4 className="font-ovo text-base uppercase text-white">General Display</h4>
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">
                Couple Headline (e.g. Mikha & Clara)
              </label>
              <input
                type="text"
                value={config.coupleNames}
                onChange={(e) => notifyChange({ ...config, coupleNames: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-amber-300"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Groom Details */}
            <div className="p-5 rounded-2xl bg-neutral-900 border border-white/10 space-y-4">
              <h4 className="font-ovo text-base uppercase text-amber-200">The Groom</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={config.groom.name}
                    onChange={(e) =>
                      notifyChange({
                        ...config,
                        groom: { ...config.groom, name: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Nickname</label>
                  <input
                    type="text"
                    value={config.groom.nickName}
                    onChange={(e) =>
                      notifyChange({
                        ...config,
                        groom: { ...config.groom, nickName: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Instagram (@handle)</label>
                  <input
                    type="text"
                    value={config.groom.instagram}
                    onChange={(e) =>
                      notifyChange({
                        ...config,
                        groom: { ...config.groom, instagram: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Photo Asset</label>
                  <select
                    value={config.groom.photo}
                    onChange={(e) =>
                      notifyChange({
                        ...config,
                        groom: { ...config.groom, photo: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-800 border border-white/20 text-white focus:outline-none"
                  >
                    {PHOTO_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Bio / About Statement</label>
                  <textarea
                    rows={3}
                    value={config.groom.bio}
                    onChange={(e) =>
                      notifyChange({
                        ...config,
                        groom: { ...config.groom, bio: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none font-legan"
                  />
                </div>
              </div>
            </div>

            {/* Bride Details */}
            <div className="p-5 rounded-2xl bg-neutral-900 border border-white/10 space-y-4">
              <h4 className="font-ovo text-base uppercase text-amber-200">The Bride</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={config.bride.name}
                    onChange={(e) =>
                      notifyChange({
                        ...config,
                        bride: { ...config.bride, name: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Nickname</label>
                  <input
                    type="text"
                    value={config.bride.nickName}
                    onChange={(e) =>
                      notifyChange({
                        ...config,
                        bride: { ...config.bride, nickName: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Instagram (@handle)</label>
                  <input
                    type="text"
                    value={config.bride.instagram}
                    onChange={(e) =>
                      notifyChange({
                        ...config,
                        bride: { ...config.bride, instagram: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Photo Asset</label>
                  <select
                    value={config.bride.photo}
                    onChange={(e) =>
                      notifyChange({
                        ...config,
                        bride: { ...config.bride, photo: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-800 border border-white/20 text-white focus:outline-none"
                  >
                    {PHOTO_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Bio / About Statement</label>
                  <textarea
                    rows={3}
                    value={config.bride.bio}
                    onChange={(e) =>
                      notifyChange({
                        ...config,
                        bride: { ...config.bride, bio: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none font-legan"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: SCHEDULE & VENUES */}
      {activeSub === "schedule" && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-neutral-900 border border-white/10 space-y-3">
            <h4 className="font-ovo text-base uppercase text-white">Event Date & Countdown Target</h4>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">
                  Wedding Date (ISO timestamp)
                </label>
                <input
                  type="text"
                  value={config.eventDate}
                  onChange={(e) => notifyChange({ ...config, eventDate: e.target.value })}
                  placeholder="2026-12-21T10:00:00"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Holy Matrimony */}
            <div className="p-5 rounded-2xl bg-neutral-900 border border-white/10 space-y-3">
              <h4 className="font-ovo text-base uppercase text-amber-200">Holy Matrimony</h4>
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Time</label>
                <input
                  type="text"
                  value={config.venues.holyMatrimony.time}
                  onChange={(e) =>
                    notifyChange({
                      ...config,
                      venues: {
                        ...config.venues,
                        holyMatrimony: { ...config.venues.holyMatrimony, time: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Place Name</label>
                <input
                  type="text"
                  value={config.venues.holyMatrimony.place}
                  onChange={(e) =>
                    notifyChange({
                      ...config,
                      venues: {
                        ...config.venues,
                        holyMatrimony: { ...config.venues.holyMatrimony, place: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Address Details</label>
                <input
                  type="text"
                  value={config.venues.holyMatrimony.place_details}
                  onChange={(e) =>
                    notifyChange({
                      ...config,
                      venues: {
                        ...config.venues,
                        holyMatrimony: { ...config.venues.holyMatrimony, place_details: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Google Maps Link</label>
                <input
                  type="text"
                  value={config.venues.holyMatrimony.googleMapsLink}
                  onChange={(e) =>
                    notifyChange({
                      ...config,
                      venues: {
                        ...config.venues,
                        holyMatrimony: { ...config.venues.holyMatrimony, googleMapsLink: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Reception */}
            <div className="p-5 rounded-2xl bg-neutral-900 border border-white/10 space-y-3">
              <h4 className="font-ovo text-base uppercase text-amber-200">Wedding Reception</h4>
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Time</label>
                <input
                  type="text"
                  value={config.venues.weddingReception.time}
                  onChange={(e) =>
                    notifyChange({
                      ...config,
                      venues: {
                        ...config.venues,
                        weddingReception: { ...config.venues.weddingReception, time: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Place Name</label>
                <input
                  type="text"
                  value={config.venues.weddingReception.place}
                  onChange={(e) =>
                    notifyChange({
                      ...config,
                      venues: {
                        ...config.venues,
                        weddingReception: { ...config.venues.weddingReception, place: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Address Details</label>
                <input
                  type="text"
                  value={config.venues.weddingReception.place_details}
                  onChange={(e) =>
                    notifyChange({
                      ...config,
                      venues: {
                        ...config.venues,
                        weddingReception: { ...config.venues.weddingReception, place_details: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Google Maps Link</label>
                <input
                  type="text"
                  value={config.venues.weddingReception.googleMapsLink}
                  onChange={(e) =>
                    notifyChange({
                      ...config,
                      venues: {
                        ...config.venues,
                        weddingReception: { ...config.venues.weddingReception, googleMapsLink: e.target.value },
                      },
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: LOVE STORY */}
      {activeSub === "story" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-ovo text-base uppercase text-white">Love Story Milestones</h4>
              <p className="text-xs text-white/60">Customize the chronological chapters of your romance.</p>
            </div>
            <button
              onClick={handleAddMilestone}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-300 text-black hover:bg-amber-200 transition flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Chapter</span>
            </button>
          </div>

          <div className="space-y-3">
            {config.story.items.map((item, idx) => (
              <div key={item.id} className="p-4 rounded-2xl bg-neutral-900 border border-white/10 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-amber-200">Chapter {idx + 1}</span>
                  <button
                    onClick={() => handleDeleteMilestone(idx)}
                    className="p-1 rounded-lg text-white/40 hover:text-red-400 transition"
                    title="Delete milestone"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-white/70 mb-1">Timeline Year Label</label>
                    <input
                      type="text"
                      value={item.year}
                      onChange={(e) => handleUpdateMilestone(idx, "year", e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-white/70 mb-1">Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleUpdateMilestone(idx, "title", e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-white/70 mb-1">Content</label>
                  <textarea
                    rows={2}
                    value={item.content}
                    onChange={(e) => handleUpdateMilestone(idx, "content", e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none font-legan"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: BANK ACCOUNTS & GIFTS */}
      {activeSub === "gifts" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-ovo text-base uppercase text-white">Digital Envelope Accounts</h4>
              <p className="text-xs text-white/60">Manage bank accounts where guests can transfer gifts.</p>
            </div>
            <button
              onClick={handleAddAccount}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-300 text-black hover:bg-amber-200 transition flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Bank Account</span>
            </button>
          </div>

          <div className="space-y-3">
            {config.digitalEnvelope.accounts.map((acc, idx) => (
              <div key={acc.id} className="p-4 rounded-2xl bg-neutral-900 border border-white/10 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-amber-200">Account #{idx + 1}</span>
                  <button
                    onClick={() => handleDeleteAccount(idx)}
                    className="p-1 rounded-lg text-white/40 hover:text-red-400 transition"
                    title="Delete account"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-white/70 mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={acc.bankName}
                      onChange={(e) => handleUpdateAccount(idx, "bankName", e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-white/70 mb-1">Account Number</label>
                    <input
                      type="text"
                      value={acc.accountNumber}
                      onChange={(e) => handleUpdateAccount(idx, "accountNumber", e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-white/70 mb-1">Account Holder</label>
                    <input
                      type="text"
                      value={acc.accountHolder}
                      onChange={(e) => handleUpdateAccount(idx, "accountHolder", e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: DRESS CODE */}
      {activeSub === "dresscode" && (
        <div className="space-y-4 p-5 rounded-2xl bg-neutral-900 border border-white/10">
          <h4 className="font-ovo text-base uppercase text-white">Dress Code & Palette Guidance</h4>
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1">Attire Advice Note</label>
            <textarea
              rows={3}
              value={config.dressCode.note}
              onChange={(e) =>
                notifyChange({
                  ...config,
                  dressCode: { ...config.dressCode, note: e.target.value },
                })
              }
              className="w-full px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none font-legan"
            />
          </div>

          <div className="pt-2">
            <label className="block text-xs font-medium text-white/70 mb-2">Palette Colors</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {config.dressCode.colors.map((color, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full border border-white/30"
                      style={{ backgroundColor: color.hex }}
                    />
                    <input
                      type="text"
                      value={color.name}
                      onChange={(e) => {
                        const copy = [...config.dressCode.colors];
                        copy[idx] = { ...copy[idx], name: e.target.value };
                        notifyChange({
                          ...config,
                          dressCode: { ...config.dressCode, colors: copy },
                        });
                      }}
                      className="w-full px-2 py-1 text-xs rounded-lg bg-white/10 text-white focus:outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    value={color.hex}
                    onChange={(e) => {
                      const copy = [...config.dressCode.colors];
                      copy[idx] = { ...copy[idx], hex: e.target.value };
                      notifyChange({
                        ...config,
                        dressCode: { ...config.dressCode, colors: copy },
                      });
                    }}
                    className="w-full px-2 py-1 text-[11px] rounded-lg bg-white/10 text-white/80 focus:outline-none font-mono"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: SACRED VERSE */}
      {activeSub === "verse" && (
        <div className="space-y-4 p-5 rounded-2xl bg-neutral-900 border border-white/10">
          <h4 className="font-ovo text-base uppercase text-white">Sacred Scripture / Quote</h4>
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1">Reference / Citation</label>
            <input
              type="text"
              value={config.sacredVerse.reference}
              onChange={(e) =>
                notifyChange({
                  ...config,
                  sacredVerse: { ...config.sacredVerse, reference: e.target.value },
                })
              }
              className="w-full px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1">Quote Text</label>
            <textarea
              rows={3}
              value={config.sacredVerse.quote}
              onChange={(e) =>
                notifyChange({
                  ...config,
                  sacredVerse: { ...config.sacredVerse, quote: e.target.value },
                })
              }
              className="w-full px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none font-legan italic"
            />
          </div>
        </div>
      )}
    </div>
  );
}
