import { memo } from 'react'
import clsx from 'clsx'

import { REKT_PRICE_IMPACT } from 'constants/poolLiquidity'

import { StyledJoinFormSummary } from './styled'
import NumberFormat from 'new/NumberFormat'

type JoinFormSummaryProps = {
  totalValue: string
  priceImpact: number
}

function JoinFormSummary({ totalValue, priceImpact }: JoinFormSummaryProps) {
  const priceImpactPcnt = (priceImpact * 100).toFixed(2)

  const alert = priceImpact >= REKT_PRICE_IMPACT

  return (
    <StyledJoinFormSummary className="joinFormSummary">
      <div className="summaryItem">
        <dt>Total</dt>
        <dd>
          <NumberFormat value={totalValue} decimals={2} prefix="$" />
        </dd>
      </div>

      <div className="summaryItem">
        <dt>Price impact</dt>
        <dd className={clsx({ alert })}>{priceImpactPcnt}%</dd>
      </div>
    </StyledJoinFormSummary>
  )
}

export default memo(JoinFormSummary)
