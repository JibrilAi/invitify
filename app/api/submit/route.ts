import { NextResponse } from "next/server";
import { addStoredWish, addStoredRsvp } from "@/lib/server-store";

export async function POST(req: Request) {
  try {
    const { name, attendance, guests, message } = await req.json();

    if (!name || !attendance || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const guestCount = Math.min(10, Math.max(1, Number(guests) || 1));
    const attendanceStatus = attendance === "Tidak Hadir" || attendance === "No" ? "No" : "Yes";

    // Add to server wishes
    const wish = addStoredWish({
      name: String(name).trim(),
      attendance: String(attendance),
      guests: guestCount,
      message: String(message).trim(),
    });

    // Also add to server RSVPs
    addStoredRsvp({
      guestName: String(name).trim(),
      attendanceStatus,
      numberOfAttendees: attendanceStatus === "Yes" ? guestCount : 0,
    });

    return NextResponse.json(
      { message: "RSVP & Wish submitted successfully", wish },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to submit RSVP:", error);
    return NextResponse.json(
      { error: "Failed to submit RSVP" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return new NextResponse("Method Not Allowed", { status: 405 });
}
