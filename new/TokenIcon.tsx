import { memo } from 'react'
import styled from 'styled-components'
import clsx from 'clsx'

import { configService } from 'services/config'
import { getTokenSymbol } from 'utils/token'
import { flexbox } from 'newStyles/utils'

import SvgIcon from './SvgIcon'
import type { SvgIconType } from './SvgIcon'

type TokenIconSize = 16 | 24 | 32 | 48

const StyledTokenIcon = styled.span<{ $size: TokenIconSize }>`
  ${flexbox()}
  width: ${({ $size }) => `${$size}px`};
  height: ${({ $size }) => `${$size}px`};
  border-radius: 50%;

  &.placeholder {
    background-color: var(--primary-500);
  }

  img,
  svg {
    width: ${({ $size }) => `${$size}px`};
    height: ${({ $size }) => `${$size}px`};
  }
`

type TokenIconProps = {
  address?: string
  className?: string
  $size?: TokenIconSize
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
      <SvgIcon icon={icon} />
    </StyledTokenIcon>
  )
}

export default memo(TokenIcon)
