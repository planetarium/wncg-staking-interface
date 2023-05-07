import { memo } from 'react'

import { StyledPoolJoin } from './styled'
import Form from './Form'

function PoolJoin() {
  return (
    <StyledPoolJoin className="poolJoin">
      <Form />
    </StyledPoolJoin>
  )
}

export default memo(PoolJoin)
