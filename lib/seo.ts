import config from 'config'

import { ogImageUrlFor } from 'utils/ogImageUrlFor'

const appName = 'Nine Chronicles Staking'
const stakingAppName = 'WNCG Staking'

export const MAIN_SEO = {
  title: appName,
  description: appName,
  canonical: config.siteUrl,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: config.siteUrl,
    title: appName,
    site_name: appName,
    description: appName,
    images: [
      {
        url: ogImageUrlFor('og-wncg-staking-main-md.png'),
        width: 1200,
        height: 60,
        alt: appName,
      },
      {
        url: ogImageUrlFor('og-wncg-staking-main-sm.png'),
        width: 600,
        height: 600,
        alt: appName,
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
  title: stakingAppName,
  description: 'Stake Balancer LP token and earn rewards!',
  canonical: `${config.siteUrl}/wncg`,
  openGraph: {
    type: 'website',
    url: `${config.siteUrl}/wncg`,
    title: stakingAppName,
    site_name: stakingAppName,
    images: [
      {
        url: ogImageUrlFor('og-wncg-staking-md.png'),
        width: 1200,
        height: 600,
        alt: appName,
      },
      {
        url: ogImageUrlFor('og-wncg-staking-sm.png'),
        width: 600,
        height: 600,
        alt: appName,
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
  title: `Terms of Service / ${stakingAppName}`,
  description: 'Stake Balancer LP token and earn rewards!',
  canonical: `${config.siteUrl}/wncg/terms`,
  openGraph: {
    type: 'website',
    url: `${config.siteUrl}/wncg/terms`,
    title: `Terms of Service / ${stakingAppName}`,
    site_name: stakingAppName,
    images: [
      {
        url: ogImageUrlFor('og-wncg-staking-md.png'),
        width: 1200,
        height: 600,
        alt: appName,
      },
      {
        url: ogImageUrlFor('og-wncg-staking-sm.png'),
        width: 600,
        height: 600,
        alt: appName,
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
  title: `Privacy Policy / ${stakingAppName}`,
  description: 'Stake Balancer LP token and earn rewards!',
  canonical: `${config.siteUrl}/wncg/privacy`,
  openGraph: {
    type: 'website',
    url: `${config.siteUrl}/wncg/privacy`,
    title: `Privacy Policy / ${stakingAppName}`,
    site_name: stakingAppName,
    images: [
      {
        url: ogImageUrlFor('og-wncg-staking-md.png'),
        width: 1200,
        height: 600,
        alt: appName,
      },
      {
        url: ogImageUrlFor('og-wncg-staking-sm.png'),
        width: 600,
        height: 600,
        alt: appName,
      },
    ],
  },
  twitter: {
    handle: '@handle',
    site: '@site',
    cardType: 'summary_large_image',
  },
}
