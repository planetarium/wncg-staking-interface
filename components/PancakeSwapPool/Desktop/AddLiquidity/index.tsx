import { memo } from 'react'
import dynamic from 'next/dynamic'

import { useStaking } from 'hooks'

import { StyledPoolJoin } from './styled'
import SlippageControl from 'components/SlippageControl'
import Suspense from 'components/Suspense'
import TokenIcon from 'components/TokenIcon'

const Form = dynamic(() => import('./Form'), {
  suspense: true,
})

function PancakeSwapAddLiquidity() {
  const { lpToken } = useStaking()

  return (
    <StyledPoolJoin>
      <header className="header">
        <h2 className="title">
          <div className="token">
            <TokenIcon address={lpToken.address} $size={28} />
          </div>
          Join pool
        </h2>

        <SlippageControl />
      </header>

      <Suspense>
        <Form />
      </Suspense>
    </StyledPoolJoin>
  )
}

export default memo(PancakeSwapAddLiquidity)
