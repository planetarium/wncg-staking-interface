import { useCallback, useRef } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { useMount, useUnmount } from 'react-use'
import { AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

import { slideInDown } from 'constants/motionVariants'

import { StyledDropdownMenu } from './styled'
import SvgIcon from 'new/SvgIcon'

type DropdownMenuProps = {
  close(): void
  id: string
  list: string[]
  onChange(e: ReactMouseEvent<HTMLButtonElement>): void
  show: boolean
  value: string
  formatter?(value: string): string
}

function DropdownMenu({
  close,
  id,
  list,
  onChange,
  show,
  value,
  formatter,
}: DropdownMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  function handleSelect(e: ReactMouseEvent<HTMLButtonElement>) {
    onChange(e)
    close()
  }

  const closeOnBlur = useCallback(
    (e: MouseEvent) => {
      if (!menuRef?.current?.contains(e.target as Node)) {
        close()
        window.removeEventListener('click', closeOnBlur)
      }
    },
    [close]
  )

  useMount(() => {
    window.addEventListener('click', closeOnBlur, { passive: false })
  })

  useUnmount(() => {
    window.removeEventListener('click', closeOnBlur)
  })

  return (
    <AnimatePresence>
      {show && (
        <StyledDropdownMenu
          className="dropdownMenu"
          ref={menuRef}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={slideInDown}
          aria-labelledby={id}
        >
          <ul className="menuList" role="menu">
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

                    {selected && <SvgIcon icon="check" $size={16} />}
                  </button>
                </li>
              )
            })}
          </ul>
        </StyledDropdownMenu>
      )}
    </AnimatePresence>
  )
}

export default DropdownMenu
