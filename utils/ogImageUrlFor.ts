import { baseUrls } from 'config/api'

export function ogImageUrlFor(fileName: string) {
  return `${baseUrls.imgix}/open-graph/${fileName}`
}
