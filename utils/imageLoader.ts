import { baseUrls } from 'config/api'
import { ImageLoaderProps } from 'next/image'

export function imageLoader({ src }: ImageLoaderProps) {
  if (src.startsWith('http')) return src
  return `${baseUrls.imgix}${src}`
}
