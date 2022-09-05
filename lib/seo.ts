import { configService } from 'services/config'
import { getOgImageUrl } from 'utils/url'

export const DEFAULT_SEO = {
  title: 'Nine Chronicles Staking',
  description: 'Nine Chronicles Staking',
  canonical: configService.siteUrl,
  openGraph: {
    type: 'website',
    url: configService.siteUrl,
    title: 'Nine Chronicles Staking',
    site_name: 'Nine Chronicles Staking',
    images: [
      {
        url: getOgImageUrl('og-root.png'),
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
  canonical: `${configService.siteUrl}/wncg`,
  openGraph: {
    type: 'website',
    url: `${configService.siteUrl}/wncg`,
    title: 'WNCG Staking',
    site_name: 'WNCG Staking',
    images: [
      {
        url: getOgImageUrl('og-staking.png'),
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
  canonical: `${configService.siteUrl}/wncg/terms`,
  openGraph: {
    type: 'website',
    url: `${configService.siteUrl}/wncg/terms`,
    title: 'Terms of Service / WNCG Staking',
    site_name: 'WNCG Staking',
    images: [
      {
        url: getOgImageUrl('og-document.png'),
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
  canonical: `${configService.siteUrl}/wncg/privacy`,
  openGraph: {
    type: 'website',
    url: `${configService.siteUrl}/wncg/privacy`,
    title: 'Privacy Policy / WNCG Staking',
    site_name: 'WNCG Staking',
    images: [
      {
        url: getOgImageUrl('og-document.png'),
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
