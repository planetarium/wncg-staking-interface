import {
  MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import clsx from 'clsx'
import styles from '../styles/TokenInput.module.scss'

import { renderTokenIcon } from './utils'

import { Button } from 'components/Button'
import { Icon } from 'components/Icon'

type TokenDropdownProps = {
  id: string
  selectedToken: string
  tokenList: string[]
  selectToken?(value: string): void
}

export function TokenDropdown({
  id,
  selectedToken,
  tokenList,
  selectToken,
}: TokenDropdownProps) {
  const [show, setShow] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const hasList = !!tokenList.length && !!selectToken

  function handleClick(e: ReactMouseEvent) {
    if (!hasList) return
    selectToken((e.currentTarget as HTMLButtonElement).value)
    setShow(false)
  }

  function toggle(e: ReactMouseEvent) {
    if (!hasList) return
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
      className={clsx(styles.tokenDropdown, { [styles.show]: show })}
      ref={dropdownRef}
    >
      <Button
        className={styles.dropdownToggle}
        variant="secondary"
        type="button"
        onClick={toggle}
        disabled={!hasList}
      >
        {renderTokenIcon(selectedToken, tokenList)}
        {hasList && <Icon className={styles.caret} id="caret" ariaHidden />}
      </Button>

      {hasList && (
        <ul className={styles.dropdownMenu}>
          {tokenList.map((token) => {
            const isSelected = token === selectedToken

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
      )}
    </div>
  )
}
