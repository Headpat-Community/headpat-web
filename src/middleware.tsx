import { createNextMiddleware } from 'gt-next/middleware'
import { NextResponse } from 'next/server'

const middleware = createNextMiddleware({
  prefixDefaultLocale: false
})

export default async function middlewareWrapper(request: any) {
  try {
    return await middleware(request)
  } catch (error) {
    console.error('Middleware error:', error)

    // If it's a stream error, return a simple response
    if (error?.code === 'ERR_STREAM_ALREADY_FINISHED') {
      return new NextResponse('Internal Server Error', { status: 500 })
    }

    // Re-throw other errors
    throw error
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next (internal files)
     * - static files
     */
    '/((?!api|static|.*\\..*|_next).*)'
  ]
}
