import { memo, useMemo } from 'react'
import NumberFormat from 'react-number-format'
import { useRecoilValue } from 'recoil'
import clsx from 'clsx'
import styles from './style.module.scss'

import { poolTokenSymbolsState } from 'app/states/pool'
import Decimal from 'utils/num'
import { useUsd } from 'hooks'

import { TokenIcon } from 'components/TokenIcon'

type InvestCompositionProps = {
  amounts: string[]
  currentEthType: EthType
  totalUsdValue: string
}

function InvestComposition({
  amounts,
  currentEthType,
  totalUsdValue,
}: InvestCompositionProps) {
  const { calculateUsdValue } = useUsd()

  const poolTokenSymbols = useRecoilValue(poolTokenSymbolsState)
  const usdValues = amounts.map((amount, i) =>
    calculateUsdValue(poolTokenSymbols[i], amount)
  )

  const tokenRatio = useMemo(
    () =>
      usdValues.map((_, i) => {
        const wncgPcnt = new Decimal(usdValues[0])
          .div(totalUsdValue)
          .mul(100)
          .toFixed(2)
        if (i === 0) return wncgPcnt
        return new Decimal(100).minus(wncgPcnt).toString()
      }),
    [totalUsdValue, usdValues]
  )

  const reverse = new Decimal(usdValues[1]).gt(usdValues[0])

  return (
    <dl className={clsx(styles.details, { [styles.reverse]: reverse })}>
      {poolTokenSymbols.map((tokenSymbol, i) => {
        let symbol = tokenSymbol === 'wbtc' ? 'wncg' : tokenSymbol
        if (symbol === 'weth' && currentEthType === 'eth') symbol = 'eth'

        const amount = amounts[i]
        const usdValue = usdValues[i]
        const pcnt = tokenRatio[i]

        const tokenAmount = new Decimal(amount)
        const isAmountLessThanMinAmount =
          !tokenAmount.isZero() && tokenAmount.lt(0.0001)

        return (
          <div
            className={styles.detailItem}
            key={`investPreview.${tokenSymbol}`}
          >
            <dt>
              <TokenIcon className={styles.token} symbol={tokenSymbol} />
              <strong className={styles.symbol}>{symbol}</strong>
            </dt>
            <dd>
              {isAmountLessThanMinAmount ? (
                '< 0.0001'
              ) : (
                <NumberFormat
                  value={amount}
                  displayType="text"
                  thousandSeparator
                  decimalScale={4}
                />
              )}
              <NumberFormat
                className={styles.usd}
                value={usdValue}
                displayType="text"
                thousandSeparator
                decimalScale={2}
                prefix="$"
              />
              ({pcnt}%)
            </dd>
          </div>
        )
      })}
    </dl>
  )
}

export default memo(InvestComposition)
