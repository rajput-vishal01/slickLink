import { NextRequest } from 'next/server'
import QRCode from 'qrcode'

export async function GET(request:NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  
  if (!url) {
    return new Response('URL parameter required', { status: 400 })
  }
  
  try {
    const qrBuffer = await QRCode.toBuffer(url)
    return new Response(qrBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600'
      }
    })
  } catch (error) {
    console.error("Error in qr route :",error);
    return new Response('Failed to generate QR code', { status: 500 })
  }
}