import createMDX from '@next/mdx'
import { NextConfig } from 'next'
import { withGTConfig } from 'gt-next/config'
import { SentryBuildOptions, withSentryConfig } from '@sentry/nextjs'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  output: 'standalone', // Hosting on Kubernetes - Useful for Dockerfile
  compiler: {
    styledComponents: true
  },
  turbopack: {
    resolveExtensions: [
      '.ts',
      '.tsx',
      '.js',
      '.jsx',
      '.json',
      '.css',
      '.scss',
      '.md',
      '.mdx'
    ]
  },
  experimental: {
    mdxRs: true
  },
  images: {
    deviceSizes: [320, 420, 768, 1024, 1200],
    loader: 'default',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.headpat.place'
      },
      {
        protocol: 'https',
        hostname: '*.headpat.space'
      },
      {
        protocol: 'https',
        hostname: 'api.headpat.space'
      }
    ]
  },
  allowedDevOrigins: ['localhost', 'dev.headpat.place', 'mac.headpat.place'],
  async rewrites() {
    return [
      {
        source: '/register',
        destination: '/login'
      },
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap'
      }
    ]
  },
  async headers() {
    return [
      {
        source: '/',
        headers: [
          {
            key: 'x-powered-by',
            value: 'Headpat'
          }
        ]
      }
    ]
  }
}

const sentryOptions: SentryBuildOptions = {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  sourcemaps: {
    deleteSourcemapsAfterUpload: true
  },

  // Automatically annotate React components to show their full name in breadcrumbs and session replay
  reactComponentAnnotation: {
    enabled: true
  },

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: '/monitoring',

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors.
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: false
}

const sentryNextConfig = withSentryConfig(nextConfig, sentryOptions)

const withMDX = createMDX({
  // Add Markdown plugins here, as desired
})

const combinedConfig = withGTConfig(sentryNextConfig, {
  defaultLocale: 'en',
  locales: ['nl', 'de', 'en'],
  runtimeUrl: null,
  loadDictionaryPath: './src/loadDictionary.ts'
})

export default withMDX(combinedConfig)
