import { NextResponse } from "next/server";
import { getStoredInvitation, updateStoredInvitation } from "@/lib/server-store";

export async function GET() {
  try {
    const config = getStoredInvitation();
    return NextResponse.json({ success: true, config });
  } catch (err) {
    console.error("Failed to fetch invitation:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch invitation config" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const updated = updateStoredInvitation(body);
    return NextResponse.json({ success: true, config: updated });
  } catch (err) {
    console.error("Failed to update invitation:", err);
    return NextResponse.json({ success: false, error: "Failed to update invitation" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  return PUT(req);
}
