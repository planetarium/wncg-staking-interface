import { memo } from 'react'

import Connect from './Connect'
import Form from './Form'

function PoolJoin() {
  return (
    <div className="poolJoin">
      <Connect />
      <Form />
    </div>
  )
}

export default memo(PoolJoin)
