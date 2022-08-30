import { memo, MouseEvent } from 'react'
import NumberFormat from 'react-number-format'
import clsx from 'clsx'
import styles from '../styles/Widget.module.scss'

import { isLessThanMinAmount } from 'utils/num'
import { getTokenInfo } from 'utils/token'
import { useFiatCurrency } from 'hooks'

type MyWalletItemProps = {
  address: string
  balance: string
  isSelected?: boolean
  handleSelect?(e: MouseEvent<HTMLDivElement>): void
}

function MyWalletItem({
  address,
  balance,
  isSelected,
  handleSelect,
}: MyWalletItemProps) {
  const { toFiat } = useFiatCurrency()
  const fiatValue = toFiat(address, balance)

  const { symbol, name } = getTokenInfo(address)
  const isSelectable = !!handleSelect

  return (
    <div
      className={clsx(styles.detailItem, {
        [styles.selected]: isSelectable && isSelected,
      })}
      onClick={handleSelect}
      role={isSelectable ? 'button' : undefined}
      data-current-ether={address}
    >
      <dt>
        <strong>{symbol.toUpperCase()}</strong>
        <span>{name}</span>
      </dt>
      <dd>
        {isLessThanMinAmount(balance) ? (
          <span title={balance}>&lt; 0.0001</span>
        ) : (
          <NumberFormat
            value={balance}
            displayType="text"
            thousandSeparator
            decimalScale={4}
            title={balance}
          />
        )}
        <NumberFormat
          className={styles.usd}
          value={fiatValue}
          displayType="text"
          thousandSeparator
          decimalScale={2}
          prefix="$"
        />
      </dd>
    </div>
  )
}

export default memo(MyWalletItem)
