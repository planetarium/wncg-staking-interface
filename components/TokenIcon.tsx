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
  switch (symbol) {
    case 'bal':
      return (
        <span className={clsx(className, styles.token, styles.bal)}>
          <Icon id="balancer" />
        </span>
      )

    case 'eth':
    case 'weth':
      return (
        <span className={clsx(className, styles.token, styles.weth)}>
          <Icon id="ethereumSimple" />
        </span>
      )

    case 'wbtc':
    case 'wncg':
      return (
        <span className={clsx(className, styles.token, styles.wncg)}>
          <Image
            src="/img-wncg.png"
            layout="fill"
            objectFit="contain"
            priority
            alt=""
          />
        </span>
      )

    default:
      return null
  }
}

const MemoizedTokenIcon = memo(TokenIcon)
export { MemoizedTokenIcon as TokenIcon }
