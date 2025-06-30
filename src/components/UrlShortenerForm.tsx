"use client";

import Image from "next/image";
import React, { useState } from "react";
import {
  Copy,
  ExternalLink,
  Check,
  QrCode,
  Link2,
  Clock,
  Sparkles,
} from "lucide-react";

interface ShortenResponse {
  shortUrl: string;
  originalUrl: string;
  expiresAt: string;
}

interface RequestBody {
  originalUrl: string;
  customCode?: string;
  expiresAt?: string;
}

type ExpirationOption = "6h" | "1d" | "4d" | "7d";

export default function UrlShortenerForm(): React.JSX.Element {
  const [url, setUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [expiresAt, setExpiresAt] = useState<ExpirationOption>("7d");
  const [result, setResult] = useState<ShortenResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);

  const timeMap = {
    "6h": 6 * 60 * 60 * 1000,
    "1d": 24 * 60 * 60 * 1000,
    "4d": 4 * 24 * 60 * 60 * 1000,
    "7d": 7 * 24 * 60 * 60 * 1000,
  };

  const getShortCode = (shortUrl: string) => shortUrl?.split("/").pop() || "";

  const getFullRedirectUrl = (shortCode: string) =>
    `${window.location.origin}/api/${shortCode}`;

  const formatExpirationTime = (expiresAt: string): string => {
    const diff = new Date(expiresAt).getTime() - new Date().getTime();
    const hrs = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hrs / 24);
    if (days > 0) return `${days} day${days > 1 ? "s" : ""}`;
    if (hrs > 0) return `${hrs} hour${hrs > 1 ? "s" : ""}`;
    return "Less than 1 hour";
  };

  const sendUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    setQrCode(null);

    try {
      const body: RequestBody = { originalUrl: url.trim() };
      if (customCode.trim()) body.customCode = customCode.trim();
      if (expiresAt)
        body.expiresAt = new Date(
          Date.now() + timeMap[expiresAt]
        ).toISOString();

      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const response: ShortenResponse = await res.json();
      if (!res.ok) {
        const errorResponse = response as { error?: string };
        throw new Error(errorResponse.error || "Request failed");
      }

      setResult(response);
      setUrl("");
      setCustomCode("");
      setExpiresAt("7d");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const generateQrCode = async (shortCode: string) => {
    setQrLoading(true);
    try {
      const url = getFullRedirectUrl(shortCode);
      const res = await fetch(`/api/qr?url=${encodeURIComponent(url)}`);
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      setQrCode(URL.createObjectURL(blob));
    } catch {
      setError("Failed to generate QR code");
    } finally {
      setQrLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silent fail for clipboard access
    }
  };

  const redirect = (shortCode: string) => {
    if (shortCode) window.open(`/api/${shortCode}`, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <form onSubmit={sendUrl} className="space-y-6">
        {/* URL input */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <Link2 className="w-4 h-4 text-blue-400" />
            Original URL
          </label>
          <div className="relative">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/long-url"
              disabled={loading}
              required
              className="w-full h-12 px-4 pr-12 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/50 focus:bg-white/10 text-sm"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                <Link2 className="w-3 h-3 text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Custom code */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Custom Short Code
            <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full ml-1">
              Optional
            </span>
          </label>
          <input
            type="text"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            placeholder="my-custom-code"
            disabled={loading}
            className="w-full h-12 px-4 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/50 focus:bg-white/10 text-sm"
          />
        </div>

        {/* Expiration select */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <Clock className="w-4 h-4 text-green-400" />
            Expiration Time
          </label>
          <div className="relative">
            <select
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value as ExpirationOption)}
              disabled={loading}
              className="w-full h-12 px-4 appearance-none cursor-pointer rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 text-white focus:outline-none focus:border-green-400/50 focus:bg-white/10 text-sm"
            >
              <option value="6h" className="bg-gray-800">
                6 Hours
              </option>
              <option value="1d" className="bg-gray-800">
                1 Day
              </option>
              <option value="4d" className="bg-gray-800">
                4 Days
              </option>
              <option value="7d" className="bg-gray-800">
                7 Days (Default)
              </option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:from-blue-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Shortening...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Shorten URL</span>
            </>
          )}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="backdrop-blur-xl bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-sm text-red-300">
          <p className="font-medium text-red-400 mb-1">Error</p>
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6 shadow-green-500/10 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-green-500/20 rounded-full">
              <Check className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="font-semibold text-green-400">URL Shortened!</p>
              <p className="text-green-300/70 text-sm">Ready to share</p>
            </div>
          </div>

          <div className="space-y-2 bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Short URL</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatExpirationTime(result.expiresAt)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <code className="flex-1 text-sm text-white font-mono break-all">
                {getFullRedirectUrl(getShortCode(result.shortUrl))}
              </code>
              <button
                onClick={() =>
                  copyToClipboard(
                    getFullRedirectUrl(getShortCode(result.shortUrl))
                  )
                }
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 transition"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-300" />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => redirect(getShortCode(result.shortUrl))}
              className="flex-1 h-10 rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 transition text-white flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Test Link
            </button>
            <button
              onClick={() => generateQrCode(getShortCode(result.shortUrl))}
              disabled={qrLoading}
              className="flex-1 h-10 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 transition text-white flex items-center justify-center gap-2"
            >
              {qrLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <QrCode className="w-4 h-4" />
                  <span>Generate QR</span>
                </>
              )}
            </button>
          </div>

          {qrCode && (
            <div className="space-y-3 text-center">
              <p className="text-xs text-gray-400">Scan this QR code</p>
              <div className="flex justify-center">
                <Image
                  src={qrCode}
                  alt="QR Code"
                  width={200}
                  height={200}
                  className="rounded-xl border border-white/20"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}