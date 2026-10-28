"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart,
  Send,
  MessageSquareHeart,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  PenLine,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { config } from "@/lib/config";

export interface GuestMessage {
  id: string;
  name: string;
  relation: string;
  message: string;
  blessingTag?: string;
  likes: number;
  isLiked?: boolean;
  createdAt: string;
}

interface FloatingHeart {
  id: string;
  x: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  sway: number;
  rotation: number;
}

const INITIAL_MOCK_MESSAGES: GuestMessage[] = [
  {
    id: "msg-1",
    name: "Jonathan & Sarah",
    relation: "Family Friends",
    blessingTag: "Eternal Love",
    message:
      "Dear Mikha & Clara, seeing two souls so deeply aligned enter into marriage is the greatest joy. May your home be a sanctuary of peace, shared laughter, and boundless grace!",
    likes: 12,
    isLiked: false,
    createdAt: "2026-10-28T09:15:00.000Z",
  },
  {
    id: "msg-2",
    name: "Michael Chen",
    relation: "Groom's College Mate",
    blessingTag: "Happily Ever After",
    message:
      "Mikha, from late night study sessions to this monumental milestone, I couldn't be prouder of the man and partner you've become. Clara, you bring out the very best in him. Cheers to a lifetime of adventures together!",
    likes: 8,
    isLiked: false,
    createdAt: "2026-10-27T18:30:00.000Z",
  },
  {
    id: "msg-3",
    name: "Amanda Wijaya",
    relation: "Bride's Sister",
    blessingTag: "Joy & Harmony",
    message:
      "My sweet sister Clara, seeing you walk down the aisle to marry your true soulmate brings tears of pure joy to my eyes. Mikha, take care of our treasure! May God's richest blessings rest upon your home.",
    likes: 19,
    isLiked: true,
    createdAt: "2026-10-27T08:15:00.000Z",
  },
  {
    id: "msg-4",
    name: "David & Clara Santoso",
    relation: "Colleagues",
    blessingTag: "Endless Blessing",
    message:
      "Heartfelt congratulations to the beautiful couple! May the love you celebrate today only blossom brighter and deeper with each passing season.",
    likes: 5,
    isLiked: false,
    createdAt: "2026-10-26T12:00:00.000Z",
  },
  {
    id: "msg-5",
    name: "Grace Hartanto",
    relation: "Childhood Friend",
    blessingTag: "Pure Happiness",
    message:
      "Still remember when you two first met! It was obvious from day one that this was something extraordinary. Wishing you forever smiles, sweet dances in the kitchen, and infinite happiness!",
    likes: 14,
    isLiked: false,
    createdAt: "2026-10-25T14:45:00.000Z",
  },
  {
    id: "msg-6",
    name: "Kevin & Michelle Tan",
    relation: "High School Friends",
    blessingTag: "Beautiful Journey",
    message:
      "Warmest congratulations to the most radiant bride and dashing groom! We are counting down the hours to celebrate and dance the night away with you both.",
    likes: 7,
    isLiked: false,
    createdAt: "2026-10-24T19:20:00.000Z",
  },
  {
    id: "msg-7",
    name: "Uncle Bernard & Aunt Sophia",
    relation: "Family / Relative",
    blessingTag: "Peace & Harmony",
    message:
      "Watching you both grow and find your soulmate has been one of life's greatest gifts. May God surround your union with patience, wisdom, and eternal warmth.",
    likes: 16,
    isLiked: false,
    createdAt: "2026-10-23T11:10:00.000Z",
  },
  {
    id: "msg-8",
    name: "Brian Kusuma",
    relation: "Colleague",
    blessingTag: "Happily Ever After",
    message:
      "Congratulations Mikha & Clara! Have the most wonderful wedding and an unforgettable honeymoon adventure ahead!",
    likes: 4,
    isLiked: false,
    createdAt: "2026-10-22T16:00:00.000Z",
  },
];

