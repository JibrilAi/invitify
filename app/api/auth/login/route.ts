import { NextResponse } from "next/server";
import { createServerSession } from "@/lib/server-store";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const passcode = (body.passcode || body.code || "").toString().trim().toLowerCase();
    const email = (body.email || "").toString().trim().toLowerCase();
    const password = (body.password || "").toString().trim();

    const validPasscodes = ["admin", "1234", "inviti", "mikha", "clara", "wedding"];
    const isPasscodeValid = validPasscodes.includes(passcode);
    const isEmailValid =
      (email === "admin@invitiapp.com" || email === "host@invitiapp.com" || email === "admin") &&
      (password === "admin123" || password === "1234" || password === "inviti" || !password);

    // Also support quick 1-click access
    const isQuickAccess = body.quickAccess === true || body.demo === true;

    if (isPasscodeValid || isEmailValid || isQuickAccess) {
      const token = createServerSession("host");
      const res = NextResponse.json({
        success: true,
        message: "Logged in successfully",
        token,
        user: {
          role: "host",
          name: "Mikha & Clara",
          email: email || "admin@invitiapp.com",
        },
      });

      // Set cookie for session persistence across pages
      res.cookies.set("invitiapp_session", token, {
        path: "/",
        httpOnly: false, // Accessible to client scripts if needed
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return res;
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid credentials. Try passcode 'admin', '1234', or 'inviti'.",
      },
      { status: 401 }
    );
  } catch (error) {
    console.error("Auth login error:", error);
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 500 });
  }
}
