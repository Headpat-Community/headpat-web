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
    //removeConsole: {
    //exclude: ['error', 'info', 'warn'],
    //},
  },
  experimental: {
    mdxRs: true,
    //reactCompiler: true,
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
        hostname: '*.headpat.de',
      },
      {
        protocol: 'https',
        hostname: '*.headpat-de.pages.dev',
      },
      {
        protocol: 'https',
        hostname: '*.headpat-place.pages.dev',
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
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
    ]
  },
}

const withMDX = createMDX({
  // Add Markdown plugins here, as desired
})

// Injected content via Sentry wizard below

const sentryOptions: SentryBuildOptions = {
  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  silent: true,
  org: 'CloudNet',
  project: 'javascript-nextjs',
  sentryUrl: 'https://sentry.fayevr.dev/',

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

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

export default withGTConfig(sentryNextConfig, {
  defaultLocale: 'en',
  locales: ['nl', 'de', 'en'],
  runtimeUrl: null,
  loadDictionaryPath: './src/loadDictionary.ts',
})
