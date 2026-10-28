import { NextResponse } from "next/server";
import { getStoredWishes, addStoredWish, deleteStoredWish } from "@/lib/server-store";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const result = getStoredWishes(page, limit);
    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Error fetching wishes:", error);
    return NextResponse.json(
      { success: false, wishes: [], totalPages: 1, currentPage: 1 },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, attendance, guests, message } = body;

    if (!name || !attendance || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const wish = addStoredWish({
      name: String(name).trim(),
      attendance: String(attendance),
      guests: Math.min(10, Math.max(1, Number(guests) || 1)),
      message: String(message).trim(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Wish submitted successfully",
        wish,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to submit wish:", error);
    return NextResponse.json({ success: false, error: "Failed to submit wish" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }
    const success = deleteStoredWish(id);
    return NextResponse.json({ success });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete wish" }, { status: 500 });
  }
}
