import { cookies } from 'next/headers'
import { generateShortCode, isCodeAvailable, isValidUrl } from '@/lib/shortener-utils'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const session = await auth()
  const { originalUrl, customCode, expiresAt } = await request.json()

  if (!isValidUrl(originalUrl)) {
    return Response.json({ error: 'Invalid URL' }, { status: 400 })
  }

  // Anonymous users: limit to 3 links using cookie
  if (!session) {
    const cookieStore = cookies()
    const usageCookie = cookieStore.get('anon-usage')
    const count = usageCookie ? parseInt(usageCookie.value) : 0

    if (count >= 3) {
      return Response.json({ error: 'Anonymous usage limit reached (3 links)' }, { status: 403 })
    }

    // Increment the count and update cookie
    cookies().set('anon-usage', String(count + 1), {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax',
    })
  }

  // Validate custom short code if provided
  if (customCode && !(await isCodeAvailable(customCode))) {
    return Response.json({ error: 'Custom code already exists' }, { status: 400 })
  }

  // Set expiration date: default to 1 day from now
  let expirationDate: Date
  if (expiresAt) {
    const parsed = new Date(expiresAt)
    if (isNaN(parsed.getTime())) {
      return Response.json({ error: 'Invalid expiration date' }, { status: 400 })
    }
    expirationDate = parsed
  } else {
    expirationDate = new Date(Date.now() + 1000 * 60 * 60 * 24) 
  }

  const shortCode = customCode || generateShortCode()

  const url = await prisma.url.create({
    data: {
      originalUrl,
      shortCode,
      userId: session?.user?.id || null,
      expiresAt: expirationDate,
    }
  })

  return Response.json({ 
    shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${shortCode}`,
    shortCode,
    expiresAt: expirationDate.toISOString()
  })
}
