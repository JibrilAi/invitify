import { NextResponse } from "next/server";
import { getWishes } from "@/lib/wishesStore";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "5", 10);

  try {
    const result = await getWishes(page, limit);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching wishes:", error);
    return NextResponse.json(
      { wishes: [], totalPages: 1, currentPage: page },
      { status: 200 }
    );
  }
}
