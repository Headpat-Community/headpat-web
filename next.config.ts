import createMDX from '@next/mdx'
import { NextConfig } from 'next'
import { withGTConfig } from 'gt-next/config'
import { SentryBuildOptions, withSentryConfig } from '@sentry/nextjs'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: true,
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  compiler: {
    styledComponents: true,
  },
  experimental: {
    mdxRs: true,
  },
  images: {
    deviceSizes: [320, 420, 768, 1024, 1200],
    loader: 'default',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.headpat.place',
      },
      {
        protocol: 'https',
        hostname: '*.headpat.space',
      },
      {
        protocol: 'https',
        hostname: 'api.headpat.space',
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
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
    ]
  },
}

const sentryOptions: SentryBuildOptions = {
  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,
  org: 'headpat',
  project: 'headpat-space',
  sentryUrl: 'https://sentry.fayevr.dev',
  //authToken: process.env.SENTRY_AUTH_TOKEN,

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: false,

  sourcemaps: {
    disable: true,
    deleteSourcemapsAfterUpload: true,
  },

  // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers. (increases server load)
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of
  // client-side errors will fail.
  tunnelRoute: '/api/monitoring',

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors.
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: false,
}
const sentryNextConfig = withSentryConfig(nextConfig, sentryOptions)

const withMDX = createMDX({
  // Add Markdown plugins here, as desired
})

const combinedConfig = withGTConfig(sentryNextConfig, {
  defaultLocale: 'en',
  locales: ['nl', 'de', 'en'],
  runtimeUrl: null,
  loadDictionaryPath: './src/loadDictionary.ts',
})

export default withMDX(combinedConfig)
