/** @type {import('next').NextConfig} */

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
        destination: '/wncg/5',
        permanent: true,
      },
    ]
  },

  exportPathMap: async function () {
    return {
      '/': { page: '/', __nextDefaultLocale: 'en' },
      '/wncg/5': {
        page: '/wncg/5',
        query: { chainId: '5' },
        __nextDefaultLocale: 'en',
      },
      '/wncg/97': {
        page: '/wncg/97',
        query: { chainId: '97' },
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
