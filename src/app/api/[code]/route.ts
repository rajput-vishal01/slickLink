import { findByShortCode, incrementClicks } from "@/lib/shortener-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = await params;

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { error: "Invalid Short Code" },
        { status: 400 }
      );
    }

    const originalUrl = await findByShortCode(code);

    if (!originalUrl) {
      return NextResponse.json(
        { error: "Short URL not found" },
        { status: 404 }
      );
    }

    incrementClicks(code);

    return NextResponse.redirect(originalUrl.originalUrl, 302);
  } catch (error) {
    console.error("Redirect error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
