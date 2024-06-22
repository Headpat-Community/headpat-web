/** @type {import('next').NextConfig} */

const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin()

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compiler: {
    styledComponents: true,
    //removeConsole: {
    //  exclude: ['error'],
    //},
  },
  images: {
    deviceSizes: [320, 420, 768, 1024, 1200],
    loader: 'default',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.headpat.de',
      },
      {
        protocol: 'https',
        hostname: '*.headpat-de.pages.dev',
      },
      {
        protocol: 'https',
        hostname: 'api.fayevr.dev',
      },
      {
        protocol: 'https',
        hostname: 'placekitten.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/register',
        destination: '/login',
      },
      {
        source: '/account',
        destination: '/account/profile',
      },
    ]
  },
}

module.exports = withNextIntl(nextConfig)

// Injected content via Sentry wizard below

const { withSentryConfig } = require('@sentry/nextjs')

module.exports = withSentryConfig(module.exports, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: 'headpat',
  project: 'javascript-nextjs',
  sentryUrl: 'https://sentry.fayevr.dev/',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: false,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: false,
})
