import { memo } from 'react'
import type { MouseEvent } from 'react'

import { StyledDropdownToggle } from './styled'
import SvgIcon from 'new/SvgIcon'

type DropdownToggleProps = {
  id: string
  show: boolean
  toggle(e: MouseEvent<HTMLButtonElement>): void
  value: string
  formatter?(value: string): string
}

function DropdownToggle({
  id,
  show,
  toggle,
  value,
  formatter,
}: DropdownToggleProps) {
  return (
    <StyledDropdownToggle
      id={id}
      className="dropdownToggle"
      type="button"
      onClick={toggle}
      aria-controls="menu"
      aria-haspopup
    >
      {formatter?.(value) ?? value}
      <SvgIcon icon={show ? 'chevronUp' : 'chevronDown'} $size={16} />
    </StyledDropdownToggle>
  )
}

export default memo(DropdownToggle)
