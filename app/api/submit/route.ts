import { NextResponse } from "next/server";
import { addWish } from "@/lib/wishesStore";

export async function POST(req: Request) {
  try {
    const { name, attendance, guests, message } = await req.json();

    if (!name || !attendance || !guests || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await addWish({
      name: String(name).trim(),
      attendance: String(attendance),
      guests: Math.min(4, Math.max(1, Number(guests) || 1)),
      message: String(message).trim(),
    });

    return NextResponse.json(
      { message: "RSVP submitted successfully" },
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
