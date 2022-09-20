import { memo, MouseEvent } from 'react'
import clsx from 'clsx'
import styles from '../styles/Widget.module.scss'

import { countUpOption, usdCountUpOption } from 'constants/countUp'
import { gaEvent } from 'lib/gtag'
import { getTokenInfo } from 'utils/token'
import { useFiatCurrency } from 'hooks'

import { CountUp } from 'components/CountUp'

type MyWalletItemProps = {
  address: string
  balance: string
  isSelected?: boolean
  select?(e: MouseEvent<HTMLDivElement>): void
}

function MyWalletItem({
  address,
  balance,
  isSelected,
  select,
}: MyWalletItemProps) {
  const { toFiat } = useFiatCurrency()
  const fiatValue = toFiat(address, balance)

  const { symbol, name } = getTokenInfo(address)
  const isSelectable = !!select

  function handleSelect(e: MouseEvent<HTMLDivElement>) {
    if (!select) return
    select(e)
    gaEvent({
      name: `select_ether`,
      params: {
        ether: symbol.toLowerCase(),
      },
    })
  }

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
        <CountUp {...countUpOption} end={balance} />
        <CountUp {...usdCountUpOption} end={fiatValue} isApproximate />
      </dd>
    </div>
  )
}

export default memo(MyWalletItem)
