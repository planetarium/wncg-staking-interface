import config from 'config'

import { ogImageUrlFor } from 'utils/ogImageUrlFor'

export const MAIN_SEO = {
  title: config.appName,
  description: config.appName,
  canonical: config.siteUrl,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: config.siteUrl,
    title: config.appName,
    site_name: config.appName,
    description: 'NCG & WNCG Staking',
    images: [
      {
        url: ogImageUrlFor('og-wncg-staking-main-md.png'),
        width: 1200,
        height: 60,
        alt: config.appName,
      },
      {
        url: ogImageUrlFor('og-wncg-staking-main-sm.png'),
        width: 600,
        height: 600,
        alt: config.appName,
      },
    ],
  },
  twitter: {
    handle: '@handle',
    site: '@site',
    cardType: 'summary_large_image',
  },
}

export const STAKING_SEO = {
  title: config.stakingAppName,
  description: 'Stake Balancer & PancakeSwap LP token and earn rewards!',
  canonical: `${config.siteUrl}/wncg`,
  openGraph: {
    type: 'website',
    url: `${config.siteUrl}/wncg`,
    title: config.stakingAppName,
    site_name: config.stakingAppName,
    images: [
      {
        url: ogImageUrlFor('og-wncg-staking-md.png'),
        width: 1200,
        height: 600,
        alt: config.appName,
      },
      {
        url: ogImageUrlFor('og-wncg-staking-sm.png'),
        width: 600,
        height: 600,
        alt: config.appName,
      },
    ],
  },
  twitter: {
    handle: '@handle',
    site: '@site',
    cardType: 'summary_large_image',
  },
}

export const TERMS_SEO = {
  title: `Terms of Service / ${config.stakingAppName}`,
  description: 'Stake Balancer LP token and earn rewards!',
  canonical: `${config.siteUrl}/docs/terms`,
  openGraph: {
    type: 'website',
    url: `${config.siteUrl}/docs/terms`,
    title: `Terms of Service / ${config.stakingAppName}`,
    site_name: config.stakingAppName,
    images: [
      {
        url: ogImageUrlFor('og-wncg-staking-md.png'),
        width: 1200,
        height: 600,
        alt: config.appName,
      },
      {
        url: ogImageUrlFor('og-wncg-staking-sm.png'),
        width: 600,
        height: 600,
        alt: config.appName,
      },
    ],
  },
  twitter: {
    handle: '@handle',
    site: '@site',
    cardType: 'summary_large_image',
  },
}

export const PRIVACY_SEO = {
  title: `Privacy Policy / ${config.stakingAppName}`,
  description: 'Stake Balancer LP token and earn rewards!',
  canonical: `${config.siteUrl}/docs/privacy`,
  openGraph: {
    type: 'website',
    url: `${config.siteUrl}/docs/privacy`,
    title: `Privacy Policy / ${config.stakingAppName}`,
    site_name: config.stakingAppName,
    images: [
      {
        url: ogImageUrlFor('og-wncg-staking-md.png'),
        width: 1200,
        height: 600,
        alt: config.appName,
      },
      {
        url: ogImageUrlFor('og-wncg-staking-sm.png'),
        width: 600,
        height: 600,
        alt: config.appName,
      },
    ],
  },
  twitter: {
    handle: '@handle',
    site: '@site',
    cardType: 'summary_large_image',
  },
}
