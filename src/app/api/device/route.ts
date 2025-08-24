import type { NextRequest } from "next/server"
import { NextResponse, userAgent } from "next/server"

export async function GET(request: NextRequest) {
  const { device } = userAgent(request)
  return NextResponse.json(device)
}
