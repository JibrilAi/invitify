import { NextResponse } from "next/server";
import { getStoredInvitation, toggleStoredFeature, updateStoredInvitation } from "@/lib/server-store";
import { FeatureFlags } from "@/lib/invitation-store";

export async function GET() {
  try {
    const config = getStoredInvitation();
    return NextResponse.json({ success: true, features: config.features });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch features" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    if (body.feature) {
      const updatedFeatures = toggleStoredFeature(
        body.feature as keyof FeatureFlags,
        typeof body.enabled === "boolean" ? body.enabled : undefined
      );
      return NextResponse.json({ success: true, features: updatedFeatures });
    }

    if (body.features) {
      const config = getStoredInvitation();
      const updated = updateStoredInvitation({
        features: {
          ...config.features,
          ...body.features,
        },
      });
      return NextResponse.json({ success: true, features: updated.features });
    }

    return NextResponse.json({ error: "No feature specified" }, { status: 400 });
  } catch (err) {
    console.error("Failed to update features:", err);
    return NextResponse.json({ success: false, error: "Failed to update features" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  return PATCH(req);
}
