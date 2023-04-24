import { StyledGnbMenuButton } from './styled'
import Icon from 'components/Icon'
import { MouseEvent } from 'react'

type GnbMenuButtonProps = {
  open(e: MouseEvent): void
}

export default function GnbMenuButton({ open }: GnbMenuButtonProps) {
  return (
    <StyledGnbMenuButton type="button" onClick={open}>
      <Icon icon="hamburger" $size={32} aria-label="Open menu" />
    </StyledGnbMenuButton>
  )
}
