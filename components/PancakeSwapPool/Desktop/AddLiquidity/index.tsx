import dynamic from 'next/dynamic'

import { StyledPancakeSwapAddLiquidity } from './styled'
import Suspense from 'components/Suspense'

const Form = dynamic(() => import('./Form'), {
  ssr: false,
})

function PancakeSwapAddLiquidity() {
  return (
    <StyledPancakeSwapAddLiquidity>
      <Suspense>
        <Form />
      </Suspense>
    </StyledPancakeSwapAddLiquidity>
  )
}

export default PancakeSwapAddLiquidity
