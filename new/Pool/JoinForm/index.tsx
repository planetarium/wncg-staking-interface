import { memo } from 'react'
import { AnimatePresence } from 'framer-motion'

import { useAccount } from 'hooks'

import Connect from './Connect'

function PoolJoinForm() {
  const { isConnected, isDisconnected } = useAccount()

  return (
    <div className="poolJoinForm">
      <AnimatePresence>{isDisconnected && <Connect />}</AnimatePresence>
    </div>
  )
}

export default memo(PoolJoinForm)
