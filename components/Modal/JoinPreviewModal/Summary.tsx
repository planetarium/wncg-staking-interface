import { memo } from 'react'
import NumberFormat from 'react-number-format'
import clsx from 'clsx'
import styles from './style.module.scss'

import { bnum } from 'utils/num'

import { Icon } from 'components/Icon'

type JoinPreviewSummaryProps = {
  priceImpact: number
  totalUsdValue: string
}

function JoinPreviewSummary({
  priceImpact,
  totalUsdValue,
}: JoinPreviewSummaryProps) {
  const priceImpactPcnt = (priceImpact * 100).toFixed(2)
  const bPriceImpactPcnt = bnum(priceImpactPcnt)

  const lowPriceImpact = bPriceImpactPcnt.lt(0.01)
  const highPriceImpact = bPriceImpactPcnt.gt(1)

  return (
    <dl className={styles.summary}>
      <div>
        <dt>Total</dt>
        <dd>
          <strong>
            <NumberFormat
              value={totalUsdValue}
              displayType="text"
              decimalScale={2}
              thousandSeparator
              prefix="$"
            />
          </strong>
        </dd>
      </div>

      <div className={clsx({ [styles.warning]: highPriceImpact })}>
        <dt>Price Impact</dt>
        <dd>
          {lowPriceImpact ? '< 0.01%' : `${priceImpactPcnt}%`}
          {highPriceImpact && <Icon id="alert" ariaHidden />}
        </dd>
      </div>
    </dl>
  )
}

export default memo(JoinPreviewSummary)
