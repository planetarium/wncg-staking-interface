import config from 'config'

export function ogImageFor(fileName: string) {
  return `${config.ogAssetUrl}/${fileName}`
}
