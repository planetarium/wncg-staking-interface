import { memo } from 'react'
import clsx from 'clsx'

import { configService } from 'services/config'
import { getTokenSymbol } from 'utils/token'

import { StyledTokenIcon } from './styled'
import SvgIcon, { SvgIconType } from './SvgIcon'

type TokenIconProps = {
  address?: string
  className?: string
  $size?: number
}

function TokenIcon({ address, className, $size = 24 }: TokenIconProps) {
  if (!address) return null

  let icon: SvgIconType
  let iconClassName: string | undefined

  switch (true) {
    case configService.etherAddresses.includes(address.toLowerCase()):
      icon = 'ether'
      break
    case address === configService.bal:
      icon = 'balancer'
      break
    default:
      iconClassName = 'placeholder'
      icon = 'coin'
      break
  }

  const title = getTokenSymbol(address)?.toLowerCase() ?? undefined

  return (
    <StyledTokenIcon
      className={clsx('tokenIcon', iconClassName, className)}
      title={title}
      $size={$size}
    >
      <SvgIcon icon={icon} $size={24} />
    </StyledTokenIcon>
  )
}

export default memo(TokenIcon)
