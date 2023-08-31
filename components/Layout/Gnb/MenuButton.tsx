import type { MouseEvent } from 'react'

import { useResponsive } from 'hooks'

import { StyledGnbMenuButton } from './styled'
import Icon from 'components/Icon'

type GnbMenuButtonProps = {
  open(e: MouseEvent): void
}

export default function GnbMenuButton({ open }: GnbMenuButtonProps) {
  const { isMobile } = useResponsive()

  return (
    <StyledGnbMenuButton type="button" onClick={open}>
      <Icon
        icon="hamburger"
        $size={isMobile ? 24 : 32}
        aria-label="Open menu"
      />
    </StyledGnbMenuButton>
  )
}
