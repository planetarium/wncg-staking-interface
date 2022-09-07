import { memo, useMemo } from 'react'
import NumberFormat from 'react-number-format'
import { useRecoilValue } from 'recoil'
import styles from './style.module.scss'

import { invalidPriceState } from 'app/states/error'
import { configService } from 'services/config'
import { bnum, isLessThanMinAmount } from 'utils/num'
import { getTokenInfo } from 'utils/token'
import { usePool, useFiatCurrency } from 'hooks'

import { TokenIcon } from 'components/TokenIcon'

type PreviewCompositionProps = {
  action: PoolAction
  amounts: string[]
  isNativeAsset: boolean
  totalFiatValue: string
}

function PreviewComposition({
  action,
  amounts,
  isNativeAsset,
  totalFiatValue,
}: PreviewCompositionProps) {
  const { toFiat } = useFiatCurrency()
  const { poolTokenAddresses, nativeAssetIndex } = usePool()

  const invalidPrice = useRecoilValue(invalidPriceState)

  const usdValues = amounts.map((amount, i) =>
    toFiat(poolTokenAddresses[i], amount)
  )

  const tokenRatios = useMemo(() => {
    const lastIndex = usdValues.length - 1
    const ratios = usdValues.map((value, i) => {
      if (i === lastIndex) return '0'
      return bnum(value).div(totalFiatValue).times(100).toFixed(2)
    })
    const pcntSum = ratios.reduce((total, pcnt) => {
      return bnum(total).plus(pcnt)
    }, bnum(0))
    ratios[lastIndex] = bnum(100).minus(pcntSum).toFixed(2)
    return ratios
  }, [totalFiatValue, usdValues])

  return (
    <dl className={styles.details}>
      {poolTokenAddresses.map((address, i) => {
        let { symbol } = getTokenInfo(address)
        if (i === nativeAssetIndex && isNativeAsset) {
          symbol = configService.nativeAsset.symbol
        }
        const amount = amounts[i]

        if (action === 'exit' && bnum(amount).isZero()) return null

        const usdValue = usdValues[i]
        const pcnt = bnum(tokenRatios[i])

        let percent = tokenRatios[i]
        if (pcnt.isZero()) percent = '0'
        if (pcnt.eq(100)) percent = '100'
        if (pcnt.isNaN() || !pcnt.isFinite()) percent = ''

        return (
          <div className={styles.detailItem} key={`Preview.${symbol}`}>
            <dt>
              <TokenIcon className={styles.token} symbol={symbol} />
              <strong className={styles.symbol}>{symbol}</strong>
              {!invalidPrice && (
                <span className={styles.percent}>({percent}%)</span>
              )}
            </dt>
            <dd>
              {isLessThanMinAmount(amount) ? (
                <span title={amount}>&lt; 0.0001</span>
              ) : (
                <NumberFormat
                  value={amount}
                  displayType="text"
                  thousandSeparator
                  decimalScale={4}
                  title={amount}
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
            </dd>
          </div>
        )
      })}
    </dl>
  )
}

export default memo(PreviewComposition)
