import { NextRequest, NextResponse } from "next/server"
import { generateConsentPdf } from '@/app/_lib/email/paprka'

export async function POST(request: NextRequest) {
  const user = await request.json()
  try {
    const data = await generateConsentPdf({'identity': user})
    return new NextResponse(Buffer.from(data))
  } catch {
    return NextResponse.json({}, {status: 500})
  }
}