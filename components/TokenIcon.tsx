import { memo } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import styles from './styles/TokenIcon.module.scss'

import { Icon } from './Icon'

type TokenIconProps = {
  symbol: 'weth' | 'wncg' | 'bal'
  className?: string
}

function TokenIcon({ symbol, className }: TokenIconProps) {
  switch (symbol) {
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
    case 'weth':
      return (
        <span className={clsx(className, styles.token, styles.weth)}>
          <Icon id="ethereumSimple" />
        </span>
      )
    case 'bal':
      return (
        <span className={clsx(className, styles.token, styles.bal)}>
          <Icon id="balancer" />
        </span>
      )
    default:
      return null
  }
}

const MemoizedTokenIcon = memo(TokenIcon)
export { MemoizedTokenIcon as TokenIcon }
