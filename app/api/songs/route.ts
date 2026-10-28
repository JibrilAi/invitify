import { NextResponse } from "next/server";
import { getStoredSongs, addStoredSong, deleteStoredSong } from "@/lib/server-store";

export async function GET() {
  try {
    const songs = getStoredSongs();
    return NextResponse.json({ success: true, songs });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch songs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, artist, requestedBy } = body;

    if (!title || !requestedBy) {
      return NextResponse.json(
        { success: false, error: "Title and your name are required" },
        { status: 400 }
      );
    }

    const song = addStoredSong({
      title: String(title),
      artist: String(artist || "Unknown Artist"),
      requestedBy: String(requestedBy),
    });

    return NextResponse.json({ success: true, song }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to add song request" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const deleted = deleteStoredSong(id);
    return NextResponse.json({ success: deleted });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete song" }, { status: 500 });
  }
}
