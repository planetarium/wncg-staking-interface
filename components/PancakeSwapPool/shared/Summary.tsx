import { useMemo } from 'react'
import { useDebounce } from 'use-debounce'

import { bnum } from 'utils/bnum'
import { useAuth, useFiat, useStaking } from 'hooks'
import { useFetchPool } from 'hooks/queries'

import { StyledAddLiquidityFormSummary } from './styled'
import NumberFormat from 'components/NumberFormat'

type AddLiquidityFormSummaryProps = {
  active: boolean
  amountsInFiatValueSum: string
}

export default function AddLiquidityFormSummary({
  active,
  amountsInFiatValueSum,
}: AddLiquidityFormSummaryProps) {
  const { isConnected } = useAuth()
  const toFiat = useFiat()
  const {
    lpToken: initLpToken,
    poolTokens,
    poolReserves: initPoolReserves,
  } = useStaking()

  const { lpToken = initLpToken, poolReserves = initPoolReserves } =
    useFetchPool().data ?? {}

  const relativePrice = useMemo(() => {
    return poolTokens.map((t, i) => {
      const currentTokenPrice = toFiat(1, t.address)
      const subjectTokenPrice = toFiat(1, poolTokens[1 - i].address)

      return bnum(currentTokenPrice).div(subjectTokenPrice).toString()
    })
  }, [poolTokens, toFiat])

  const share = useMemo(() => {
    const currentPoolValue = poolReserves
      .reduce(
        (acc, amt, i) => acc.plus(toFiat(amt, poolTokens[i]?.address)),
        bnum(0)
      )
      .toString()

    return bnum(amountsInFiatValueSum)
      .div(bnum(currentPoolValue).plus(amountsInFiatValueSum))
      .times(100)
      .toString()
  }, [amountsInFiatValueSum, poolReserves, poolTokens, toFiat])

  const [debouncedShare] = useDebounce(share, 500)

  const disabled = !isConnected

  return (
    <StyledAddLiquidityFormSummary $active={active} $disabled={disabled}>
      <h4 className="title">Prices and pool share</h4>

      <dl className="summaryList">
        {poolTokens.map((t, i) => {
          const { address, symbol } = t

          return (
            <div className="summaryItem" key={`joinFormSummary:${address}`}>
              <dt>
                <NumberFormat value={1} symbol={symbol} decimals={0} />
              </dt>

              <dd>
                <NumberFormat
                  className="tokenPrice"
                  equals
                  value={relativePrice[i]}
                  decimals={8}
                  symbol={poolTokens[1 - i].symbol}
                />
                <NumberFormat
                  className="fiatPrice"
                  value={toFiat(1, address)}
                  type="fiat"
                  decimals={8}
                />
              </dd>
            </div>
          )
        })}

        <div className="summaryItem">
          <dt>Share of pool</dt>
          <dd>
            <NumberFormat
              className="percent"
              value={debouncedShare}
              type="percent"
            />
          </dd>
        </div>
      </dl>
    </StyledAddLiquidityFormSummary>
  )
}
