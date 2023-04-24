import { MouseEvent as ReactMouseEvent, useRef } from 'react'
import clsx from 'clsx'

import { slideInDown } from 'constants/motionVariants'

import { StyledDropdownMenu } from './styled'
import Icon from 'components/Icon'
import { useCloseOnBlur } from 'hooks'
import { EXIT_MOTION } from 'config/motions'

type DropdownMenuProps = {
  closeMenu(): void
  id: string
  list: string[]
  onChange(e: ReactMouseEvent<HTMLButtonElement>): void
  value: string
  disabled?: boolean
  formatter?(value: string): string
}

function DropdownMenu({
  closeMenu,
  id,
  list,
  onChange,
  value,
  disabled,
  formatter,
}: DropdownMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  function handleSelect(e: ReactMouseEvent<HTMLButtonElement>) {
    if (disabled) return
    onChange(e)
    closeMenu()
  }

  useCloseOnBlur(menuRef, closeMenu)

  return (
    <StyledDropdownMenu
      className="dropdownMenu"
      ref={menuRef}
      {...EXIT_MOTION}
      variants={slideInDown}
      aria-labelledby={id}
      aria-orientation="vertical"
      role="menu"
    >
      <ul className="menuList">
        {list.map((item) => {
          const selected = value === item

          return (
            <li
              className={clsx('menuItem', { selected })}
              key={`dropdownMenu:${item}`}
              role="presentation"
            >
              <button
                type="button"
                onClick={handleSelect}
                value={item}
                role="menuitem"
              >
                <span className="label">{formatter?.(item) ?? item}</span>

                {selected && <Icon icon="check" />}
              </button>
            </li>
          )
        })}
      </ul>
    </StyledDropdownMenu>
  )
}

export default DropdownMenu
