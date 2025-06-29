import UrlShortenerForm from "@/components/UrlShortenerForm";

export default function Home() {
  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">URL Shortener</h1>
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-md text-sm">
        <p className="font-medium mb-1">Anonymous Usage</p>
        <p>You can create up to 3 shortened URLs without signing in.</p>
        <p className="mt-1 text-xs">All URLs expire within 1 day maximum.</p>
      </div>

      <UrlShortenerForm />
    </div>
  );
}
