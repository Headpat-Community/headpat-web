import { createNavigation } from 'next-intl/navigation'
import { Pathnames } from 'next-intl/routing'
import { routing } from './i18n/routing'

// The `pathnames` object holds pairs of internal
// and external paths, separated by locale.
export const pathnames = {
  // If all locales use the same pathname, a
  // single external path can be provided.
  '#': '#',
  '/': '/',
  '/app': '/app',
  '/gallery': '/gallery',
  '/gallery/upload': '/gallery/upload',
  '/gallery/[galleryId]': '/gallery/[galleryId]',
  '/community': '/community',
  '/community/[communityId]': '/community/[communityId]',
  '/community/[communityId]/admin': '/community/[communityId]/admin',
  '/community/[communityId]/followers': '/community/[communityId]/followers',
  '/community/[communityId]/events': '/community/[communityId]/events',
  '/community/[communityId]/events/[eventId]':
    '/community/[communityId]/events/[eventId]',
  '/changelog': '/changelog',
  '/events': '/events',
  '/events/[eventId]': '/events/[eventId]',
  '/support': '/support',
  '/legal': '/legal',
  '/support/': '/support/',
  '/legal/impressum': '/legal/impressum',
  '/legal/privacypolicy': '/legal/privacypolicy',
  '/legal/termsofservice': '/legal/termsofservice',
  '/login': '/login',
  '/login/mfa': '/login/mfa',
  '/register': '/register',
  '/logout': '/logout',
  '/pawcraft': '/pawcraft',
  '/announcements': '/announcements',
  '/announcements/[announcementId]': '/announcements/[announcementId]',
  '/account': '/account',
  '/account/verify': '/account/verify',
  '/account/gallery': '/account/gallery',
  '/account/gallery/upload': '/account/gallery/upload',
  '/account/gallery/[galleryId]': '/account/gallery/[galleryId]',
  '/profile': '/profile',
  '/user/[profileUrl]': '/user/[profileUrl]',
  '/user/[profileUrl]/followers': '/user/[profileUrl]/followers',
  '/user/[profileUrl]/following': '/user/[profileUrl]/following',

  // If locales use different paths, you can
  // specify each external path per locale.
  '/about': {
    en: '/about',
    de: '/ueber-uns',
    nl: '/over-ons',
  },
} satisfies Pathnames<typeof routing.locales>

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
