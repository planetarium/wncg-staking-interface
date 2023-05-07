import { DefaultSeo as NextDefaultSeo } from 'next-seo'

import config from 'config'
import { ogImageUrlFor } from 'utils/ogImageUrlFor'

export default function DefaultSeo() {
  const appName = 'Nine Chronicles Staking'
  const title = `${appName}`

  return (
    <NextDefaultSeo
      defaultTitle={appName}
      canonical={config.siteUrl}
      openGraph={{
        type: 'website',
        locale: 'en_US',
        title,
        url: config.siteUrl,
        siteName: appName,
        description: appName,
        images: [
          {
            url: ogImageUrlFor('og-wncg-staking-main-md.png'),
            width: 1200,
            height: 600,
            alt: appName,
          },
          {
            url: ogImageUrlFor('og-wncg-staking-main-sm.png'),
            width: 600,
            height: 600,
            alt: appName,
          },
        ],
      }}
      twitter={{
        handle: '@handle',
        site: '@site',
        cardType: 'summary_large_image',
      }}
    />
  )
}
