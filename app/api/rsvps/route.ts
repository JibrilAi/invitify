import { NextResponse } from "next/server";
import {
  getStoredRsvps,
  addStoredRsvp,
  deleteStoredRsvp,
  addStoredWish,
} from "@/lib/server-store";
import { calculateRsvpStats, validateRsvpForm } from "@/lib/rsvp";

export async function GET() {
  try {
    const submissions = getStoredRsvps();
    const stats = calculateRsvpStats(submissions);
    return NextResponse.json({
      success: true,
      submissions,
      stats,
    });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch RSVPs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = validateRsvpForm({
      guestName: body.guestName || body.name,
      attendanceStatus: body.attendanceStatus || (body.attendance === "Hadir" ? "Yes" : body.attendance === "Tidak Hadir" ? "No" : body.attendance),
      numberOfAttendees: Number(body.numberOfAttendees ?? body.guests ?? 1),
    });

    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: "Validation failed", errors: validation.errors },
        { status: 400 }
      );
    }

    const attendanceStatus = (body.attendanceStatus || (body.attendance === "Hadir" ? "Yes" : "No")) as "Yes" | "No";
    const attendees = Number(body.numberOfAttendees ?? body.guests ?? (attendanceStatus === "Yes" ? 1 : 0));

    const record = addStoredRsvp({
      guestName: body.guestName || body.name,
      attendanceStatus,
      numberOfAttendees: attendees,
    });

    // If message is also provided, synchronize it into guestbook wishes
    if (body.message && typeof body.message === "string" && body.message.trim().length > 0) {
      addStoredWish({
        name: body.guestName || body.name,
        attendance: attendanceStatus === "Yes" ? "Hadir" : "Tidak Hadir",
        guests: attendees,
        message: body.message,
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "RSVP saved successfully",
        rsvp: record,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Failed to submit RSVP:", err);
    return NextResponse.json({ success: false, error: "Failed to submit RSVP" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }
    const deleted = deleteStoredRsvp(id);
    return NextResponse.json({ success: deleted });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete RSVP" }, { status: 500 });
  }
}
