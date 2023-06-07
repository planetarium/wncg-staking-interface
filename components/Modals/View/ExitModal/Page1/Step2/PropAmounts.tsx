import { memo, useMemo } from 'react'

import { bnum } from 'utils/bnum'
import { useFiat, useStaking } from 'hooks'

import { StyledExitModalPage1Step2PropAmounts } from './styled'
import CountUp from 'components/CountUp'
import TokenIcon from 'components/TokenIcon'

type ExitModalPage1Step2PropAmountsProps = {
  assets: Hash[]
  exitAmounts: string[]
}

function ExitModalPage1Step2PropAmounts({
  assets,
  exitAmounts,
}: ExitModalPage1Step2PropAmountsProps) {
  const toFiat = useFiat()
  const {
    poolTokenAddresses,
    poolTokenWeights,
    shouldReversePoolTokenOrderOnDisplay,
    tokenMap,
  } = useStaking()

  const exitAmountsInFiatValue = useMemo(
    () => exitAmounts.map((amt, i) => toFiat(amt, assets[i])),
    [assets, exitAmounts, toFiat]
  )

  return (
    <StyledExitModalPage1Step2PropAmounts
      $reverse={shouldReversePoolTokenOrderOnDisplay}
    >
      <h5 className="title">You will receive</h5>

      <div className="propAmount">
        <dl className="detailList">
          {exitAmounts.map((amt, i) => {
            const address = poolTokenAddresses[i]
            const weight = bnum(poolTokenWeights[i]).times(100).toNumber()
            const { symbol } = tokenMap[address]

            if (!address || !weight) return null

            return (
              <div className="detailItem" key={`exitPropAmounts:${symbol}`}>
                <dt>
                  <TokenIcon address={address as Hash} />
                  <strong className="symbol">{symbol}</strong>
                  <span className="parenthesis">{weight}%</span>
                </dt>

                <dd>
                  <CountUp className="amount" value={amt} duration={0.5} />
                  <div className="fiatValue">
                    <CountUp
                      className="fiatValue"
                      value={exitAmountsInFiatValue[i]}
                      type="fiat"
                    />
                  </div>
                </dd>
              </div>
            )
          })}
        </dl>
      </div>
    </StyledExitModalPage1Step2PropAmounts>
  )
}

export default memo(ExitModalPage1Step2PropAmounts)
