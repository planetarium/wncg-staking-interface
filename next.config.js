const path = require('path')

const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    loader: 'imgix',
    path: 'https://planetarium-gamefi.imgix.net',
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: '@use "main" as *;',
  },
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    return config
  },
}

module.exports = nextConfig
