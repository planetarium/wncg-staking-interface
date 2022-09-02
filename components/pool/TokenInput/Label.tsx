import styles from '../styles/TokenInput.module.scss'

import { getTokenSymbol } from 'utils/token'

import { TokenIcon } from 'components/TokenIcon'

type TokenLabelProps = {
  address: string
}

export function TokenLabel({ address }: TokenLabelProps) {
  const symbol = getTokenSymbol(address)
  if (!symbol) return null

  return (
    <div className={styles.tokenLabel}>
      <strong className={styles.label}>
        <TokenIcon className={styles.token} symbol={symbol} />
        <span>{symbol.toUpperCase()}</span>
      </strong>
    </div>
  )
}
