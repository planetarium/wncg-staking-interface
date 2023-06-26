import { memo, useMemo } from 'react'

import { bnum } from 'utils/bnum'
import { dexPoolUrlFor } from 'utils/dexPoolUrlFor'
import { useChain, useFiat, useStaking } from 'hooks'
import { useFetchPool } from 'hooks/queries'

import { StyledPancakeSwapPoolInformation } from './styled'
import Icon from 'components/Icon'
import NumberFormat from 'components/NumberFormat'

function PancakeSwapPoolInformation() {
  const { chainId } = useChain()
  const toFiat = useFiat()
  const { poolTokenAddresses, poolReserves: initPoolReserves } = useStaking()

  const { poolReserves = initPoolReserves } = useFetchPool().data ?? {}

  const totalPoolValue = useMemo(
    () =>
      poolReserves
        .reduce(
          (acc, amt, i) => acc.plus(toFiat(amt, poolTokenAddresses[i])),
          bnum(0)
        )
        .toString(),
    [poolReserves, poolTokenAddresses, toFiat]
  )

  return (
    <StyledPancakeSwapPoolInformation className="poolInformation">
      <header className="header">
        <h3 className="title">Pool information</h3>
        <a
          className="link"
          href={dexPoolUrlFor(chainId)}
          target="_blank"
          rel="noopener"
        >
          detail
          <Icon icon="outlink" />
        </a>
      </header>

      <dl className="detailList">
        <div className="detailItem">
          <dt>Pool value</dt>
          <dd>
            <NumberFormat value={totalPoolValue} type="fiat" />
          </dd>
        </div>
      </dl>
    </StyledPancakeSwapPoolInformation>
  )
}

export default memo(PancakeSwapPoolInformation)
