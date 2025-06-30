"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Link as LinkIcon,
  Copy,
  Calendar,
  TrendingUp,
  Eye,
  AlertCircle,
  Clock,
  ExternalLink,
  Timer,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserUrlStats } from "@/lib/actions";

// --- Type Definitions ---
type User = {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
};

type Url = {
  id: string;
  shortUrl?: string;
  shortCode: string;
  originalUrl: string;
  clicks?: number;
  createdAt: Date;
  expiresAt?: Date | null;
  timeRemaining?: string | null;
  status?: string;
  isExpired?: boolean | null;
  daysUntilExpiry?: number | null;
  clicksToday?: number;
  daysSinceCreated?: number;
};

type Stats = {
  totalLinks?: number;
  totalClicks?: number;
  averageClicksPerLink?: number;
  recentLinks?: Url[];
  mostClickedLink?: Url | null;
  statusCounts?: {
    active: number;
    expiring: number;
    expired: number;
  };
};

type DashboardData = {
  user: User;
  urls: Url[];
  stats: Stats;
};

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.email) return;
      try {
        setLoading(true);
        const data = await getUserUrlStats();
        setDashboardData(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Something went wrong.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [session]);

  const initials = (name?: string | null) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const fmtDate = (
    d: string | Date
  ) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const short = (url: string) =>
    url.length > 50 ? url.slice(0, 50) + "…" : url;

  const copyUrl = async (code: string) => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/api/${code}`
      );
      setCopiedId(code);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // no-op
    }
  };

  const Status = ({ url }: { url: Url }) => {
    const base =
      "text-xs backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg";
    switch (url.status) {
      case "expired":
        return (
          <span
            className={`${base} bg-red-500/20 text-red-300 border border-red-500/30`}>
            <AlertCircle className="h-3 w-3" />
            Expired
          </span>
        );
      case "expiring-very-soon":
        return (
          <span
            className={`${base} animate-pulse bg-red-500/20 text-red-300 border border-red-500/30`}>
            <Timer className="h-3 w-3" />
            Expires Soon
          </span>
        );
      case "expiring-soon":
        return (
          <span
            className={`${base} bg-orange-500/20 text-orange-300 border border-orange-500/30`}>
            <Clock className="h-3 w-3" />
            Expiring Today
          </span>
        );
      case "expiring-moderate":
        return (
          <span
            className={`${base} bg-yellow-500/20 text-yellow-300 border border-yellow-500/30`}>
            <Clock className="h-3 w-3" />
            Expires Soon
          </span>
        );
      default:
        return (
          <span
            className={`${base} bg-green-500/20 text-green-300 border border-green-500/30`}>
            Active
          </span>
        );
    }
  };

  if (status === "loading" || loading)
    return (
      <div className="min-h-screen flex-center">
        <div className="card-glass rounded-3xl p-8 flex-center flex-col gap-4">
          <div className="h-16 w-16 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
          <p className="text-white/80">Loading dashboard…</p>
        </div>
      </div>
    );

  if (!session)
    return (
      <div className="min-h-screen flex-center px-4">
        <div className="card-glass rounded-3xl p-12 text-center max-w-md">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
            Please sign in
          </h2>
          <p className="text-gray-400">
            You must be signed in to view your dashboard.
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-3xl backdrop-blur-xl bg-red-500/10 border border-red-500/20 p-8 shadow-2xl shadow-red-500/10">
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="h-6 w-6 text-red-400" />
            <h3 className="text-red-300 font-medium text-lg">
              Error loading dashboard
            </h3>
          </div>
          <p className="text-red-400/80">{error}</p>
        </div>
      </div>
    );

  const { user, urls = [], stats } = dashboardData || {};
  const { statusCounts = { active: 0, expiring: 0, expired: 0 } } = stats || {};

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ───────── profile ───────── */}
        <section className="card-glass rounded-3xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-3xl" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6">
            <Avatar className="h-20 w-20 ring-2 ring-white/20 shadow-xl">
              <AvatarImage
                src={session.user?.image || ""}
                alt={session.user?.name || "User"}
              />
              <AvatarFallback className="text-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                {initials(session.user?.name || user?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {user?.name || session.user?.name}
              </h2>
              <p className="text-gray-400 text-lg break-all">
                {user?.email || session.user?.email}
              </p>
              {user?.createdAt && (
                <p className="text-xs-gray">
                  Member since {fmtDate(user.createdAt)}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {[
            {
              label: "Total Links",
              value: stats?.totalLinks ?? 0,
              color: "blue",
              Icon: LinkIcon,
            },
            {
              label: "Total Clicks",
              value: stats?.totalClicks ?? 0,
              color: "green",
              Icon: Eye,
            },
            {
              label: "Active Links",
              value: statusCounts.active,
              color: "emerald",
              Icon: TrendingUp,
            },
            {
              label: "Expiring Soon",
              value: statusCounts.expiring,
              color: "orange",
              Icon: Clock,
            },
          ].map(({ label, value, color, Icon }) => (
            <div
              key={label}
              className={`rounded-xl-glass p-6 shadow-2xl hover:bg-white/10 transition group relative overflow-hidden`}>
              <div
                className={`absolute inset-0 bg-${color}-500/5 pointer-events-none rounded-2xl`}
              />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">{label}</p>
                  <p className={`text-3xl font-bold text-${color}-400`}>
                    {value}
                  </p>
                </div>
                <Icon
                  className={`h-8 w-8 text-${color}-400 group-hover:scale-110 transition`}
                />
              </div>
            </div>
          ))}
        </section>

        {/* ───────── expiring alert ───────── */}
        {statusCounts.expiring > 0 && (
          <div className="rounded-xl-glass bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-6 mb-8 shadow-2xl">
            <div className="flex items-center gap-3">
              <Timer className="h-6 w-6 text-orange-400" />
              <h3 className="text-orange-300 text-lg font-medium">
                ⚠️ {statusCounts.expiring} link(s) expiring soon
              </h3>
            </div>
            <p className="text-orange-400/80 text-sm mt-2">
              Some links will expire shortly. Renew them if needed.
            </p>
          </div>
        )}

        {/* ───────── urls list ───────── */}
        <section className="card-glass rounded-3xl shadow-2xl overflow-hidden">
          <header className="p-6 sm:p-8 border-b border-white/10">
            <h3 className="text-2xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Your URLs
            </h3>
          </header>

          {/* list container with horizontal safety */}
          <div className="divide-y divide-white/10 overflow-x-auto">
            {urls.length === 0 && (
              <div className="p-16 flex-center flex-col gap-6">
                <LinkIcon className="h-16 w-16 text-gray-500" />
                <h3 className="text-xl font-medium text-gray-300">
                  No URLs yet
                </h3>
                <p className="text-gray-500">
                  Create your first short URL to see it here.
                </p>
              </div>
            )}

            {urls.map((url) => (
              <div
                key={url.id}
                className="p-6 sm:p-8 flex flex-col gap-4 sm:gap-0 sm:flex-row sm:items-start hover:bg-white/5 transition">
                {/* left side */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <p className="text-sm font-medium text-blue-400 break-all">
                      {url.shortUrl ||
                        `${window.location.origin}/api/${url.shortCode}`}
                    </p>
                    <span className="flex items-center gap-1.5 text-xs-gray">
                      <Eye className="h-4 w-4" />
                      {url.clicks ?? 0} clicks
                    </span>
                    <Status url={url} />
                  </div>

                  <p
                    className="text-sm text-gray-300 break-all mb-2"
                    title={url.originalUrl}>
                    {short(url.originalUrl)}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs-gray">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      Created {fmtDate(url.createdAt)}
                    </span>
                    {url.expiresAt && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        Expires {fmtDate(url.expiresAt)}
                      </span>
                    )}
                    {url.timeRemaining && (
                      <span className="font-medium text-gray-400">
                        ({url.timeRemaining})
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => window.open(url.originalUrl, "_blank")}
                    className="p-3 rounded-xl-glass hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/30 transition"
                    title="Visit original URL">
                    <ExternalLink className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => copyUrl(url.shortCode)}
                    className="p-3 rounded-xl-glass hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/30 transition"
                    title="Copy short URL">
                    <Copy className="h-5 w-5" />
                  </button>
                </div>

                {copiedId === url.shortCode && (
                  <span className="p-3 rounded-xl-glass ml-3">Copied !</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ───────── most clicked ───────── */}
        {stats?.mostClickedLink && (
          <section className="card-glass rounded-3xl p-8 mt-8 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent pointer-events-none rounded-3xl" />
            <div className="relative z-10 space-y-6">
              <h3 className="text-xl font-semibold text-white">
                🏆 Most Popular Link
              </h3>
              <div className="rounded-xl-glass p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="break-all">
                  <p className="text-sm font-medium text-blue-400 mb-1">
                    {`${window.location.origin}/api/${stats.mostClickedLink.shortCode}`}
                  </p>
                  <p className="text-sm text-gray-300">
                    {short(stats.mostClickedLink.originalUrl)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-purple-400">
                    {stats.mostClickedLink.clicks}
                  </p>
                  <p className="text-xs-gray">clicks</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ───────── additional stats ───────── */}
        {stats && (
          <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                label: "Average Clicks",
                value: stats.averageClicksPerLink,
                color: "indigo",
                suffix: "per link",
              },
              {
                label: "Expired Links",
                value: statusCounts.expired,
                color: "red",
                suffix: "total",
              },
              {
                label: "Recent Links",
                value: stats.recentLinks?.length || 0,
                color: "cyan",
                suffix: "last 5",
              },
            ].map(({ label, value, color, suffix }) => (
              <div
                key={label}
                className="rounded-xl-glass p-6 shadow-2xl relative overflow-hidden">
                <div
                  className={`absolute inset-0 bg-${color}-500/5 pointer-events-none rounded-2xl`}
                />
                <div className="relative z-10 space-y-1">
                  <h4 className="text-sm font-medium text-gray-400">{label}</h4>
                  <p className={`text-2xl font-bold text-${color}-400`}>
                    {value}
                  </p>
                  <p className="text-xs-gray">{suffix}</p>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
