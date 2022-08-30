import { memo, useMemo } from 'react'
import NumberFormat from 'react-number-format'
import { useRecoilValue } from 'recoil'
import styles from './style.module.scss'

import { invalidPriceState } from 'app/states/error'
import { configService } from 'services/config'
import { bnum, isLessThanMinAmount } from 'utils/num'
import { getTokenInfo } from 'utils/token'
import { usePoolService, useUsd } from 'hooks'

import { TokenIcon } from 'components/TokenIcon'

type JoinPreviewCompositionProps = {
  amounts: string[]
  isNativeAsset: boolean
  totalUsdValue: string
}

function JoinPreviewComposition({
  amounts,
  isNativeAsset,
  totalUsdValue,
}: JoinPreviewCompositionProps) {
  const { poolTokenAddresses, nativeAssetIndex } = usePoolService()
  const { getFiatValue } = useUsd()

  const invalidPrice = useRecoilValue(invalidPriceState)

  const usdValues = amounts.map((amount, i) =>
    getFiatValue(poolTokenAddresses[i], amount)
  )

  const tokenRatios = useMemo(() => {
    const lastIndex = usdValues.length - 1
    const ratios = usdValues.map((value, i) => {
      if (i === lastIndex) return '0'
      return bnum(value).div(totalUsdValue).times(100).toFixed(2)
    })
    const pcntSum = ratios.reduce((total, pcnt) => {
      return bnum(total).plus(pcnt)
    }, bnum(0))
    ratios[lastIndex] = bnum(100).minus(pcntSum).toFixed(2)
    return ratios
  }, [totalUsdValue, usdValues])

  return (
    <dl className={styles.details}>
      {poolTokenAddresses.map((address, i) => {
        let { symbol } = getTokenInfo(address)
        if (i === nativeAssetIndex && isNativeAsset) {
          symbol = configService.nativeAsset.symbol
        }

        const amount = amounts[i]
        const usdValue = usdValues[i]
        let pcnt = tokenRatios[i]
        if (bnum(pcnt).isZero()) pcnt = '0'

        return (
          <div className={styles.detailItem} key={`JoinPreview.${symbol}`}>
            <dt>
              <TokenIcon className={styles.token} symbol={symbol} />
              <strong className={styles.symbol}>{symbol}</strong>
              {!invalidPrice && (
                <span className={styles.percent}>({pcnt}%)</span>
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

export default memo(JoinPreviewComposition)
