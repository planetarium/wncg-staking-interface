import { bnum } from 'utils/bnum'
import { useFiat, useStaking } from 'hooks'

import { StyledExitModalPage1Step2PropAmounts } from './styled'
import CountUp from 'components/CountUp'
import TokenIcon from 'components/TokenIcon'

type ExitModalPage1Step2PropAmountsProps = {
  expectedAmountsOut: string[]
}

function ExitModalPage1Step2PropAmounts({
  expectedAmountsOut,
}: ExitModalPage1Step2PropAmountsProps) {
  const toFiat = useFiat()
  const {
    poolTokenAddresses,
    poolTokenWeights,
    shouldReversePoolTokenOrderOnDisplay,
    tokens,
  } = useStaking()

  return (
    <StyledExitModalPage1Step2PropAmounts
      $reverse={shouldReversePoolTokenOrderOnDisplay}
    >
      <h5 className="title">You will receive</h5>

      <div className="propAmount">
        <dl className="detailList">
          {expectedAmountsOut.map((amt, i) => {
            const address = poolTokenAddresses[i]
            const weight = bnum(poolTokenWeights[i]).times(100).toNumber()
            const symbol = tokens[address]?.symbol ?? ''

            if (!address || !weight) return null

            const fiatValue = toFiat(amt, address)

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
                      value={fiatValue}
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

export default ExitModalPage1Step2PropAmounts
