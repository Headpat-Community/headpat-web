import { getRequestConfig } from 'next-intl/server'
import { IntlErrorCode } from 'next-intl'
import { routing } from './routing'

// Can be imported from a shared config

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    formats: {
      dateTime: {
        short: {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        },
      },
      number: {
        precise: {
          maximumFractionDigits: 5,
        },
      },
      list: {
        enumeration: {
          style: 'long',
          type: 'conjunction',
        },
      },
    },
    async onError(error) {
      if (error.code === IntlErrorCode.MISSING_MESSAGE) {
        // Missing translations are expected and should only log an error
        console.error(error)
      } else {
        // Log all other errors to the admin database
        // TODO: Implement this
        /*
        const { databases } = await createAdminDatabasesClient()
        await databases.createDocument('logging', 'cloud-intl', ID.unique(), {
          isError: true,
          errorMessage: error,
        })
         */
      }
    },
    getMessageFallback({ namespace, key, error }) {
      const path = [namespace, key].filter((part) => part != null).join('.')

      if (error.code === IntlErrorCode.MISSING_MESSAGE) {
        return path + ' is not yet translated'
      } else {
        return 'Dear developer, please fix this message: ' + path
      }
    },
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
