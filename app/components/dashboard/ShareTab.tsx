"use client";

import React, { useState } from "react";
import { InvitationConfig } from "@/lib/invitation-store";
import {
  Copy,
  Check,
  MessageCircle,
  QrCode,
  Link2,
} from "lucide-react";

interface ShareTabProps {
  config: InvitationConfig;
}

export default function ShareTab({ config }: ShareTabProps) {
  const [recipientName, setRecipientName] = useState("Jonathan & Family");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const personalizedUrl = recipientName.trim()
    ? `${baseUrl}/to:${encodeURIComponent(recipientName.trim())}`
    : baseUrl;

  const invitationMessage = `Dear ${recipientName.trim() || "Family & Friends"},\n\nWe cordially invite you to celebrate our holy matrimony and wedding day:\n\n*The Wedding of ${config.coupleNames}*\n📅 ${new Date(config.eventDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}\n📍 ${config.venues.holyMatrimony.place}\n\nPlease open your personalized digital invitation and RSVP here:\n${personalizedUrl}\n\nWith love,\n${config.coupleNames}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(personalizedUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyText = () => {
    navigator.clipboard?.writeText(invitationMessage);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-neutral-900 border border-white/10 space-y-2">
        <h3 className="font-ovo text-lg uppercase text-white">Personalized Guest Link Generator</h3>
        <p className="text-xs text-white/60">
          Like InvitiApp, create unique personalized links for each guest or family. When opened, the invitation shows their name on the greeting badge.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: Input & Link */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-white/10 space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/80 mb-1.5">
              Guest / Family Name
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="e.g. Uncle Bernard & Family"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-amber-300"
            />
            <p className="text-[10px] text-white/40 mt-1">
              Example: &ldquo;Amanda & Jonathan&rdquo;, &ldquo;Dr. Henderson&rdquo;, or &ldquo;The Williams Family&rdquo;
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <label className="block text-xs font-medium text-white/80">Generated Link</label>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-amber-200 break-all">
              <Link2 className="w-4 h-4 shrink-0 text-white/40" />
              <span className="truncate">{personalizedUrl}</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleCopyLink}
                className="py-2.5 px-3 rounded-xl text-xs font-semibold bg-white text-black hover:bg-gray-200 transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? "Link Copied!" : "Copy Link"}</span>
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(invitationMessage)}`}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Share WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right: Message Preview & QR Code */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-200">WhatsApp Message Template</span>
            <button
              onClick={handleCopyText}
              className="text-xs text-white/60 hover:text-white flex items-center gap-1"
            >
              {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedText ? "Copied" : "Copy Message"}</span>
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white/80 whitespace-pre-line font-mono max-h-48 overflow-y-auto leading-relaxed">
            {invitationMessage}
          </div>

          <div className="pt-2 flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0">
              <QrCode className="w-full h-full text-black" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">QR Code for Physical Cards</p>
              <p className="text-[10px] text-white/50">
                Print this QR code on wedding stationery so guests can scan directly to this link.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
