import { NextResponse } from "next/server";
import {
  getStoredInvitation,
  getStoredRsvps,
  getStoredWishes,
  getStoredSongs,
  getStoredGuests,
} from "@/lib/server-store";
import { calculateRsvpStats } from "@/lib/rsvp";

export async function GET() {
  try {
    const config = getStoredInvitation();
    const rsvps = getStoredRsvps();
    const rsvpStats = calculateRsvpStats(rsvps);
    const wishes = getStoredWishes(1, 100);
    const songs = getStoredSongs();
    const guests = getStoredGuests();

    return NextResponse.json({
      success: true,
      stats: {
        rsvps: rsvpStats,
        wishesCount: wishes.total,
        songsCount: songs.length,
        guestsCount: guests.length,
        features: config.features,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch stats" }, { status: 500 });
  }
}
