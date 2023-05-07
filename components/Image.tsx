import { useMemo, useState } from 'react'
import NextImage, { ImageProps as NextImageProps } from 'next/image'

import { StyledImage } from './styled'
import { baseUrls } from 'config/api'

type ImageProps = {
  objectFit?: 'cover' | 'contain'
} & NextImageProps

export default function Image({
  className,
  objectFit = 'contain',
  src,
  ...props
}: ImageProps) {
  const [loaded, setLoaded] = useState(false)

  function handleLoad() {
    setLoaded(true)
  }

  const filePath = useMemo(() => {
    if (!src) return null
    if ((src as string).startsWith('http')) return src
    return `${baseUrls.imgix}/wncg-staking${src}`
  }, [src])

  if (!filePath) return null

  return (
    <StyledImage className={className} $objectFit={objectFit} $loaded={loaded}>
      <NextImage
        {...props}
        src={filePath}
        fill
        unoptimized
        onLoadingComplete={handleLoad}
      />
    </StyledImage>
  )
}
