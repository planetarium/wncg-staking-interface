import { DefaultSeo as NextDefaultSeo } from 'next-seo'

import { MAIN_SEO } from 'lib/seo'

export default function DefaultSeo() {
  const appName = 'Nine Chronicles Staking'

  return <NextDefaultSeo defaultTitle={appName} {...MAIN_SEO} />
}
