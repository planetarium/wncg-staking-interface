import { useMemo } from 'react'
import { useAtomValue } from 'jotai'
import { useDebounce } from 'use-debounce'

import { priceMapAtom } from 'states/system'
import { bnum } from 'utils/bnum'
import { useAuth, useFiat, useStaking } from 'hooks'

import { StyledAddLiquidityFormSummary } from './styled'
import NumberFormat from 'components/NumberFormat'
import { useFetchPool } from 'hooks/queries'

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
  const { lpToken: initLpToken, poolTokens } = useStaking()

  const { lpToken = initLpToken } = useFetchPool().data ?? {}

  const priceMap = useAtomValue(priceMapAtom)

  const relativePrice = useMemo(() => {
    return poolTokens.map((t, i) => {
      const currentTokenPrice = priceMap[t.address]
      const subjectTokenPrice = priceMap[poolTokens[1 - i].address] as string
      return bnum(currentTokenPrice).div(subjectTokenPrice).toString()
    })
  }, [poolTokens, priceMap])

  const share = useMemo(() => {
    const currentPoolValue = toFiat(lpToken.totalSupply, lpToken.address)

    return bnum(amountsInFiatValueSum)
      .div(bnum(currentPoolValue).plus(amountsInFiatValueSum))
      .times(100)
      .toString()
  }, [toFiat, lpToken.totalSupply, lpToken.address, amountsInFiatValueSum])

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
                  value={priceMap[address]}
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
