import { memo } from 'react'
import { AnimatePresence } from 'framer-motion'

import { useAccount } from 'hooks'

import { StyledPoolForm } from './styled'

function PoolForm() {
  const { isConnected } = useAccount()

  return (
    <AnimatePresence>
      {isConnected && (
        <StyledPoolForm className="poolForm">Pool form</StyledPoolForm>
      )}
    </AnimatePresence>
  )
}

export default memo(PoolForm)
