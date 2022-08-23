import { memo } from 'react'
import NumberFormat from 'react-number-format'
import clsx from 'clsx'
import styles from '../styles/Form.module.scss'

import { bnum } from 'utils/num'

import { Icon } from 'components/Icon'

type InvestFormSummaryProps = {
  investMax(): void
  investOpt(): void
  maximized: boolean
  optimized: boolean
  maxOptDisabled: boolean
  priceImpact: number
  totalUsdValue: string
}

function InvestFormSummary({
  investMax,
  investOpt,
  maximized,
  optimized,
  maxOptDisabled,
  priceImpact,
  totalUsdValue,
}: InvestFormSummaryProps) {
  const priceImpactPcnt = (priceImpact * 100).toFixed(2)
  const bPriceImpactPcnt = bnum(priceImpactPcnt)

  const lowPriceImpact = !bPriceImpactPcnt.isZero() && bPriceImpactPcnt.lt(0.01)
  const highPriceImpact = bPriceImpactPcnt.gt(1)

  return (
    <dl className={styles.formSummary}>
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

          {!maxOptDisabled && (
            <>
              <button
                className={styles.maxButton}
                type="button"
                onClick={investMax}
                disabled={maximized}
              >
                {maximized ? 'Maxed' : 'Max'}
              </button>
              <button
                className={styles.optButton}
                type="button"
                onClick={investOpt}
                disabled={optimized}
              >
                {optimized ? 'Optimized' : 'Optimize'}
              </button>
            </>
          )}
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

export default memo(InvestFormSummary)
