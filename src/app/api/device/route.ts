import { NextRequest, NextResponse, userAgent } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { device } = userAgent(request)
  return NextResponse.json(device)
}
