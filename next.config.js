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
  async redirects() {
    return [
      {
        source: '/wncg',
        destination: '/wncg/1',
        permanent: true,
      },
    ]
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
        destination: '/wncg/1',
        permanent: true,
      },
    ]
  },

  exportPathMap: async function () {
    return {
      '/': { page: '/', __nextDefaultLocale: 'en' },
      '/wncg/1': {
        page: '/wncg/1',
        query: { chainId: '1' },
        __nextDefaultLocale: 'en',
      },
      '/wncg/5': {
        page: '/wncg/5',
        query: { chainId: '5' },
        __nextDefaultLocale: 'en',
      },
      '/wncg/56': {
        page: '/wncg/56',
        query: { chainId: '56' },
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
