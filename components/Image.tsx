import { useMemo } from 'react'
import NextImage, { ImageProps as NextImageProps } from 'next/image'

import { baseUrls } from 'config/api'
import { StyledImage } from './styled'

type ImageProps = {
  objectFit?: 'cover' | 'contain'
} & NextImageProps

export default function Image({
  className,
  objectFit = 'contain',
  src,
  ...props
}: ImageProps) {
  const filePath = useMemo(() => {
    if (!src) return null
    if ((src as string).startsWith('http')) return src
    return `${baseUrls.imgix}/wncg-staking${src}`
  }, [src])

  if (!filePath) return null

  return (
    <StyledImage className={className} $objectFit={objectFit}>
      <NextImage {...props} src={filePath} fill unoptimized />
    </StyledImage>
  )
}
