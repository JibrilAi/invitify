"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Calendar,
  MapPin,
  Clock,
  Music,
  Volume2,
  VolumeX,
  Share2,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  Gift,
  Smartphone,
  Layers,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Send,
  MessageCircle,
  Play,
  Pause,
  ArrowDown,
  Compass,
  CheckCircle2,
  Music2,
} from "lucide-react";
import {
  InvitationConfig,
  DEFAULT_INVITATION_CONFIG,
  loadStoredConfig,
} from "@/lib/invitation-store";
import Guestbook from "./Guestbook";
import RsvpComponent from "./RsvpComponent";

interface InvitiAppExperienceProps {
  initialGuestName?: string;
  config?: InvitationConfig;
  isCompactPreview?: boolean;
}

type ViewMode = "scroll" | "stories";

interface SongSuggestion {
  id: string;
  song: string;
  artist: string;
  guest: string;
}

const INITIAL_SONG_SUGGESTIONS: SongSuggestion[] = [
  { id: "s1", song: "Can't Take My Eyes Off You", artist: "Frankie Valli", guest: "Jonathan" },
  { id: "s2", song: "Perfect", artist: "Ed Sheeran", guest: "Amanda" },
  { id: "s3", song: "Fly Me to the Moon", artist: "Frank Sinatra", guest: "Uncle Bernard" },
];

