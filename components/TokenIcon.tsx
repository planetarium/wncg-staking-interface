import { memo, useMemo } from 'react'
import { nanoid } from 'nanoid'
import clsx from 'clsx'

import config from 'config'
import { useStaking } from 'hooks'

import { StyledTokenIcon, StyledTokenIconGroup } from './styled'
import CryptoIcon from './CryptoIcon'

type TokenIconProps = {
  address: Hash
  ariaLabel?: string
  ariaHidden?: boolean
  className?: string
  dark?: boolean
  $size?: number
}

function TokenIcon({
  address,
  ariaLabel,
  ariaHidden = true,
  className,
  dark = false,
  $size = 24,
}: TokenIconProps) {
  const { poolTokenSymbols, rewardTokenAddress, stakedTokenAddress, tokenMap } =
    useStaking()
  const token = tokenMap[address]

  const element = useMemo(() => {
    if (!token) return <span className="icon defaultIcon" />

    switch (true) {
      case token.symbol === 'ETH':
      case token.symbol === 'WETH':
      case address === config.nativeCurrency.address.toLowerCase():
      case address === config.weth.toLowerCase():
        return <CryptoIcon className="icon" icon="ether" $size={$size} />
      case token.symbol === 'WNCG':
      case address === rewardTokenAddress:
        return <CryptoIcon className="icon" icon="wncg" $size={$size} />
      case token.symbol === 'BAL':
      case address === config.bal:
        if (dark)
          return (
            <CryptoIcon className="icon" icon="balancerDark" $size={$size} />
          )
        return <CryptoIcon className="icon" icon="balancer" $size={$size} />
      case token.symbol === 'WBTC':
        return <CryptoIcon className="icon" icon="wbtc" $size={$size} />

      default:
        return <span className="icon defaultIcon" />
    }
  }, [$size, address, dark, rewardTokenAddress, token])

  if (token.address === stakedTokenAddress) {
    return (
      <StyledTokenIconGroup className="tokenIconGroup" $size={$size}>
        {poolTokenSymbols.map((symb) => {
          let icon = symb.toLowerCase()
          if (icon === 'weth') icon = 'ether'

          return (
            <CryptoIcon
              key={`tokenIcon:${symb}:${nanoid()}`}
              className="icon tokenIcon"
              icon={icon as CryptoIconType}
              $size={$size}
            />
          )
        })}
      </StyledTokenIconGroup>
    )
  }

  return (
    <StyledTokenIcon
      className={clsx('tokenIcon', className)}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      $size={$size}
    >
      {element}
    </StyledTokenIcon>
  )
}

export default memo(TokenIcon)
