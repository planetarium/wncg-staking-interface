import { memo } from 'react'

import { StyledPoolJoin } from './styled'
import Connect from './Connect'
import Form from './Form'

function PoolJoin() {
  return (
    <StyledPoolJoin className="poolJoin">
      <Connect />
      <Form />
    </StyledPoolJoin>
  )
}

export default memo(PoolJoin)