export default function InvitiAppExperience({
  initialGuestName,
  config: propConfig,
  isCompactPreview = false,
}: InvitiAppExperienceProps) {
  const [internalConfig] = useState<InvitationConfig>(() => {
    if (typeof window !== "undefined") {
      return loadStoredConfig();
    }
    return DEFAULT_INVITATION_CONFIG;
  });

  const config = propConfig || internalConfig;

  // Navigation & View Mode
  const [viewMode, setViewMode] = useState<ViewMode>("scroll");
  const [guestName, setGuestName] = useState(initialGuestName || "");

  // Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Modals
  const [showShareModal, setShowShareModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Stories Mode state
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const [isStoryPaused, setIsStoryPaused] = useState(false);

  // Song Request state
  const [songTitle, setSongTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [suggesterName, setSuggesterName] = useState("");
  const [songList, setSongList] = useState<SongSuggestion[]>(INITIAL_SONG_SUGGESTIONS);
  const [songSubmitted, setSongSubmitted] = useState(false);

  // Live Countdown state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Calculate Countdown
  useEffect(() => {
    const targetDate = new Date(config.eventDate || "2026-12-21T10:00:00").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        const elapsed = Math.abs(difference);
        setTimeLeft({
          days: Math.floor(elapsed / (1000 * 60 * 60 * 24)),
          hours: Math.floor((elapsed / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((elapsed / (1000 * 60)) % 60),
          seconds: Math.floor((elapsed / 1000) % 60),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [config.eventDate]);

  // Audio Playback Handler
  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.log("Audio play suppressed:", e));
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Copy helpers
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedAccount(label);
    setTimeout(() => setCopiedAccount(null), 3000);
  };

  const handleCopyLink = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // Add to Calendar .ics generator
  const handleDownloadIcs = () => {
    const eventDetails = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//InvitiApp//Wedding Invitation//EN",
      "BEGIN:VEVENT",
      `SUMMARY:The Wedding of ${config.coupleNames}`,
      `DESCRIPTION:Join us to celebrate the wedding of ${config.groom.name} & ${config.bride.name}. Ceremony: ${config.venues.holyMatrimony.place}. Reception: ${config.venues.weddingReception.place}.`,
      `LOCATION:${config.venues.holyMatrimony.place}, ${config.venues.holyMatrimony.place_details}`,
      "DTSTART:20261221T100000Z",
      "DTEND:20261221T150000Z",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([eventDetails], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `wedding_${config.groom.nickName}_${config.bride.nickName}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Song Request submit
  const handleSongSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!songTitle.trim()) return;

    const newSong: SongSuggestion = {
      id: `song-${Date.now()}`,
      song: songTitle.trim(),
      artist: artistName.trim() || "Various",
      guest: suggesterName.trim() || guestName || "Guest",
    };

    setSongList([newSong, ...songList]);
    setSongTitle("");
    setArtistName("");
    setSongSubmitted(true);
    setTimeout(() => setSongSubmitted(false), 4000);
  };

  // Stories Timer
  const totalStories = 5;
  useEffect(() => {
    if (viewMode !== "stories" || isStoryPaused) return;

    const storyDuration = 5000;
    const intervalTime = 50;
    const step = (intervalTime / storyDuration) * 100;

    const timer = setInterval(() => {
      setStoryProgress((prev) => {
        if (prev >= 100) {
          if (currentStoryIndex < totalStories - 1) {
            setCurrentStoryIndex((curr) => curr + 1);
            return 0;
          } else {
            setCurrentStoryIndex(0);
            return 0;
          }
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [viewMode, currentStoryIndex, isStoryPaused, totalStories]);

  const handleNextStory = () => {
    setStoryProgress(0);
    if (currentStoryIndex < totalStories - 1) {
      setCurrentStoryIndex((curr) => curr + 1);
    } else {
      setViewMode("scroll");
    }
  };

  const handlePrevStory = () => {
    setStoryProgress(0);
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((curr) => curr - 1);
    }
  };

  // Theme Classes
  const getThemeStyles = () => {
    switch (config.theme) {
      case "terracotta":
        return {
          bg: "bg-[#181110] text-[#f7ede7]",
          card: "bg-[#241a18]/85 border-[#45302c]",
          accent: "text-[#e28771]",
          accentBg: "bg-[#e28771] text-black",
          pill: "bg-[#e28771]/15 text-[#e28771] border-[#e28771]/30",
        };
      case "botanical":
        return {
          bg: "bg-[#0d1410] text-[#e8f1eb]",
          card: "bg-[#142119]/85 border-[#283d30]",
          accent: "text-[#87bba2]",
          accentBg: "bg-[#87bba2] text-black",
          pill: "bg-[#87bba2]/15 text-[#87bba2] border-[#87bba2]/30",
        };
      case "champagne":
        return {
          bg: "bg-[#161413] text-[#f5efe6]",
          card: "bg-[#221e1a]/85 border-[#3d372f]",
          accent: "text-[#d8bb8e]",
          accentBg: "bg-[#d8bb8e] text-black",
          pill: "bg-[#d8bb8e]/15 text-[#d8bb8e] border-[#d8bb8e]/30",
        };
      case "midnight":
      default:
        return {
          bg: "bg-[#0a0a0a] text-white",
          card: "bg-black/75 border-white/15",
          accent: "text-amber-200",
          accentBg: "bg-white text-black",
          pill: "bg-white/10 text-white/90 border-white/20",
        };
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <div
      className={`min-h-screen ${themeStyles.bg} transition-colors duration-500 font-legan antialiased selection:bg-amber-200 selection:text-black ${
        isCompactPreview ? "text-sm" : ""
      }`}
    >
      {/* Hidden Audio Player (if music feature enabled) */}
      {config.features.music && (
        <audio
          ref={audioRef}
          src="/music/wedding_song.mp3"
          preload="auto"
          loop
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      )}

      {/* TOP FLOATING CONTROL DOCK (InvitiApp signature) */}
      <div className={`sticky ${isCompactPreview ? "top-2" : "top-14"} z-30 px-3 sm:px-6 pointer-events-none mb-4`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between pointer-events-auto">
          {/* Left: Mode Switcher (Stories vs Scroll, only if storiesMode enabled) */}
          {config.features.storiesMode ? (
            <div className="flex items-center gap-1 p-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 shadow-xl">
              <button
                onClick={() => {
                  setViewMode("scroll");
                  setCurrentStoryIndex(0);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                  viewMode === "scroll"
                    ? "bg-white text-black shadow-md"
                    : "text-white/70 hover:text-white"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Scroll View</span>
              </button>
              <button
                onClick={() => {
                  setViewMode("stories");
                  setStoryProgress(0);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                  viewMode === "stories"
                    ? "bg-white text-black shadow-md"
                    : "text-white/70 hover:text-white"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Stories</span>
              </button>
            </div>
          ) : <div />}

          {/* Right: Audio & Share Actions */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 shadow-xl">
            {/* Audio Toggle (only if music feature enabled) */}
            {config.features.music && (
              <button
                onClick={toggleAudio}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition ${
                  isPlaying
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                    : "hover:bg-white/10 text-white/80"
                }`}
                title={isPlaying ? "Pause Music" : "Play Wedding Song"}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 animate-pulse" />
                    <span className="hidden sm:inline">Playing</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Play Song</span>
                  </>
                )}
              </button>
            )}

            {/* Share Button */}
            <button
              onClick={() => setShowShareModal(true)}
              className="p-2 rounded-full hover:bg-white/10 text-white/80 transition"
              title="Share Invitation"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Quick RSVP CTA (if rsvp feature enabled) */}
            {config.features.rsvp && (
              <a
                href="#rsvp-section"
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-white text-black hover:bg-gray-200 transition shadow-md"
              >
                <span>RSVP</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STORIES MODE (Instagram-style Story Experience) */}
      {/* ========================================================================= */}
      {viewMode === "stories" && config.features.storiesMode && (
        <div className="fixed inset-0 z-40 bg-black flex items-center justify-center">
          <div
            className="relative w-full max-w-md h-full sm:h-[92vh] sm:rounded-3xl overflow-hidden shadow-2xl bg-[#0e0e0e] flex flex-col"
            onMouseDown={() => setIsStoryPaused(true)}
            onMouseUp={() => setIsStoryPaused(false)}
            onTouchStart={() => setIsStoryPaused(true)}
            onTouchEnd={() => setIsStoryPaused(false)}
          >
            {/* Top Progress Bars */}
            <div className="absolute top-4 left-3 right-3 z-30 flex items-center gap-1.5">
              {Array.from({ length: totalStories }).map((_, idx) => (
                <div key={idx} className="flex-1 h-1 rounded-full bg-white/25 overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-75"
                    style={{
                      width:
                        idx < currentStoryIndex
                          ? "100%"
                          : idx === currentStoryIndex
                          ? `${storyProgress}%`
                          : "0%",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Story Top Bar */}
            <div className="absolute top-8 left-4 right-4 z-30 flex items-center justify-between text-white drop-shadow-md">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 font-ovo text-xs font-bold">
                  {config.groom.nickName[0]}&{config.bride.nickName[0]}
                </div>
                <div>
                  <p className="font-ovo text-xs uppercase tracking-wider">{config.coupleNames}</p>
                  <p className="text-[10px] text-white/70">Story {currentStoryIndex + 1} of {totalStories}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={toggleMute} className="p-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white">
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setViewMode("scroll")}
                  className="p-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tap Navigation Overlays */}
            <div className="absolute inset-0 z-20 flex">
              <div className="w-1/3 h-full cursor-pointer" onClick={handlePrevStory} />
              <div className="w-2/3 h-full cursor-pointer" onClick={handleNextStory} />
            </div>

            {/* Story Content Cards */}
            <div className="relative w-full h-full flex flex-col justify-end p-6 text-white pb-16 overflow-hidden">
              {currentStoryIndex === 0 && (
                <>
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={config.groom.photo || "/foto_2.jpg"}
                      alt="Wedding Couple"
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />
                  </div>
                  <div className="relative z-10 space-y-3">
                    <span className="px-3 py-1 rounded-full text-[11px] font-legan bg-white/20 backdrop-blur-md uppercase tracking-widest border border-white/30">
                      You Are Cordially Invited
                    </span>
                    <h1 className="font-ovo text-3xl sm:text-4xl uppercase tracking-wider leading-tight">
                      {config.coupleNames}
                    </h1>
                    <p className="font-thesignature text-3xl text-amber-200">Save Our Date</p>
                    <p className="text-sm font-legan text-white/90">
                      {new Date(config.eventDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-white/70 pt-2">Tap right to proceed →</p>
                  </div>
                </>
              )}

              {currentStoryIndex === 1 && (
                <>
                  <div className="absolute inset-0 z-0">
                    <Image
                      src="/slide_4.jpg"
                      alt="Love Story"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />
                  </div>
                  <div className="relative z-10 space-y-4">
                    <span className="text-xs font-legan uppercase tracking-widest text-amber-200">
                      Chapter by Chapter
                    </span>
                    <h2 className="font-ovo text-3xl uppercase">A Journey In Love</h2>
                    <div className="space-y-3 bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                      {config.story.items.slice(0, 2).map((item) => (
                        <div key={item.id} className="first:border-none border-t border-white/10 pt-2 first:pt-0">
                          <p className="text-xs font-bold text-amber-200">{item.year} - {item.title}</p>
                          <p className="text-xs text-white/80 mt-0.5">{item.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {currentStoryIndex === 2 && (
                <>
                  <div className="absolute inset-0 z-0">
                    <Image
                      src="/slide_5.jpg"
                      alt="Ceremony"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />
                  </div>
                  <div className="relative z-10 space-y-4">
                    <span className="text-xs font-legan uppercase tracking-widest text-amber-200">
                      The Wedding Day
                    </span>
                    <h2 className="font-ovo text-3xl uppercase">Event Schedule</h2>
                    <div className="space-y-3">
                      <div className="bg-black/65 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                        <h3 className="font-ovo text-sm uppercase text-amber-200">Holy Matrimony</h3>
                        <p className="text-xs text-white/90 mt-1">{config.venues.holyMatrimony.time}</p>
                        <p className="text-xs text-white/70">{config.venues.holyMatrimony.place}</p>
                      </div>
                      <div className="bg-black/65 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                        <h3 className="font-ovo text-sm uppercase text-amber-200">Wedding Reception</h3>
                        <p className="text-xs text-white/90 mt-1">{config.venues.weddingReception.time}</p>
                        <p className="text-xs text-white/70">{config.venues.weddingReception.place}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {currentStoryIndex === 3 && (
                <>
                  <div className="absolute inset-0 z-0">
                    <Image
                      src="/slide_6.jpg"
                      alt="Countdown"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />
                  </div>
                  <div className="relative z-10 space-y-4 text-center">
                    <span className="text-xs font-legan uppercase tracking-widest text-amber-200">
                      Counting Down The Moments
                    </span>
                    <h2 className="font-ovo text-3xl uppercase">Until We Say I Do</h2>
                    <div className="grid grid-cols-4 gap-2 bg-black/70 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                      <div>
                        <p className="text-2xl font-bold font-ovo">{timeLeft.days}</p>
                        <p className="text-[10px] uppercase text-white/70">Days</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold font-ovo">{timeLeft.hours}</p>
                        <p className="text-[10px] uppercase text-white/70">Hours</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold font-ovo">{timeLeft.minutes}</p>
                        <p className="text-[10px] uppercase text-white/70">Mins</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold font-ovo">{timeLeft.seconds}</p>
                        <p className="text-[10px] uppercase text-white/70">Secs</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {currentStoryIndex === 4 && (
                <>
                  <div className="absolute inset-0 z-0">
                    <Image
                      src="/slide_7.jpg"
                      alt="Thank you"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />
                  </div>
                  <div className="relative z-10 space-y-4 text-center">
                    <h2 className="font-ovo text-3xl uppercase">Celebrate With Us</h2>
                    <p className="text-xs text-white/80 font-legan">
                      Please confirm your attendance in our RSVP form or write a congratulatory blessing.
                    </p>
                    <button
                      onClick={() => setViewMode("scroll")}
                      className="w-full py-3 rounded-full text-xs font-bold font-legan uppercase tracking-wider bg-white text-black shadow-lg hover:bg-gray-200 transition"
                    >
                      Open Full Invitation
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Bottom Story Controls */}
            <div className="absolute bottom-4 left-6 right-6 z-30 flex items-center justify-between text-xs text-white/70">
              <button onClick={handlePrevStory} className="flex items-center gap-1 hover:text-white">
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              <button onClick={() => setViewMode("scroll")} className="underline underline-offset-4 hover:text-white">
                Full Scroll View
              </button>
              <button onClick={handleNextStory} className="flex items-center gap-1 hover:text-white">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCROLL VIEW (Full-feature digital wedding invitation) */}
      {/* ========================================================================= */}
      {viewMode === "scroll" && (
        <main className="relative w-full">
          {/* SECTION 1: HERO / COVER */}
          <section className="relative min-h-[90vh] flex items-center justify-center text-center px-4 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <Image
                src="/foto_2.jpg"
                alt="The Wedding Couple"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#0a0a0a]" />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto py-20 space-y-6">
              {/* Personalized Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-legan text-white/90">
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>
                  {guestName ? `Dear ${guestName}, You are invited` : "Exclusive Wedding Invitation"}
                </span>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <p className="text-xs sm:text-sm font-legan tracking-[6px] uppercase text-white/80">
                  The Wedding Of
                </p>
                <h1 className="font-ovo text-4xl sm:text-6xl md:text-7xl uppercase tracking-wider text-white drop-shadow-md">
                  {config.coupleNames}
                </h1>
                <p className="font-thesignature text-3xl sm:text-5xl text-amber-200 drop-shadow-sm pt-2">
                  Forever Begins Today
                </p>
              </div>

              {/* Date */}
              <div className="inline-block px-6 py-2 rounded-2xl bg-black/50 backdrop-blur-md border border-white/15 text-sm sm:text-base font-legan">
                {new Date(config.eventDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>

              {/* Live Countdown Box (Conditional on config.features.countdown) */}
              {config.features.countdown && (
                <div className="pt-4 max-w-md mx-auto">
                  <div className="grid grid-cols-4 gap-2 sm:gap-3 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15 shadow-2xl">
                    <div className="text-center">
                      <p className="font-ovo text-2xl sm:text-3xl font-bold text-white">{timeLeft.days}</p>
                      <p className="text-[10px] font-legan uppercase tracking-wider text-white/70">Days</p>
                    </div>
                    <div className="text-center border-l border-white/10">
                      <p className="font-ovo text-2xl sm:text-3xl font-bold text-white">{timeLeft.hours}</p>
                      <p className="text-[10px] font-legan uppercase tracking-wider text-white/70">Hours</p>
                    </div>
                    <div className="text-center border-l border-white/10">
                      <p className="font-ovo text-2xl sm:text-3xl font-bold text-white">{timeLeft.minutes}</p>
                      <p className="text-[10px] font-legan uppercase tracking-wider text-white/70">Mins</p>
                    </div>
                    <div className="text-center border-l border-white/10">
                      <p className="font-ovo text-2xl sm:text-3xl font-bold text-white">{timeLeft.seconds}</p>
                      <p className="text-[10px] font-legan uppercase tracking-wider text-white/70">Secs</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                {config.features.events && (
                  <a
                    href="#itinerary"
                    className="px-6 py-3 rounded-full text-xs font-bold font-legan uppercase tracking-wider bg-white text-black hover:bg-gray-200 transition shadow-lg flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    View Schedule
                  </a>
                )}
                <button
                  onClick={handleDownloadIcs}
                  className="px-5 py-3 rounded-full text-xs font-legan uppercase tracking-wider bg-black/60 border border-white/25 hover:bg-white/15 text-white transition backdrop-blur-md flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  Add to Calendar
                </button>
              </div>

              <div className="pt-6">
                <a href="#details-start" className="inline-flex flex-col items-center gap-1 text-white/60 hover:text-white transition">
                  <span className="text-[11px] font-legan uppercase tracking-widest">Scroll Down</span>
                  <ArrowDown className="w-4 h-4 animate-bounce" />
                </a>
              </div>
            </div>
          </section>

          <div id="details-start" />

          {/* SECTION 2: BIBLE VERSE & QUOTE (Conditional on config.features.sacredVerse) */}
          {config.features.sacredVerse && (
            <section className="py-20 px-4 text-center max-w-3xl mx-auto">
              <div className={`${themeStyles.card} backdrop-blur-md p-8 sm:p-12 rounded-3xl border shadow-2xl relative`}>
                <span className="font-thesignature text-4xl text-amber-200 block mb-3">
                  Sacred Vows
                </span>
                <h2 className="font-ovo text-lg sm:text-xl uppercase tracking-wider text-white/90 mb-4">
                  {config.sacredVerse.reference}
                </h2>
                <blockquote className="font-legan text-sm sm:text-base leading-relaxed text-white/80 italic max-w-xl mx-auto">
                  &ldquo;{config.sacredVerse.quote}&rdquo;
                </blockquote>
                <div className="flex items-center justify-center gap-3 mt-6">
                  <hr className="w-12 border-white/20" />
                  <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                  <hr className="w-12 border-white/20" />
                </div>
              </div>
            </section>
          )}

          {/* SECTION 3: THE COUPLE (Bride & Groom, Conditional on config.features.coupleProfiles) */}
          {config.features.coupleProfiles && (
            <section id="couple" className="py-16 px-4 max-w-5xl mx-auto">
              <div className="text-center mb-12 space-y-2">
                <span className="text-xs uppercase tracking-[4px] text-amber-200 font-legan">
                  Together in Love
                </span>
                <h2 className="font-ovo text-3xl sm:text-4xl uppercase text-white tracking-wider">
                  The Bride & Groom
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
                {/* Groom Card */}
                <div className={`${themeStyles.card} rounded-3xl p-6 sm:p-8 border shadow-xl flex flex-col items-center text-center group hover:border-white/40 transition duration-300`}>
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-2 border-white/25 shadow-2xl mb-6">
                    <Image
                      src={config.groom.photo || "/foto_3.jpg"}
                      alt={config.groom.name}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <span className="text-xs uppercase tracking-widest text-amber-200 font-legan mb-1">The Groom</span>
                  <h3 className="font-ovo text-2xl uppercase text-white">{config.groom.name}</h3>
                  <p className="font-thesignature text-2xl text-amber-200 mt-1">About {config.groom.nickName}</p>
                  <p className="text-xs sm:text-sm text-white/80 mt-3 max-w-sm leading-relaxed">
                    {config.groom.bio}
                  </p>
                  {config.groom.instagram && (
                    <Link
                      href={`https://instagram.com/${config.groom.instagram.replace(/^@/, "")}`}
                      target="_blank"
                      className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-legan bg-white/10 hover:bg-white/20 border border-white/20 text-white transition"
                    >
                      <span>@{config.groom.instagram.replace(/^@/, "")}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>

                {/* Bride Card */}
                <div className={`${themeStyles.card} rounded-3xl p-6 sm:p-8 border shadow-xl flex flex-col items-center text-center group hover:border-white/40 transition duration-300`}>
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-2 border-white/25 shadow-2xl mb-6">
                    <Image
                      src={config.bride.photo || "/foto_1.jpg"}
                      alt={config.bride.name}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <span className="text-xs uppercase tracking-widest text-amber-200 font-legan mb-1">The Bride</span>
                  <h3 className="font-ovo text-2xl uppercase text-white">{config.bride.name}</h3>
                  <p className="font-thesignature text-2xl text-amber-200 mt-1">About {config.bride.nickName}</p>
                  <p className="text-xs sm:text-sm text-white/80 mt-3 max-w-sm leading-relaxed">
                    {config.bride.bio}
                  </p>
                  {config.bride.instagram && (
                    <Link
                      href={`https://instagram.com/${config.bride.instagram.replace(/^@/, "")}`}
                      target="_blank"
                      className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-legan bg-white/10 hover:bg-white/20 border border-white/20 text-white transition"
                    >
                      <span>@{config.bride.instagram.replace(/^@/, "")}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* SECTION 4: LOVE STORY TIMELINE (Conditional on config.features.story) */}
          {config.features.story && (
            <section className="py-16 px-4 max-w-4xl mx-auto">
              <div className="text-center mb-12 space-y-2">
                <span className="text-xs uppercase tracking-[4px] text-amber-200 font-legan">
                  Memories & Milestones
                </span>
                <h2 className="font-ovo text-3xl sm:text-4xl uppercase text-white tracking-wider">
                  Our Love Story
                </h2>
              </div>

              <div className="relative border-l border-white/20 ml-4 sm:ml-32 pl-6 sm:pl-10 space-y-12">
                {config.story.items.map((item) => (
                  <div key={item.id} className="relative group">
                    <div className="absolute -left-[31px] sm:-left-[47px] top-1 w-5 h-5 rounded-full bg-amber-200 border-4 border-black" />
                    <span className="text-xs font-bold text-amber-200 tracking-wider uppercase block sm:hidden">
                      {item.year}
                    </span>
                    <div className="hidden sm:block absolute -left-36 top-1 text-right w-24">
                      <span className="text-sm font-bold text-amber-200 tracking-wider uppercase block font-ovo">
                        {item.year}
                      </span>
                    </div>
                    <div className={`${themeStyles.card} p-5 sm:p-6 rounded-2xl border shadow-lg mt-1`}>
                      <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-sm text-white/90 leading-relaxed font-legan">
                        {item.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SECTION 5: EVENT ITINERARY (Holy Matrimony & Reception, Conditional on config.features.events) */}
          {config.features.events && (
            <section id="itinerary" className="py-16 px-4 max-w-5xl mx-auto">
              <div className="text-center mb-12 space-y-2">
                <span className="text-xs uppercase tracking-[4px] text-amber-200 font-legan">
                  Date & Locations
                </span>
                <h2 className="font-ovo text-3xl sm:text-4xl uppercase text-white tracking-wider">
                  Event Schedule
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Holy Matrimony */}
                {config.venues.holyMatrimony.enabled && (
                  <div className={`${themeStyles.card} p-6 sm:p-8 rounded-3xl border shadow-xl flex flex-col justify-between`}>
                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-ovo tracking-wider uppercase text-amber-200">
                        <Clock className="w-3.5 h-3.5" />
                        {config.venues.holyMatrimony.time}
                      </div>
                      <h3 className="font-ovo text-2xl uppercase text-white">Holy Matrimony</h3>
                      <div className="flex items-start gap-2.5 text-sm text-white/80">
                        <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold text-white">{config.venues.holyMatrimony.place}</p>
                          <p className="text-xs text-white/60 mt-0.5">{config.venues.holyMatrimony.place_details}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-6 mt-6 border-t border-white/10">
                      <Link
                        href={config.venues.holyMatrimony.googleMapsLink}
                        target="_blank"
                        className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-white text-black hover:bg-gray-200 text-center flex items-center justify-center gap-1.5 transition shadow-sm"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        Google Maps
                      </Link>
                      <button
                        onClick={handleDownloadIcs}
                        className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center gap-1.5 transition"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        Add to Calendar
                      </button>
                    </div>
                  </div>
                )}

                {/* Wedding Reception */}
                {config.venues.weddingReception.enabled && (
                  <div className={`${themeStyles.card} p-6 sm:p-8 rounded-3xl border shadow-xl flex flex-col justify-between`}>
                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-ovo tracking-wider uppercase text-amber-200">
                        <Clock className="w-3.5 h-3.5" />
                        {config.venues.weddingReception.time}
                      </div>
                      <h3 className="font-ovo text-2xl uppercase text-white">Wedding Reception</h3>
                      <div className="flex items-start gap-2.5 text-sm text-white/80">
                        <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold text-white">{config.venues.weddingReception.place}</p>
                          <p className="text-xs text-white/60 mt-0.5">{config.venues.weddingReception.place_details}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-6 mt-6 border-t border-white/10">
                      <Link
                        href={config.venues.weddingReception.googleMapsLink}
                        target="_blank"
                        className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-white text-black hover:bg-gray-200 text-center flex items-center justify-center gap-1.5 transition shadow-sm"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        Google Maps
                      </Link>
                      <button
                        onClick={handleDownloadIcs}
                        className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center gap-1.5 transition"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        Add to Calendar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Virtual Livestreaming Banner (Conditional on config.features.livestream) */}
              {config.features.livestream && (
                <div className="mt-8 p-6 rounded-3xl bg-linear-to-r from-red-950/60 to-purple-950/60 border border-red-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <div className="inline-flex items-center gap-1.5 text-xs text-red-300 font-bold uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      Live Streaming Broadcast
                    </div>
                    <h4 className="font-ovo text-lg text-white">Join Our Wedding Online</h4>
                    <p className="text-xs text-white/70 max-w-lg">{config.venues.livestream.detail}</p>
                  </div>
                  <Link
                    href={config.venues.livestream.link}
                    target="_blank"
                    className="px-6 py-2.5 rounded-full text-xs font-bold font-legan bg-red-600 hover:bg-red-500 text-white transition flex items-center gap-2 shrink-0 shadow-lg"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Watch Live Stream
                  </Link>
                </div>
              )}
            </section>
          )}

          {/* SECTION 6: DRESS CODE (Conditional on config.features.dressCode) */}
          {config.features.dressCode && (
            <section className="py-16 px-4 max-w-3xl mx-auto">
              <div className={`${themeStyles.card} p-8 sm:p-10 rounded-3xl border shadow-xl text-center space-y-6`}>
                <span className="text-xs uppercase tracking-[4px] text-amber-200 font-legan">
                  Attire Guide
                </span>
                <h2 className="font-ovo text-3xl uppercase text-white tracking-wider">
                  Dress Code & Palette
                </h2>
                <p className="text-sm text-white/80 max-w-xl mx-auto font-legan leading-relaxed">
                  {config.dressCode.note}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
                  {config.dressCode.colors.map((color, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center gap-2">
                      <div
                        className="w-12 h-12 rounded-full border-2 border-white/30 shadow-md"
                        style={{ backgroundColor: color.hex }}
                      />
                      <p className="text-xs font-semibold text-white">{color.name}</p>
                      <span className="text-[10px] text-white/50">{color.hex}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* SECTION 7: DIGITAL ENVELOPE (Conditional on config.features.digitalEnvelope) */}
          {config.features.digitalEnvelope && (
            <section className="py-16 px-4 max-w-4xl mx-auto">
              <div className="text-center mb-10 space-y-2">
                <span className="text-xs uppercase tracking-[4px] text-amber-200 font-legan">
                  Wedding Gift & Blessing
                </span>
                <h2 className="font-ovo text-3xl sm:text-4xl uppercase text-white tracking-wider">
                  Digital Envelope
                </h2>
                <p className="text-xs sm:text-sm text-white/70 max-w-lg mx-auto font-legan">
                  {config.digitalEnvelope.note}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {config.digitalEnvelope.accounts.map((acc) => (
                  <div key={acc.id} className={`${themeStyles.card} p-6 rounded-2xl border shadow-lg space-y-4`}>
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-blue-900/60 text-blue-200 border border-blue-500/30">
                        {acc.bankName}
                      </span>
                      <Gift className="w-4 h-4 text-amber-200" />
                    </div>
                    <div>
                      <p className="text-xs text-white/60">Account Number</p>
                      <p className="font-mono text-lg font-bold text-white tracking-wider">{acc.accountNumber}</p>
                      <p className="text-xs text-white/80 mt-1">a/n {acc.accountHolder}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(acc.accountNumber.replace(/[^0-9]/g, ""), acc.bankName)}
                      className="w-full py-2.5 rounded-xl text-xs font-semibold border border-white/20 bg-white/10 hover:bg-white/20 text-white flex items-center justify-center gap-2 transition"
                    >
                      {copiedAccount === acc.bankName ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>Copied Account Number!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy {acc.bankName} Account</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>

              <div className="text-center mt-6">
                <button
                  onClick={() => setShowQrModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/25 text-white transition"
                >
                  <QrCode className="w-4 h-4 text-amber-200" />
                  <span>Show Cashless QR Code</span>
                </button>
              </div>
            </section>
          )}

          {/* SECTION 8: SONG REQUEST / DJ PLAYLIST (Conditional on config.features.songRequest) */}
          {config.features.songRequest && (
            <section className="py-16 px-4 max-w-3xl mx-auto">
              <div className={`${themeStyles.card} p-8 rounded-3xl border shadow-xl space-y-6`}>
                <div className="text-center space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 text-xs">
                    <Music2 className="w-3.5 h-3.5" />
                    <span>Reception DJ Playlist</span>
                  </div>
                  <h3 className="font-ovo text-2xl uppercase text-white">Suggest a Song for the Party</h3>
                  <p className="text-xs text-white/70 max-w-md mx-auto">
                    What song will get you on the dance floor? Drop your request for our wedding DJ!
                  </p>
                </div>

                {songSubmitted && (
                  <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Song suggestion added to the DJ party queue! Thank you!</span>
                  </div>
                )}

                <form onSubmit={handleSongSubmit} className="grid sm:grid-cols-4 gap-2.5">
                  <input
                    type="text"
                    required
                    placeholder="Song Title *"
                    value={songTitle}
                    onChange={(e) => setSongTitle(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white"
                  />
                  <input
                    type="text"
                    placeholder="Artist / Band"
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white"
                  />
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={suggesterName}
                    onChange={(e) => setSuggesterName(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white"
                  />
                  <button
                    type="submit"
                    className="py-2 px-3 rounded-xl text-xs font-bold bg-white text-black hover:bg-gray-200 transition shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Add Song
                  </button>
                </form>

                <div className="pt-2">
                  <p className="text-[11px] font-legan uppercase tracking-wider text-white/50 mb-2">
                    Queued Party Tracks ({songList.length})
                  </p>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {songList.map((s) => (
                      <div key={s.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center gap-2 truncate">
                          <Music className="w-3.5 h-3.5 text-amber-200 shrink-0" />
                          <span className="font-semibold text-white truncate">{s.song}</span>
                          <span className="text-white/50 truncate">by {s.artist}</span>
                        </div>
                        <span className="text-[10px] text-white/40 shrink-0 pl-2">via {s.guest}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 9: RSVP COMPONENT (Conditional on config.features.rsvp) */}
          {config.features.rsvp && (
            <section id="rsvp-section" className="py-16 px-4 max-w-3xl mx-auto">
              <RsvpComponent initialGuestName={guestName} />
            </section>
          )}

          {/* SECTION 10: GUESTBOOK COMPONENT (Conditional on config.features.guestbook) */}
          {config.features.guestbook && (
            <section className="py-16 px-4 max-w-4xl mx-auto">
              <div className="text-center mb-8 space-y-2">
                <span className="text-xs uppercase tracking-[4px] text-amber-200 font-legan">
                  Words of Love
                </span>
                <h2 className="font-ovo text-3xl sm:text-4xl uppercase text-white tracking-wider">
                  Guestbook & Wishes
                </h2>
              </div>

              <Guestbook />
            </section>
          )}

          {/* SECTION 11: CLOSING & THANK YOU */}
          <footer className="py-20 px-4 text-center max-w-2xl mx-auto space-y-6">
            <p className="font-thesignature text-5xl text-amber-200">{config.thankYou.headline}</p>
            <p className="text-sm font-legan text-white/80 max-w-md mx-auto leading-relaxed">
              {config.thankYou.message}
            </p>
            <div className="pt-4">
              <p className="font-ovo text-2xl uppercase tracking-widest text-white">
                {config.coupleNames}
              </p>
            </div>
            <div className="pt-10 border-t border-white/10 flex flex-col items-center gap-2 text-xs text-white/40 font-legan">
              <p>Digital Wedding Invitation • Inspired by InvitiApp</p>
              <p>© {new Date().getFullYear()} {config.coupleNames}. All rights reserved.</p>
            </div>
          </footer>
        </main>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: SHARE INVITATION */}
      {/* ========================================================================= */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-neutral-900 border border-white/20 p-6 shadow-2xl space-y-5 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-amber-200" />
                <h3 className="font-ovo text-lg uppercase">Share Invitation</h3>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1 rounded-full text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-medium text-white/80">Recipient / Guest Name</label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g. Edward Tauran"
                className="w-full px-3 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white"
              />
              <p className="text-[10px] text-white/50">
                Personalizes the invite URL so your guest sees their dedicated greeting!
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleCopyLink}
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-white text-black hover:bg-gray-200 flex items-center justify-center gap-2 transition"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                {copiedLink ? "Link Copied to Clipboard!" : "Copy Personalized Link"}
              </button>

              <Link
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Halo ${guestName ? guestName : "Family & Friends"}! Kami mengundang Anda untuk hadir di pernikahan kami:\n\n*The Wedding of ${config.coupleNames}*\n📅 ${new Date(config.eventDate).toLocaleDateString("en-US", { dateStyle: "long" })}\n\nBuka undangan digital kami di sini:\n${typeof window !== "undefined" ? window.location.origin : ""}${guestName ? `/to:${encodeURIComponent(guestName)}` : ""}`
                )}`}
                target="_blank"
                className="w-full py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 transition"
              >
                <MessageCircle className="w-4 h-4" />
                Share Directly to WhatsApp
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CASHLESS QR CODE */}
      {/* ========================================================================= */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-neutral-900 border border-white/20 p-6 shadow-2xl space-y-4 text-center text-white">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="font-ovo text-base uppercase">Digital QR Envelope</h3>
              <button onClick={() => setShowQrModal(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white inline-block shadow-inner mx-auto my-2">
              <div className="w-44 h-44 bg-neutral-900 rounded-xl p-3 flex flex-col items-center justify-center text-white text-center space-y-2">
                <QrCode className="w-20 h-20 text-white" />
                <span className="text-[10px] font-mono tracking-widest text-amber-200">QRIS / DIGITAL PAY</span>
              </div>
            </div>

            <p className="text-xs text-white/80 font-legan">
              {config.digitalEnvelope.qrNotice}
            </p>
            <p className="text-[11px] text-amber-200/90 font-thesignature text-xl">
              For {config.coupleNames}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
