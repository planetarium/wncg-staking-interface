import styles from '../styles/TokenInput.module.scss'

import { getTokenInfo } from 'utils/token'

import { TokenIcon } from 'components/TokenIcon'

export function renderTokenIcon(token: string, tokenList: string[]) {
  if (token === 'all') {
    return (
      <>
        <div className={styles.tokenGroup}>
          {tokenList.map((symbol) => (
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

  const { symbol } = getTokenInfo(token)

  return (
    <>
      <TokenIcon className={styles.token} symbol={symbol} />
      <span className={styles.label}>{symbol.toUpperCase()}</span>
    </>
  )
}
