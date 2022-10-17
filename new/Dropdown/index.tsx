import { useState } from 'react'
import type { MouseEvent } from 'react'
import clsx from 'clsx'

import { StyledDropdown } from './styled'
import Menu from './Menu'
import Toggle from './Toggle'

type DropdownProps = {
  id: string
  onChange(e: MouseEvent<HTMLButtonElement>): void
  value: string
  className?: string
  formatter?(value: string): string
  list?: string[]
}

function Dropdown({
  id,
  onChange,
  value,
  className,
  formatter,
  list = [],
}: DropdownProps) {
  const [show, setShow] = useState(false)

  function toggle(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    setShow((prev) => !prev)
  }

  function close() {
    setShow(false)
  }

  if (!list.length) return null

  const dropdownId = `dropdown:${id}`

  return (
    <StyledDropdown className={clsx('dropdown', className)}>
      <Toggle
        id={dropdownId}
        show={show}
        toggle={toggle}
        value={formatter?.(value) ?? value}
      />
      <Menu
        close={close}
        id={dropdownId}
        list={list}
        onChange={onChange}
        show={show}
        value={value}
        formatter={formatter}
      />
    </StyledDropdown>
  )
}

export default Dropdown
