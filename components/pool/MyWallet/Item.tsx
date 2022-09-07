import { memo, MouseEvent } from 'react'

import clsx from 'clsx'
import styles from '../styles/Widget.module.scss'

import { countUpOption, usdCountUpOption } from 'utils/countUp'
import { isLessThanMinAmount } from 'utils/num'
import { getTokenInfo } from 'utils/token'
import { useFiatCurrency } from 'hooks'

import { CountUp } from 'components/CountUp'

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
          <CountUp {...countUpOption} decimals={4} end={balance} />
        )}
        <CountUp {...usdCountUpOption} end={fiatValue} isApproximate />
      </dd>
    </div>
  )
}

export default memo(MyWalletItem)
