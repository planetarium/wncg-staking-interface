import { useMemo } from 'react'
import clsx from 'clsx'

import { StyledCryptoIcon } from './styled'

import WalletConnectIcon from 'public/icons/ic-wallet-connect.svg'

export type CryptoIconType =
  | 'appLogo'
  | 'balancer'
  | 'balancerDark'
  | 'binance'
  | 'bnb'
  | 'bsc'
  | 'coinbaseWallet'
  | 'ether'
  | 'trustWallet'
  | 'metaMask'
  | 'walletConnect'
  | 'wncg'
  | 'wbtc'
  | 'cake'
  | 'busd'
  | 'usdt'
  | 'ncg'

type CryptoIconProps = {
  ariaLabel?: string
  ariaHidden?: boolean
  icon: CryptoIconType
  className?: string
  $size?: number
}

function CryptoIcon({
  ariaLabel,
  ariaHidden = true,
  icon,
  className,
  $size = 16,
}: CryptoIconProps) {
  const svgElement = useMemo(
    () =>
      icon === 'walletConnect' ? (
        <WalletConnectIcon className={clsx('cryptoIcon', icon, className)} />
      ) : (
        <use href={`/icons/logo-sprites.svg#${icon}`} />
      ),
    [className, icon]
  )

  return (
    <StyledCryptoIcon
      className={clsx('cryptoIcon', icon, className)}
      as={icon === 'walletConnect' ? 'span' : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      $size={$size}
    >
      {svgElement}
    </StyledCryptoIcon>
  )
}

export default CryptoIcon
