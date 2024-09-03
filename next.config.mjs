import createNextIntlPlugin from 'next-intl/plugin'
import createMDX from '@next/mdx'

const withNextIntl = createNextIntlPlugin()

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  compiler: {
    styledComponents: true,
    //removeConsole: {
    //  exclude: ['error'],
    //},
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
        source: '/account',
        destination: '/account/profile',
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

export default withNextIntl(withMDX(nextConfig))
