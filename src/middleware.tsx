import createMiddleware from 'next-intl/middleware'
import { NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

export function middleware(req: NextRequest) {
  // @ts-ignore
  const res = intlMiddleware(req)

  // Set a custom X-Powered-By header
  res.headers.set('X-Powered-By', 'Headpat')

  return res
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
