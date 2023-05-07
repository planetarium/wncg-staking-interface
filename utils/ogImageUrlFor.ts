import config from 'config'

export function ogImageUrlFor(fileName: string) {
  return `${config.ogAssetUrl}/${fileName}`
}
