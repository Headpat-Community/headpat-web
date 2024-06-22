import { createLocalizedPathnamesNavigation } from 'next-intl/navigation'
import { Pathnames } from 'next-intl/routing'

export const locales = ['en', 'de', 'nl'] as const

// The `pathnames` object holds pairs of internal
// and external paths, separated by locale.
export const pathnames = {
  // If all locales use the same pathname, a
  // single external path can be provided.
  '/': '/',
  '/blog': '/blog',
  '/login': '/login',
  '/user/[profileUrl]': '/user/[profileUrl]',

  // If locales use different paths, you can
  // specify each external path per locale.
  '/about': {
    en: '/about',
    de: '/ueber-uns',
    nl: '/over-ons',
  },
} satisfies Pathnames<typeof locales>

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createLocalizedPathnamesNavigation({ locales, pathnames })
