import { NextResponse } from "next/server";
import { validateServerSession } from "@/lib/server-store";

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const sessionMatch = cookieHeader.match(/invitiapp_session=([^;]+)/);
    const authHeader = req.headers.get("authorization") || "";
    const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    const token = bearerToken || (sessionMatch ? sessionMatch[1] : null);
    const isValid = validateServerSession(token);

    return NextResponse.json({
      authenticated: isValid,
      user: isValid
        ? {
            role: "host",
            name: "Mikha & Clara",
            email: "admin@invitiapp.com",
          }
        : null,
    });
  } catch {
    return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
  }
}
