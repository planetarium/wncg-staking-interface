import styles from '../styles/Dropdown.module.scss'

import { getTokenSymbol } from 'utils/token'

import { TokenIcon } from 'components/TokenIcon'

export function renderTokenIcon(token: string, tokenList: string[]) {
  if (token === 'all') {
    return (
      <>
        <div className={styles.tokenGroup}>
          {tokenList.map((item) => {
            if (item === 'all') return null
            const symbol = getTokenSymbol(item)

            return (
              <TokenIcon
                key={`tokenInputDropdown.${symbol}`}
                className={styles.token}
                symbol={symbol}
              />
            )
          })}
        </div>
        <span className={styles.label}>All tokens</span>
      </>
    )
  }

  const symbol = getTokenSymbol(token)

  return (
    <>
      <TokenIcon className={styles.token} symbol={symbol} />
      <span className={styles.label}>{symbol.toUpperCase()}</span>
    </>
  )
}
