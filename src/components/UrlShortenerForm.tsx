"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function UrlShortenerForm() {
  const [url, setUrl] = useState("")
  const [customCode, setCustomCode] = useState("")
  const [expiresAt, setExpiresAt] = useState("1d")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const sendUrl = async(e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setResult(null)

    try {
      const requestBody = { originalUrl: url }

      if (customCode.trim()) {
        requestBody.customCode = customCode.trim()
      }

      if (expiresAt) {
        const timeMap = {
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
      });

      const response = await res.json();
      
      if (!res.ok) {
        throw new Error(response.error || `Request failed (${res.status})`)
      }

      setResult(response)
      setUrl("")
      setCustomCode("")
      setExpiresAt("1d")
      
    } catch (err) {
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="space-y-4">
      <Input 
        onChange={(e) => setUrl(e.target.value)} 
        placeholder="Enter the URL (required)" 
        value={url}
        type="url"
        disabled={loading}
      />
      
      <Input 
        onChange={(e) => setCustomCode(e.target.value)} 
        placeholder="Custom short code (optional)" 
        value={customCode}
        disabled={loading}
      />
      
      <div>
        <select 
          onChange={(e) => setExpiresAt(e.target.value)} 
          value={expiresAt}
          disabled={loading}
          className="flex h-10 w-full rounded-md border border-gray-600 bg-gray-800 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="1h">1 Hour</option>
          <option value="6h">6 Hours</option>
          <option value="12h">12 Hours</option>
          <option value="1d">1 Day</option>
        </select>
      </div>
      
      <Button 
        onClick={sendUrl}
        disabled={loading || !url.trim()} 
        className="w-full"
      >
        {loading ? "Shortening..." : "Shorten URL"}
      </Button>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-green-100 border border-green-300 text-green-700 rounded-md">
          <h3 className="font-medium mb-2">Success!</h3>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <a 
                href={result.shortUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm break-all"
              >
                {result.shortUrl}
              </a>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(result.shortUrl)}
                className="h-6 px-2 text-xs"
              >
                Copy
              </Button>
            </div>
            
            <p className="text-xs">
              <strong>Expires:</strong> {new Date(result.expiresAt).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}