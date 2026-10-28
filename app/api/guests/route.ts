import { NextResponse } from "next/server";
import { getStoredGuests, addStoredGuest, deleteStoredGuest } from "@/lib/server-store";

export async function GET() {
  try {
    const guests = getStoredGuests();
    return NextResponse.json({ success: true, guests });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch guests" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, seats, customNote } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ success: false, error: "Guest name is required" }, { status: 400 });
    }

    const guest = addStoredGuest({
      name: name.trim(),
      phone: phone ? String(phone).trim() : undefined,
      seats: Number(seats) || 1,
      customNote: customNote ? String(customNote).trim() : undefined,
    });

    return NextResponse.json({ success: true, guest }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to create guest" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const deleted = deleteStoredGuest(id);
    return NextResponse.json({ success: deleted });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete guest" }, { status: 500 });
  }
}
