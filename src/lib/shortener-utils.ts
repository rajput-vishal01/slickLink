import { customAlphabet } from 'nanoid'
import { prisma } from '@/lib/prisma'

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const nanoid = customAlphabet(alphabet, 3)

export function generateShortCode(): string {
  return nanoid()
}

// Check if code exists
export async function isCodeAvailable(code: string): Promise<boolean> {
  const existing = await prisma.url.findUnique({
    where: { shortCode: code }
  })
  return !existing
}

// Check for Valid Urls
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return ['http:', 'https:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

//Find the Original url
export async function findByShortCode(shortCode: string) {
  try {
    const urlRecord = await prisma.url.findUnique({
      where: { shortCode }
    })
    return urlRecord
  } catch (error) {
    console.error('Database error finding URL:', error)
    throw new Error('Database query failed')
  }
}

//Incrementing the clicks
export async function incrementClicks(shortCode: string) {
  try {
    await prisma.url.update({
      where: { shortCode },
      data: { clicks: { increment: 1 } }
    })
  } catch (error) {
    console.error('Failed to increment clicks:', error)
    // Don't throw error - this is not critical
  }
}

// cleanup.js - to delete expired links
export async function deleteExpiredUrls() {
  const result = await prisma.url.deleteMany({
    where: {
      expiresAt: {
        lt: new Date() // Delete URLs where expiresAt is less than current time
      }
    }
  })
  
  console.log(`Deleted ${result.count} expired URLs`)
}

// Run every 12 hours (12 * 60 * 60 * 1000 = 43,200,000 milliseconds)
setInterval(deleteExpiredUrls, 12 * 60 * 60 * 1000)