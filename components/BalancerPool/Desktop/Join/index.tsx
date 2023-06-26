import { memo } from 'react'

import { StyledPoolJoin } from './styled'
import Form from './Form'

function BalancerPoolJoin() {
  return (
    <StyledPoolJoin className="poolJoin">
      <Form />
    </StyledPoolJoin>
  )
}

export default memo(BalancerPoolJoin)
