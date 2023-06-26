import { baseUrls } from 'config/api'

export default function RootFavicon() {
  return (
    <>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href={faviconAssetUrlFor('apple-touch-icon.png')}
      />

      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={faviconAssetUrlFor('favicon-32x32.png')}
      />

      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={faviconAssetUrlFor('favicon-16x16.png')}
      />

      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="theme-color" content="#ffffff" />
      <link
        rel="mask-icon"
        href={faviconAssetUrlFor('safari-pinned-tab.svg')}
        color="#5bbad5"
      />
      <meta name="theme-color" content="#ffffff" />
    </>
  )
}

function faviconAssetUrlFor(fileName: string) {
  return `${baseUrls.imgix}/wncg-staking/main-favicon/${fileName}?=v3`
}
