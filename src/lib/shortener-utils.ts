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
