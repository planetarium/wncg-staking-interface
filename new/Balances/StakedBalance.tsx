import { memo, useMemo } from 'react'
import type { PropsWithChildren } from 'react'
import clsx from 'clsx'

import { renderStrong } from 'utils/numberFormat'
import { useFiatCurrency, useStakedBalance } from 'hooks'

import { StyledStakedBalance } from './styled'
import NumberFormat from 'new/NumberFormat'
import SvgIcon from 'new/SvgIcon'

type StakedBalanceProps = {
  className?: string
} & PropsWithChildren

function StakedBalance({ className, children }: StakedBalanceProps) {
  const { getBptFiatValue } = useFiatCurrency()
  const { hasStakedBalance, stakedBalance } = useStakedBalance()

  const fiatValue = useMemo(
    () => getBptFiatValue(stakedBalance),
    [getBptFiatValue, stakedBalance]
  )

  return (
    <StyledStakedBalance className={clsx('stakedBalance', className)}>
      <header className="header">
        <h2 className="title">My Staked LP</h2>

        <dl className="detail">
          <div className="detailItem">
            <dt className="hidden">Your balance</dt>
            <dd>
              <NumberFormat
                className="value"
                value={stakedBalance}
                renderText={renderStrong}
              />
            </dd>
          </div>

          {hasStakedBalance && (
            <div className="detailItem">
              <dt className="hidden">Your balance in USD</dt>
              <dd className="fiatValue">
                <SvgIcon icon="approximate" $size={16} />
                <NumberFormat
                  value={fiatValue}
                  decimals={2}
                  prefix="$"
                  renderText={renderStrong}
                />
              </dd>
            </div>
          )}
        </dl>
      </header>

      {children}
    </StyledStakedBalance>
  )
}

export default memo(StakedBalance)
