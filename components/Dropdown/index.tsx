import { MouseEvent, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

import { StyledDropdown } from './styled'
import Menu from './Menu'
import Toggle from './Toggle'

type DropdownProps = {
  id: string
  onChange(e: MouseEvent<HTMLButtonElement>): void
  value: string
  className?: string
  disabled?: boolean
  formatter?(value: string): string
  list?: Hash[] | string[]
}

function Dropdown({
  id,
  onChange,
  value,
  className,
  disabled,
  formatter,
  list = [],
}: DropdownProps) {
  const [show, setShow] = useState(false)

  function toggle(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    if (disabled) return
    setShow((prev) => !prev)
  }

  function closeMenu() {
    setShow(false)
  }

  if (!list.length) return null

  const dropdownId = `dropdown:${id}`

  return (
    <StyledDropdown
      className={clsx('dropdown', className)}
      $disabled={disabled}
    >
      <Toggle
        id={dropdownId}
        show={show}
        toggle={toggle}
        value={formatter?.(value) ?? value}
      />

      <AnimatePresence>
        {show && (
          <Menu
            closeMenu={closeMenu}
            id={dropdownId}
            list={list}
            onChange={onChange}
            value={value}
            disabled={disabled}
            formatter={formatter}
          />
        )}
      </AnimatePresence>
    </StyledDropdown>
  )
}

export default Dropdown
