import { createNextMiddleware } from 'gt-next/middleware'

const middleware = createNextMiddleware({
  prefixDefaultLocale: false
})

export default function middlewareWrapper(request: any) {
  try {
    return middleware(request)
  } catch (error) {
    console.error('Middleware error:', error)
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
