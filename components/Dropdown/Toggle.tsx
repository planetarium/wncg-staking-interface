import { MouseEvent } from 'react'
import { StyledDropdownToggle } from './styled'
import Icon from 'components/Icon'

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
      <Icon icon={show ? 'chevronUp' : 'chevronDown'} />
    </StyledDropdownToggle>
  )
}

export default DropdownToggle
