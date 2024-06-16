import * as Sentry from '@sentry/nextjs'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    Sentry.init({
      dsn: 'https://add390e54d6261362ee1c310bf2894da@sentry.fayevr.dev/4',
      tracesSampleRate: 1.0,
      debug: false,
    })
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    Sentry.init({
      dsn: 'https://add390e54d6261362ee1c310bf2894da@sentry.fayevr.dev/4',
      tracesSampleRate: 1.0,
      debug: false,
    })
  }
}
