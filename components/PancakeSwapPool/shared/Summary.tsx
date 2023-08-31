import { useMemo } from 'react'
import { useDebounce } from 'use-debounce'

import { bnum } from 'utils/bnum'
import { useAuth, useFiat, useStaking } from 'hooks'
import { useFetchStaking } from 'hooks/queries'

import { StyledAddLiquidityFormSummary } from './styled'
import NumberFormat from 'components/NumberFormat'

type AddLiquidityFormSummaryProps = {
  active: boolean
  assets: Hash[]
  amountsInFiatValueSum: string
}

export default function AddLiquidityFormSummary({
  active,
  assets,
  amountsInFiatValueSum,
}: AddLiquidityFormSummaryProps) {
  const { isConnected } = useAuth()
  const toFiat = useFiat()
  const { tokens, poolTokenBalances: initPoolTokenBalances } = useStaking()

  const { poolTokenBalances = initPoolTokenBalances } =
    useFetchStaking({ refetchInterval: 30 * 1_000 }).data ?? {}

  const relativePrice = useMemo(() => {
    return assets.map((addr, i) => {
      const currentTokenPrice = toFiat(1, addr)
      const subjectTokenPrice = toFiat(1, assets[1 - i])

      return bnum(currentTokenPrice).div(subjectTokenPrice).toString()
    })
  }, [assets, toFiat])

  const share = useMemo(() => {
    const currentPoolValue = poolTokenBalances.reduce(
      (acc, amt, i) => acc.plus(toFiat(amt, assets[i])),
      bnum(0)
    )
    const expectedPoolValue = currentPoolValue.plus(amountsInFiatValueSum)

    return bnum(amountsInFiatValueSum)
      .div(expectedPoolValue.toString())
      .times(100)
      .toString()
  }, [amountsInFiatValueSum, assets, poolTokenBalances, toFiat])

  const [debouncedShare] = useDebounce(share, 500)

  const disabled = !isConnected

  return (
    <StyledAddLiquidityFormSummary $active={active} $disabled={disabled}>
      <h4 className="title">Prices and pool share</h4>

      <dl className="summaryList">
        {assets.map((addr, i) => {
          const token = tokens?.[addr] ?? {}
          const subjectToken = tokens?.[assets[1 - i]] ?? {}
          const { address, symbol } = token

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
                  symbol={subjectToken.symbol}
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
