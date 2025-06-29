"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, ExternalLink, Check } from "lucide-react"

interface ShortenResponse {
  shortUrl: string
  originalUrl: string
  expiresAt: string
}

interface RequestBody {
  originalUrl: string
  customCode?: string
  expiresAt?: string
}

type ExpirationOption = '1h' | '6h' | '12h' | '1d'

interface TimeMap {
  [key: string]: number
}

export default function UrlShortenerForm(): JSX.Element {
  const [url, setUrl] = useState<string>("")
  const [customCode, setCustomCode] = useState<string>("")
  const [expiresAt, setExpiresAt] = useState<ExpirationOption>("1d")
  const [result, setResult] = useState<ShortenResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [copied, setCopied] = useState<boolean>(false)

  const sendUrl = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setResult(null)

    try {
      const requestBody: RequestBody = { originalUrl: url }

      if (customCode.trim()) requestBody.customCode = customCode.trim()

      if (expiresAt) {
        const timeMap: TimeMap = {
          '1h': 60 * 60 * 1000,
          '6h': 6 * 60 * 60 * 1000,
          '12h': 12 * 60 * 60 * 1000,
          '1d': 24 * 60 * 60 * 1000
        }
        requestBody.expiresAt = new Date(Date.now() + timeMap[expiresAt]).toISOString()
      }

      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      })

      const response: ShortenResponse = await res.json()

      if (!res.ok) throw new Error((response as any).error || `Request failed (${res.status})`)

      setResult(response)
      setUrl("")
      setCustomCode("")
      setExpiresAt("1d")
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Silently fail
    }
  }

  const getShortCode = (shortUrl: string): string => shortUrl?.split("/").pop() || ""

  const getFullRedirectUrl = (shortCode: string): string => {
    return `${window.location.origin}/api/${shortCode}`
  }

  const redirect = (shortCode: string): void => {
    if (shortCode) window.open(`/api/${shortCode}`, "_blank")
  }

  return (
    <div className="space-y-4">
      <form onSubmit={sendUrl} className="space-y-4">
        <Input
          type="url"
          placeholder="Enter the URL (required)"
          value={url}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
          disabled={loading}
        />
        <Input
          placeholder="Custom short code (optional)"
          value={customCode}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomCode(e.target.value)}
          disabled={loading}
        />
        <select
          value={expiresAt}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setExpiresAt(e.target.value as ExpirationOption)}
          disabled={loading}
          className="flex h-10 w-full rounded-md border border-gray-600 bg-gray-800 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="1h">1 Hour</option>
          <option value="6h">6 Hours</option>
          <option value="12h">12 Hours</option>
          <option value="1d">1 Day</option>
        </select>

        <Button
          type="submit"
          disabled={loading || !url.trim()}
          className="w-full"
        >
          {loading ? "Shortening..." : "Shorten URL"}
        </Button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-green-100 border border-green-300 text-green-700 rounded-md space-y-3">
          <h3 className="font-medium">✅ URL Shortened Successfully!</h3>
          <div className="bg-white p-3 rounded border">
            <p className="text-xs text-gray-600 mb-1">Short URL:</p>
            <div className="flex items-center space-x-2">
              <code className="flex-1 text-sm bg-gray-100 p-2 rounded break-all">
                {getFullRedirectUrl(getShortCode(result.shortUrl))}
              </code>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(getFullRedirectUrl(getShortCode(result.shortUrl)))}
                className="h-8 px-2"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={() => redirect(getShortCode(result.shortUrl))}
              className="flex items-center space-x-1"
            >
              <ExternalLink className="h-3 w-3" />
              <span>Redirect</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}