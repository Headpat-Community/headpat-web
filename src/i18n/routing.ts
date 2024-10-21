import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'de', 'nl'],
  localePrefix: 'always',
  localeCookie: {
    name: 'USER_LOCALE',
  },

  // Used when no locale matches
  defaultLocale: 'en',
})
