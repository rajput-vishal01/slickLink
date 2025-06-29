import {deleteExpiredUrls} from "@/lib/shortener-utils"
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import UrlShortenerForm from "@/components/UrlShortenerForm";

export default async function Home() {
  const session = await auth();
  // Run once immediately when script starts
deleteExpiredUrls()

  // Get the current anonymous usage count (only relevant for non-authenticated users)
  const cookieStore = await cookies();
  const usageCookie = cookieStore.get("anon-usage");
  const currentUsage = usageCookie ? parseInt(usageCookie.value) : 0;
  const hasExceededLimit = currentUsage >= 3;

  // Only show anonymous usage messages if user is NOT signed in
  const showAnonymousMessages = !session;

  return (
    <div className="max-w-md mx-auto p-6">
      {/* Only show this message when user is anonymous AND has exceeded limits */}
      {showAnonymousMessages && hasExceededLimit && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          <p className="font-medium mb-1">Usage Limit Reached</p>
          <p>You have reached the anonymous limit of 3 shortened URLs.</p>
          <p className="mt-1 text-xs">Please sign in to create more URLs.</p>
        </div>
      )}
      <UrlShortenerForm />
    </div>
  );
}
