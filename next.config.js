/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs')

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
        destination: `/wncg/1`,
        permanent: true,
      },
    ]
  },
  sentry: {},
}

const sentryWebpackPluginOptions = {
  org: 'planetarium-labs',
  project: 'wncg-staking',

  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: true, // Suppresses all logs
}

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions)
