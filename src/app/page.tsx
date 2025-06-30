import { deleteExpiredUrls } from "@/lib/shortener-utils";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import UrlShortenerForm from "@/components/UrlShortenerForm";
import { Link2, Zap, Shield, BarChart3 } from "lucide-react";

export default async function Home() {
  const session = await auth();

  //delete expired urls
  deleteExpiredUrls();

  /* anonymous usage limit (3) */
  const cookieStore = await cookies();
  const usageCookie = cookieStore.get("anon-usage");
  const currentUsage = usageCookie ? parseInt(usageCookie.value) : 0;
  const overLimit = currentUsage >= 3;
  const showAnonMsg = !session;

  return (
    <div className="min-h-screen">
      <div className="relative z-10">
        {/* ────────────── Hero ────────────── */}
        <section className="pt-32 pb-20 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent block">
                Make your links
              </span>
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block">
                slick & short
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Transform long URLs into clean, shareable links. Generate QR
              codes, track clicks, and manage everything from one beautiful
              dashboard.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-10">
              {[
                "⚡ Instant shortening",
                "📱 QR code generation",
                "📊 Click analytics",
              ].map((txt) => (
                <span
                  key={txt}
                  className="rounded-xl-glass px-4 py-2 text-sm text-gray-300">
                  {txt}
                </span>
              ))}
            </div>
          </div>
        </section>
        <section className="pb-20 px-4">
          <div className="max-w-2xl mx-auto">
            {/* anonymous limit warning */}
            {showAnonMsg && overLimit && (
              <div className="rounded-xl-glass bg-red-500/10 border-red-500/20 mb-6 p-4 text-center">
                <p className="font-medium text-red-400 mb-2">
                  Usage Limit Reached
                </p>
                <p className="text-red-300/80 text-sm mb-2">
                  You’ve created 3 anonymous links.
                </p>
                <p className="text-red-300/60 text-xs">
                  Sign in for unlimited shortening and analytics.
                </p>
              </div>
            )}
            {/* form container */}
            <div className="card-glass rounded-3xl p-8 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl pointer-events-none" />
              <UrlShortenerForm />
            </div>
            {/* anonymous usage footer */}
            {showAnonMsg && !overLimit && (
              <div className="mt-6 text-center text-sm text-gray-500">
                Anonymous usage: {currentUsage}/3 links
                <div className="text-xs text-gray-600 mt-1">
                  Sign in to remove limits and unlock more features
                </div>
              </div>
            )}
          </div>
        </section>
        {/* ────────────── Features Grid ────────────── */}
        <section className="pb-20 px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Link2 className="w-6 h-6 text-blue-400" />,
                title: "Smart Links",
                desc: "Create intelligent short links that work everywhere.",
                color: "blue",
              },
              {
                icon: <Zap className="w-6 h-6 text-purple-400" />,
                title: "Lightning Fast",
                desc: "Generate short URLs and QR codes instantly.",
                color: "purple",
              },
              {
                icon: <Shield className="w-6 h-6 text-green-400" />,
                title: "Secure & Private",
                desc: "Enterprise‑grade security and privacy for every link.",
                color: "green",
              },
              {
                icon: <BarChart3 className="w-6 h-6 text-pink-400" />,
                title: "Analytics",
                desc: "Track clicks and monitor engagement effortlessly.",
                color: "pink",
              },
            ].map(({ icon, title, desc, color }) => (
              <div
                key={title}
                className="rounded-xl-glass p-6 hover:bg-white/10 transition group">
                <div
                  className={`w-12 h-12 mb-4 rounded-xl flex-center bg-gradient-to-br from-${color}-500/20 to-${color}-600/20 group-hover:scale-110 transition-transform`}>
                  {icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {title}
                </h3>
                <p className="text-gray-400 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
