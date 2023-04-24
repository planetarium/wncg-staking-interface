import { memo } from 'react'

import { useStaking } from 'hooks'

import { StyledPoolBalances } from './styled'
import Suspense from 'components/Suspense'
import TokenIcon from 'components/TokenIcon'
import Content from './Content'

function PoolBalances() {
  const { bptName, poolTokenAddresses } = useStaking()

  return (
    <StyledPoolBalances layout>
      <div className="balancesHeader">
        <div className="token">
          {poolTokenAddresses?.map((addr) => (
            <TokenIcon
              key={`pool:balances:${addr}`}
              address={addr}
              $size={48}
            />
          ))}
        </div>

        <h2 className="title">{bptName}</h2>
      </div>

      <Suspense>
        <Content />
      </Suspense>
    </StyledPoolBalances>
  )
}

export default memo(PoolBalances)
