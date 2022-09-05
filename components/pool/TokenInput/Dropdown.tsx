import {
  MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import clsx from 'clsx'
import styles from '../styles/Dropdown.module.scss'

import { renderTokenIcon } from './utils'

import { Button } from 'components/Button'
import { Icon } from 'components/Icon'

type TokenDropdownProps = {
  id: string
  list: string[]
  selected: string
  select(value: string): void
  className?: string
}

export function TokenDropdown({
  id,
  selected,
  list: tokenList,
  select,
  className,
}: TokenDropdownProps) {
  const [show, setShow] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  function handleClick(e: ReactMouseEvent) {
    select((e.currentTarget as HTMLButtonElement).value)
    setShow(false)
  }

  function toggle(e: ReactMouseEvent) {
    e.preventDefault()
    setShow((prev) => !prev)
  }

  const closeOnBlur = useCallback((e: MouseEvent) => {
    if (!dropdownRef.current?.contains(e.target as Node)) {
      setShow(false)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('click', closeOnBlur)
    return () => window.removeEventListener('click', closeOnBlur)
  }, [closeOnBlur])

  return (
    <div
      id={`${id}Dropdown`}
      className={clsx(styles.tokenDropdown, className, { [styles.show]: show })}
      ref={dropdownRef}
    >
      <Button
        className={styles.dropdownToggle}
        variant="secondary"
        type="button"
        onClick={toggle}
      >
        {renderTokenIcon(selected, tokenList)}
        <Icon className={styles.caret} id="caret" ariaHidden />
      </Button>

      <ul className={styles.dropdownMenu}>
        {tokenList.map((token) => {
          const isSelected = token === selected

          return (
            <li
              key={`${token}.${id}`}
              className={clsx({ [styles.selected]: isSelected })}
            >
              <button type="button" value={token} onClick={handleClick}>
                {renderTokenIcon(token, tokenList)}
                {isSelected && <Icon className={styles.check} id="check" />}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
