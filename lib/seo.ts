export const DEFAULT_SEO = {
  title: 'Nine Chronicles Staking',
  description: 'Nine Chronicles Staking',
  canonical: process.env.NEXT_PUBLIC_SITE_URL as string,
  openGraph: {
    type: 'website',
    url: process.env.NEXT_PUBLIC_SITE_URL as string,
    title: 'Nine Chronicles Staking',
    site_name: 'Nine Chronicles Staking',
    images: [
      {
        url: process.env.NEXT_PUBLIC_OG_IMAGE_ROOT as string,
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
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL as string}/wncg`,
  openGraph: {
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_SITE_URL as string}/wncg`,
    title: 'WNCG Staking',
    site_name: 'WNCG Staking',
    images: [
      {
        url: process.env.NEXT_PUBLIC_OG_IMAGE_STAKING as string,
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
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL as string}/wncg/terms`,
  openGraph: {
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_SITE_URL as string}/wncg/terms`,
    title: 'Terms of Service / WNCG Staking',
    site_name: 'WNCG Staking',
    images: [
      {
        url: process.env.NEXT_PUBLIC_OG_IMAGE_DOCUMENT as string,
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
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL as string}/wncg/privacy`,
  openGraph: {
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_SITE_URL as string}/wncg/privacy`,
    title: 'Privacy Policy / WNCG Staking',
    site_name: 'WNCG Staking',
    images: [
      {
        url: process.env.NEXT_PUBLIC_OG_IMAGE_DOCUMENT as string,
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
