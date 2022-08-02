import {
  MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import clsx from 'clsx'
import styles from '../styles/TokenInput.module.scss'

import type { TokenDropdownSymbol } from '../constants'

import { Button } from 'components/Button'
import { Icon } from 'components/Icon'
import { TokenIcon } from 'components/TokenIcon'

type TokenDropdownProps = {
  currentToken: TokenDropdownSymbol
  id: string
  selectToken?(value: TokenDropdownSymbol): void
  tokenList: TokenDropdownSymbol[]
}

export function TokenDropdown({
  currentToken,
  id,
  selectToken,
  tokenList,
}: TokenDropdownProps) {
  const [show, setShow] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const hasList = !!tokenList.length && !!selectToken

  function handleClick(e: ReactMouseEvent) {
    if (!hasList) return
    const { value } = e.currentTarget as HTMLButtonElement
    selectToken(value as TokenDropdownSymbol)
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
  }, [])

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
        {renderTokenIcon(currentToken)}
        {renderTokenLabel(currentToken)}
        {hasList && <Icon className={styles.caret} id="caret" ariaHidden />}
      </Button>

      {hasList && (
        <ul className={styles.dropdownMenu}>
          {tokenList.map((token) => {
            const isSelected = currentToken === token
            return (
              <li
                key={`${token}.${id}`}
                className={clsx({ [styles.selected]: isSelected })}
              >
                <button type="button" value={token} onClick={handleClick}>
                  {renderTokenIcon(token)}
                  {renderTokenLabel(token)}
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

function renderTokenIcon(symbol: TokenDropdownSymbol) {
  if (symbol === 'all') {
    return (
      <div className={styles.tokenGroup}>
        <TokenIcon className={styles.token} symbol="wncg" />
        <TokenIcon className={styles.token} symbol="weth" />
        <TokenIcon className={styles.token} symbol="eth" />
      </div>
    )
  }
  return <TokenIcon className={styles.token} symbol={symbol} />
}

function renderTokenLabel(symbol: TokenDropdownSymbol) {
  const labelText = symbol === 'all' ? 'All tokens' : symbol.toUpperCase()
  return <span className={styles.label}>{labelText}</span>
}
