import { memo } from 'react'
import { useMediaQuery } from 'hooks'

function MediaQueryEffects() {
  useMediaQuery()
  return null
}

export default memo(MediaQueryEffects)
