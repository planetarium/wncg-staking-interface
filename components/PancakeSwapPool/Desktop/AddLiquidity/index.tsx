import { memo } from 'react'
import dynamic from 'next/dynamic'

import { StyledPoolJoin } from './styled'
import Suspense from 'components/Suspense'

const Form = dynamic(() => import('./Form'), {
  suspense: true,
})

function PancakeSwapAddLiquidity() {
  return (
    <StyledPoolJoin>
      <Suspense>
        <Form />
      </Suspense>
    </StyledPoolJoin>
  )
}

export default memo(PancakeSwapAddLiquidity)
