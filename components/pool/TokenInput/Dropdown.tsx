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
  tokenList: TokenDropdownSymbol[]
  selectToken?(value: TokenDropdownSymbol): void
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
    const { value } = e.currentTarget as HTMLButtonElement & {
      value: TokenDropdownSymbol
    }
    selectToken(value)
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
        {renderTokenIcon(currentToken, tokenList)}
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

function renderTokenIcon(
  symbol: TokenDropdownSymbol,
  poolTokenSymbols: string[]
) {
  if (symbol === 'all') {
    return (
      <>
        <div className={styles.tokenGroup}>
          {poolTokenSymbols.map((symbol) => (
            <TokenIcon
              key={`tokenInputDropdown.${symbol}`}
              className={styles.token}
              symbol={symbol}
            />
          ))}
        </div>
        <span className={styles.label}>All tokens</span>
      </>
    )
  }
  return (
    <>
      <TokenIcon className={styles.token} symbol={symbol} />
      <span className={styles.label}>{symbol.toUpperCase()}</span>
    </>
  )
}
