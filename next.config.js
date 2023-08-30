/** @type {import('next').NextConfig} */

const ethereumChainId = process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID ? 1 : 5
const bscChainId = process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID ? 56 : 97

const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.IMGIX_HOSTNAME,
        pathname: '/**/*',
      },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
  async redirects() {
    return [
      {
        source: '/wncg',
        destination: `/wncg/${ethereumChainId}`,
        permanent: true,
      },
    ]
  },

  exportPathMap: async function () {
    return {
      '/': { page: '/', __nextDefaultLocale: 'en' },
      [`/wncg/${ethereumChainId}`]: {
        page: `/wncg/${ethereumChainId}`,
        query: { chainId: ethereumChainId },
        __nextDefaultLocale: 'en',
      },
      [`/wncg/${bscChainId}`]: {
        page: `/wncg/${bscChainId}`,
        query: { chainId: bscChainId },
        __nextDefaultLocale: 'en',
      },
      '/docs/terms': { page: '/docs/terms', __nextDefaultLocale: 'en' },
      '/docs/privacy': { page: '/docs/privacy', __nextDefaultLocale: 'en' },
      '/404': { page: '/404', __nextDefaultLocale: 'en' },
      '/500': { page: '/500', __nextDefaultLocale: 'en' },
    }
  },
}

module.exports = nextConfig

// Injected content via Sentry wizard below

const { withSentryConfig } = require('@sentry/nextjs')

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,

    org: 'planetarium-labs',
    project: 'javascript-react',
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: '/monitoring',

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
  }
)
