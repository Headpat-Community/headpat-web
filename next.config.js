/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  compiler: {
    styledComponents: true,
    //removeConsole: {
    //  exclude: ['error'],
    //},
  },
  images: {
    deviceSizes: [320, 420, 768, 1024, 1200],
    loader: "default",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.headpat.de",
      },
      {
        protocol: "https",
        hostname: "*.headpat-de.pages.dev",
      },
      {
        protocol: "https",
        hostname: "api.fayevr.dev",
      },
      {
        protocol: "https",
        hostname: "placekitten.com",
      },
    ],
  },
};
module.exports = nextConfig;
