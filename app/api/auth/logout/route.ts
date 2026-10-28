import { NextResponse } from "next/server";
import { removeServerSession } from "@/lib/server-store";

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const sessionMatch = cookieHeader.match(/invitiapp_session=([^;]+)/);
    const token = sessionMatch ? sessionMatch[1] : null;

    if (token) {
      removeServerSession(token);
    }

    const res = NextResponse.json({ success: true, message: "Logged out successfully" });
    res.cookies.set("invitiapp_session", "", {
      path: "/",
      maxAge: 0,
    });
    return res;
  } catch {
    return NextResponse.json({ success: false, error: "Logout failed" }, { status: 500 });
  }
}
