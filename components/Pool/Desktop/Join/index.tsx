import { memo } from 'react'

import { useAuth } from 'hooks'

import { StyledPoolJoin } from './styled'
import Connect from './Connect'
import Form from './Form'

function PoolJoin() {
  const { isConnected } = useAuth()

  return (
    <StyledPoolJoin className="poolJoin">
      {!isConnected && <Connect />}
      {!!isConnected && <Form />}
    </StyledPoolJoin>
  )
}

export default memo(PoolJoin)