const PRESET_BLESSINGS = [
  "✨ Eternal Love",
  "🥂 Happily Ever After",
  "🕊️ Peace & Harmony",
  "💍 Beautiful Journey",
  "❤️ Pure Joy",
];

const RELATION_OPTIONS = [
  "Friend of Bride",
  "Friend of Groom",
  "Mutual Friend",
  "Family / Relative",
  "Colleague",
  "Well-wisher",
];

const PAGE_SIZE = 5;

export default function Guestbook() {
  const [messages, setMessages] = useState<GuestMessage[]>(INITIAL_MOCK_MESSAGES);
  const [activeTab, setActiveTab] = useState<"view" | "sign">("view");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Floating Hearts Animation state
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);

  // Form states
  const [name, setName] = useState("");
  const [relation, setRelation] = useState(RELATION_OPTIONS[0]);
  const [selectedTag, setSelectedTag] = useState<string>(PRESET_BLESSINGS[0]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "popular">("latest");

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleSortChange = (val: "latest" | "popular") => {
    setSortBy(val);
    setCurrentPage(1);
  };

  const triggerFloatingHearts = () => {
    const heartColors = [
      "text-rose-400 fill-rose-400",
      "text-pink-400 fill-pink-400",
      "text-red-400 fill-red-400",
      "text-rose-300 fill-rose-300",
      "text-amber-200 fill-amber-200",
      "text-fuchsia-300 fill-fuchsia-300",
    ];

    const batch: FloatingHeart[] = Array.from({ length: 22 }).map((_, i) => ({
      id: `fh-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
      x: 6 + Math.random() * 88,
      size: 16 + Math.floor(Math.random() * 24),
      color: heartColors[Math.floor(Math.random() * heartColors.length)],
      delay: Math.random() * 0.5,
      duration: 2.2 + Math.random() * 1.6,
      sway: (Math.random() - 0.5) * 80,
      rotation: (Math.random() - 0.5) * 60,
    }));

    setFloatingHearts((prev) => [...prev, ...batch]);

    setTimeout(() => {
      setFloatingHearts((prev) =>
        prev.filter((h) => !batch.some((bh) => bh.id === h.id))
      );
    }, 4500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);

    const newMessage: GuestMessage = {
      id: `msg-${Date.now()}`,
      name: name.trim(),
      relation: relation,
      blessingTag: selectedTag.replace(/^[^\w\s]+/, "").trim(),
      message: message.trim(),
      likes: 1,
      isLiked: true,
      createdAt: new Date().toISOString(),
    };

    // Prepend to mock state array
    setMessages((prev) => [newMessage, ...prev]);

    // Trigger celebratory floating hearts animation
    triggerFloatingHearts();

    // Optional background sync with API endpoint
    fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        attendance: "Hadir",
        guests: 1,
        message: `${selectedTag ? `[${selectedTag}] ` : ""}${message.trim()}`,
      }),
    }).catch(() => {
      // Gracefully silent, state is already updated
    });

    setIsSubmitting(false);
    setName("");
    setMessage("");
    setShowSuccessToast(true);
    setCurrentPage(1); // Jump to first page to see the newly submitted wish
    setActiveTab("view");

    setTimeout(() => {
      setShowSuccessToast(false);
    }, 4500);
  };

  const toggleLike = (id: string) => {
    setMessages((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const currentlyLiked = item.isLiked;
          return {
            ...item,
            isLiked: !currentlyLiked,
            likes: currentlyLiked ? item.likes - 1 : item.likes + 1,
          };
        }
        return item;
      })
    );
  };

  const filteredMessages = messages
    .filter((msg) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        msg.name.toLowerCase().includes(q) ||
        msg.relation.toLowerCase().includes(q) ||
        msg.message.toLowerCase().includes(q) ||
        (msg.blessingTag && msg.blessingTag.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sortBy === "popular") {
        return b.likes - a.likes;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Calculate pagination boundaries
  const totalPages = Math.max(1, Math.ceil(filteredMessages.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;
  const paginatedMessages = filteredMessages.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const formatTimestamp = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto flex flex-col rounded-2xl bg-black/65 backdrop-blur-md border border-white/20 shadow-2xl p-4 sm:p-6 text-white transition-all overflow-hidden">
      {/* Floating Hearts Animation Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl z-40">
        <AnimatePresence>
          {floatingHearts.map((h) => (
            <motion.div
              key={h.id}
              initial={{
                opacity: 0,
                scale: 0.2,
                left: `${h.x}%`,
                bottom: "-25px",
                rotate: 0,
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0.2, 1.3, 1, 0.7],
                bottom: ["-25px", "105%"],
                x: [0, h.sway, -h.sway / 2, h.sway / 2],
                rotate: [0, h.rotation, -h.rotation],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: h.duration,
                delay: h.delay,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute"
            >
              <Heart
                style={{ width: `${h.size}px`, height: `${h.size}px` }}
                className={`${h.color} drop-shadow-[0_4px_14px_rgba(244,63,94,0.55)]`}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <MessageSquareHeart className="w-5 h-5 text-rose-300" />
          <h2 className="font-ovo text-lg tracking-wide uppercase">
            Wedding Guestbook
          </h2>
        </div>
        <span className="text-xs font-legan px-2.5 py-1 rounded-full bg-white/10 text-white/90 border border-white/15">
          {messages.length} Blessings
        </span>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="grid grid-cols-2 gap-2 mt-4 p-1 rounded-xl bg-white/5 border border-white/10">
        <button
          type="button"
          onClick={() => setActiveTab("view")}
          className={`flex items-center justify-center gap-2 py-2 text-xs font-legan rounded-lg transition-all ${
            activeTab === "view"
              ? "bg-white text-black font-semibold shadow-md"
              : "text-white/70 hover:text-white"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Read Wishes ({messages.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("sign")}
          className={`flex items-center justify-center gap-2 py-2 text-xs font-legan rounded-lg transition-all ${
            activeTab === "sign"
              ? "bg-white text-black font-semibold shadow-md"
              : "text-white/70 hover:text-white"
          }`}
        >
          <PenLine className="w-3.5 h-3.5" />
          Sign Guestbook
        </button>
      </div>

      {/* Success Notification Banner */}
      {showSuccessToast && (
        <div className="mt-4 flex items-center gap-2 p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-legan animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Thank you! Your heartfelt congratulatory message for {config.coupleNames} has been recorded in the guestbook.
          </span>
        </div>
      )}

      {/* TAB 1: VIEW WISHES */}
      {activeTab === "view" && (
        <div className="mt-4 flex flex-col space-y-3">
          {/* Controls: Search & Sort */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search wishes or names..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/30"
              />
            </div>
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white/80">
              <Filter className="w-3 h-3 text-white/50" />
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value as "latest" | "popular")}
                className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="latest" className="bg-neutral-900 text-white">Latest</option>
                <option value="popular" className="bg-neutral-900 text-white">Most Loved</option>
              </select>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="max-h-[350px] overflow-y-auto space-y-3 pr-1 divide-y divide-white/5">
            {paginatedMessages.length === 0 ? (
              <div className="py-10 text-center text-white/50 text-xs font-legan">
                No wishes found matching your search. Be the first to write one!
              </div>
            ) : (
              paginatedMessages.map((item) => (
                <div
                  key={item.id}
                  className="pt-3 first:pt-0 group transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-linear-to-tr from-rose-900/60 to-purple-900/60 border border-white/20 flex items-center justify-center text-xs font-bold font-legan text-white">
                        {item.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-legan font-semibold text-sm text-white">
                            {item.name}
                          </h4>
                          {item.relation && (
                            <span className="text-[10px] font-legan px-1.5 py-0.5 rounded-sm bg-white/10 text-white/80">
                              {item.relation}
                            </span>
                          )}
                        </div>
                        <p suppressHydrationWarning className="text-[10px] text-white/40 font-legan">
                          {formatTimestamp(item.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Like / Heart Button */}
                    <button
                      type="button"
                      onClick={() => toggleLike(item.id)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-legan border transition-all ${
                        item.isLiked
                          ? "bg-rose-500/20 border-rose-500/50 text-rose-300"
                          : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/20"
                      }`}
                      aria-label="Like blessing"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          item.isLiked ? "fill-rose-400 text-rose-400" : ""
                        }`}
                      />
                      <span className="text-[11px]">{item.likes}</span>
                    </button>
                  </div>

                  {/* Blessing Tag */}
                  {item.blessingTag && (
                    <div className="mt-2 ml-10.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-thesignature text-amber-200/90 tracking-wide">
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        {item.blessingTag}
                      </span>
                    </div>
                  )}

                  {/* Message Body */}
                  <p className="mt-1.5 ml-10.5 text-xs text-white/90 font-legan leading-relaxed">
                    {item.message}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs font-legan">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safeCurrentPage <= 1}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/15 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Previous
            </button>

            <div className="flex items-center gap-1.5 text-white/70">
              <span className="font-semibold text-white">Page {safeCurrentPage}</span>
              <span className="text-white/40">of {totalPages}</span>
              <span className="hidden sm:inline text-white/30">•</span>
              <span className="hidden sm:inline text-white/40">
                ({filteredMessages.length} total)
              </span>
            </div>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safeCurrentPage >= totalPages}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/15 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Sign CTA Footer */}
          <div className="pt-1 text-center">
            <button
              type="button"
              onClick={() => setActiveTab("sign")}
              className="text-xs text-white/70 hover:text-white underline underline-offset-4 font-legan transition"
            >
              Want to leave your own blessing? Click here to sign
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: SIGN GUESTBOOK FORM */}
      {activeTab === "sign" && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {/* Visitor Name */}
          <div>
            <label
              htmlFor="guestbook-name"
              className="block text-xs font-legan font-medium text-white/90 mb-1"
            >
              Your Name *
            </label>
            <input
              id="guestbook-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Robert & Evelyn"
              className="w-full px-3 py-2 text-xs bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/35 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/50"
            />
          </div>

          {/* Visitor Relation */}
          <div>
            <label
              htmlFor="guestbook-relation"
              className="block text-xs font-legan font-medium text-white/90 mb-1"
            >
              Relationship to Couple
            </label>
            <select
              id="guestbook-relation"
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-neutral-900 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white cursor-pointer"
            >
              {RELATION_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-neutral-900 text-white">
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Blessing Presets */}
          <div>
            <label className="block text-xs font-legan font-medium text-white/90 mb-1.5">
              Choose a Blessing Theme
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_BLESSINGS.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`text-[11px] font-legan px-2.5 py-1 rounded-full border transition-all ${
                    selectedTag === tag
                      ? "bg-white text-black font-semibold border-white shadow-sm"
                      : "bg-white/5 border-white/15 text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Congratulatory Message */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="guestbook-message"
                className="text-xs font-legan font-medium text-white/90"
              >
                Congratulatory Message *
              </label>
              <span className="text-[10px] text-white/40">
                {message.length}/500
              </span>
            </div>
            <textarea
              id="guestbook-message"
              required
              rows={3}
              maxLength={500}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Write your blessing and wishes for ${config.coupleNames}...`}
              className="w-full px-3 py-2 text-xs bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/35 focus:outline-none focus:border-white focus:ring-1 focus:ring-white/50"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setActiveTab("view")}
              className="w-1/3 py-2 text-xs font-legan rounded-lg border border-white/20 text-white/80 hover:text-white hover:bg-white/10 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || !message.trim()}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-legan font-semibold bg-white text-black rounded-lg shadow-md hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-3.5 h-3.5" />
              {isSubmitting ? "Posting Blessing..." : "Post Congratulatory Message"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
