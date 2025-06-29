"use client";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { getUserUrlStats } from "@/lib/actions";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [copiedId, setCopiedId] = useState(null);

  // Simplified state - using server functions efficiently
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Single data fetch - server provides everything we need
  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.email) {
        try {
          setLoading(true);
          // getUserUrlStats now returns everything including enhanced URLs
          const data = await getUserUrlStats();
          setDashboardData(data);
          setError(null);
        } catch (err) {
          console.error("Error fetching data:", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [session]);

  const getUserInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const formatUrl = (url) => {
    return url.length > 50 ? url.substring(0, 50) + "..." : url;
  };

  // Using server-provided status badges
  const getStatusBadge = (url) => {
    switch (url.status) {
      case "expired":
        return (
          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full flex items-center space-x-1">
            <AlertCircle className="h-3 w-3" />
            <span>Expired</span>
          </span>
        );
      case "expiring-very-soon":
        return (
          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full flex items-center space-x-1 animate-pulse">
            <Timer className="h-3 w-3" />
            <span>Expires Soon</span>
          </span>
        );
      case "expiring-soon":
        return (
          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>Expiring Today</span>
          </span>
        );
      case "expiring-moderate":
        return (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>Expires Soon</span>
          </span>
        );
      default:
        return (
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
            Active
          </span>
        );
    }
  };

  const handleCopyShortUrl = async (shortCode) => {
    const shortUrl = `${window.location.origin}/api/${shortCode}`;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedId(shortCode);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Please sign in
          </h2>
          <p className="text-gray-600">
            You need to be signed in to view your dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <h3 className="text-red-800 font-medium">
              Error loading dashboard
            </h3>
          </div>
          <p className="text-red-700 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  // Extract data from server response
  const userData = dashboardData?.user;
  const urlsData = dashboardData?.urls || [];
  const statsData = dashboardData?.stats;
  const statusCounts = statsData?.statusCounts || { active: 0, expiring: 0, expired: 0 };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 cursor-pointer ring-2 ring-blue-200 shadow-lg">
            <AvatarImage
              src={session.user?.image || ""}
              alt={session.user?.name || "User"}
            />
            <AvatarFallback className="text-lg text-gray-700 bg-gradient-to-br from-blue-100 to-purple-100">
              {session.user?.name ? getUserInitials(session.user.name) : "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {userData?.name || session.user?.name || "User"}
            </h2>
            <p className="text-gray-600">
              {userData?.email || session.user?.email}
            </p>
            {userData?.createdAt && (
              <p className="text-sm text-gray-500">
                Member since {formatDate(userData.createdAt)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards - Using server-provided data */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Links</p>
              <p className="text-3xl font-bold text-blue-600">
                {statsData?.totalLinks || 0}
              </p>
            </div>
            <LinkIcon className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Clicks</p>
              <p className="text-3xl font-bold text-green-600">
                {statsData?.totalClicks || 0}
              </p>
            </div>
            <Eye className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Links</p>
              <p className="text-3xl font-bold text-emerald-600">
                {statusCounts.active}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expiring Soon</p>
              <p className="text-3xl font-bold text-orange-600">
                {statusCounts.expiring}
              </p>
            </div>
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Enhanced Links Expiring Soon Alert - Using server data */}
      {statusCounts.expiring > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <div className="flex items-center">
            <Timer className="h-5 w-5 text-orange-500 mr-2" />
            <h3 className="text-orange-800 font-medium">
              ⚠️ {statusCounts.expiring} link(s) expiring soon
            </h3>
          </div>
          <p className="text-orange-700 text-sm mt-1">
            Some of your links will expire within the next few days. Consider renewing them if they're still needed.
          </p>
        </div>
      )}

      {/* URLs Section - Using server-enhanced URLs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Your URLs</h3>
        </div>

        {/* URLs List */}
        <div className="divide-y divide-gray-200">
          {urlsData.map((url) => (
            <div
              key={url.id}
              className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <p className="text-sm font-medium text-blue-600">
                      {url.shortUrl || `${window.location.origin}/api/${url.shortCode}`}
                    </p>
                    <span className="flex items-center space-x-1 text-sm text-gray-500">
                      <Eye className="h-4 w-4" />
                      <span>{url.clicks || 0} clicks</span>
                    </span>
                    {getStatusBadge(url)}
                  </div>
                  <p
                    className="text-sm text-gray-900 mb-1"
                    title={url.originalUrl}>
                    {formatUrl(url.originalUrl)}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>Created {formatDate(url.createdAt)}</span>
                    </span>
                    {url.expiresAt && (
                      <>
                        <span>
                          Expires {formatDate(url.expiresAt)}
                        </span>
                        {/* Using server-calculated time remaining */}
                        {url.timeRemaining && (
                          <span className="font-medium text-gray-700">
                            ({url.timeRemaining})
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => window.open(url.originalUrl, "_blank")}
                    className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Visit original URL">
                    <ExternalLink className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleCopyShortUrl(url.shortCode)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Copy short URL">
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {copiedId === url.shortCode && (
                <div className="mt-2">
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                    Copied to clipboard!
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {urlsData.length === 0 && (
          <div className="p-12 text-center">
            <LinkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No URLs yet
            </h3>
            <p className="text-gray-500">
              You don't have any short URLs created yet.
            </p>
          </div>
        )}
      </div>

      {/* Most Clicked Link - Using server-provided data */}
      {statsData?.mostClickedLink && (
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🏆 Most Popular Link
          </h3>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-blue-600">
                {`${window.location.origin}/api/${statsData.mostClickedLink.shortCode}`}
              </p>
              <p className="text-sm text-gray-900">
                {formatUrl(statsData.mostClickedLink.originalUrl)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-purple-600">
                {statsData.mostClickedLink.clicks}
              </p>
              <p className="text-xs text-gray-500">clicks</p>
            </div>
          </div>
        </div>
      )}

      {/* Additional Stats Section - Using server data */}
      {statsData && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Average Clicks</h4>
            <p className="text-2xl font-bold text-indigo-600">
              {statsData.averageClicksPerLink}
            </p>
            <p className="text-xs text-gray-500">per link</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Expired Links</h4>
            <p className="text-2xl font-bold text-red-600">
              {statusCounts.expired}
            </p>
            <p className="text-xs text-gray-500">total expired</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Recent Links</h4>
            <p className="text-2xl font-bold text-cyan-600">
              {statsData.recentLinks?.length || 0}
            </p>
            <p className="text-xs text-gray-500">last 5 created</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;