import config from 'config'
import { ogImageFor } from 'utils/ogImageFor'

export const DEFAULT_SEO = {
  title: 'Nine Chronicles Staking',
  description: 'Nine Chronicles Staking',
  canonical: config.siteUrl,
  openGraph: {
    type: 'website',
    url: config.siteUrl,
    title: 'Nine Chronicles Staking',
    site_name: 'Nine Chronicles Staking',
    images: [
      {
        url: ogImageFor('og-root.png'),
        width: 1200,
        height: 630,
        alt: 'Nine Chronicles Staking',
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
  title: 'WNCG Staking',
  description: 'Stake Balancer LP token and earn rewards!',
  canonical: `${config.siteUrl}/wncg`,
  openGraph: {
    type: 'website',
    url: `${config.siteUrl}/wncg`,
    title: 'WNCG Staking',
    site_name: 'WNCG Staking',
    images: [
      {
        url: ogImageFor('og-staking.png'),
        width: 1200,
        height: 630,
        alt: 'WNCG Staking',
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
  title: 'Terms of Service / WNCG Staking',
  description: 'Stake Balancer LP token and earn rewards!',
  canonical: `${config.siteUrl}/wncg/terms`,
  openGraph: {
    type: 'website',
    url: `${config.siteUrl}/wncg/terms`,
    title: 'Terms of Service / WNCG Staking',
    site_name: 'WNCG Staking',
    images: [
      {
        url: ogImageFor('og-document.png'),
        width: 1200,
        height: 630,
        alt: 'WNCG Staking',
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
  title: 'Privacy Policy / WNCG Staking',
  description: 'Stake Balancer LP token and earn rewards!',
  canonical: `${config.siteUrl}/wncg/privacy`,
  openGraph: {
    type: 'website',
    url: `${config.siteUrl}/wncg/privacy`,
    title: 'Privacy Policy / WNCG Staking',
    site_name: 'WNCG Staking',
    images: [
      {
        url: ogImageFor('og-document.png'),
        width: 1200,
        height: 630,
        alt: 'WNCG Staking',
      },
    ],
  },
  twitter: {
    handle: '@handle',
    site: '@site',
    cardType: 'summary_large_image',
  },
}
