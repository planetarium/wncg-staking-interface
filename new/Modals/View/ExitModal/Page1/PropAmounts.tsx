import { memo, Suspense, useMemo } from 'react'

import { bnum } from 'utils/num'
import { getTokenColor, getTokenSymbol } from 'utils/token'
import { useDebouncedValue, usePool, usePropAmounts } from 'hooks'

import { StyledExitModalPage1Step2PropAmounts } from './styled'
import CountUp from 'new/CountUp'
import SvgIcon from 'new/SvgIcon'
import TokenIcon from 'new/TokenIcon'

type ExitModalPage1Step2PropAmountsProps = {
  bptOutPcnt: number
}

function ExitModalPage1Step2PropAmounts({
  bptOutPcnt,
}: ExitModalPage1Step2PropAmountsProps) {
  const { poolTokenAddresses, poolTokenWeights } = usePool()
  const { propAmounts, propAmountsInFiatValue } = usePropAmounts()

  const debouncedBptOutPcnt = useDebouncedValue<number>(bptOutPcnt, 300)

  const exitAmounts = useMemo(
    () =>
      propAmounts.map((amount) =>
        bnum(amount).times(debouncedBptOutPcnt).div(100).toFixed(4)
      ),
    [debouncedBptOutPcnt, propAmounts]
  )

  const exitAmountsInFiatValue = useMemo(
    () =>
      propAmountsInFiatValue.map((amount) =>
        bnum(amount).times(debouncedBptOutPcnt).div(100).toFixed(4)
      ),
    [debouncedBptOutPcnt, propAmountsInFiatValue]
  )

  return (
    <Suspense fallback={`<div>loading...</div>`}>
      <StyledExitModalPage1Step2PropAmounts className="propAmounts">
        {exitAmounts.map((amount, i) => {
          const address = poolTokenAddresses[i]
          const weight = bnum(poolTokenWeights[i]).times(100).toNumber()
          const symbol = getTokenSymbol(address)
          const color = getTokenColor(address)

          if (!address || !weight) return null

          return (
            <div className="detailItem" key={`exitPropAmounts:${symbol}`}>
              <dt>
                <TokenIcon address={address} $size={32} />
                <strong className="symbol" style={{ color }}>
                  {symbol}
                </strong>
                <span className="pcnt">{weight}%</span>
              </dt>

              <dd>
                <CountUp
                  className="amount"
                  end={amount}
                  decimals={4}
                  duration={0.5}
                />
                <div className="fiatValue">
                  <SvgIcon icon="approximate" />
                  <CountUp
                    className="usdAmount"
                    end={exitAmountsInFiatValue[i]}
                    prefix="$"
                    decimals={2}
                    duration={0.5}
                  />
                </div>
              </dd>
            </div>
          )
        })}
      </StyledExitModalPage1Step2PropAmounts>
    </Suspense>
  )
}

export default memo(ExitModalPage1Step2PropAmounts)
