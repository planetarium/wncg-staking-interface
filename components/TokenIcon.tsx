import { memo, useMemo } from 'react'
import { nanoid } from 'nanoid'
import clsx from 'clsx'

import { useChain, useStaking } from 'hooks'
import { isEthereum } from 'utils/isEthereum'

import { StyledTokenFragment, StyledTokenIcon } from './styled'
import Image from 'components/Image'
import CryptoIcon from './CryptoIcon'

type TokenIconProps = {
  address: Hash
  ariaLabel?: string
  ariaHidden?: boolean
  className?: string
  $size?: number
  $dark?: boolean
}

function TokenFragment({ address, $size = 24, $dark }: TokenIconProps) {
  const { balAddress, chainId, nativeCurrency } = useChain()
  const { rewardTokenAddresses, tokens } = useStaking()

  const token = useMemo(() => tokens?.[address] ?? {}, [address, tokens])

  const fragment = useMemo(() => {
    if (!token) return <span className="icon defaultIcon" />

    switch (true) {
      case address === nativeCurrency.address:
      case address === nativeCurrency.wrappedTokenAddress:
        const icon = isEthereum(chainId) ? 'ether' : 'bnb'
        return <CryptoIcon icon={icon} $size={$size} />

      case address === rewardTokenAddresses[0]:
      case token.symbol === 'WNCG':
        return <CryptoIcon icon="wncg" $size={$size} />

      case address === balAddress:
        return (
          <CryptoIcon
            icon={$dark ? 'balancerDark' : 'balancer'}
            $size={$size}
          />
        )

      default:
        return (
          <Image
            className="mainToken"
            priority
            src="./images/icon.png"
            alt={token.symbol}
          />
        )
    }
  }, [
    $dark,
    $size,
    address,
    balAddress,
    chainId,
    nativeCurrency.address,
    nativeCurrency.wrappedTokenAddress,
    rewardTokenAddresses,
    token,
  ])

  return (
    <StyledTokenFragment className="tokenFragment" $size={$size}>
      {fragment}
    </StyledTokenFragment>
  )
}

function TokenIcon({
  address,
  ariaLabel,
  ariaHidden = true,
  className,
  $size = 24,
  $dark,
}: TokenIconProps) {
  const { lpToken, poolTokenAddresses, shouldReversePoolTokenOrderOnDisplay } =
    useStaking()

  const element = useMemo(() => {
    if (address === lpToken?.address) {
      const list = [...poolTokenAddresses]
      if (shouldReversePoolTokenOrderOnDisplay) list.reverse()

      return list.map((addr) => (
        <TokenFragment
          key={`tokenFragment:${addr}:${nanoid}`}
          address={addr}
          $size={$size}
          $dark={$dark}
        />
      ))
    }

    return <TokenFragment address={address} $size={$size} $dark={$dark} />
  }, [
    $dark,
    $size,
    address,
    lpToken?.address,
    poolTokenAddresses,
    shouldReversePoolTokenOrderOnDisplay,
  ])

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
