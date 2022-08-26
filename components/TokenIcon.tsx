import { memo } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import styles from './styles/TokenIcon.module.scss'

import { Icon } from './Icon'

type TokenIconProps = {
  symbol: string
  className?: string
}

function TokenIcon({ symbol, className }: TokenIconProps) {
  const srcImage = getTokenIconImage(symbol)
  const nestedClassName = clsx(className, styles.token, {
    [styles.placeholder]: !srcImage,
  })

  if (!srcImage) {
    return (
      <span className={nestedClassName} title={symbol}>
        <Icon id="coin" />
      </span>
    )
  }

  return (
    <span className={nestedClassName} title={symbol}>
      <Image
        src={srcImage}
        layout="fill"
        objectFit="contain"
        priority
        alt={symbol}
      />
    </span>
  )
}

const MemoizedTokenIcon = memo(TokenIcon)
export { MemoizedTokenIcon as TokenIcon }

function getTokenIconImage(symbol: string) {
  switch (symbol.toLowerCase()) {
    case 'bal':
      return 'img-balancer.webp'
    case 'eth':
    case 'weth':
      return 'img-ether.webp'
    case 'wbtc':
      return 'img-wbtc.webp'
    case 'wncg':
      return 'img-wncg.webp'
    default:
      return null
  }
}
