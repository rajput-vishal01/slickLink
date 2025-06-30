import { cookies } from "next/headers";
import {
  generateShortCode,
  isCodeAvailable,
  isValidUrl,
} from "@/lib/shortener-utils";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  const { originalUrl, customCode, expiresAt } = await request.json();

  if (!isValidUrl(originalUrl)) {
    return Response.json({ error: "Invalid URL" }, { status: 400 });
  }

  // Anonymous users: limit to 3 links using cookie
  if (!session) {
    const cookieStore = await cookies();
    const usageCookie = cookieStore.get("anon-usage");
    const count = usageCookie ? parseInt(usageCookie.value) : 0;

    if (count >= 3) {
      return Response.json(
        { error: "Anonymous usage limit reached (3 links)" },
        { status: 403 }
      );
    }

    // Increment the count and update cookie
    cookieStore.set("anon-usage", String(count + 1), {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "lax",
    });
  }

  // Validate custom short code if provided
  if (customCode && !(await isCodeAvailable(customCode))) {
    return Response.json(
      { error: "Custom code already exists" },
      { status: 400 }
    );
  }

  let expirationDate: Date;
  if (expiresAt) {
    const parsed = new Date(expiresAt);
    if (isNaN(parsed.getTime())) {
      return Response.json(
        { error: "Invalid expiration date" },
        { status: 400 }
      );
    }

    // Validate that the expiration date is within allowed options
    const now = new Date();
    const timeDiff = parsed.getTime() - now.getTime();
    const allowedDurations = [
      6 * 60 * 60 * 1000, // 6 hours
      24 * 60 * 60 * 1000, // 1 day
      4 * 24 * 60 * 60 * 1000, // 4 days
      7 * 24 * 60 * 60 * 1000, // 7 days
    ];

    // Check if the provided duration matches one of the allowed options (with 1 minute tolerance)
    const isValidDuration = allowedDurations.some(
      (duration) => Math.abs(timeDiff - duration) < 60 * 1000
    );

    if (!isValidDuration) {
      return Response.json(
        {
          error:
            "Invalid expiration duration. Allowed options: 6 hours, 1 day, 4 days, 7 days",
        },
        { status: 400 }
      );
    }

    expirationDate = parsed;
  } else {
    // Default to 7 days from now
    expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }

  const shortCode = customCode || generateShortCode();

  await prisma.url.create({
    data: {
      originalUrl,
      shortCode,
      userId: session?.user?.id || null,
      expiresAt: expirationDate,
    },
  });

  return Response.json({
    shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${shortCode}`,
    shortCode,
    expiresAt: expirationDate.toISOString(),
  });
}