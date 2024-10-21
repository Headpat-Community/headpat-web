import createMiddleware from 'next-intl/middleware'
import { pathnames } from './navigation'
import { routing } from './i18n/routing'

export default createMiddleware({
  localePrefix: 'always',
  defaultLocale: routing.defaultLocale,
  locales: routing.locales,
  pathnames,
})

export const config = {
  // Skip all paths that should not be internationalized. This example skips
  // certain folders and all pathnames with a dot (e.g. favicon.ico)
  matcher: ['/', '/((?!api|_next|_vercel|.*\\..*).*)', '/(en|de|nl)/:path*'],
}
