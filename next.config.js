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
  exportPathMap: async function (defaultPathMap) {
    return {
      ...defaultPathMap,
      '/': { page: '/', __nextDefaultLocale: 'en' },
      '/wncg': { page: '/wncg', __nextDefaultLocale: 'en' },
      '/wncg/terms': { page: '/wncg/terms', __nextDefaultLocale: 'en' },
      '/wncg/privacy': { page: '/wncg/privacy', __nextDefaultLocale: 'en' },
    }
  },
}

module.exports = nextConfig
